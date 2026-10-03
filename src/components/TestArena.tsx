import React, { useState, useEffect, useRef } from 'react';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Send,
  RotateCcw,
  ShieldAlert,
} from 'lucide-react';
import { TestConfig, Question, TestAnswer } from '../types';
import { fetchTestByIdApi, submitTestApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface TestArenaProps {
  testId: string;
  onFinishTest: (attemptId: string) => void;
  onCancel: () => void;
}

export const TestArena: React.FC<TestArenaProps> = ({ testId, onFinishTest, onCancel }) => {
  const { user } = useAuth();
  const [testConfig, setTestConfig] = useState<TestConfig | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, { answer: any; marked: boolean; timeSpent: number }>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(1200); // Default 20 mins
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    async function loadTest() {
      try {
        const data = await fetchTestByIdApi(testId);
        setTestConfig(data.testConfig);
        setQuestions(data.questions);

        // Set difficulty-based duration
        const duration = data.testConfig.durationMinutes * 60;
        setTimeLeftSeconds(duration);

        // Initialize answer map
        const initialMap: Record<string, any> = {};
        data.questions.forEach((q) => {
          initialMap[q.id] = { answer: '', marked: false, timeSpent: 0 };
        });
        setAnswers(initialMap);
      } catch (err) {
        console.error('Failed to load test in arena:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTest();
  }, [testId]);

  // Timer Countdown Effect
  useEffect(() => {
    if (loading || isSubmitting || timeLeftSeconds <= 0) return;

    const interval = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [loading, isSubmitting, timeLeftSeconds]);

  const currentQ = questions[currentIndex];

  const handleSelectAnswer = (optionValue: any) => {
    if (!currentQ) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: {
        ...prev[currentQ.id],
        answer: optionValue,
      },
    }));
  };

  const toggleMarkForReview = () => {
    if (!currentQ) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: {
        ...prev[currentQ.id],
        marked: !prev[currentQ.id]?.marked,
      },
    }));
  };

  const clearAnswer = () => {
    if (!currentQ) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: {
        ...prev[currentQ.id],
        answer: '',
      },
    }));
  };

  const handleAutoSubmit = async () => {
    await handleSubmitTest();
  };

  const handleSubmitTest = async () => {
    if (isSubmitting || !testConfig) return;
    setIsSubmitting(true);

    const totalSpent = Math.round((Date.now() - startTimeRef.current) / 1000);

    const payloadAnswers = questions.map((q) => ({
      questionId: q.id,
      studentAnswer: answers[q.id]?.answer || '',
      timeSpentSeconds: answers[q.id]?.timeSpent || 30,
    }));

    try {
      const res = await submitTestApi({
        userId: user?.id || 'usr_student_1',
        testId: testConfig.id,
        answers: payloadAnswers,
        timeSpentSeconds: totalSpent,
      });

      if (res.success && res.attempt) {
        onFinishTest(res.attempt.id);
      }
    } catch (err) {
      console.error('Error submitting test:', err);
      setIsSubmitting(false);
    }
  };

  if (loading || !testConfig || !currentQ) {
    return (
      <div className="min-h-screen bg-[#0F1117] text-slate-100 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400 font-light uppercase tracking-wider">Initializing Secure Placement Test Environment...</p>
        </div>
      </div>
    );
  }

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  // Palette Status Counters
  const answeredCount = Object.values(answers).filter((a) => a.answer !== '').length;
  const markedCount = Object.values(answers).filter((a) => a.marked).length;
  const totalQuestions = questions.length;

  return (
    <div className="min-h-screen bg-[#0F1117] text-slate-100 flex flex-col font-sans selection:bg-indigo-500">
      {/* Test Arena Top Header Bar */}
      <header className="bg-[#161922] border-b border-[#1F2430] px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-30">
        <div>
          <h1 className="editorial-serif text-lg sm:text-xl font-normal text-slate-100 truncate max-w-md">{testConfig.title}</h1>
          <p className="text-[11px] text-slate-400 font-light mt-0.5">
            {testConfig.companyName ? `${testConfig.companyName} • ` : ''}
            {testConfig.category} • Difficulty: {testConfig.difficulty}
          </p>
        </div>

        {/* Timer Box */}
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-mono font-medium transition-colors ${
            timeLeftSeconds < 300
              ? 'bg-rose-500/10 border-rose-500/40 text-rose-300 animate-pulse'
              : 'bg-[#0F1117] border-[#1F2430] text-indigo-300'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-indigo-400" />
          <span>{formatTime(timeLeftSeconds)}</span>
        </div>

        {/* Submit Test Button */}
        <button
          onClick={() => setShowSubmitModal(true)}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs uppercase tracking-wider transition-all shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Submit Test</span>
        </button>
      </header>

      {/* Main Arena Workspace */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Question Card & Options */}
        <div className="lg:col-span-3 flex flex-col justify-between bg-[#161922] border border-[#1F2430] rounded-3xl p-6 sm:p-8">
          <div>
            {/* Question Top Metadata */}
            <div className="flex items-center justify-between pb-4 border-b border-[#1F2430] mb-6 text-xs text-slate-400">
              <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider">
                Question {currentIndex + 1} of {totalQuestions}
              </span>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-[#0F1117] border border-[#1F2430] text-slate-400 text-[11px] font-light">
                  Topic: {currentQ.topic}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-[#0F1117] border border-[#1F2430] text-slate-400 text-[11px] font-light">
                  Est: {currentQ.timeEstimateSeconds}s
                </span>
              </div>
            </div>

            {/* Question Statement */}
            <h2 className="editorial-serif text-lg sm:text-2xl font-normal text-slate-100 leading-relaxed mb-4">
              {currentQ.question}
            </h2>

            {/* Optional Code Snippet Display */}
            {currentQ.codeSnippet && (
              <div className="mb-6 p-4 rounded-xl bg-[#0F1117] border border-[#1F2430] font-mono text-xs text-indigo-300 overflow-x-auto">
                <pre>{currentQ.codeSnippet}</pre>
              </div>
            )}

            {/* Options List */}
            {currentQ.options && (
              <div className="space-y-3 mt-6">
                {currentQ.options.map((opt, i) => {
                  const isSelected = answers[currentQ.id]?.answer === opt;
                  return (
                    <button
                      key={i}
                      onClick={() => handleSelectAnswer(opt)}
                      className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-indigo-600/10 border-indigo-500/50 text-indigo-200'
                          : 'bg-[#0F1117] border-[#1F2430] text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-6 h-6 rounded-lg font-semibold text-xs flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-indigo-600 text-white' : 'bg-[#1F2430] text-slate-400'
                          }`}
                        >
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span className="font-light">{opt}</span>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Bottom Action Controls */}
          <div className="mt-8 pt-6 border-t border-[#1F2430] flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMarkForReview}
                className={`px-3.5 py-2 rounded-xl border transition-colors flex items-center gap-1.5 uppercase tracking-wider font-medium text-[11px] ${
                  answers[currentQ.id]?.marked
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                    : 'bg-[#0F1117] border-[#1F2430] text-slate-400 hover:text-white'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{answers[currentQ.id]?.marked ? 'Marked for Review' : 'Mark for Review'}</span>
              </button>

              <button
                onClick={clearAnswer}
                className="px-3.5 py-2 rounded-xl bg-[#0F1117] border border-[#1F2430] text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 uppercase tracking-wider font-medium text-[11px]"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear Answer</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                className="px-4 py-2 rounded-xl bg-[#0F1117] border border-[#1F2430] text-slate-300 disabled:opacity-40 hover:bg-[#1F2430] transition-colors flex items-center gap-1 uppercase tracking-wider font-medium text-[11px]"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <button
                disabled={currentIndex === totalQuestions - 1}
                onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1 uppercase tracking-wider font-medium text-[11px]"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Question Palette Sidebar */}
        <div className="bg-[#161922] border border-[#1F2430] rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="editorial-serif text-lg font-normal text-slate-100 mb-4 pb-2 border-b border-[#1F2430]">
              Question Palette
            </h3>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 mb-6 font-light">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded bg-indigo-600" />
                <span>Answered ({answeredCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded bg-amber-500" />
                <span>Marked ({markedCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded bg-[#0F1117] border border-[#1F2430]" />
                <span>Unanswered</span>
              </div>
            </div>

            {/* Palette Grid */}
            <div className="grid grid-cols-5 gap-2 max-h-72 overflow-y-auto pr-1">
              {questions.map((q, idx) => {
                const ans = answers[q.id];
                const isCurrent = idx === currentIndex;
                const isAns = ans?.answer !== '';
                const isMrk = ans?.marked;

                let btnBg = 'bg-[#0F1117] border-[#1F2430] text-slate-400';
                if (isMrk) btnBg = 'bg-amber-500 text-slate-950 font-bold';
                else if (isAns) btnBg = 'bg-indigo-600 text-white font-bold';

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-9 rounded-lg border text-xs font-medium transition-all flex items-center justify-center ${btnBg} ${
                      isCurrent ? 'ring-2 ring-indigo-400 ring-offset-2 ring-offset-[#161922]' : ''
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#1F2430]">
            <button
              onClick={() => setShowSubmitModal(true)}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs uppercase tracking-wider transition-all shadow-md shadow-emerald-600/20"
            >
              Submit Final Assessment
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Submit Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-[#0F1117]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans">
          <div className="bg-[#161922] border border-[#1F2430] rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mb-4">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="editorial-serif text-2xl font-normal text-slate-100">Submit Placement Test?</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed font-light">
              You have answered <span className="text-indigo-400 font-medium">{answeredCount}</span> out of{' '}
              <span className="text-white font-medium">{totalQuestions}</span> questions. Once submitted, our AI will diagnose your performance instantly.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3 text-xs uppercase tracking-wider font-medium">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 rounded-xl bg-[#0F1117] border border-[#1F2430] text-slate-300 hover:bg-[#1F2430]"
              >
                Continue Test
              </button>
              <button
                onClick={handleSubmitTest}
                disabled={isSubmitting}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
              >
                {isSubmitting ? 'Evaluating...' : 'Confirm Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
