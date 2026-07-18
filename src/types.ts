export interface Chapter {
  title: string;
  content: string;
  completed: boolean;
  bulletPoints?: string[];
  coverImage?: string;
  chatHistory?: { role: 'user' | 'ai', content: string }[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface Roadmap {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  chapters: Chapter[];
  quiz: QuizQuestion[];
  currentChapterIndex: number;
  quizScore?: number;
  completedQuiz?: boolean;
  expEarned: number;
  userName: string;
  userAge: string;
  createdAt: string;
  lastAccessed: string;
}

export interface Certificate {
  id: string;
  userName: string;
  userAge: string;
  roadmapId: string;
  roadmapTitle: string;
  quizScore: number;
  totalQuestions: number;
  dateEarned: string;
  expEarned: number;
}

export interface UserProfile {
  name: string;
  age: string;
}
