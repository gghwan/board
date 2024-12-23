import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { ExcalidrawExtension } from '../extensions/excalidraw/ExcalidrawExtension';
import { DrawingExtension } from '../extensions/drawing/DrawingExtension';
import { FigmaExtension } from '../extensions/figma/FigmaExtension';
import { FramerExtension } from '../extensions/framer/FramerExtension';
import { EditorProps } from './types/editor';
import { useEditorContext } from './contexts/EditorContext';
import { Toolbar } from './Toolbar';

const TiptapEditorContent = ({
  value,
  onChange,
  onFileUpload,
  isPreviewMode = false,
  placeholder = '내용을 입력하세요...',
  readOnly = false,
}: EditorProps) => {
  const { setEditorMode } = useEditorContext();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: 'noopener noreferrer',
          target: '_blank',
        },
      }),
      ExcalidrawExtension.configure({
        HTMLAttributes: {
          class: 'excalidraw-node',
        },
      }),
      DrawingExtension.configure({
        HTMLAttributes: {
          class: 'drawing-node',
        },
      }),
      FigmaExtension.configure({
        HTMLAttributes: {
          class: 'figma-node',
        },
      }),
      FramerExtension.configure({
        HTMLAttributes: {
          class: 'framer-node',
        },
      }),
    ],
    content: value,
    editable: !readOnly && !isPreviewMode,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none min-h-[200px] px-4 py-2',
      },
    },
  });

  if (!editor) return null;

  return (
    <div className="editor-container">
      <Toolbar editor={editor} onFileUpload={onFileUpload} />
      <EditorContent editor={editor} />
    </div>
  );
};

export const TiptapEditor = (props: EditorProps) => {
  return (
    <TiptapEditorContent {...props} />
  );
};
