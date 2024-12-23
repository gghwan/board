import { useState, useCallback, useEffect } from 'react';
import { useFileHandler, FileData } from '@/hooks/useFileHandler';

interface Post {
  id?: string;
  title: string;
  content: string;
  category: string;
  authorId?: string;
  authorName?: string;
  authorEmail?: string;
  status: 'published' | 'draft';
  createdAt: string;
  files?: FileData[];
}

interface PostFormHookProps {
  initialData: Post;
  onSuccess: (postData: Post) => Promise<void>;
}

export const usePostForm = ({ initialData, onSuccess }: PostFormHookProps) => {
  const [formData, setFormData] = useState<Post>({
    id: initialData.id,
    title: initialData.title,
    content: initialData.content,
    category: initialData.category,
    status: initialData.status || 'published',
    createdAt: initialData.createdAt,
    authorId: initialData.authorId,
    authorName: initialData.authorName,
    authorEmail: initialData.authorEmail
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const {
    files,
    selectedFile,
    handleFileUpload,
    handleFilePreview,
    handleFileDelete,
    setFiles
  } = useFileHandler();

  // 초기 파일 데이터 설정
  useEffect(() => {
    if (initialData.files?.length) {
      setFiles(initialData.files);
    }
  }, [initialData.files, setFiles]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (content: string) => {
    setFormData(prev => ({ ...prev, content }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const postData: Post = {
        ...formData,
        files: files.map(file => ({
          url: file.url,
          name: file.name,
          type: file.type,
          size: file.size
        }))
      };

      await onSuccess(postData);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || '게시글 저장에 실패했습니다.');
      } else {
        setError('게시글 저장에 실패했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  const closePreview = useCallback(() => {
    setIsPreviewOpen(false);
  }, []);

  const togglePreview = useCallback(() => {
    setIsPreviewOpen(prev => !prev);
  }, []);

  return {
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
    handleSubmit,
    handleFileUpload,
    handleFilePreview,
    handleFileDelete,
    closePreview,
    togglePreview
  };
};