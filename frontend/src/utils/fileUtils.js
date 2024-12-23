export const FILE_TYPES = {
    PDF: 'pdf',
    WORD: 'word',
    TEXT: 'text',
    IMAGE: 'image'
  };
  
  export const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };
  
  export const getFileType = (mimeType) => {
    if (!mimeType) return FILE_TYPES.TEXT;
    
    if (mimeType.startsWith('image/')) return FILE_TYPES.IMAGE;
    if (mimeType === 'application/pdf') return FILE_TYPES.PDF;
    if (mimeType.includes('word')) return FILE_TYPES.WORD;
    return FILE_TYPES.TEXT;
  };
  
  export const needsSignedUrl = (fileType) => {
    return [FILE_TYPES.PDF, FILE_TYPES.WORD, FILE_TYPES.TEXT].includes(fileType);
  };
  
  export const getMimeTypeFromFileType = (fileType) => {
    switch (fileType) {
      case FILE_TYPES.IMAGE: return 'image/jpeg';
      case FILE_TYPES.PDF: return 'application/pdf';
      case FILE_TYPES.WORD: return 'application/msword';
      case FILE_TYPES.TEXT: return 'text/plain';
      default: return 'application/octet-stream';
    }
  };
  
  export const createAttachmentData = (file) => ({
    name: file.name,
    size: file.size,
    url: file.url,
    mimeType: getMimeTypeFromFileType(file.type),
    type: file.type,
    key: file.url.split('/').pop()
  });