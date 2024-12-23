import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post('http://localhost:3000/api/auth/login', formData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.error || '로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="text-sm text-red-500">{error}</div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700">Username</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className="mt-1 block w-full rounded-button border-gray-300 focus:border-custom focus:ring-custom"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="mt-1 block w-full rounded-button border-gray-300 focus:border-custom focus:ring-custom"
          required
        />
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          name="rememberMe"
          checked={formData.rememberMe}
          onChange={handleChange}
          className="rounded border-gray-300 text-custom focus:ring-custom"
        />
        <label className="ml-2 text-sm text-gray-700">Remember me</label>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full !rounded-button bg-custom text-white py-2 hover:bg-custom/90 disabled:opacity-50"
      >
        {loading ? '로그인 중...' : '로그인'}
      </button>
      <div className="text-sm text-center space-x-4">
        <a href="/register" className="text-custom hover:underline">회원가입</a>
        <a href="/forgot-password" className="text-custom hover:underline">비밀번호 찾기</a>
      </div>
    </form>
  );
};

export default LoginForm;
