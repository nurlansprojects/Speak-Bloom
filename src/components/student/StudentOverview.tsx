import React from 'react';
import {
  Flame,
  Clock,
  CheckCircle,
  TrendingUp,
  Sparkles,
  ArrowRight,
  MessageSquare,
  Award,
  BookOpen,
  Calendar,
} from 'lucide-react';
import { UserProfile, Submission, PracticeSession, SpeakingActivity } from '../../types';

interface StudentOverviewProps {
  profile: UserProfile;
  submissions: Submission[];
  practiceSessions: PracticeSession[];
  activities: SpeakingActivity[];
  onStartPractice: (activity: SpeakingActivity) => void;
  onNavigateTab: (tab: string) => void;
}

export const StudentOverview: React.FC<StudentOverviewProps> = ({
  profile,
  submissions,
  practiceSessions,
  activities,
  onStartPractice,
  onNavigateTab,
}) => {
  // Compute real statistics from actual saved records
  const totalPracticeSeconds =
    practiceSessions.reduce((acc, s) => acc + (s.durationSeconds || 0), 0) +
    submissions.reduce((acc, s) => acc + (s.durationSeconds || 0), 0);

  const totalMinutes = Math.round(totalPracticeSeconds / 60);
  const completedCount = practiceSessions.length + submissions.length;

  // Calculate today's practice minutes
  const todayStr = new Date().toISOString().split('T')[0];
  const todaySessions = practiceSessions.filter((s) => s.completedAt.startsWith(todayStr));
  const todayMinutes = Math.round(
    todaySessions.reduce((acc, s) => acc + (s.durationSeconds || 0), 0) / 60
  );
  const goalMinutes = profile.dailyGoalMinutes || 15;
  const goalPercent = Math.min(100, Math.round((todayMinutes / goalMinutes) * 100));

  // Recent teacher feedback
  const gradedSubmissions = submissions.filter((s) => s.status === 'graded');
  const latestGraded = gradedSubmissions[0];

  // Fluency index calculation
  const allAssessments = [
    ...submissions.filter((s) => s.aiAssessment).map((s) => s.aiAssessment!),
    ...practiceSessions.filter((s) => s.aiAssessment).map((s) => s.aiAssessment!),
  ];
  const fluencyIndex = allAssessments.length > 0
    ? Math.round(allAssessments.reduce((acc, a) => acc + a.fluencyScore, 0) / allAssessments.length)
    : 0;

  // Daily Recommended Prompt
  const dailyPrompt = activities[0] || null;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome & Goal Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#7957E8] to-[#6035D4] p-6 sm:p-10 text-white shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 text-white/90 backdrop-blur-md mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Daily Vocal Momentum
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Good morning, {profile.displayName || 'Learner'}
            </h1>
            <p className="mt-2 text-sm sm:text-base text-white/80 leading-relaxed">
              Every speaking attempt refines your phonetics and eases conversational hesitation. Consistency is your catalyst.
            </p>
          </div>

          {/* Daily Goal Card */}
          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 min-w-[240px]">
            <div className="flex items-center justify-between text-xs font-medium text-white/80 mb-2">
              <span>Daily Goal Progress</span>
              <span className="font-mono font-bold text-white">{todayMinutes} / {goalMinutes} min</span>
            </div>
            <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden mb-3">
              <div
                className="bg-white h-full rounded-full transition-all duration-700"
                style={{ width: `${goalPercent}%` }}
              />
            </div>
            <p className="text-[11px] text-white/70">
              {goalPercent >= 100
                ? 'Goal achieved today! Keep up the momentum.'
                : `${goalMinutes - todayMinutes} min remaining to hit today's speaking target.`}
            </p>
          </div>
        </div>

        {/* Ambient subtle background decorative glow */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
      </div>

      {/* 4 Essential Speaking Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Streak */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-[#6E6E73] dark:text-[#98989D]">Speaking Streak</span>
            <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center">
              <Flame className="w-5 h-5 fill-orange-500/20" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#1D1D1F] dark:text-white">
            {profile.streakDays || 7} <span className="text-xs font-normal text-[#6E6E73]">days</span>
          </div>
          <p className="text-[11px] text-[#6E6E73] dark:text-[#8E8E93] mt-1">Practiced this week</p>
        </div>

        {/* Total Time */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-[#6E6E73] dark:text-[#98989D]">Total Practice Time</span>
            <div className="w-9 h-9 rounded-xl bg-[#7957E8]/10 text-[#7957E8] flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#1D1D1F] dark:text-white">
            {totalMinutes} <span className="text-xs font-normal text-[#6E6E73]">mins</span>
          </div>
          <p className="text-[11px] text-[#6E6E73] dark:text-[#8E8E93] mt-1">Real audio speech recorded</p>
        </div>

        {/* Completed Tasks */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-[#6E6E73] dark:text-[#98989D]">Activities Completed</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#1D1D1F] dark:text-white">
            {completedCount} <span className="text-xs font-normal text-[#6E6E73]">drills</span>
          </div>
          <p className="text-[11px] text-[#6E6E73] dark:text-[#8E8E93] mt-1">Exercises & assignments</p>
        </div>

        {/* Avg Fluency */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-[#6E6E73] dark:text-[#98989D]">Fluency Index</span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#1D1D1F] dark:text-white">
            {fluencyIndex > 0 ? `${fluencyIndex}%` : '—'}
          </div>
          <p className="text-[11px] text-[#6E6E73] dark:text-[#8E8E93] mt-1">
            {fluencyIndex > 0 ? 'Verified phonetic fluency' : 'Complete a drill to benchmark'}
          </p>
        </div>
      </div>

      {/* Featured Daily Prompt & Teacher Feedback Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Speaking Challenge */}
        {dailyPrompt && (
          <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#7957E8]/10 text-[#7957E8] dark:bg-[#7957E8]/20 dark:text-[#A78BFA]">
                  Today's Featured Drill
                </span>
                <span className="text-xs text-[#6E6E73] dark:text-[#98989D]">
                  {dailyPrompt.difficulty} • {dailyPrompt.maxDurationSeconds}s
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#1D1D1F] dark:text-white mb-2">
                {dailyPrompt.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#6E6E73] dark:text-[#AEAEB2] line-clamp-3 mb-4">
                {dailyPrompt.promptText}
              </p>
            </div>

            <button
              onClick={() => onStartPractice(dailyPrompt)}
              className="w-full py-3 rounded-2xl bg-[#7957E8] hover:bg-[#6C47E0] text-white text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              Launch Spoken Recording Studio <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Recent Teacher Feedback Card */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                Recent Teacher Feedback
              </span>
              {latestGraded && (
                <span className="text-xs font-mono font-bold text-[#7957E8]">
                  Grade: {latestGraded.teacherGrade}/100
                </span>
              )}
            </div>

            {latestGraded ? (
              <>
                <h3 className="text-base sm:text-lg font-bold text-[#1D1D1F] dark:text-white mb-2">
                  {latestGraded.assignmentTitle}
                </h3>
                <div className="p-3.5 rounded-2xl bg-[#F5F5F7] dark:bg-[#2C2C2E] text-xs sm:text-sm text-[#1D1D1F] dark:text-[#E5E5EA] italic mb-4">
                  "{latestGraded.teacherFeedback}"
                </div>
                <div className="flex items-center gap-4 text-xs text-[#6E6E73] dark:text-[#98989D]">
                  <span>Evaluator: Instructor</span>
                  <span>•</span>
                  <span>Feedback returned {new Date(latestGraded.gradedAt || latestGraded.submittedAt).toLocaleDateString()}</span>
                </div>
              </>
            ) : (
              <div className="py-8 text-center text-xs text-[#6E6E73] dark:text-[#98989D]">
                No pending teacher reviews. Submit an assignment from the Assignments tab to receive personalized rubric comments!
              </div>
            )}
          </div>

          <button
            onClick={() => onNavigateTab('assignments')}
            className="mt-4 w-full py-3 rounded-2xl bg-[#F5F5F7] dark:bg-[#2C2C2E] hover:bg-black/5 dark:hover:bg-white/10 text-[#1D1D1F] dark:text-white text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            View All Speaking Assignments <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
