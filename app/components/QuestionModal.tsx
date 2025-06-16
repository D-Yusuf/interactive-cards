'use client'
import { useState } from 'react';
import { Question } from '../types/game';
import Timer from './Timer';

interface QuestionModalProps {
  question: Question;
  onClose: () => void;
  onTeamSelect: (teamId: number) => void;
  team1Name: string;
  team2Name: string;
}

export default function QuestionModal({ 
  question, 
  onClose, 
  onTeamSelect,
  team1Name,
  team2Name 
}: QuestionModalProps) {
  const [showAnswer, setShowAnswer] = useState(false);
  const [showTeamSelection, setShowTeamSelection] = useState(false);

  const handleShowAnswer = () => {
    setShowAnswer(true);
    setShowTeamSelection(true);
  };

  const handleTeamSelect = (teamId: number) => {
    onTeamSelect(teamId);
    onClose();
  };

  const handleNoAnswer = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-game-dark/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-game-light to-game-light/95 rounded-lg p-8 max-w-2xl w-full mx-4 relative shadow-2xl ">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-game-neutral hover:text-game-dark transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Timer positioned above the modal */}
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
          <Timer onTimeUp={() => setShowTeamSelection(true)} isActive={!showTeamSelection} />
        </div>

        <div className="text-right">
          <h2 className="text-3xl font-bold mb-4 text-game-dark">
            {question.points} نقطة
          </h2>
          
          <p className="text-2xl mb-6 text-game-dark">{question.question}</p>

          {showAnswer && (
            <div className="mb-6">
              <p className="text-xl text-game-dark/80">{question.answer}</p>
            </div>
          )}

          {!showAnswer && (
            <button
              onClick={handleShowAnswer}
              className="bg-game-primary text-game-light px-6 py-3 rounded-lg text-xl hover:bg-game-primary/90 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
            >
              عرض الإجابة
            </button>
          )}

          {showTeamSelection && (
            <div className="flex flex-col gap-4 justify-center mt-6">
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => handleTeamSelect(1)}
                  className="bg-game-success text-game-light px-6 py-3 rounded-lg text-xl hover:bg-game-success/90 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                >
                  {team1Name}
                </button>
                <button
                  onClick={() => handleTeamSelect(2)}
                  className="bg-game-danger text-game-light px-6 py-3 rounded-lg text-xl hover:bg-game-danger/90 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                >
                  {team2Name}
                </button>
              </div>
              <button
                onClick={handleNoAnswer}
                className="bg-game-neutral text-game-light px-6 py-3 rounded-lg text-xl hover:bg-game-neutral/90 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
              >
                محد جاوب
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 