import React, { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { View } from '../../types';

interface ActivityCardProps {
    title: string;
    description: string;
    onClick: () => void;
    color: string;
    icon: React.ReactNode;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ title, description, onClick, color, icon }) => (
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


const LearningHub: React.FC = () => {
    const context = useContext(AppContext);
    if (!context) return null;
    const { setView } = context;

    const activities: { title: string; description: string; view: View; color: string; icon: string; }[] = [
        { title: 'Học Số Đếm', description: 'Làm quen với các con số từ 0 đến 9', view: 'number-learning', color: 'bg-gradient-to-br from-blue-400 to-blue-600', icon: '🔢' },
        { title: 'So Sánh Lớn Bé', description: 'Trò chơi so sánh các số', view: 'comparison-game', color: 'bg-gradient-to-br from-green-400 to-green-600', icon: '⚖️' },
        { title: 'Bé Tập Viết', description: 'Luyện viết các con số thật đẹp', view: 'writing-practice', color: 'bg-gradient-to-br from-purple-400 to-purple-600', icon: '✍️' },
        { title: 'Giải Cứu Công Chúa', description: 'Trò chơi toán học phiêu lưu', view: 'mario-game', color: 'bg-gradient-to-br from-red-400 to-red-600', icon: '🍄' },
    ];
    
    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <div className="text-center mb-8">
                <h2 className="text-4xl font-extrabold text-blue-600">Trung tâm học tập</h2>
                <p className="text-gray-600 mt-2">Chọn một hoạt động để bắt đầu nào!</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {activities.map(activity => (
                    <ActivityCard
                        key={activity.view}
                        onClick={() => setView(activity.view)}
                        title={activity.title}
                        description={activity.description}
                        color={activity.color}
                        icon={<span className="text-4xl">{activity.icon}</span>}
                    />
                ))}
            </div>
        </div>
    );
};

export default LearningHub;
