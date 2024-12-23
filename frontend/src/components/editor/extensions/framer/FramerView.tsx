import { NodeViewWrapper } from '@tiptap/react';
import { useEditorContext } from '../../core/contexts/EditorContext';
import { Preview } from './components/Preview';
import { Controls } from './components/Controls';
import { useCallback } from 'react';

interface FramerViewProps {
  node: {
    attrs: {
      projectUrl: string;
    };
  };
}

export const FramerView = ({ node }: FramerViewProps) => {
  const { isFramerMode, setEditorMode } = useEditorContext();

  const handleRefresh = useCallback(() => {
    // iframe 새로고침 로직
    const iframe = document.querySelector('.framer-wrapper iframe') as HTMLIFrameElement;
    if (iframe) {
      iframe.src = iframe.src;
    }
  }, []);

  const handleActivateEdit = useCallback(() => {
    setEditorMode('isFramerMode', true);
  }, [setEditorMode]);

  return (
    <NodeViewWrapper>
      <div className="framer-wrapper border rounded-lg overflow-hidden">
        {isFramerMode && <Controls onRefresh={handleRefresh} />}
        <Preview 
          projectUrl={node.attrs.projectUrl}
          onActivateEdit={handleActivateEdit}
          isEditMode={isFramerMode}
        />
      </div>
    </NodeViewWrapper>
  );
};
