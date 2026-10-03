import React, { useState, useEffect } from 'react';
import {
  Building2,
  Search,
  CheckCircle2,
  Clock,
  HelpCircle,
  Play,
  ArrowLeft,
  Briefcase,
  Layers,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { Company, TestConfig } from '../types';
import { fetchCompaniesApi, fetchTestsApi } from '../services/api';

interface CompanyPrepProps {
  selectedCompanyId?: string;
  onBack: () => void;
  onStartTest: (testId: string) => void;
  onStartInterview: (companyName: string) => void;
}

export const CompanyPrep: React.FC<CompanyPrepProps> = ({
  selectedCompanyId,
  onBack,
  onStartTest,
  onStartInterview,
}) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [tests, setTests] = useState<TestConfig[]>([]);
  const [activeCompany, setActiveCompany] = useState<Company | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [cmpList, testList] = await Promise.all([fetchCompaniesApi(), fetchTestsApi()]);
        setCompanies(cmpList);
        setTests(testList);

        if (selectedCompanyId) {
          const match = cmpList.find((c) => c.id === selectedCompanyId);
          if (match) setActiveCompany(match);
        }
      } catch (err) {
        console.error('Error loading company data:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [selectedCompanyId]);

  const filteredCompanies = companies.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.jobRoles.some((r) => r.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDiff = selectedDifficulty === 'All' || c.difficulty === selectedDifficulty;
    return matchesSearch && matchesDiff;
  });

  if (activeCompany) {
    const companyTests = tests.filter((t) => t.companyId === activeCompany.id);

    return (
      <div className="min-h-screen bg-[#0F1117] text-slate-100 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans">
        {/* Back Button */}
        <button
          onClick={() => setActiveCompany(null)}
          className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-slate-400 hover:text-slate-200 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Company Directory</span>
        </button>

        {/* Company Header Banner */}
        <div className="bg-[#161922] border border-[#1F2430] rounded-3xl p-6 sm:p-8 mb-8 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#1F2430] border border-[#2D3342] p-2 overflow-hidden shrink-0">
                <img
                  src={activeCompany.logo}
                  alt={activeCompany.name}
                  className="w-full h-full object-cover rounded-xl"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="editorial-serif text-2xl sm:text-4xl font-normal text-slate-100">{activeCompany.name}</h1>
                  <span
                    className={`text-[10px] font-medium uppercase tracking-wider px-3 py-0.5 rounded-full ${
                      activeCompany.difficulty === 'Hard'
                        ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                        : activeCompany.difficulty === 'Medium'
                        ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                        : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                    }`}
                  >
                    {activeCompany.difficulty} Difficulty
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1.5">{activeCompany.industry} • {activeCompany.applicantCount.toLocaleString()} Candidates Practicing</p>
                <p className="text-sm text-slate-300 mt-3 leading-relaxed max-w-3xl font-light">
                  {activeCompany.description}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button
                onClick={() => onStartInterview(activeCompany.name)}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>AI Interview</span>
              </button>
            </div>
          </div>
        </div>

        {/* Recruitment Pattern Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          {/* Rounds */}
          <div className="bg-[#161922] border border-[#1F2430] rounded-2xl p-6">
            <h3 className="text-[11px] font-semibold text-slate-300 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              Recruitment Rounds
            </h3>
            <ol className="space-y-3 text-xs">
              {activeCompany.placementPattern.rounds.map((round, idx) => (
                <li key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-[#0F1117] border border-[#1F2430]">
                  <span className="w-6 h-6 rounded-lg bg-indigo-500/10 text-indigo-300 font-semibold text-xs flex items-center justify-center shrink-0 border border-indigo-500/20">
                    {idx + 1}
                  </span>
                  <span className="text-slate-200 font-normal">{round}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Aptitude Topics */}
          <div className="bg-[#161922] border border-[#1F2430] rounded-2xl p-6">
            <h3 className="text-[11px] font-semibold text-slate-300 uppercase tracking-widest mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              Key Aptitude Topics
            </h3>
            <div className="flex flex-wrap gap-2 text-xs">
              {activeCompany.placementPattern.aptitudeTopics.map((topic, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>

          {/* Technical Topics */}
          <div className="bg-[#161922] border border-[#1F2430] rounded-2xl p-6">
            <h3 className="text-[11px] font-semibold text-slate-300 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-cyan-400" />
              Technical & Coding Focus
            </h3>
            <div className="flex flex-wrap gap-2 text-xs">
              {activeCompany.placementPattern.technicalTopics.map((topic, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-medium"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Company Mock Tests */}
        <div className="bg-[#161922] border border-[#1F2430] rounded-2xl p-6">
          <h2 className="editorial-serif text-2xl font-normal text-slate-100 mb-6">Company Mock Tests</h2>

          {companyTests.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              <p>No specific pre-built tests available yet for this company.</p>
              <button
                onClick={() => onStartTest('tst_tcs_nqt')}
                className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white font-medium uppercase tracking-wider"
              >
                Attempt General Placement Test
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {companyTests.map((t) => (
                <div
                  key={t.id}
                  className="p-5 rounded-2xl bg-[#0F1117] border border-[#1F2430] hover:border-indigo-500/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-medium uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                        {t.category}
                      </span>
                      <span className="text-xs text-slate-400 font-normal flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        {t.durationMinutes} mins
                      </span>
                    </div>

                    <h3 className="editorial-serif text-lg font-normal text-slate-100 mt-2">{t.title}</h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed font-light">
                      {t.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-1.5 text-[11px] text-slate-400">
                      {t.topics.map((top, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-[#161922] border border-[#1F2430]">
                          {top}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#1F2430] flex items-center justify-between">
                    <span className="text-xs text-slate-400">{t.questionCount} Questions</span>
                    <button
                      onClick={() => onStartTest(t.id)}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/20"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Start Test</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F1117] text-slate-100 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="mb-10">
        <div className="text-[11px] font-semibold uppercase tracking-widest text-indigo-400 mb-1">
          Corporate Assessment Library
        </div>
        <h1 className="editorial-serif text-3xl sm:text-4xl font-normal text-slate-100">Company Preparation Hub</h1>
        <p className="text-sm text-slate-400 mt-1.5 font-light">
          Select target companies to practice tailored exam patterns, syllabus breakdowns, and AI interviews.
        </p>
      </div>

      {/* Search & Difficulty Filter Bar */}
      <div className="bg-[#161922] border border-[#1F2430] rounded-2xl p-4 mb-8 flex flex-col sm:flex-row items-center gap-4 justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search company (e.g., TCS, Amazon, Google)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0F1117] border border-[#1F2430] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 text-xs">
          <span className="text-slate-400 font-normal">Difficulty:</span>
          {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${
                selectedDifficulty === diff
                  ? 'bg-indigo-600 text-white'
                  : 'bg-[#0F1117] text-slate-400 hover:text-white border border-[#1F2430]'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCompanies.map((comp) => (
          <div
            key={comp.id}
            onClick={() => setActiveCompany(comp)}
            className="group editorial-card editorial-card-interactive rounded-2xl p-6 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#1F2430] border border-[#2D3342] p-1.5 overflow-hidden">
                  <img
                    src={comp.logo}
                    alt={comp.name}
                    className="w-full h-full object-cover rounded-lg"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span
                  className={`text-[10px] font-medium uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                    comp.difficulty === 'Hard'
                      ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                      : comp.difficulty === 'Medium'
                      ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                      : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                  }`}
                >
                  {comp.difficulty}
                </span>
              </div>

              <h3 className="editorial-serif text-xl font-normal text-slate-100 group-hover:text-indigo-300 transition-colors">
                {comp.name}
              </h3>
              <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed font-light">
                {comp.description}
              </p>

              <div className="mt-4 pt-4 border-t border-[#1F2430] space-y-2 text-xs text-slate-400">
                <div className="flex items-center justify-between">
                  <span>Industry:</span>
                  <span className="text-slate-200 font-medium">{comp.industry}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Target Roles:</span>
                  <span className="text-slate-200 font-medium truncate max-w-[160px]">
                    {comp.jobRoles.slice(0, 2).join(', ')}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#1F2430] flex items-center justify-between text-xs">
              <span className="text-indigo-400 font-medium">{comp.testCount} Mock Tests</span>
              <span className="font-medium text-xs uppercase tracking-wider text-slate-300 group-hover:text-indigo-300 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                Explore Pattern →
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
