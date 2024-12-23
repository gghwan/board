import { useState } from 'react';
import { useEditorContext } from '@/components/editor/core/contexts/EditorContext';
import IconButton from '@/components/editor/shared/buttons/IconButton';

interface DiagramModalProps {
  node: {
    attrs: {
      data: string;
    };
  };
  updateAttributes: (attrs: Record<string, any>) => void;
  onClose: () => void;
}

const DiagramModal = ({ node, updateAttributes, onClose }: DiagramModalProps) => {
  const [value, setValue] = useState(node.attrs.data || '');
  const { isDiagramModalOpen, setEditorMode } = useEditorContext();

  if (!isDiagramModalOpen) return null;

  const handleSave = () => {
    updateAttributes({ data: value });
    setEditorMode('isDiagramModalOpen', false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">다이어그램 편집</h2>
          <div className="flex gap-2">
            <IconButton
              icon="save"
              onClick={handleSave}
              title="저장"
            />
            <IconButton
              icon="times"
              onClick={() => {
                setEditorMode('isDiagramModalOpen', false);
                onClose();
              }}
              title="닫기"
            />
          </div>
        </div>
        <div className="p-4">
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full h-64 p-2 border rounded"
            placeholder="여기에 Mermaid 다이어그램 코드를 입력하세요..."
          />
        </div>
      </div>
    </div>
  );
};

export default DiagramModal;