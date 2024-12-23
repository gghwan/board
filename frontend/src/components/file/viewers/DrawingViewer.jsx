import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const DrawingViewer = ({ file, onSave }) => {
  const iframeRef = useRef(null);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.event === 'save') {
        const imageData = event.data.data;
        onSave?.(imageData);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onSave]);

  return (
    <div className="drawing-viewer">
      <iframe
        ref={iframeRef}
        src={`https://embed.diagrams.net/?embed=1&spin=1&modified=unsavedChanges&proto=json`}
        className="w-full h-[400px]"
        frameBorder="0"
      />
    </div>
  );
};

DrawingViewer.propTypes = {
  file: PropTypes.shape({
    url: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
  onSave: PropTypes.func
};

export default DrawingViewer;