import axios from 'axios';
import { Category, Question, Team } from '@/types/game';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const gameService = {
  // Categories
  getCategories: () => api.get<Category[]>('/categories'),
  createCategory: (category: Omit<Category, 'id'>) => api.post<Category>('/categories', category),
  
  // Questions
  getQuestions: (categoryId: number) => api.get<Question[]>(`/categories/${categoryId}/questions`),
  createQuestion: (categoryId: number, question: Omit<Question, 'id'>) => 
    api.post<Question>(`/categories/${categoryId}/questions`, question),
  updateQuestion: (categoryId: number, questionId: number, question: Partial<Question>) =>
    api.patch<Question>(`/categories/${categoryId}/questions/${questionId}`, question),
  
  // Teams
  getTeams: () => api.get<Team[]>('/teams'),
  updateTeamScore: (teamId: number, score: number) =>
    api.patch<Team>(`/teams/${teamId}`, { score }),
}; 