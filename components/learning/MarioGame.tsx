import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { ArrowLeftIcon, ArrowRightIcon, ArrowUpIcon, StarIcon } from '../icons/Icons';

// --- Game Constants ---
const WORLD_WIDTH = 2000;
const WORLD_HEIGHT = 600;
const PLAYER_SIZE = 40;
const GRAVITY = 0.8;
const JUMP_FORCE = -15;
const PLAYER_SPEED = 6;

// --- Types ---
type Vector2 = { x: number; y: number };
type GameObject = { id: number; type: 'brick' | 'question' | 'star' | 'castle'; x: number; y: number; width: number; height: number; };
type GameQuestion = { text: string; answers: number[]; correctAnswer: number; };
type GameState = 'playing' | 'question' | 'won';

// --- Level Data ---
const levelLayout: Omit<GameObject, 'id'>[] = [
    // Ground
    ...Array.from({ length: 25 }).map((_, i) => ({ type: 'brick' as const, x: i * 40, y: WORLD_HEIGHT - 40, width: 40, height: 40 })),
    ...Array.from({ length: 15 }).map((_, i) => ({ type: 'brick' as const, x: 1200 + i * 40, y: WORLD_HEIGHT - 40, width: 40, height: 40 })),

    // Platforms & Question Blocks
    { type: 'brick', x: 200, y: WORLD_HEIGHT - 160, width: 120, height: 40 },
    { type: 'question', x: 320, y: WORLD_HEIGHT - 160, width: 40, height: 40 },
    { type: 'brick', x: 360, y: WORLD_HEIGHT - 160, width: 40, height: 40 },

    { type: 'brick', x: 520, y: WORLD_HEIGHT - 220, width: 40, height: 40 },
    { type: 'question', x: 560, y: WORLD_HEIGHT - 220, width: 40, height: 40 },

    { type: 'brick', x: 800, y: WORLD_HEIGHT - 180, width: 160, height: 40 },
    { type: 'star', x: 860, y: WORLD_HEIGHT - 240, width: 30, height: 30 },
    
    { type: 'question', x: 1000, y: WORLD_HEIGHT - 200, width: 40, height: 40 },

    { type: 'brick', x: 1300, y: WORLD_HEIGHT - 160, width: 40, height: 40 },
    { type: 'brick', x: 1340, y: WORLD_HEIGHT - 200, width: 40, height: 40 },
    { type: 'brick', x: 1380, y: WORLD_HEIGHT - 240, width: 40, height: 40 },
    { type: 'question', x: 1420, y: WORLD_HEIGHT - 280, width: 40, height: 40 },

    // Castle
    { type: 'castle', x: 1880, y: WORLD_HEIGHT - 200, width: 120, height: 160 },
];

const gameObjects: GameObject[] = levelLayout.map((obj, i) => ({ ...obj, id: i }));

const generateQuestion = (): GameQuestion => {
    const num1 = Math.floor(Math.random() * 9) + 1;
    const num2 = Math.floor(Math.random() * 9) + 1;
    const correctAnswer = num1 + num2;
    const answers = [correctAnswer];
    while (answers.length < 3) {
        const wrongAnswer = Math.floor(Math.random() * 18) + 1;
        if (!answers.includes(wrongAnswer)) {
            answers.push(wrongAnswer);
        }
    }
    return {
        text: `${num1} + ${num2} = ?`,
        correctAnswer,
        answers: answers.sort(() => Math.random() - 0.5),
    };
};


