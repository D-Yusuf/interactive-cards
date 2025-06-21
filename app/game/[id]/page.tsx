'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getGame, getCategories, updateGame, markQuestionAsAnswered, getCachedCategories, endGame, trackAnsweredQuestion, clearGameCache } from '../../services/api';
import TeamScore from '../../components/TeamScore';
import GameBoard from '../../components/GameBoard';
import QuestionModal from '../../components/QuestionModal';
import LoadingSpinner from '../../components/LoadingSpinner';
import GameOverModal from '../../components/GameOverModal';
import { Category, Game, Question } from '../../types';

export default function GamePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [game, setGame] = useState<Game | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);

  useEffect(() => {
    if (!id) return;
    
    // Clear game cache when entering the game page
    clearGameCache();
    
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
    const teamName = teamId === 'firstTeam' ? game.firstTeamName : game.secondTeamName;
    
    // Create the answered question entry
    const answeredQuestion = {
      questionId: selectedQuestion._id,
      teamName: teamName,
      points: points,
      answeredAt: new Date().toISOString()
    };
    
    // Optimistic updates - immediate UI changes
    const optimisticGame = { 
      ...game, 
      [`${teamId}Score`]: newScore,
      answeredQuestions: [...(game.answeredQuestions || []), answeredQuestion]
    };
    setGame(optimisticGame);
    
    // Mark question as answered immediately in UI
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

    // API calls in background
    trackAnsweredQuestion(selectedQuestion._id, game._id, teamName, points).catch(err => {
      console.error('Failed to track answered question:', err);
      if (err.message === 'Admin privileges required') {
        setError('يجب أن تكون مسجلاً كمسؤول للإجابة على الأسئلة');
      }
    });
    
    markQuestionAsAnswered(selectedQuestion._id).catch(err => {
      console.error('Failed to mark question as answered:', err);
      if (err.message === 'Admin privileges required') {
        setError('يجب أن تكون مسجلاً كمسؤول للإجابة على الأسئلة');
      }
    });
    
    updateGame(game._id, { 
      [`${teamId}Score`]: newScore
    }).then(updatedGame => {
      // Don't update the game state from server response to preserve our optimistic updates
      // The server response might not include the answeredQuestions array properly
      console.log('Server updated game score, keeping optimistic answeredQuestions');
    }).catch(err => {
      console.error('Failed to update game score:', err);
      if (err.message === 'Admin privileges required') {
        setError('يجب أن تكون مسجلاً كمسؤول لتحديث النقاط');
      } else {
        // Revert optimistic update on error
        setGame(game);
      }
    });

    // Close modal
    handleCloseModal();
  };

  const handleEndGame = async () => {
    if (!game) return;
    
    if (confirm('هل أنت متأكد من إنهاء اللعبة؟')) {
      try {
        const endedGame = await endGame(game._id);
        setGame(endedGame.data);
        
        // Redirect to scoreboard page
        router.push(`/scoreboard/${game._id}`);
      } catch (err: any) {
        if (err.message === 'Admin privileges required') {
          setError('يجب أن تكون مسجلاً كمسؤول لإنهاء اللعبة');
        } else {
          setError('فشل في إنهاء اللعبة. يرجى المحاولة مرة أخرى.');
        }
      }
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;
  if (!game) return null;

  return (
    <div className="min-h-screen gradient-bg-dark text-white relative overflow-hidden">
      {/* Futuristic background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(102, 126, 234, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(102, 126, 234, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        {/* Floating orbs */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
        
        {/* Scanning lines */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-30 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-30 animate-pulse animation-delay-1000"></div>
      </div>

      {game.status === 'completed' && game.winner && <GameOverModal winner={game.winner} />}
      <QuestionModal
        question={selectedQuestion}
        onClose={handleCloseModal}
        onCorrectAnswer={handleCorrectAnswer}
        firstTeamName={game.firstTeamName}
        secondTeamName={game.secondTeamName}
      />
      
      {/* Main content */}
      <div className="relative z-10 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="text-center">
              <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                {game.name}
              </h1>
              <div className="flex items-center gap-2 text-gray-300">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm">جاري التشغيل</span>
              </div>
            </div>
            <button
              onClick={handleEndGame}
              className="glass-dark text-red-400 hover:text-red-300 font-bold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-red-500/30"
            >
              إنهاء اللعبة
            </button>
          </div>

          {/* Team Scores */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="glass-dark rounded-2xl p-6 backdrop-blur-sm border border-white/10">
              <TeamScore 
                teamName={game.firstTeamName} 
                score={game.firstTeamScore} 
              />
            </div>
            <div className="glass-dark rounded-2xl p-6 backdrop-blur-sm border border-white/10">
              <TeamScore 
                teamName={game.secondTeamName} 
                score={game.secondTeamScore} 
              />
            </div>
          </div>

          {/* Game Board */}
          <div className="glass-dark rounded-2xl p-6 backdrop-blur-sm border border-white/10">
            <GameBoard categories={categories} game={game} onSelectQuestion={handleSelectQuestion} />
          </div>
        </div>
      </div>
    </div>
  );
} 