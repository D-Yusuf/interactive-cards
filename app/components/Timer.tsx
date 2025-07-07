'use client'
import { useEffect, useState } from 'react';

interface TimerProps {
  onTimeUp: () => void;
  isActive: boolean;
}

export default function Timer({ onTimeUp, isActive }: TimerProps) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive]);

  return (
    <div className="text-xl font-bold text-center w-fit mx-auto  px-6 py-2 rounded-lg shadow-lg border">
      {String(Math.floor(seconds / 60)).padStart(2, '0')}:{String(seconds % 60).padStart(2, '0')}
    </div>
  );
} 