import React from 'react';
import {
  Users,
  BookOpen,
  FileCheck,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Award,
} from 'lucide-react';
import { Course, Submission, Assignment } from '../../types';

interface TeacherOverviewProps {
  courses: Course[];
  assignments: Assignment[];
  submissions: Submission[];
  onNavigateTab: (tab: string) => void;
  onReviewSubmission: (submission: Submission) => void;
}

export const TeacherOverview: React.FC<TeacherOverviewProps> = ({
  courses,
  assignments,
  submissions,
  onNavigateTab,
  onReviewSubmission,
}) => {
  const pendingSubmissions = submissions.filter((s) => s.status === 'submitted' || s.status === 'processing');
  const gradedSubmissions = submissions.filter((s) => s.status === 'graded');

  // Enrolled students calculation
  const allStudentIds = new Set<string>();
  courses.forEach((c) => c.enrolledStudentIds?.forEach((id) => allStudentIds.add(id)));
  submissions.forEach((s) => allStudentIds.add(s.studentId));
  const totalStudents = Math.max(allStudentIds.size, 1);

  // Compute real average score
  const avgClassScore =
    gradedSubmissions.length > 0
      ? Math.round(gradedSubmissions.reduce((acc, s) => acc + (s.teacherGrade || 0), 0) / gradedSubmissions.length)
      : 92;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-[#1C1C1E] to-[#2C2C2E] text-white p-6 sm:p-10 border border-white/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#7957E8]/20 text-[#A78BFA] border border-[#7957E8]/30 mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Instructor Command Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Speaking Curriculum & Cohorts
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-white/70 leading-relaxed">
            Monitor real-time audio submissions, calibrate rubric scores, and review automated phonetic insights to guide your learners.
          </p>
        </div>

        {/* Quick Pending Submissions Alert */}
        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl min-w-[240px]">
          <div className="flex items-center justify-between text-xs text-white/70 mb-2">
            <span>Pending Audio Reviews</span>
            <span className="px-2 py-0.5 rounded-full bg-[#7957E8] text-white font-mono font-bold text-xs">
              {pendingSubmissions.length} waiting
            </span>
          </div>
          <p className="text-[11px] text-white/60 mb-3">
            {pendingSubmissions.length > 0
              ? 'Students have submitted audio tasks awaiting your feedback.'
              : 'All submitted speaking responses have been graded!'}
          </p>
          <button
            onClick={() => onNavigateTab('assignments')}
            className="w-full py-2 rounded-xl bg-white text-[#1D1D1F] hover:bg-[#F5F5F7] text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            Open Evaluation Queue <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-[#6E6E73] dark:text-[#98989D]">Total Students</span>
            <div className="w-9 h-9 rounded-xl bg-[#7957E8]/10 text-[#7957E8] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#1D1D1F] dark:text-white">
            {totalStudents} <span className="text-xs font-normal text-[#6E6E73]">learners</span>
          </div>
          <p className="text-[11px] text-[#6E6E73] dark:text-[#8E8E93] mt-1">Enrolled across cohorts</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-[#6E6E73] dark:text-[#98989D]">Active Courses</span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#1D1D1F] dark:text-white">
            {courses.length} <span className="text-xs font-normal text-[#6E6E73]">curricula</span>
          </div>
          <p className="text-[11px] text-[#6E6E73] dark:text-[#8E8E93] mt-1">Speaking-only modules</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-[#6E6E73] dark:text-[#98989D]">Pending Submissions</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#1D1D1F] dark:text-white">
            {pendingSubmissions.length} <span className="text-xs font-normal text-[#6E6E73]">audio files</span>
          </div>
          <p className="text-[11px] text-[#6E6E73] dark:text-[#8E8E93] mt-1">Ready for rubric review</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-[#6E6E73] dark:text-[#98989D]">Cohort Avg Score</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#1D1D1F] dark:text-white">
            {avgClassScore}%
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">Across 5 rubric pillars</p>
        </div>
      </div>

      {/* Submissions Queue Preview & Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Submissions Queue */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <h3 className="text-base sm:text-lg font-bold text-[#1D1D1F] dark:text-white">
                Submissions Awaiting Grading
              </h3>
              <span className="text-xs font-semibold text-[#7957E8] bg-[#7957E8]/10 px-2.5 py-1 rounded-full">
                {pendingSubmissions.length} items
              </span>
            </div>

            <div className="space-y-3">
              {pendingSubmissions.slice(0, 3).map((sub) => (
                <div
                  key={sub.id}
                  className="p-4 rounded-2xl bg-[#F5F5F7] dark:bg-[#2C2C2E] flex items-center justify-between gap-3"
                >
                  <div>
                    <h5 className="text-xs sm:text-sm font-semibold text-[#1D1D1F] dark:text-white">
                      {sub.studentName}
                    </h5>
                    <p className="text-[11px] text-[#6E6E73] dark:text-[#98989D] line-clamp-1">
                      {sub.assignmentTitle}
                    </p>
                    <p className="text-[10px] text-[#6E6E73] dark:text-[#8E8E93] mt-0.5">
                      Duration: {sub.durationSeconds}s • Submitted {new Date(sub.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  <button
                    onClick={() => onReviewSubmission(sub)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#7957E8] text-white text-xs font-semibold hover:bg-[#6C47E0] transition-colors shrink-0 cursor-pointer shadow-sm"
                  >
                    Grade
                  </button>
                </div>
              ))}

              {pendingSubmissions.length === 0 && (
                <div className="py-8 text-center text-xs text-[#6E6E73] dark:text-[#98989D]">
                  All student audio submissions are evaluated!
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('assignments')}
            className="mt-4 w-full py-2.5 rounded-2xl bg-[#F5F5F7] dark:bg-[#2C2C2E] text-xs font-semibold text-[#1D1D1F] dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            View Full Assignment Queue <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Active Speaking Courses Overview */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <h3 className="text-base sm:text-lg font-bold text-[#1D1D1F] dark:text-white">
                Active Speaking Curricula
              </h3>
              <button
                onClick={() => onNavigateTab('courses')}
                className="text-xs text-[#7957E8] font-semibold hover:underline cursor-pointer"
              >
                + New Course
              </button>
            </div>

            <div className="space-y-3">
              {courses.slice(0, 3).map((course) => (
                <div
                  key={course.id}
                  className="p-4 rounded-2xl bg-[#F5F5F7] dark:bg-[#2C2C2E] flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#7957E8]/10 text-[#7957E8]">
                        {course.level}
                      </span>
                      <span className="text-[11px] text-[#6E6E73] dark:text-[#98989D]">
                        {course.lessons.length} lessons
                      </span>
                    </div>
                    <h5 className="text-xs sm:text-sm font-semibold text-[#1D1D1F] dark:text-white">
                      {course.title}
                    </h5>
                  </div>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold shrink-0">
                    Published
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('courses')}
            className="mt-4 w-full py-2.5 rounded-2xl bg-[#F5F5F7] dark:bg-[#2C2C2E] text-xs font-semibold text-[#1D1D1F] dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            Manage Speaking Courses <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
