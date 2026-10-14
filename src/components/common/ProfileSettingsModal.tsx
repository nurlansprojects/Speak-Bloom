import React, { useState } from 'react';
import {
  X,
  User,
  Moon,
  Sun,
  Mic,
  Clock,
  Shield,
  LogOut,
  Check,
  Sparkles,
  Info,
  GraduationCap,
  BookOpen,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = ({
  isOpen,
  onClose,
  isDarkMode,
  onToggleDarkMode,
}) => {
  const { profile, currentUser, updateUserProfile, applyForTeacherRole, logOut } = useAuth();
  const [displayName, setDisplayName] = useState(profile?.displayName || currentUser?.displayName || 'User');
  const [dailyGoal, setDailyGoal] = useState(profile?.dailyGoalMinutes || 15);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [applicationSent, setApplicationSent] = useState(false);

  if (!isOpen || !profile) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUserProfile({
      displayName: displayName.trim(),
      dailyGoalMinutes: dailyGoal,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleApplyTeacher = async () => {
    await applyForTeacherRole();
    setApplicationSent(true);
    setTimeout(() => setApplicationSent(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#1C1C1E] border border-black/10 dark:border-white/10 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl">
        {/* Header with Actual Google Profile Picture */}
        <div className="flex items-center justify-between pb-4 border-b border-black/5 dark:border-white/10 mb-5">
          <div className="flex items-center gap-3">
            {profile.photoURL || currentUser?.photoURL ? (
              <img
                src={profile.photoURL || currentUser?.photoURL || ''}
                alt={profile.displayName}
                className="w-12 h-12 rounded-2xl object-cover border border-black/10 dark:border-white/10 shadow-sm"
              />
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-[#7957E8]/10 text-[#7957E8] flex items-center justify-center font-bold text-lg">
                {profile.displayName?.[0] || 'U'}
              </div>
            )}
            <div>
              <h3 className="text-lg font-bold text-[#1D1D1F] dark:text-white">
                {profile.displayName || 'User'}
              </h3>
              <p className="text-xs text-[#6E6E73] dark:text-[#98989D]">
                {profile.email}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#6E6E73] hover:text-[#1D1D1F] dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {savedSuccess && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
            <Check className="w-4 h-4" /> Preferences updated successfully!
          </div>
        )}

        {applicationSent && (
          <div className="mb-4 p-3 rounded-xl bg-[#7957E8]/10 text-[#7957E8] text-xs font-semibold flex items-center gap-2">
            <Check className="w-4 h-4" /> Application submitted for administrative review!
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#1D1D1F] dark:text-white mb-1">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#F5F5F7] dark:bg-[#2C2C2E] text-xs sm:text-sm text-[#1D1D1F] dark:text-white border border-transparent focus:border-[#7957E8] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1D1D1F] dark:text-white mb-1">
              Authenticated Google Account
            </label>
            <input
              type="email"
              disabled
              value={profile.email}
              className="w-full px-4 py-2.5 rounded-xl bg-[#F5F5F7]/60 dark:bg-[#2C2C2E]/60 text-xs sm:text-sm text-[#6E6E73] dark:text-[#8E8E93] border border-transparent cursor-not-allowed"
            />
          </div>

          {/* Account Role & Instructor Status */}
          <div>
            <label className="block text-xs font-semibold text-[#1D1D1F] dark:text-white mb-1">
              Account Role & Permissions
            </label>
            <div className="p-3.5 rounded-2xl bg-[#F5F5F7] dark:bg-[#2C2C2E] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold capitalize text-[#1D1D1F] dark:text-white flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-[#7957E8]" />
                  {profile.role === 'admin'
                    ? 'Platform Administrator'
                    : profile.role === 'teacher'
                    ? 'Verified Speaking Instructor'
                    : 'Registered Student'}
                </span>
                <span className="text-[11px] text-[#6E6E73] dark:text-[#8E8E93] block mt-0.5">
                  UID: <code className="font-mono text-[10px]">{profile.uid.slice(0, 16)}...</code>
                </span>
              </div>

              {profile.role === 'student' && profile.teacherStatus !== 'pending' && profile.teacherStatus !== 'approved' && (
                <button
                  type="button"
                  onClick={handleApplyTeacher}
                  className="px-3 py-1.5 rounded-xl bg-[#7957E8] text-white text-xs font-semibold hover:bg-[#6C47E0] transition-colors cursor-pointer self-start sm:self-auto shadow-sm"
                >
                  Apply for Instructor Role
                </button>
              )}

              {profile.teacherStatus === 'pending' && (
                <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold bg-amber-500/10 px-2.5 py-1 rounded-lg">
                  Teacher Application Pending
                </span>
              )}
            </div>
          </div>

          {/* Daily Goal minutes */}
          <div>
            <label className="block text-xs font-semibold text-[#1D1D1F] dark:text-white mb-1">
              Daily Speaking Target (Minutes)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[10, 15, 20, 30].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setDailyGoal(mins)}
                  className={`py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    dailyGoal === mins
                      ? 'bg-[#7957E8] text-white shadow-sm'
                      : 'bg-[#F5F5F7] dark:bg-[#2C2C2E] text-[#1D1D1F] dark:text-white hover:bg-black/5'
                  }`}
                >
                  {mins} min
                </button>
              ))}
            </div>
          </div>

          {/* Theme mode toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#F5F5F7] dark:bg-[#2C2C2E]">
            <span className="text-xs font-semibold text-[#1D1D1F] dark:text-white flex items-center gap-2">
              {isDarkMode ? <Moon className="w-4 h-4 text-[#7957E8]" /> : <Sun className="w-4 h-4 text-[#7957E8]" />}
              Visual Appearance
            </span>
            <button
              type="button"
              onClick={onToggleDarkMode}
              className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#1C1C1E] text-xs font-semibold text-[#1D1D1F] dark:text-white border border-black/5 dark:border-white/10 cursor-pointer"
            >
              {isDarkMode ? 'Dark Mode' : 'Light Mode'}
            </button>
          </div>

          {/* Save Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#7957E8] text-white text-xs sm:text-sm font-semibold hover:bg-[#6C47E0] transition-colors cursor-pointer shadow-sm"
            >
              Save Profile Preferences
            </button>
          </div>
        </form>

        {/* About & Copyright section */}
        <div className="mt-6 pt-5 border-t border-black/5 dark:border-white/10 text-center space-y-1">
          <p className="text-xs font-bold text-[#1D1D1F] dark:text-white">
            Speak Bloom — English Speaking Platform
          </p>
          <p className="text-[11px] text-[#6E6E73] dark:text-[#8E8E93]">
            © 2026 Jamalova Ummikhabiba. All rights reserved.
          </p>
        </div>

        {/* Explicit Sign Out Button */}
        <div className="mt-4 pt-3 border-t border-black/5 dark:border-white/10 flex justify-between items-center">
          <span className="text-xs text-[#6E6E73]">Authenticated via Google</span>
          <button
            onClick={() => {
              logOut();
              onClose();
            }}
            className="text-xs text-red-600 dark:text-red-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out from Account
          </button>
        </div>
      </div>
    </div>
  );
};
