import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { postService } from '../../services/postService';
import CommentItem from './CommentItem';

const CommentList = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const createdAt = new URLSearchParams(location.search).get('createdAt');

  const fetchComments = async () => {
    if (!postId || !createdAt) {
      setError('게시글 정보가 필요합니다.');
      return;
    }

    try {
      setLoading(true);
      const fetchedComments = await postService.getComments(postId, createdAt);
      setComments(fetchedComments.map(comment => ({
        ...comment,
        id: comment.id || `${postId}-comment-${uuidv4().split('-')[0]}`
      })));
    } catch (err) {
      console.error('댓글 조회 실패:', err);
      setError(err.response?.data?.error || '댓글을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId, createdAt]);

  const handleUpdate = async (commentId, content) => {
    if (!createdAt) return;
    
    try {
      await postService.updateComment(postId, commentId, content);
      fetchComments();
    } catch (err) {
      console.error('댓글 수정 실패:', err);
      throw err;
    }
  };

  const handleDelete = async (commentId) => {
    if (!createdAt) return;
    
    try {
      await postService.deleteComment(postId, commentId);
      fetchComments();
    } catch (err) {
      console.error('댓글 삭제 실패:', err);
      throw err;
    }
  };

  if (loading) return <div>댓글 로딩 중...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-4">
      {comments.map(comment => (
        <CommentItem
          key={comment.id}
          comment={comment}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      ))}
      {comments.length === 0 && (
        <div className="text-gray-500 text-center py-4">
          첫 번째 댓글을 작성해보세요!
        </div>
      )}
    </div>
  );
};

export default CommentList;