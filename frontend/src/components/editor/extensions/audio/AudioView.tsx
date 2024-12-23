import { NodeViewWrapper } from '@tiptap/react';
import { useRef, useEffect } from 'react';

interface AudioViewProps {
  node: {
    attrs: {
      src: string;
    };
  };
}

export const AudioView = ({ node }: AudioViewProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
    }
  }, [node.attrs.src]);

  return (
    <NodeViewWrapper>
      <div className="audio-wrapper p-4 border rounded-lg">
        <audio
          ref={audioRef}
          controls
          className="w-full"
        >
          <source src={node.attrs.src} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>
    </NodeViewWrapper>
  );
};