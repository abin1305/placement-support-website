import React, { useState } from 'react';
import {
  Sparkles,
  Building2,
  Brain,
  Award,
  Calendar,
  UserCheck,
  ShieldAlert,
  LogOut,
  Bell,
  Search,
  CheckCircle2,
  BarChart3,
  BookOpen,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenProfile: () => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenProfile,
  onOpenAuth,
}) => {
  const { user, role, switchRole, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: '1', title: 'New Amazon SDE Mock Test', time: '10m ago', unread: true },
    { id: '2', title: '6-Day Practice Streak Achieved! 🔥', time: '2h ago', unread: false },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0F1117]/90 backdrop-blur-xl border-b border-[#1F2430] text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 group focus:outline-none text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/10 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#0F1117] rounded-[11px] flex items-center justify-center">
              <Brain className="w-5 h-5 text-indigo-400 group-hover:text-cyan-300 transition-colors" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold text-lg tracking-tight">
              <span className="editorial-serif font-semibold text-slate-100">PrepMatrix</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 font-semibold border border-indigo-500/30 uppercase tracking-widest">
                AI
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-normal tracking-wide">Placement Intelligence</p>
          </div>
        </button>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-[#161922]/80 p-1 rounded-xl border border-[#1F2430]">
          <button
            onClick={() => onNavigate('home')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentView === 'home'
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#1F2430]/50'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => onNavigate('companies')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              currentView === 'companies'
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#1F2430]/50'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-emerald-400" />
            Companies
          </button>
          <button
            onClick={() => onNavigate('practice')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              currentView === 'practice'
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#1F2430]/50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-sky-400" />
            Aptitude & Technical
          </button>
          <button
            onClick={() => onNavigate('interview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              currentView === 'interview'
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#1F2430]/50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            AI Interview
          </button>
          <button
            onClick={() => onNavigate('daily')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              currentView === 'daily'
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#1F2430]/50'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            Daily Challenge
          </button>
          {role === 'student' && (
            <button
              onClick={() => onNavigate('dashboard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                currentView === 'dashboard'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#1F2430]/50'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
              Dashboard
            </button>
          )}
          {role === 'admin' && (
            <button
              onClick={() => onNavigate('admin')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                currentView === 'admin'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-amber-400 hover:bg-amber-500/10'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              Admin
            </button>
          )}
        </nav>

        {/* Right Section: Role Toggle, Notifications & Profile */}
        <div className="flex items-center gap-3">
          {/* Role Switcher Badge */}
          <button
            onClick={() => {
              const target = role === 'student' ? 'admin' : 'student';
              switchRole(target);
              if (target === 'admin') onNavigate('admin');
              else onNavigate('dashboard');
            }}
            title="Click to toggle between Student & Admin view"
            className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              role === 'admin'
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/25'
                : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${role === 'admin' ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
            {role === 'admin' ? 'Admin Mode' : 'Student Mode'}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-500" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                  <h4 className="text-sm font-semibold text-white">Notifications</h4>
                  <span className="text-xs text-indigo-400 font-medium">2 New</span>
                </div>
                <div className="space-y-2">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-2.5 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors text-xs">
                      <div className="font-semibold text-slate-200">{n.title}</div>
                      <div className="text-[10px] text-slate-400 mt-1">{n.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile or Auth Trigger */}
          {user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenProfile}
                className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-800/70 border border-transparent hover:border-slate-700 transition-all text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-sm text-white shadow-md">
                  {user.fullName.charAt(0)}
                </div>
                <div className="hidden lg:block">
                  <div className="text-xs font-semibold text-slate-200 leading-none">{user.fullName}</div>
                  <div className="text-[10px] text-emerald-600 font-medium mt-0.5">
                    {user.readinessScore}% Readiness
                  </div>
                </div>
              </button>
              <button
                onClick={() => {
                  if (onOpenAuth) onOpenAuth();
                }}
                className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-xs font-medium text-slate-200 hover:bg-slate-700"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-md shadow-indigo-600/30"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
