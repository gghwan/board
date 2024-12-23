import { uploadFile, getSignedFileUrl, deleteFile } from '../config/s3.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testS3Operations() {
  try {
    console.log('\n=== S3 테스트 시작 ===');
    
    // 테스트 파일 경로 확인
    const testFilePath = path.join(__dirname, 'test.txt');
    
    try {
      await fs.access(testFilePath);
      console.log('테스트 파일 경로:', testFilePath);
    } catch (error) {
      throw new Error(`테스트 파일을 찾을 수 없습니다: ${testFilePath}`);
    }

    // 테스트 파일 읽기
    const fileBuffer = await fs.readFile(testFilePath);
    const testFile = {
      buffer: fileBuffer,
      originalname: 'test.txt',
      mimetype: 'text/plain'
    };

    // 1. 파일 업로드 테스트
    console.log('\n1. 파일 업로드 테스트');
    const key = `test/${Date.now()}-${testFile.originalname}`;
    const fileUrl = await uploadFile(testFile, key);
    console.log('업로드된 파일 URL:', fileUrl);

    // 2. 서명된 URL 생성 테스트
    console.log('\n2. 서명된 URL 생성 테스트');
    const signedUrl = await getSignedFileUrl(key);
    console.log('서명된 URL:', signedUrl);

    // 3. 파일 삭제 테스트
    console.log('\n3. 파일 삭제 테스트');
    await deleteFile(key);
    console.log('파일 삭제 완료');

    console.log('\n=== S3 테스트 완료 ===');
  } catch (error) {
    console.error('S3 테스트 실패:', error);
  }
}

// 테스트 실행
testS3Operations();