import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  Clock,
  Sparkles,
  Layers,
  Save,
  X,
} from 'lucide-react';
import { Course, CourseLesson, SpeakingLevel } from '../../types';

interface TeacherCourseManagementProps {
  courses: Course[];
  teacherId: string;
  teacherName: string;
  onCreateCourse: (course: Omit<Course, 'id' | 'createdAt'>) => void;
}

export const TeacherCourseManagement: React.FC<TeacherCourseManagementProps> = ({
  courses,
  teacherId,
  teacherName,
  onCreateCourse,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [level, setLevel] = useState<SpeakingLevel>('Intermediate');
  const [lessons, setLessons] = useState<Omit<CourseLesson, 'id'>[]>([
    {
      title: 'Unit 1: Spontaneous Fluency Drill',
      speakingObjective: 'Master unbroken sentence links and rhythmic pausing.',
      speakingTask: 'Record a 90-second speech on an unexpected personal experience.',
      durationMinutes: 15,
      order: 1,
    },
  ]);

  const addLesson = () => {
    setLessons([
      ...lessons,
      {
        title: `Unit ${lessons.length + 1}: Articulation & Nuance`,
        speakingObjective: 'Use advanced qualifying words and smooth transition phrases.',
        speakingTask: 'Present a 2-minute oral analysis of an opposing viewpoint.',
        durationMinutes: 20,
        order: lessons.length + 1,
      },
    ]);
  };

  const removeLesson = (index: number) => {
    setLessons(lessons.filter((_, i) => i !== index));
  };

  const updateLesson = (index: number, field: keyof Omit<CourseLesson, 'id'>, value: any) => {
    const updated = [...lessons];
    updated[index] = { ...updated[index], [field]: value };
    setLessons(updated);
  };

  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || lessons.length === 0) return;

    onCreateCourse({
      title: title.trim(),
      description: description.trim(),
      level,
      teacherId,
      teacherName,
      published: true,
      lessonCount: lessons.length,
      lessons: lessons.map((l, i) => ({ ...l, id: `les-${Date.now()}-${i}` })),
      enrolledStudentIds: ['demo-student-bloom'],
    });

    setShowCreateModal(false);
    setTitle('');
    setDescription('');
    setLevel('Intermediate');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F] dark:text-white">
            Speaking Course Management
          </h1>
          <p className="text-xs sm:text-sm text-[#6E6E73] dark:text-[#98989D] mt-1">
            Build and manage comprehensive speaking curricula. Every lesson couples clear vocal learning objectives with authentic audio recording tasks.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-2.5 rounded-2xl bg-[#7957E8] text-white text-xs sm:text-sm font-semibold hover:bg-[#6C47E0] transition-colors flex items-center gap-2 cursor-pointer shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Create Speaking Course
        </button>
      </div>

      {/* Courses List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10 flex flex-col justify-between shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-[#7957E8]/10 text-[#7957E8] dark:bg-[#7957E8]/20 dark:text-[#A78BFA]">
                  {course.level}
                </span>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  {course.published ? 'Published' : 'Draft'}
                </span>
              </div>

              <h3 className="text-lg font-bold text-[#1D1D1F] dark:text-white mb-2">
                {course.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#6E6E73] dark:text-[#AEAEB2] leading-relaxed mb-4 line-clamp-3">
                {course.description}
              </p>

              <div className="p-4 rounded-2xl bg-[#F5F5F7] dark:bg-[#2C2C2E] space-y-2 mb-4">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[#6E6E73] dark:text-[#98989D] flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#7957E8]" /> Included Speaking Lessons ({course.lessons.length})
                </div>
                {course.lessons.slice(0, 3).map((l, i) => (
                  <div key={i} className="text-xs text-[#1D1D1F] dark:text-[#E5E5EA] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7957E8]" />
                    <span className="font-medium truncate">{l.title}</span>
                  </div>
                ))}
                {course.lessons.length > 3 && (
                  <span className="text-[11px] text-[#6E6E73] dark:text-[#8E8E93] italic">
                    +{course.lessons.length - 3} more lessons
                  </span>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-xs text-[#6E6E73] dark:text-[#98989D]">
              <span>Instructor: {course.teacherName}</span>
              <span>Enrolled: {course.enrolledStudentIds?.length || 1} students</span>
            </div>
          </div>
        ))}
      </div>

      {/* Create Course Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#1C1C1E] border border-black/10 dark:border-white/10 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg sm:text-xl font-bold text-[#1D1D1F] dark:text-white">
                New Speaking Course
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-xl text-[#6E6E73] hover:text-[#1D1D1F] dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1D1D1F] dark:text-white mb-1">
                  Course Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Master Spontaneous English Fluency"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F5F5F7] dark:bg-[#2C2C2E] text-xs sm:text-sm text-[#1D1D1F] dark:text-white border border-transparent focus:border-[#7957E8] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1D1D1F] dark:text-white mb-1">
                  Proficiency Target
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value as SpeakingLevel)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F5F5F7] dark:bg-[#2C2C2E] text-xs sm:text-sm text-[#1D1D1F] dark:text-white border border-transparent focus:border-[#7957E8] focus:outline-none"
                >
                  <option value="Beginner">Beginner (A1 - A2)</option>
                  <option value="Intermediate">Intermediate (B1 - B2)</option>
                  <option value="Advanced">Advanced (C1 - C2)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1D1D1F] dark:text-white mb-1">
                  Course Overview & Speaking Philosophy
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Outline the vocal objectives, pacing goals, and core phonetics covered in this curriculum..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F5F5F7] dark:bg-[#2C2C2E] text-xs sm:text-sm text-[#1D1D1F] dark:text-white border border-transparent focus:border-[#7957E8] focus:outline-none"
                />
              </div>

              {/* Lesson Items */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-[#1D1D1F] dark:text-white">
                    Lessons & Speaking Drills ({lessons.length})
                  </label>
                  <button
                    type="button"
                    onClick={addLesson}
                    className="text-xs font-semibold text-[#7957E8] hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Lesson
                  </button>
                </div>

                <div className="space-y-3">
                  {lessons.map((lesson, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-[#F5F5F7] dark:bg-[#2C2C2E] space-y-2 relative"
                    >
                      {lessons.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeLesson(idx)}
                          className="absolute top-3 right-3 text-red-500 hover:text-red-700 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                      <input
                        type="text"
                        placeholder="Lesson Title"
                        value={lesson.title}
                        onChange={(e) => updateLesson(idx, 'title', e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#1C1C1E] text-xs font-semibold text-[#1D1D1F] dark:text-white border border-black/5"
                      />
                      <input
                        type="text"
                        placeholder="Speaking Objective (e.g. Master connected speech)"
                        value={lesson.speakingObjective}
                        onChange={(e) => updateLesson(idx, 'speakingObjective', e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#1C1C1E] text-xs text-[#1D1D1F] dark:text-white border border-black/5"
                      />
                      <textarea
                        rows={2}
                        placeholder="Speaking Task description"
                        value={lesson.speakingTask}
                        onChange={(e) => updateLesson(idx, 'speakingTask', e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#1C1C1E] text-xs text-[#1D1D1F] dark:text-white border border-black/5"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-black/5 dark:border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#6E6E73] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#7957E8] text-white text-xs font-semibold hover:bg-[#6C47E0] transition-colors cursor-pointer shadow-sm"
                >
                  Publish Speaking Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
