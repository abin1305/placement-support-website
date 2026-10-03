import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './components/Home';
import { CompanyPrep } from './components/CompanyPrep';
import { PracticeArena } from './components/PracticeArena';
import { TestArena } from './components/TestArena';
import { TestResultView } from './components/TestResultView';
import { AiInterview } from './components/AiInterview';
import { DailyChallenge } from './components/DailyChallenge';
import { StudentDashboard } from './components/StudentDashboard';
import { AdminPanel } from './components/AdminPanel';
import { StudentProfileModal } from './components/StudentProfileModal';

const AuthScreen: React.FC<{
  onSwitchMode: (mode: 'login' | 'register') => void;
  mode: 'login' | 'register';
  onSubmit: (data: any) => Promise<void>;
}> = ({ onSwitchMode, mode, onSubmit }) => {
  const [form, setForm] = useState({
    fullName: '',
    email: 'student@prepmatrix.com',
    password: '',
    role: 'student' as 'student' | 'admin',
    college: '',
  });
  const [error, setError] = useState('');

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    if (mode === 'register' && !form.fullName.trim()) {
      setError('Please enter your full name to create an account.');
      return;
    }

    await onSubmit({ ...form, email: form.email.trim() });
  };

  return (
    <div className="min-h-screen bg-[#0F1117] flex items-center justify-center p-6">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 overflow-hidden rounded-[32px] border border-[#2D3342] bg-[#161922] shadow-[0_25px_80px_rgba(0,0,0,0.35)]">
        <div className="bg-gradient-to-br from-indigo-600 via-violet-600 to-cyan-500 p-10 text-white">
          <div className="mb-8 flex items-center gap-3">
            <div className="rounded-2xl bg-white/15 p-3 backdrop-blur-sm">
              <span className="text-2xl">💼</span>
            </div>
            <div>
              <div className="text-2xl font-bold">PrepMatrix AI</div>
              <div className="text-xs uppercase tracking-[0.22em] text-indigo-100">Placement Intelligence</div>
            </div>
          </div>

          <h1 className="text-4xl font-bold leading-tight mb-4">Your placement journey starts here.</h1>
          <p className="text-indigo-100 text-base leading-7 max-w-md">
            Log in or create an account to access aptitude practice, mock tests, interview drills, dashboards, and admin tools.
          </p>

          <div className="mt-10 space-y-4 text-sm text-indigo-50">
            <div className="flex items-center gap-3"><span>✓</span> Student dashboard and progress tracking</div>
            <div className="flex items-center gap-3"><span>✓</span> Company-specific mock tests</div>
            <div className="flex items-center gap-3"><span>✓</span> AI interview and performance analytics</div>
          </div>
        </div>

        <div className="p-8 sm:p-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="text-sm uppercase tracking-[0.18em] text-slate-400">Access portal</div>
              <h2 className="text-3xl font-bold text-slate-100 mt-2">
                {mode === 'login' ? 'Welcome back' : 'Create account'}
              </h2>
            </div>
            <div className="flex rounded-xl border border-[#2D3342] bg-[#0F1117] p-1">
              <button
                type="button"
                onClick={() => onSwitchMode('login')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium ${mode === 'login' ? 'bg-[#262B3A] text-white shadow-sm' : 'text-slate-400'}`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => onSwitchMode('register')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium ${mode === 'register' ? 'bg-[#262B3A] text-white shadow-sm' : 'text-slate-400'}`}
              >
                Register
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-sm text-slate-300 mb-1">Full name</label>
                <input
                  value={form.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  className="w-full rounded-xl border border-[#2D3342] bg-[#0F1117] px-3 py-3 text-white outline-none transition focus:border-indigo-500"
                  placeholder="Your full name"
                />
              </div>
            )}

            <div>
              <label className="block text-sm text-slate-300 mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full rounded-xl border border-[#2D3342] bg-[#0F1117] px-3 py-3 text-white outline-none transition focus:border-indigo-500"
                placeholder="name@example.com"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-1">Role</label>
              <select
                value={form.role}
                onChange={(e) => handleChange('role', e.target.value)}
                className="w-full rounded-xl border border-[#2D3342] bg-[#0F1117] px-3 py-3 text-white outline-none transition focus:border-indigo-500"
              >
                <option value="student">Student</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-sm text-slate-300 mb-1">College / Institution</label>
                <input
                  value={form.college}
                  onChange={(e) => handleChange('college', e.target.value)}
                  className="w-full rounded-xl border border-[#2D3342] bg-[#0F1117] px-3 py-3 text-white outline-none transition focus:border-indigo-500"
                  placeholder="Ex: NIT Trichy"
                />
              </div>
            )}

            <div>
              <label className="block text-sm text-slate-300 mb-1">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => handleChange('password', e.target.value)}
                className="w-full rounded-xl border border-[#2D3342] bg-[#0F1117] px-3 py-3 text-white outline-none transition focus:border-indigo-500"
                placeholder="Enter password"
              />
            </div>

            {error && <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>}

            <button
              type="submit"
              className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-base font-semibold text-white transition hover:bg-indigo-500"
            >
              {mode === 'login' ? 'Login to dashboard' : 'Create account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export const AppContent: React.FC = () => {
  const { user, login, register, logout, role } = useAuth();
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | undefined>(undefined);
  const [activeTestId, setActiveTestId] = useState<string | null>(null);
  const [activeAttemptId, setActiveAttemptId] = useState<string | null>(null);
  const [practiceTopic, setPracticeTopic] = useState<string | undefined>(undefined);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const handleNavigate = (view: string, extraData?: any) => {
    if (extraData?.companyId) setSelectedCompanyId(extraData.companyId);
    if (extraData?.topic) setPracticeTopic(extraData.topic);
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartTest = (testId: string) => {
    setActiveTestId(testId);
    setCurrentView('arena');
  };

  const handleFinishTest = (attemptId: string) => {
    setActiveAttemptId(attemptId);
    setActiveTestId(null);
    setCurrentView('result');
  };

  const handleSelectCompany = (companyId: string) => {
    setSelectedCompanyId(companyId);
    setCurrentView('companies');
  };

  const handleAuthSubmit = async (data: any) => {
    if (authMode === 'login') {
      await login(data.email, data.role);
      setCurrentView(data.role === 'admin' ? 'admin' : 'dashboard');
      return;
    }

    await register({
      fullName: data.fullName,
      email: data.email,
      phone: '+1 000 000 0000',
      role: data.role,
      college: data.college || 'Demo College',
      skills: ['Problem Solving'],
      preferredRoles: ['Software Engineer'],
      preferredCompanies: ['TCS'],
      profileCompletion: 60,
      streakDays: 1,
      readinessScore: 60,
      degree: 'B.Tech',
      branch: 'Computer Science',
      createdAt: new Date().toISOString(),
    });

    setCurrentView(data.role === 'admin' ? 'admin' : 'dashboard');
  };

  if (!user) {
    return (
      <AuthScreen
        mode={authMode}
        onSwitchMode={setAuthMode}
        onSubmit={handleAuthSubmit}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0F1117] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {currentView !== 'arena' && (
        <Navbar
          currentView={currentView}
          onNavigate={handleNavigate}
          onOpenProfile={() => setIsProfileOpen(true)}
          onOpenAuth={() => {
            logout();
            setCurrentView('home');
          }}
        />
      )}

      <main className="flex-1">
        {currentView === 'home' && (
          <Home
            onNavigate={handleNavigate}
            onSelectCompany={handleSelectCompany}
            onStartTest={handleStartTest}
          />
        )}

        {currentView === 'companies' && (
          <CompanyPrep
            selectedCompanyId={selectedCompanyId}
            onBack={() => handleNavigate('home')}
            onStartTest={handleStartTest}
            onStartInterview={() => {
              handleNavigate('interview');
            }}
          />
        )}

        {currentView === 'practice' && <PracticeArena initialTopic={practiceTopic} />}

        {currentView === 'interview' && (
          <AiInterview onBackToDashboard={() => handleNavigate(role === 'admin' ? 'admin' : 'dashboard')} />
        )}

        {currentView === 'daily' && <DailyChallenge />}

        {currentView === 'dashboard' && (
          <StudentDashboard
            onNavigate={handleNavigate}
            onViewAttemptResult={(attemptId) => {
              setActiveAttemptId(attemptId);
              setCurrentView('result');
            }}
            onOpenProfile={() => setIsProfileOpen(true)}
          />
        )}

        {currentView === 'admin' && <AdminPanel />}

        {currentView === 'arena' && activeTestId && (
          <TestArena
            testId={activeTestId}
            onFinishTest={handleFinishTest}
            onCancel={() => handleNavigate('dashboard')}
          />
        )}

        {currentView === 'result' && activeAttemptId && (
          <TestResultView
            attemptId={activeAttemptId}
            onBackToDashboard={() => handleNavigate('dashboard')}
            onRetakeTest={() => {
              if (activeTestId) handleStartTest(activeTestId);
              else handleNavigate('companies');
            }}
          />
        )}
      </main>

      <StudentProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />

      {currentView !== 'arena' && <Footer onNavigate={handleNavigate} />}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
