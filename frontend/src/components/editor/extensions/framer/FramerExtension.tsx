import { Node, mergeAttributes, NodeViewProps } from '@tiptap/react';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { FramerView } from './FramerView';

export interface FramerOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/react' {
  interface Commands<ReturnType> {
    framer: {
      setFramer: (options: { projectUrl: string }) => ReturnType;
    };
  }
}

export interface FramerAttributes {
  projectUrl: string;
}

export const FramerExtension = Node.create<FramerOptions>({
  name: 'framer',
  
  group: 'block',
  
  atom: true,

  addAttributes() {
    return {
      projectUrl: {
        default: null as string | null,
        parseHTML: element => element.getAttribute('data-project-url'),
        renderHTML: attributes => {
          if (!attributes.projectUrl) return {};
          return mergeAttributes(
            {
              'data-project-url': attributes.projectUrl,
              'data-type': 'framer',
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
        tag: 'div[data-type="framer"]',
        getAttrs: element => {
          if (!(element instanceof HTMLElement)) return false;
          const projectUrl = element.getAttribute('data-project-url');
          return projectUrl ? { projectUrl } : null;
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
            projectUrl: props.node.attrs.projectUrl || ''
          }
        }
      };
      return <FramerView {...nodeProps} />;
    });
  },

  addCommands() {
    return {
      setFramer:
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
