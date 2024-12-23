import { useNavigate } from 'react-router-dom';
import IntegratedEditor from '../editor/IntegratedEditor';
import FilePreviewModal from '@/components/file/previews/FilePreviewModal';
import { useEditorContext } from '../editor/core/contexts/EditorContext';
import { PostFormProps } from '../editor/core/types/post';

const PostForm = ({
  formData,
  error,
  loading,
  files,
  selectedFile,
  isPreviewOpen,
  onSubmit,
  onChange,
  onEditorChange,
  onFileUpload,
  onFilePreview,
  onFileDelete,
  onClosePreview,
  onTogglePreview,
}: PostFormProps) => {
  const navigate = useNavigate();
  const { isPreviewMode, setEditorMode } = useEditorContext();

  const handleTogglePreview = () => {
    setEditorMode('isPreviewMode', !isPreviewMode);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        {formData.id ? '게시글 수정' : '새 게시글 작성'}
      </h2>

      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={onChange}
            className="w-full rounded-md border-gray-300 focus:border-custom focus:ring-custom"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">카테고리</label>
          <select
            name="category"
            value={formData.category}
            onChange={onChange}
            className="w-full rounded-md border-gray-300 focus:border-custom focus:ring-custom"
          >
            <option value="technology">기술</option>
            <option value="career">커리어</option>
            <option value="life">라이프</option>
          </select>
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">내용</label>
          <div className="border border-gray-200 rounded-lg">
            <IntegratedEditor
              value={formData.content}
              onChange={onEditorChange}
              onFileUpload={onFileUpload}
              readOnly={false}
              placeholder="내용을 입력하세요..."
              isPreviewMode={isPreviewMode}
              onTogglePreview={handleTogglePreview}
            />
          </div>
        </div>

        {files && files.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">첨부 파일</h3>
            <ul className="space-y-2">
              {files.map((file) => (
                <li key={file.url} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{file.name}</span>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => onFilePreview?.(file)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      보기
                    </button>
                    <button
                      type="button"
                      onClick={() => onFileDelete?.(file)}
                      className="text-red-600 hover:text-red-800"
                    >
                      삭제
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex items-center space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-custom text-white px-6 py-2 rounded hover:bg-custom/90 disabled:opacity-50"
          >
            {loading ? '처리 중...' : (formData.id ? '수정하기' : '작성하기')}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="border border-gray-300 px-6 py-2 rounded hover:bg-gray-50"
          >
            취소
          </button>
        </div>

        {error && (
          <div className="text-red-500 text-sm mt-2">{error}</div>
        )}
      </form>

      {isPreviewOpen && selectedFile && (
        <FilePreviewModal
          file={selectedFile}
          onClose={onClosePreview || (() => {})}
        />
      )}
    </div>
  );
};

export default PostForm;