
import React, { useState, useEffect, useCallback } from 'react';

type Operator = '<' | '>' | '=';
type Status = 'playing' | 'correct' | 'incorrect' | 'finished';

interface Question {
  num1: number;
  num2: number;
  answer: Operator;
}

const generateQuestion = (): Question => {
  const num1 = Math.floor(Math.random() * 10) + 1;
  let num2 = Math.floor(Math.random() * 10) + 1;
  
  // Increase chance of having an '=' question
  if (Math.random() > 0.7) {
    num2 = num1;
  }

  let answer: Operator;
  if (num1 < num2) answer = '<';
  else if (num1 > num2) answer = '>';
  else answer = '=';
  
  return { num1, num2, answer };
};

const ComparisonGame: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState<Status>('playing');
  
  useEffect(() => {
    setQuestions(Array.from({ length: 5 }, generateQuestion));
  }, []);

  const handleAnswer = useCallback((selectedOperator: Operator) => {
    if (status !== 'playing') return;

    if (selectedOperator === questions[currentQuestionIndex].answer) {
      setStatus('correct');
      setScore(s => s + 10);
    } else {
      setStatus('incorrect');
    }

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(i => i + 1);
        setStatus('playing');
      } else {
        setStatus('finished');
      }
    }, 1500);
  }, [status, currentQuestionIndex, questions]);

  const restartGame = () => {
    setQuestions(Array.from({ length: 5 }, generateQuestion));
    setCurrentQuestionIndex(0);
    setScore(0);
    setStatus('playing');
  };

  if (questions.length === 0) {
    return <div>Đang tải...</div>;
  }
  
  const currentQuestion = questions[currentQuestionIndex];

  const getStatusInfo = () => {
    switch (status) {
        case 'correct': return { message: 'Đúng rồi!', bgColor: 'bg-green-100', borderColor: 'border-green-500', textColor: 'text-green-700' };
        case 'incorrect': return { message: 'Cố lên nào!', bgColor: 'bg-red-100', borderColor: 'border-red-500', textColor: 'text-red-700' };
        default: return { message: '', bgColor: 'bg-white', borderColor: 'border-gray-200', textColor: '' };
    }
  };

  const statusInfo = getStatusInfo();

  if (status === 'finished') {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <h2 className="text-4xl font-bold text-purple-600">Hoàn thành!</h2>
        <p className="text-2xl mt-4">Điểm của bé: <span className="font-bold text-yellow-500">{score}</span></p>
        <button
          onClick={restartGame}
          className="mt-8 bg-purple-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-600 transition-transform transform hover:scale-105"
        >
          Chơi lại
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 flex flex-col items-center">
        <div className="w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
                <div className="text-lg font-bold">Câu hỏi: {currentQuestionIndex + 1} / {questions.length}</div>
                <div className="text-lg font-bold">Điểm: {score}</div>
            </div>
            <div className="bg-gray-200 h-4 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full transition-all duration-300" style={{width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`}}></div>
            </div>
        </div>

        <div className={`mt-8 w-full max-w-2xl p-8 rounded-2xl shadow-lg border-4 transition-all duration-300 ${statusInfo.bgColor} ${statusInfo.borderColor}`}>
            <div className="flex items-center justify-around text-6xl font-extrabold">
                <div className="bg-blue-100 text-blue-600 w-28 h-28 flex items-center justify-center rounded-2xl shadow-md">{currentQuestion.num1}</div>
                <div className="text-gray-400">?</div>
                <div className="bg-pink-100 text-pink-600 w-28 h-28 flex items-center justify-center rounded-2xl shadow-md">{currentQuestion.num2}</div>
            </div>
        </div>
        
        {status !== 'playing' && (
            <div className={`mt-4 text-3xl font-bold transition-opacity duration-300 ${statusInfo.textColor}`}>{statusInfo.message}</div>
        )}

        <div className="mt-8 grid grid-cols-3 gap-4 sm:gap-8 w-full max-w-lg">
            {(['<', '>', '='] as Operator[]).map(op => (
                <button
                    key={op}
                    onClick={() => handleAnswer(op)}
                    disabled={status !== 'playing'}
                    className="aspect-square bg-white rounded-2xl shadow-md flex items-center justify-center text-6xl font-bold text-gray-700 hover:bg-yellow-100 hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {op}
                </button>
            ))}
        </div>
    </div>
  );
};

export default ComparisonGame;
