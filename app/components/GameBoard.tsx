'use client'
import { useState } from 'react';
import QuestionCard from './QuestionCard';
import QuestionModal from './QuestionModal';
import { Category } from '../types/game';

const dummyCategories: Category[] = [
  {
    id: 1,
    name: 'التاريخ',
    questions: Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      points: i + 1,
      question: 'سؤال تجريبي',
      answer: 'إجابة تجريبية',
      isAnswered: false
    }))
  },
  {
    id: 2,
    name: 'الجغرافيا',
    questions: Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      points: i + 1,
      question: 'سؤال تجريبي',
      answer: 'إجابة تجريبية',
      isAnswered: false
    }))
  },
  {
    id: 3,
    name: 'العلوم',
    questions: Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      points: i + 1,
      question: 'سؤال تجريبي',
      answer: 'إجابة تجريبية',
      isAnswered: false
    }))
  },
  {
    id: 4,
    name: 'الثقافة العامة',
    questions: Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      points: i + 1,
      question: 'سؤال تجريبي',
      answer: 'إجابة تجريبية',
      isAnswered: false
    }))
  }
];

interface GameBoardProps {
  onTeamScoreUpdate: (teamId: number, points: number) => void;
}

export default function GameBoard({ onTeamScoreUpdate }: GameBoardProps) {
  const [categories, setCategories] = useState<Category[]>(dummyCategories);
  const [selectedQuestion, setSelectedQuestion] = useState<{ categoryId: number; questionId: number } | null>(null);

  const handleQuestionClick = (categoryId: number, questionId: number) => {
    setSelectedQuestion({ categoryId, questionId });
  };

  const handleTeamSelect = (teamId: number) => {
    if (!selectedQuestion) return;

    const { categoryId, questionId } = selectedQuestion;
    const category = categories.find(c => c.id === categoryId);
    const question = category?.questions.find(q => q.id === questionId);

    if (question) {
      // Update the question as answered
      setCategories(prevCategories => 
        prevCategories.map(cat => 
          cat.id === categoryId 
            ? {
                ...cat,
                questions: cat.questions.map(q => 
                  q.id === questionId ? { ...q, isAnswered: true } : q
                )
              }
            : cat
        )
      );

      // Update team score through parent component
      onTeamScoreUpdate(teamId, question.points);
    }

    setSelectedQuestion(null);
  };

  const getSelectedQuestion = () => {
    if (!selectedQuestion) return null;
    const category = categories.find(c => c.id === selectedQuestion.categoryId);
    return category?.questions.find(q => q.id === selectedQuestion.questionId) || null;
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="bg-game-light/10 backdrop-blur-sm rounded-lg p-4">
            <h2 className="text-2xl font-bold mb-4 text-center text-game-light">{category.name}</h2>
            <div className="grid grid-cols-2 gap-2">
              {category.questions.map((question) => (
                <QuestionCard
                  key={question.id}
                  points={question.points}
                  isAnswered={question.isAnswered}
                  onClick={() => handleQuestionClick(category.id, question.id)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedQuestion && (
        <QuestionModal
          question={getSelectedQuestion()!}
          onClose={() => setSelectedQuestion(null)}
          onTeamSelect={handleTeamSelect}
          team1Name="الفريق الأول"
          team2Name="الفريق الثاني"
        />
      )}
    </>
  );
} 