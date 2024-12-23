import { useState, useEffect, useRef } from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import PropTypes from 'prop-types';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const PDFViewer = ({ file, className = '', thumbnailMode = false }) => {
  const [error, setError] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const urlRef = useRef(null);

  useEffect(() => {
    const loadPDF = async () => {
      try {
        let url;
        if (file instanceof File) {
          url = URL.createObjectURL(file);
        } else if (file.file instanceof File) {
          url = URL.createObjectURL(file.file);
        } else if (file.localUrl) {
          url = file.localUrl;
        } else if (file.url) {
          const response = await fetch(file.url);
          const blob = await response.blob();
          url = URL.createObjectURL(blob);
        }
        urlRef.current = url;
        setFileUrl(url);
      } catch (err) {
        console.error('PDF 로드 실패:', err);
        setError('PDF 파일을 로드하는데 실패했습니다.');
      }
    };

    loadPDF();

    return () => {
      if (urlRef.current && urlRef.current.startsWith('blob:')) {
        URL.revokeObjectURL(urlRef.current);
        urlRef.current = null;
      }
    };
  }, [file]);

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (!fileUrl) {
    return <div className="p-4">PDF를 로드하는 중...</div>;
  }

  return (
    <div className={`pdf-viewer ${className} bg-white rounded-lg shadow overflow-hidden`}>
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
        <Viewer
          fileUrl={fileUrl}
          plugins={thumbnailMode ? [] : [defaultLayoutPluginInstance]}
          defaultScale={thumbnailMode ? 0.3 : 1.0}
          onError={(err) => {
            console.error('PDF 렌더링 실패:', err);
            setError('PDF 파일을 표시하는데 실패했습니다.');
          }}
        />
      </Worker>
    </div>
  );
};

PDFViewer.propTypes = {
  file: PropTypes.oneOfType([
    PropTypes.instanceOf(File),
    PropTypes.shape({
      url: PropTypes.string,
      localUrl: PropTypes.string,
      file: PropTypes.instanceOf(File)
    })
  ]).isRequired,
  className: PropTypes.string,
  thumbnailMode: PropTypes.bool
};

export default PDFViewer;