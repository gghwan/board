import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import mammoth from 'mammoth';

const WordViewer = ({ file, className = '', thumbnailMode = false }) => {
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
    const loadWordDoc = async () => {
      if (!fileUrl) return;
      
      try {
        const response = await fetch(fileUrl);
        const blob = await response.blob();
        const result = await mammoth.convertToHtml({ arrayBuffer: await blob.arrayBuffer() });
        setContent(result.value);
      } catch (err) {
        setError('문서를 불러오는데 실패했습니다.');
        console.error('Word 문서 로드 실패:', err);
      } finally {
        setLoading(false);
      }
    };

    loadWordDoc();
  }, [fileUrl]);

  if (loading) return <div className="p-4">문서를 불러오는 중...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className={`word-viewer ${className} bg-white rounded-lg shadow ${thumbnailMode ? 'h-full overflow-hidden' : 'p-4'}`}>
      <div 
        className={`prose ${thumbnailMode ? 'scale-25 origin-top-left' : 'max-w-none'}`}
        dangerouslySetInnerHTML={{ __html: content }} 
      />
    </div>
  );
};

WordViewer.propTypes = {
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

export default WordViewer;
