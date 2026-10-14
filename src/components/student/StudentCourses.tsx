import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Mic,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Award,
} from 'lucide-react';
import { Course, CourseLesson, SpeakingActivity } from '../../types';

interface StudentCoursesProps {
  courses: Course[];
  studentId: string;
  onEnroll: (courseId: string) => void;
  onStartLessonTask: (lesson: CourseLesson, course: Course) => void;
}

export const StudentCourses: React.FC<StudentCoursesProps> = ({
  courses,
  studentId,
  onEnroll,
  onStartLessonTask,
}) => {
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(courses[0]?.id || null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F] dark:text-white">
          Speaking Courses & Curricula
        </h1>
        <p className="text-xs sm:text-sm text-[#6E6E73] dark:text-[#98989D] mt-1">
          Structured vocal courses designed by your instructors. Every single lesson contains a verified speaking objective and a mandatory recording drill.
        </p>
      </div>

      {/* Courses List */}
      <div className="space-y-5">
        {courses.map((course) => {
          const isEnrolled = course.enrolledStudentIds.includes(studentId);
          const isExpanded = expandedCourseId === course.id;

          return (
            <div
              key={course.id}
              className="rounded-3xl bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10 overflow-hidden shadow-sm"
            >
              {/* Course Header Banner */}
              <div className="p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-[#7957E8]/10 text-[#7957E8] dark:bg-[#7957E8]/20 dark:text-[#A78BFA]">
                      {course.level} Level
                    </span>
                    <span className="text-xs text-[#6E6E73] dark:text-[#98989D]">
                      {course.lessons.length} speaking lessons • Teacher: {course.teacherName}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#1D1D1F] dark:text-white">
                    {course.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6E6E73] dark:text-[#AEAEB2] mt-1.5 leading-relaxed">
                    {course.description}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {!isEnrolled ? (
                    <button
                      onClick={() => onEnroll(course.id)}
                      className="px-5 py-2.5 rounded-xl bg-[#7957E8] text-white text-xs sm:text-sm font-semibold hover:bg-[#6C47E0] transition-colors cursor-pointer shadow-sm"
                    >
                      Enroll in Course
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl">
                      <CheckCircle2 className="w-4 h-4" /> Enrolled
                    </span>
                  )}

                  <button
                    onClick={() => setExpandedCourseId(isExpanded ? null : course.id)}
                    className="p-2.5 rounded-xl bg-[#F5F5F7] dark:bg-[#2C2C2E] text-[#1D1D1F] dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                    title={isExpanded ? 'Collapse lessons' : 'View lessons'}
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Lesson Dropdown */}
              {isExpanded && (
                <div className="border-t border-black/5 dark:border-white/10 bg-[#F5F5F7]/50 dark:bg-[#2C2C2E]/40 p-6 sm:p-7 space-y-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#6E6E73] dark:text-[#98989D] mb-3">
                    Course Lessons & Speaking Objectives
                  </h4>

                  <div className="space-y-3">
                    {course.lessons.map((lesson, idx) => (
                      <div
                        key={lesson.id}
                        className="p-5 rounded-2xl bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="flex items-start gap-3.5">
                          <div className="w-8 h-8 rounded-xl bg-[#7957E8]/10 text-[#7957E8] dark:bg-[#7957E8]/20 dark:text-[#A78BFA] flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">
                            {idx + 1}
                          </div>
                          <div>
                            <h5 className="text-sm sm:text-base font-bold text-[#1D1D1F] dark:text-white">
                              {lesson.title}
                            </h5>
                            <div className="mt-1 space-y-1">
                              <p className="text-xs text-[#7957E8] dark:text-[#A78BFA] font-medium flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 shrink-0" /> Objective: {lesson.speakingObjective}
                              </p>
                              <p className="text-xs text-[#6E6E73] dark:text-[#98989D]">
                                Task: {lesson.speakingTask}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                          <span className="text-xs text-[#6E6E73] dark:text-[#8E8E93] flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> ~{lesson.durationMinutes}m
                          </span>
                          <button
                            onClick={() => onStartLessonTask(lesson, course)}
                            className="px-4 py-2 rounded-xl bg-[#7957E8] hover:bg-[#6C47E0] text-white text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                          >
                            <Mic className="w-3.5 h-3.5" /> Record Drill
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
