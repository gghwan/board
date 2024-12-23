import { Editor } from '@tiptap/react';
import { useEditorContext } from '../contexts/EditorContext';

export const defaultKeymap = {
  'Mod-b': (editor: Editor) => editor.chain().focus().toggleBold().run(),
  'Mod-i': (editor: Editor) => editor.chain().focus().toggleItalic().run(),
  'Mod-s': (editor: Editor) => editor.chain().focus().toggleStrike().run(),
  'Mod-`': (editor: Editor) => editor.chain().focus().toggleCode().run(),
  'Mod-[': (editor: Editor) => editor.chain().focus().liftListItem('listItem').run(),
  'Mod-]': (editor: Editor) => editor.chain().focus().sinkListItem('listItem').run(),
  'Shift-Enter': (editor: Editor) => editor.chain().focus().setHardBreak().run(),
  'Mod-z': (editor: Editor) => editor.chain().focus().undo().run(),
  'Mod-y': (editor: Editor) => editor.chain().focus().redo().run(),
  'Mod-Shift-z': (editor: Editor) => editor.chain().focus().redo().run(),
};

export const getCustomKeymap = (editor: Editor) => {
  const { setEditorMode } = useEditorContext();

  return {
    ...defaultKeymap,
    'Mod-k': () => editor.chain().focus().setLink({ href: '' }).run(),
    'Mod-d': () => setEditorMode('isDrawingMode', true),
    'Mod-e': () => setEditorMode('isExcalidrawMode', true),
  };
};
