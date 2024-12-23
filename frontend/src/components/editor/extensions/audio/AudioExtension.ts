import { Node, mergeAttributes, NodeViewProps } from '@tiptap/react';
import { ReactNodeViewRenderer } from '@tiptap/react';


export interface AudioOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/react' {
  interface Commands<ReturnType> {
    audio: {
      setAudio: (options: { src: string }) => ReturnType;
    };
  }
}

export const AudioExtension = Node.create<AudioOptions>({
  name: 'audio',
  group: 'block',
  atom: true,
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
        parseHTML: element => element.getAttribute('data-src'),
        renderHTML: attributes => {
          if (!attributes.src) return {};
          return {
            'data-src': attributes.src,
            'data-type': 'audio'
          };
        }
      }
    };
  },

  parseHTML() {
    return [{
      tag: 'div[data-type="audio"]',
      getAttrs: element => {
        if (!(element instanceof HTMLElement)) return false;
        const src = element.getAttribute('data-src');
        return src ? { src } : null;
      }
    }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer((props: NodeViewProps) => {
      const nodeProps = {
        node: {
          attrs: {
            src: props.node.attrs.src || ''
          }
        }
      };
      return <AudioView {...nodeProps} />;
    });
  },

  addCommands() {
    return {
      setAudio: options => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: options
        });
      }
    };
  }
});