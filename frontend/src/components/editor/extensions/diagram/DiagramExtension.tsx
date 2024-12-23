import { Node, mergeAttributes } from '@tiptap/react';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { DiagramView } from './DiagramView';
import { BaseNodeOptions, DiagramAttributes } from '../../core/types/extensions';
import { getExtensionConfig } from '../../core/types/extensions';

declare module '@tiptap/react' {
  interface Commands<ReturnType> {
    diagram: {
      setDiagram: (options: DiagramAttributes) => ReturnType;
    };
  }
}

export const DiagramExtension = Node.create<BaseNodeOptions>({
  name: 'diagram',
  ...getExtensionConfig('diagram'),

  addAttributes() {
    return {
      id: {
        default: null,
        parseHTML: element => element.getAttribute('data-id'),
        renderHTML: attributes => {
          if (!attributes.id) return {};
          return { 'data-id': attributes.id };
        },
      },
      data: {
        default: '',
        parseHTML: element => element.getAttribute('data-diagram'),
        renderHTML: attributes => {
          if (!attributes.data) return {};
          return {
            'data-diagram': attributes.data,
            'data-type': 'diagram',
          };
        },
      },
      type: {
        default: 'flowchart',
        parseHTML: element => element.getAttribute('data-diagram-type'),
        renderHTML: attributes => {
          if (!attributes.type) return {};
          return { 'data-diagram-type': attributes.type };
        },
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="diagram"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(DiagramView as any);
  },

  addCommands() {
    return {
      setDiagram: options => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: options,
        });
      },
    };
  },
});
