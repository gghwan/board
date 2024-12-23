import axios from 'axios';
import { getFileType } from '../utils/fileUtils';

const BASE_URL = 'http://localhost:3000/api';

const FILE_TYPE_MAP = {
  'application/pdf': 'pdf',
  'application/msword': 'word',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'word',
  'text/plain': 'text',
  'text/markdown': 'text',
  'text/csv': 'text'
};

export const fileService = {
  async uploadFile(file, type = 'file') {
    if (!file) throw new Error('파일이 없습니다.');

    try {
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error('파일 크기는 10MB를 초과할 수 없습니다.');
      }

      // MIME 타입에 따라 업로드 타입 결정
      let uploadType = type;
      if (type === 'file') {
        uploadType = FILE_TYPE_MAP[file.type] || 'text';
      } else if (file.type.startsWith('image/')) {
        uploadType = 'image';
      }

      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post(
        `${BASE_URL}/upload/${uploadType}`, 
        formData,
        {
          headers: { 
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      return {
        type: getFileType(response.data.fileType),
        name: response.data.fileName,
        size: response.data.fileSize,
        mimeType: response.data.fileType,
        url: response.data.imageUrl
      };
    } catch (error) {
      console.error('파일 업로드 실패:', error);
      throw error;
    }
  },

  async getSignedUrl(fileUrl) {
    if (!fileUrl) throw new Error('파일 URL이 없습니다.');
    
    try {
      const response = await axios.get(`${BASE_URL}/files/signed-url`, {
        params: { fileUrl }
      });
      return response.data.signedUrl;
    } catch (error) {
      console.error('서명된 URL 조회 실패:', error);
      throw error;
    }
  }
};