import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const TextViewer = ({ file, className = '', thumbnailMode = false }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);

  useEffect(() => {
    if (file instanceof File) {
      setFileUrl(URL.createObjectURL(file));
    } else if (file.file instanceof File) {
      setFileUrl(URL.createObjectURL(file.file));
    } else if (file.localUrl) {
      setFileUrl(file.localUrl);
    } else if (file.url) {
      setFileUrl(file.url);
    }

    return () => {
      if (fileUrl && fileUrl.startsWith('blob:')) {
        URL.revokeObjectURL(fileUrl);
      }
    };
  }, [file]);

  useEffect(() => {
    const loadTextFile = async () => {
      if (!fileUrl) return;
      
      try {
        const response = await fetch(fileUrl);
        const text = await response.text();
        setContent(text);
      } catch (err) {
        setError('텍스트 파일을 불러오는데 실패했습니다.');
        console.error('텍스트 파일 로드 실패:', err);
      } finally {
        setLoading(false);
      }
    };

    loadTextFile();
  }, [fileUrl]);

  if (loading) return <div className="p-4">텍스트를 불러오는 중...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className={`text-viewer ${className} bg-white rounded-lg shadow ${thumbnailMode ? 'h-full overflow-hidden' : 'p-4'}`}>
      <pre className={`whitespace-pre-wrap font-mono text-sm ${thumbnailMode ? 'scale-50 origin-top-left' : ''}`}>
        {content}
      </pre>
    </div>
  );
};

TextViewer.propTypes = {
  file: PropTypes.oneOfType([
    PropTypes.instanceOf(File),
    PropTypes.shape({
      file: PropTypes.instanceOf(File),
      localUrl: PropTypes.string,
      url: PropTypes.string,
      name: PropTypes.string.isRequired
    })
  ]).isRequired,
  className: PropTypes.string,
  thumbnailMode: PropTypes.bool
};

export default TextViewer;