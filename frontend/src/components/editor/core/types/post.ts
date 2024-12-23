import { FileData } from '@/hooks/useFileHandler';

export interface Post {
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

export interface PostFormProps {
  formData: Post;
  error: string | null;
  loading: boolean;
  files: FileData[];
  selectedFile: FileData | null;
  isPreviewOpen: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onEditorChange: (value: string) => void;
  onFileUpload: (file: File) => Promise<string>;
  onFilePreview: (file: FileData) => Promise<void>;
  onFileDelete: (file: FileData) => void;
  onClosePreview: () => void;
  onTogglePreview: () => void;
}