export interface Comment {
    id: string;
    content: string;
    author?: {
      id?: string;
      username?: string;
    };
    createdAt: string;
    updatedAt?: string;
  }
  
  export interface CommentData {
    content: string;
    author: {
      id: string;
      username: string;
    };
  }