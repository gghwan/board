import { useCallback } from 'react';
import { Editor } from '@tiptap/react';
import { useEditorContext } from '../contexts/EditorContext';

export const useToolbar = (editor: Editor | null) => {
  const { setEditorMode } = useEditorContext();

  const handleImageUpload = useCallback(async (file: File, onFileUpload?: (file: File) => Promise<string>) => {
    if (!editor || !onFileUpload) return;

    try {
      const url = await onFileUpload(file);
      editor.chain().focus().setImage({ src: url }).run();
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
    }
  }, [editor]);

  const handleLinkInsert = useCallback(() => {
    if (!editor) return;
    
    const url = prompt('링크 URL을 입력하세요:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  return {
    handleImageUpload,
    handleLinkInsert,
  };
};