import React, { useState } from 'react';
import { X, UserCheck, Upload, FileText, CheckCircle2, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { updateProfileApi } from '../services/api';

export const StudentProfileModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { user, setUser } = useAuth();
  if (!isOpen || !user) return null;

  const [fullName, setFullName] = useState(user.fullName);
  const [college, setCollege] = useState(user.college || '');
  const [branch, setBranch] = useState(user.branch || '');
  const [degree, setDegree] = useState(user.degree || '');
  const [yearOfPassing, setYearOfPassing] = useState(user.yearOfPassing || 2026);
  const [targetRole, setTargetRole] = useState(user.targetRole || '');
  const [resumeText, setResumeText] = useState(user.resumeText || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updated = await updateProfileApi(user.id, {
        fullName,
        college,
        branch,
        degree,
        yearOfPassing,
        targetRole,
        resumeText,
      });
      setUser(updated);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0F1117]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-[#161922] border border-[#1F2430] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-slate-400 hover:text-white p-1 rounded-lg bg-[#0F1117] border border-[#1F2430]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="editorial-serif text-2xl font-normal text-slate-100">Student Profile & Resume</h2>
            <p className="text-xs text-slate-400 font-light mt-0.5">Keep profile updated for accurate AI test targeting.</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-normal mb-1">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-[#0F1117] border border-[#1F2430] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-normal mb-1">College Name</label>
              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="w-full bg-[#0F1117] border border-[#1F2430] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-normal mb-1">Branch / Major</label>
              <input
                type="text"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full bg-[#0F1117] border border-[#1F2430] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-normal mb-1">Degree</label>
              <input
                type="text"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                className="w-full bg-[#0F1117] border border-[#1F2430] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-normal mb-1">Year of Passing</label>
              <input
                type="number"
                value={yearOfPassing}
                onChange={(e) => setYearOfPassing(Number(e.target.value))}
                className="w-full bg-[#0F1117] border border-[#1F2430] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-normal mb-1">Target Placement Role</label>
            <input
              type="text"
              placeholder="e.g., Software Engineer, Data Analyst, Systems Engineer"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full bg-[#0F1117] border border-[#1F2430] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-normal mb-1">Resume Summary / Skills Text</label>
            <textarea
              rows={3}
              placeholder="Paste skills, projects, and summary text for AI interview customization..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              className="w-full bg-[#0F1117] border border-[#1F2430] rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs uppercase tracking-wider transition-all shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 mt-4"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving Changes...' : 'Save Profile Details'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
