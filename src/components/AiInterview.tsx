import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Mic,
  MicOff,
  Send,
  Building2,
  CheckCircle2,
  AlertCircle,
  Brain,
  Volume2,
  ArrowRight,
  RotateCcw,
  Award,
  Layers,
} from 'lucide-react';
import { Company, InterviewSession, InterviewTurn } from '../types';
import { fetchCompaniesApi, evaluateInterviewTurnApi, finishInterviewApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const AiInterview: React.FC<{ onBackToDashboard?: () => void }> = ({ onBackToDashboard }) => {
  const { user } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string>('TCS (Tata Consultancy Services)');
  const [selectedRole, setSelectedRole] = useState<string>('Software Development Engineer');
  const [interviewType, setInterviewType] = useState<'HR' | 'Technical' | 'Company'>('Technical');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');

  // Interview state
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [completedReport, setCompletedReport] = useState<InterviewSession | null>(null);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    async function loadCompanies() {
      try {
        const list = await fetchCompaniesApi();
        setCompanies(list);
      } catch (err) {
        console.error(err);
      }
    }
    loadCompanies();
  }, []);

  // Web Speech Recognition setup if supported
  const toggleListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser. Please use text input mode.');
      return;
    }

    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
    } else {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setUserAnswer((prev) => (prev ? prev + ' ' + transcript : transcript));
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
      recognitionRef.current = recognition;
      setIsListening(true);
    }
  };

  const startInterviewSession = () => {
    const initialQuestion =
      interviewType === 'HR'
        ? `Welcome! Let's start the HR interview for ${selectedCompany}. Tell me about yourself and why you're interested in joining us as a ${selectedRole}.`
        : interviewType === 'Technical'
        ? `Welcome! Let's evaluate your technical skills for ${selectedCompany} (${selectedRole}). Can you explain the difference between a Process and a Thread, and how memory is allocated for each?`
        : `Welcome to the ${selectedCompany} company recruitment drive! What are the key projects you have built, and how do they demonstrate your software engineering capability?`;

    const newSession: InterviewSession = {
      id: `int_${Date.now()}`,
      userId: user?.id || 'usr_student_1',
      companyName: selectedCompany,
      jobRole: selectedRole,
      interviewType,
      difficulty,
      turns: [],
      status: 'in_progress',
    };

    setSession(newSession);
    setCurrentQuestion(initialQuestion);
    setIsSessionActive(true);
    setCompletedReport(null);
  };

  const handleSendAnswer = async () => {
    if (!userAnswer.trim() || !session || isEvaluating) return;
    setIsEvaluating(true);

    try {
      const evalRes = await evaluateInterviewTurnApi({
        companyName: selectedCompany,
        jobRole: selectedRole,
        interviewType,
        question: currentQuestion,
        userAnswer,
      });

      const newTurn: InterviewTurn = {
        question: currentQuestion,
        userAnswer,
        feedback: {
          score: evalRes.score || 75,
          technicalScore: evalRes.technicalScore || 78,
          communicationScore: evalRes.communicationScore || 72,
          clarityScore: evalRes.clarityScore || 75,
          strengths: evalRes.strengths || 'Good core understanding.',
          improvement: evalRes.improvement || 'Add concrete examples using the STAR method.',
          sampleAnswer: evalRes.sampleAnswer || 'A structured approach focuses on specific achievements.',
        },
      };

      const updatedTurns = [...session.turns, newTurn];
      setSession((prev) => (prev ? { ...prev, turns: updatedTurns } : prev));
      setUserAnswer('');

      // Check if 3 turns completed -> wrap up interview
      if (updatedTurns.length >= 3) {
        await finishSession(updatedTurns);
      } else {
        setCurrentQuestion(evalRes.nextQuestion || 'How do you handle unexpected technical roadblocks under tight deadlines?');
      }
    } catch (err) {
      console.error('Error in interview turn:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const finishSession = async (turns: InterviewTurn[]) => {
    if (!session) return;

    const avgScore = Math.round(turns.reduce((acc, t) => acc + (t.feedback?.score || 70), 0) / turns.length);
    const avgTech = Math.round(turns.reduce((acc, t) => acc + (t.feedback?.technicalScore || 75), 0) / turns.length);
    const avgComm = Math.round(turns.reduce((acc, t) => acc + (t.feedback?.communicationScore || 72), 0) / turns.length);

    const completed: InterviewSession = {
      ...session,
      turns,
      status: 'completed',
      overallScore: avgScore,
      technicalKnowledgeScore: avgTech,
      communicationScore: avgComm,
      confidenceScore: Math.round(avgComm * 0.95),
      clarityScore: Math.round(avgComm * 0.98),
      problemSolvingScore: Math.round(avgTech * 1.02),
      summaryFeedback: {
        whatWentWell: [
          'Clear technical fundamentals and articulate responses',
          'Good composure when answering follow-up questions',
        ],
        needsImprovement: [
          'Incorporate specific metrics (e.g. % performance increase) when talking about projects',
          'Structure behavioral responses using the STAR method (Situation, Task, Action, Result)',
        ],
        suggestedApproach:
          'Practice concise 90-second answers with an upfront summary statement followed by technical implementation details.',
        communicationTips: [
          'Maintain steady pacing during technical explanations',
          'Use bullet points in verbal structure: "First, second, and third..."',
        ],
      },
      completedAt: new Date().toISOString(),
    };

    await finishInterviewApi(completed);
    setCompletedReport(completed);
    setIsSessionActive(false);
  };

  return (
    <div className="min-h-screen bg-[#0F1117] text-slate-100 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 text-[11px] font-medium mb-2 border border-purple-500/20 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>AI Real-time Mock Interview Room</span>
          </div>
          <h1 className="editorial-serif text-3xl sm:text-4xl font-normal text-slate-100">AI Mock Interview Studio</h1>
          <p className="text-sm text-slate-400 mt-1.5 font-light">
            Simulate real company technical and HR interviews with real-time AI scorecard evaluation.
          </p>
        </div>
      </div>

      {/* Completed Report Screen */}
      {completedReport ? (
        <div className="bg-[#161922] border border-[#1F2430] rounded-3xl p-6 sm:p-8 space-y-8 animate-in fade-in">
          <div className="flex items-center justify-between pb-6 border-b border-[#1F2430]">
            <div>
              <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-widest">Interview Completed</span>
              <h2 className="editorial-serif text-2xl font-normal text-slate-100 mt-1">
                {completedReport.companyName} • {completedReport.jobRole} Report
              </h2>
            </div>
            <button
              onClick={() => {
                setCompletedReport(null);
                setIsSessionActive(false);
              }}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-medium uppercase tracking-wider hover:bg-indigo-500"
            >
              Start Another Interview
            </button>
          </div>

          {/* Scores Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <div className="p-4 rounded-xl bg-[#0F1117] border border-[#1F2430] text-center">
              <div className="text-[11px] text-slate-400 uppercase tracking-wider">Overall Score</div>
              <div className="editorial-serif text-2xl font-normal text-indigo-300 mt-1">{completedReport.overallScore}%</div>
            </div>
            <div className="p-4 rounded-xl bg-[#0F1117] border border-[#1F2430] text-center">
              <div className="text-[11px] text-slate-400 uppercase tracking-wider">Technical</div>
              <div className="editorial-serif text-2xl font-normal text-emerald-300 mt-1">{completedReport.technicalKnowledgeScore}%</div>
            </div>
            <div className="p-4 rounded-xl bg-[#0F1117] border border-[#1F2430] text-center">
              <div className="text-[11px] text-slate-400 uppercase tracking-wider">Communication</div>
              <div className="editorial-serif text-2xl font-normal text-cyan-300 mt-1">{completedReport.communicationScore}%</div>
            </div>
            <div className="p-4 rounded-xl bg-[#0F1117] border border-[#1F2430] text-center">
              <div className="text-[11px] text-slate-400 uppercase tracking-wider">Confidence</div>
              <div className="editorial-serif text-2xl font-normal text-amber-300 mt-1">{completedReport.confidenceScore}%</div>
            </div>
            <div className="p-4 rounded-xl bg-[#0F1117] border border-[#1F2430] text-center col-span-2 sm:col-span-1">
              <div className="text-[11px] text-slate-400 uppercase tracking-wider">Clarity</div>
              <div className="editorial-serif text-2xl font-normal text-purple-300 mt-1">{completedReport.clarityScore}%</div>
            </div>
          </div>

          {/* AI Feedback Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-sans">
            <div className="p-5 rounded-2xl bg-[#0F1117] border border-[#1F2430]">
              <h3 className="font-semibold text-emerald-400 mb-3 uppercase text-[11px] tracking-wider">What You Did Well</h3>
              <ul className="space-y-2 text-slate-300 font-light">
                {completedReport.summaryFeedback?.whatWentWell.map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-[#0F1117] border border-[#1F2430]">
              <h3 className="font-semibold text-rose-400 mb-3 uppercase text-[11px] tracking-wider">Areas For Improvement</h3>
              <ul className="space-y-2 text-slate-300 font-light">
                {completedReport.summaryFeedback?.needsImprovement.map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : !isSessionActive ? (
        /* Configuration Setup Screen */
        <div className="bg-[#161922] border border-[#1F2430] rounded-3xl p-6 sm:p-8 max-w-3xl mx-auto space-y-6">
          <h2 className="editorial-serif text-2xl font-normal text-slate-100">Configure Your AI Interview</h2>

          {/* Company Selection */}
          <div>
            <label className="block text-xs font-normal text-slate-300 mb-2">Target Company</label>
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="w-full bg-[#0F1117] border border-[#1F2430] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
            >
              <option value="TCS (Tata Consultancy Services)">TCS (Tata Consultancy Services)</option>
              <option value="Infosys">Infosys</option>
              <option value="Accenture">Accenture</option>
              <option value="Amazon">Amazon</option>
              <option value="Google">Google</option>
              <option value="General Tech Firm">General Tech Firm</option>
            </select>
          </div>

          {/* Job Role */}
          <div>
            <label className="block text-xs font-normal text-slate-300 mb-2">Target Job Role</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full bg-[#0F1117] border border-[#1F2430] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
            >
              <option value="Software Development Engineer">Software Development Engineer (SDE)</option>
              <option value="Full Stack Developer">Full Stack Developer</option>
              <option value="Data Analyst">Data Analyst</option>
              <option value="Systems Engineer">Systems Engineer</option>
            </select>
          </div>

          {/* Interview Type */}
          <div>
            <label className="block text-xs font-normal text-slate-300 mb-2">Interview Format</label>
            <div className="grid grid-cols-3 gap-3 text-xs">
              {(['Technical', 'HR', 'Company'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setInterviewType(type)}
                  className={`py-3 rounded-xl border font-medium transition-all ${
                    interviewType === type
                      ? 'bg-purple-600/20 border-purple-500 text-purple-200'
                      : 'bg-[#0F1117] border-[#1F2430] text-slate-400 hover:text-white'
                  }`}
                >
                  {type} Interview
                </button>
              ))}
            </div>
          </div>

          {/* Start CTA */}
          <button
            onClick={startInterviewSession}
            className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs uppercase tracking-wider transition-all shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2 mt-4"
          >
            <Sparkles className="w-4 h-4" />
            <span>Enter AI Interview Studio</span>
          </button>
        </div>
      ) : (
        /* Active Interview Room */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Interview Conversation Console */}
          <div className="lg:col-span-2 bg-[#161922] border border-[#1F2430] rounded-3xl p-6 sm:p-8 flex flex-col justify-between min-h-[500px]">
            <div>
              {/* Question Banner */}
              <div className="p-5 rounded-2xl bg-purple-950/20 border border-purple-500/20 mb-6">
                <div className="text-[11px] font-semibold text-purple-400 mb-1 flex items-center gap-1.5 uppercase tracking-wider">
                  <Brain className="w-4 h-4" />
                  <span>AI Recruiter Question:</span>
                </div>
                <p className="editorial-serif text-base text-slate-100 leading-relaxed">{currentQuestion}</p>
              </div>

              {/* Turns History */}
              <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                {session?.turns.map((turn, i) => (
                  <div key={i} className="space-y-2 text-xs">
                    <div className="p-3.5 rounded-xl bg-[#0F1117] border border-[#1F2430] text-slate-300 font-light">
                      <span className="font-semibold text-indigo-400 block mb-1">Your Answer:</span>
                      {turn.userAnswer}
                    </div>
                    {turn.feedback && (
                      <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-emerald-300 text-[11px]">
                        <span className="font-semibold block mb-0.5">Turn Score: {turn.feedback.score}%</span>
                        {turn.feedback.strengths}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Response Input Controls */}
            <div className="mt-6 pt-4 border-t border-[#1F2430]">
              <textarea
                rows={3}
                placeholder="Type your verbal/technical response here or click the microphone to speak..."
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="w-full bg-[#0F1117] border border-[#1F2430] rounded-2xl p-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 resize-none mb-3"
              />

              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`p-3 rounded-xl border text-xs font-medium flex items-center gap-2 transition-all ${
                    isListening
                      ? 'bg-rose-500/20 border-rose-500 text-rose-300 animate-pulse'
                      : 'bg-[#0F1117] border-[#1F2430] text-slate-300 hover:text-white'
                  }`}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  <span>{isListening ? 'Stop Speaking' : 'Voice Mode'}</span>
                </button>

                <button
                  onClick={handleSendAnswer}
                  disabled={isEvaluating || !userAnswer.trim()}
                  className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs uppercase tracking-wider transition-all shadow-md shadow-purple-600/20 disabled:opacity-40 flex items-center gap-2"
                >
                  {isEvaluating ? (
                    <span>Evaluating Response...</span>
                  ) : (
                    <>
                      <span>Submit Response</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Live Scorecard Sidebar */}
          <div className="bg-[#161922] border border-[#1F2430] rounded-3xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="editorial-serif text-lg font-normal text-slate-100 mb-4 pb-3 border-b border-[#1F2430] flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-400" />
                Live Evaluation Metrics
              </h3>

              <div className="space-y-4 text-xs">
                <div className="p-3.5 rounded-xl bg-[#0F1117] border border-[#1F2430]">
                  <div className="text-slate-400 mb-1 text-[10px] uppercase tracking-wider">Company & Role</div>
                  <div className="font-semibold text-slate-200">{selectedCompany}</div>
                  <div className="text-slate-400 text-[11px]">{selectedRole}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0F1117] border border-[#1F2430]">
                  <div className="text-slate-400 mb-1 text-[10px] uppercase tracking-wider">Turns Completed</div>
                  <div className="font-semibold text-indigo-400">{session?.turns.length} / 3 Rounds</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => session && finishSession(session.turns)}
              className="mt-6 w-full py-2.5 rounded-xl bg-[#0F1117] border border-[#1F2430] hover:bg-[#1F2430] text-slate-300 text-xs font-medium uppercase tracking-wider transition-colors"
            >
              End Interview & Get Full Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
