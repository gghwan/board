import { create } from 'zustand';
import { fabric } from 'fabric';

interface DrawingState {
  tool: 'brush' | 'select' | 'shape' | 'text';
  color: string;
  size: number;
  canvas: fabric.Canvas | null;
  isDrawing: boolean;
  selectedObject: fabric.Object | null;
  history: string[];
  historyIndex: number;
  setTool: (tool: DrawingState['tool']) => void;
  setColor: (color: string) => void;
  setSize: (size: number) => void;
  setCanvas: (canvas: fabric.Canvas) => void;
  setIsDrawing: (isDrawing: boolean) => void;
  setSelectedObject: (object: fabric.Object | null) => void;
  addToHistory: (state: string) => void;
  undo: () => void;
  redo: () => void;
  clearCanvas: () => void;
}

export const useDrawingStore = create<DrawingState>()((set, get) => ({
  tool: 'brush',
  color: '#000000', 
  size: 3,
  canvas: null,
  isDrawing: false,
  selectedObject: null,
  history: [],
  historyIndex: -1,

  setTool: (tool: DrawingState['tool']) => set({ tool }),
  setColor: (color: string) => set({ color }),
  setSize: (size: number) => set({ size }),
  setCanvas: (canvas: fabric.Canvas) => set({ canvas }),
  setIsDrawing: (isDrawing: boolean) => set({ isDrawing }),
  setSelectedObject: (object: fabric.Object | null) => set({ selectedObject: object }),

  addToHistory: (state: string) => {
    const { history, historyIndex } = get();
    const newHistory = [...history.slice(0, historyIndex + 1), state];
    set({
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },

  undo: () => {
    const { canvas, history, historyIndex } = get();
    if (!canvas || historyIndex <= 0) return;

    const newIndex = historyIndex - 1;
    canvas.loadFromJSON(history[newIndex], () => {
      canvas.renderAll();
      set({ historyIndex: newIndex });
    });
  },

  redo: () => {
    const { canvas, history, historyIndex } = get();
    if (!canvas || historyIndex >= history.length - 1) return;

    const newIndex = historyIndex + 1;
    canvas.loadFromJSON(history[newIndex], () => {
      canvas.renderAll();
      set({ historyIndex: newIndex });
    });
  },

  clearCanvas: () => {
    const { canvas } = get();
    if (!canvas) return;
    
    canvas.clear();
    const state = JSON.stringify(canvas.toJSON());
    get().addToHistory(state);
  },
}));
