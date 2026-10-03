import {
  User,
  Company,
  Question,
  TestConfig,
  TestAttempt,
  InterviewSession,
  Notification,
  LeaderboardEntry,
} from '../types.js';

// In-Memory Database initialized with realistic seed data
export class Database {
  users: User[] = [];
  companies: Company[] = [];
  questions: Question[] = [];
  testConfigs: TestConfig[] = [];
  testAttempts: TestAttempt[] = [];
  interviewSessions: InterviewSession[] = [];
  notifications: Notification[] = [];

  constructor() {
    this.seed();
  }

  private seed() {
    // Seed Users
    this.users = [
      {
        id: 'usr_student_1',
        fullName: 'Alex Morgan',
        email: 'student@prepmatrix.com',
        phone: '+1 987 654 3210',
        role: 'student',
        college: 'National Institute of Technology',
        university: 'NIT Technical University',
        degree: 'B.Tech',
        branch: 'Computer Science & Engineering',
        graduationYear: 2026,
        currentYear: 'Final Year / Sem 7',
        skills: ['Java', 'Python', 'Data Structures', 'SQL', 'React', 'Problem Solving'],
        preferredRoles: ['Software Development Engineer', 'Full Stack Developer', 'Data Analyst'],
        preferredCompanies: ['Amazon', 'Google', 'TCS', 'Infosys'],
        profileCompletion: 85,
        streakDays: 6,
        readinessScore: 78,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'usr_admin_1',
        fullName: 'Placement Admin',
        email: 'admin@prepmatrix.com',
        role: 'admin',
        skills: ['System Management', 'Question Auditing'],
        preferredRoles: ['Platform Controller'],
        preferredCompanies: [],
        profileCompletion: 100,
        streakDays: 14,
        readinessScore: 99,
        createdAt: new Date().toISOString(),
      },
    ];

    // Seed Companies
    this.companies = [
      {
        id: 'cmp_tcs',
        name: 'TCS (Tata Consultancy Services)',
        logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=120&auto=format&fit=crop&q=80',
        industry: 'IT Services & Consulting',
        jobRoles: ['Systems Engineer', 'Digital Engineer', 'Innovator'],
        difficulty: 'Medium',
        description: 'TCS NQT placement evaluation focusing on Quantitative Aptitude, Verbal Ability, Reasoning, and Hands-on Coding.',
        testCount: 12,
        applicantCount: 45200,
        placementPattern: {
          rounds: ['Online Cognitive & Technical Test', 'Technical Interview', 'HR Interview'],
          aptitudeTopics: ['Percentages', 'Time & Work', 'Profit & Loss', 'Permutations', 'Data Interpretation'],
          technicalTopics: ['C / C++', 'Java', 'Data Structures', 'DBMS & SQL', 'Pseudocode'],
          codingTopics: ['Arrays', 'Strings', 'Number Logic'],
          interviewFormat: 'Live Technical + HR Combined Panel',
        },
      },
      {
        id: 'cmp_infosys',
        name: 'Infosys',
        logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=120&auto=format&fit=crop&q=80',
        industry: 'Information Technology',
        jobRoles: ['Systems Engineer', 'Specialist Programmer', 'Digital Specialist Engineer'],
        difficulty: 'Medium',
        description: 'Infosys placement test evaluating Mathematical Ability, Reasoning, Verbal, Pseudocode, and Puzzle Solving.',
        testCount: 10,
        applicantCount: 38900,
        placementPattern: {
          rounds: ['Online Assessment', 'Technical Assessment', 'HR Interview'],
          aptitudeTopics: ['Mathematical Ability', 'Logical Reasoning', 'Verbal Ability'],
          technicalTopics: ['Pseudocode', 'Data Structures', 'OOPs Concepts', 'Database Systems'],
          codingTopics: ['Algorithms', 'Array Manipulation', 'Dynamic Programming Basics'],
          interviewFormat: 'Behavioral & Core Technical Interview',
        },
      },
      {
        id: 'cmp_accenture',
        name: 'Accenture',
        logo: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=120&auto=format&fit=crop&q=80',
        industry: 'Management Consulting & IT',
        jobRoles: ['Associate Software Engineer', 'Advanced Application Engineering Analyst'],
        difficulty: 'Medium',
        description: 'Accenture assessment evaluating Cognitive, Technical, Coding, and Communication skills.',
        testCount: 8,
        applicantCount: 32400,
        placementPattern: {
          rounds: ['Cognitive & Technical Assessment', 'Coding Assessment', 'Communication Assessment', 'Interview'],
          aptitudeTopics: ['Critical Reasoning', 'Abstract Reasoning', 'English Ability'],
          technicalTopics: ['Common Applications', 'Pseudocode', 'Networking & Cloud Basics'],
          codingTopics: ['Basic Algorithms', 'Control Flow'],
          interviewFormat: 'Scenario-based HR & Technical Interview',
        },
      },
      {
        id: 'cmp_amazon',
        name: 'Amazon',
        logo: 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=120&auto=format&fit=crop&q=80',
        industry: 'E-commerce & Cloud Computing',
        jobRoles: ['Software Development Engineer I (SDE-1)', 'Frontend Engineer', 'Cloud Support Associate'],
        difficulty: 'Hard',
        description: 'Amazon SDE recruitment assessing Data Structures, Algorithms, System Design basics, and Amazon Leadership Principles.',
        testCount: 15,
        applicantCount: 58000,
        placementPattern: {
          rounds: ['Online Coding Test (OA)', 'Technical Interview 1', 'Technical Interview 2', 'Bar Raiser Interview'],
          aptitudeTopics: ['Logical Reasoning', 'Work Style Assessment'],
          technicalTopics: ['Trees & Graphs', 'Dynamic Programming', 'System Design Basics', 'OOP Design'],
          codingTopics: ['Two Pointers', 'Sliding Window', 'Graphs', 'Trees'],
          interviewFormat: 'Live Coding + Leadership Principles Behavioral Interview',
        },
      },
      {
        id: 'cmp_google',
        name: 'Google',
        logo: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=120&auto=format&fit=crop&q=80',
        industry: 'Technology & Internet',
        jobRoles: ['Software Engineer', 'University Graduate SDE', 'Site Reliability Engineer'],
        difficulty: 'Hard',
        description: 'Google Coding & Problem Solving assessment focusing on algorithmic optimization, clean code, and Googliness.',
        testCount: 14,
        applicantCount: 62000,
        placementPattern: {
          rounds: ['Online Challenge', '3-4 Technical Coding Rounds', 'Googliness & Leadership Round'],
          aptitudeTopics: ['Analytical Reasoning', 'Mathematical Optimization'],
          technicalTopics: ['Graph Algorithms', 'Recursion & Backtracking', 'Time/Space Complexity', 'OS & Concurrency'],
          codingTopics: ['Dynamic Programming', 'Graph Theory', 'Heaps & Tries'],
          interviewFormat: 'Whiteboard / Shared Doc Live Coding & Problem Solving',
        },
      },
      {
        id: 'cmp_wipro',
        name: 'Wipro',
        logo: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=120&auto=format&fit=crop&q=80',
        industry: 'IT & Business Process',
        jobRoles: ['Project Engineer', 'Turbo Candidate'],
        difficulty: 'Easy',
        description: 'Wipro NLTH national talent hunt assessing Logical, Quantitative, English, and Essay Writing.',
        testCount: 7,
        applicantCount: 29000,
        placementPattern: {
          rounds: ['National Elite Test', 'Technical Interview', 'HR Interview'],
          aptitudeTopics: ['Quantitative Ability', 'Logical Reasoning', 'Verbal Ability'],
          technicalTopics: ['Basic C/Java', 'Logic building'],
          codingTopics: ['Loops & Arrays'],
          interviewFormat: 'Technical & HR Discussion',
        },
      },
    ];

    // Seed Questions Bank
    this.questions = [
      {
        id: 'q_1',
        type: 'mcq',
        category: 'Aptitude',
        topic: 'Percentages',
        difficulty: 'Medium',
        question: 'If 20% of a number is added to 80, the result is the number itself. What is the number?',
        options: ['80', '100', '120', '150'],
        correctAnswer: '100',
        explanation: 'Let the number be x. 0.20x + 80 = x => 0.80x = 80 => x = 100.',
        status: 'approved',
        timeEstimateSeconds: 60,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'q_2',
        type: 'mcq',
        category: 'Aptitude',
        topic: 'Time & Work',
        difficulty: 'Medium',
        question: 'A can do a work in 10 days, and B can do the same work in 15 days. How many days will they take together to finish the work?',
        options: ['5 days', '6 days', '7.5 days', '8 days'],
        correctAnswer: '6 days',
        explanation: 'Combined rate per day = (1/10) + (1/15) = 5/30 = 1/6. Total time required = 6 days.',
        status: 'approved',
        timeEstimateSeconds: 60,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'q_3',
        type: 'mcq',
        category: 'Technical',
        topic: 'Java',
        companyId: 'cmp_tcs',
        difficulty: 'Medium',
        question: 'Which of the following principles is NOT directly part of Object-Oriented Programming (OOP) in Java?',
        options: ['Encapsulation', 'Polymorphism', 'Compilation', 'Inheritance'],
        correctAnswer: 'Compilation',
        explanation: 'Compilation is a build process step, not an OOP concept. Core OOP pillars are Encapsulation, Inheritance, Polymorphism, and Abstraction.',
        status: 'approved',
        timeEstimateSeconds: 45,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'q_4',
        type: 'code_output',
        category: 'Technical',
        topic: 'C / C++',
        difficulty: 'Easy',
        question: 'What is the output of the following C code snippet?',
        codeSnippet: `#include <stdio.h>\nint main() {\n  int x = 5;\n  printf("%d", x++ + ++x);\n  return 0;\n}`,
        options: ['10', '12', 'Undefined / Compiler Dependent', '11'],
        correctAnswer: 'Undefined / Compiler Dependent',
        explanation: 'Modifying a variable twice between sequence points without intervening sequence points yields undefined behavior in standard C.',
        status: 'approved',
        timeEstimateSeconds: 60,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'q_5',
        type: 'mcq',
        category: 'Technical',
        topic: 'DBMS',
        difficulty: 'Hard',
        question: 'Which normal form eliminates partial functional dependencies in a database relation?',
        options: ['First Normal Form (1NF)', 'Second Normal Form (2NF)', 'Third Normal Form (3NF)', 'Boyce-Codd Normal Form (BCNF)'],
        correctAnswer: 'Second Normal Form (2NF)',
        explanation: 'A table is in 2NF if it is in 1NF and no non-prime attribute is functionally dependent on any proper subset of any candidate key (no partial dependency).',
        status: 'approved',
        timeEstimateSeconds: 60,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'q_6',
        type: 'mcq',
        category: 'Aptitude',
        topic: 'Logical Reasoning',
        companyId: 'cmp_infosys',
        difficulty: 'Easy',
        question: 'Find the missing number in the series: 2, 6, 12, 20, 30, ?',
        options: ['38', '40', '42', '48'],
        correctAnswer: '42',
        explanation: 'Differences are 4, 6, 8, 10. Next difference is 12. So 30 + 12 = 42.',
        status: 'approved',
        timeEstimateSeconds: 45,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'q_7',
        type: 'mcq',
        category: 'Technical',
        topic: 'Data Structures',
        companyId: 'cmp_amazon',
        difficulty: 'Hard',
        question: 'What is the average time complexity for searching an element in a balanced Binary Search Tree (BST)?',
        options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
        correctAnswer: 'O(log N)',
        explanation: 'In a balanced BST of size N, height is log2(N). Therefore search takes O(log N) time.',
        status: 'approved',
        timeEstimateSeconds: 45,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'q_8',
        type: 'true_false',
        category: 'Technical',
        topic: 'Operating Systems',
        difficulty: 'Easy',
        question: 'True or False: Virtual memory allows execution of processes that are not completely in physical RAM.',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation: 'Virtual memory separates user logical memory from physical memory, allowing execution of programs larger than main memory via paging.',
        status: 'approved',
        timeEstimateSeconds: 30,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'q_9',
        type: 'fill_blank',
        category: 'Technical',
        topic: 'SQL',
        difficulty: 'Medium',
        question: 'In SQL, which clause is used to filter records AFTER an aggregation (GROUP BY) step?',
        options: ['WHERE', 'HAVING', 'ORDER BY', 'FILTER'],
        correctAnswer: 'HAVING',
        explanation: 'The HAVING clause filters group records after the aggregation takes place, whereas WHERE filters individual rows before grouping.',
        status: 'approved',
        timeEstimateSeconds: 45,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'q_10',
        type: 'scenario',
        category: 'General',
        topic: 'Company Awareness',
        companyId: 'cmp_accenture',
        difficulty: 'Easy',
        question: 'During a client presentation, a team member notices a small calculation error on a slide. What is the most professional immediate course of action?',
        options: [
          'Ignore it completely and hope no one notices',
          'Interrupt the speaker abruptly to correct them on the spot',
          'Politely clarify or share the corrected figure when discussing that specific slide',
          'Blame the intern who created the slide during the meeting',
        ],
        correctAnswer: 'Politely clarify or share the corrected figure when discussing that specific slide',
        explanation: 'Professionalism involves collaborative correction without publicly embarrassing team members or derailing the presentation momentum.',
        status: 'approved',
        timeEstimateSeconds: 60,
        createdAt: new Date().toISOString(),
      },
    ];

    // Seed Pre-configured Mock Tests
    this.testConfigs = [
      {
        id: 'tst_tcs_nqt',
        title: 'TCS NQT Full Placement Mock Test 01',
        description: 'Comprehensive practice test covering TCS Quantitative, Reasoning, Verbal, and Programming Logic.',
        category: 'Company-Specific',
        companyId: 'cmp_tcs',
        companyName: 'TCS (Tata Consultancy Services)',
        difficulty: 'Medium',
        durationMinutes: 25,
        passPercentage: 65,
        negativeMarking: false,
        topics: ['Percentages', 'Time & Work', 'Java', 'Logical Reasoning'],
        questionCount: 6,
        questionIds: ['q_1', 'q_2', 'q_3', 'q_4', 'q_6', 'q_9'],
      },
      {
        id: 'tst_quant_master',
        title: 'Quantitative Aptitude Diagnostic Assessment',
        description: 'Master key math topics required for top campus recruitment drives.',
        category: 'Aptitude',
        difficulty: 'Medium',
        durationMinutes: 20,
        passPercentage: 60,
        negativeMarking: true,
        topics: ['Percentages', 'Time & Work', 'Logical Reasoning'],
        questionCount: 3,
        questionIds: ['q_1', 'q_2', 'q_6'],
      },
      {
        id: 'tst_amazon_sde',
        title: 'Amazon SDE Technical & DSA Mock Challenge',
        description: 'High-level technical practice test focusing on Data Structures, DBMS, and OS fundamentals.',
        category: 'Company-Specific',
        companyId: 'cmp_amazon',
        companyName: 'Amazon',
        difficulty: 'Hard',
        durationMinutes: 30,
        passPercentage: 70,
        negativeMarking: false,
        topics: ['Data Structures', 'DBMS', 'Operating Systems', 'SQL'],
        questionCount: 4,
        questionIds: ['q_5', 'q_7', 'q_8', 'q_9'],
      },
      {
        id: 'tst_infosys_prep',
        title: 'Infosys Special Programmer Prep Test',
        description: 'Focuses on Logical reasoning, Python/Java fundamentals, and problem-solving concepts.',
        category: 'Company-Specific',
        companyId: 'cmp_infosys',
        companyName: 'Infosys',
        difficulty: 'Medium',
        durationMinutes: 20,
        passPercentage: 60,
        negativeMarking: false,
        topics: ['Logical Reasoning', 'Java', 'SQL'],
        questionCount: 3,
        questionIds: ['q_3', 'q_6', 'q_9'],
      },
    ];

    // Seed Test Attempts for Student
    this.testAttempts = [
      {
        id: 'att_101',
        userId: 'usr_student_1',
        testId: 'tst_tcs_nqt',
        testTitle: 'TCS NQT Full Placement Mock Test 01',
        companyName: 'TCS (Tata Consultancy Services)',
        category: 'Company-Specific',
        score: 80,
        totalMarks: 100,
        accuracy: 83,
        correctCount: 5,
        incorrectCount: 1,
        skippedCount: 0,
        timeSpentSeconds: 1120,
        completedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        answers: [
          { questionId: 'q_1', studentAnswer: '100', isCorrect: true, timeSpentSeconds: 110 },
          { questionId: 'q_2', studentAnswer: '6 days', isCorrect: true, timeSpentSeconds: 140 },
          { questionId: 'q_3', studentAnswer: 'Compilation', isCorrect: true, timeSpentSeconds: 40 },
          { questionId: 'q_4', studentAnswer: '10', isCorrect: false, timeSpentSeconds: 90 },
          { questionId: 'q_6', studentAnswer: '42', isCorrect: true, timeSpentSeconds: 50 },
          { questionId: 'q_9', studentAnswer: 'HAVING', isCorrect: true, timeSpentSeconds: 60 },
        ],
        aiAnalysis: {
          strengths: [
            'Exceptional command over Quantitative Aptitude and Percentages',
            'Strong understanding of SQL aggregate grouping clauses',
            'Quick logical reasoning series resolution',
          ],
          weaknesses: [
            'C increment evaluation undefined behavior sequence points',
            'Slight hesitation in complex C pointer / operator precedence',
          ],
          improvements: [
            'Revise C standard sequence points and increment operator rules',
            'Practice 10 advanced C syntax questions',
            'Attempt Hard-level TCS Coding test next',
          ],
          recommendation:
            'Your overall accuracy of 83% is strong. Focus on refining obscure C syntax edge cases to reach 90%+ percentile.',
          topicScores: [
            { topic: 'Percentages', accuracy: 100, status: 'Strong' },
            { topic: 'Time & Work', accuracy: 100, status: 'Strong' },
            { topic: 'Java', accuracy: 100, status: 'Strong' },
            { topic: 'C / C++', accuracy: 0, status: 'Needs Improvement' },
            { topic: 'Logical Reasoning', accuracy: 100, status: 'Strong' },
            { topic: 'SQL', accuracy: 100, status: 'Strong' },
          ],
        },
      },
    ];

    // Seed Notifications
    this.notifications = [
      {
        id: 'notif_1',
        userId: 'usr_student_1',
        title: 'New Mock Test Available',
        message: 'Amazon SDE Technical & DSA Mock Challenge has been added to your preparation path!',
        type: 'test',
        read: false,
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      },
      {
        id: 'notif_2',
        userId: 'usr_student_1',
        title: 'Streak Multiplier Active!',
        message: 'You are on a 6-day practice streak! Complete today\'s Daily Challenge to reach 7 days.',
        type: 'success',
        read: false,
        createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
      },
    ];
  }

