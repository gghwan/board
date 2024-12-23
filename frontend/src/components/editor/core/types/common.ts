export type FileType = 'image' | 'audio' | 'video' | 'document';

export interface BaseFile {
  url: string;
  name: string;
  type: string;
  size: number;
}

export interface FileData extends BaseFile {
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

export type ExtensionType = 
  | 'excalidraw'
  | 'drawing'
  | 'figma'
  | 'framer'
  | 'diagram'
  | 'audio';