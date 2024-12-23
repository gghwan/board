import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { ExcalidrawExtension } from './extensions/excalidraw/ExcalidrawExtension';
import { DrawingExtension } from './extensions/drawing/DrawingExtension';
import { DiagramExtension } from './extensions/diagram/DiagramExtension';
import { AudioExtension } from './extensions/audio/AudioExtension';
import { FigmaExtension } from './extensions/figma/FigmaExtension';
import { FramerExtension } from './extensions/framer/FramerExtension';
import Toolbar from './ui/toolbar/MainToolbar';
import { useEditorContext } from './core/contexts/EditorContext';
import { useEffect } from 'react';
import { getExtensionConfig } from './core/types/extensions';

interface IntegratedEditorProps {
  value: string;
  onChange: (value: string) => void;
  onFileUpload?: (file: File) => Promise<string>;
  placeholder?: string;
  readOnly?: boolean;
  isPreviewMode?: boolean;
  onTogglePreview?: () => void;
}

const IntegratedEditor = ({
  value,
  onChange,
  onFileUpload,
  placeholder = '내용을 입력하세요...',
  readOnly = false,
  isPreviewMode = false,
  onTogglePreview,
}: IntegratedEditorProps) => {
  const { setEditor } = useEditorContext();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3]
        }
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: 'editor-image'
        }
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: 'noopener noreferrer',
          target: '_blank',
          class: 'editor-link'
        }
      }),
      ExcalidrawExtension.configure({
        HTMLAttributes: getExtensionConfig('excalidraw').HTMLAttributes
      }),
      DrawingExtension.configure({
        HTMLAttributes: getExtensionConfig('drawing').HTMLAttributes
      }),
      DiagramExtension.configure({
        HTMLAttributes: getExtensionConfig('diagram').HTMLAttributes
      }),
      AudioExtension.configure({
        HTMLAttributes: getExtensionConfig('audio').HTMLAttributes
      }),
      FigmaExtension.configure({
        HTMLAttributes: getExtensionConfig('figma').HTMLAttributes
      }),
      FramerExtension.configure({
        HTMLAttributes: getExtensionConfig('framer').HTMLAttributes
      })
    ],
    content: value,
    editable: !readOnly && !isPreviewMode,
    onUpdate: ({ editor }) => {
      try {
        const html = editor.getHTML();
        onChange(html);
      } catch (error) {
        console.error('Editor update error:', error);
      }
    },
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none min-h-[200px] px-4 py-2',
        placeholder
      }
    }
  });

  useEffect(() => {
    if (editor) {
      setEditor(editor);
      return () => setEditor(null);
    }
  }, [editor, setEditor]);

  if (!editor) return null;

  return (
    <div className="editor-container">
      <Toolbar 
        editor={editor} 
        onFileUpload={onFileUpload}
      />
      <EditorContent 
        editor={editor} 
        className={`editor-content ${isPreviewMode ? 'preview-mode' : 'edit-mode'}`}
      />
    </div>
  );
};

export default IntegratedEditor;