import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Brain,
  Sparkles,
  TrendingUp,
  Award,
  ArrowLeft,
  RotateCcw,
  BookOpen,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { TestAttempt, Question } from '../types';
import { fetchAttemptByIdApi, fetchTestByIdApi } from '../services/api';

interface TestResultViewProps {
  attemptId: string;
  onBackToDashboard: () => void;
  onRetakeTest?: () => void;
}

export const TestResultView: React.FC<TestResultViewProps> = ({
  attemptId,
  onBackToDashboard,
  onRetakeTest,
}) => {
  const [attempt, setAttempt] = useState<TestAttempt | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filterMode, setFilterMode] = useState<'all' | 'incorrect' | 'correct'>('all');
  const [expandedQId, setExpandedQId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadResults() {
      try {
        const att = await fetchAttemptByIdApi(attemptId);
        setAttempt(att);

        // Fetch questions details
        const testData = await fetchTestByIdApi(att.testId);
        setQuestions(testData.questions);
      } catch (err) {
        console.error('Error loading attempt result:', err);
      } finally {
        setLoading(false);
      }
    }
    loadResults();
  }, [attemptId]);

  if (loading || !attempt) {
    return (
      <div className="min-h-screen bg-[#0F1117] text-slate-100 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400 font-light uppercase tracking-wider">Generating Gemini AI Diagnostic Report...</p>
        </div>
      </div>
    );
  }

  const filteredAnswers = attempt.answers.filter((ans) => {
    if (filterMode === 'incorrect') return !ans.isCorrect;
    if (filterMode === 'correct') return ans.isCorrect;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#0F1117] text-slate-100 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBackToDashboard}
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Student Dashboard</span>
        </button>

        {onRetakeTest && (
          <button
            onClick={onRetakeTest}
            className="px-4 py-2 rounded-xl bg-[#161922] border border-[#1F2430] text-slate-300 hover:text-white text-xs font-medium uppercase tracking-wider flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake Test</span>
          </button>
        )}
      </div>

      {/* Main Scorecard Header Card */}
      <div className="bg-[#161922] border border-[#1F2430] rounded-3xl p-6 sm:p-8 mb-8 relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
          {/* Score Gauge Circle */}
          <div className="flex flex-col items-center justify-center p-4 bg-[#0F1117] rounded-2xl border border-[#1F2430] text-center">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="56" cy="56" r="46" stroke="#1F2430" strokeWidth="8" fill="transparent" />
                <circle
                  cx="56"
                  cy="56"
                  r="46"
                  stroke="#6366f1"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={289}
                  strokeDashoffset={289 - (289 * attempt.score) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute text-center">
                <span className="editorial-serif text-3xl font-normal text-slate-100">{attempt.score}</span>
                <span className="text-[10px] text-slate-400 block font-light">/ 100</span>
              </div>
            </div>
            <div className="mt-2 text-xs font-medium text-emerald-400 uppercase tracking-wider">
              {attempt.accuracy >= 75 ? 'Excellent Grade' : 'Good Performance'}
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="md:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-[#0F1117] border border-[#1F2430]">
              <div className="text-slate-400 text-xs font-light">Accuracy</div>
              <div className="editorial-serif text-2xl font-normal text-indigo-300 mt-1">{attempt.accuracy}%</div>
            </div>
            <div className="p-4 rounded-xl bg-[#0F1117] border border-[#1F2430]">
              <div className="text-slate-400 text-xs font-light">Correct</div>
              <div className="editorial-serif text-2xl font-normal text-emerald-300 mt-1">
                {attempt.correctCount} / {attempt.answers.length}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-[#0F1117] border border-[#1F2430]">
              <div className="text-slate-400 text-xs font-light">Incorrect</div>
              <div className="editorial-serif text-2xl font-normal text-rose-300 mt-1">{attempt.incorrectCount}</div>
            </div>
            <div className="p-4 rounded-xl bg-[#0F1117] border border-[#1F2430]">
              <div className="text-slate-400 text-xs font-light">Time Taken</div>
              <div className="editorial-serif text-2xl font-normal text-amber-300 mt-1">
                {Math.round(attempt.timeSpentSeconds / 60)} mins
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Performance Analysis Section */}
      {attempt.aiAnalysis && (
        <div className="bg-[#161922] border border-[#1F2430] rounded-3xl p-6 sm:p-8 mb-10 shadow-2xl">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 className="editorial-serif text-2xl font-normal text-slate-100">Gemini AI Placement Intelligence Report</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Strengths */}
            <div>
              <h3 className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Demonstrated Strengths
              </h3>
              <ul className="space-y-2 text-xs font-light">
                {attempt.aiAnalysis.strengths.map((str, i) => (
                  <li key={i} className="p-3.5 rounded-xl bg-[#0F1117] border border-[#1F2430] text-slate-300">
                    {str}
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div>
              <h3 className="text-xs font-semibold text-rose-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <XCircle className="w-4 h-4" />
                Knowledge Gaps & Weaknesses
              </h3>
              <ul className="space-y-2 text-xs font-light">
                {attempt.aiAnalysis.weaknesses.map((wk, i) => (
                  <li key={i} className="p-3.5 rounded-xl bg-[#0F1117] border border-[#1F2430] text-slate-300">
                    {wk}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* AI Recommendation Quote */}
          <div className="mt-8 p-4 rounded-2xl bg-[#0F1117] border border-indigo-500/20">
            <div className="text-xs font-semibold text-indigo-300 mb-1 uppercase tracking-wider">AI Recommendation:</div>
            <p className="text-xs text-slate-300 italic leading-relaxed font-light">
              "{attempt.aiAnalysis.recommendation}"
            </p>
          </div>
        </div>
      )}

      {/* Question Review Section */}
      <div className="bg-[#161922] border border-[#1F2430] rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h2 className="editorial-serif text-2xl font-normal text-slate-100">Question Breakdown & Solutions</h2>

          {/* Review Filter */}
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-medium">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-xl transition-colors ${
                filterMode === 'all' ? 'bg-indigo-600 text-white' : 'bg-[#0F1117] text-slate-400'
              }`}
            >
              All ({attempt.answers.length})
            </button>
            <button
              onClick={() => setFilterMode('incorrect')}
              className={`px-3 py-1.5 rounded-xl transition-colors ${
                filterMode === 'incorrect' ? 'bg-rose-600 text-white' : 'bg-[#0F1117] text-slate-400'
              }`}
            >
              Incorrect ({attempt.incorrectCount})
            </button>
            <button
              onClick={() => setFilterMode('correct')}
              className={`px-3 py-1.5 rounded-xl transition-colors ${
                filterMode === 'correct' ? 'bg-emerald-600 text-white' : 'bg-[#0F1117] text-slate-400'
              }`}
            >
              Correct ({attempt.correctCount})
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredAnswers.map((ans) => {
            const q = questions.find((item) => item.id === ans.questionId);
            if (!q) return null;
            const isExpanded = expandedQId === q.id;

            return (
              <div
                key={q.id}
                className={`p-5 rounded-2xl border transition-all ${
                  ans.isCorrect
                    ? 'bg-[#0F1117] border-[#1F2430]'
                    : 'bg-rose-950/10 border-rose-500/20'
                }`}
              >
                <div className="flex items-start justify-between gap-4 cursor-pointer" onClick={() => setExpandedQId(isExpanded ? null : q.id)}>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                          ans.isCorrect ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                        }`}
                      >
                        {ans.isCorrect ? 'CORRECT' : 'INCORRECT'}
                      </span>
                      <span className="text-xs text-slate-400 font-light">Topic: {q.topic}</span>
                    </div>

                    <h3 className="text-sm font-medium text-slate-200">{q.question}</h3>
                  </div>

                  <button className="text-slate-400 hover:text-white p-1">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>

                {/* Always show answer comparison */}
                <div className="mt-4 pt-3 border-t border-[#1F2430] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-light">
                  <div className="p-2.5 rounded-xl bg-[#161922] border border-[#1F2430]">
                    <span className="text-slate-500 block text-[10px] uppercase font-semibold">Your Answer:</span>
                    <span className={`font-medium ${ans.isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {ans.studentAnswer || 'Skipped'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#161922] border border-[#1F2430]">
                    <span className="text-slate-500 block text-[10px] uppercase font-semibold">Correct Answer:</span>
                    <span className="text-emerald-400 font-medium">{String(q.correctAnswer)}</span>
                  </div>
                </div>

                {/* Detailed Explanation on Expand */}
                {isExpanded && (
                  <div className="mt-4 p-4 rounded-xl bg-[#161922] border border-indigo-500/20 text-xs text-slate-300 font-light">
                    <div className="font-medium text-indigo-400 mb-1 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                      <Brain className="w-3.5 h-3.5" />
                      Detailed Explanation:
                    </div>
                    <p className="leading-relaxed">{q.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
