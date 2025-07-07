'use client'
import React, { useState, useEffect } from 'react';
import { Question } from '../types/index.ts';
import Timer from './Timer.tsx';

interface QuestionModalProps {
  question: Question | null;
  onClose: () => void;
  onCorrectAnswer: (teamId: 'firstTeam' | 'secondTeam') => void;
  firstTeamName: string;
  secondTeamName: string;
}

export default function QuestionModal({ question, onClose, onCorrectAnswer, firstTeamName, secondTeamName }: QuestionModalProps) {
  const [showAnswer, setShowAnswer] = useState(false);
  const [timerActive, setTimerActive] = useState(false);

  // Reset showAnswer state and start timer when question changes
  useEffect(() => {
    if (question) {
      setShowAnswer(false);
      setTimerActive(true);
    } else {
      setTimerActive(false);
    }
  }, [question]);

  if (!question) return null;

  const handleRevealAnswer = () => {
    setShowAnswer(true);
    setTimerActive(false); // Stop timer when answer is revealed
  };

  const handleTeamSelection = (teamId: 'firstTeam' | 'secondTeam') => {
    setTimerActive(false); // Stop timer when team is selected
    onCorrectAnswer(teamId);
    // Modal will be closed automatically by the parent component
  };

  const handleTimeUp = () => {
    // Timer callback - doesn't need to do anything specific
    console.log('Timer reached maximum time');
  };

  const handleClose = () => {
    setTimerActive(false); // Stop timer when modal is closed
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-2xl p-8 max-w-2xl w-full text-center relative">
        <button onClick={handleClose} className="absolute top-4 left-4 text-gray-400 hover:text-white text-2xl">&times;</button>
        
        {/* Timer Display */}
        <div className="mb-6">
          <Timer onTimeUp={handleTimeUp} isActive={timerActive} />
        </div>
        
        {question.isAnswered && (
          <div className="bg-yellow-600 text-white px-4 py-2 rounded-md mb-4">
            ⚠️ هذا السؤال مجاب عليه بالفعل - يمكنك رؤيته مرة أخرى
          </div>
        )}
        
        <h2 className="text-3xl font-bold mb-4 text-cyan-400">{question.question}</h2>
        
        {!showAnswer ? (
          <div>
            <button
              onClick={handleRevealAnswer}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-md text-lg transition-transform transform hover:scale-105"
            >
              {question.isAnswered ? 'إظهار الإجابة مرة أخرى' : 'إظهار الإجابة'}
            </button>
          </div>
        ) : (
          <div>
            <p className="text-2xl font-semibold text-white my-6 bg-gray-700 p-4 rounded-md">{question.answer}</p>
            <div className="mt-6">
              <h3 className="text-xl mb-4 text-gray-300">لمن تذهب النقاط؟</h3>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => handleTeamSelection('firstTeam')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md text-lg transition-transform transform hover:scale-105"
                >
                  {firstTeamName}
                </button>
                <button
                  onClick={() => handleTeamSelection('secondTeam')}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-md text-lg transition-transform transform hover:scale-105"
                >
                  {secondTeamName}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 