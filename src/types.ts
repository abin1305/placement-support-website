export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: UserRole;
  college?: string;
  university?: string;
  degree?: string;
  branch?: string;
  graduationYear?: number;
  currentYear?: string;
  skills: string[];
  preferredRoles: string[];
  preferredCompanies: string[];
  resumeUrl?: string;
  profilePhoto?: string;
  profileCompletion: number; // e.g. 85
  streakDays: number;
  readinessScore: number; // 0 - 100
  createdAt: string;
}

export interface Company {
  id: string;
  name: string;
  logo: string;
  industry: string;
  jobRoles: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  placementPattern: {
    rounds: string[];
    aptitudeTopics: string[];
    technicalTopics: string[];
    codingTopics: string[];
    interviewFormat: string;
  };
  description: string;
  testCount: number;
  applicantCount: number;
}

export type QuestionType =
  | 'mcq'
  | 'multiple_correct'
  | 'true_false'
  | 'fill_blank'
  | 'code_output'
  | 'scenario';

export interface Question {
  id: string;
  type: QuestionType;
  category: 'Aptitude' | 'Technical' | 'General' | 'Coding' | 'Company-Specific';
  topic: string;
  companyId?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  question: string;
  codeSnippet?: string;
  options?: string[];
  correctAnswer: string | string[]; // string or array for multiple correct
  explanation: string;
  status: 'pending' | 'approved' | 'rejected';
  timeEstimateSeconds: number;
  createdAt: string;
}

export interface TestConfig {
  id: string;
  title: string;
  description: string;
  category: 'Aptitude' | 'Technical' | 'General' | 'Company-Specific' | 'Coding';
  companyId?: string;
  companyName?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  durationMinutes: number;
  passPercentage: number;
  negativeMarking: boolean;
  topics: string[];
  questionCount: number;
  questionIds: string[];
}

export interface TestAnswer {
  questionId: string;
  studentAnswer: string | string[];
  isCorrect: boolean;
  timeSpentSeconds: number;
  markedForReview?: boolean;
}

export interface TestAttempt {
  id: string;
  userId: string;
  testId: string;
  testTitle: string;
  companyName?: string;
  category: string;
  score: number;
  totalMarks: number;
  accuracy: number;
  correctCount: number;
  incorrectCount: number;
  skippedCount: number;
  timeSpentSeconds: number;
  completedAt: string;
  answers: TestAnswer[];
  aiAnalysis?: {
    strengths: string[];
    weaknesses: string[];
    improvements: string[];
    recommendation: string;
    topicScores: { topic: string; accuracy: number; status: 'Strong' | 'Good' | 'Needs Improvement' }[];
  };
}

export interface InterviewQuestion {
  id: string;
  question: string;
  category: 'Technical' | 'Behavioral' | 'Company-Specific' | 'HR';
  suggestedPoints?: string[];
}

export interface InterviewTurn {
  question: string;
  userAnswer: string;
  feedback?: {
    score: number;
    technicalScore: number;
    communicationScore: number;
    clarityScore: number;
    strengths: string;
    improvement: string;
    sampleAnswer: string;
  };
}

export interface InterviewSession {
  id: string;
  userId: string;
  companyName: string;
  jobRole: string;
  interviewType: 'HR' | 'Technical' | 'Company';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  turns: InterviewTurn[];
  overallScore?: number;
  technicalKnowledgeScore?: number;
  communicationScore?: number;
  confidenceScore?: number;
  clarityScore?: number;
  problemSolvingScore?: number;
  summaryFeedback?: {
    whatWentWell: string[];
    needsImprovement: string[];
    suggestedApproach: string;
    communicationTips: string[];
  };
  completedAt?: string;
  status: 'in_progress' | 'completed';
}

export interface DailyChallenge {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  questionIds: string[];
  participantsCount: number;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'test';
  read: boolean;
  createdAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  fullName: string;
  college: string;
  testsCompleted: number;
  averageScore: number;
  streakDays: number;
  readinessScore: number;
  isCurrentUser?: boolean;
}
