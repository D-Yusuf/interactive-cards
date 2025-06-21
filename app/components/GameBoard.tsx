'use client'

import { useState, useEffect, memo } from 'react';
import { Category, Question, Game } from '../types';

interface GameBoardProps {
  categories: Category[];
  game: Game | null;
  onSelectQuestion: (question: Question) => void;
}

interface ProcessedCategory extends Category {
  displayQuestions: (Question | null)[];
}

// Individual card component with its own state
const QuestionCard = memo(({ 
  question, 
  points, 
  categoryColor, 
  isAnswered, 
  onSelect 
}: {
  question: Question;
  points: number;
  categoryColor: string;
  isAnswered: boolean;
  onSelect: (question: Question) => void;
}) => {
  return (
    <button
      onClick={() => onSelect(question)}
      className={`relative font-bold py-4 px-4 rounded-xl transition-all duration-300 hover:scale-105 group overflow-hidden ${
        isAnswered 
          ? 'text-gray-300 hover:opacity-80 cursor-pointer' 
          : 'text-white hover:opacity-90'
      }`}
      style={{ 
        backgroundColor: isAnswered ? '#374151' : categoryColor,
        border: isAnswered ? '2px solid #6B7280' : '2px solid rgba(255, 255, 255, 0.2)',
        boxShadow: isAnswered 
          ? '0 4px 6px rgba(0, 0, 0, 0.3)' 
          : `0 8px 25px ${categoryColor}40, 0 4px 10px rgba(0, 0, 0, 0.3)`
      }}
      title={isAnswered ? 'سؤال مجاب عليه - يمكنك رؤيته مرة أخرى' : ''}
    >
      {/* Futuristic glow effect */}
      {!isAnswered && (
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      )}
      
      {/* Card content */}
      <div className="relative z-10 flex items-center justify-center">
        <span className="text-xl font-bold">{points}</span>
      </div>
      
      {/* Scanning line effect */}
      {!isAnswered && (
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      )}
    </button>
  );
});

QuestionCard.displayName = 'QuestionCard';

// Empty card component
const EmptyCard = memo(({ points }: { points: number }) => {
  return (
    <div className="bg-gray-800/50 flex items-center justify-center text-gray-500 font-bold py-4 px-4 rounded-xl border border-gray-700/50 backdrop-blur-sm">
      {points}
    </div>
  );
});

EmptyCard.displayName = 'EmptyCard';

export default function GameBoard({ categories, game, onSelectQuestion }: GameBoardProps) {
  const [processedCategories, setProcessedCategories] = useState<ProcessedCategory[]>([]);

  useEffect(() => {
    console.log('GameBoard useEffect - game:', game);
    
    if (!game || !game.selectedQuestions || game.selectedQuestions.length === 0) {
      console.log('No selected questions, using fallback');
      // Fallback to random selection if no selected questions
      const newProcessedCategories = categories.map(category => {
        const questionsByPoints = new Map<number, Question[]>();
        
        for (const q of category.questions) {
          if (q.points >= 1 && q.points <= 10) {
            if (!questionsByPoints.has(q.points)) {
              questionsByPoints.set(q.points, []);
            }
            questionsByPoints.get(q.points)!.push(q);
          }
        }

        const pointValues = Array.from({ length: 10 }, (_, i) => i + 1);
        
        const selectedQuestions: (Question | null)[] = pointValues.map(point => {
          const group = questionsByPoints.get(point);
          if (group && group.length > 0) {
            const randomIndex = Math.floor(Math.random() * group.length);
            return group[randomIndex];
          }
          return null;
        });

        return {
          ...category,
          displayQuestions: selectedQuestions,
        };
      });
      setProcessedCategories(newProcessedCategories);
      return;
    }

    console.log('Using selected questions from game:', game.selectedQuestions);
    // Use ONLY the pre-selected questions from the game - completely ignore categories
    const newProcessedCategories = categories.map(category => {
      const pointValues = Array.from({ length: 10 }, (_, i) => i + 1);
      
      const selectedQuestions: (Question | null)[] = pointValues.map(point => {
        // Find the selected question for this category and point value
        const selectedQuestionData = game.selectedQuestions!.find(sq => 
          sq.categoryId === category._id && sq.pointValue === point
        );
        
        if (selectedQuestionData && selectedQuestionData.questionId) {
          // Use the populated question data directly from the game
          const question = selectedQuestionData.questionId as any;
          if (question && typeof question === 'object' && question._id) {
            return question as Question;
          }
        }
        
        return null;
      });

      return {
        ...category,
        displayQuestions: selectedQuestions,
      };
    });
    setProcessedCategories(newProcessedCategories);
  }, [game]); // Only depend on game, completely ignore categories

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {processedCategories.map((category) => (
        <div key={category._id} className="glass-dark rounded-2xl p-6 backdrop-blur-sm border border-white/10">
          <h2 className="text-2xl font-bold text-center mb-6 text-white relative">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {category.name}
            </span>
            {/* Category indicator line */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent"></div>
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {category.displayQuestions.map((question, index) => {
              const points = index + 1;
              if (question) {
                // Check if this specific question is answered by looking ONLY at the game's answeredQuestions
                const isAnswered = game?.answeredQuestions?.some(aq => aq.questionId === question._id) || false;
                
                return (
                  <QuestionCard
                    key={question._id}
                    question={question}
                    points={points}
                    categoryColor={category.color}
                    isAnswered={isAnswered}
                    onSelect={onSelectQuestion}
                  />
                );
              } else {
                return (
                  <EmptyCard
                    key={`empty-${category._id}-${index}`}
                    points={points}
                  />
                );
              }
            })}
          </div>
        </div>
      ))}
    </div>
  );
} 