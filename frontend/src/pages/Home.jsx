import { useState } from 'react';
import PostList from '../components/post/PostList';
import TrendingTopics from '../components/post/TrendingTopics';
import LoginForm from '../components/auth/LoginForm';

const Home = () => {
  const [sortBy, setSortBy] = useState('latest');

  return (
    <div className="flex-1">
      <div className="flex gap-8">
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y">
            <div className="p-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">최신 게시글</h2>
              <div className="flex items-center space-x-2">
                <select 
                  className="border-gray-300 rounded-button text-sm"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="latest">최신순</option>
                  <option value="views">조회수순</option>
                  <option value="comments">댓글순</option>
                </select>
              </div>
            </div>
            <PostList sortBy={sortBy} />
          </div>
        </div>

        <div className="w-80 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">로그인</h3>
            <LoginForm />
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-4">인기 토픽</h3>
            <TrendingTopics />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
