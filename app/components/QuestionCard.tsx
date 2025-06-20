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
          ? 'bg-gray-600/30 text-gray-400 cursor-not-allowed' 
          : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95'
        }
      `}
    >
      {points}
    </button>
  );
} 