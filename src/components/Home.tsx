import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Building2,
  ArrowRight,
  Brain,
  CheckCircle2,
  Target,
  BarChart3,
  TrendingUp,
  Zap,
  Users,
  Award,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { Company, TestConfig } from '../types';
import { fetchCompaniesApi, fetchTestsApi } from '../services/api';

interface HomeProps {
  onNavigate: (view: string, extraData?: any) => void;
  onSelectCompany: (companyId: string) => void;
  onStartTest: (testId: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate, onSelectCompany, onStartTest }) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [tests, setTests] = useState<TestConfig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [cmpList, testList] = await Promise.all([fetchCompaniesApi(), fetchTestsApi()]);
        setCompanies(cmpList);
        setTests(testList);
      } catch (err) {
        console.error('Failed loading homepage data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-[#0F1117] text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 glow-indigo pointer-events-none -z-10 opacity-70" />

      {/* Hero Section */}
      <section className="relative pt-20 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#161922] border border-[#2D3342] text-xs font-semibold text-indigo-300 mb-8 shadow-xl">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span className="tracking-wide">AI-Powered Career Intelligence Platform</span>
        </div>

        <h1 className="editorial-serif text-4xl sm:text-6xl lg:text-7xl font-normal tracking-tight max-w-5xl mx-auto leading-[1.1] text-slate-100">
          Master Company Assessments with{' '}
          <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-cyan-300">
            Editorial Precision.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed font-sans font-light">
          Comprehensive company-specific mock tests, technical assessments, aptitude drills, and AI interview evaluations crafted for placement success.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => onNavigate('practice')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs tracking-wider uppercase transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 group"
          >
            <span>Start Practice Drills</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => onNavigate('companies')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#161922] hover:bg-[#1F2430] text-slate-200 border border-[#2D3342] font-medium text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2"
          >
            <Building2 className="w-4 h-4 text-emerald-400" />
            <span>Company Catalog</span>
          </button>
          <button
            onClick={() => onStartTest(tests[0]?.id || 'tst_tcs_nqt')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/40 text-cyan-300 border border-cyan-800/40 font-medium text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>Mock Test Simulation</span>
          </button>
        </div>

        {/* Key Platform Highlights Pills */}
        <div className="mt-16 pt-10 border-t border-[#1F2430] grid grid-cols-2 sm:grid-cols-4 gap-4 text-left max-w-4xl mx-auto">
          <div className="p-4 rounded-xl bg-[#161922] border border-[#1F2430]">
            <div className="editorial-serif text-2xl font-normal text-slate-100">45,000+</div>
            <div className="text-[11px] text-slate-400 mt-1 uppercase tracking-wider font-sans">Active Students</div>
          </div>
          <div className="p-4 rounded-xl bg-[#161922] border border-[#1F2430]">
            <div className="editorial-serif text-2xl font-normal text-indigo-300">120+</div>
            <div className="text-[11px] text-slate-400 mt-1 uppercase tracking-wider font-sans">Company Test Patterns</div>
          </div>
          <div className="p-4 rounded-xl bg-[#161922] border border-[#1F2430]">
            <div className="editorial-serif text-2xl font-normal text-cyan-300">94.8%</div>
            <div className="text-[11px] text-slate-400 mt-1 uppercase tracking-wider font-sans">Mock Accuracy</div>
          </div>
          <div className="p-4 rounded-xl bg-[#161922] border border-[#1F2430]">
            <div className="editorial-serif text-2xl font-normal text-amber-300">15,000+</div>
            <div className="text-[11px] text-slate-400 mt-1 uppercase tracking-wider font-sans">AI Interviews</div>
          </div>
        </div>
      </section>

      {/* Database-Driven Popular Companies */}
      <section className="py-20 bg-[#0B0D12] border-y border-[#1F2430]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-widest text-indigo-400 mb-2 font-sans">
                Recruitment Matrices
              </div>
              <h2 className="editorial-serif text-3xl sm:text-4xl font-normal text-slate-100">Featured Placement Drives</h2>
              <p className="text-sm text-slate-400 mt-2 font-sans font-light max-w-xl">
                Practice exact assessment blueprints, technical cut-offs, and company-specific selection parameters.
              </p>
            </div>
            <button
              onClick={() => onNavigate('companies')}
              className="mt-4 md:mt-0 text-xs font-semibold uppercase tracking-wider text-indigo-400 hover:text-indigo-300 flex items-center gap-1 group"
            >
              <span>Explore All Companies</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.slice(0, 6).map((comp) => (
              <div
                key={comp.id}
                onClick={() => onSelectCompany(comp.id)}
                className="group relative editorial-card editorial-card-interactive rounded-2xl p-6 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-[#1F2430] overflow-hidden border border-[#2D3342] flex items-center justify-center p-1">
                      <img
                        src={comp.logo}
                        alt={comp.name}
                        className="w-full h-full object-cover rounded-lg"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <span
                      className={`text-[10px] font-medium uppercase tracking-wider px-2.5 py-1 rounded-full ${
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
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed font-sans font-light">
                    {comp.description}
                  </p>

                  <div className="mt-5 pt-4 border-t border-[#1F2430] space-y-2 text-xs font-sans">
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-slate-500">Roles:</span>
                      <span className="font-medium text-slate-200 truncate max-w-[180px]">
                        {comp.jobRoles.slice(0, 2).join(', ')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-slate-500">Structure:</span>
                      <span className="font-medium text-emerald-400">
                        {comp.placementPattern.rounds.length} Assessment Rounds
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between pt-4 border-t border-[#1F2430]">
                  <span className="text-xs text-slate-400">{comp.testCount} Practice Sets</span>
                  <span className="text-xs font-medium uppercase tracking-wider text-indigo-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Prepare →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Test Categories Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-cyan-400 mb-2 font-sans">
            Domain Specializations
          </div>
          <h2 className="editorial-serif text-3xl sm:text-4xl font-normal text-slate-100">Structured Preparation Arenas</h2>
          <p className="text-sm text-slate-400 mt-2 font-sans font-light">
            Focus on individual skill verticals or attempt full simulated recruitment drives.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div
            onClick={() => onNavigate('practice', { topic: 'Quantitative Aptitude' })}
            className="p-6 rounded-2xl bg-[#161922] border border-[#1F2430] hover:border-indigo-500/40 transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="editorial-serif text-lg font-normal text-slate-100 group-hover:text-indigo-300">Aptitude Arena</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed font-sans font-light">
              Quantitative Math, Logical Reasoning, Verbal Ability, Data Interpretation, and Puzzles.
            </p>
            <div className="mt-5 text-xs font-medium uppercase tracking-wider text-indigo-400 flex items-center gap-1">
              Practice Aptitude →
            </div>
          </div>

          <div
            onClick={() => onNavigate('practice', { topic: 'Java' })}
            className="p-6 rounded-2xl bg-[#161922] border border-[#1F2430] hover:border-cyan-500/40 transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Brain className="w-5 h-5" />
            </div>
            <h3 className="editorial-serif text-lg font-normal text-slate-100 group-hover:text-cyan-300">Technical Concepts</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed font-sans font-light">
              Core C, C++, Java, Python, SQL, DBMS, OS, Computer Networks, and Data Structures.
            </p>
            <div className="mt-5 text-xs font-medium uppercase tracking-wider text-cyan-400 flex items-center gap-1">
              Practice Technical →
            </div>
          </div>

          <div
            onClick={() => onNavigate('interview')}
            className="p-6 rounded-2xl bg-[#161922] border border-[#1F2430] hover:border-purple-500/40 transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="editorial-serif text-lg font-normal text-slate-100 group-hover:text-purple-300">AI Mock Interview</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed font-sans font-light">
              Real-time conversational voice/text AI HR & Technical interviews with instant scorecard feedback.
            </p>
            <div className="mt-5 text-xs font-medium uppercase tracking-wider text-purple-400 flex items-center gap-1">
              Launch Interview →
            </div>
          </div>

          <div
            onClick={() => onNavigate('daily')}
            className="p-6 rounded-2xl bg-[#161922] border border-[#1F2430] hover:border-amber-500/40 transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="editorial-serif text-lg font-normal text-slate-100 group-hover:text-amber-300">Daily Challenge</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed font-sans font-light">
              5 daily questions (Math, Technical, Logical, HR) to maintain streak and climb leaderboard.
            </p>
            <div className="mt-5 text-xs font-medium uppercase tracking-wider text-amber-400 flex items-center gap-1">
              Attempt Challenge →
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Banner */}
      <section className="py-20 bg-[#0B0D12] border-t border-[#1F2430]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-medium mb-5 border border-indigo-500/20 uppercase tracking-widest">
              <Brain className="w-3.5 h-3.5 text-indigo-400" />
              <span>AI Performance Diagnostics</span>
            </div>
            <h2 className="editorial-serif text-3xl sm:text-4xl font-normal text-slate-100 leading-snug">
              Deep Performance Insights After Every Assessment
            </h2>
            <p className="text-slate-400 text-sm mt-4 leading-relaxed font-sans font-light">
              Our Gemini-powered evaluation engine breaks down your performance into strengths, critical weaknesses, topic-by-topic accuracy rates, and generates a personalized placement preparation roadmap.
            </p>

            <ul className="mt-8 space-y-3 text-xs text-slate-300 font-sans">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Automatic detection of math, logical, and coding knowledge gaps</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Step-by-step explanations and correct approach for every question</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Placement Readiness Index calculation for target company requirements</span>
              </li>
            </ul>

            <button
              onClick={() => onNavigate('dashboard')}
              className="mt-8 px-7 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs tracking-wider uppercase transition-all shadow-lg shadow-indigo-600/20"
            >
              View Student Dashboard Demo
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-[#161922] border border-[#1F2430] shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-[#1F2430] mb-5">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">AI Readiness Card</span>
            </div>

            <div className="space-y-4 text-xs font-sans">
              <div className="p-4 rounded-xl bg-[#0F1117] border border-[#1F2430]">
                <div className="flex items-center justify-between text-slate-300 font-medium mb-2">
                  <span>Placement Readiness Score</span>
                  <span className="text-emerald-400 font-semibold">78% Ready</span>
                </div>
                <div className="w-full bg-[#1F2430] h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full w-[78%]" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0F1117] border border-[#1F2430]">
                <div className="text-slate-400 font-medium mb-1.5 uppercase text-[10px] tracking-wider">AI Diagnostic Recommendation</div>
                <p className="text-slate-300 editorial-serif italic text-sm leading-relaxed">
                  «"Quantitative accuracy is strong (83%), but time complexity questions in Data Structures require practice. Attempt 10 medium-level Tree questions next."»
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
