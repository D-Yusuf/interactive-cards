import { Category, Question } from '../types';

const CACHE_KEYS = {
  CATEGORIES: 'quiz_categories_cache',
  LAST_UPDATE: 'quiz_cache_last_update',
  CACHE_VERSION: 'quiz_cache_version'
};

const CACHE_VERSION = '1.0.0';

export interface CacheData {
  categories: Category[];
  lastUpdate: number;
  version: string;
}

class CacheService {
  private isInitialized = false;

  // Initialize cache
  init() {
    if (this.isInitialized) return;
    
    // Check if cache version is outdated
    const storedVersion = localStorage.getItem(CACHE_KEYS.CACHE_VERSION);
    if (storedVersion !== CACHE_VERSION) {
      this.clearCache();
      localStorage.setItem(CACHE_KEYS.CACHE_VERSION, CACHE_VERSION);
    }
    
    this.isInitialized = true;
  }

  // Get cached categories
  getCategories(): Category[] | null {
    this.init();
    
    try {
      const cached = localStorage.getItem(CACHE_KEYS.CATEGORIES);
      const lastUpdate = localStorage.getItem(CACHE_KEYS.LAST_UPDATE);
      
      if (!cached || !lastUpdate) return null;
      
      const data: CacheData = JSON.parse(cached);
      
      // Always return cached data if it exists (no duration check)
      return data.categories;
    } catch (error) {
      console.error('Error reading cache:', error);
      this.clearCache();
      return null;
    }
  }

  // Set categories in cache
  setCategories(categories: Category[]) {
    this.init();
    
    try {
      const cacheData: CacheData = {
        categories,
        lastUpdate: Date.now(),
        version: CACHE_VERSION
      };
      
      localStorage.setItem(CACHE_KEYS.CATEGORIES, JSON.stringify(cacheData));
      localStorage.setItem(CACHE_KEYS.LAST_UPDATE, cacheData.lastUpdate.toString());
    } catch (error) {
      console.error('Error writing cache:', error);
    }
  }

  // Update a single question in cache
  updateQuestion(questionId: string, updatedQuestion: Question) {
    const categories = this.getCategories();
    if (!categories) return;

    const updatedCategories = categories.map(category => ({
      ...category,
      questions: category.questions.map(q => 
        q._id === questionId ? updatedQuestion : q
      )
    }));

    this.setCategories(updatedCategories);
  }

  // Add a new question to cache
  addQuestion(question: Question, categoryId: string) {
    const categories = this.getCategories();
    if (!categories) return;

    const updatedCategories = categories.map(category => 
      category._id === categoryId 
        ? { ...category, questions: [...category.questions, question] }
        : category
    );

    this.setCategories(updatedCategories);
  }

  // Remove a question from cache
  removeQuestion(questionId: string) {
    const categories = this.getCategories();
    if (!categories) return;

    const updatedCategories = categories.map(category => ({
      ...category,
      questions: category.questions.filter(q => q._id !== questionId)
    }));

    this.setCategories(updatedCategories);
  }

  // Move a question between categories in cache
  moveQuestion(questionId: string, fromCategoryId: string, toCategoryId: string) {
    const categories = this.getCategories();
    if (!categories) return;

    const question = categories
      .find(c => c._id === fromCategoryId)
      ?.questions.find(q => q._id === questionId);

    if (!question) return;

    const updatedCategories = categories.map(category => {
      if (category._id === fromCategoryId) {
        return {
          ...category,
          questions: category.questions.filter(q => q._id !== questionId)
        };
      }
      if (category._id === toCategoryId) {
        return {
          ...category,
          questions: [...category.questions, question]
        };
      }
      return category;
    });

    this.setCategories(updatedCategories);
  }

  // Clear all cache
  clearCache() {
    localStorage.removeItem(CACHE_KEYS.CATEGORIES);
    localStorage.removeItem(CACHE_KEYS.LAST_UPDATE);
  }

  // Check if cache exists (not if it's valid by duration)
  isCacheValid(): boolean {
    const lastUpdate = localStorage.getItem(CACHE_KEYS.LAST_UPDATE);
    return !!lastUpdate;
  }

  // Force refresh cache
  invalidateCache() {
    this.clearCache();
  }
}

export const cacheService = new CacheService(); 