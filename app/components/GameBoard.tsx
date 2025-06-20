'use client'

import { useState, useEffect } from 'react';
import { Category, Question } from '../types';

interface GameBoardProps {
  categories: Category[];
  onSelectQuestion: (question: Question) => void;
}

interface ProcessedCategory extends Category {
  displayQuestions: (Question | null)[];
}

export default function GameBoard({ categories, onSelectQuestion }: GameBoardProps) {
  const [processedCategories, setProcessedCategories] = useState<ProcessedCategory[]>([]);

  useEffect(() => {
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
  }, [categories]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {processedCategories.map((category) => (
        <div key={category._id} className="bg-gray-800 rounded-lg shadow-lg p-4 flex flex-col">
          <h2 className="text-2xl font-bold text-center mb-4 text-white">
            {category.name}
          </h2>
          <div className="grid grid-cols-2 gap-2 flex-grow">
            {category.displayQuestions.map((question, index) => {
              const points = index + 1;
              if (question) {
                return (
                  <button
                    key={question._id}
                    onClick={() => onSelectQuestion(question)}
                    className={`font-bold py-3 px-4 rounded-md transition-transform transform hover:scale-105 ${
                      question.isAnswered 
                        ? 'text-gray-200 hover:opacity-80 cursor-pointer' 
                        : 'text-white hover:opacity-80'
                    }`}
                    style={{ 
                      backgroundColor: question.isAnswered ? '#4B5563' : category.color,
                      border: question.isAnswered ? '2px solid #6B7280' : '2px solid transparent'
                    }}
                    title={question.isAnswered ? 'سؤال مجاب عليه - يمكنك رؤيته مرة أخرى' : ''}
                  >
                    {points}
                  </button>
                );
              } else {
                return (
                  <div
                    key={index}
                    className="bg-gray-900 flex items-center justify-center text-gray-600 font-bold py-3 px-4 rounded-md cursor-not-allowed"
                  >
                    {points}
                  </div>
                );
              }
            })}
          </div>
        </div>
      ))}
    </div>
  );
} 