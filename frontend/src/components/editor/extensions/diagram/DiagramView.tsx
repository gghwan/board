import { NodeViewWrapper } from '@tiptap/react';
import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import { useEditorContext } from '../../core/contexts/EditorContext';
import { DiagramNodeViewProps } from '../../core/types/extensions';

export const DiagramView = ({ node, updateAttributes }: DiagramNodeViewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isDiagramModalOpen, setEditorMode } = useEditorContext();

  useEffect(() => {
    if (!containerRef.current || !node.attrs.data) return;

    const renderDiagram = async () => {
      try {
        await mermaid.initialize({
          startOnLoad: true,
          theme: 'default',
          securityLevel: 'loose',
        });
        
        const { svg } = await mermaid.render(
          `diagram-${node.attrs.id}`,
          node.attrs.data
        );
        
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch (error) {
        console.error('다이어그램 렌더링 실패:', error);
      }
    };

    renderDiagram();
  }, [node.attrs.data, node.attrs.id]);

  const handleDiagramEdit = () => {
    setEditorMode('isDiagramModalOpen', true);
  };

  return (
    <NodeViewWrapper>
      <div className="diagram-wrapper border rounded-lg p-4">
        <div 
          ref={containerRef} 
          className="diagram-container"
          onClick={handleDiagramEdit}
        />
        {isDiagramModalOpen && (
          <div className="diagram-editor mt-4">
            <textarea
              value={node.attrs.data}
              onChange={(e) => updateAttributes({ data: e.target.value })}
              className="w-full h-32 p-2 border rounded"
              placeholder="여기에 Mermaid 다이어그램 코드를 입력하세요..."
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={() => setEditorMode('isDiagramModalOpen', false)}
                className="px-4 py-2 text-sm bg-gray-100 rounded hover:bg-gray-200"
              >
                닫기
              </button>
            </div>
          </div>
        )}
      </div>
    </NodeViewWrapper>
  );
};
