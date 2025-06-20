'use client';

import { useCache } from '../hooks/useCache';
import { refreshCategories } from '../services/api';

// Refresh icon
const RefreshIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

// Cache icon
const CacheIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
  </svg>
);

interface CacheStatusProps {
  className?: string;
}

export default function CacheStatus({ className = '' }: CacheStatusProps) {
  const { isCacheValid } = useCache();

  const handleRefresh = async () => {
    try {
      await refreshCategories();
      // The cache will be updated automatically by the API service
    } catch (error) {
      console.error('Failed to refresh cache:', error);
    }
  };

  return (
    <div className={`flex items-center gap-2 text-sm ${className}`}>
      <div className="flex items-center gap-1">
        <CacheIcon />
        <span className={isCacheValid() ? 'text-green-400' : 'text-gray-400'}>
          {isCacheValid() ? 'مخزن مؤقت' : 'لا يوجد مخزن مؤقت'}
        </span>
      </div>
      <button
        onClick={handleRefresh}
        className="text-blue-400 hover:text-blue-300 transition-colors"
        title="تحديث البيانات"
      >
        <RefreshIcon />
      </button>
    </div>
  );
} 