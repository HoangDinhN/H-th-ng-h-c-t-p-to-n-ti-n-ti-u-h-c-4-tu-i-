
import React from 'react';
import { StarIcon, TrophyIcon } from '../icons/Icons';

const leaderboardData = [
  { name: 'Bé An', score: 1250, avatar: 'https://i.pravatar.cc/150?u=Bé An' },
  { name: 'Bé Bình', score: 1100, avatar: 'https://i.pravatar.cc/150?u=Bé Bình' },
  { name: 'Bé Châu', score: 950, avatar: 'https://i.pravatar.cc/150?u=Bé Châu' },
  { name: 'Bé Dũng', score: 800, avatar: 'https://i.pravatar.cc/150?u=Bé Dũng' },
  { name: 'Bé Giang', score: 650, avatar: 'https://i.pravatar.cc/150?u=Bé Giang' },
];

const rankColors = [
    'text-yellow-400',
    'text-gray-400',
    'text-yellow-600'
];

const Rewards: React.FC = () => {
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-extrabold text-green-600">Phần thưởng & Thành tích</h2>
        <p className="text-gray-600 mt-2">Xem ai là người giỏi nhất tuần này!</p>
      </div>
      
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 bg-gradient-to-br from-green-400 to-teal-500">
          <h3 className="text-2xl font-bold text-white text-center flex items-center justify-center gap-2">
            <TrophyIcon /> Bảng Xếp Hạng
          </h3>
        </div>
        
        <ul>
          {leaderboardData.map((player, index) => (
            <li
              key={player.name}
              className={`flex items-center p-4 border-b last:border-b-0 ${index < 3 ? 'bg-green-50' : 'bg-white'} hover:bg-green-100 transition`}
            >
              <div className="flex items-center w-12">
                {index < 3 ? (
                  <TrophyIcon className={`w-8 h-8 ${rankColors[index]}`} />
                ) : (
                  <span className="text-xl font-bold text-gray-500 w-8 text-center">{index + 1}</span>
                )}
              </div>
              <img src={player.avatar} alt={player.name} className="w-12 h-12 rounded-full border-2 border-green-300" />
              <span className="ml-4 text-lg font-bold text-gray-800 flex-grow">{player.name}</span>
              <div className="flex items-center space-x-1 font-bold text-yellow-600">
                <StarIcon className="text-yellow-500" />
                <span>{player.score.toLocaleString()}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Rewards;
