
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const studyTimeData = [
  { name: 'Thứ 2', 'Thời gian học (phút)': 30 },
  { name: 'Thứ 3', 'Thời gian học (phút)': 45 },
  { name: 'Thứ 4', 'Thời gian học (phút)': 25 },
  { name: 'Thứ 5', 'Thời gian học (phút)': 60 },
  { name: 'Thứ 6', 'Thời gian học (phút)': 50 },
  { name: 'Thứ 7', 'Thời gian học (phút)': 75 },
  { name: 'CN', 'Thời gian học (phút)': 20 },
];

const Reports: React.FC = () => {
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-extrabold text-orange-600">Báo cáo học tập</h2>
        <p className="text-gray-600 mt-2">Theo dõi tiến độ và kết quả của bé.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-xl mb-8">
        <h3 className="text-2xl font-bold mb-4 text-gray-700">Thống kê thời gian học (tuần này)</h3>
        <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={studyTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Thời gian học (phút)" fill="#f97316" />
                </BarChart>
            </ResponsiveContainer>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-xl">
            <h3 className="text-2xl font-bold mb-4 text-gray-700">Kết quả học tập</h3>
            <div className="space-y-4">
                <p><strong>Tổng số bài học đã hoàn thành:</strong> 48</p>
                <p><strong>Tỷ lệ trả lời đúng:</strong> 92%</p>
                <p><strong>Chuỗi ngày học dài nhất:</strong> 12 ngày</p>
            </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center justify-center">
            <h3 className="text-2xl font-bold mb-4 text-gray-700">Gửi thông báo cho phụ huynh</h3>
            <p className="text-gray-500 mb-4 text-center">Gửi báo cáo tiến độ hàng tuần cho ba mẹ.</p>
            <button
                onClick={() => alert('Đã gửi thông báo thành công!')}
                className="bg-orange-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-orange-600 transition-transform transform hover:scale-105"
            >
                Gửi ngay
            </button>
        </div>
      </div>
    </div>
  );
};

export default Reports;
