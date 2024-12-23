import { useEffect } from 'react';
import { Editor } from '@tiptap/react';
import { getCustomKeymap } from '../config/keymap';

export const useKeymap = (editor: Editor) => {
  useEffect(() => {
    if (!editor) return;

    const keymap = getCustomKeymap(editor);
    const handlers = new Map();

    Object.entries(keymap).forEach(([shortcut, handler]) => {
      handlers.set(shortcut, handler);
    });

    const handleKeydown = (event: KeyboardEvent) => {
      const shortcut = getShortcut(event);
      const handler = handlers.get(shortcut);
      if (handler) {
        event.preventDefault();
        handler(editor);
      }
    };

    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, [editor]);
};

const getShortcut = (event: KeyboardEvent): string => {
  const parts = [];
  if (event.metaKey || event.ctrlKey) parts.push('Mod');
  if (event.shiftKey) parts.push('Shift');
  if (event.altKey) parts.push('Alt');
  parts.push(event.key);
  return parts.join('-');
};
