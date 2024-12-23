import { Node, mergeAttributes } from '@tiptap/react';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { EmojiView } from './EmojiView';

export interface EmojiOptions {
  HTMLAttributes: Record<string, any>;
}

interface EmojiAttributes {
  emoji: string;
}

declare module '@tiptap/react' {
  interface Commands<ReturnType> {
    emoji: {
      setEmoji: (options: EmojiAttributes) => ReturnType;
    };
  }
}

export const EmojiExtension = Node.create<EmojiOptions>({
  name: 'emoji',
  inline: true,
  group: 'inline',
  atom: true,

  addAttributes() {
    return {
      emoji: {
        default: null,
        parseHTML: element => element.getAttribute('data-emoji'),
        renderHTML: attributes => {
          if (!attributes.emoji) return {};
          return {
            'data-emoji': attributes.emoji,
            'data-type': 'emoji',
          };
        },
      },
    };
  },

  parseHTML() {
    return [{ tag: 'span[data-type="emoji"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes({ 'data-type': 'emoji' }, HTMLAttributes), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(EmojiView);
  },

  addCommands() {
    return {
      setEmoji:
        (options: EmojiAttributes) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },
});