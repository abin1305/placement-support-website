import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Award,
  Zap,
  TrendingUp,
  Brain,
  CheckCircle2,
  Clock,
  Flame,
  ArrowRight,
  BookOpen,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { TestAttempt } from '../types';
import { fetchUserAttemptsApi, fetchRoadmapApi } from '../services/api';

interface StudentDashboardProps {
  onNavigate: (view: string, extraData?: any) => void;
  onViewAttemptResult: (attemptId: string) => void;
  onOpenProfile: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onNavigate,
  onViewAttemptResult,
  onOpenProfile,
}) => {
  const { user } = useAuth();
  const [attempts, setAttempts] = useState<TestAttempt[]>([]);
  const [roadmap, setRoadmap] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStudentData() {
      if (!user) return;
      try {
        const [attList, rdmap] = await Promise.all([
          fetchUserAttemptsApi(user.id),
          fetchRoadmapApi(user.id),
        ]);
        setAttempts(attList);
        setRoadmap(rdmap.roadmap || []);
      } catch (err) {
        console.error('Error loading dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStudentData();
  }, [user]);

  if (!user) return null;

  const avgScore = attempts.length
    ? Math.round(attempts.reduce((a, b) => a + b.score, 0) / attempts.length)
    : 80;
  const avgAccuracy = attempts.length
    ? Math.round(attempts.reduce((a, b) => a + b.accuracy, 0) / attempts.length)
    : 83;

  return (
    <div className="min-h-screen bg-[#0F1117] text-slate-100 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans">
      {/* Welcome Banner */}
      <div className="bg-[#161922] border border-[#1F2430] rounded-3xl p-6 sm:p-8 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-[#1F2430] border border-[#2D3342] p-[2px] shadow-lg">
            <div className="w-full h-full bg-[#0F1117] rounded-[14px] flex items-center justify-center font-normal editorial-serif text-2xl text-slate-100">
              {user.fullName.charAt(0)}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="editorial-serif text-2xl sm:text-3xl font-normal text-slate-100">Welcome back, {user.fullName}!</h1>
              <div className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] font-medium uppercase tracking-wider flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span>{user.streakDays}-Day Streak</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-light">
              {user.college || 'Engineering Student'} • {user.branch || 'CSE'} ({user.degree || 'B.Tech'})
            </p>
          </div>
        </div>

        <button
          onClick={onOpenProfile}
          className="px-4 py-2 rounded-xl bg-[#0F1117] hover:bg-[#1F2430] text-slate-300 text-xs font-medium uppercase tracking-wider transition-colors border border-[#1F2430]"
        >
          Edit Profile & Resume ({user.profileCompletion}% Complete)
        </button>
      </div>

      {/* Placement Readiness Index Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* Readiness Card */}
        <div className="editorial-card rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-widest">
                Placement Readiness Index
              </span>
              <span className="text-xs text-emerald-400 font-medium">High Potential</span>
            </div>

            <div className="editorial-serif text-5xl font-normal text-slate-100 mb-2">{user.readinessScore}%</div>

            {/* Progress Bar */}
            <div className="w-full bg-[#0F1117] h-2.5 rounded-full overflow-hidden border border-[#1F2430] mb-6">
              <div
                className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 h-full rounded-full transition-all duration-1000"
                style={{ width: `${user.readinessScore}%` }}
              />
            </div>

            {/* Sub-breakdown */}
            <div className="space-y-2.5 text-xs font-light">
              <div className="flex justify-between text-slate-300">
                <span>Quantitative Aptitude</span>
                <span className="font-medium text-emerald-400">82%</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Technical Concepts</span>
                <span className="font-medium text-indigo-400">75%</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Hands-on Coding</span>
                <span className="font-medium text-amber-400">68%</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Communication & HR</span>
                <span className="font-medium text-cyan-400">84%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Core Stats Grid */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#161922] border border-[#1F2430] flex flex-col justify-between">
            <span className="text-xs text-slate-400 font-light">Tests Completed</span>
            <div className="editorial-serif text-3xl font-normal text-slate-100 mt-2">{attempts.length || 1}</div>
            <span className="text-[10px] text-emerald-400 mt-2 font-medium">+2 this week</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#161922] border border-[#1F2430] flex flex-col justify-between">
            <span className="text-xs text-slate-400 font-light">Average Score</span>
            <div className="editorial-serif text-3xl font-normal text-indigo-300 mt-2">{avgScore}%</div>
            <span className="text-[10px] text-slate-500 mt-2">Target: 85%+</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#161922] border border-[#1F2430] flex flex-col justify-between">
            <span className="text-xs text-slate-400 font-light">Average Accuracy</span>
            <div className="editorial-serif text-3xl font-normal text-emerald-300 mt-2">{avgAccuracy}%</div>
            <span className="text-[10px] text-emerald-400 mt-2 font-medium">Strong Precision</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#161922] border border-[#1F2430] flex flex-col justify-between">
            <span className="text-xs text-slate-400 font-light">Strongest Topic</span>
            <div className="editorial-serif text-lg font-normal text-amber-300 mt-2 truncate">Percentages</div>
            <span className="text-[10px] text-slate-500 mt-2">100% Accuracy</span>
          </div>
        </div>
      </div>

      {/* 7-Day Personalized AI Placement Roadmap */}
      <div className="bg-[#161922] border border-[#1F2430] rounded-3xl p-6 sm:p-8 mb-10">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="editorial-serif text-2xl font-normal text-slate-100">7-Day AI Personal Roadmap</h2>
            <p className="text-xs text-slate-400 mt-0.5 font-light">Adaptively tailored to strengthen your weak topics.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {roadmap.slice(0, 4).map((day: any) => (
            <div key={day.day} className="p-4 rounded-2xl bg-[#0F1117] border border-[#1F2430]">
              <div className="flex items-center justify-between text-[11px] font-medium uppercase tracking-wider text-indigo-400 mb-2">
                <span>Day {day.day} Focus</span>
                <span className="text-[10px] text-slate-500 font-normal">{day.estimatedHours}h est</span>
              </div>
              <h3 className="editorial-serif text-base font-normal text-slate-100 leading-snug">{day.focus}</h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed font-light">{day.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Test History */}
      <div className="bg-[#161922] border border-[#1F2430] rounded-3xl p-6 sm:p-8">
        <h2 className="editorial-serif text-2xl font-normal text-slate-100 mb-6">Recent Attempted Tests</h2>

        {attempts.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs font-light">
            <p>No tests attempted yet. Take a mock test to view performance analytics!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {attempts.map((att) => (
              <div
                key={att.id}
                onClick={() => onViewAttemptResult(att.id)}
                className="p-4 rounded-2xl bg-[#0F1117] border border-[#1F2430] hover:border-indigo-500/40 transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div>
                  <h3 className="editorial-serif text-base font-normal text-slate-100">{att.testTitle}</h3>
                  <p className="text-xs text-slate-400 mt-0.5 font-light">
                    Category: {att.category} • Accuracy: {att.accuracy}% • Time: {Math.round(att.timeSpentSeconds / 60)} mins
                  </p>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                  <span className="text-sm font-semibold text-emerald-400">{att.score} / 100</span>
                  <span className="text-xs text-indigo-400 font-medium uppercase tracking-wider flex items-center gap-1">
                    View AI Report →
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
