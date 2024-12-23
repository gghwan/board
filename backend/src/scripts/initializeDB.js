// backend/src/scripts/initializeDB.js
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, BatchWriteCommand } from '@aws-sdk/lib-dynamodb';
import dotenv from 'dotenv';

// 환경변수 로드
dotenv.config();

const client = new DynamoDBClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

const docClient = DynamoDBDocumentClient.from(client);

const samplePosts = {
    "posts": [
        {
            "id": "1234567890",
            "title": "첫 번째 게시글입니다",
            "content": "안녕하세요. 게시글 내용입니다.",
            "author": {
                "id": "user123",
                "username": "홍길동",
                "email": "hong@example.com"
            },
            "category": "일반",
            "tags": ["공지사항", "안내"],
            "createdAt": "2024-03-19T10:30:00Z",
            "updatedAt": "2024-03-19T10:30:00Z",
            "viewCount": 42,
            "likeCount": 5,
            "commentCount": 3,
            "status": "published",
            "comments": [
                {
                    "id": "comment123",
                    "content": "좋은 글이네요!",
                    "author": {
                        "id": "user456",
                        "username": "김철수"
                    },
                    "createdAt": "2024-03-19T11:00:00Z",
                    "updatedAt": "2024-03-19T11:00:00Z"
                }
            ],
            "attachments": [
                {
                    "id": "file123",
                    "fileName": "document.pdf",
                    "fileSize": 1024576,
                    "fileUrl": "https://example.com/files/document.pdf"
                }
            ]
        },
        {
            "id": "1234567891",
            "title": "프로그래밍 스터디 모집합니다",
            "content": "주 2회 프로그래밍 스터디원을 모집합니다. 관심있으신 분들은 연락주세요.",
            "author": {
                "id": "user124",
                "username": "이영희",
                "email": "lee@example.com"
            },
            "category": "스터디",
            "tags": ["프로그래밍", "모집"],
            "createdAt": "2024-03-19T11:30:00Z",
            "updatedAt": "2024-03-19T11:30:00Z",
            "viewCount": 128,
            "likeCount": 12,
            "commentCount": 5,
            "status": "published",
            "comments": [
                {
                    "id": "comment124",
                    "content": "참여하고 싶습니다!",
                    "author": {
                        "id": "user457",
                        "username": "박지민"
                    },
                    "createdAt": "2024-03-19T12:00:00Z",
                    "updatedAt": "2024-03-19T12:00:00Z"
                }
            ],
            "attachments": []
        },
        {
            "id": "1234567892",
            "title": "주말 등산 후기",
            "content": "지난 주말 북한산 등산 다녀왔습니다. 날씨가 정말 좋았어요.",
            "author": {
                "id": "user125",
                "username": "김민수",
                "email": "kim@example.com"
            },
            "category": "취미",
            "tags": ["등산", "후기"],
            "createdAt": "2024-03-19T13:30:00Z",
            "updatedAt": "2024-03-19T13:30:00Z",
            "viewCount": 85,
            "likeCount": 15,
            "commentCount": 4,
            "status": "published",
            "comments": [
                {
                    "id": "comment125",
                    "content": "저도 다음에 같이 가요!",
                    "author": {
                        "id": "user458",
                        "username": "최수진"
                    },
                    "createdAt": "2024-03-19T14:00:00Z",
                    "updatedAt": "2024-03-19T14:00:00Z"
                }
            ],
            "attachments": [
                {
                    "id": "file124",
                    "fileName": "mountain.jpg",
                    "fileSize": 2048576,
                    "fileUrl": "https://example.com/files/mountain.jpg"
                }
            ]
        },
        {
            "id": "1234567893",
            "title": "맛집 추천드립니다",
            "content": "강남역 근처 숨은 맛집을 소개합니다. 가성비가 정말 좋아요.",
            "author": {
                "id": "user126",
                "username": "정다운",
                "email": "jung@example.com"
            },
            "category": "맛집",
            "tags": ["맛집", "추천"],
            "createdAt": "2024-03-19T15:30:00Z",
            "updatedAt": "2024-03-19T15:30:00Z",
            "viewCount": 156,
            "likeCount": 25,
            "commentCount": 8,
            "status": "published",
            "comments": [
                {
                    "id": "comment126",
                    "content": "위치가 어디인가요?",
                    "author": {
                        "id": "user459",
                        "username": "송민아"
                    },
                    "createdAt": "2024-03-19T16:00:00Z",
                    "updatedAt": "2024-03-19T16:00:00Z"
                }
            ],
            "attachments": [
                {
                    "id": "file125",
                    "fileName": "food.jpg",
                    "fileSize": 1536576,
                    "fileUrl": "https://example.com/files/food.jpg"
                }
            ]
        },
        {
            "id": "1234567894",
            "title": "개발자 채용 공고",
            "content": "프론트엔드 개발자를 모집합니다. 자세한 내용은 첨부파일을 확인해주세요.",
            "author": {
                "id": "user127",
                "username": "박현우",
                "email": "park@example.com"
            },
            "category": "채용",
            "tags": ["채용", "개발자"],
            "createdAt": "2024-03-19T17:30:00Z",
            "updatedAt": "2024-03-19T17:30:00Z",
            "viewCount": 245,
            "likeCount": 18,
            "commentCount": 6,
            "status": "published",
            "comments": [
                {
                    "id": "comment127",
                    "content": "지원하고 싶습니다.",
                    "author": {
                        "id": "user460",
                        "username": "이승우"
                    },
                    "createdAt": "2024-03-19T18:00:00Z",
                    "updatedAt": "2024-03-19T18:00:00Z"
                }
            ],
            "attachments": [
                {
                    "id": "file126",
                    "fileName": "job_description.pdf",
                    "fileSize": 512576,
                    "fileUrl": "https://example.com/files/job_description.pdf"
                }
            ]
        }
    ]
};

async function initializeDB() {
    try {
        // BatchWrite 요청 준비 (25개 항목 제한을 고려)
        const chunks = [];
        for (let i = 0; i < samplePosts.posts.length; i += 25) {
            chunks.push(samplePosts.posts.slice(i, i + 25));
        }

        for (const chunk of chunks) {
            const writeRequests = chunk.map(post => ({
                PutRequest: {
                    Item: {
                        ...post,
                        PK: `POST#${post.id}`,
                        SK: post.createdAt
                    }
                }
            }));

            const command = new BatchWriteCommand({
                RequestItems: {
                    'BoardPosts': writeRequests
                }
            });

            await docClient.send(command);
        }

        console.log('샘플 데이터가 성공적으로 추가되었습니다.');
    } catch (error) {
        console.error('데이터 초기화 중 오류 발생:', error);
        throw error;
    }
}

// 스크립트 실행
initializeDB().catch(console.error);