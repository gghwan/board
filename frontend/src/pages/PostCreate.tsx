import { useNavigate } from 'react-router-dom';
import PostForm from '@/components/post/PostForm';
import { usePostForm } from '@/hooks/usePostForm';
import { postService } from '@/services/postService';
import { EditorProvider } from '@/components/editor/core/contexts/EditorContext';
import { Post } from '@/components/editor/core/types/post';

const PostCreate = () => {
  const navigate = useNavigate();
  
  const {
    formData,
    error,
    loading,
    files,
    selectedFile,
    isPreviewOpen,
    handleChange,
    handleEditorChange,
    handleSubmit: handleFormSubmit,
    handleFileUpload,
    handleFilePreview,
    handleFileDelete,
    closePreview,
    togglePreview
  } = usePostForm({
    initialData: {
      title: '',
      content: '',
      category: 'technology',
      status: 'published' as const,
      createdAt: new Date().toISOString(),
      files: []
    },
    onSuccess: async (postData: Post) => {
      const newPost = await postService.createPost(postData);
      navigate(`/posts/${newPost.id}`);
    }
  });

  return (
    <EditorProvider>
      <PostForm
        formData={formData}
        error={error}
        loading={loading}
        files={files}
        selectedFile={selectedFile}
        isPreviewOpen={isPreviewOpen}
        onSubmit={handleFormSubmit}
        onChange={handleChange}
        onEditorChange={handleEditorChange}
        onFileUpload={async (file: File) => {
          const uploadedFiles = await handleFileUpload([file], file.type);
          return uploadedFiles[0].url;
        }}
        onFilePreview={handleFilePreview}
        onFileDelete={handleFileDelete}
        onClosePreview={closePreview}
        onTogglePreview={togglePreview}
      />
    </EditorProvider>
  );
};

export default PostCreate;
