import axios from 'axios';
import { 
  Game, 
  Category, 
  Question, 
  CreateGameRequest, 
  UpdateGameRequest, 
  CreateQuestionRequest, 
  UpdateQuestionRequest,
  ApiResponse 
} from '../types';
import { cacheService } from './cache';

const API_URL = 'https://qiyam.deno.dev';

const api = axios.create({
  baseURL: API_URL,
});

// Admin check utility
const checkAdminStatus = (): boolean => {
  return localStorage.getItem('axdxmxixn') === 'true';
};

const requireAdmin = (): void => {
  if (!checkAdminStatus()) {
    throw new Error('Admin privileges required');
  }
};

// Game API calls
export const createGame = (data: CreateGameRequest): Promise<ApiResponse<Game>> => {
  requireAdmin();
  return api.post('/games', data);
};

export const getGame = async (id: string): Promise<ApiResponse<Game>> => {
  // Try to get cached game first
  const cachedGame = cacheService.getGame();
  if (cachedGame && cachedGame._id === id) {
    return { data: cachedGame, status: 200 };
  }
  
  // Fetch from API if not cached
  const response = await api.get(`/games/${id}`);
  const game = response.data;
  
  // Cache the game
  cacheService.setGame(game);
  
  return { data: game, status: response.status };
};

export const getGames = (): Promise<ApiResponse<Game[]>> => {
  requireAdmin();
  return api.get('/games');
};

export const updateGame = async (id: string, data: UpdateGameRequest): Promise<ApiResponse<Game>> => {
  requireAdmin();
  const response = await api.put(`/games/${id}`, data);
  const updatedGame = response.data;
  
  // Don't update cached game during normal operations
  // Only update when game ends
  
  return { data: updatedGame, status: response.status };
};

export const endGame = async (id: string): Promise<ApiResponse<Game>> => {
  requireAdmin();
  const response = await api.post(`/games/${id}/end`);
  const endedGame = response.data;
  
  // Update cached game only when game ends
  cacheService.updateGame(endedGame);
  
  return { data: endedGame, status: response.status };
};

export const deleteGame = async (id: string): Promise<ApiResponse<{ message: string; freedQuestions: number }>> => {
  requireAdmin();
  const response = await api.delete(`/games/${id}`);
  
  // Clear game cache when game is deleted
  cacheService.clearGame();
  
  return { data: response.data, status: response.status };
};

// Category API calls with caching
export const getCategories = async (): Promise<ApiResponse<Category[]>> => {
  // Always fetch from API to get latest data
  const response = await api.get('/categories');
  const categories = response.data;
  
  // Always update cache with fresh data
  cacheService.setCategories(categories);
  
  return { data: categories, status: response.status };
};

// Question API calls with cache updates
export const getQuestions = async (): Promise<ApiResponse<Question[]>> => {
  requireAdmin();
  const response = await api.get('/questions');
  const questions = response.data;
  
  // Update cache with fresh questions data
  // Note: This would need to be integrated with categories cache
  // For now, we'll just update the categories cache if it exists
  const cachedCategories = cacheService.getCategories();
  if (cachedCategories) {
    // Update questions in each category
    const updatedCategories = cachedCategories.map(category => ({
      ...category,
      questions: questions.filter((q: Question) => 
        typeof q.category === 'string' 
          ? q.category === category._id 
          : q.category._id === category._id
      )
    }));
    cacheService.setCategories(updatedCategories);
  }
  
  return { data: questions, status: response.status };
};

export const createQuestion = async (data: CreateQuestionRequest): Promise<ApiResponse<Question>> => {
  requireAdmin();
  const response = await api.post('/questions', data);
  const question = response.data;
  
  // Update cache with new question
  cacheService.addQuestion(question, data.category);
  
  return { data: question, status: response.status };
};

export const deleteQuestion = async (id: string): Promise<ApiResponse<void>> => {
  requireAdmin();
  const response = await api.delete(`/questions/${id}`);
  
  // Update cache by removing the question
  cacheService.removeQuestion(id);
  
  return { data: undefined, status: response.status };
};

export const updateQuestion = async (id: string, data: UpdateQuestionRequest): Promise<ApiResponse<Question>> => {
  requireAdmin();
  const response = await api.put(`/questions/${id}`, data);
  const updatedQuestion = response.data;
  
  // Update cache with updated question
  cacheService.updateQuestion(id, updatedQuestion);
  
  // If category changed, move question in cache
  if (data.category) {
    // We need to get the old category ID first
    const cachedCategories = cacheService.getCategories();
    if (cachedCategories) {
      const oldCategory = cachedCategories.find(cat => 
        cat.questions.some(q => q._id === id)
      );
      if (oldCategory) {
        cacheService.moveQuestion(id, oldCategory._id, data.category);
      }
    }
  }
  
  return { data: updatedQuestion, status: response.status };
};

export const markQuestionAsAnswered = async (id: string): Promise<ApiResponse<Question>> => {
  requireAdmin();
  const response = await api.put(`/questions/${id}`, { isAnswered: true });
  const updatedQuestion = response.data;
  
  // Update cache with answered question
  cacheService.updateQuestion(id, updatedQuestion);
  
  return { data: updatedQuestion, status: response.status };
};

export const trackAnsweredQuestion = (questionId: string, gameId: string, teamName: string, points: number): Promise<ApiResponse<void>> => {
  requireAdmin();
  return api.post(`/questions/${questionId}/answer`, { gameId, teamName, points });
};

export const resetQuestionsForGame = (gameId: string): Promise<ApiResponse<{ message: string; modifiedCount: number }>> => {
  requireAdmin();
  return api.post(`/questions/reset-game/${gameId}`);
};

export const resetAllQuestions = (): Promise<ApiResponse<{ message: string; modifiedCount: number }>> => {
  requireAdmin();
  return api.post(`/questions/reset-all`);
};

// Cache management
export const refreshCategories = async (): Promise<ApiResponse<Category[]>> => {
  // Force refresh by fetching from API and updating cache
  return getCategories();
};

export const getCachedCategories = (): Category[] | null => {
  return cacheService.getCategories();
};

export const clearGameCache = (): void => {
  cacheService.clearGameCache();
};

// Export admin check for use in components
export const isAdmin = (): boolean => {
  return checkAdminStatus();
};