const MarioGame: React.FC = () => {
    // FIX: The error "Expected 1 arguments, but got 0" on line 77 is likely a misidentified error.
    // A common cause for this error is an issue with a hook call. Explicitly using React.useContext
    // can prevent potential issues with module resolution or build tools.
    const context = React.useContext(AppContext);
    const [playerPos, setPlayerPos] = useState<Vector2>({ x: 50, y: 0 });
    const [playerVel, setPlayerVel] = useState<Vector2>({ x: 0, y: 0 });
    const [isJumping, setIsJumping] = useState(false);
    const [collectedStars, setCollectedStars] = useState<number[]>([]);
    const [gameState, setGameState] = useState<GameState>('playing');
    const [currentQuestion, setCurrentQuestion] = useState<GameQuestion | null>(null);
    const [message, setMessage] = useState('');
    const gameLoopRef = useRef<number>();
    const controlsRef = useRef({ left: false, right: false });

    const resetGame = useCallback(() => {
        setPlayerPos({ x: 50, y: 0 });
        setPlayerVel({ x: 0, y: 0 });
        setIsJumping(false);
        setCollectedStars([]);
        setGameState('playing');
        setCurrentQuestion(null);
        setMessage('');
        controlsRef.current = { left: false, right: false };
    }, []);

    const handleAnswer = (answer: number) => {
        if (!currentQuestion) return;
        if (answer === currentQuestion.correctAnswer) {
            setMessage('Đúng rồi!');
            setCollectedStars(prev => [...prev, -1]); // Add a "virtual" star for correct answer
            setTimeout(() => {
                setGameState('playing');
                setCurrentQuestion(null);
                setMessage('');
            }, 1000);
        } else {
            setMessage('Sai rồi, thử lại nhé!');
             setTimeout(() => setMessage(''), 1000);
        }
    };

    const gameLoop = useCallback(() => {
        if (gameState !== 'playing') {
            gameLoopRef.current = requestAnimationFrame(gameLoop);
            return;
        }

        let newVelX = 0;
        if (controlsRef.current.left) newVelX -= PLAYER_SPEED;
        if (controlsRef.current.right) newVelX += PLAYER_SPEED;
        
        setPlayerVel(prevVel => {
            let newVelY = prevVel.y + GRAVITY;
            return { x: newVelX, y: newVelY };
        });

        setPlayerPos(prevPos => {
            let newPosX = prevPos.x + playerVel.x;
            let newPosY = prevPos.y + playerVel.y;

            // World boundaries
            if (newPosX < 0) newPosX = 0;
            if (newPosX + PLAYER_SIZE > WORLD_WIDTH) newPosX = WORLD_WIDTH - PLAYER_SIZE;

            // Collision detection
            let onGround = false;
            for (const obj of gameObjects) {
                if (
                    newPosX < obj.x + obj.width &&
                    newPosX + PLAYER_SIZE > obj.x &&
                    newPosY < obj.y + obj.height &&
                    newPosY + PLAYER_SIZE > obj.y
                ) {
                    // --- Vertical collision (landing on top or hitting bottom)
                    if (prevPos.y + PLAYER_SIZE <= obj.y && playerVel.y > 0) { // Landing on top
                        newPosY = obj.y - PLAYER_SIZE;
                        onGround = true;
                        
                        if (obj.type === 'question' && !currentQuestion) {
                            setGameState('question');
                            setCurrentQuestion(generateQuestion());
                        } else if (obj.type === 'castle') {
                            setGameState('won');
                        }

                    } else if (prevPos.y >= obj.y + obj.height && playerVel.y < 0) { // Hitting bottom
                         newPosY = obj.y + obj.height;
                         setPlayerVel(v => ({...v, y: 0}));
                    }
                    
                    // --- Horizontal collision
                    else if (prevPos.x + PLAYER_SIZE <= obj.x && playerVel.x > 0) { // Hitting left side of object
                        newPosX = obj.x - PLAYER_SIZE;
                    } else if (prevPos.x >= obj.x + obj.width && playerVel.x < 0) { // Hitting right side of object
                        newPosX = obj.x + obj.width;
                    }

                     if (obj.type === 'star' && !collectedStars.includes(obj.id)) {
                        setCollectedStars(prev => [...prev, obj.id]);
                    }
                }
            }

            if (onGround) {
                setIsJumping(false);
                setPlayerVel(v => ({...v, y: 0}));
            }
            
            // Fall off world
            if (newPosY > WORLD_HEIGHT) {
                // For simplicity, just reset position
                return { x: 50, y: 0 };
            }

            return { x: newPosX, y: newPosY };
        });

        gameLoopRef.current = requestAnimationFrame(gameLoop);
    }, [playerVel.x, playerVel.y, gameState, currentQuestion, collectedStars]);

    useEffect(() => {
        resetGame();
        gameLoopRef.current = requestAnimationFrame(gameLoop);
        return () => {
            if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
        };
    }, [gameLoop, resetGame]);

    const handleJump = () => {
        if (!isJumping && gameState === 'playing') {
            setIsJumping(true);
            setPlayerVel(v => ({...v, y: JUMP_FORCE}));
        }
    };
    
    const handleMove = (direction: 'left' | 'right', active: boolean) => {
        controlsRef.current[direction] = active;
    };
    
    const cameraX = Math.max(0, Math.min(playerPos.x - window.innerWidth / 2, WORLD_WIDTH - window.innerWidth));

    if (gameState === 'won') {
        const score = collectedStars.length * 10;
        context?.addStars(score);
        return (
            <div className="w-full h-full flex flex-col items-center justify-center text-center bg-blue-300">
                <h2 className="text-5xl font-extrabold text-white">Bé đã giải cứu công chúa!</h2>
                <p className="text-3xl mt-4 text-yellow-300 flex items-center gap-2">
                    Điểm thưởng: {score} <StarIcon className="w-8 h-8"/>
                </p>
                <div className="flex gap-4 mt-8">
                     <button onClick={resetGame} className="bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 transition-transform transform hover:scale-105">Chơi lại</button>
                     <button onClick={() => context?.setView('learning-hub')} className="bg-blue-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-600 transition-transform transform hover:scale-105">Quay lại</button>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full h-[calc(100vh-80px)] overflow-hidden bg-sky-400 relative touch-none">
            {/* Game World */}
            <div className="absolute top-0 left-0" style={{ transform: `translateX(-${cameraX}px)`, transition: 'transform 0.2s linear' }}>
                <div style={{ width: WORLD_WIDTH, height: WORLD_HEIGHT }} className="relative">
                    {/* Player */}
                    <div style={{ left: playerPos.x, top: playerPos.y, width: PLAYER_SIZE, height: PLAYER_SIZE }} className="absolute bg-red-500 rounded-md transition-all duration-75"></div>

                    {/* Objects */}
                    {gameObjects.map(obj => {
                        if (obj.type === 'star' && collectedStars.includes(obj.id)) return null;
                        const colors = {
                            brick: 'bg-orange-800 border-2 border-black',
                            question: 'bg-yellow-500 border-2 border-black flex items-center justify-center text-3xl font-bold',
                            star: 'text-yellow-300 text-5xl',
                            castle: 'bg-gray-300 border-2 border-black'
                        }
                        return (
                            <div key={obj.id} style={{ left: obj.x, top: obj.y, width: obj.width, height: obj.height }} className={`absolute ${colors[obj.type]}`}>
                                {obj.type === 'question' && '?' }
                                {obj.type === 'star' && <StarIcon className="w-full h-full" /> }
                                {obj.type === 'castle' && <div className="w-full h-full text-center p-2"><span className="text-5xl">🏰</span><p className="font-bold">Lâu Đài</p></div>}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* UI */}
            <div className="absolute top-4 right-4 bg-white/80 p-2 rounded-lg font-bold text-lg flex items-center gap-2">
                <StarIcon className="text-yellow-500" /> {collectedStars.length * 10}
            </div>

            {/* Question Modal */}
            {gameState === 'question' && currentQuestion && (
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center p-4">
                    <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
                        <p className="text-5xl font-bold text-blue-600 mb-6">{currentQuestion.text}</p>
                        <div className="flex justify-center gap-4">
                            {currentQuestion.answers.map(ans => (
                                <button
                                    key={ans}
                                    onClick={() => handleAnswer(ans)}
                                    className="w-24 h-24 bg-green-500 text-white font-bold text-4xl rounded-lg hover:bg-green-600 transition-transform transform hover:scale-110"
                                >
                                    {ans}
                                </button>
                            ))}
                        </div>
                        {message && <p className="mt-4 text-2xl font-bold text-red-500">{message}</p>}
                    </div>
                </div>
            )}
            
            {/* Controls */}
            <div className="absolute bottom-5 left-5 flex gap-4">
                <button 
                    onMouseDown={() => handleMove('left', true)} onMouseUp={() => handleMove('left', false)}
                    onTouchStart={() => handleMove('left', true)} onTouchEnd={() => handleMove('left', false)}
                    className="w-20 h-20 bg-black/40 text-white rounded-full flex items-center justify-center active:bg-black/60"
                ><ArrowLeftIcon className="w-12 h-12" /></button>
                <button 
                    onMouseDown={() => handleMove('right', true)} onMouseUp={() => handleMove('right', false)}
                    onTouchStart={() => handleMove('right', true)} onTouchEnd={() => handleMove('right', false)}
                    className="w-20 h-20 bg-black/40 text-white rounded-full flex items-center justify-center active:bg-black/60"
                ><ArrowRightIcon className="w-12 h-12" /></button>
            </div>
            <div className="absolute bottom-5 right-5">
                 <button onClick={handleJump} className="w-24 h-24 bg-black/40 text-white rounded-full flex items-center justify-center active:bg-black/60">
                    <ArrowUpIcon className="w-14 h-14" />
                 </button>
            </div>
        </div>
    );
};

export default MarioGame;