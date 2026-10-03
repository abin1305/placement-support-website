import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Brain,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  Filter,
  ArrowRight,
} from 'lucide-react';
import { Question } from '../types';
import { fetchQuestionsApi } from '../services/api';

export const PracticeArena: React.FC<{ initialTopic?: string }> = ({ initialTopic }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Aptitude' | 'Technical'>('All');
  const [selectedTopic, setSelectedTopic] = useState<string>(initialTopic || 'All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showExplanations, setShowExplanations] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadQuestions() {
      try {
        const list = await fetchQuestionsApi({ status: 'approved' });
        setQuestions(list);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadQuestions();
  }, []);

  const topicsList = ['All', 'Percentages', 'Time & Work', 'Logical Reasoning', 'Java', 'C / C++', 'DBMS', 'Data Structures', 'SQL'];

  const filteredQuestions = questions.filter((q) => {
    const matchesCat = selectedCategory === 'All' || q.category === selectedCategory;
    const matchesTopic = selectedTopic === 'All' || q.topic === selectedTopic;
    const matchesDiff = selectedDifficulty === 'All' || q.difficulty === selectedDifficulty;
    return matchesCat && matchesTopic && matchesDiff;
  });

  const handleSelectAnswer = (qId: string, option: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [qId]: option }));
  };

  const toggleExplanation = (qId: string) => {
    setShowExplanations((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  return (
    <div className="min-h-screen bg-[#0F1117] text-slate-100 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="mb-8">
        <div className="text-[11px] font-semibold uppercase tracking-widest text-indigo-400 mb-1">
          Skill Mastery Modules
        </div>
        <h1 className="editorial-serif text-3xl sm:text-4xl font-normal text-slate-100">Aptitude & Technical Practice Arena</h1>
        <p className="text-sm text-slate-400 mt-1.5 font-light">
          Practice topic-wise questions with instant step-by-step solutions and AI explanations.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#161922] border border-[#1F2430] rounded-2xl p-4 mb-8 space-y-4">
        {/* Category Selector */}
        <div className="flex items-center gap-3 text-xs flex-wrap">
          <span className="text-slate-400 font-normal">Category:</span>
          {['All', 'Aptitude', 'Technical'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat as any)}
              className={`px-3.5 py-1.5 rounded-xl font-medium transition-colors text-xs ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-[#0F1117] text-slate-400 hover:text-slate-200 border border-[#1F2430]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Topic Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
          <span className="text-slate-400 font-normal shrink-0">Topic:</span>
          {topicsList.map((top) => (
            <button
              key={top}
              onClick={() => setSelectedTopic(top)}
              className={`px-3 py-1 rounded-lg shrink-0 transition-colors ${
                selectedTopic === top
                  ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium'
                  : 'bg-[#0F1117] text-slate-400 hover:text-slate-200 border border-[#1F2430]'
              }`}
            >
              {top}
            </button>
          ))}
        </div>
      </div>

      {/* Questions Feed */}
      <div className="space-y-6">
        {filteredQuestions.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            <p>No practice questions found for this topic filter.</p>
          </div>
        ) : (
          filteredQuestions.map((q, idx) => {
            const userAns = selectedAnswers[q.id];
            const isAnswered = Boolean(userAns);
            const isCorrect = isAnswered && userAns === q.correctAnswer;
            const showExp = showExplanations[q.id];

            return (
              <div key={q.id} className="editorial-card rounded-2xl p-6">
                <div className="flex items-center justify-between pb-3 border-b border-[#1F2430] mb-4 text-xs">
                  <span className="font-semibold text-indigo-400 tracking-wide">
                    Question {idx + 1} • {q.topic}
                  </span>
                  <span className="px-2.5 py-0.5 rounded bg-[#1F2430] text-slate-300 text-[11px]">
                    Difficulty: {q.difficulty}
                  </span>
                </div>

                <h3 className="text-sm font-medium text-slate-100 leading-relaxed mb-4">{q.question}</h3>

                {q.codeSnippet && (
                  <div className="p-3.5 rounded-xl bg-[#0F1117] border border-[#1F2430] font-mono text-xs text-indigo-300 mb-4 overflow-x-auto">
                    <pre>{q.codeSnippet}</pre>
                  </div>
                )}

                {/* Options */}
                {q.options && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    {q.options.map((opt, i) => {
                      const isSelected = userAns === opt;
                      let btnStyle = 'bg-[#0F1117] border-[#1F2430] text-slate-300 hover:bg-[#1F2430]/60';

                      if (isAnswered) {
                        if (opt === q.correctAnswer) btnStyle = 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300 font-medium';
                        else if (isSelected) btnStyle = 'bg-rose-950/40 border-rose-500/50 text-rose-300';
                      }

                      return (
                        <button
                          key={i}
                          disabled={isAnswered}
                          onClick={() => handleSelectAnswer(q.id, opt)}
                          className={`p-3.5 rounded-xl border text-xs text-left transition-all ${btnStyle}`}
                        >
                          <span className="font-semibold mr-2">{String.fromCharCode(65 + i)}.</span>
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Solution Toggle */}
                {isAnswered && (
                  <div className="pt-3 border-t border-[#1F2430] flex items-center justify-between">
                    <span className={`text-xs font-semibold ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isCorrect ? '✓ Correct Answer!' : `✗ Incorrect. Correct: ${q.correctAnswer}`}
                    </span>

                    <button
                      onClick={() => toggleExplanation(q.id)}
                      className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5"
                    >
                      <Brain className="w-3.5 h-3.5" />
                      <span>{showExp ? 'Hide Solution' : 'View AI Explanation'}</span>
                    </button>
                  </div>
                )}

                {showExp && (
                  <div className="mt-4 p-4 rounded-xl bg-[#0F1117] border border-indigo-500/20 text-xs text-slate-300 leading-relaxed font-light">
                    <span className="font-semibold text-indigo-400 block mb-1 uppercase tracking-wider text-[10px]">Step-by-Step Solution:</span>
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
