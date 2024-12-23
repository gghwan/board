import { Node, mergeAttributes, NodeViewProps } from '@tiptap/react';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { FigmaView } from './FigmaView';

export interface FigmaOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/react' {
  interface Commands<ReturnType> {
    figma: {
      setFigma: (options: { fileUrl: string }) => ReturnType;
    };
  }
}

export interface FigmaAttributes {
  fileUrl: string;
}

export const FigmaExtension = Node.create<FigmaOptions>({
  name: 'figma',
  
  group: 'block',
  
  atom: true,

  addAttributes() {
    return {
      fileUrl: {
        default: null as string | null,
        parseHTML: element => element.getAttribute('data-file-url'),
        renderHTML: attributes => {
          if (!attributes.fileUrl) return {};
          return mergeAttributes(
            {
              'data-file-url': attributes.fileUrl,
              'data-type': 'figma',
            },
            this.options.HTMLAttributes
          );
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="figma"]',
        getAttrs: element => {
          if (!(element instanceof HTMLElement)) return false;
          const fileUrl = element.getAttribute('data-file-url');
          return fileUrl ? { fileUrl } : null;
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer((props: NodeViewProps) => {
      const nodeProps = {
        node: {
          attrs: {
            fileUrl: props.node.attrs.fileUrl || ''
          }
        }
      };
      return <FigmaView {...nodeProps} />;
    });
  },

  addCommands() {
    return {
      setFigma:
        options =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },
});
