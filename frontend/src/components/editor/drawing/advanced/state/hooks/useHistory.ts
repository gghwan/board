import { useCallback } from 'react';
import { useHistoryStore } from '@/components/editor/drawing/advanced/state/store/historyStore';
import { useDrawingStore } from '@/components/editor/drawing/advanced/state/store/drawingStore';
import { ExcalidrawElement } from '@/components/editor/drawing/advanced/types/elements';

export const useHistory = () => {
  const history = useHistoryStore();
  const drawing = useDrawingStore();

  const handleUndo = useCallback(() => {
    const previousState = history.undo();
    if (previousState) {
      drawing.setElements(previousState);
    }
  }, [history, drawing]);

  const handleRedo = useCallback(() => {
    const nextState = history.redo();
    if (nextState) {
      drawing.setElements(nextState);
    }
  }, [history, drawing]);

  const recordChange = useCallback((newElements: ExcalidrawElement[]) => {
    history.pushToHistory([...drawing.elements]);
    drawing.setElements(newElements);
  }, [drawing.elements, history, drawing]);

  return {
    history: history.history,
    historyIndex: history.currentIndex,
    handleUndo,
    handleRedo,
    recordChange
  };
};