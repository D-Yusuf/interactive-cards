'use client'
interface QuestionCardProps {
  points: number;
  isAnswered: boolean;
  onClick: () => void;
}

export default function QuestionCard({ points, isAnswered, onClick }: QuestionCardProps) {
  return (
    <button
      onClick={onClick}
      disabled={isAnswered}
      className={`
        w-full aspect-square flex items-center justify-center
        text-2xl font-bold rounded-lg transition-all
        ${isAnswered 
          ? 'bg-game-neutral/30 text-game-neutral/50 cursor-not-allowed' 
          : 'bg-game-primary hover:bg-game-primary/90 text-game-light shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95'
        }
      `}
    >
      {points}
    </button>
  );
} 