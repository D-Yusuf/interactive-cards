'use client'
interface TeamScoreProps {
  teamName: string;
  score: number;
}

export default function TeamScore({ teamName, score }: TeamScoreProps) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg text-center">
      <h2 className="text-2xl font-bold text-cyan-400">{teamName}</h2>
      <p className="text-4xl font-extrabold text-white mt-2">{score}</p>
    </div>
  );
} 