'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

// Back arrow icon (pointing left)
const BackArrowIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

interface BackButtonProps {
  href?: string;
  className?: string;
}

export default function BackButton({ href, className = "" }: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`glass-dark text-white p-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg backdrop-blur-sm back-button-hover ${className}`}
      aria-label="Go back"
    >
      <BackArrowIcon />
    </button>
  );
} 