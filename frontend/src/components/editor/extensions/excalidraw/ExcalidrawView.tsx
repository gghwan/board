import { NodeViewWrapper, NodeViewProps } from '@tiptap/react';
import {
  Excalidraw,
  exportToBlob,
} from '@excalidraw/excalidraw';
import type {
  ExcalidrawImperativeAPI,
  AppState,
  BinaryFiles,
  BinaryFileData
} from '@excalidraw/excalidraw/types/types';
import { useState, useCallback } from 'react';
import { useEditorContext } from '../../core/contexts/EditorContext';
import { ExcalidrawData } from '../../core/types/extensions';
import { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types';

export const ExcalidrawView = (props: NodeViewProps) => {
  const { node, updateAttributes } = props;
  const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI | null>(null);
  const { isExcalidrawMode, setEditorMode } = useEditorContext();

  const handleChange = useCallback(async (
    elements: readonly ExcalidrawElement[],
    appState: AppState,
    files: BinaryFiles
  ) => {
    if (!excalidrawAPI) return;

    const blob = await exportToBlob({
      elements,
      appState,
      files,
      mimeType: 'image/png'
    });

    const reader = new FileReader();
    reader.onloadend = () => {
      const binaryFiles: BinaryFiles = {};
      Object.entries(excalidrawAPI.getFiles()).forEach(([id, blob]) => {
        binaryFiles[id] = {
          id,
          mimeType: blob.mimeType,
          dataURL: blob.dataURL || '',
          created: Date.now()
        } as BinaryFileData;
      });

      const data: ExcalidrawData = {
        elements: [...elements],
        appState,
        files: binaryFiles,
        preview: reader.result as string,
      };
      updateAttributes({ data });
    };
    reader.readAsDataURL(blob);
  }, [excalidrawAPI, updateAttributes]);

  return (
    <NodeViewWrapper>
      <div className="excalidraw-wrapper relative border rounded-lg overflow-hidden" style={{ height: '400px' }}>
        <Excalidraw
          excalidrawAPI={(api: ExcalidrawImperativeAPI | null) => setExcalidrawAPI(api)}
          onChange={handleChange}
          initialData={node.attrs.data || undefined}
          viewModeEnabled={!isExcalidrawMode}
        />
        {!isExcalidrawMode && (
          <div 
            className="absolute inset-0 bg-transparent cursor-pointer"
            onClick={() => setEditorMode('isExcalidrawMode', true)}
          />
        )}
      </div>
    </NodeViewWrapper>
  );
};