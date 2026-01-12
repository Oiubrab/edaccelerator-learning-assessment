export interface Passage {
  id: string;
  title: string;
  content: string;
}

export interface Question {
  id: string;
  question: string;
  correctAnswer: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'short-answer' | 'fill-blank';
  relevantPassageExcerpt?: string;
}

export interface UserAnswer {
  questionId: string;
  userAnswer: string;
  isCorrect: boolean;
  timestamp: number;
}

export interface QuizState {
  currentQuestionIndex: number;
  answers: UserAnswer[];
  isComplete: boolean;
  score: number;
}
