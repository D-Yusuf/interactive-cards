'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getGame } from '../../services/api';
import { Game } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import BackButton from '../../components/BackButton';

export default function ScoreboardPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  useEffect(() => {
    if (!id) return;
    
    const fetchGameData = async () => {
      try {
        setLoading(true);
        const response = await getGame(id);
        setGame(response.data);
      } catch (err) {
        setError('فشل في تحميل بيانات اللعبة. يرجى المحاولة مرة أخرى.');
      } finally {
        setLoading(false);
      }
    };
    fetchGameData();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;
  if (!game) return null;

  const isWinner = (teamName: string) => {
    if (game.winner === 'تعادل') return false;
    return game.winner === teamName;
  };

  const isLoser = (teamName: string) => {
    if (game.winner === 'تعادل') return false;
    return game.winner !== teamName;
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <div className="mb-6">
          <BackButton />
        </div>
        
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-cyan-400 mb-4">نتيجة اللعبة</h1>
          <h2 className="text-3xl text-gray-300 mb-2">{game.name}</h2>
          {game.winner === 'تعادل' ? (
            <div className="text-2xl text-yellow-400 font-bold">تعادل!</div>
          ) : (
            <div className="text-2xl text-green-400 font-bold">الفائز: {game.winner}</div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* First Team */}
          <div className={`
            relative 
            ${isWinner(game.firstTeamName) ? 'md:order-1' : 'md:order-2'}
          `}>
            <div className={`
              bg-gray-800 rounded-lg shadow-2xl p-8 text-center relative overflow-hidden
              ${isWinner(game.firstTeamName) 
                ? 'ring-4 ring-yellow-400 ring-opacity-75 transform scale-105' 
                : isLoser(game.firstTeamName) 
                  ? 'opacity-75' 
                  : ''
              }
            `}>
              {isWinner(game.firstTeamName) && (
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 opacity-10 animate-pulse"></div>
              )}
              <div className="relative z-10">
                <h3 className="text-3xl font-bold mb-4 text-blue-400">{game.firstTeamName}</h3>
                <div className="text-6xl font-bold text-white mb-4">{game.firstTeamScore}</div>
                <div className="text-lg text-gray-400">نقطة</div>
                {isWinner(game.firstTeamName) && (
                  <div className="mt-4">
                    <div className="text-4xl">🏆</div>
                    <div className="text-yellow-400 font-bold text-xl">الفائز!</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Second Team */}
          <div className={`
            relative 
            ${isWinner(game.secondTeamName) ? 'md:order-1' : 'md:order-2'}
          `}>
            <div className={`
              bg-gray-800 rounded-lg shadow-2xl p-8 text-center relative overflow-hidden
              ${isWinner(game.secondTeamName) 
                ? 'ring-4 ring-yellow-400 ring-opacity-75 transform scale-105' 
                : isLoser(game.secondTeamName) 
                  ? 'opacity-75' 
                  : ''
              }
            `}>
              {isWinner(game.secondTeamName) && (
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 opacity-10 animate-pulse"></div>
              )}
              <div className="relative z-10">
                <h3 className="text-3xl font-bold mb-4 text-red-400">{game.secondTeamName}</h3>
                <div className="text-6xl font-bold text-white mb-4">{game.secondTeamScore}</div>
                <div className="text-lg text-gray-400">نقطة</div>
                {isWinner(game.secondTeamName) && (
                  <div className="mt-4">
                    <div className="text-4xl">🏆</div>
                    <div className="text-yellow-400 font-bold text-xl">الفائز!</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Game Details */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-2xl font-bold mb-4 text-center">تفاصيل اللعبة</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-cyan-400">{game.firstTeamScore + game.secondTeamScore}</div>
              <div className="text-gray-400">إجمالي النقاط</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-400">{game.answeredQuestions?.length || 0}</div>
              <div className="text-gray-400">الأسئلة المجاب عليها</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400">
                {formatDateArabic(game.createdAt)}
              </div>
              <div className="text-gray-400">تاريخ اللعبة</div>
            </div>
          </div>
        </div>

        {/* Back to Home Button */}
        <div className="text-center mt-8">
          <button
            onClick={() => window.location.href = '/'}
            className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-8 rounded-md text-lg transition-colors"
          >
            العودة للصفحة الرئيسية
          </button>
        </div>
      </div>
    </div>
  );
} 