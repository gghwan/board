import { useMemo, useCallback, RefObject } from 'react';
import { ToolType } from '@/components/editor/drawing/advanced/types/tools';
import { useDrawingState } from '@/components/editor/drawing/advanced/state/hooks/useDrawingState';
import { useHistory } from '@/components/editor/drawing/advanced/state/hooks/useHistory';
import { AdvancedSelectTool } from '@/components/editor/drawing/advanced/tools/implementations/AdvancedSelectTool';
import { AdvancedPencilTool } from '@/components/editor/drawing/advanced/tools/implementations/AdvancedPencilTool';
import { AdvancedShapeTool } from '@/components/editor/drawing/advanced/tools/implementations/AdvancedShapeTool';
import { AdvancedTextTool } from '@/components/editor/drawing/advanced/tools/implementations/AdvancedTextTool';
import { Tool } from '@/components/editor/drawing/advanced/tools/core/Tool';

type ToolMap = {
  [K in ToolType]: Tool | null;
};

interface UseToolsReturn {
  getCurrentTool: (toolType: ToolType) => Tool | null;
  cleanup: () => void;
  initializeTool: (toolType: ToolType) => void;
}

export const useTools = (
  canvasRef: RefObject<HTMLCanvasElement>,
  context: CanvasRenderingContext2D | null
): UseToolsReturn => {
  const { 
    elements, 
    toolStyle, 
    setElements,
    history,
    historyIndex,
    setHistoryIndex
  } = useDrawingState();
  
  const { recordChange } = useHistory();

  const tools = useMemo<ToolMap>(() => {
    if (!canvasRef.current || !context) {
      return {
        select: null,
        pencil: null,
        rectangle: null,
        ellipse: null,
        diamond: null,
        arrow: null,
        line: null,
        text: null,
        eraser: null,
        image: null
      };
    }

    const appState = {
      elements,
      currentItemStrokeColor: toolStyle.strokeColor,
      currentItemFontSize: toolStyle.fontSize || 16,
      currentItemFontFamily: toolStyle.fontFamily || 'Arial',
      currentItemOpacity: toolStyle.opacity,
      currentItemStrokeWidth: toolStyle.strokeWidth,
      currentItemFillStyle: toolStyle.fillStyle || 'solid',
      history,
      historyIndex,
      updateElements: recordChange
    };

    return {
      select: new AdvancedSelectTool({ context, appState }),
      pencil: new AdvancedPencilTool({ context, appState }),
      rectangle: new AdvancedShapeTool({ context, appState, shape: 'rectangle' }),
      ellipse: new AdvancedShapeTool({ context, appState, shape: 'ellipse' }),
      diamond: new AdvancedShapeTool({ context, appState, shape: 'diamond' }),
      arrow: new AdvancedShapeTool({ context, appState, shape: 'arrow' }),
      line: new AdvancedShapeTool({ context, appState, shape: 'line' }),
      text: new AdvancedTextTool({ context, appState }),
      eraser: null,
      image: null
    };
  }, [canvasRef, context, elements, toolStyle, history, historyIndex, recordChange]);

  const getCurrentTool = useCallback((toolType: ToolType): Tool | null => {
    return tools[toolType];
  }, [tools]);

  const cleanup = useCallback(() => {
    Object.values(tools).forEach(tool => {
      if (tool?.cleanup) {
        tool.cleanup();
      }
    });
  }, [tools]);

  const initializeTool = useCallback((toolType: ToolType) => {
    const tool = tools[toolType];
    if (tool) {
      tool.initialize();
    }
  }, [tools]);

  return { getCurrentTool, cleanup, initializeTool };
};