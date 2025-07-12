import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, TrendingUp, Tag, Bookmark, Users, Clock } from 'lucide-react';

const Sidebar: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: TrendingUp, label: 'Popular', path: '/popular' },
    { icon: Clock, label: 'Recent', path: '/recent' },
    { icon: Tag, label: 'Tags', path: '/tags' },
    { icon: Bookmark, label: 'Bookmarks', path: '/bookmarks' },
    { icon: Users, label: 'Users', path: '/users' },
  ];

  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-700 min-h-screen sticky top-16">
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-8">
          <h3 className="text-gray-400 text-sm font-medium mb-3">Popular Tags</h3>
          <div className="space-y-1">
            {['React', 'JavaScript', 'TypeScript', 'Node.js', 'Python'].map((tag) => (
              <Link
                key={tag}
                to={`/tags/${tag.toLowerCase()}`}
                className="block px-3 py-1 text-sm text-gray-400 hover:text-white transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;