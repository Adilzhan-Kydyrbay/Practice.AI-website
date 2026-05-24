export type ExamType = 'AP' | 'IELTS' | 'SAT' | 'IB' | 'UNT';

export type LanguageCode = 'kk' | 'uz' | 'ky' | 'en';

export interface AnswerChoice {
  text: string;
}

export interface Question {
  id: string;
  exam: ExamType;
  subject: string;
  year: string;
  difficulty: 'Easy' | 'Intermediate' | 'Advanced';
  topic: string;
  text: string;
  options: string[];
  correctIndex: number;
  passage?: string; // Sourced for SAT / IELTS / AP reading passages
}

export interface MistakeExplanation {
  correctAnswer: string;
  whyWrong: string;
  conceptExplained: string;
  workedExample: string;
  tip: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  suggestedPractice?: Question; // Gemini generated custom practice question
}

export interface TopicProgress {
  topic: string;
  answeredCount: number;
  correctCount: number;
}

export interface ExamHistoryItem {
  timestamp: string;
  exam: ExamType;
  subject: string;
  score: number; // e.g. correct count
  total: number;
}

export interface UserStats {
  solvedCount: number;
  correctCount: number;
  timeSpentMinutes: number;
  streakDays: number;
  weakTopics: string[];
  recommendations: string[];
}
