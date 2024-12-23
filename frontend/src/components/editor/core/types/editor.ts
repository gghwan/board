import { Editor } from '@tiptap/react';

// 예시: 프로젝트 내 공통 파일 관련 타입
export interface FileData {
  url: string;
  name: string;
  type: string;
  size: number;
  preview?: string;
}

export type EditorMode =
  | 'isPreviewMode'
  | 'isEmojiPickerOpen'
  | 'isDiagramModalOpen'
  | 'isAudioRecorderOpen'
  | 'isDrawingMode'
  | 'isExcalidrawMode'
  | 'isFigmaMode'
  | 'isFramerMode';

export interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  onFileUpload?: (file: File) => Promise<string>;
  isPreviewMode?: boolean;
  placeholder?: string;
  readOnly?: boolean;
}

export interface ToolbarProps {
  editor: Editor | null;
  onFileUpload?: (file: File) => Promise<string>;
}

export interface EditorContextType {
  editorType: string;
  isPreviewMode: boolean;
  isEmojiPickerOpen: boolean;
  isDiagramModalOpen: boolean;
  isAudioRecorderOpen: boolean;
  isDrawingMode: boolean;
  isExcalidrawMode: boolean;
  isFigmaMode: boolean;
  isFramerMode: boolean;
  setEditorMode: (mode: EditorMode, value: boolean) => void;
  handleDrawingSave: (editor: Editor, dataUrl: string) => void;
}

export interface EditorRef {
  getContent: () => string;
  setContent: (content: string) => void;
  focus: () => void;
  blur: () => void;
}
