import { useEffect, useRef } from 'react';
import { fabric } from 'fabric';

interface CanvasProps {
  width?: number;
  height?: number;
  onCanvasReady?: (canvas: fabric.Canvas) => void;
  initialData?: any;
}

const Canvas = ({ 
  width = 800, 
  height = 400, 
  onCanvasReady,
  initialData 
}: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width,
      height,
      isDrawingMode: true,
    });

    if (initialData) {
      canvas.loadFromJSON(initialData, () => {
        canvas.renderAll();
      });
    }

    onCanvasReady?.(canvas);

    return () => {
      canvas.dispose();
    };
  }, [width, height, initialData, onCanvasReady]);

  return <canvas ref={canvasRef} />;
};

export default Canvas;
