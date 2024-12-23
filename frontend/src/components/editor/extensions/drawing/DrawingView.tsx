import { useRef, useState } from "react";
import { useEffect } from "react";
import { useEditorContext } from "../../core/contexts/EditorContext";
import { NodeViewWrapper, NodeViewProps } from "@tiptap/react";
import { fabric } from "fabric";

export const DrawingView = (props: NodeViewProps) => {
  const { node, updateAttributes } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const { isDrawingMode, setEditorMode } = useEditorContext();

  useEffect(() => {
    if (!canvasRef.current) return;

    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      isDrawingMode: true,
      width: 800,
      height: 400,
    });

    setCanvas(fabricCanvas);

    if (node.attrs.data) {
      fabricCanvas.loadFromJSON(node.attrs.data, () => {
        fabricCanvas.renderAll();
      });
    }

    return () => {
      fabricCanvas.dispose();
    };
  }, []);

  useEffect(() => {
    if (!canvas) return;
    
    const handleSave = () => {
      const data = canvas.toJSON();
      updateAttributes({ data: JSON.stringify(data) });
    };

    canvas.on('path:created', handleSave);
    canvas.on('object:modified', handleSave);

    return () => {
      canvas.off('path:created', handleSave);
      canvas.off('object:modified', handleSave);
    };
  }, [canvas, updateAttributes]);

  return (
    <NodeViewWrapper>
      <div className="drawing-wrapper relative border rounded-lg overflow-hidden">
        <canvas ref={canvasRef} />
        {!isDrawingMode && (
          <div 
            className="absolute inset-0 bg-transparent cursor-pointer"
            onClick={() => setEditorMode('isDrawingMode', true)}
          />
        )}
      </div>
    </NodeViewWrapper>
  );
};