  // User methods
  getUserById(id: string): User | undefined {
    return this.users.find((u) => u.id === id);
  }

  getUserByEmail(email: string): User | undefined {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  updateUserProfile(id: string, updates: Partial<User>): User | undefined {
    const user = this.getUserById(id);
    if (!user) return undefined;
    Object.assign(user, updates);
    return user;
  }

  // Companies
  getCompanies(): Company[] {
    return this.companies;
  }

  getCompanyById(id: string): Company | undefined {
    return this.companies.find((c) => c.id === id);
  }

  addCompany(company: Company): Company {
    this.companies.push(company);
    return company;
  }

  updateCompany(id: string, updates: Partial<Company>): Company | undefined {
    const company = this.getCompanyById(id);
    if (!company) return undefined;
    Object.assign(company, updates);
    return company;
  }

  deleteCompany(id: string): boolean {
    const index = this.companies.findIndex((c) => c.id === id);
    if (index !== -1) {
      this.companies.splice(index, 1);
      return true;
    }
    return false;
  }

  // Questions
  getQuestions(filter?: { status?: string; companyId?: string; category?: string }): Question[] {
    let result = this.questions;
    if (filter?.status) result = result.filter((q) => q.status === filter.status);
    if (filter?.companyId) result = result.filter((q) => q.companyId === filter.companyId);
    if (filter?.category) result = result.filter((q) => q.category === filter.category);
    return result;
  }

  getQuestionById(id: string): Question | undefined {
    return this.questions.find((q) => q.id === id);
  }

  addQuestion(question: Question): Question {
    this.questions.push(question);
    return question;
  }

  updateQuestion(id: string, updates: Partial<Question>): Question | undefined {
    const q = this.getQuestionById(id);
    if (!q) return undefined;
    Object.assign(q, updates);
    return q;
  }

  deleteQuestion(id: string): boolean {
    const idx = this.questions.findIndex((q) => q.id === id);
    if (idx !== -1) {
      this.questions.splice(idx, 1);
      return true;
    }
    return false;
  }

  // Tests
  getTestConfigs(): TestConfig[] {
    return this.testConfigs;
  }

  getTestConfigById(id: string): TestConfig | undefined {
    return this.testConfigs.find((t) => t.id === id);
  }

  addTestConfig(testConfig: TestConfig): TestConfig {
    this.testConfigs.push(testConfig);
    return testConfig;
  }

  // Test Attempts
  addTestAttempt(attempt: TestAttempt): TestAttempt {
    this.testAttempts.push(attempt);
    // Update user stats
    const user = this.getUserById(attempt.userId);
    if (user) {
      user.readinessScore = Math.min(100, Math.round(user.readinessScore * 0.7 + attempt.accuracy * 0.3));
    }
    return attempt;
  }

  getTestAttemptsForUser(userId: string): TestAttempt[] {
    return this.testAttempts.filter((a) => a.userId === userId);
  }

  getTestAttemptById(id: string): TestAttempt | undefined {
    return this.testAttempts.find((a) => a.id === id);
  }

  // AI Interview Sessions
  saveInterviewSession(session: InterviewSession): InterviewSession {
    const existingIndex = this.interviewSessions.findIndex((s) => s.id === session.id);
    if (existingIndex !== -1) {
      this.interviewSessions[existingIndex] = session;
    } else {
      this.interviewSessions.push(session);
    }
    return session;
  }

  getInterviewSessionById(id: string): InterviewSession | undefined {
    return this.interviewSessions.find((s) => s.id === id);
  }

  getInterviewSessionsForUser(userId: string): InterviewSession[] {
    return this.interviewSessions.filter((s) => s.userId === userId);
  }

  // Notifications
  getNotificationsForUser(userId: string): Notification[] {
    return this.notifications.filter((n) => n.userId === userId);
  }

  markNotificationAsRead(id: string): void {
    const n = this.notifications.find((notif) => notif.id === id);
    if (n) n.read = true;
  }

  // Leaderboard
  getLeaderboard(): LeaderboardEntry[] {
    return [
      {
        rank: 1,
        userId: 'usr_top_1',
        fullName: 'Priya Sharma',
        college: 'IIT Bombay',
        testsCompleted: 28,
        averageScore: 92,
        streakDays: 19,
        readinessScore: 95,
      },
      {
        rank: 2,
        userId: 'usr_top_2',
        fullName: 'Rahul Verma',
        college: 'BITS Pilani',
        testsCompleted: 24,
        averageScore: 89,
        streakDays: 14,
        readinessScore: 91,
      },
      {
        rank: 3,
        userId: 'usr_student_1',
        fullName: 'Alex Morgan',
        college: 'National Institute of Technology',
        testsCompleted: 15,
        averageScore: 83,
        streakDays: 6,
        readinessScore: 78,
        isCurrentUser: true,
      },
      {
        rank: 4,
        userId: 'usr_top_4',
        fullName: 'Sneha Kulkarni',
        college: 'DTU Delhi',
        testsCompleted: 18,
        averageScore: 81,
        streakDays: 9,
        readinessScore: 76,
      },
      {
        rank: 5,
        userId: 'usr_top_5',
        fullName: 'David Patel',
        college: 'VIT Vellore',
        testsCompleted: 12,
        averageScore: 78,
        streakDays: 4,
        readinessScore: 74,
      },
    ];
  }
}

export const db = new Database();
