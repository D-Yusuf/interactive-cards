'use client'
interface TeamScoreProps {
  teamName: string;
  score: number;
}

export default function TeamScore({ teamName, score }: TeamScoreProps) {
  return (
    <div className="bg-game-light/10 backdrop-blur-sm rounded-lg p-6 flex-1 text-center shadow-lg hover:shadow-xl transition-all">
      <h2 className="text-2xl font-bold mb-2 text-game-light">{teamName}</h2>
      <div className="text-4xl font-bold text-game-accent">{score}</div>
    </div>
  );
} 