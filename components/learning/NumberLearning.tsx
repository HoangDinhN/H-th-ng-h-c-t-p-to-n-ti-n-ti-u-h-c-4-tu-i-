import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeftIcon, ArrowRightIcon, SpeakerIcon, StarIcon } from '../icons/Icons';

const numbersData = [
  { num: 0, color: 'bg-gray-400', item: '⚪️' },
  { num: 1, color: 'bg-red-500', item: '🍎' },
  { num: 2, color: 'bg-orange-500', item: '🍊' },
  { num: 3, color: 'bg-yellow-500', item: '🍋' },
  { num: 4, color: 'bg-green-500', item: '🍐' },
  { num: 5, color: 'bg-blue-500', item: '🍇' },
  { num: 6, color: 'bg-indigo-500', item: '🍆' },
  { num: 7, color: 'bg-purple-500', item: '🍓' },
  { num: 8, color: 'bg-pink-500', item: '🍉' },
  { num: 9, color: 'bg-teal-500', item: '🍍' },
];

const NumberLearning: React.FC = () => {
  const [currentNumberIndex, setCurrentNumberIndex] = useState(0);

  const speak = useCallback((text: string) => {
    // Hủy các lượt nói trước đó để tránh chồng chéo
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'vi-VN';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }, []);

  useEffect(() => {
    speak(numbersData[currentNumberIndex].num.toString());
  }, [currentNumberIndex, speak]);

  const handleNext = () => {
    setCurrentNumberIndex((prev) => (prev + 1) % numbersData.length);
  };

  const handlePrev = () => {
    setCurrentNumberIndex((prev) => (prev - 1 + numbersData.length) % numbersData.length);
  };
  
  const currentNumberData = numbersData[currentNumberIndex];
  
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8 transform transition-all hover:shadow-3xl duration-500">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                {/* Number Display */}
                <div className={`relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center rounded-full text-white font-extrabold text-9xl shadow-lg ${currentNumberData.color}`}>
                    {currentNumberData.num}
                    <button 
                        onClick={() => speak(currentNumberData.num.toString())}
                        className="absolute bottom-2 right-2 bg-white/30 p-2 rounded-full text-white hover:bg-white/50 transition"
                        aria-label="Phát âm lại"
                    >
                        <SpeakerIcon className="w-6 h-6"/>
                    </button>
                </div>
                
                {/* Item Display */}
                <div className="flex-1 w-full p-4 bg-gray-100 rounded-2xl">
                    <div className="grid grid-cols-3 gap-2 justify-items-center">
                        {Array.from({ length: currentNumberData.num }).map((_, i) => (
                            <span key={i} className="text-5xl animate-bounce" style={{animationDelay: `${i * 100}ms`}}>{currentNumberData.item}</span>
                        ))}
                    </div>
                     {currentNumberData.num === 0 && <p className="text-center text-gray-500 italic">Không có gì!</p>}
                </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8">
                <button
                    onClick={handlePrev}
                    className="flex items-center justify-center w-16 h-16 bg-gray-200 rounded-full text-gray-600 hover:bg-gray-300 hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                    aria-label="Số trước"
                >
                    <ArrowLeftIcon className="w-8 h-8"/>
                </button>
                <div className="text-xl font-bold text-gray-700">
                    Số {currentNumberData.num}
                </div>
                <button
                    onClick={handleNext}
                    className="flex items-center justify-center w-16 h-16 bg-gray-200 rounded-full text-gray-600 hover:bg-gray-300 hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                    aria-label="Số kế tiếp"
                >
                    <ArrowRightIcon className="w-8 h-8"/>
                </button>
            </div>
        </div>
    </div>
  );
};

export default NumberLearning;