import { Node, mergeAttributes } from '@tiptap/react';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { ExcalidrawView } from './ExcalidrawView';
import { BaseNodeOptions, ExcalidrawAttributes } from '../../core/types/extensions';

declare module '@tiptap/react' {
  interface Commands<ReturnType> {
    excalidraw: {
      setExcalidraw: (options: ExcalidrawAttributes) => ReturnType;
    };
  }
}

export const ExcalidrawExtension = Node.create<BaseNodeOptions>({
  name: 'excalidraw',
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
          const data = element.getAttribute('data-excalidraw');
          return data ? JSON.parse(data) : null;
        },
        renderHTML: attributes => {
          if (!attributes.data) return {};
          return {
            'data-excalidraw': JSON.stringify(attributes.data),
            'data-type': 'excalidraw',
          };
        },
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="excalidraw"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ExcalidrawView);
  },

  addCommands() {
    return {
      setExcalidraw: options => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: options,
        });
      },
    };
  },
});
