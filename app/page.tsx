'use client';

import React, { useState, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createGame, resetAllQuestions, clearGameCache } from './services/api';
import LoginModal from './components/LoginModal';
import HamburgerMenu from './components/HamburgerMenu';
import Link from 'next/link';

// Key icon component
const KeyIcon = () => (
  <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L12 17H9v-3l-1.257-1.257A6 6 0 1119 9z" />
  </svg>
);

// Modern admin button component
const AdminButton = ({ href, children, onClick, className = "" }: { href?: string, children: React.ReactNode, onClick?: () => void, className?: string }) => {
  const baseClasses = "glass-dark text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg backdrop-blur-sm";
  
  if (href) {
    return (
      <Link href={href} className={`${baseClasses} ${className} inline-block`}>
        {children}
      </Link>
    );
  }
  
  return (
    <button onClick={onClick} className={`${baseClasses} ${className}`}>
      {children}
    </button>
  );
};

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
    
    // Clear game cache when entering the website
    clearGameCache();
  }, []);

  const handleStartGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      setError('يجب أن تكون مسجلاً كمسؤول لبدء اللعبة');
      return;
    }
    if (!firstTeamName || !secondTeamName || !gameName) {
      setError('يرجى إدخال اسم اللعبة وأسماء الفريقين');
      return;
    }

    // INSTANT user feedback - show loading immediately
    setLoading(true);
    setError(''); // Clear any previous errors

    const gameData = {
      name: gameName,
      firstTeamName,
      secondTeamName,
    };

    // Create game and navigate instantly on success
    createGame(gameData)
      .then(response => {
        const gameId = response.data._id;
        // INSTANT navigation - don't keep user waiting
        router.push(`/game/${gameId}`);
      })
      .catch((err: any) => {
        // Only stop loading on error
        setLoading(false);
        if (err.message === 'Admin privileges required') {
          setError('يجب أن تكون مسجلاً كمسؤول لبدء اللعبة');
        } else {
          setError('حدث خطأ أثناء بدء اللعبة. يرجى المحاولة مرة أخرى.');
        }
      });
  };

  const handleResetAllQuestions = async () => {
    if (!isAdmin) return;
    
    if (confirm('هل أنت متأكد من إعادة تعيين جميع الأسئلة؟')) {
      try {
        await resetAllQuestions();
        alert('تم إعادة تعيين جميع الأسئلة بنجاح');
      } catch (err: any) {
        if (err.message === 'Admin privileges required') {
          alert('يجب أن تكون مسجلاً كمسؤول لإعادة تعيين الأسئلة');
        } else {
          alert('فشل في إعادة تعيين الأسئلة');
        }
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('axdxmxixn');
    setIsAdmin(false);
  };

  return (
    <div className="min-h-screen gradient-bg-dark text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main content with admin controls */}
      <div className="relative z-10 flex flex-col min-h-screen p-4">
        {/* Admin controls */}
        <div className="flex justify-between items-start mb-8 mt-4 md:justify-center">
          {/* Hamburger menu for small screens - positioned top right */}
          <div className="md:hidden">
            <HamburgerMenu
              isAdmin={isAdmin}
              onResetAllQuestions={handleResetAllQuestions}
              onLoginClick={() => setLoginModalOpen(true)}
              onLogout={handleLogout}
            />
          </div>
          
          {/* Desktop admin buttons - positioned center */}
          <div className="hidden md:flex flex-wrap justify-center gap-3">
            {isAdmin && (
              <>
                <AdminButton href="/manage-questions" className="bg-blue-600/20 hover:bg-blue-600/30 text-sm py-2 px-4">
                  إدارة الأسئلة
                </AdminButton>
                <AdminButton href="/previous-games" className="bg-purple-600/20 hover:bg-purple-600/30 text-sm py-2 px-4">
                  الألعاب السابقة
                </AdminButton>
                <AdminButton href="/unfinished-games" className="bg-orange-600/20 hover:bg-orange-600/30 text-sm py-2 px-4">
                  الألعاب غير المكتملة
                </AdminButton>
                <AdminButton onClick={handleResetAllQuestions} className="bg-red-600/20 hover:bg-red-600/30 text-sm py-2 px-4">
                  إعادة تعيين الأسئلة
                </AdminButton>
                <div className="flex items-center">
                  <KeyIcon />
                </div>
              </>
            )}
            {!isAdmin ? (
              <AdminButton onClick={() => setLoginModalOpen(true)} className="bg-gray-700/20 hover:bg-gray-700/30 text-sm py-2 px-4">
                تسجيل الدخول
              </AdminButton>
            ) : (
              <AdminButton onClick={handleLogout} className="bg-gray-700/20 hover:bg-gray-700/30 text-sm py-2 px-4">
                تسجيل الخروج
              </AdminButton>
            )}
          </div>
          
          {/* Empty div for spacing on mobile */}
          <div className="md:hidden w-12"></div>
        </div>

        {isLoginModalOpen && (
          <LoginModal
            onClose={() => setLoginModalOpen(false)}
            onLoginSuccess={() => setIsAdmin(true)}
          />
        )}

        {/* Game content */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-lg">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                الكروت التفاعلية
              </h1>
              <p className="text-xl text-gray-300 font-light">
                تحدي معرفي ممتع للفرق
              </p>
            </div>

            {/* Game form */}
            <div className="glass-dark rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
              <form onSubmit={handleStartGame} className="space-y-6">
                <div>
                  <label htmlFor="gameName" className="block text-lg font-medium text-gray-200 mb-3">
                    اسم اللعبة
                  </label>
                  <input
                    id="gameName"
                    type="text"
                    value={gameName}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setGameName(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl py-4 px-6 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:outline-none backdrop-blur-sm transition-all duration-300"
                  />
                </div>
                
                <div>
                  <label htmlFor="firstTeamName" className="block text-lg font-medium text-gray-200 mb-3">
                    اسم الفريق الأول
                  </label>
                  <input
                    id="firstTeamName"
                    type="text"
                    value={firstTeamName}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setFirstTeamName(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl py-4 px-6 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:outline-none backdrop-blur-sm transition-all duration-300"
                  />
                </div>
                
                <div>
                  <label htmlFor="secondTeamName" className="block text-lg font-medium text-gray-200 mb-3">
                    اسم الفريق الثاني
                  </label>
                  <input
                    id="secondTeamName"
                    type="text"
                    value={secondTeamName}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setSecondTeamName(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl py-4 px-6 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:outline-none backdrop-blur-sm transition-all duration-300"
                  />
                </div>
                
                {error && (
                  <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 text-red-300 text-center">
                    {error}
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={loading || !isAdmin}
                  className="w-full btn-modern text-white font-bold py-4 px-6 rounded-xl text-lg transition-all duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isAdmin ? (loading ? '...جاري التحضير' : 'ابدأ اللعبة') : 'الرجاء تسجيل الدخول كمسؤول'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
