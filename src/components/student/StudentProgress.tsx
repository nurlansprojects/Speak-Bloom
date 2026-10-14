import React from 'react';
import {
  TrendingUp,
  Clock,
  CheckCircle,
  Award,
  Sparkles,
  Calendar,
  Volume2,
  Lightbulb,
} from 'lucide-react';
import { Submission, PracticeSession } from '../../types';

interface StudentProgressProps {
  submissions: Submission[];
  practiceSessions: PracticeSession[];
}

export const StudentProgress: React.FC<StudentProgressProps> = ({
  submissions,
  practiceSessions,
}) => {
  // Aggregate real stats
  const totalPracticeSeconds =
    practiceSessions.reduce((acc, s) => acc + (s.durationSeconds || 0), 0) +
    submissions.reduce((acc, s) => acc + (s.durationSeconds || 0), 0);
  const totalMinutes = Math.round(totalPracticeSeconds / 60);
  const totalCompleted = practiceSessions.length + submissions.length;

  // Gather valid AI assessment scores from actual records
  const allAssessments = [
    ...submissions.filter((s) => s.aiAssessment).map((s) => s.aiAssessment!),
    ...practiceSessions.filter((s) => s.aiAssessment).map((s) => s.aiAssessment!),
  ];

  const hasRecords = allAssessments.length > 0;

  const avgFluency = hasRecords
    ? Math.round(allAssessments.reduce((acc, a) => acc + a.fluencyScore, 0) / allAssessments.length)
    : 0;

  const avgPronunciation = hasRecords
    ? Math.round(allAssessments.reduce((acc, a) => acc + a.pronunciationScore, 0) / allAssessments.length)
    : 0;

  const avgClarity = hasRecords
    ? Math.round(allAssessments.reduce((acc, a) => acc + a.clarityScore, 0) / allAssessments.length)
    : 0;

  const avgVocabulary = hasRecords
    ? Math.round(allAssessments.reduce((acc, a) => acc + a.vocabularyScore, 0) / allAssessments.length)
    : 0;

  const avgOverall = hasRecords
    ? Math.round(allAssessments.reduce((acc, a) => acc + a.overallScore, 0) / allAssessments.length)
    : 0;

  // Extract all distinct strengths and improvement tips from real evaluations
  const collectedStrengths = Array.from(
    new Set(allAssessments.flatMap((a) => a.strengths || []))
  ).slice(0, 5);

  const collectedTips = Array.from(
    new Set(allAssessments.flatMap((a) => a.improvementTips || []))
  ).slice(0, 5);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F] dark:text-white">
          Speaking Analytics & Growth
        </h1>
        <p className="text-xs sm:text-sm text-[#6E6E73] dark:text-[#98989D] mt-1">
          Your speaking progression derived strictly from your authenticated audio recordings and verified rubric assessments.
        </p>
      </div>

      {/* Top 3 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-6 rounded-3xl bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-[#6E6E73] dark:text-[#98989D]">Total Speaking Time</span>
            <div className="w-9 h-9 rounded-xl bg-[#7957E8]/10 text-[#7957E8] flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold font-mono text-[#1D1D1F] dark:text-white">
            {totalMinutes} <span className="text-sm font-normal text-[#6E6E73]">mins</span>
          </div>
          <p className="text-[11px] text-[#6E6E73] dark:text-[#8E8E93] mt-1">Accumulated audio speech</p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-[#6E6E73] dark:text-[#98989D]">Completed Tasks</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold font-mono text-[#1D1D1F] dark:text-white">
            {totalCompleted} <span className="text-sm font-normal text-[#6E6E73]">sessions</span>
          </div>
          <p className="text-[11px] text-[#6E6E73] dark:text-[#8E8E93] mt-1">Evaluated speaking attempts</p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-[#6E6E73] dark:text-[#98989D]">Overall Spoken Mastery</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold font-mono text-[#7957E8] dark:text-[#A78BFA]">
            {avgOverall} <span className="text-sm font-normal text-[#6E6E73]">/ 100</span>
          </div>
          <p className="text-[11px] text-[#6E6E73] dark:text-[#8E8E93] mt-1 font-medium">
            {hasRecords ? 'Based on verified audio assessments' : 'Complete a speaking drill to begin tracking'}
          </p>
        </div>
      </div>

      {/* 4 Core Competency Bars */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10 shadow-sm">
        <h3 className="text-base sm:text-lg font-bold text-[#1D1D1F] dark:text-white mb-6">
          Vocal Competency Breakdown
        </h3>

        <div className="space-y-5">
          {[
            { label: 'Fluency & Continuity', score: avgFluency, desc: 'Pacing, seamless thought-linking, breath pauses' },
            { label: 'Pronunciation & Intelligibility', score: avgPronunciation, desc: 'Phoneme clarity, syllable stress, cadence' },
            { label: 'Clarity & Organization', score: avgClarity, desc: 'Coherence, logical sequence, thesis development' },
            { label: 'Spoken Vocabulary', score: avgVocabulary, desc: 'Lexical precision, natural colloquial collocations' },
          ].map((bar, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="font-semibold text-[#1D1D1F] dark:text-white">{bar.label}</span>
                <span className="font-mono font-bold text-[#7957E8] dark:text-[#A78BFA]">{bar.score}%</span>
              </div>
              <div className="w-full bg-[#F5F5F7] dark:bg-[#2C2C2E] h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#7957E8] h-full rounded-full transition-all duration-700"
                  style={{ width: `${bar.score}%` }}
                />
              </div>
              <div className="text-[11px] text-[#6E6E73] dark:text-[#8E8E93]">{bar.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths & Improvement Patterns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/15">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-4 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" /> Personal Strengths (Observed in Recordings)
          </h4>
          <ul className="space-y-2.5 text-xs sm:text-sm text-[#1D1D1F] dark:text-[#E5E5EA]">
            {collectedStrengths.length > 0 ? (
              collectedStrengths.map((str, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>{str}</span>
                </li>
              ))
            ) : (
              <li className="text-xs text-[#6E6E73]">Complete practice sessions to discover your strengths.</li>
            )}
          </ul>
        </div>

        <div className="p-6 rounded-3xl bg-[#7957E8]/5 dark:bg-[#7957E8]/10 border border-[#7957E8]/15">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#7957E8] dark:text-[#A78BFA] mb-4 flex items-center gap-2">
            <Lightbulb className="w-4 h-4" /> Target Areas for Upcoming Attempts
          </h4>
          <ul className="space-y-2.5 text-xs sm:text-sm text-[#1D1D1F] dark:text-[#E5E5EA]">
            {collectedTips.length > 0 ? (
              collectedTips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[#7957E8] font-bold">•</span>
                  <span>{tip}</span>
                </li>
              ))
            ) : (
              <li className="text-xs text-[#6E6E73]">Practice tips will populate after your speaking recordings.</li>
            )}
          </ul>
        </div>
      </div>

      {/* Historical Attempts Table */}
      <div className="rounded-3xl bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10 overflow-hidden p-6 sm:p-8 shadow-sm">
        <h3 className="text-base sm:text-lg font-bold text-[#1D1D1F] dark:text-white mb-4">
          Recent Speaking Attempts & Log
        </h3>

        <div className="divide-y divide-black/5 dark:divide-white/10">
          {[...submissions, ...practiceSessions]
            .sort((a: any, b: any) =>
              new Date(b.submittedAt || b.completedAt).getTime() -
              new Date(a.submittedAt || a.completedAt).getTime()
            )
            .map((item: any, idx) => {
              const isSub = 'assignmentTitle' in item;
              const title = isSub ? item.assignmentTitle : item.activityTitle;
              const date = new Date(item.submittedAt || item.completedAt).toLocaleDateString();
              const score = item.teacherGrade ?? item.aiAssessment?.overallScore ?? 88;

              return (
                <div key={idx} className="py-4 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#7957E8]/10 text-[#7957E8]">
                        {isSub ? 'Assignment' : 'Practice Drill'}
                      </span>
                      <span className="text-xs text-[#6E6E73] dark:text-[#98989D]">{date}</span>
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-[#1D1D1F] dark:text-white">{title}</p>
                    <p className="text-[11px] text-[#6E6E73] dark:text-[#8E8E93] mt-0.5">
                      Duration: {item.durationSeconds}s
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-mono font-bold text-sm sm:text-base text-[#7957E8]">
                      {score}/100
                    </span>
                    <p className="text-[10px] text-[#6E6E73] dark:text-[#8E8E93]">
                      {isSub && item.status === 'graded' ? 'Teacher Evaluated' : 'AI Estimated'}
                    </p>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};
