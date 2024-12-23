import axios from 'axios';

interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  authorId: string;
  authorName: string;
  authorEmail: string;
  status: 'published' | 'draft';
  createdAt: string;
  files?: FileData[];
  comments?: Comment[];
}

interface FileData {
  url: string;
  name: string;
  type: string;
  size: number;
}

interface Comment {
  id: string;
  content: string;
  authorId: string;
  createdAt: string;
}

const BASE_URL = 'http://localhost:3000/api';

export const postService = {
  async listPosts(limit = 20, sort: 'latest' | 'oldest' = 'latest'): Promise<Post[]> {
    try {
      const response = await axios.get(`${BASE_URL}/posts`, {
        params: { limit, sort }
      });
      return response.data;
    } catch (error) {
      console.error('게시글 목록 조회 실패:', error);
      throw error;
    }
  },

  async createPost(postData: Partial<Post>): Promise<Post> {
    const response = await axios.post(`${BASE_URL}/posts`, {
      ...postData,
      authorId: 'temp-user-id',
      authorName: '임시 사용자', 
      authorEmail: 'temp@example.com',
      status: 'published',
      createdAt: new Date().toISOString()
    });
    return response.data;
  },

  async updatePost(id: string, postData: Partial<Post>): Promise<Post> {
    const response = await axios.put(`${BASE_URL}/posts/${id}`, postData);
    return response.data;
  },

  async getPost(id: string, createdAt: string): Promise<Post> {
    try {
      const response = await axios.get(`${BASE_URL}/posts/${id}`, {
        params: { createdAt }
      });
      return response.data;
    } catch (error) {
      console.error('게시글 조회 실패:', error);
      throw error;
    }
  },

  async deletePost(id: string, createdAt: string): Promise<void> {
    await axios.delete(`${BASE_URL}/posts/${id}`, {
      params: { createdAt }
    });
  },

  async likePost(id: string): Promise<Post> {
    const response = await axios.post(`${BASE_URL}/posts/${id}/like`);
    return response.data;
  },

  async getComments(postId: string, createdAt: string): Promise<Comment[]> {
    try {
      const response = await axios.get(`${BASE_URL}/posts/${postId}`, {
        params: { createdAt }
      });
      return response.data.comments || [];
    } catch (error) {
      console.error('댓글 조회 실패:', error);
      throw error;
    }
  },

  async addComment(postId: string, commentData: Partial<Comment>): Promise<Comment> {
    try {
      const createdAt = new URLSearchParams(window.location.search).get('createdAt');
      if (!createdAt) {
        throw new Error('게시글 작성일자가 필요합니다.');
      }

      const response = await axios.post(
        `${BASE_URL}/posts/${postId}/comments`,
        { ...commentData, createdAt },
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('댓글 작성 실패:', error);
      throw error;
    }
  },

  async updateComment(postId: string, commentId: string, content: string): Promise<Comment> {
    try {
      const createdAt = new URLSearchParams(window.location.search).get('createdAt');
      if (!createdAt) {
        throw new Error('게시글 작성일자가 필요합니다.');
      }

      const response = await axios.put(
        `${BASE_URL}/posts/${postId}/comments/${commentId}`,
        { content, createdAt },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      console.error('댓글 수정 실패:', error);
      throw error;
    }
  },

  async deleteComment(postId: string, commentId: string): Promise<void> {
    try {
      await axios.delete(`${BASE_URL}/posts/${postId}/comments/${commentId}`, {
        params: { createdAt: new URLSearchParams(window.location.search).get('createdAt') }
      });
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
      throw error;
    }
  }
};