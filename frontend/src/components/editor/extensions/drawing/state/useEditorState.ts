import { useState, useCallback } from 'react';
import { Editor } from '@tiptap/react';

export const useEditorState = (editor: Editor) => {
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  const updateState = useCallback(() => {
    if (!editor) return;

    setIsBold(editor.isActive('bold'));
    setIsItalic(editor.isActive('italic'));
    setIsUnderline(editor.isActive('underline'));
  }, [editor]);

  return {
    isBold,
    isItalic,
    isUnderline,
    updateState,
  };
};