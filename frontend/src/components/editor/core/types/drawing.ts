import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";

import { ToolType } from "@excalidraw/excalidraw/types/types";

// 프로젝트에서 사용될 Layer 타입(예시)
export interface Layer {
  id: string;
  name: string;
  visible: boolean;
}

export interface ToolStyle {
    strokeColor: string;
    strokeWidth: number;
    opacity: number;
    fillStyle: 'solid' | 'hatch' | 'cross' | 'dots';
    backgroundColor: string;
    fontSize: number;
    fontFamily: string;
  }
  
  export interface DrawingState {
    elements: ExcalidrawElement[];
    tool: ToolType;
    toolStyle: ToolStyle;
    isDrawing: boolean;
    history: ExcalidrawElement[][];
    historyIndex: number;
    selectedLayer: string | null;
    layers: Layer[];
  }
  
  export interface DrawingActions {
    setElements: (elements: ExcalidrawElement[]) => void;
    setCurrentTool: (tool: ToolType) => void;
    setToolStyle: (style: Partial<ToolStyle>) => void;
    startDrawing: () => void;
    endDrawing: () => void;
    undo: () => void;
    redo: () => void;
    setHistoryIndex: (index: number) => void;
    setSelectedLayer: (layerId: string | null) => void;
    setLayers: (layers: Layer[]) => void;
  }