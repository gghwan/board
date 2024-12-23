import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { postService } from '../services/postService';
import MDEditor from '@uiw/react-md-editor';
import CommentList from '../components/comments/CommentList';
import CommentForm from '../components/comments/CommentForm';
import FilePreview from '../components/file/previews/FilePreview';
import FilePreviewModal from '../components/file/previews/FilePreviewModal';
import { useFileViewer } from '../hooks/useFileViewer';
import { formatDate } from '../utils/dateUtils';
import { getFileType } from '../utils/fileUtils';

// TypeScript 인터페이스를 PropTypes로 변경
const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const createdAt = new URLSearchParams(location.search).get('createdAt');
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    selectedFile,
    isPreviewOpen,
    handleFilePreview,
    closePreview
  } = useFileViewer();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        if (!id || !createdAt) return;
        const post = await postService.getPost(id, createdAt);
        setPost(post);
      } catch (err) {
        console.error('게시글 조회 에러:', err);
        setError(err instanceof Error ? err.message : '게시글을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id, createdAt]);

  const handleDelete = async () => {
    if (!id || !createdAt) return;
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await postService.deletePost(id, createdAt);
        navigate('/');
      } catch (err) {
        console.error('게시글 삭제 실패:', err);
      }
    }
  };

  if (loading) return <div className="text-center py-8">로딩 중...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
  if (!post) return <div className="text-center py-8">게시글을 찾을 수 없습니다.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <article className="bg-white rounded-lg shadow-sm p-6">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">{post.title}</h1>
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <span>{post.author?.name || '익명'}</span>
              <span>{formatDate(post.createdAt)}</span>
            </div>
          </div>

          <div className="prose max-w-none">
            <MDEditor.Markdown 
              source={post.content} 
              previewOptions={{
                sanitize: true
              }}
            />
          </div>

          {post.attachments?.length > 0 && (
            <div className="border rounded-lg p-4 mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                첨부 파일 ({post.attachments.length})
              </h3>
              <div className="space-y-2">
                {post.attachments.map((file, index) => (
                  <FilePreview
                    key={index}
                    file={{
                      name: file.name,
                      url: file.url,
                      size: file.size,
                      type: getFileType(file.mimeType)
                    }}
                    onPreview={() => handleFilePreview(file)}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(`/posts/${id}/edit`)}
                className="text-gray-600 hover:text-gray-900"
              >
                <i className="fas fa-edit mr-1"></i> 수정
              </button>
              <button
                onClick={handleDelete}
                className="text-red-600 hover:text-red-900"
              >
                <i className="fas fa-trash-alt mr-1"></i> 삭제
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <span className="flex items-center text-gray-400">
                <i className="far fa-comment mr-1"></i>
                <span>{post.commentCount || 0}</span>
              </span>
              <span className="flex items-center text-gray-400">
                <i className="far fa-eye mr-1"></i>
                <span>{post.viewCount || 0}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6 mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">댓글</h3>
          <CommentList postId={id} />
          <div className="mt-6">
            <CommentForm postId={id} onCommentAdded={() => window.location.reload()} />
          </div>
        </div>
      </article>

      {isPreviewOpen && selectedFile && (
        <FilePreviewModal
          file={selectedFile}
          onClose={closePreview}
        />
      )}
    </div>
  );
};

export default PostDetail;
