import React from 'react';
import {
  Clock,
  Sparkles,
  ShieldCheck,
  GraduationCap,
  ArrowRight,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface TeacherPendingScreenProps {
  onContinueAsStudent: () => void;
}

export const TeacherPendingScreen: React.FC<TeacherPendingScreenProps> = ({
  onContinueAsStudent,
}) => {
  const { profile, logOut } = useAuth();

  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-[#000000] text-[#1D1D1F] dark:text-[#F5F5F7] flex flex-col justify-between p-4 sm:p-8 font-sans">
      <header className="max-w-7xl w-full mx-auto flex items-center justify-between py-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#7957E8] to-[#9A7DFA] text-white flex items-center justify-center shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-[#1D1D1F] dark:text-white">
            Speak Bloom
          </span>
        </div>

        <button
          onClick={logOut}
          className="text-xs text-[#6E6E73] dark:text-[#98989D] hover:text-red-600 flex items-center gap-1.5 cursor-pointer font-medium"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </header>

      <main className="max-w-lg w-full mx-auto my-auto py-8">
        <div className="bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10 rounded-3xl p-8 sm:p-10 shadow-sm text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-600 dark:text-amber-400 mb-5">
            <Clock className="w-8 h-8" />
          </div>

          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 mb-3">
            Application Status: Pending Review
          </span>

          <h1 className="text-2xl font-bold tracking-tight text-[#1D1D1F] dark:text-white mb-2">
            Instructor Approval in Progress
          </h1>

          <p className="text-xs sm:text-sm text-[#6E6E73] dark:text-[#98989D] leading-relaxed mb-6">
            Hello, <span className="font-semibold text-[#1D1D1F] dark:text-white">{profile?.displayName || 'Educator'}</span>. Your request for verified instructor access has been submitted to Speak Bloom administration. To preserve student privacy and curriculum integrity, teacher permissions require manual verification.
          </p>

          <div className="p-4 rounded-2xl bg-[#F5F5F7] dark:bg-[#2C2C2E] border border-black/5 dark:border-white/5 text-left mb-6 space-y-2">
            <div className="text-xs font-semibold text-[#1D1D1F] dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#7957E8]" /> What happens next?
            </div>
            <p className="text-[11px] text-[#6E6E73] dark:text-[#8E8E93] leading-relaxed">
              Once verified, you will immediately unlock course publishing, speaking activity builders, and rubric grading queues. In the meantime, you have full access to student speaking drills.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={onContinueAsStudent}
              className="w-full py-3 px-5 rounded-2xl bg-[#7957E8] hover:bg-[#6C47E0] text-white font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Practice in Student Speaking Studio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>

      <footer className="max-w-7xl w-full mx-auto py-4 text-center text-xs text-[#6E6E73] dark:text-[#8E8E93]">
        <div className="font-normal text-[11px] sm:text-xs">
          © 2026 Jamalova Ummikhabiba. All rights reserved.
        </div>
      </footer>
    </div>
  );
};
