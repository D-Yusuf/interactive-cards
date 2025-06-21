'use client';

import { Question } from '../../types';

// Icons
const EditIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z" />
  </svg>
);
const DeleteIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

interface QuestionCardProps {
  question: Question;
  onEdit: (question: Question) => void;
  onDelete: (id: string) => void;
  onToggleAnswered: (question: Question) => void;
}

export default function QuestionCard({ question, onEdit, onDelete, onToggleAnswered }: QuestionCardProps) {
  const cardClasses = `bg-gray-700 p-4 rounded-lg shadow-md relative transition-all duration-200 cursor-pointer hover:bg-gray-600 ${
    question.isAnswered ? 'opacity-60 border-l-4 border-green-500' : 'opacity-100 border-l-4 border-transparent'
  }`;
  
  const handleCardClick = (e: React.MouseEvent) => {
    // Don't toggle if clicking on edit or delete buttons
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    onToggleAnswered(question);
  };
  
  return (
    <div className={cardClasses} onClick={handleCardClick}>
      <div className="absolute top-2 right-2 flex flex-col gap-2">
        <button onClick={() => onEdit(question)} className="text-blue-400 hover:text-blue-300">
          <EditIcon />
        </button>
        <button onClick={() => onDelete(question._id)} className="text-red-500 hover:text-red-400">
          <DeleteIcon />
        </button>
      </div>
      
      {/* Answered indicator */}
      {question.isAnswered && (
        <div className="absolute top-2 left-2 text-green-400">
          <CheckIcon />
        </div>
      )}
      
      <div className="pr-8">
        <p className="font-bold text-lg mb-2">{question.question}</p>
        <p className="text-gray-300 mb-1">
          <span className="font-semibold">الجواب:</span> {question.answer}
        </p>
        <p className="text-gray-400">
          <span className="font-semibold">النقاط:</span> {question.points}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          {question.isAnswered ? '✅ مجاب عليه' : '❌ غير مجاب عليه'}
        </p>
      </div>
    </div>
  );
} 