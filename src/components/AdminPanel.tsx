import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Users,
  Building2,
  HelpCircle,
  Brain,
  CheckCircle2,
  XCircle,
  Plus,
  Sparkles,
  BarChart3,
  Search,
  Filter,
} from 'lucide-react';
import { Company, Question } from '../types';
import {
  fetchAdminAnalyticsApi,
  fetchQuestionsApi,
  updateQuestionStatusApi,
  generateAiQuestionsApi,
  fetchCompaniesApi,
} from '../services/api';

export const AdminPanel: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [activeTab, setActiveTab] = useState<'analytics' | 'questions' | 'companies' | 'ai_gen'>('analytics');
  const [loading, setLoading] = useState(true);

  // AI Generator Form State
  const [genCompany, setGenCompany] = useState('');
  const [genCategory, setGenCategory] = useState('Aptitude');
  const [genTopic, setGenTopic] = useState('Percentages');
  const [genDifficulty, setGenDifficulty] = useState('Medium');
  const [genCount, setGenCount] = useState(3);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    async function loadAdminData() {
      try {
        const [stats, qList, cList] = await Promise.all([
          fetchAdminAnalyticsApi(),
          fetchQuestionsApi(),
          fetchCompaniesApi(),
        ]);
        setAnalytics(stats);
        setQuestions(qList);
        setCompanies(cList);
      } catch (err) {
        console.error('Error loading admin data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAdminData();
  }, []);

  const handleApproveQuestion = async (id: string) => {
    await updateQuestionStatusApi(id, 'approved');
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, status: 'approved' } : q)));
  };

  const handleRejectQuestion = async (id: string) => {
    await updateQuestionStatusApi(id, 'rejected');
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, status: 'rejected' } : q)));
  };

  const handleRunAiGenerator = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const res = await generateAiQuestionsApi({
        companyName: genCompany,
        category: genCategory,
        topic: genTopic,
        difficulty: genDifficulty,
        count: genCount,
      });

      if (res.success) {
        const updatedQs = await fetchQuestionsApi();
        setQuestions(updatedQs);
        setActiveTab('questions');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const pendingQuestions = questions.filter((q) => q.status === 'pending');

  return (
    <div className="min-h-screen bg-[#0F1117] text-slate-100 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-4 border-b border-[#1F2430]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h1 className="editorial-serif text-2xl sm:text-3xl font-normal text-slate-100">Platform Admin Control Center</h1>
            <p className="text-xs text-slate-400 font-light mt-0.5">
              Manage companies, question verification workflows, AI generators, and student analytics.
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 bg-[#161922] p-1.5 rounded-2xl border border-[#1F2430] text-xs">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3.5 py-1.5 rounded-xl font-medium transition-colors ${
              activeTab === 'analytics' ? 'bg-amber-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Analytics
          </button>
          <button
            onClick={() => setActiveTab('questions')}
            className={`px-3.5 py-1.5 rounded-xl font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'questions' ? 'bg-amber-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Questions Review</span>
            {pendingQuestions.length > 0 && (
              <span className="px-1.5 py-0.2 bg-rose-500 text-white font-bold rounded-full text-[10px]">
                {pendingQuestions.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('ai_gen')}
            className={`px-3.5 py-1.5 rounded-xl font-medium transition-colors flex items-center gap-1 ${
              activeTab === 'ai_gen' ? 'bg-amber-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Generator</span>
          </button>
        </div>
      </div>

      {/* Analytics Tab */}
      {activeTab === 'analytics' && analytics && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#161922] border border-[#1F2430]">
              <span className="text-xs text-slate-400 font-light">Total Registered Students</span>
              <div className="editorial-serif text-3xl font-normal text-slate-100 mt-2">{analytics.totalStudents}</div>
            </div>
            <div className="p-5 rounded-2xl bg-[#161922] border border-[#1F2430]">
              <span className="text-xs text-slate-400 font-light">Active Companies</span>
              <div className="editorial-serif text-3xl font-normal text-indigo-300 mt-2">{analytics.totalCompanies}</div>
            </div>
            <div className="p-5 rounded-2xl bg-[#161922] border border-[#1F2430]">
              <span className="text-xs text-slate-400 font-light">Question Bank Size</span>
              <div className="editorial-serif text-3xl font-normal text-emerald-300 mt-2">{analytics.totalQuestions}</div>
            </div>
            <div className="p-5 rounded-2xl bg-[#161922] border border-[#1F2430]">
              <span className="text-xs text-slate-400 font-light">Pending Review</span>
              <div className="editorial-serif text-3xl font-normal text-amber-300 mt-2">{pendingQuestions.length}</div>
            </div>
          </div>
        </div>
      )}

      {/* Questions Verification Queue Tab */}
      {activeTab === 'questions' && (
        <div className="bg-[#161922] border border-[#1F2430] rounded-3xl p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#1F2430]">
            <div>
              <h2 className="editorial-serif text-2xl font-normal text-slate-100">AI Questions Review Workflow</h2>
              <p className="text-xs text-slate-400 mt-0.5 font-light">
                Audited questions ensure 100% accuracy for students taking placement tests.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {questions.map((q) => (
              <div key={q.id} className="p-5 rounded-2xl bg-[#0F1117] border border-[#1F2430] space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-medium text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                        q.status === 'approved'
                          ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                          : q.status === 'pending'
                          ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                      }`}
                    >
                      {q.status.toUpperCase()}
                    </span>
                    <span className="text-slate-400 font-normal">Topic: {q.topic}</span>
                  </div>

                  {q.status === 'pending' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleApproveQuestion(q.id)}
                        className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs uppercase tracking-wider flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleRejectQuestion(q.id)}
                        className="px-3 py-1 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs uppercase tracking-wider flex items-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  )}
                </div>

                <p className="font-medium text-slate-200 text-sm leading-relaxed">{q.question}</p>

                {q.options && (
                  <div className="grid grid-cols-2 gap-2 text-slate-400">
                    {q.options.map((opt, i) => (
                      <div key={i} className={`p-2.5 rounded-xl bg-[#161922] border border-[#1F2430] ${opt === q.correctAnswer ? 'text-emerald-400 font-medium border-emerald-500/30' : ''}`}>
                        {String.fromCharCode(65 + i)}. {opt}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Question Generator Tab */}
      {activeTab === 'ai_gen' && (
        <div className="bg-[#161922] border border-[#1F2430] rounded-3xl p-6 sm:p-8 max-w-2xl mx-auto space-y-6">
          <div>
            <h2 className="editorial-serif text-2xl font-normal text-slate-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Batch AI Question Generator
            </h2>
            <p className="text-xs text-slate-400 mt-1 font-light">
              Generate structured questions using Gemini 2.5 Flash for placement tests.
            </p>
          </div>

          <form onSubmit={handleRunAiGenerator} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-normal mb-1">Company (Optional)</label>
              <input
                type="text"
                placeholder="e.g. TCS, Amazon, Google..."
                value={genCompany}
                onChange={(e) => setGenCompany(e.target.value)}
                className="w-full bg-[#0F1117] border border-[#1F2430] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-normal mb-1">Category</label>
                <select
                  value={genCategory}
                  onChange={(e) => setGenCategory(e.target.value)}
                  className="w-full bg-[#0F1117] border border-[#1F2430] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Aptitude">Aptitude</option>
                  <option value="Technical">Technical</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-normal mb-1">Topic</label>
                <input
                  type="text"
                  value={genTopic}
                  onChange={(e) => setGenTopic(e.target.value)}
                  className="w-full bg-[#0F1117] border border-[#1F2430] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-normal mb-1">Difficulty</label>
                <select
                  value={genDifficulty}
                  onChange={(e) => setGenDifficulty(e.target.value)}
                  className="w-full bg-[#0F1117] border border-[#1F2430] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-normal mb-1">Question Count</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={genCount}
                  onChange={(e) => setGenCount(Number(e.target.value))}
                  className="w-full bg-[#0F1117] border border-[#1F2430] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-medium text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20 disabled:opacity-40"
            >
              {isGenerating ? 'Generating Questions with Gemini AI...' : 'Generate Questions'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
