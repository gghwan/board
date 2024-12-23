import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const ImageViewer = ({ file, className = '', thumbnailMode = false }) => {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    if (file instanceof File) {
      setImageUrl(URL.createObjectURL(file));
    } else if (file.file instanceof File) {
      setImageUrl(URL.createObjectURL(file.file));
    } else if (file.localUrl) {
      setImageUrl(file.localUrl);
    } else if (file.url) {
      setImageUrl(file.url);
    }

    return () => {
      if (imageUrl && imageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [file]);

  if (!imageUrl) {
    return <div className="p-4">이미지를 로드하는 중...</div>;
  }

  return (
    <div className={`image-viewer ${className} ${thumbnailMode ? 'h-full' : ''}`}>
      <img 
        src={imageUrl} 
        alt={file.name}
        className={`${thumbnailMode ? 'h-full w-full object-cover' : 'max-w-full h-auto'} rounded-lg shadow-sm`}
        onClick={thumbnailMode ? undefined : () => window.open(imageUrl, '_blank')}
      />
    </div>
  );
};

ImageViewer.propTypes = {
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

export default ImageViewer;