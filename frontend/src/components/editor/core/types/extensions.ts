import { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types';
import type { AppState, BinaryFiles } from '@excalidraw/excalidraw/types/types';
import { fabric } from 'fabric';
import { Editor, NodeViewProps, Node } from '@tiptap/react';
import { FileData, ExtensionType } from './common';

// Base Types
export interface BaseNodeOptions {
  HTMLAttributes: Record<string, any>;
  draggable?: boolean;
  selectable?: boolean;
  atom?: boolean;
}

export interface BaseNodeAttributes {
  id?: string;
  data?: any;
}

export interface BaseNodeViewProps extends Omit<NodeViewProps, 'node'> {
  node: Node & {
    attrs: BaseNodeAttributes;
  };
  updateAttributes: (attrs: Partial<BaseNodeAttributes>) => void;
  extension: Node;
  selected: boolean;
  editor: Editor;
}

// Extension Data Types
export interface ExcalidrawData {
  elements: readonly ExcalidrawElement[];
  appState: AppState;
  files: BinaryFiles;
  preview?: string;
}

export interface DrawingData {
  canvas: fabric.Canvas | null;
  objects: fabric.Object[];
  background: string;
}

// Extension Attributes
export interface ExcalidrawAttributes extends BaseNodeAttributes {
  data: ExcalidrawData | null;
}

export interface DrawingAttributes extends BaseNodeAttributes {
  data: DrawingData | null;
}

export interface FigmaAttributes extends BaseNodeAttributes {
  fileUrl: string;
}

export interface FramerAttributes extends BaseNodeAttributes {
  fileUrl: string;
}

export interface DiagramAttributes extends BaseNodeAttributes {
  id: string;
  data: string;
  type?: DiagramData['type'];
}

export interface AudioAttributes extends BaseNodeAttributes {
  src: string;
  file?: FileData;
}

export type ExtensionAttributes = {
  [K in ExtensionType]: K extends 'excalidraw' ? ExcalidrawAttributes :
                        K extends 'drawing' ? DrawingAttributes :
                        K extends 'figma' ? FigmaAttributes :
                        K extends 'framer' ? FramerAttributes :
                        K extends 'diagram' ? DiagramAttributes :
                        K extends 'audio' ? AudioAttributes :
                        never;
};

export const getExtensionConfig = (type: ExtensionType) => ({
  HTMLAttributes: {
    class: `${type}-node`,
    'data-type': type
  },
  draggable: true,
  selectable: true,
  atom: true
});

export interface DiagramNodeViewProps extends BaseNodeViewProps {
  node: Node & {
    attrs: DiagramAttributes;
  };
  updateAttributes: (attrs: Partial<DiagramAttributes>) => void;
  extension: Node;
  selected: boolean;
  editor: Editor;
}

export interface DiagramData {
  content: string;
  type: 'flowchart' | 'sequence' | 'class' | 'state' | 'er';
}
