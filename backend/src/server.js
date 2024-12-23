import express from 'express';
import cors from 'cors';
import { PostService } from './services/postService.js';
import multer from 'multer';
import { uploadFile } from './config/s3.js';
import path from 'path';
import { Buffer } from 'buffer';
import iconv from 'iconv-lite';
import { v4 as uuidv4 } from 'uuid';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const app = express();
const port = process.env.PORT || 3000;
const postService = new PostService();

// CORS 설정
const corsOptions = {
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://embed.diagrams.net', 
      'https://app.diagrams.net'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400
};

// 파일명 디코딩 함수
const decodeFileName = (filename) => {
    try {
        // 이미 디코딩된 상태인지 확인
        if (/^[\u0000-\u007f\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]*$/.test(filename)) {
            return filename;
        }

        // 여러 인코딩 시도
        const encodings = ['utf-8', 'euc-kr', 'cp949'];
        
        for (const encoding of encodings) {
            try {
                const decoded = iconv.decode(Buffer.from(filename, 'binary'), encoding);
                if (!/\ufffd/.test(decoded) && /^[\u0000-\u007f\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]*$/.test(decoded)) {
                    return decoded;
                }
            } catch (e) {
                continue;
            }
        }

        return Buffer.from(filename, 'binary').toString();
    } catch (error) {
        console.error('파일명 디코딩 실패:', error);
        return filename;
    }
};

// 파일명 정규화 함수
const normalizeFileName = (filename) => {
    try {
        const ext = path.extname(filename);
        let baseName = path.basename(filename, ext);

        // 허용되는 문자만 유지
        baseName = baseName.replace(/[^\w\sㄱ-ㅎㅏ-ㅣ가-힣.-_()\[\]]/g, '');
        baseName = baseName.trim().replace(/\s+/g, '_');
        
        const normalizedName = `${baseName}${ext}`;
        return normalizedName || `file-${Date.now()}${ext}`;
    } catch (error) {
        console.error('파일명 정규화 실패:', error);
        return `file-${Date.now()}${path.extname(filename)}`;
    }
};

// 기본 미들웨어
app.use(cors(corsOptions));
app.use(express.json());

// 요청 로깅 미들웨어
// 요청 로깅 및 CSP 헤더 설정 미들웨어
app.use((req, res, next) => {
    // 요청 로깅
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.log('Request Headers:', req.headers);

    // CSP 헤더 설정
    res.setHeader(
        'Content-Security-Policy',
        "frame-ancestors 'self' https://embed.diagrams.net https://app.diagrams.net"
    );

    next();
});

// Multer 설정
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB로 제한 증가
    },
    fileFilter: (req, file, cb) => {
        const decodedName = decodeFileName(file.originalname);
        const normalizedName = normalizeFileName(decodedName);
        
        console.log('파일명 처리:', {
            원본: file.originalname,
            디코딩: decodedName,
            정규화: normalizedName
        });
        
        file.originalname = normalizedName;
        cb(null, true);
    }
});

// API 라우터 설정
const apiRouter = express.Router();

// MIME 타입 설정
const mimeTypes = {
    image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'], // webp 추가
    pdf: ['application/pdf'],
    word: ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    text: ['text/plain', 'text/markdown', 'text/csv'] // 추가 텍스트 형식 지원
};

// 폴더 매핑
const folderMap = {
    image: 'images',
    pdf: 'documents/pdf',
    word: 'documents/word',
    text: 'documents/text'
};

// 파일 업로드 엔드포인트
apiRouter.post('/upload/:type', cors(corsOptions), upload.single('file'), async (req, res) => {
    const { type } = req.params;
    console.log(`[DEBUG] ${type.toUpperCase()} upload request received:`, req.file);
    
    try {
        if (!req.file) {
            return res.status(400).json({ error: '파일이 제공되지 않았습니다.' });
        }

        // 파일 크기 검증
        if (req.file.size > 10 * 1024 * 1024) {
            return res.status(400).json({ error: '파일 크기는 10MB를 초과할 수 없습니다.' });
        }

        // 파일 타입 검증
        const allowedTypes = mimeTypes[type];
        if (!allowedTypes) {
            return res.status(400).json({ error: '지원하지 않는 파일 유형입니다.' });
        }

        const isValidType = allowedTypes.some(mime => 
            type === 'image' ? req.file.mimetype.startsWith('image/') : req.file.mimetype === mime
        );

        if (!isValidType) {
            return res.status(400).json({ 
                error: `지원하지 않는 파일 형식입니다. 허용된 형식: ${allowedTypes.join(', ')}`
            });
        }

        // 파일 업로드
        const key = `uploads/${folderMap[type]}/${Date.now()}-${encodeURIComponent(req.file.originalname)}`;
        const fileUrl = await uploadFile(req.file, key);
        
        // CORS 헤더 설정
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        res.header('Access-Control-Allow-Credentials', 'true');
        
        res.json({ 
            imageUrl: fileUrl,
            fileName: req.file.originalname,
            fileType: req.file.mimetype,
            fileSize: req.file.size
        });
    } catch (error) {
        console.error(`${type} 파일 업로드 오류:`, error);
        res.status(500).json({ 
            error: '파일 업로드 중 오류가 발생했습니다.',
            details: error.message
        });
    }
});

