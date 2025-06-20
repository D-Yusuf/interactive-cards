'use client';

import { useState } from 'react';

interface LoginModalProps {
  onClose: () => void;
  onLoginSuccess: () => void;
}

export default function LoginModal({ onClose, onLoginSuccess }: LoginModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === '0000') {
      localStorage.setItem('axdxmxixn', 'true');
      onLoginSuccess();
      onClose();
    } else {
      setError('اسم المستخدم أو كلمة المرور غير صحيحة');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-2xl p-8 max-w-sm w-full relative">
        <button onClick={onClose} className="absolute top-4 left-4 text-gray-400 hover:text-white text-2xl">&times;</button>
        <h2 className="text-2xl font-bold text-center mb-6 text-cyan-400">تسجيل الدخول</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-lg font-medium text-gray-300 mb-2">
              اسم المستخدم
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-lg font-medium text-gray-300 mb-2">
              كلمة المرور
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            />
          </div>
          {error && <p className="text-red-500 text-center text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-md transition-transform transform hover:scale-105"
          >
            دخول
          </button>
        </form>
      </div>
    </div>
  );
} 