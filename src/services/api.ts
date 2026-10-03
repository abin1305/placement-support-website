import { Company, Question, TestConfig, TestAttempt, InterviewSession, User } from '../types';
import { db } from '../server/db';

const defaultStudent = db.users.find((user) => user.role === 'student') || db.users[0];
const defaultAdmin = db.users.find((user) => user.role === 'admin') || db.users[db.users.length - 1];

async function safeJsonRequest<T>(fallback: T, input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  try {
    const res = await fetch(input, init);
    if (!res.ok) return fallback;
    const data = await res.json();
    return data ?? fallback;
  } catch {
    return fallback;
  }
}

export async function loginApi(email: string, role: string) {
  const normalizedRole = role === 'admin' ? 'admin' : 'student';
  const fallbackUser = normalizedRole === 'admin' ? defaultAdmin : defaultStudent;
  const user = db.getUserByEmail(email) || fallbackUser;

  return {
    user,
    token: `mock-token-${user.id}`,
    success: true,
  };
}

export async function registerApi(data: Partial<User>) {
  const newUser: User = {
    id: `usr_${Date.now()}`,
    fullName: data.fullName || 'New Student',
    email: data.email || 'newstudent@example.com',
    phone: data.phone || '+1 000 000 0000',
    role: data.role || 'student',
    college: data.college || 'Demo College',
    university: data.university || 'Demo University',
    degree: data.degree || 'B.Tech',
    branch: data.branch || 'Computer Science',
    graduationYear: data.graduationYear || new Date().getFullYear() + 2,
    currentYear: data.currentYear || 'Final Year',
    skills: data.skills || ['Problem Solving', 'JavaScript'],
    preferredRoles: data.preferredRoles || ['Software Engineer'],
    preferredCompanies: data.preferredCompanies || ['Microsoft'],
    profileCompletion: data.profileCompletion || 60,
    streakDays: data.streakDays || 1,
    readinessScore: data.readinessScore || 60,
    createdAt: new Date().toISOString(),
  };

  db.users.push(newUser);

  return { user: newUser, success: true };
}

export async function fetchCompaniesApi(): Promise<Company[]> {
  return safeJsonRequest<Company[]>(db.getCompanies(), '/api/companies');
}

export async function fetchCompanyByIdApi(id: string): Promise<Company> {
  const company = db.getCompanyById(id) || db.getCompanies()[0];
  return safeJsonRequest<Company>(company, `/api/companies/${id}`);
}

export async function fetchTestsApi(): Promise<TestConfig[]> {
  return safeJsonRequest<TestConfig[]>(db.getTestConfigs(), '/api/tests');
}

export async function fetchTestByIdApi(id: string): Promise<{ testConfig: TestConfig; questions: Question[] }> {
  const testConfig = db.getTestConfigById(id) || db.getTestConfigs()[0];
  const relevantQuestions = testConfig?.questionIds?.length
    ? db.getQuestions().filter((q) => testConfig.questionIds.includes(q.id))
    : db.getQuestions().slice(0, 5);

  return safeJsonRequest<{ testConfig: TestConfig; questions: Question[] }>(
    { testConfig, questions: relevantQuestions },
    `/api/tests/${id}`
  );
}

export async function submitTestApi(payload: {
  userId: string;
  testId: string;
  answers: { questionId: string; studentAnswer: any; timeSpentSeconds?: number }[];
  timeSpentSeconds: number;
}): Promise<{ success: boolean; attempt: TestAttempt }> {
  const testConfig = db.getTestConfigById(payload.testId) || db.getTestConfigs()[0];
  const questions = testConfig?.questionIds?.length
    ? db.getQuestions().filter((q) => testConfig.questionIds.includes(q.id))
    : db.getQuestions();

  let correctCount = 0;
  for (const answer of payload.answers) {
    const question = questions.find((q) => q.id === answer.questionId);
    if (question && String(question.correctAnswer).trim() === String(answer.studentAnswer).trim()) {
      correctCount += 1;
    }
  }

  const attempt: TestAttempt = {
    id: `att_${Date.now()}`,
    userId: payload.userId,
    testId: payload.testId,
    testTitle: testConfig?.title || 'Local Practice Test',
    companyName: testConfig?.companyName || 'General Practice',
    category: testConfig?.category || 'General',
    score: Math.round((correctCount / Math.max(questions.length, 1)) * 100),
    totalMarks: questions.length * 10,
    accuracy: Math.round((correctCount / Math.max(questions.length, 1)) * 100),
    correctCount,
    incorrectCount: Math.max(payload.answers.length - correctCount, 0),
    skippedCount: 0,
    timeSpentSeconds: payload.timeSpentSeconds,
    completedAt: new Date().toISOString(),
    answers: payload.answers.map((answer) => ({
      questionId: answer.questionId,
      studentAnswer: answer.studentAnswer,
      isCorrect:
        !!questions.find((q) => q.id === answer.questionId && String(q.correctAnswer).trim() === String(answer.studentAnswer).trim()),
      timeSpentSeconds: answer.timeSpentSeconds || 0,
    })),
  };

  db.addTestAttempt(attempt);
  return { success: true, attempt };
}

