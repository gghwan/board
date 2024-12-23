import { useState, useCallback } from 'react';
import axios from 'axios';

export const useFileViewer = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [error, setError] = useState(null);

  const handleFilePreview = useCallback(async (file) => {
    try {
      if (!file.url && !file.localUrl) {
        throw new Error('파일 URL이 없습니다');
      }

      // PDF, Word 등의 문서 파일인 경우
      if (file.type === 'pdf' || file.type === 'word' || file.type === 'text') {
        if (file.localUrl) {
          // 로컬 파일인 경우 새 창에서 직접 열기
          window.open(file.localUrl, '_blank');
        } else {
          // 서버 파일인 경우 서명된 URL 받아오기
          const response = await axios.get('http://localhost:3000/api/files/signed-url', {
            params: { fileUrl: encodeURIComponent(file.url) }
          });
          window.open(response.data.signedUrl, '_blank');
        }
      } else {
        // 이미지 등 미리보기 가능한 파일
        setSelectedFile(file);
        setIsPreviewOpen(true);
      }
    } catch (err) {
      console.error('파일 미리보기 실패:', err);
      setError(err.message);
    }
  }, []);

  const closePreview = useCallback(() => {
    setSelectedFile(null);
    setIsPreviewOpen(false);
  }, []);

  return {
    selectedFile,
    isPreviewOpen,
    error,
    handleFilePreview,
    closePreview
  };
};