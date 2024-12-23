import { useEffect } from 'react';

interface FilePreviewModalProps {
  file: {
    type: string;
    name: string;
    url?: string;
    localUrl?: string;
  };
  onClose: () => void;
}

const FilePreviewModal = ({ file, onClose }: FilePreviewModalProps) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const renderContent = () => {
    if (file.type === 'image') {
      return (
        <div className="flex items-center justify-center h-full">
          <img 
            src={file.url || file.localUrl} 
            alt={file.name}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      );
    }

    return (
      <div className="text-center py-12">
        <i className={`fas fa-file-${file.type} text-6xl mb-4`} />
        <p className="text-lg mb-4">{file.name}</p>
        <button
          onClick={() => window.open(file.url, '_blank')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          파일 열기
        </button>
      </div>
    );
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-medium text-gray-900">
            {file.name}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <i className="fas fa-times" />
          </button>
        </div>
        <div className="p-4 h-[80vh] overflow-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default FilePreviewModal;