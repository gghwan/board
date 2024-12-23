import { PostService } from '../services/postService.js';

// 게시글 생성 테스트
async function testCreatePost() {
  const postService = new PostService();
  
  const testPost = {
    title: "테스트 게시글",
    content: "이것은 테스트 게시글입니다.",
    authorId: "test-user-1"
  };

  try {
    console.log("\n=== 생성 테스트 ===");
    console.log("테스트 게시글 생성 중...");
    const createdPost = await postService.createPost(testPost);
    console.log("게시글 생성 성공:", createdPost);
    return createdPost;
  } catch (error) {
    console.error("생성 테스트 실패:", error);
  }
}

// 게시글 조회 테스트
async function testReadPost(postId, createdAt) {
  const postService = new PostService();
  
  try {
    console.log("\n=== 조회 테스트 ===");
    console.log("단일 게시글 조회 중...");
    const post = await postService.getPost(postId, createdAt);
    console.log("게시글 조회 결과:", post);
    
    console.log("\n게시글 목록 조회 중...");
    const posts = await postService.listPosts(5);
    console.log("게시글 목록 조회 결과:", posts);
    return post;
  } catch (error) {
    console.error("조회 테스트 실패:", error);
    throw error;
  }
}

// 게시글 수정 테스트
async function testUpdatePost(postId, createdAt) {
  const postService = new PostService();
  
  const updateData = {
    title: "수정된 테스트 게시글",
    content: "이 내용은 수정되었습니다."
  };

  try {
    console.log("\n=== 수정 테스트 ===");
    console.log("게시글 수정 중...");
    const updatedPost = await postService.updatePost(postId, createdAt, updateData);
    console.log("게시글 수정 결과:", updatedPost);
    return updatedPost;
  } catch (error) {
    console.error("수정 테스트 실패:", error);
    throw error;
  }
}

// 게시글 삭제 테스트
async function testDeletePost(postId, createdAt) {
  const postService = new PostService();
  
  try {
    console.log("\n=== 삭제 테스트 ===");
    console.log("게시글 삭제 중...");
    const result = await postService.deletePost(postId, createdAt);
    console.log("삭제 결과:", result);
    
    console.log("\n삭제된 게시글 조회 시도 중...");
    const deletedPost = await postService.getPost(postId, createdAt);
    console.log("삭제된 게시글 조회 결과:", deletedPost);
  } catch (error) {
    console.error("삭제 테스트 실패:", error);
    throw error;
  }
}

// 전체 테스트 실행
async function runTests() {
  try {
    // 1. 생성
    const createdPost = await testCreatePost();
    if (!createdPost) throw new Error("생성 테스트 실패");
    
    // 2. 조회
    const readPost = await testReadPost(createdPost.id, createdPost.createdAt);
    if (!readPost) throw new Error("조회 테스트 실패");
    
    // 3. 수정
    const updatedPost = await testUpdatePost(createdPost.id, createdPost.createdAt);
    if (!updatedPost) throw new Error("수정 테스트 실패");
    
    // 4. 삭제
    await testDeletePost(createdPost.id, createdPost.createdAt);
    
    console.log("\n=== 모든 테스트가 성공적으로 완료되었습니다 ===");
  } catch (error) {
    console.error("\n테스트 스위트 실패:", error.message);
  }
}

// 테스트 실행
runTests();