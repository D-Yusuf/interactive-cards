'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

// Hamburger menu icon
const HamburgerIcon = ({ isOpen }: { isOpen: boolean }) => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    {isOpen ? (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    ) : (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    )}
  </svg>
);

// Key icon component
const KeyIcon = () => (
  <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L12 17H9v-3l-1.257-1.257A6 6 0 1119 9z" />
  </svg>
);

// Modern admin button component
const AdminButton = ({ href, children, onClick, className = "" }: { href?: string, children: React.ReactNode, onClick?: () => void, className?: string }) => {
  const router = useRouter();
  const baseClasses = "glass-dark text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg backdrop-blur-sm";
  
  const handleClick = () => {
    if (href) {
      router.push(href);
    } else if (onClick) {
      onClick();
    }
  };
  
  return (
    <button onClick={handleClick} className={`${baseClasses} ${className}`}>
      {children}
    </button>
  );
};

interface HamburgerMenuProps {
  isAdmin: boolean;
  onResetAllQuestions: () => void;
  onLoginClick: () => void;
  onLogout: () => void;
}

export default function HamburgerMenu({ isAdmin, onResetAllQuestions, onLoginClick, onLogout }: HamburgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Hamburger button - visible on small screens */}
      <button
        onClick={toggleMenu}
        className="md:hidden glass-dark text-white p-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg backdrop-blur-sm"
        aria-label="Toggle menu"
      >
        <HamburgerIcon isOpen={isOpen} />
      </button>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeMenu}
          />
          
          {/* Menu content */}
          <div className="absolute top-0 right-0 h-full w-80 bg-gradient-to-b from-gray-900/95 to-gray-800/95 backdrop-blur-md border-l border-white/10 shadow-2xl transform transition-transform duration-300 ease-in-out">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-white">القائمة</h2>
                <button
                  onClick={closeMenu}
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  <HamburgerIcon isOpen={true} />
                </button>
              </div>

              {/* Menu items */}
              <div className="space-y-4">
                {isAdmin && (
                  <>
                    <AdminButton 
                      href="/manage-questions" 
                      className="w-full bg-blue-600/20 hover:bg-blue-600/30 text-sm py-3 px-4"
                      onClick={closeMenu}
                    >
                      إدارة الأسئلة
                    </AdminButton>
                    <AdminButton 
                      href="/previous-games" 
                      className="w-full bg-purple-600/20 hover:bg-purple-600/30 text-sm py-3 px-4"
                      onClick={closeMenu}
                    >
                      الألعاب السابقة
                    </AdminButton>
                    <AdminButton 
                      href="/unfinished-games" 
                      className="w-full bg-orange-600/20 hover:bg-orange-600/30 text-sm py-3 px-4"
                      onClick={closeMenu}
                    >
                      الألعاب غير المكتملة
                    </AdminButton>
                    <AdminButton 
                      onClick={() => {
                        onResetAllQuestions();
                        closeMenu();
                      }} 
                      className="w-full bg-red-600/20 hover:bg-red-600/30 text-sm py-3 px-4"
                    >
                      إعادة تعيين الأسئلة
                    </AdminButton>
                    <div className="flex items-center justify-center py-2">
                      <KeyIcon />
                    </div>
                  </>
                )}
                {!isAdmin ? (
                  <AdminButton 
                    onClick={() => {
                      onLoginClick();
                      closeMenu();
                    }} 
                    className="w-full bg-gray-700/20 hover:bg-gray-700/30 text-sm py-3 px-4"
                  >
                    تسجيل الدخول
                  </AdminButton>
                ) : (
                  <AdminButton 
                    onClick={() => {
                      onLogout();
                      closeMenu();
                    }} 
                    className="w-full bg-gray-700/20 hover:bg-gray-700/30 text-sm py-3 px-4"
                  >
                    تسجيل الخروج
                  </AdminButton>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 