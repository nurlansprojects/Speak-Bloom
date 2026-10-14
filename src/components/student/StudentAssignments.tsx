import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Mic,
  CheckCircle2,
  AlertCircle,
  FileText,
  RotateCcw,
  Sparkles,
  Award,
  ChevronRight,
} from 'lucide-react';
import { Assignment, Submission, SpeakingActivity, AIAssessmentResult } from '../../types';
import { AudioRecorderStudio } from '../audio/AudioRecorderStudio';

interface StudentAssignmentsProps {
  assignments: Assignment[];
  submissions: Submission[];
  studentId: string;
  onSubmitAssignment: (
    assignment: Assignment,
    assessment: AIAssessmentResult,
    audioUrl: string,
    durationSeconds: number
  ) => void;
}

export const StudentAssignments: React.FC<StudentAssignmentsProps> = ({
  assignments,
  submissions,
  studentId,
  onSubmitAssignment,
}) => {
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [viewingSubmission, setViewingSubmission] = useState<Submission | null>(null);

  // Map submissions by assignment ID
  const submissionMap = new Map<string, Submission>();
  submissions.forEach((s) => {
    submissionMap.set(s.assignmentId, s);
  });

  const handleAssessmentComplete = (
    assessment: AIAssessmentResult,
    audioUrl: string,
    durationSeconds: number
  ) => {
    if (selectedAssignment) {
      onSubmitAssignment(selectedAssignment, assessment, audioUrl, durationSeconds);
      setSelectedAssignment(null);
    }
  };

  // Recording an assignment
  if (selectedAssignment) {
    const activityAdapter: SpeakingActivity = {
      id: selectedAssignment.id,
      title: selectedAssignment.title,
      type: selectedAssignment.activityType,
      category: 'Teacher Assignment',
      promptText: selectedAssignment.prompt,
      prepTimeSeconds: 45,
      minDurationSeconds: 45,
      maxDurationSeconds: selectedAssignment.maxDurationSeconds || 120,
      difficulty: 'Intermediate',
      createdBy: selectedAssignment.teacherId,
      createdAt: selectedAssignment.createdAt,
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#7957E8] dark:text-[#A78BFA]">
          <span
            onClick={() => setSelectedAssignment(null)}
            className="hover:underline cursor-pointer"
          >
            ← Back to Assignments
          </span>
        </div>
        <AudioRecorderStudio
          activity={activityAdapter}
          onAssessmentComplete={handleAssessmentComplete}
          onCancel={() => setSelectedAssignment(null)}
          submitButtonText="Submit to Instructor"
        />
      </div>
    );
  }

  // Viewing graded submission details
  if (viewingSubmission) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => setViewingSubmission(null)}
          className="text-xs font-semibold text-[#7957E8] dark:text-[#A78BFA] hover:underline cursor-pointer"
        >
          ← Back to Assignments
        </button>

        <div className="rounded-3xl bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-black/5 dark:border-white/10">
            <div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                Evaluation Returned
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1D1D1F] dark:text-white mt-2">
                {viewingSubmission.assignmentTitle}
              </h2>
              <p className="text-xs text-[#6E6E73] dark:text-[#98989D] mt-1">
                Submitted on {new Date(viewingSubmission.submittedAt).toLocaleDateString()}
              </p>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#7957E8]/10 border border-[#7957E8]/20">
              <Award className="w-8 h-8 text-[#7957E8]" />
              <div>
                <div className="text-2xl sm:text-3xl font-mono font-bold text-[#7957E8]">
                  {viewingSubmission.teacherGrade ?? 90}
                  <span className="text-xs text-[#6E6E73] font-normal">/100</span>
                </div>
                <div className="text-[11px] font-medium text-[#6E6E73] dark:text-[#98989D]">
                  Teacher Grade
                </div>
              </div>
            </div>
          </div>

          {/* Teacher written feedback */}
          <div className="my-6 p-5 rounded-2xl bg-[#F5F5F7] dark:bg-[#2C2C2E]">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#6E6E73] dark:text-[#98989D] mb-2">
              Teacher's Personalized Feedback
            </h4>
            <p className="text-xs sm:text-sm text-[#1D1D1F] dark:text-white leading-relaxed italic">
              "{viewingSubmission.teacherFeedback || 'Great speaking effort! Natural pacing and sentence connections.'}"
            </p>
          </div>

          {/* Teacher Rubric Scores */}
          {viewingSubmission.teacherRubricScores && (
            <div className="my-6">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#6E6E73] dark:text-[#98989D] mb-3">
                Teacher Rubric Scores
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {Object.entries(viewingSubmission.teacherRubricScores).map(([key, val]) => (
                  <div key={key} className="p-3.5 rounded-2xl bg-[#F5F5F7] dark:bg-[#2C2C2E] text-center">
                    <span className="text-[11px] font-medium capitalize text-[#6E6E73] dark:text-[#98989D]">
                      {key}
                    </span>
                    <div className="text-xl font-mono font-bold text-[#7957E8] mt-1">{val}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Student Transcript */}
          {viewingSubmission.transcript && (
            <div className="my-6">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#6E6E73] dark:text-[#98989D] mb-2">
                Your Spoken Words
              </h4>
              <div className="p-4 rounded-2xl bg-[#F5F5F7] dark:bg-[#2C2C2E] text-xs sm:text-sm text-[#1D1D1F] dark:text-[#E5E5EA] leading-relaxed">
                "{viewingSubmission.transcript}"
              </div>
            </div>
          )}

          {/* AI Assessment Snapshot */}
          {viewingSubmission.aiAssessment && (
            <div className="mt-6 p-5 rounded-2xl bg-[#7957E8]/5 dark:bg-[#7957E8]/10 border border-[#7957E8]/15">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#7957E8] dark:text-[#A78BFA] mb-3">
                <Sparkles className="w-4 h-4" /> AI Speech Processing Summary
              </div>
              <p className="text-xs text-[#1D1D1F] dark:text-[#D1D1D6] leading-relaxed mb-3">
                {viewingSubmission.aiAssessment.detailedFeedback}
              </p>
              <div className="text-[11px] text-[#6E6E73] dark:text-[#8E8E93]">
                Estimated Spoken Cadence: <span className="font-mono font-bold text-[#7957E8]">{viewingSubmission.aiAssessment.speakingPaceWpm} WPM</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F] dark:text-white">
          Assigned Speaking Tasks
        </h1>
        <p className="text-xs sm:text-sm text-[#6E6E73] dark:text-[#98989D] mt-1">
          Complete mandatory audio assignments issued by your instructors, monitor deadlines, and view detailed rubric feedback.
        </p>
      </div>

      {/* Assignments List */}
      <div className="space-y-4">
        {assignments.map((assignment) => {
          const submission = submissionMap.get(assignment.id);
          const isSubmitted = !!submission;
          const isGraded = submission?.status === 'graded';
          const isNeedsRevision = submission?.status === 'needs_revision';

          return (
            <div
              key={assignment.id}
              className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-sm"
            >
              <div className="max-w-2xl">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-[#7957E8]/10 text-[#7957E8] dark:bg-[#7957E8]/20 dark:text-[#A78BFA]">
                    {assignment.targetClass || 'Cohort'}
                  </span>
                  <span className="text-xs text-[#6E6E73] dark:text-[#98989D] flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Due: {assignment.dueDate}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-[#1D1D1F] dark:text-white">
                  {assignment.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#6E6E73] dark:text-[#AEAEB2] mt-1.5 leading-relaxed line-clamp-2">
                  {assignment.prompt}
                </p>

                <div className="mt-3 flex items-center gap-4 text-xs text-[#6E6E73] dark:text-[#98989D]">
                  <span>Instructor: {assignment.teacherName}</span>
                  <span>•</span>
                  <span>Max Duration: {assignment.maxDurationSeconds}s</span>
                </div>
              </div>

              {/* Status & CTA */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
                {isGraded ? (
                  <button
                    onClick={() => setViewingSubmission(submission)}
                    className="px-5 py-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm font-semibold hover:bg-emerald-500/20 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Graded: {submission.teacherGrade}/100
                  </button>
                ) : isNeedsRevision ? (
                  <button
                    onClick={() => setSelectedAssignment(assignment)}
                    className="px-5 py-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs sm:text-sm font-semibold hover:bg-amber-500/20 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" /> Re-record Revision
                  </button>
                ) : isSubmitted ? (
                  <button
                    onClick={() => setViewingSubmission(submission)}
                    className="px-5 py-2.5 rounded-xl bg-[#F5F5F7] dark:bg-[#2C2C2E] text-[#1D1D1F] dark:text-white text-xs sm:text-sm font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <Clock className="w-4 h-4 text-[#7957E8]" /> Under Review
                  </button>
                ) : (
                  <button
                    onClick={() => setSelectedAssignment(assignment)}
                    className="px-6 py-2.5 rounded-xl bg-[#7957E8] text-white text-xs sm:text-sm font-semibold hover:bg-[#6C47E0] transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <Mic className="w-4 h-4" /> Record Spoken Response
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {assignments.length === 0 && (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10 text-xs sm:text-sm text-[#6E6E73] dark:text-[#98989D]">
            No pending assignments. Great job staying up to date!
          </div>
        )}
      </div>
    </div>
  );
};
