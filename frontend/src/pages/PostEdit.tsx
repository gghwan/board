import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PostForm from '@/components/post/PostForm';
import { usePostForm } from '@/hooks/usePostForm';
import { postService } from '@/services/postService';
import { EditorProvider } from '@/components/editor/core/contexts/EditorContext';
import { Post } from '@/components/editor/core/types/post';

const PostEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const {
    formData,
    setFormData,
    error,
    loading,
    files,
    setFiles,
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
      id,
      title: '',
      content: '',
      category: 'technology',
      status: 'published' as const,
      createdAt: new Date().toISOString(),
      files: []
    },
    onSuccess: async (postData: Post) => {
      if (!id) return;
      await postService.updatePost(id, postData);
      navigate(`/posts/${id}`);
    }
  });

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) {
        navigate('/404');
        return;
      }
      try {
        const post = await postService.getPost(id, formData.createdAt || '');
        setFormData({
          id,
          title: post.title,
          content: post.content,
          category: post.category || 'technology',
          status: post.status,
          createdAt: post.createdAt,
          authorId: post.authorId,
          authorName: post.authorName,
          authorEmail: post.authorEmail
        });
        
        if (post.files?.length) {
          setFiles(post.files);
        }
      } catch (error) {
        console.error('게시글 조회 실패:', error);
        navigate('/404');
      }
    };

    fetchPost();
  }, [id, setFormData, setFiles, navigate, formData.createdAt]);

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

export default PostEdit;