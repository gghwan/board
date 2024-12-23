import fetch from 'node-fetch';

async function testAPI() {
    const baseURL = 'http://localhost:3000/api';
    let createdPostId;
    let createdAt;

    try {
        // 1. Create Post Test
        console.log('\n=== Testing Create Post ===');
        const createResponse = await fetch(`${baseURL}/posts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: 'API 테스트 게시글',
                content: 'API 테스트 내용입니다.',
                authorId: 'test-user'
            })
        });

        if (!createResponse.ok) {
            throw new Error(`Create failed: ${createResponse.status}`);
        }

        const createdPost = await createResponse.json();
        createdPostId = createdPost.id;
        createdAt = createdPost.createdAt;
        console.log('Created Post:', createdPost);

        // 2. Get Posts List Test
        console.log('\n=== Testing Get Posts List ===');
        const listResponse = await fetch(`${baseURL}/posts`);
        const posts = await listResponse.json();
        console.log('Posts List:', posts);

        // 3. Get Single Post Test
        console.log('\n=== Testing Get Single Post ===');
        const getResponse = await fetch(`${baseURL}/posts/${createdPostId}?createdAt=${createdAt}`);
        const post = await getResponse.json();
        console.log('Single Post:', post);

        // 4. Update Post Test
        console.log('\n=== Testing Update Post ===');
        const updateResponse = await fetch(`${baseURL}/posts/${createdPostId}?createdAt=${createdAt}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: '수정된 API 테스트 게시글',
                content: '수정된 API 테스트 내용입니다.'
            })
        });
        const updatedPost = await updateResponse.json();
        console.log('Updated Post:', updatedPost);

        // 5. Delete Post Test
        console.log('\n=== Testing Delete Post ===');
        const deleteResponse = await fetch(`${baseURL}/posts/${createdPostId}?createdAt=${createdAt}`, {
            method: 'DELETE'
        });
        console.log('Delete Response Status:', deleteResponse.status);

    } catch (error) {
        console.error('API Test Failed:', error);
    }
}

console.log('Starting API Tests...');
testAPI();