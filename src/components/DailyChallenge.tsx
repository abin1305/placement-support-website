import React, { useState, useEffect } from 'react';
import {
  Flame,
  Award,
  CheckCircle2,
  Trophy,
  Brain,
  Zap,
  Shield,
  Eye,
  EyeOff,
} from 'lucide-react';
import { LeaderboardEntry } from '../types';
import { fetchLeaderboardApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const DailyChallenge: React.FC = () => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [completedToday, setCompletedToday] = useState(false);
  const [hidePublicProfile, setHidePublicProfile] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const sampleQuestions = [
    {
      q: 'A train 150m long passes a pole in 15 seconds. What is the speed of the train in km/hr?',
      opts: ['36 km/hr', '40 km/hr', '30 km/hr', '45 km/hr'],
      ans: '36 km/hr',
    },
    {
      q: 'Which data structure follows the Last In First Out (LIFO) property?',
      opts: ['Queue', 'Stack', 'Array', 'LinkedList'],
      ans: 'Stack',
    },
    {
      q: 'In SQL, which clause is used to sort the result set in ascending or descending order?',
      opts: ['GROUP BY', 'HAVING', 'ORDER BY', 'SORT BY'],
      ans: 'ORDER BY',
    },
  ];

  const [answers, setAnswers] = useState<Record<number, string>>({});

  useEffect(() => {
    async function loadLeaderboard() {
      try {
        const list = await fetchLeaderboardApi();
        setLeaderboard(list);
      } catch (err) {
        console.error(err);
      }
    }
    loadLeaderboard();
  }, []);

  const handleSelect = (index: number, option: string) => {
    setAnswers((prev) => ({ ...prev, [index]: option }));
  };

  const submitChallenge = () => {
    setCompletedToday(true);
  };

  return (
    <div className="min-h-screen bg-[#0F1117] text-slate-100 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Daily Challenge Quiz */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#161922] border border-[#1F2430] rounded-3xl p-6 sm:p-8">
            <div className="flex items-center justify-between mb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-[11px] font-medium border border-amber-500/20 uppercase tracking-widest">
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span>Daily Placement Streak</span>
              </div>
              <span className="text-xs text-slate-400 font-normal">{user?.streakDays || 6} Days Streak</span>
            </div>

            <h1 className="editorial-serif text-2xl sm:text-3xl font-normal text-slate-100">Daily Placement Challenge</h1>
            <p className="text-xs text-slate-400 mt-1.5 font-light">
              Solve 3 quick questions daily to earn streak points and boost your readiness index.
            </p>
          </div>

          {!completedToday ? (
            <div className="bg-[#161922] border border-[#1F2430] rounded-3xl p-6 sm:p-8 space-y-6">
              {sampleQuestions.map((item, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-[#0F1117] border border-[#1F2430]">
                  <span className="text-[11px] font-semibold text-amber-400 block mb-2 uppercase tracking-wider">Question {idx + 1}</span>
                  <h3 className="text-sm font-medium text-slate-200 mb-4">{item.q}</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                    {item.opts.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleSelect(idx, opt)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          answers[idx] === opt
                            ? 'bg-amber-500/10 border-amber-500/50 text-amber-200 font-medium'
                            : 'bg-[#161922] border-[#1F2430] text-slate-400 hover:text-white'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <button
                onClick={submitChallenge}
                disabled={Object.keys(answers).length < sampleQuestions.length}
                className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-medium text-xs uppercase tracking-wider transition-all disabled:opacity-40 shadow-lg shadow-amber-500/20"
              >
                Submit Daily Challenge
              </button>
            </div>
          ) : (
            <div className="bg-[#161922] border border-[#1F2430] rounded-3xl p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto">
                <Award className="w-8 h-8" />
              </div>
              <h2 className="editorial-serif text-2xl font-normal text-slate-100">Daily Challenge Completed!</h2>
              <p className="text-xs text-slate-400 max-w-md mx-auto font-light leading-relaxed">
                Your 7-day streak has been updated! Come back tomorrow for 3 new placement questions.
              </p>
            </div>
          )}
        </div>

        {/* Right Col: Global Student Leaderboard */}
        <div className="bg-[#161922] border border-[#1F2430] rounded-3xl p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#1F2430] mb-6">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <h2 className="editorial-serif text-xl font-normal text-slate-100">Top Candidates</h2>
              </div>

              <button
                onClick={() => setHidePublicProfile(!hidePublicProfile)}
                title="Toggle public profile visibility"
                className="p-1.5 rounded-lg bg-[#0F1117] text-slate-400 hover:text-white border border-[#1F2430]"
              >
                {hidePublicProfile ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="space-y-3">
              {leaderboard.map((entry) => (
                <div
                  key={entry.rank}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between text-xs ${
                    entry.isCurrentUser
                      ? 'bg-indigo-600/10 border-indigo-500/30 text-white font-medium'
                      : 'bg-[#0F1117] border-[#1F2430] text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-lg font-semibold text-[11px] flex items-center justify-center ${
                        entry.rank === 1
                          ? 'bg-amber-400 text-slate-950'
                          : entry.rank === 2
                          ? 'bg-slate-300 text-slate-950'
                          : entry.rank === 3
                          ? 'bg-amber-700 text-white'
                          : 'bg-[#1F2430] text-slate-400'
                      }`}
                    >
                      {entry.rank}
                    </span>
                    <div>
                      <div className="font-medium">{entry.isCurrentUser && hidePublicProfile ? 'Anonymous You' : entry.fullName}</div>
                      <div className="text-[10px] text-slate-500">{entry.college}</div>
                    </div>
                  </div>

                  <span className="font-medium text-emerald-400">{entry.readinessScore}% Ready</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
