
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { EraserIcon } from '../icons/Icons';

const colors = ['#EF4444', '#3B82F6', '#22C55E', '#A855F7', '#F97316', '#14B8A6'];

const WritingPractice: React.FC = () => {
    const [numberToTrace, setNumberToTrace] = useState(1);
    const [strokeColor, setStrokeColor] = useState(colors[0]);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isDrawing = useRef(false);

    const getCanvasContext = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return null;
        return canvas.getContext('2d');
    }, []);

    const clearCanvas = useCallback((ctx: CanvasRenderingContext2D | null = getCanvasContext()) => {
        if (!ctx || !canvasRef.current) return;
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }, [getCanvasContext]);
    
    const drawGuideNumber = useCallback(() => {
        const ctx = getCanvasContext();
        const canvas = canvasRef.current;
        if (!ctx || !canvas) return;

        clearCanvas(ctx);

        ctx.font = `bold ${canvas.width * 0.7}px "Nunito", sans-serif`;
        ctx.fillStyle = '#E5E7EB'; // light gray
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(numberToTrace.toString(), canvas.width / 2, canvas.height / 2);
    }, [numberToTrace, getCanvasContext, clearCanvas]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Set canvas size based on container
        const container = canvas.parentElement;
        if (container) {
            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
        }
        
        drawGuideNumber();
    }, [drawGuideNumber]);

    const getCoords = (e: React.MouseEvent | React.TouchEvent): {x: number, y: number} | null => {
        if (!canvasRef.current) return null;
        const rect = canvasRef.current.getBoundingClientRect();
        
        if ('touches' in e.nativeEvent) {
             return {
                x: e.nativeEvent.touches[0].clientX - rect.left,
                y: e.nativeEvent.touches[0].clientY - rect.top
            };
        }
        return {
            x: e.nativeEvent.offsetX,
            y: e.nativeEvent.offsetY,
        };
    }

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        const ctx = getCanvasContext();
        const coords = getCoords(e);
        if (!ctx || !coords) return;
        
        isDrawing.current = true;
        ctx.beginPath();
        ctx.moveTo(coords.x, coords.y);
        ctx.lineWidth = 12;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = strokeColor;
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing.current) return;
        const ctx = getCanvasContext();
        const coords = getCoords(e);
        if (!ctx || !coords) return;
        
        ctx.lineTo(coords.x, coords.y);
        ctx.stroke();
    };

    const stopDrawing = () => {
        const ctx = getCanvasContext();
        if (!ctx) return;
        ctx.closePath();
        isDrawing.current = false;
    };
    
    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8 flex flex-col items-center">
            <div className="text-center mb-6">
                <h2 className="text-4xl font-extrabold text-indigo-600">Bé Tập Viết Số</h2>
                <p className="text-gray-600 mt-2">Chọn một số và đồ theo nhé!</p>
            </div>

            <div className="w-full max-w-3xl flex flex-col lg:flex-row gap-6">
                {/* Controls */}
                <div className="bg-white p-4 rounded-2xl shadow-lg flex flex-col gap-4">
                    <div className="grid grid-cols-5 sm:grid-cols-10 lg:grid-cols-2 gap-2">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setNumberToTrace(i)}
                                className={`w-12 h-12 text-2xl font-bold rounded-lg transition-transform transform hover:scale-110 ${numberToTrace === i ? 'bg-indigo-500 text-white ring-4 ring-indigo-300' : 'bg-gray-200'}`}
                            >
                                {i}
                            </button>
                        ))}
                    </div>
                     <hr/>
                    <div className="grid grid-cols-6 lg:grid-cols-3 gap-2">
                         {colors.map(color => (
                            <button
                                key={color}
                                onClick={() => setStrokeColor(color)}
                                className={`w-10 h-10 rounded-full transition-transform transform hover:scale-110 ${strokeColor === color ? 'ring-4 ring-offset-2' : ''}`}
                                // FIX: Cast style object to React.CSSProperties to allow custom CSS properties for Tailwind compatibility.
                                style={{ backgroundColor: color, '--tw-ring-color': color } as React.CSSProperties}
                                aria-label={`Chọn màu ${color}`}
                            />
                        ))}
                    </div>
                    <button
                        onClick={() => drawGuideNumber()}
                        className="w-full mt-auto flex items-center justify-center gap-2 bg-red-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-600 transition"
                    >
                        <EraserIcon className="w-6 h-6" />
                        <span>Xóa bảng</span>
                    </button>
                </div>

                {/* Canvas */}
                <div className="flex-1 bg-white rounded-2xl shadow-2xl overflow-hidden aspect-square">
                    <canvas
                        ref={canvasRef}
                        className="w-full h-full cursor-crosshair"
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                    />
                </div>
            </div>
        </div>
    );
};

export default WritingPractice;
