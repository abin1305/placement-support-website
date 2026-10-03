import { GoogleGenAI, Type } from '@google/genai';
import { Question, TestAttempt, TestConfig, InterviewTurn, InterviewSession, User } from '../types.js';

const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('No Gemini API key found in environment variables. Falling back to demo responses.');
  }
  return new GoogleGenAI({
    apiKey: apiKey || 'dummy-key',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

/**
 * AI Question Generator for Placement Mock Tests
 */
export async function generateAiQuestions(params: {
  companyName?: string;
  category: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  count: number;
}): Promise<Partial<Question>[]> {
  try {
    const ai = getAiClient();
    const prompt = `Generate ${params.count} realistic placement assessment questions for ${
      params.companyName ? `company '${params.companyName}'` : 'general recruitment tests'
    }.
Category: ${params.category}
Topic: ${params.topic}
Difficulty: ${params.difficulty}

Return an array of question objects where each object has:
- question: string (clear question statement)
- type: string ("mcq", "code_output", "scenario", or "fill_blank")
- codeSnippet: string or null (if applicable, e.g. for C++, Java, Python, SQL)
- options: array of 4 distinct string choices
- correctAnswer: string matching exactly one of the 4 options
- explanation: string explaining why the answer is correct and step-by-step solution
- timeEstimateSeconds: number (30 for Easy, 60 for Medium, 90 for Hard)`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              type: { type: Type.STRING },
              codeSnippet: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              correctAnswer: { type: Type.STRING },
              explanation: { type: Type.STRING },
              timeEstimateSeconds: { type: Type.NUMBER },
            },
            required: ['question', 'type', 'options', 'correctAnswer', 'explanation', 'timeEstimateSeconds'],
          },
        },
      },
    });

    const jsonText = response.text || '[]';
    const parsed = JSON.parse(jsonText);

    return parsed.map((item: any) => ({
      ...item,
      category: params.category as any,
      topic: params.topic,
      difficulty: params.difficulty,
      status: 'approved' as const,
      createdAt: new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Error in generateAiQuestions:', error);
    // Fallback static question generation if API key is unconfigured or rate limited
    return [
      {
        question: `Sample ${params.topic} (${params.difficulty}) Question: What is the primary characteristic of ${params.topic}?`,
        type: 'mcq',
        options: ['Optimal efficiency', 'High throughput', 'Structured representation', 'All of the above'],
        correctAnswer: 'All of the above',
        explanation: `${params.topic} incorporates all these fundamentals for robust application performance.`,
        category: params.category as any,
        topic: params.topic,
        difficulty: params.difficulty,
        timeEstimateSeconds: params.difficulty === 'Easy' ? 30 : params.difficulty === 'Medium' ? 60 : 90,
        status: 'approved',
        createdAt: new Date().toISOString(),
      },
    ];
  }
}

/**
 * AI Performance Analyzer for Test Results
 */
export async function analyzeTestPerformanceWithAi(
  attempt: TestAttempt,
  testConfig: TestConfig,
  questions: Question[]
) {
  try {
    const ai = getAiClient();
    const prompt = `Analyze this student's placement mock test attempt:
Test Title: ${testConfig.title}
Category: ${testConfig.category}
Difficulty: ${testConfig.difficulty}
Score: ${attempt.score}/100
Accuracy: ${attempt.accuracy}%
Correct Answers: ${attempt.correctCount} / ${questions.length}
Time Taken: ${Math.round(attempt.timeSpentSeconds / 60)} minutes

Detailed Question Attempts:
${attempt.answers
  .map((ans, i) => {
    const q = questions.find((q) => q.id === ans.questionId);
    return `Q${i + 1} (${q?.topic || 'General'}): Student answered "${ans.studentAnswer}", Correct: "${
      q?.correctAnswer
    }" [${ans.isCorrect ? 'CORRECT' : 'INCORRECT'}]`;
  })
  .join('\n')}

Provide detailed performance feedback in JSON format:
{
  "strengths": [list of 3 key strengths demonstrated],
  "weaknesses": [list of 2-3 specific topics or skills where student stumbled],
  "improvements": [list of 4 actionable step-by-step recommendations],
  "recommendation": "A short, encouraging, highly specific quote recommending what test or topic to practice next",
  "topicScores": [
    { "topic": "string", "accuracy": number, "status": "Strong" | "Good" | "Needs Improvement" }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error('Error analyzing performance:', error);
    return {
      strengths: [
        'Good fundamental grasp of basic concepts',
        'Demonstrated speed in straightforward questions',
      ],
      weaknesses: [
        'Time management on complex calculation questions',
        'Accuracy drops on tricky edge cases',
      ],
      improvements: [
        'Review missed questions in the question review section below',
        'Solve 5 targeted practice problems daily in your weakest topic',
        'Practice timed mock tests to improve solving speed',
      ],
      recommendation:
        'Your accuracy is promising! Practice medium-level questions in your core topics for 2 days before attempting hard tests.',
      topicScores: [
        { topic: testConfig.topics[0] || 'General', accuracy: attempt.accuracy, status: attempt.accuracy >= 70 ? 'Strong' : 'Needs Improvement' },
      ],
    };
  }
}

