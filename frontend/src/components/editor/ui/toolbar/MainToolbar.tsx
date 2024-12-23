import { Editor } from '@tiptap/react';
import IconButton from '../../shared/buttons/IconButton';
import { useEditorContext } from '@/components/editor/core/contexts/EditorContext';

interface ToolbarProps {
  editor: Editor;
  onFileUpload?: (file: File) => Promise<string>;
}

const Toolbar = ({ editor, onFileUpload }: ToolbarProps) => {
  const { setEditorMode } = useEditorContext();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onFileUpload) return;

    try {
      const url = await onFileUpload(file);
      editor.chain().focus().setImage({ src: url }).run();
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
    }
  };

  const handleFigmaInsert = () => {
    const url = prompt('Figma 파일 URL을 입력하세요:');
    if (url) {
      editor.chain().focus().setFigma({ fileUrl: url }).run();
      setEditorMode('isFigmaMode', true);
    }
  };

  const handleFramerInsert = () => {
    const url = prompt('Framer 프로젝트 URL을 입력하세요:');
    if (url) {
      editor.chain().focus().setFramer({ projectUrl: url }).run();
      setEditorMode('isFramerMode', true);
    }
  };

  return (
    <div className="border-b border-gray-200 p-2 flex flex-wrap gap-1">
      <IconButton
        icon="bold"
        isActive={editor.isActive('bold')}
        onClick={() => editor.chain().focus().toggleBold().run()}
      />
      <IconButton
        icon="italic"
        isActive={editor.isActive('italic')}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      />
      <IconButton
        icon="list-ul"
        isActive={editor.isActive('bulletList')}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      />
      <IconButton
        icon="list-ol"
        isActive={editor.isActive('orderedList')}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      />
      <label className="cursor-pointer">
        <input
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleImageUpload}
        />
        <IconButton icon="image" onClick={() => {}} />
      </label>
      <IconButton
        icon="pencil-ruler"
        isActive={editor.isActive('excalidraw')}
        onClick={() => {
          editor.chain().focus().setExcalidraw({ data: null }).run();
          setEditorMode('isExcalidrawMode', true);
        }}
      />
      <IconButton
        icon="paint-brush"
        onClick={() => {
          editor.chain().focus().setDrawing({ data: '' }).run();
          setEditorMode('isDrawingMode', true);
        }}
      />
      <IconButton
        icon="figma"
        onClick={handleFigmaInsert}
      />
      <IconButton
        icon="frame"
        onClick={handleFramerInsert}
      />
    </div>
  );
};

export default Toolbar;
