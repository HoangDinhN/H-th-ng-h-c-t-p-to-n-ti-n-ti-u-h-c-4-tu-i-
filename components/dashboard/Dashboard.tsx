
import React, { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { BookIcon, ChartIcon, GiftIcon, ProfileIcon } from '../icons/Icons';

const DashboardCard: React.FC<{ title: string; description: string; icon: React.ReactNode; onClick: () => void; color: string; }> = ({ title, description, icon, onClick, color }) => {
  return (
    <div
      onClick={onClick}
      className={`relative p-6 rounded-2xl shadow-lg cursor-pointer transform hover:-translate-y-2 transition-transform duration-300 overflow-hidden ${color}`}
    >
      <div className="relative z-10">
        <div className="text-white bg-black bg-opacity-20 rounded-full w-14 h-14 flex items-center justify-center mb-4">
          {icon}
        </div>
        <h3 className="text-2xl font-bold text-white">{title}</h3>
        <p className="text-white opacity-90 mt-1">{description}</p>
      </div>
      <div className="absolute -bottom-4 -right-4 text-white opacity-10 w-28 h-28">
        {icon}
      </div>
    </div>
  );
};


const Dashboard: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) return null;

  const { user, setView } = context;

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 text-center border-2 border-pink-200">
        <h2 className="text-3xl font-extrabold text-pink-600">Chào mừng trở lại, {user?.name}!</h2>
        <p className="text-gray-600 mt-2">Sẵn sàng cho một cuộc phiêu lưu toán học vui vẻ chưa nào?</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard 
            title="Học tập"
            description="Bắt đầu các bài học và trò chơi"
            icon={<BookIcon />}
            onClick={() => setView('learning-hub')}
            color="bg-gradient-to-br from-blue-500 to-indigo-600"
        />
        <DashboardCard 
            title="Phần thưởng"
            description="Xem sao và bảng xếp hạng"
            icon={<GiftIcon />}
            onClick={() => setView('rewards')}
            color="bg-gradient-to-br from-green-400 to-teal-500"
        />
        <DashboardCard 
            title="Hồ sơ học sinh"
            description="Xem và cập nhật thông tin"
            icon={<ProfileIcon />}
            onClick={() => setView('profile')}
            color="bg-gradient-to-br from-purple-500 to-pink-500"
        />
        <DashboardCard 
            title="Báo cáo"
            description="Theo dõi tiến độ và kết quả"
            icon={<ChartIcon />}
            onClick={() => setView('reports')}
            color="bg-gradient-to-br from-orange-400 to-red-500"
        />
      </div>
    </div>
  );
};

export default Dashboard;
