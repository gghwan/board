import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { postService } from '../../services/postService';
import IntegratedEditor from '../editor/IntegratedEditor';
import { useEditorContext } from '../editor/core/contexts/EditorContext';
import { Comment, CommentData } from '../editor/core/types/comment';

interface CommentFormProps {
  postId: string;
  onCommentAdded: (comment: Comment) => void;
}

const CommentForm = ({ postId, onCommentAdded }: CommentFormProps) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isPreviewMode, setEditorMode } = useEditorContext();
  const location = useLocation();
  const createdAt = new URLSearchParams(location.search).get('createdAt');

  const handleFileUpload = async (files: FileList | null, type: string) => {
    if (!files?.length) return;
    
    const formData = new FormData();
    formData.append('file', files[0]);

    try {
      const response = await axios.post(`http://localhost:3000/api/upload/${type}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const fileUrl = response.data.imageUrl;
      const markdown = type === 'image' 
        ? `![${files[0].name}](${fileUrl})`
        : `[${files[0].name}](${fileUrl})`;
      setContent(prev => prev + '\n' + markdown);
    } catch (error) {
      setError('파일 업로드에 실패했습니다.');
      console.error('파일 업로드 실패:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !createdAt) return;

    try {
      setLoading(true);
      setError(null);
      
      const commentData: CommentData = {
        content,
        author: {
          id: `temp-user-${uuidv4().split('-')[0]}`,
          username: '임시 사용자'
        }
      };
      
      const newComment = await postService.addComment(postId, commentData);
      setContent('');
      
      if (onCommentAdded) {
        onCommentAdded(newComment);
      }
    } catch (err) {
      console.error('댓글 작성 실패:', err);
      setError('댓글 작성에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}
      <div className="border border-gray-200 rounded-lg">
        <div className="flex border-b border-gray-200 p-2 gap-2 bg-gray-50">
          <button
            type="button"
            className="p-2 hover:bg-gray-200 rounded"
            title="이미지 첨부"
            onClick={() => document.getElementById('comment-image-upload')?.click()}
          >
            <i className="fas fa-image"></i>
          </button>
          <button
            type="button"
            className="p-2 hover:bg-gray-200 rounded"
            title="미리보기"
            onClick={() => setEditorMode(!isPreviewMode)}
          >
            <i className="fas fa-eye"></i>
          </button>
        </div>
        <IntegratedEditor
          value={content}
          onChange={setContent}
          onFileUpload={handleFileUpload}
          onTogglePreview={() => setEditorMode(!isPreviewMode)}
          isPreviewMode={isPreviewMode}
        />
      </div>
      <input
        type="file"
        id="comment-image-upload"
        className="hidden"
        accept="image/*"
        onChange={(e) => handleFileUpload(e.target.files, 'image')}
      />
      <button
        type="submit"
        disabled={loading || !content.trim()}
        className="px-4 py-2 bg-custom text-white rounded-lg hover:bg-custom/90 disabled:opacity-50"
      >
        {loading ? '작성 중...' : '댓글 작성'}
      </button>
    </form>
  );
};

export default CommentForm;