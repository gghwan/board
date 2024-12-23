import { NodeViewWrapper } from '@tiptap/react';
import { useEffect, useRef } from 'react';

export const FigmaView = ({ node }: { node: { attrs: { fileUrl: string } } }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'figma-save') {
        // 이미지 저장 로직 구현
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <NodeViewWrapper>
      <div className="figma-wrapper border rounded-lg overflow-hidden">
        <iframe
          ref={iframeRef}
          src={`https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(node.attrs.fileUrl)}`}
          className="w-full h-[400px]"
          allowFullScreen
        />
      </div>
    </NodeViewWrapper>
  );
};
