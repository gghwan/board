import { FC } from 'react';
import IconButton from '../../../shared/buttons/IconButton';
import { useEditorContext } from '../../../core/contexts/EditorContext';

interface ControlsProps {
  onRefresh: () => void;
}

export const Controls: FC<ControlsProps> = ({ onRefresh }) => {
  const { setEditorMode } = useEditorContext();

  const handleClose = () => {
    setEditorMode('isFramerMode', false);
  };

  return (
    <div className="framer-controls p-2 border-b flex items-center gap-2">
      <IconButton
        icon="refresh"
        onClick={onRefresh}
        title="새로고침"
      />
      <IconButton
        icon="times"
        onClick={handleClose}
        title="닫기"
      />
    </div>
  );
};
