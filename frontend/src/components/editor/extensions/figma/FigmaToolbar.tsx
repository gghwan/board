import IconButton from '../../shared/buttons/IconButton';

interface FigmaToolbarProps {
  onSave?: () => void;
  onClose?: () => void;
}

const FigmaToolbar = ({ onSave, onClose }: FigmaToolbarProps) => {
  return (
    <div className="figma-toolbar p-2 border-b flex items-center gap-2">
      <IconButton
        icon="save"
        onClick={onSave}
        title="저장하기"
      />
      <IconButton
        icon="times"
        onClick={onClose}
        title="닫기"
      />
    </div>
  );
};

export default FigmaToolbar;
