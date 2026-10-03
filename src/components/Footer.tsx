import React from 'react';
import { Brain, ShieldCheck, Globe, Sparkles, BriefcaseBusiness, Heart } from 'lucide-react';

export const Footer: React.FC<{ onNavigate: (view: string) => void }> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#0B0D12] border-t border-[#1F2430] text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center">
              <Brain className="w-4 h-4 text-indigo-400" />
            </div>
            <span className="editorial-serif font-bold text-lg text-slate-100">PrepMatrix AI</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Editorial AI-powered placement preparation platform helping students master tier-1 recruitment assessments, company mock tests, aptitude, and technical interviews.
          </p>
          <div className="flex items-center gap-3 text-slate-500">
            <Globe className="w-4 h-4 hover:text-slate-200 cursor-pointer transition-colors" />
            <Sparkles className="w-4 h-4 hover:text-slate-200 cursor-pointer transition-colors" />
            <BriefcaseBusiness className="w-4 h-4 hover:text-slate-200 cursor-pointer transition-colors" />
          </div>
        </div>

        <div>
          <h4 className="text-[11px] font-semibold uppercase tracking-widest text-slate-300 mb-3 font-sans">Platform</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => onNavigate('companies')} className="hover:text-slate-200 transition-colors">
                Company Mock Tests
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('practice')} className="hover:text-slate-200 transition-colors">
                Aptitude & Reasoning
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('interview')} className="hover:text-slate-200 transition-colors">
                AI Mock Interview
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('daily')} className="hover:text-slate-200 transition-colors">
                Daily Placement Challenge
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-[11px] font-semibold uppercase tracking-widest text-slate-300 mb-3 font-sans">Top Companies</h4>
          <ul className="space-y-2 text-xs">
            <li>TCS NQT Prep</li>
            <li>Infosys Specialist Programmer</li>
            <li>Accenture Cognitive Test</li>
            <li>Amazon SDE Mock Drive</li>
            <li>Google Coding Challenge</li>
          </ul>
        </div>

        <div>
          <h4 className="text-[11px] font-semibold uppercase tracking-widest text-slate-300 mb-3 font-sans">AI Intelligence</h4>
          <p className="text-xs text-slate-400 leading-relaxed mb-3">
            Questions and evaluations are generated using Gemini models and structured for career readiness.
          </p>
          <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/20 border border-emerald-800/30 p-2.5 rounded-lg">
            <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>AI Feedback for placement preparation only.</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-[#1F2430] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <div>© 2026 PrepMatrix AI. Built for placement success.</div>
        <div className="flex items-center gap-6">
          <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
          <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
          <span className="hover:text-slate-400 cursor-pointer">AI Policy</span>
        </div>
      </div>
    </footer>
  );
};