export async function fetchAttemptByIdApi(id: string): Promise<TestAttempt> {
  const attempt = db.getTestAttemptById(id) || db.getTestAttemptsForUser(defaultStudent.id)[0];
  return safeJsonRequest<TestAttempt>(attempt, `/api/attempts/${id}`);
}

export async function fetchUserAttemptsApi(userId: string): Promise<TestAttempt[]> {
  const attempts = db.getTestAttemptsForUser(userId);
  return safeJsonRequest<TestAttempt[]>(attempts.length ? attempts : db.getTestAttemptsForUser(defaultStudent.id), `/api/attempts/user/${userId}`);
}

export async function evaluateInterviewTurnApi(payload: {
  companyName: string;
  jobRole: string;
  interviewType: string;
  question: string;
  userAnswer: string;
}) {
  return safeJsonRequest(
    {
      score: 84,
      technicalScore: 88,
      communicationScore: 80,
      clarityScore: 82,
      strengths: 'You gave a clear, structured answer with strong reasoning behind the approach.',
      improvement: 'Add one concrete example from a real project to make the answer stronger.',
      sampleAnswer:
        'I would explain the problem, outline my approach step-by-step, and describe how I validated the solution with a quick test or example.',
      nextQuestion: 'Can you walk me through a project where you solved a difficult technical challenge?',
    },
    '/api/interviews/evaluate-turn',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }
  );
}

export async function finishInterviewApi(session: InterviewSession) {
  db.saveInterviewSession(session);
  return { success: true, session };
}

export async function fetchRoadmapApi(userId: string) {
  const user = db.getUserById(userId) || defaultStudent;
  return safeJsonRequest(
    {
      userId: user.id,
      roadmap: [
        { day: 1, focus: 'Quantitative Aptitude', description: 'Solve 10 arithmetic and data interpretation questions.', targetModules: ['Percentages', 'Profit & Loss'], estimatedHours: 2 },
        { day: 2, focus: 'Technical Core', description: 'Practice Java/DSA fundamentals and revisit DBMS concepts.', targetModules: ['Java', 'Data Structures'], estimatedHours: 2.5 },
        { day: 3, focus: 'Mock Interview', description: 'Answer one system design/technical question and improve clarity.', targetModules: ['OOPs', 'System Design'], estimatedHours: 1.5 },
      ],
    },
    `/api/roadmap/${userId}`
  );
}

export async function generateAiQuestionsApi(payload: {
  companyName?: string;
  category: string;
  topic: string;
  difficulty: string;
  count: number;
}) {
  const sampleQuestions = Array.from({ length: Math.max(1, payload.count) }, (_, index) => ({
    id: `demo_q_${Date.now()}_${index}`,
    type: 'mcq',
    category: payload.category,
    topic: payload.topic,
    difficulty: payload.difficulty,
    question: `Sample ${payload.topic} question ${index + 1}: Which option best explains the concept behind ${payload.topic}?`,
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
    correctAnswer: 'Option B',
    explanation: 'This is a demo question generated locally because the AI backend is not configured yet.',
    status: 'approved',
    timeEstimateSeconds: 45,
    createdAt: new Date().toISOString(),
  }));

  return { success: true, questions: sampleQuestions };
}

export async function fetchQuestionsApi(filter?: { status?: string; category?: string; companyId?: string }) {
  const query = { status: filter?.status, category: filter?.category, companyId: filter?.companyId };
  const questions = db.getQuestions(query);
  return safeJsonRequest(questions, `/api/questions?${new URLSearchParams(query as any).toString()}`);
}

export async function updateQuestionStatusApi(id: string, status: 'approved' | 'rejected') {
  const question = db.updateQuestion(id, { status });
  return { success: !!question, question };
}

export async function fetchAdminAnalyticsApi() {
  return {
    totalUsers: db.users.length,
    totalCompanies: db.getCompanies().length,
    totalQuestions: db.getQuestions().length,
    totalAttempts: db.testAttempts.length,
    averageReadiness: Math.round(db.users.reduce((sum, user) => sum + user.readinessScore, 0) / db.users.length),
  };
}

export async function fetchLeaderboardApi() {
  return safeJsonRequest(db.getLeaderboard(), '/api/leaderboard');
}

export async function updateProfileApi(userId: string, data: Partial<User>): Promise<User> {
  const updatedUser = db.updateUserProfile(userId, data);
  if (!updatedUser) {
    return defaultStudent;
  }
  return updatedUser;
}
