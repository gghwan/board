import { fabric } from 'fabric';
import IconButton from '../../../shared/buttons/IconButton';

interface ToolbarProps {
  canvas: fabric.Canvas;
}

const Toolbar = ({ canvas }: ToolbarProps) => {
  const handleBrushSize = (size: number) => {
    canvas.freeDrawingBrush.width = size;
  };

  const handleBrushColor = (color: string) => {
    canvas.freeDrawingBrush.color = color;
  };

  const handleClear = () => {
    canvas.clear();
  };

  return (
    <div className="drawing-toolbar p-2 border-b flex items-center gap-2">
      <select 
        onChange={(e) => handleBrushSize(Number(e.target.value))}
        className="border rounded px-2 py-1"
      >
        <option value="1">가는 선</option>
        <option value="3">중간 선</option>
        <option value="5">굵은 선</option>
      </select>
      <input
        type="color"
        onChange={(e) => handleBrushColor(e.target.value)}
        className="w-8 h-8 p-1"
      />
      <IconButton
        icon="trash"
        onClick={handleClear}
        title="모두 지우기"
      />
    </div>
  );
};

export default Toolbar;
