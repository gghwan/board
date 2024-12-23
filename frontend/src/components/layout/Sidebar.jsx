import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-64 flex-shrink-0">
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="mb-8">
          <h3 className="font-medium text-gray-900 mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="text-sm text-gray-600 hover:text-custom">Home</Link>
            </li>
            <li>
              <Link to="/latest" className="text-sm text-gray-600 hover:text-custom">Latest Posts</Link>
            </li>
            <li>
              <Link to="/popular" className="text-sm text-gray-600 hover:text-custom">Popular Posts</Link>
            </li>
          </ul>
        </div>

        <div className="mb-8">
          <h3 className="font-medium text-gray-900 mb-4">Categories</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/categories/tech" className="flex items-center text-sm text-gray-600 hover:text-custom">
                <i className="fas fa-laptop-code w-5"></i>
                <span>Technology</span>
                <span className="ml-auto text-gray-400">2.1k</span>
              </Link>
            </li>
            <li>
              <Link to="/categories/gaming" className="flex items-center text-sm text-gray-600 hover:text-custom">
                <i className="fas fa-gamepad w-5"></i>
                <span>Gaming</span>
                <span className="ml-auto text-gray-400">1.8k</span>
              </Link>
            </li>
            {/* 더 많은 카테고리들... */}
          </ul>
        </div>

        <div>
          <h3 className="font-medium text-gray-900 mb-4">Contact</h3>
          <p className="text-sm text-gray-600">
            <i className="far fa-envelope mr-2"></i>
            support@example.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
