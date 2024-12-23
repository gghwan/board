import { useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import rehypeSanitize from 'rehype-sanitize';
import axios from 'axios';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';

const CommentEditor = ({ onSubmit, initialValue = '', disabled, loading }) => {
  const [content, setContent] = useState(initialValue);
  const [error, setError] = useState(null);

  const handleImageUpload = async (file) => {
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:3000/api/upload/drawing', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const imageUrl = response.data.imageUrl;
      const imageMarkdown = `![${file.name}](${imageUrl})`;
      setContent(prev => prev + '\n' + imageMarkdown);
    } catch (error) {
      setError('이미지 업로드에 실패했습니다.');
      console.error('이미지 업로드 실패:', error);
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      onSubmit(content);
    }} className="space-y-4">
      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}
      <div className="flex flex-col space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <label className="cursor-pointer px-2 py-1 bg-gray-100 rounded hover:bg-gray-200">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageUpload(e.target.files[0])}
              disabled={disabled}
            />
            <i className="fas fa-image mr-1"></i> 이미지 첨부
          </label>
        </div>
        <div className="border rounded-lg overflow-hidden">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-3 min-h-[100px] border-b"
            placeholder="댓글을 작성하세요..."
            disabled={disabled}
          />
          {content && (
            <div className="p-3 bg-gray-50">
              <ReactMarkdown
                children={content}
                components={{
                  img: ({node, ...props}) => (
                    <img
                      {...props}
                      className="max-w-full h-auto rounded my-2"
                      style={{maxHeight: '300px'}}
                      alt={props.alt || '이미지'}
                    />
                  )
                }}
              />
            </div>
          )}
        </div>
        <button
          type="submit"
          disabled={loading || disabled || !content.trim()}
          className="self-end px-4 py-2 bg-custom text-white rounded-lg hover:bg-custom/90 disabled:opacity-50"
        >
          {loading ? '작성 중...' : '댓글 작성'}
        </button>
      </div>
    </form>
  );
};

CommentEditor.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  initialValue: PropTypes.string,
  disabled: PropTypes.bool,
  loading: PropTypes.bool
};

export default CommentEditor;