import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Play,
  Pause,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Award,
  Clock,
  Send,
  X,
  Volume2,
  Calendar,
} from 'lucide-react';
import { Assignment, Submission, RubricWeight } from '../../types';

interface TeacherAssignmentsProps {
  assignments: Assignment[];
  submissions: Submission[];
  teacherId: string;
  teacherName: string;
  onCreateAssignment: (assignment: Omit<Assignment, 'id' | 'createdAt'>) => void;
  onGradeSubmission: (
    submissionId: string,
    grade: number,
    feedback: string,
    rubricScores?: Submission['teacherRubricScores']
  ) => void;
  onRequestRevision: (submissionId: string, feedback: string) => void;
}

export const TeacherAssignments: React.FC<TeacherAssignmentsProps> = ({
  assignments,
  submissions,
  teacherId,
  teacherName,
  onCreateAssignment,
  onGradeSubmission,
  onRequestRevision,
}) => {
  const [activeTab, setActiveTab] = useState<'submissions' | 'assignments'>('submissions');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  // New assignment form state
  const [title, setTitle] = useState('');
  const [prompt, setPrompt] = useState('');
  const [dueDate, setDueDate] = useState('2026-10-30');
  const [targetClass, setTargetClass] = useState('Advanced Fluency Cohort B');
  const [maxDurationSeconds, setMaxDurationSeconds] = useState(120);

  // Grading modal state
  const [teacherGrade, setTeacherGrade] = useState<number>(92);
  const [teacherFeedback, setTeacherFeedback] = useState<string>('');
  const [rubricScores, setRubricScores] = useState({
    fluency: 92,
    pronunciation: 90,
    clarity: 94,
    vocabulary: 90,
    relevance: 95,
  });

  const handleOpenGrading = (sub: Submission) => {
    setSelectedSubmission(sub);
    setTeacherGrade(sub.teacherGrade || sub.aiAssessment?.overallScore || 90);
    setTeacherFeedback(sub.teacherFeedback || '');
    if (sub.teacherRubricScores) {
      setRubricScores(sub.teacherRubricScores);
    } else if (sub.aiAssessment) {
      setRubricScores({
        fluency: sub.aiAssessment.fluencyScore,
        pronunciation: sub.aiAssessment.pronunciationScore,
        clarity: sub.aiAssessment.clarityScore,
        vocabulary: sub.aiAssessment.vocabularyScore,
        relevance: sub.aiAssessment.relevanceScore,
      });
    }
  };

  const submitGrade = () => {
    if (!selectedSubmission) return;
    onGradeSubmission(selectedSubmission.id, teacherGrade, teacherFeedback, rubricScores);
    setSelectedSubmission(null);
  };

  const returnForRevision = () => {
    if (!selectedSubmission) return;
    onRequestRevision(selectedSubmission.id, teacherFeedback || 'Please record another attempt focusing on connected speech.');
    setSelectedSubmission(null);
  };

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !prompt.trim()) return;

    onCreateAssignment({
      title: title.trim(),
      prompt: prompt.trim(),
      dueDate,
      targetClass,
      teacherId,
      teacherName,
      activityType: 'presentation',
      assignedStudentIds: ['demo-student-bloom'],
      maxDurationSeconds,
      rubric: {
        fluencyWeight: 25,
        pronunciationWeight: 20,
        clarityWeight: 25,
        vocabularyWeight: 15,
        relevanceWeight: 15,
      },
    });

    setShowCreateModal(false);
    setTitle('');
    setPrompt('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F] dark:text-white">
            Assignment Management & Grading
          </h1>
          <p className="text-xs sm:text-sm text-[#6E6E73] dark:text-[#98989D] mt-1">
            Distribute speaking tasks, review students' recorded responses, inspect AI acoustic evaluations, and issue rubric grades.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-2.5 rounded-2xl bg-[#7957E8] text-white text-xs sm:text-sm font-semibold hover:bg-[#6C47E0] transition-colors flex items-center gap-2 cursor-pointer shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Create Speaking Assignment
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-black/5 dark:border-white/10 pb-3">
        <button
          onClick={() => setActiveTab('submissions')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'submissions'
              ? 'bg-[#7957E8] text-white shadow-sm'
              : 'text-[#6E6E73] dark:text-[#D1D1D6] hover:bg-black/5 dark:hover:bg-white/5'
          }`}
        >
          Student Submissions Queue ({submissions.length})
        </button>
        <button
          onClick={() => setActiveTab('assignments')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'assignments'
              ? 'bg-[#7957E8] text-white shadow-sm'
              : 'text-[#6E6E73] dark:text-[#D1D1D6] hover:bg-black/5 dark:hover:bg-white/5'
          }`}
        >
          Active Assignments ({assignments.length})
        </button>
      </div>

      {/* Submissions List */}
      {activeTab === 'submissions' && (
        <div className="space-y-4">
          {submissions.map((sub) => {
            const isGraded = sub.status === 'graded';
            return (
              <div
                key={sub.id}
                className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-sm"
              >
                <div className="max-w-2xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`px-3 py-0.5 rounded-full text-xs font-semibold ${
                        isGraded
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : sub.status === 'needs_revision'
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                          : 'bg-[#7957E8]/10 text-[#7957E8] dark:bg-[#7957E8]/20 dark:text-[#A78BFA]'
                      }`}
                    >
                      {isGraded ? `Graded: ${sub.teacherGrade}/100` : sub.status === 'needs_revision' ? 'Revision Requested' : 'Awaiting Grading'}
                    </span>
                    <span className="text-xs text-[#6E6E73] dark:text-[#98989D]">
                      Submitted by {sub.studentName} ({sub.durationSeconds}s)
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-[#1D1D1F] dark:text-white">
                    {sub.assignmentTitle}
                  </h3>

                  {sub.transcript && (
                    <p className="text-xs text-[#6E6E73] dark:text-[#AEAEB2] mt-1.5 italic line-clamp-2">
                      "{sub.transcript}"
                    </p>
                  )}

                  {sub.teacherFeedback && (
                    <div className="mt-3 p-3 rounded-xl bg-[#F5F5F7] dark:bg-[#2C2C2E] text-xs text-[#1D1D1F] dark:text-white">
                      <span className="font-semibold text-[#7957E8]">Teacher note:</span> "{sub.teacherFeedback}"
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => handleOpenGrading(sub)}
                    className="px-5 py-2.5 rounded-xl bg-[#7957E8] text-white text-xs sm:text-sm font-semibold hover:bg-[#6C47E0] transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <Award className="w-4 h-4" /> {isGraded ? 'Update Grade & Feedback' : 'Grade & Rubric Review'}
                  </button>
                </div>
              </div>
            );
          })}

          {submissions.length === 0 && (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10 text-xs sm:text-sm text-[#6E6E73] dark:text-[#98989D]">
              No submissions recorded yet.
            </div>
          )}
        </div>
      )}

      {/* Assignments List */}
      {activeTab === 'assignments' && (
        <div className="space-y-4">
          {assignments.map((assign) => (
            <div
              key={assign.id}
              className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-sm"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-[#7957E8]/10 text-[#7957E8]">
                    {assign.targetClass}
                  </span>
                  <span className="text-xs text-[#6E6E73] dark:text-[#98989D] flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Due {assign.dueDate}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#1D1D1F] dark:text-white">
                  {assign.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#6E6E73] dark:text-[#AEAEB2] mt-1 max-w-xl">
                  {assign.prompt}
                </p>
              </div>

              <div className="text-xs text-[#6E6E73] dark:text-[#98989D]">
                Max duration: {assign.maxDurationSeconds}s
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Grading & Rubric Review Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#1C1C1E] border border-black/10 dark:border-white/10 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <div>
                <span className="text-xs font-semibold text-[#7957E8]">Instructor Rubric Evaluation</span>
                <h3 className="text-lg sm:text-xl font-bold text-[#1D1D1F] dark:text-white">
                  Grading: {selectedSubmission.studentName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="p-1 rounded-xl text-[#6E6E73] hover:text-[#1D1D1F] dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Transcript review */}
            {selectedSubmission.transcript && (
              <div className="mb-5 p-4 rounded-2xl bg-[#F5F5F7] dark:bg-[#2C2C2E] border border-black/5">
                <h4 className="text-xs font-semibold text-[#6E6E73] dark:text-[#98989D] uppercase tracking-wider mb-1">
                  Student Speech Transcript
                </h4>
                <p className="text-xs sm:text-sm text-[#1D1D1F] dark:text-white italic">
                  "{selectedSubmission.transcript}"
                </p>
              </div>
            )}

            {/* AI Automated Analysis snapshot */}
            {selectedSubmission.aiAssessment && (
              <div className="mb-5 p-4 rounded-2xl bg-[#7957E8]/5 dark:bg-[#7957E8]/10 border border-[#7957E8]/20">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#7957E8] dark:text-[#A78BFA] mb-1">
                  <Sparkles className="w-3.5 h-3.5" /> AI Diagnostic Benchmark
                </div>
                <p className="text-xs text-[#1D1D1F] dark:text-[#E5E5EA]">
                  {selectedSubmission.aiAssessment.detailedFeedback}
                </p>
                <div className="mt-2 text-[11px] text-[#6E6E73] dark:text-[#98989D]">
                  Estimated Pace: <span className="font-mono font-bold text-[#7957E8]">{selectedSubmission.aiAssessment.speakingPaceWpm} WPM</span>
                </div>
              </div>
            )}

            {/* Rubric Score Sliders */}
            <div className="space-y-3 mb-5">
              <h4 className="text-xs font-semibold text-[#1D1D1F] dark:text-white uppercase tracking-wider">
                Customizable Rubric Criteria
              </h4>

              {[
                { key: 'fluency', label: 'Fluency & Speech Continuity' },
                { key: 'pronunciation', label: 'Pronunciation & Intelligibility' },
                { key: 'clarity', label: 'Clarity & Organization' },
                { key: 'vocabulary', label: 'Spoken Vocabulary Selection' },
                { key: 'relevance', label: 'Prompt Relevance & Depth' },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between gap-4 p-3 rounded-xl bg-[#F5F5F7] dark:bg-[#2C2C2E]">
                  <span className="text-xs font-medium text-[#1D1D1F] dark:text-white">{label}</span>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={50}
                      max={100}
                      value={(rubricScores as any)[key]}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setRubricScores({ ...rubricScores, [key]: val });
                        // Recalculate average grade
                        const updated = { ...rubricScores, [key]: val };
                        const avg = Math.round(
                          (updated.fluency + updated.pronunciation + updated.clarity + updated.vocabulary + updated.relevance) / 5
                        );
                        setTeacherGrade(avg);
                      }}
                      className="w-28 sm:w-36 accent-[#7957E8]"
                    />
                    <span className="w-8 text-right font-mono font-bold text-xs text-[#7957E8]">
                      {(rubricScores as any)[key]}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Overall Final Grade Input */}
            <div className="mb-5 flex items-center justify-between p-4 rounded-2xl bg-[#7957E8]/10 border border-[#7957E8]/20">
              <span className="text-xs sm:text-sm font-bold text-[#1D1D1F] dark:text-white">
                Calculated Final Grade (out of 100)
              </span>
              <input
                type="number"
                min={0}
                max={100}
                value={teacherGrade}
                onChange={(e) => setTeacherGrade(Number(e.target.value))}
                className="w-20 px-3 py-1.5 rounded-xl bg-white dark:bg-[#1C1C1E] text-center font-mono font-bold text-base text-[#7957E8] border border-black/10"
              />
            </div>

            {/* Teacher Written Feedback */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-[#1D1D1F] dark:text-white mb-1.5">
                Teacher Feedback & Guidance
              </label>
              <textarea
                rows={3}
                value={teacherFeedback}
                onChange={(e) => setTeacherFeedback(e.target.value)}
                placeholder="Give constructive pointers on phrasing, phonetics, and vocal confidence..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#F5F5F7] dark:bg-[#2C2C2E] text-xs sm:text-sm text-[#1D1D1F] dark:text-white border border-transparent focus:border-[#7957E8] focus:outline-none"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-3 pt-4 border-t border-black/5 dark:border-white/10">
              <button
                type="button"
                onClick={returnForRevision}
                className="px-4 py-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold hover:bg-amber-500/20 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Request Re-record Attempt
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedSubmission(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#6E6E73] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={submitGrade}
                  className="px-6 py-2.5 rounded-xl bg-[#7957E8] text-white text-xs sm:text-sm font-semibold hover:bg-[#6C47E0] transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4" /> Save Grade & Feedback
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Assignment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#1C1C1E] border border-black/10 dark:border-white/10 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-[#1D1D1F] dark:text-white">
                Create Speaking Assignment
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-xl text-[#6E6E73] hover:text-[#1D1D1F] dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1D1D1F] dark:text-white mb-1">
                  Assignment Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Oral Presentation: Emerging Technologies"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F5F5F7] dark:bg-[#2C2C2E] text-xs sm:text-sm text-[#1D1D1F] dark:text-white border border-transparent focus:border-[#7957E8] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1D1D1F] dark:text-white mb-1">
                  Speaking Prompt
                </label>
                <textarea
                  required
                  rows={4}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Detail the speaking mandate, target duration, and required arguments..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F5F5F7] dark:bg-[#2C2C2E] text-xs sm:text-sm text-[#1D1D1F] dark:text-white border border-transparent focus:border-[#7957E8] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1D1D1F] dark:text-white mb-1">
                    Target Cohort / Class
                  </label>
                  <input
                    type="text"
                    value={targetClass}
                    onChange={(e) => setTargetClass(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F5F5F7] dark:bg-[#2C2C2E] text-xs sm:text-sm text-[#1D1D1F] dark:text-white border border-transparent focus:border-[#7957E8] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1D1D1F] dark:text-white mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F5F5F7] dark:bg-[#2C2C2E] text-xs sm:text-sm text-[#1D1D1F] dark:text-white border border-transparent focus:border-[#7957E8] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-black/5 dark:border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#6E6E73] hover:bg-black/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#7957E8] text-white text-xs font-semibold hover:bg-[#6C47E0] transition-colors cursor-pointer shadow-sm"
                >
                  Issue Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
