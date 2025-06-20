export interface Question {
  _id: string;
  category: string | Category;
  question: string;
  answer: string;
  points: number;
  isAnswered: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
  color: 'red' | 'blue' | 'green' | 'orange' | 'yellow' | 'purple' | 'pink' | 'gray';
  questions: Question[];
  createdAt: string;
  updatedAt: string;
}

export interface Game {
  _id: string;
  name: string;
  firstTeamName: string;
  secondTeamName: string;
  questions: string[];
  firstTeamScore: number;
  secondTeamScore: number;
  currentQuestion: number;
  status: 'ongoing' | 'completed';
  winner?: string | null;
  createdAt: string;
  updatedAt: string;
}

// API request/response types
export interface CreateGameRequest {
  name: string;
  firstTeamName: string;
  secondTeamName: string;
}

export interface UpdateGameRequest {
  firstTeamScore?: number;
  secondTeamScore?: number;
  status?: 'ongoing' | 'completed';
  winner?: string | null;
}

export interface CreateQuestionRequest {
  category: string;
  question: string;
  answer: string;
  points: number;
}

export interface UpdateQuestionRequest {
  category?: string;
  question?: string;
  answer?: string;
  points?: number;
  isAnswered?: boolean;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
} 