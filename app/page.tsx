'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createGame } from './services/api';
import LoginModal from './components/LoginModal';
import Link from 'next/link';

// Key icon component
const KeyIcon = () => (
  <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L12 17H9v-3l-1.257-1.257A6 6 0 1119 9z" />
  </svg>
);

export default function StartPage() {
  const [gameName, setGameName] = useState('');
  const [firstTeamName, setFirstTeamName] = useState('');
  const [secondTeamName, setSecondTeamName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const adminStatus = localStorage.getItem('axdxmxixn') === 'true';
    setIsAdmin(adminStatus);
  }, []);

  const handleStartGame = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      setError('يجب أن تكون مسجلاً كمسؤول لبدء اللعبة');
      return;
    }
    if (!firstTeamName || !secondTeamName || !gameName) {
      setError('يرجى إدخال اسم اللعبة وأسماء الفريقين');
      return;
    }
    setLoading(true);
    try {
      const gameData = {
        name: gameName,
        firstTeamName,
        secondTeamName,
      };
      const response = await createGame(gameData);
      const gameId = response.data._id;
      router.push(`/game/${gameId}${gameName ? `?gameName=${encodeURIComponent(gameName)}` : ''}`);
    } catch (err) {
      setError('حدث خطأ أثناء بدء اللعبة. يرجى المحاولة مرة أخرى.');
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4 relative">
      <div className="absolute top-4 right-4 flex items-center gap-4">
        {isAdmin && (
          <>
            <Link href="/manage-questions">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">
                إدارة الأسئلة
              </button>
            </Link>
            <Link href="/previous-games">
              <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md">
                الألعاب السابقة
              </button>
            </Link>
            <KeyIcon />
          </>
        )}
        <button 
          onClick={() => setLoginModalOpen(true)}
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md"
        >
          تسجيل الدخول
        </button>
      </div>

      {isLoginModalOpen && (
        <LoginModal
          onClose={() => setLoginModalOpen(false)}
          onLoginSuccess={() => setIsAdmin(true)}
        />
      )}

      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold text-center mb-6 text-cyan-400">لعبة الأسئلة</h1>
        <form onSubmit={handleStartGame} className="space-y-6">
          <div>
            <label htmlFor="gameName" className="block text-lg font-medium text-gray-300 mb-2">
              اسم اللعبة
            </label>
            <input
              id="gameName"
              type="text"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              placeholder="مثال: تحدي الأصدقاء"
            />
          </div>
          <div>
            <label htmlFor="firstTeamName" className="block text-lg font-medium text-gray-300 mb-2">
              اسم الفريق الأول
            </label>
            <input
              id="firstTeamName"
              type="text"
              value={firstTeamName}
              onChange={(e) => setFirstTeamName(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              placeholder="مثال: الأبطال"
            />
          </div>
          <div>
            <label htmlFor="secondTeamName" className="block text-lg font-medium text-gray-300 mb-2">
              اسم الفريق الثاني
            </label>
            <input
              id="secondTeamName"
              type="text"
              value={secondTeamName}
              onChange={(e) => setSecondTeamName(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              placeholder="مثال: الفرسان"
            />
          </div>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading || !isAdmin}
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-4 rounded-md transition-transform transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            {isAdmin ? (loading ? '...جاري التحضير' : 'ابدأ اللعبة') : 'الرجاء تسجيل الدخول كمسؤول'}
          </button>
        </form>
      </div>
    </div>
  );
}
