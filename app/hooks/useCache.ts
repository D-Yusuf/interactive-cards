import { useState, useEffect } from 'react';
import { Category } from '../types';
import { cacheService } from '../services/cache';

export const useCache = () => {
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize cache on mount
  useEffect(() => {
    const cachedCategories = cacheService.getCategories();
    if (cachedCategories) {
      setCategories(cachedCategories);
    }
  }, []);

  const refreshCache = async () => {
    setIsLoading(true);
    try {
      cacheService.invalidateCache();
      setCategories(null);
    } finally {
      setIsLoading(false);
    }
  };

  const updateCategories = (newCategories: Category[]) => {
    setCategories(newCategories);
    cacheService.setCategories(newCategories);
  };

  const getCachedCategories = () => {
    return cacheService.getCategories();
  };

  const isCacheValid = () => {
    return cacheService.isCacheValid();
  };

  return {
    categories,
    isLoading,
    refreshCache,
    updateCategories,
    getCachedCategories,
    isCacheValid
  };
}; 