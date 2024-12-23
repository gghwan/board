import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postService } from '../../services/postService';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import PropTypes from 'prop-types';

const PostList = ({ sortBy = 'latest' }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const fetchedPosts = await postService.listPosts(20, sortBy);
        setPosts(Array.isArray(fetchedPosts) ? fetchedPosts : []);
      } catch (err) {
        setError(err.response?.data?.error || '게시글을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [sortBy]);

  if (loading) return <div className="p-4 text-center">로딩 중...</div>;
  if (error) return <div className="p-4 text-red-500 text-center">{error}</div>;
  if (!posts.length) return <div className="p-4 text-center">게시글이 없습니다.</div>;

  return (
    <div>
      {posts.map(post => (
        <div key={post.id} className="p-4 hover:bg-gray-50 border-b border-gray-200">
          <div className="flex items-start space-x-4">
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">
                <Link 
                  to={`/posts/${post.id}?createdAt=${encodeURIComponent(post.createdAt)}`} 
                  className="hover:text-blue-600"
                >
                  {post.title || '제목 없음'}
                </Link>
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {post.content?.slice(0, 150) || '내용 없음'}
                {post.content?.length > 150 && '...'}
              </p>
              <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                <span>
                  <i className="fas fa-user-circle mr-1"></i>
                  {post.author?.username || '익명'}
                </span>
                <span>
                  <i className="fas fa-clock mr-1"></i>
                  {format(new Date(post.createdAt), 'PPP', { locale: ko })}
                </span>
                <span>
                  <i className="fas fa-eye mr-1"></i>
                  {post.viewCount || 0}
                </span>
                <span>
                  <i className="fas fa-comment mr-1"></i>
                  {post.commentCount || 0}
                </span>
                <span>
                  <i className="fas fa-heart mr-1"></i>
                  {post.likeCount || 0}
                </span>
                {post.category && (
                  <span className="text-blue-600">
                    <i className="fas fa-tag mr-1"></i>
                    {post.category}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

PostList.propTypes = {
  sortBy: PropTypes.string
};

export default PostList;
