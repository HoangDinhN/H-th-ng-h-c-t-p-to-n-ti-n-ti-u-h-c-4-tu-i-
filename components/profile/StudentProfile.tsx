
import React, { useContext, useState } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { UserIcon, EmailIcon, StarIcon, ProfileIcon } from '../icons/Icons';

const StudentProfile: React.FC = () => {
    const context = useContext(AppContext);
    if (!context) return null;

    const { user } = context;
    const [name, setName] = useState(user?.name || '');
    const [avatarUrl, setAvatarUrl] = useState(user?.avatar || '');
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        // Mock saving process
        await new Promise(resolve => setTimeout(resolve, 1000));
        alert('Thông tin đã được cập nhật! (mock)');
        setIsSaving(false);
        setIsEditing(false);
        // In a real app, you would update the user context here
    };

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <div className="text-center mb-8">
                <h2 className="text-4xl font-extrabold text-purple-600">Hồ sơ của bé</h2>
                <p className="text-gray-600 mt-2">Xem và cập nhật thông tin cá nhân.</p>
            </div>

            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
                <div className="flex flex-col items-center">
                    <img src={avatarUrl} alt={name} className="w-32 h-32 rounded-full border-4 border-purple-300 object-cover" />
                    <div className="mt-4 text-center">
                        <h3 className="text-3xl font-bold text-gray-800">{isEditing ? 'Chỉnh sửa hồ sơ' : name}</h3>
                        <p className="text-gray-500">{user?.email}</p>
                        <div className="flex items-center justify-center space-x-2 mt-2 bg-yellow-100 border border-yellow-300 px-3 py-1 rounded-full text-yellow-800 font-bold">
                            <StarIcon className="text-yellow-500" />
                            <span>{user?.stars.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
                
                <form onSubmit={handleSave} className="mt-8 space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-1">Tên của bé</label>
                        <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"><UserIcon /></span>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={!isEditing}
                                className="w-full p-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition disabled:bg-gray-100"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="avatar" className="block text-sm font-bold text-gray-700 mb-1">Link ảnh đại diện</label>
                        <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"><ProfileIcon /></span>
                            <input
                                id="avatar"
                                type="text"
                                value={avatarUrl}
                                onChange={(e) => setAvatarUrl(e.target.value)}
                                disabled={!isEditing}
                                className="w-full p-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition disabled:bg-gray-100"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                        <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"><EmailIcon /></span>
                            <input
                                id="email"
                                type="email"
                                value={user?.email || ''}
                                disabled
                                className="w-full p-3 pl-11 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                            />
                        </div>
                    </div>
                    <div className="flex gap-4 mt-8">
                        {isEditing ? (
                            <>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="flex-1 bg-purple-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-purple-600 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:bg-purple-300"
                                >
                                    {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="flex-1 bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 transition"
                                >
                                    Hủy
                                </button>
                            </>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setIsEditing(true)}
                                className="w-full bg-purple-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-purple-600 transition-transform transform hover:scale-105"
                            >
                                Chỉnh sửa hồ sơ
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StudentProfile;
