import { useEffect, useRef } from 'react';

interface FigmaCanvasProps {
  fileUrl: string;
  onSave?: (imageData: string) => void;
}

const FigmaCanvas = ({ fileUrl, onSave }: FigmaCanvasProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'figma-save' && onSave) {
        onSave(event.data.imageData);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onSave]);

  return (
    <iframe
      ref={iframeRef}
      src={`https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(fileUrl)}`}
      className="w-full h-[400px] border-0"
      allowFullScreen
    />
  );
};

export default FigmaCanvas;
