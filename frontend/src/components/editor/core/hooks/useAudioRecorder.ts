import { useState, useCallback } from 'react';
import { Editor } from '@tiptap/react';

export const useAudioRecorder = (editor: Editor, onFileUpload?: (file: File) => Promise<string>) => {
  const [isRecording, setIsRecording] = useState(false);

  const handleSave = useCallback(async (blob: Blob) => {
    if (!editor || !onFileUpload) return;

    try {
      const file = new File([blob], 'recording.mp3', { type: 'audio/mpeg' });
      const url = await onFileUpload(file);
      
      editor.chain()
        .focus()
        .setAudio({ src: url })
        .run();
    } catch (error) {
      console.error('오디오 저장 실패:', error);
    }
  }, [editor, onFileUpload]);

  return {
    isRecording,
    setIsRecording,
    handleSave,
  };
};