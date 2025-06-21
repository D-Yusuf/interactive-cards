import { Category, Question, Game } from '../types';

const CACHE_KEYS = {
  CATEGORIES: 'quiz_categories_cache',
  LAST_UPDATE: 'quiz_cache_last_update',
  CACHE_VERSION: 'quiz_cache_version'
};

const CACHE_VERSION = '1.0.0';

export interface CacheData {
  categories: Category[];
  categoriesTimestamp: number;
  game: Game | null;
  gameTimestamp: number;
  lastUpdate: number;
  version: string;
}

class CacheService {
  private isInitialized = false;
  private cache: CacheData = {
    categories: [],
    categoriesTimestamp: 0,
    game: null,
    gameTimestamp: 0,
    lastUpdate: 0,
    version: CACHE_VERSION
  };

  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  // Initialize cache
  init() {
    if (this.isInitialized) return;
    
    // Check if cache version is outdated
    const storedVersion = localStorage.getItem(CACHE_KEYS.CACHE_VERSION);
    if (storedVersion !== CACHE_VERSION) {
      this.clearCache();
      localStorage.setItem(CACHE_KEYS.CACHE_VERSION, CACHE_VERSION);
    }
    
    // Clear game cache on initialization as requested
    this.clearGame();
    
    this.isInitialized = true;
  }

  // Get cached categories
  getCategories(): Category[] | null {
    this.init();
    
    const cached = localStorage.getItem('categoriesCache');
    if (!cached) return null;

    try {
      const { data, timestamp } = JSON.parse(cached);
      const isExpired = Date.now() - timestamp > this.CACHE_DURATION;
      
      if (isExpired) {
        localStorage.removeItem('categoriesCache');
        return null;
      }

      this.cache.categories = data;
      this.cache.categoriesTimestamp = timestamp;
      return data;
    } catch {
      localStorage.removeItem('categoriesCache');
      return null;
    }
  }

  // Set categories in cache
  setCategories(categories: Category[]) {
    this.cache.categories = categories;
    this.cache.categoriesTimestamp = Date.now();
    localStorage.setItem('categoriesCache', JSON.stringify({
      data: categories,
      timestamp: this.cache.categoriesTimestamp
    }));
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
    localStorage.removeItem('categoriesCache');
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

  // Game cache methods
  setGame(game: Game) {
    this.cache.game = game;
    this.cache.gameTimestamp = Date.now();
    localStorage.setItem('gameCache', JSON.stringify({
      data: game,
      timestamp: this.cache.gameTimestamp
    }));
  }

  getGame(): Game | null {
    const cached = localStorage.getItem('gameCache');
    if (!cached) return null;

    try {
      const { data, timestamp } = JSON.parse(cached);
      const isExpired = Date.now() - timestamp > this.CACHE_DURATION;
      
      if (isExpired) {
        localStorage.removeItem('gameCache');
        return null;
      }

      this.cache.game = data;
      this.cache.gameTimestamp = timestamp;
      return data;
    } catch {
      localStorage.removeItem('gameCache');
      return null;
    }
  }

  updateGame(updates: Partial<Game>) {
    if (this.cache.game) {
      this.cache.game = { ...this.cache.game, ...updates };
      this.setGame(this.cache.game);
    }
  }

  clearGame() {
    this.cache.game = null;
    this.cache.gameTimestamp = 0;
    localStorage.removeItem('gameCache');
  }

  clearAll() {
    this.cache = {
      categories: [],
      categoriesTimestamp: 0,
      game: null,
      gameTimestamp: 0,
      lastUpdate: 0,
      version: CACHE_VERSION
    };
    localStorage.removeItem('categoriesCache');
    localStorage.removeItem('gameCache');
  }

  // Clear game cache specifically
  clearGameCache() {
    this.cache.game = null;
    this.cache.gameTimestamp = 0;
    localStorage.removeItem('gameCache');
  }
}

export const cacheService = new CacheService(); 