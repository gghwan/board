import { createContext, useContext, useState, useCallback } from 'react';
import { Editor } from '@tiptap/react';

interface EditorState {
  editor: Editor | null;
  isPreviewMode: boolean;
  isEmojiPickerOpen: boolean;
  isDiagramModalOpen: boolean;
  isAudioRecorderOpen: boolean;
  isDrawingMode: boolean;
  isExcalidrawMode: boolean;
  isFigmaMode: boolean;
  isFramerMode: boolean;
}

interface EditorContextType extends EditorState {
  setEditor: (editor: Editor | null) => void;
  setEditorMode: (mode: keyof Omit<EditorState, 'editor'>, value: boolean) => void;
  resetEditorMode: () => void;
}

const initialState: EditorState = {
  editor: null,
  isPreviewMode: false,
  isEmojiPickerOpen: false,
  isDiagramModalOpen: false,
  isAudioRecorderOpen: false,
  isDrawingMode: false,
  isExcalidrawMode: false,
  isFigmaMode: false,
  isFramerMode: false,
};

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const EditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<EditorState>(initialState);

  const setEditor = useCallback((editor: Editor | null) => {
    setState(prev => ({ ...prev, editor }));
  }, []);

  const setEditorMode = useCallback((mode: keyof Omit<EditorState, 'editor'>, value: boolean) => {
    setState(prev => ({
      ...prev,
      [mode]: value,
      // 다른 모드들은 모두 false로 설정
      ...(Object.keys(initialState).reduce((acc, key) => {
        if (key !== mode && key !== 'editor') {
          acc[key as keyof Omit<EditorState, 'editor'>] = false;
        }
        return acc;
      }, {} as Partial<EditorState>))
    }));
  }, []);

  const resetEditorMode = useCallback(() => {
    setState(prev => ({ ...initialState, editor: prev.editor }));
  }, []);

  return (
    <EditorContext.Provider 
      value={{ 
        ...state, 
        setEditor,
        setEditorMode,
        resetEditorMode
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};

export const useEditorContext = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditorContext must be used within an EditorProvider');
  }
  return context;
};
