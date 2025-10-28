
import React, { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { HomeIcon, LogoutIcon, StarIcon } from '../icons/Icons';

const Header: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) return null;

  const { user, setView, logout } = context;

  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => setView('dashboard')}
          >
            <div className="bg-pink-500 p-2 rounded-full text-white group-hover:rotate-12 transition-transform">
                <HomeIcon />
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold text-pink-600 group-hover:text-pink-700 transition">Bé Vui Học Toán</h1>
          </div>

          <div className="flex items-center space-x-4 md:space-x-6">
            <div className="flex items-center space-x-2 bg-yellow-100 border border-yellow-300 px-3 py-1 rounded-full text-yellow-800 font-bold">
              <StarIcon className="text-yellow-500" />
              <span>{user?.stars.toLocaleString()}</span>
            </div>
            <div className="flex items-center space-x-3">
              <img src={user?.avatar} alt={user?.name} className="w-10 h-10 rounded-full border-2 border-pink-400" />
              <span className="hidden sm:inline font-bold text-gray-700">{user?.name}</span>
            </div>
            <button
              onClick={logout}
              className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-transform transform hover:scale-110"
              aria-label="Đăng xuất"
            >
              <LogoutIcon />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
