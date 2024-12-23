import { docClient } from '../config/dynamodb.js';
import { PutCommand, GetCommand, ScanCommand, DeleteCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from 'uuid';
import { uploadFile, deleteFile } from '../config/s3.js';

export class PostService {
  constructor() {
    this.tableName = "BoardPosts";
    this.docClient = docClient;
  }

  async createPost(postData) {
    const now = new Date().toISOString();
    
    const post = {
      id: uuidv4(),
      title: postData.title,
      content: postData.content,
      author: {
        id: postData.authorId,
        username: postData.authorName,
        email: postData.authorEmail
      },
      category: postData.category || "일반",
      tags: postData.tags || [],
      createdAt: now,
      updatedAt: now,
      viewCount: 0,
      likeCount: 0,
      commentCount: 0,
      status: "published",
      comments: [],
      attachments: postData.attachments || []
    };

    const command = new PutCommand({
      TableName: this.tableName,
      Item: post
    });

    try {
      await docClient.send(command);
      return post;
    } catch (error) {
      console.error('게시글 생성 실패:', error);
      throw error;
    }
  }

  async getPost(postId, createdAt) {
    console.log('getPost 호출:', { postId, createdAt });
    
    try {
      const command = new GetCommand({
        TableName: this.tableName,
        Key: {
          id: postId,
          createdAt
        }
      });

      const response = await this.docClient.send(command);
      console.log('getPost 응답:', response);
      
      if (response.Item) {
        return response.Item;
      }

      const scanCommand = new ScanCommand({
        TableName: this.tableName,
        FilterExpression: 'id = :id',
        ExpressionAttributeValues: {
          ':id': postId
        }
      });

      const scanResponse = await this.docClient.send(scanCommand);
      if (scanResponse.Items && scanResponse.Items.length > 0) {
        return scanResponse.Items[0];
      }

      return null;
    } catch (error) {
      console.error('getPost 에러:', error);
      throw error;
    }
  }

  async listPosts(limit = 20, sort = 'latest') {
    try {
      console.log('게시글 목록 조회 시작...', this.tableName);
      const command = new ScanCommand({
        TableName: this.tableName,
        Limit: limit
      });

      const response = await this.docClient.send(command);
      console.log('DynamoDB 응답:', response);
      
      const posts = response.Items || [];
      console.log('조회된 게시글 수:', posts.length);

      if (sort === 'latest') {
        posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }

      return posts;
    } catch (error) {
      console.error('게시글 목록 조회 실패:', error);
      throw error;
    }
  }

  async updatePost(postId, createdAt, updateData) {
    const now = new Date().toISOString();
    const command = new UpdateCommand({
      TableName: this.tableName,
      Key: {
        id: postId,
        createdAt: createdAt
      },
      UpdateExpression: "set title = :title, content = :content, updatedAt = :updatedAt",
      ExpressionAttributeValues: {
        ":title": updateData.title,
        ":content": updateData.content,
        ":updatedAt": now
      },
      ReturnValues: "ALL_NEW"
    });

    try {
      const response = await docClient.send(command);
      return response.Attributes;
    } catch (error) {
      console.error("Error updating post:", error);
      throw new Error("Failed to update post");
    }
  }

  async deletePost(postId, createdAt) {
    const command = new DeleteCommand({
      TableName: this.tableName,
      Key: {
        id: postId,
        createdAt: createdAt
      }
    });

    try {
      await docClient.send(command);
      return true;
    } catch (error) {
      console.error("Error deleting post:", error);
      throw new Error("Failed to delete post");
    }
  }

  async addComment(postId, postCreatedAt, commentData) {
    try {
      if (!postId || !postCreatedAt) {
        throw new Error('게시글 ID와 작성일자가 필요합니다.');
      }

      const getCommand = new GetCommand({
        TableName: this.tableName,
        Key: {
          id: postId,
          createdAt: postCreatedAt
        }
      });

      const { Item: post } = await this.docClient.send(getCommand);
      if (!post) {
        throw new Error('게시글을 찾을 수 없습니다.');
      }

      const comment = {
        id: commentData.id || uuidv4(),
        content: commentData.content,
        author: commentData.author,
        createdAt: commentData.createdAt || new Date().toISOString(),
        updatedAt: commentData.updatedAt || new Date().toISOString()
      };

      const comments = Array.isArray(post.comments) ? [...post.comments, comment] : [comment];

      const updateCommand = new UpdateCommand({
        TableName: this.tableName,
        Key: {
          id: postId,
          createdAt: postCreatedAt
        },
        UpdateExpression: 'SET comments = :comments, commentCount = :commentCount',
        ExpressionAttributeValues: {
          ':comments': comments,
          ':commentCount': comments.length
        },
        ReturnValues: 'ALL_NEW'
      });

      await this.docClient.send(updateCommand);
      return comment;
    } catch (error) {
      console.error('댓글 추가 에러:', error);
      throw error;
    }
  }

  async deleteComment(postId, postCreatedAt, commentId) {
    try {
      const getCommand = new GetCommand({
        TableName: this.tableName,
        Key: {
          id: postId,
          createdAt: postCreatedAt
        }
      });

      const { Item: post } = await this.docClient.send(getCommand);
      if (!post) {
        throw new Error('게시글을 찾을 수 없습니다.');
      }

      const comments = post.comments?.filter(comment => comment.id !== commentId) || [];

      const updateCommand = new UpdateCommand({
        TableName: this.tableName,
        Key: {
          id: postId,
          createdAt: postCreatedAt
        },
        UpdateExpression: 'SET comments = :comments, commentCount = :commentCount',
        ExpressionAttributeValues: {
          ':comments': comments,
          ':commentCount': comments.length
        }
      });

      await this.docClient.send(updateCommand);
    } catch (error) {
      console.error('댓글 삭제 에러:', error);
      throw error;
    }
  }

  async updateComment(postId, postCreatedAt, commentId, updateData) {
    try {
      const getCommand = new GetCommand({
        TableName: this.tableName,
        Key: {
          id: postId,
          createdAt: postCreatedAt
        }
      });

      const { Item: post } = await this.docClient.send(getCommand);
      if (!post) {
        throw new Error('게시글을 찾을 수 없습니다.');
      }

      const comments = post.comments?.map(comment => 
        comment.id === commentId 
          ? { ...comment, ...updateData, updatedAt: new Date().toISOString() }
          : comment
      ) || [];

      const updateCommand = new UpdateCommand({
        TableName: this.tableName,
        Key: {
          id: postId,
          createdAt: postCreatedAt
        },
        UpdateExpression: 'SET comments = :comments',
        ExpressionAttributeValues: {
          ':comments': comments
        }
      });

      await this.docClient.send(updateCommand);
      return comments.find(comment => comment.id === commentId);
    } catch (error) {
      console.error('댓글 수정 에러:', error);
      throw error;
    }
  }
}