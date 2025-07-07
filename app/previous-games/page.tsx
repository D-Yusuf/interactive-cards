'use client';

import React, { useEffect, useState } from 'react';
import { getGames, resetQuestionsForGame } from '../services/api.ts';
import { Game } from '../types/index.ts';
import LoadingSpinner from '../components/LoadingSpinner.tsx';
import BackButton from '../components/BackButton.tsx';

export default function PreviousGamesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [resettingGame, setResettingGame] = useState<string | null>(null);

  // Arabic month names for Gregorian calendar
  const formatDateArabic = (dateString: string) => {
    const date = new Date(dateString);
    const arabicMonths = [
      'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];
    
    const day = date.getDate();
    const month = arabicMonths[date.getMonth()];
    const year = date.getFullYear();
    
    return `${day} ${month} ${year}`;
  };

  const formatTimeArabic = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        const response = await getGames();
        // Filter only completed games
        const completedGames = response.data.filter((game: Game) => game.status === 'completed');
        setGames(completedGames);
      } catch (err) {
        setError('فشل في تحميل الألعاب السابقة. يرجى المحاولة مرة أخرى.');
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, []);

  const handleResetQuestions = async (gameId: string) => {
    if (!confirm('هل أنت متأكد من إعادة تعيين الأسئلة لهذه اللعبة؟ ستكون متاحة للاستخدام مرة أخرى.')) {
      return;
    }
    
    try {
      setResettingGame(gameId);
      await resetQuestionsForGame(gameId);
      // Refresh the games list
      const response = await getGames();
      const completedGames = response.data.filter((game: Game) => game.status === 'completed');
      setGames(completedGames);
    } catch (err) {
      setError('فشل في إعادة تعيين الأسئلة. يرجى المحاولة مرة أخرى.');
    } finally {
      setResettingGame(null);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;

  return (
    <div dir="rtl" className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Back button - positioned top left */}
        <div className="mb-6 flex justify-start">
          <BackButton />
        </div>
        
        <h1 className="text-4xl font-bold text-center mb-8 text-cyan-400">الألعاب السابقة</h1>
        
        {games.length === 0 ? (
          <div className="text-center text-gray-400 text-xl">
            لا توجد ألعاب مكتملة بعد
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {games.map((game) => (
              <div key={game._id} className="bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-cyan-400">{game.name}</h2>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                    game.winner === 'تعادل' 
                      ? 'bg-yellow-600 text-yellow-100' 
                      : 'bg-green-600 text-green-100'
                  }`}>
                    {game.winner === 'تعادل' ? 'تعادل' : 'مكتملة'}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-blue-400">{game.firstTeamName}</div>
                    <div className="text-3xl font-bold">{game.firstTeamScore}</div>
                    <div className="text-sm text-gray-400">نقطة</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-red-400">{game.secondTeamName}</div>
                    <div className="text-3xl font-bold">{game.secondTeamScore}</div>
                    <div className="text-sm text-gray-400">نقطة</div>
                  </div>
                </div>

                {game.winner && game.winner !== 'تعادل' && (
                  <div className="text-center mb-4">
                    <div className="text-lg font-bold text-yellow-400">
                      🏆 الفائز: {game.winner}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-400">
                  <div>
                    <div className="font-semibold">إجمالي النقاط:</div>
                    <div>{game.firstTeamScore + game.secondTeamScore}</div>
                  </div>
                  <div>
                    <div className="font-semibold">الأسئلة المجاب عليها:</div>
                    <div>{game.answeredQuestions?.length || 0}</div>
                  </div>
                </div>

                <div className="text-sm text-gray-500 text-center">
                  {formatDateArabic(game.createdAt)} - {formatTimeArabic(game.createdAt)}
                </div>

                {/* Detailed Questions Section */}
                {game.answeredQuestions && game.answeredQuestions.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-bold mb-3 text-gray-300">الأسئلة المجاب عليها:</h3>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {game.answeredQuestions.map((answered, index) => (
                        <div key={index} className="bg-gray-700 rounded p-3 text-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-cyan-400 font-semibold">{answered.teamName}</span>
                            <span className="text-yellow-400 font-bold">+{answered.points}</span>
                          </div>
                          <div className="text-gray-400 text-xs mt-1">
                            {formatTimeArabic(answered.answeredAt)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-4 text-center">
                  <button
                    onClick={() => window.location.href = `/scoreboard/${game._id}`}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-md transition-colors mr-2"
                  >
                    عرض النتيجة التفصيلية
                  </button>
                  <button
                    onClick={() => handleResetQuestions(game._id)}
                    disabled={resettingGame === game._id}
                    className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition-colors"
                  >
                    {resettingGame === game._id ? 'جاري الإعادة...' : 'إعادة تعيين الأسئلة'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 