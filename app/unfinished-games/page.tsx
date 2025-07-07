'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getGames } from '../services/api';
import { Game } from '../types/index';
import LoadingSpinner from '../components/LoadingSpinner';
import BackButton from '../components/BackButton';

// Delete icon
const DeleteIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

// Continue icon
const ContinueIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default function UnfinishedGamesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchUnfinishedGames();
  }, []);

  const fetchUnfinishedGames = async () => {
    try {
      setLoading(true);
      const response = await getGames();
      // Filter only ongoing games
      const unfinishedGames = response.data.filter((game: Game) => game.status === 'ongoing');
      setGames(unfinishedGames);
    } catch (err: any) {
      if (err.message === 'Admin privileges required') {
        setError('يجب أن تكون مسجلاً كمسؤول لعرض الألعاب غير المكتملة');
      } else {
        setError('فشل في تحميل الألعاب غير المكتملة');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleContinueGame = (gameId: string) => {
    router.push(`/game/${gameId}`);
  };

  const handleDeleteGame = async (gameId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه اللعبة؟ سيتم تحرير جميع الأسئلة المرتبطة بها.')) {
      return;
    }

    try {
      // Reset questions for this game to free them up
      await fetch(`http://localhost:8080/questions/reset-game/${gameId}`, {
        method: 'POST',
      });

      // Remove game from local state
      setGames(prev => prev.filter(game => game._id !== gameId));
      
      alert('تم حذف اللعبة وتحرير الأسئلة بنجاح');
    } catch (err) {
      setError('فشل في حذف اللعبة');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const arabicMonths = [
      'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];
    
    const day = date.getDate();
    const month = arabicMonths[date.getMonth()];
    const year = date.getFullYear();
    const time = date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
    
    return `${day} ${month} ${year} - ${time}`;
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen gradient-bg-dark text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Back button */}
        <div className="mb-6">
          <BackButton />
        </div>
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              الألعاب غير المكتملة
            </h1>
            <p className="text-gray-300 mt-2">
              إدارة الألعاب التي تم بدؤها ولكن لم تكتمل
            </p>
          </div>
          <button
            onClick={() => router.push('/')}
            className="glass-dark text-white font-semibold py-2 px-4 rounded-xl transition-all duration-300 hover:scale-105 backdrop-blur-sm"
          >
            العودة للصفحة الرئيسية
          </button>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 text-red-300 text-center mb-6">
            {error}
          </div>
        )}

        {/* Games List */}
        {games.length === 0 ? (
          <div className="glass-dark rounded-2xl p-12 text-center backdrop-blur-sm">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-white mb-2">لا توجد ألعاب غير مكتملة</h2>
            <p className="text-gray-300">جميع الألعاب مكتملة أو لم يتم بدء أي لعبة بعد</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {games.map((game) => (
              <div key={game._id} className="glass-dark rounded-2xl p-6 backdrop-blur-sm border border-white/10">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">{game.name}</h3>
                    <div className="flex gap-6 text-gray-300">
                      <div>
                        <span className="font-semibold">الفريق الأول:</span> {game.firstTeamName} ({game.firstTeamScore} نقطة)
                      </div>
                      <div>
                        <span className="font-semibold">الفريق الثاني:</span> {game.secondTeamName} ({game.secondTeamScore} نقطة)
                      </div>
                    </div>
                    <div className="text-sm text-gray-400 mt-2">
                      تم البدء في: {formatDate(game.createdAt)}
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleContinueGame(game._id)}
                      className="glass-dark bg-green-600/20 hover:bg-green-600/30 text-green-400 hover:text-green-300 font-semibold py-2 px-4 rounded-xl transition-all duration-300 hover:scale-105 backdrop-blur-sm flex items-center gap-2"
                    >
                      <ContinueIcon />
                      متابعة اللعبة
                    </button>
                    <button
                      onClick={() => handleDeleteGame(game._id)}
                      className="glass-dark bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 font-semibold py-2 px-4 rounded-xl transition-all duration-300 hover:scale-105 backdrop-blur-sm flex items-center gap-2"
                    >
                      <DeleteIcon />
                      حذف اللعبة
                    </button>
                  </div>
                </div>
                
                {/* Progress indicator */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>تقدم اللعبة</span>
                    <span>{game.answeredQuestions?.length || 0} سؤال مجاب عليه</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Math.min(((game.answeredQuestions?.length || 0) / 40) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 