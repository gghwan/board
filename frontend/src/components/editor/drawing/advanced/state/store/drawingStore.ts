import { create } from 'zustand';
import { ExcalidrawElement } from '../../types/elements';
import { ToolType, ToolStyle } from '../../types/tools';
import { Layer } from '@drawing/advanced/types/state';

interface DrawingState {
  elements: ExcalidrawElement[];
  tool: ToolType;
  toolStyle: ToolStyle;
  isDrawing: boolean;
  history: ExcalidrawElement[][];
  historyIndex: number;
  selectedLayer: string | null;
  layers: Layer[];
}

interface DrawingActions {
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

export const useDrawingStore = create<DrawingState & DrawingActions>((set, get) => ({
  elements: [],
  tool: 'select',
  toolStyle: {
    strokeColor: '#000000',
    strokeWidth: 2,
    opacity: 100,
    fillStyle: 'solid',
    backgroundColor: 'transparent',
    fontSize: 20,
    fontFamily: 'Arial'
  },
  isDrawing: false,
  history: [[]],
  historyIndex: 0,
  selectedLayer: null,
  layers: [],

  setElements: (elements) => {
    const { history, historyIndex } = get();
    set({
      elements,
      history: [...history.slice(0, historyIndex + 1), elements],
      historyIndex: historyIndex + 1
    });
  },
  setCurrentTool: (tool) => set({ tool }),
  setToolStyle: (style) => set((state) => ({
    toolStyle: { ...state.toolStyle, ...style }
  })),
  startDrawing: () => set({ isDrawing: true }),
  endDrawing: () => set({ isDrawing: false }),
  
  undo: () => {
    const { historyIndex, history } = get();
    if (historyIndex > 0) {
      set({
        elements: history[historyIndex - 1],
        historyIndex: historyIndex - 1
      });
    }
  },

  redo: () => {
    const { historyIndex, history } = get();
    if (historyIndex < history.length - 1) {
      set({
        elements: history[historyIndex + 1],
        historyIndex: historyIndex + 1
      });
    }
  },

  setHistoryIndex: (index) => {
    const { history } = get();
    if (index >= 0 && index < history.length) {
      set({
        elements: history[index],
        historyIndex: index
      });
    }
  },

  setSelectedLayer: (layerId) => set({ selectedLayer: layerId }),
  setLayers: (layers) => set({ layers })
}));