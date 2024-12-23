import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


const TrendingTopics = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setLoading(true);
        // 임시 데이터 사용 (나중에 API 연동)
        const dummyTopics = [
            { id: 1, name: '웹개발', count: 150 },
            { id: 2, name: '게임2024', count: 120 },
            { id: 3, name: 'AI교육', count: 100 },
            { id: 4, name: '기술트렌드', count: 80 }
          ];
        setTopics(dummyTopics);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching trending topics:', err);
        setError('트렌딩 토픽을 불러오는데 실패했습니다.');
      }
    };

    fetchTopics();
  }, []);

  if (loading) return <div className="text-sm text-gray-500">로딩 중...</div>;
  if (error) return <div className="text-sm text-red-500">{error}</div>;
  if (!topics.length) return <div className="text-sm text-gray-500">토픽이 없습니다.</div>;

  return (
    <div className="space-y-3">
      {topics.map(topic => (
        <Link
          key={topic.id}
          to={`/topics/${topic.name.toLowerCase()}`}
          className="block text-sm text-gray-700 hover:text-custom"
        >
          #{topic.name}
          <span className="text-xs text-gray-500 ml-2">
            {topic.count}개의 게시글
          </span>
        </Link>
      ))}
    </div>
  );
};

export default TrendingTopics;
