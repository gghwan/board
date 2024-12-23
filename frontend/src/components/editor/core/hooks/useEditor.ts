import { useState, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import { useKeymap } from './useKeymap';

export const useCustomEditor = (editor: Editor | null) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (editor) {
      setIsReady(true);
    }
  }, [editor]);

  // editor가 null이 아닐 때만 useKeymap 호출
  if (editor) {
    useKeymap(editor);
  }

  return {
    isReady,
    editor
  };
};
