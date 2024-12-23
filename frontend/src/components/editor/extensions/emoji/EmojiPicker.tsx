import { useEditorContext } from '../../core/contexts/EditorContext';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { Editor } from '@tiptap/react';

interface EmojiPickerProps {
  editor: Editor;
  onClose: () => void;
}

const EmojiPicker = ({ editor, onClose }: EmojiPickerProps) => {
  const { isEmojiPickerOpen, setEditorMode } = useEditorContext();

  if (!isEmojiPickerOpen) return null;

  const handleSelect = (emoji: any) => {
    editor.commands.setEmoji({ emoji: emoji.native });
    setEditorMode('isEmojiPickerOpen', false);
    onClose();
  };

  return (
    <div className="absolute z-50 bg-white rounded-lg shadow-lg">
      <Picker
        data={data}
        onEmojiSelect={handleSelect}
        theme="light"
        locale="ko"
      />
    </div>
  );
};

export default EmojiPicker;