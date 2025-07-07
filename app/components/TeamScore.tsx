'use client'
import React from 'react';

interface TeamScoreProps {
  teamName: string;
  score: number;
  onScoreChange?: (delta: number) => void;
  disabled?: boolean;
}

export default function TeamScore({ teamName, score, onScoreChange, disabled }: TeamScoreProps) {
  const handleScoreChange = (delta: number) => {
    if (!onScoreChange) return;
    
    // Instant UI update - no debouncing, no delays
    onScoreChange(delta);
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg text-center relative">
      {/* Minus button on the left */}
      {onScoreChange && (
        <button
          onClick={() => handleScoreChange(-1)}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-lg active:scale-95 flex items-center justify-center text-xl"
          title="تقليل النقاط"
        >
          <span className="leading-none">−</span>
        </button>
      )}
      
      <h2 className="text-2xl font-bold text-cyan-400">{teamName}</h2>
      <p className="text-4xl font-extrabold text-white mt-2">{score}</p>
      
      {/* Plus button on the right */}
      {onScoreChange && (
        <button
          onClick={() => handleScoreChange(1)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-lg active:scale-95 flex items-center justify-center text-xl"
          title="زيادة النقاط"
        >
          <span className="leading-none">+</span>
        </button>
      )}
    </div>
  );
} 