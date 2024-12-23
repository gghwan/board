import { NodeViewWrapper, NodeViewProps } from '@tiptap/react';

export const EmojiView = (props: NodeViewProps) => {
  const { node } = props;
  
  return (
    <NodeViewWrapper as="span">
      <span className="emoji-wrapper">
        {node.attrs.emoji}
      </span>
    </NodeViewWrapper>
  );
};