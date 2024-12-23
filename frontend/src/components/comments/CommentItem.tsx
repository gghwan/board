import { useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { formatDate } from '@/utils/dateUtils';
import { Comment } from '@/components/editor/core/types/comment';

interface CommentItemProps {
  comment: Comment;
  onUpdate: (id: string, data: { content: string; createdAt: string }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const CommentItem = ({ comment, onUpdate, onDelete }: CommentItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editContent.trim()) return;

    try {
      setLoading(true);
      setError(null);
      await onUpdate(comment.id, {
        content: editContent,
        createdAt: comment.createdAt
      });
      setIsEditing(false);
    } catch (error) {
      setError('댓글 수정에 실패했습니다.');
      console.error('댓글 수정 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('댓글을 삭제하시겠습니까?')) return;

    try {
      setLoading(true);
      await onDelete(comment.id);
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center space-x-2">
          <span className="font-medium">{comment.author?.username || '익명'}</span>
          <span className="text-gray-500 text-sm">
            {formatDate(comment.createdAt)}
            {comment.updatedAt && ' (수정됨)'}
          </span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-gray-500 hover:text-gray-700"
            disabled={loading}
          >
            <i className="fas fa-edit"></i>
          </button>
          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700"
            disabled={loading}
          >
            <i className="fas fa-trash-alt"></i>
          </button>
        </div>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <div data-color-mode="light">
            <MDEditor
              value={editContent}
              onChange={(value?: string) => setEditContent(value || '')}
              preview="edit"
              previewOptions={{
                sanitize: true
              }}
              height={150}
            />
          </div>
          <div className="flex justify-end space-x-2 mt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 text-gray-600 hover:text-gray-800"
              disabled={loading}
            >
              취소
            </button>
            <button
              type="submit"
              className="px-3 py-1 bg-custom text-white rounded hover:bg-custom/90 disabled:opacity-50"
              disabled={loading || !editContent.trim()}
            >
              {loading ? '수정 중...' : '수정 완료'}
            </button>
          </div>
        </form>
      ) : (
        <div className="prose max-w-none mt-2">
          <MDEditor.Markdown 
            source={comment.content} 
          />
        </div>
      )}
    </div>
  );
};

export default CommentItem;