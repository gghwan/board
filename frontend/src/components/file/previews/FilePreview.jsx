import React from 'react';
import PropTypes from 'prop-types';
import { formatFileSize } from '../../../utils/fileUtils';
import FileIcon from '../common/FileIcon';
import { fileService } from '../../../services/fileService';

const FilePreview = ({ file, onPreview, onDelete, previewMode = 'list', className = '' }) => {
  const handlePreview = async () => {
    try {
      if (file.type === 'image') {
        onPreview?.(file);
      } else {
        const signedUrl = await fileService.getSignedUrl(file.url);
        window.open(signedUrl, '_blank');
      }
    } catch (error) {
      console.error('파일 미리보기 실패:', error);
    }
  };

  const handleDownload = async (e) => {
    e.stopPropagation();
    try {
      const signedUrl = await fileService.getSignedUrl(file.url);
      
      // Fetch를 사용하여 파일 데이터를 가져옴
      const response = await fetch(signedUrl);
      const blob = await response.blob();
      
      // Blob URL 생성
      const blobUrl = window.URL.createObjectURL(blob);
      
      // 다운로드 링크 생성 및 클릭
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      
      // 정리
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('파일 다운로드 실패:', error);
    }
  };

  return (
    <div 
      onClick={handlePreview}
      className={`relative flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer ${className}`}
    >
      <FileIcon type={file.type} className="w-8 h-8" />
      <div className="ml-3 flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={handleDownload}
          className="p-1 text-gray-400 hover:text-gray-600"
          title="다운로드"
        >
          <i className="fas fa-download"></i>
        </button>
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1 text-gray-400 hover:text-red-600"
            title="삭제"
          >
            <i className="fas fa-times"></i>
          </button>
        )}
      </div>
    </div>
  );
};

FilePreview.propTypes = {
  file: PropTypes.shape({
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    size: PropTypes.number,
    url: PropTypes.string,
    localUrl: PropTypes.string,
    mimeType: PropTypes.string
  }).isRequired,
  onPreview: PropTypes.func,
  onDelete: PropTypes.func,
  previewMode: PropTypes.oneOf(['list', 'thumbnail']),
  className: PropTypes.string
};

export default FilePreview;