import { useState } from 'react';
import { fileService } from '@/services/fileService';

export interface FileData {
  url: string;
  name: string;
  type: string;
  size: number;
  signedUrl?: string;
}

export interface FileHandlerResult {
  files: FileData[];
  selectedFile: FileData | null;
  isPreviewOpen: boolean;
  uploading: boolean;
  error: string | null;
  handleFileUpload: (files: FileList, type: string) => Promise<FileData[]>;
  handleFilePreview: (file: FileData) => Promise<void>;
  handleFileDelete: (file: FileData) => void;
  closePreview: () => void;
  setFiles: React.Dispatch<React.SetStateAction<FileData[]>>;
}

export const useFileHandler = (): FileHandlerResult => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileData | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (uploadedFiles: FileList, type: string): Promise<FileData[]> => {
    setUploading(true);
    setError(null);

    try {
      const uploadPromises = Array.from(uploadedFiles).map(file => 
        fileService.uploadFile(file, type)
      );

      const uploadedFileResults = await Promise.all(uploadPromises);
      setFiles(prev => [...prev, ...uploadedFileResults]);
      
      return uploadedFileResults;
    } catch (error) {
      setError('파일 업로드에 실패했습니다.');
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleFilePreview = async (file: FileData): Promise<void> => {
    try {
      if (file.url) {
        const signedUrl = await fileService.getSignedUrl(file.url);
        setSelectedFile({ ...file, signedUrl });
        setIsPreviewOpen(true);
      }
    } catch (error) {
      console.error('파일 미리보기 실패:', error);
    }
  };

  const handleFileDelete = (fileToDelete: FileData): void => {
    setFiles(prev => prev.filter(file => file.url !== fileToDelete.url));
  };

  const closePreview = (): void => {
    setIsPreviewOpen(false);
    setSelectedFile(null);
  };

  return {
    files,
    selectedFile,
    isPreviewOpen,
    uploading,
    error,
    handleFileUpload,
    handleFilePreview,
    handleFileDelete,
    closePreview,
    setFiles
  };
};