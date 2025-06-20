'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getGame, getCategories, updateGame, markQuestionAsAnswered, getCachedCategories } from '../../services/api';
import TeamScore from '../../components/TeamScore';
import GameBoard from '../../components/GameBoard';
import QuestionModal from '../../components/QuestionModal';
import LoadingSpinner from '../../components/LoadingSpinner';
import GameOverModal from '../../components/GameOverModal';
import { Category, Game, Question } from '../../types';

export default function GamePage() {
  const params = useParams();
  const id = params.id as string;
  
  const [game, setGame] = useState<Game | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);

  useEffect(() => {
    if (!id) return;
    
    const fetchGameData = async () => {
      try {
        setLoading(true);
        
        // Try to get cached categories first for instant loading
        const cachedCategories = getCachedCategories();
        if (cachedCategories) {
          setCategories(cachedCategories);
        }
        
        const [gameRes, categoriesRes] = await Promise.all([
          getGame(id),
          getCategories(), // This will always fetch fresh data and update cache
        ]);
        setGame(gameRes.data);
        setCategories(categoriesRes.data);
      } catch (err) {
        setError('فشل في تحميل بيانات اللعبة. يرجى المحاولة مرة أخرى.');
      } finally {
        setLoading(false);
      }
    };
    fetchGameData();
  }, [id]);

  const handleSelectQuestion = (question: Question) => {
    setSelectedQuestion(question);
  };

  const handleCloseModal = () => {
    setSelectedQuestion(null);
  };

  const handleCorrectAnswer = async (teamId: 'firstTeam' | 'secondTeam') => {
    if (!game || !selectedQuestion) return;

    const points = selectedQuestion.points;
    const newScore = (game[`${teamId}Score`] || 0) + points;
    
    try {
      // Optimistic updates
      const optimisticGame = { ...game, [`${teamId}Score`]: newScore };
      setGame(optimisticGame);
      
      // Mark question as answered in categories (don't remove it, just mark it)
      setCategories(prev => 
        prev.map(cat => ({
          ...cat,
          questions: cat.questions.map(q => 
            q._id === selectedQuestion._id 
              ? { ...q, isAnswered: true }
              : q
          )
        }))
      );

      // Mark question as answered in backend
      await markQuestionAsAnswered(selectedQuestion._id);
      
      // Update team score
      const updatedGame = await updateGame(game._id, { [`${teamId}Score`]: newScore });
      setGame(updatedGame.data);

      // Automatically close the modal
      handleCloseModal();
    } catch (err) {
      setError('فشل في تحديث النتيجة. يرجى المحاولة مرة أخرى.');
      // Revert optimistic updates on error
      setGame(game);
      setCategories(prev => 
        prev.map(cat => ({
          ...cat,
          questions: cat.questions.map(q => 
            q._id === selectedQuestion._id 
              ? { ...q, isAnswered: false }
              : q
          )
        }))
      );
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;
  if (!game) return null;

  return (
    <div dir="rtl" className="min-h-screen bg-gray-900 text-white p-8">
      {game.status === 'completed' && game.winner && <GameOverModal winner={game.winner} />}
      <QuestionModal
        question={selectedQuestion}
        onClose={handleCloseModal}
        onCorrectAnswer={handleCorrectAnswer}
        firstTeamName={game.firstTeamName}
        secondTeamName={game.secondTeamName}
      />
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-cyan-400">لعبة الأسئلة</h1>
          <button
            onClick={() => {
              // TODO: Implement end game functionality
              if (confirm('هل أنت متأكد من إنهاء اللعبة؟')) {
                // End the game
                console.log('Ending game...');
              }
            }}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-md transition-colors"
          >
            إنهاء اللعبة
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-8">
          <TeamScore teamName={game.firstTeamName} score={game.firstTeamScore} />
          <TeamScore teamName={game.secondTeamName} score={game.secondTeamScore} />
        </div>
        <GameBoard categories={categories} onSelectQuestion={handleSelectQuestion} />
      </div>
    </div>
  );
} 