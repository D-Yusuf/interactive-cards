export interface Question {
  id: number;
  points: number;
  question: string;
  answer: string;
  isAnswered: boolean;
}

export interface Category {
  id: number;
  name: string;
  questions: Question[];
}

export interface Team {
  id: number;
  name: string;
  score: number;
} 