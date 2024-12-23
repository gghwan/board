import IconButton from '../../shared/buttons/IconButton';
import { useEditorContext } from '../../core/contexts/EditorContext';

interface DiagramToolbarProps {
  onSave?: () => void;
  onClose?: () => void;
}

const DiagramToolbar = ({ onSave, onClose }: DiagramToolbarProps) => {
  const { setEditorMode } = useEditorContext();

  const handleClose = () => {
    setEditorMode('isDiagramModalOpen', false);
    onClose?.();
  };

  return (
    <div className="diagram-toolbar p-2 border-b flex items-center gap-2">
      <IconButton
        icon="save"
        onClick={onSave}
        title="저장하기"
      />
      <IconButton
        icon="times"
        onClick={handleClose}
        title="닫기"
      />
    </div>
  );
};

export default DiagramToolbar;