// 게시글 관련 라우트
app.get('/api/posts', async (req, res) => {
  try {
    const { limit = 20, sort = 'latest' } = req.query;
    const posts = await postService.listPosts(parseInt(limit), sort);
    res.json(posts);
  } catch (error) {
    console.error('게시글 목록 조회 실패:', error);
    res.status(500).json({ error: '게시글 목록을 불러오는데 실패했습니다.' });
  }
});

app.get('/api/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { createdAt } = req.query;
    const post = await postService.getPost(id, createdAt);
    
    if (!post) {
      return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
    }
    
    res.json(post);
  } catch (error) {
    console.error('게시글 조회 실패:', error);
    res.status(500).json({ error: '게시글을 불러오는데 실패했습니다.' });
  }
});

app.post('/api/posts', async (req, res) => {
  try {
    const { attachments, ...postData } = req.body;
    console.log('서버 수신 데이터:', req.body);
    console.log('첨부파일 데이터:', attachments);
    
    if (!postData.title || !postData.content) {
      return res.status(400).json({ error: '제목과 내용은 필수 입력사항입니다.' });
    }

    // 게시글 생성 요청
    const post = await postService.createPost({
      ...postData,
      attachments: attachments || [],
      authorId: 'temp-user-id',
      authorName: '임시 사용자',
      authorEmail: 'temp@example.com',
      status: 'published',
      viewCount: 0,
      likeCount: 0,
      commentCount: 0,
      comments: [],
      tags: []
    });

    res.status(201).json(post);
  } catch (error) {
    console.error('게시글 작성 실패:', error);
    res.status(500).json({ error: '게시글 작성에 실패했습니다.' });
  }
});

app.post('/api/posts/:id/comments', async (req, res) => {
  try {
    const { id } = req.params;
    const { content, author, createdAt } = req.body;
    
    const comment = await postService.addComment(id, createdAt, {
      content,
      author,
      createdAt: new Date().toISOString()
    });
    
    res.status(201).json(comment);
  } catch (error) {
    console.error('댓글 작성 실패:', error);
    res.status(500).json({ error: '댓글 작성에 실패했습니다.' });
  }
});

const s3Client = new S3Client({
  region: 'ap-northeast-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

app.get('/api/files/signed-url', async (req, res) => {
  try {
    const { fileUrl } = req.query;
    if (!fileUrl) {
      return res.status(400).json({ error: '파일 URL이 필요합니다.' });
    }

    // URL 디코딩
    const decodedUrl = decodeURIComponent(fileUrl);
    
    // S3 키 추출 (URL에서 버킷 이름 이후의 경로)
    const key = decodedUrl.split('.com/')[1];
    if (!key) {
      return res.status(400).json({ error: '잘못된 파일 URL입니다.' });
    }

    // GetObject 명령 생성
    const command = new GetObjectCommand({
      Bucket: 'gghwan-board-bucket',
      Key: key
    });

    // 서명된 URL 생성 (5분 유효)
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });
    
    res.json({ signedUrl });
  } catch (error) {
    console.error('Signed URL 생성 실패:', error);
    res.status(500).json({ error: '파일 URL 생성에 실패했습니다.' });
  }
});

// API 라우터 등록
app.use('/api', apiRouter);

// 404 에러 핸들러
app.use((req, res) => {
    console.log('[404] Not Found:', req.method, req.url);
    res.status(404).json({ error: 'Not Found' });
});

// 서버 시작
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    console.log('\nRegistered routes:');
    apiRouter.stack
        .filter(r => r.route)
        .forEach(r => {
            console.log(`${Object.keys(r.route.methods)[0].toUpperCase()} /api${r.route.path}`);
        });
});