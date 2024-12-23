import { Node, mergeAttributes } from '@tiptap/react';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { DrawingView } from './DrawingView';
import { BaseNodeOptions, DrawingAttributes } from '../../core/types/extensions';

declare module '@tiptap/react' {
  interface Commands<ReturnType> {
    drawing: {
      setDrawing: (options: DrawingAttributes) => ReturnType;
    };
  }
}

export const DrawingExtension = Node.create<BaseNodeOptions>({
  name: 'drawing',
  group: 'block',
  atom: true,
  selectable: true,
  draggable: true,
  inline: false,

  addAttributes() {
    return {
      data: {
        default: null,
        parseHTML: element => {
          const data = element.getAttribute('data-drawing');
          return data ? JSON.parse(data) : null;
        },
        renderHTML: attributes => {
          if (!attributes.data) return {};
          return {
            'data-drawing': JSON.stringify(attributes.data),
            'data-type': 'drawing',
          };
        },
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="drawing"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(DrawingView);
  },

  addCommands() {
    return {
      setDrawing: options => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: options,
        });
      },
    };
  },
});
