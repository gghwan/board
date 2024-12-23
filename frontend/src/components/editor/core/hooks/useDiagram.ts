import { useState, useCallback } from 'react';
import { Editor } from '@tiptap/react';

export const useDiagram = (editor: Editor) => {
  const [diagramCode, setDiagramCode] = useState('');

  const insertDiagram = useCallback((code: string) => {
    if (!editor || !code) return;

    editor.chain()
      .focus()
      .setDiagram({ data: code })
      .run();
  }, [editor]);

  return {
    diagramCode,
    setDiagramCode,
    insertDiagram,
  };
};