/**
 * AI Interview Response Evaluator
 */
export async function evaluateInterviewResponse(params: {
  companyName: string;
  jobRole: string;
  interviewType: string;
  question: string;
  userAnswer: string;
}) {
  try {
    const ai = getAiClient();
    const prompt = `You are a Senior Technical Recruiter at ${params.companyName} conducting an interview for a ${params.jobRole} role (${params.interviewType} Interview).

Question Asked: "${params.question}"
Candidate Answer: "${params.userAnswer}"

Evaluate the candidate's response and return a JSON response with:
{
  "score": number (0-100 overall score for this answer),
  "technicalScore": number (0-100),
  "communicationScore": number (0-100),
  "clarityScore": number (0-100),
  "strengths": "One concise sentence on what was good",
  "improvement": "One concise sentence on how to make this answer stronger",
  "sampleAnswer": "A crisp, model answer highlighting STAR method or technical best practices",
  "nextQuestion": "The next natural interview question to follow up with"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error('Error evaluating interview turn:', error);
    return {
      score: 75,
      technicalScore: 78,
      communicationScore: 72,
      clarityScore: 75,
      strengths: 'You covered the core idea clearly and addressed the main point.',
      improvement: 'Provide a concrete real-world example using the STAR format (Situation, Task, Action, Result).',
      sampleAnswer:
        'A ideal candidate would state: "In my recent project, I faced X challenge, applied Y solution, achieving a 25% improvement in Z."',
      nextQuestion: 'Can you describe a situation where you had a disagreement with a team member and how you resolved it?',
    };
  }
}

/**
 * AI Personalized 7-Day Roadmap Generator
 */
export async function generatePersonalizedRoadmap(user: User, attempts: TestAttempt[]) {
  try {
    const ai = getAiClient();
    const prompt = `Generate a personalized 7-day placement preparation plan for this student:
Name: ${user.fullName}
Target Roles: ${user.preferredRoles.join(', ')}
Target Companies: ${user.preferredCompanies.join(', ')}
Current Skills: ${user.skills.join(', ')}
Readiness Score: ${user.readinessScore}%
Tests Attempted Count: ${attempts.length}

Return a JSON object with a 7-day array where each day has:
{
  "day": number (1 to 7),
  "focus": "String title e.g. Quantitative Aptitude",
  "description": "Short action plan for the day",
  "targetModules": ["Topic 1", "Topic 2"],
  "estimatedHours": number
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    return JSON.parse(response.text || '[]');
  } catch (error) {
    return [
      { day: 1, focus: 'Quantitative Aptitude & Percentages', description: 'Master percentages, ratio, profit & loss shortcuts.', targetModules: ['Percentages', 'Ratio'], estimatedHours: 2 },
      { day: 2, focus: 'Logical Reasoning & Series', description: 'Solve number series, coding-decoding, and syllogisms.', targetModules: ['Logical Reasoning', 'Data Interpretation'], estimatedHours: 2 },
      { day: 3, focus: 'Core Programming Concepts', description: 'Review OOPs, Java/Python basics, and memory management.', targetModules: ['Java', 'OOPs'], estimatedHours: 2.5 },
      { day: 4, focus: 'Database & SQL Queries', description: 'Practice JOINs, GROUP BY, HAVING, and indexing.', targetModules: ['DBMS', 'SQL'], estimatedHours: 2 },
      { day: 5, focus: 'Company-Specific Mock Assessment', description: 'Attempt full-length company mock test under timed environment.', targetModules: [user.preferredCompanies[0] || 'TCS'], estimatedHours: 2.5 },
      { day: 6, focus: 'Data Structures & Coding Practice', description: 'Practice array manipulation, two pointers, and string problems.', targetModules: ['Data Structures', 'Algorithms'], estimatedHours: 3 },
      { day: 7, focus: 'AI Mock Interview & HR Practice', description: 'Take an AI HR & Technical mock interview and review STAR answers.', targetModules: ['HR Interview', 'Behavioral'], estimatedHours: 1.5 },
    ];
  }
}
