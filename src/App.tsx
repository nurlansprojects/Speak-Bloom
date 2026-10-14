import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Mic,
  LayoutDashboard,
  BookOpen,
  FileCheck,
  TrendingUp,
  Bot,
  Users,
  Settings,
  Menu,
  X,
  Moon,
  Sun,
  LogOut,
  Sliders,
  Shield,
  Loader2,
  GraduationCap,
  PlusCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AuthProvider, useAuth } from './context/AuthContext';
import { dataService } from './services/dataService';
import {
  SpeakingActivity,
  Course,
  Assignment,
  Submission,
  PracticeSession,
  CourseLesson,
  AIAssessmentResult,
} from './types';

// Auth Screen
import { AuthScreen } from './components/auth/AuthScreen';

// Student views
import { StudentOverview } from './components/student/StudentOverview';
import { StudentPractice } from './components/student/StudentPractice';
import { StudentCourses } from './components/student/StudentCourses';
import { StudentAssignments } from './components/student/StudentAssignments';
import { StudentProgress } from './components/student/StudentProgress';
import { AICoachInteractive } from './components/student/AICoachInteractive';

// Teacher views
import { TeacherOverview } from './components/teacher/TeacherOverview';
import { TeacherCourseManagement } from './components/teacher/TeacherCourseManagement';
import { TeacherActivityBuilder } from './components/teacher/TeacherActivityBuilder';
import { TeacherAssignments } from './components/teacher/TeacherAssignments';
import { TeacherStudents } from './components/teacher/TeacherStudents';
import { TeacherAnalytics } from './components/teacher/TeacherAnalytics';
import { TeacherPendingScreen } from './components/teacher/TeacherPendingScreen';

// Admin view
import { AdminDashboard } from './components/admin/AdminDashboard';

// Modals
import { ProfileSettingsModal } from './components/common/ProfileSettingsModal';
import { AudioRecorderStudio } from './components/audio/AudioRecorderStudio';
import { SpeakingFeedbackCard } from './components/audio/SpeakingFeedbackCard';

function MainApp() {
  const { currentUser, profile, loading, logOut } = useAuth();

  // Dark mode
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Navigation tab
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Perspective override for Admin testing
  const [adminPerspective, setAdminPerspective] = useState<'admin' | 'teacher' | 'student'>('admin');
  const [dismissPendingView, setDismissPendingView] = useState(false);

  // Modals
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Data state strictly isolated to current authenticated user
  const [activities, setActivities] = useState<SpeakingActivity[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [practiceSessions, setPracticeSessions] = useState<PracticeSession[]>([]);

  // Active studio modal drill
  const [directStudioActivity, setDirectStudioActivity] = useState<SpeakingActivity | null>(null);
  const [directStudioResult, setDirectStudioResult] = useState<{
    result: AIAssessmentResult;
    audioUrl: string;
  } | null>(null);

  // Sync dark class on body
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Load isolated user data strictly when authenticated
  useEffect(() => {
    if (!profile?.uid) {
      // Clear all user-specific data on logout
      setSubmissions([]);
      setPracticeSessions([]);
      return;
    }

    async function loadUserData() {
      const [acts, crs, asg, subs, prs] = await Promise.all([
        dataService.getActivities(),
        dataService.getCourses(),
        dataService.getAssignments(),
        profile?.role === 'teacher' || profile?.role === 'admin'
          ? dataService.getAllSubmissions()
          : dataService.getSubmissionsForStudent(profile!.uid),
        dataService.getPracticeSessions(profile!.uid),
      ]);
      setActivities(acts);
      setCourses(crs);
      setAssignments(asg);
      setSubmissions(subs);
      setPracticeSessions(prs);
    }
    loadUserData();
  }, [profile?.uid, profile?.role]);

  // Reset tab on role switch
  useEffect(() => {
    setActiveTab('overview');
  }, [profile?.role, adminPerspective]);

  // Confetti helper
  const triggerConfetti = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#7957E8', '#A78BFA', '#F3F0FF', '#10B981'],
    });
  };

  // Student Actions
  const handleCompletePractice = async (
    activity: SpeakingActivity,
    assessment: AIAssessmentResult,
    durationSeconds: number
  ) => {
    if (!profile) return;
    const session = await dataService.savePracticeSession({
      studentId: profile.uid,
      activityId: activity.id,
      activityTitle: activity.title,
      activityType: activity.type,
      durationSeconds,
      transcript: assessment.transcript,
      aiAssessment: assessment,
      completedAt: new Date().toISOString(),
    });
    setPracticeSessions((prev) => [session, ...prev]);
    triggerConfetti();
  };

  const handleEnrollCourse = async (courseId: string) => {
    if (!profile) return;
    await dataService.enrollCourse(courseId, profile.uid);
    setCourses((prev) =>
      prev.map((c) =>
        c.id === courseId
          ? { ...c, enrolledStudentIds: [...c.enrolledStudentIds, profile.uid] }
          : c
      )
    );
    triggerConfetti();
  };

  const handleStartLessonTask = (lesson: CourseLesson, course: Course) => {
    const activity: SpeakingActivity = {
      id: lesson.id,
      title: `${course.title}: ${lesson.title}`,
      type: 'presentation',
      category: 'Course Lesson Drill',
      promptText: `${lesson.speakingObjective}\n\nTask: ${lesson.speakingTask}`,
      prepTimeSeconds: 45,
      minDurationSeconds: 45,
      maxDurationSeconds: 150,
      difficulty: course.level,
      createdBy: course.teacherId,
      createdAt: new Date().toISOString(),
    };
    setDirectStudioActivity(activity);
  };

  const handleSubmitAssignment = async (
    assignment: Assignment,
    assessment: AIAssessmentResult,
    audioUrl: string,
    durationSeconds: number
  ) => {
    if (!profile) return;
    const sub = await dataService.createSubmission({
      assignmentId: assignment.id,
      assignmentTitle: assignment.title,
      studentId: profile.uid,
      studentName: profile.displayName || 'User',
      studentEmail: profile.email,
      teacherId: assignment.teacherId,
      audioUrl,
      durationSeconds,
      status: 'submitted',
      transcript: assessment.transcript,
      aiAssessment: assessment,
      submittedAt: new Date().toISOString(),
    });
    setSubmissions((prev) => [sub, ...prev]);
    triggerConfetti();
  };

  // Teacher Actions
  const handleCreateCourse = async (courseData: Omit<Course, 'id' | 'createdAt'>) => {
    const created = await dataService.createCourse(courseData);
    setCourses((prev) => [created, ...prev]);
    triggerConfetti();
  };

  const handleCreateActivity = async (actData: Omit<SpeakingActivity, 'id' | 'createdAt'>) => {
    const created = await dataService.createActivity(actData);
    setActivities((prev) => [created, ...prev]);
    triggerConfetti();
  };

  const handleCreateAssignment = async (asgData: Omit<Assignment, 'id' | 'createdAt'>) => {
    const created = await dataService.createAssignment(asgData);
    setAssignments((prev) => [created, ...prev]);
    triggerConfetti();
  };

  const handleGradeSubmission = async (
    submissionId: string,
    grade: number,
    feedback: string,
    rubricScores?: Submission['teacherRubricScores']
  ) => {
    await dataService.gradeSubmission(submissionId, grade, feedback, rubricScores);
    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === submissionId
          ? {
              ...s,
              status: 'graded',
              teacherGrade: grade,
              teacherFeedback: feedback,
              teacherRubricScores: rubricScores,
              gradedAt: new Date().toISOString(),
            }
          : s
      )
    );
    triggerConfetti();
  };

  const handleRequestRevision = async (submissionId: string, feedback: string) => {
    await dataService.requestRevision(submissionId, feedback);
    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === submissionId
          ? {
              ...s,
              status: 'needs_revision',
              teacherFeedback: feedback,
              gradedAt: new Date().toISOString(),
            }
          : s
      )
    );
  };

  // 1. Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] dark:bg-[#000000] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-[#7957E8]/10 text-[#7957E8] flex items-center justify-center mb-4">
          <Loader2 className="w-6 h-6 animate-spin text-[#7957E8]" />
        </div>
        <h2 className="text-base font-bold text-[#1D1D1F] dark:text-white">Connecting to Speak Bloom</h2>
        <p className="text-xs text-[#6E6E73] dark:text-[#98989D] mt-1">Verifying Google authentication session...</p>
      </div>
    );
  }

  // 2. Unauthenticated: Strictly require authentication. No demo/guest mode.
  if (!currentUser || !profile) {
    return <AuthScreen />;
  }

  // 3. Pending Teacher State
  if (profile.teacherStatus === 'pending' && profile.role !== 'teacher' && profile.role !== 'admin' && !dismissPendingView) {
    return (
      <TeacherPendingScreen
        onContinueAsStudent={() => setDismissPendingView(true)}
      />
    );
  }

  // Determine active view mode
  const effectiveRole = profile.role === 'admin' ? adminPerspective : profile.role;
  const isTeacherView = effectiveRole === 'teacher';
  const isAdminView = effectiveRole === 'admin';

  interface NavItem {
    id: string;
    label: string;
    icon: any;
    badge?: string;
  }

  // Navigation Items
  const studentNav: NavItem[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'practice', label: 'Speaking Practice', icon: Mic },
    { id: 'coach', label: 'AI Speaking Coach', icon: Bot, badge: 'Live' },
    { id: 'courses', label: 'My Courses', icon: BookOpen },
    { id: 'assignments', label: 'Assignments', icon: FileCheck },
    { id: 'progress', label: 'My Progress', icon: TrendingUp },
  ];

  const teacherNav: NavItem[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'courses', label: 'Course Management', icon: BookOpen },
    { id: 'builder', label: 'Activity Builder', icon: PlusCircle },
    { id: 'assignments', label: 'Assignment Queue', icon: FileCheck },
    { id: 'students', label: 'Student Cohorts', icon: Users },
    { id: 'analytics', label: 'Rubric Analytics', icon: TrendingUp },
  ];

  const adminNav: NavItem[] = [
    { id: 'overview', label: 'Admin Command', icon: Shield },
    { id: 'courses', label: 'All Courses', icon: BookOpen },
    { id: 'assignments', label: 'Submissions Queue', icon: FileCheck },
    { id: 'analytics', label: 'Platform Analytics', icon: TrendingUp },
  ];

  const currentNav = isAdminView ? adminNav : isTeacherView ? teacherNav : studentNav;

  // Real user display info
  const displayName = profile.displayName || currentUser.displayName || 'User';
  const userPhoto = profile.photoURL || currentUser.photoURL;

  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-[#000000] text-[#1D1D1F] dark:text-[#F5F5F7] flex flex-col font-sans transition-colors duration-200">
      {/* Top Application Bar */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-md border-b border-black/5 dark:border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-[#1D1D1F] dark:text-white hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Logo */}
          <div
            onClick={() => setActiveTab('overview')}
            className="flex items-center gap-2.5 cursor-pointer select-none"
          >
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#7957E8] to-[#9A7DFA] text-white flex items-center justify-center shadow-sm">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base sm:text-lg font-extrabold tracking-tight text-[#1D1D1F] dark:text-white">
                Speak Bloom
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#7957E8]/10 text-[#7957E8] dark:bg-[#7957E8]/20 dark:text-[#A78BFA]">
                {isAdminView ? 'Admin' : isTeacherView ? 'Teacher Dashboard' : 'Student Dashboard'}
              </span>
            </div>
          </div>
        </div>

        {/* Top Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Admin Perspective Switcher */}
          {profile.role === 'admin' && (
            <div className="hidden sm:flex items-center bg-black/5 dark:bg-white/10 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setAdminPerspective('admin')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  adminPerspective === 'admin' ? 'bg-[#7957E8] text-white' : 'text-[#6E6E73] dark:text-white'
                }`}
              >
                Admin
              </button>
              <button
                onClick={() => setAdminPerspective('teacher')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  adminPerspective === 'teacher' ? 'bg-[#7957E8] text-white' : 'text-[#6E6E73] dark:text-white'
                }`}
              >
                Teacher
              </button>
              <button
                onClick={() => setAdminPerspective('student')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  adminPerspective === 'student' ? 'bg-[#7957E8] text-white' : 'text-[#6E6E73] dark:text-white'
                }`}
              >
                Student
              </button>
            </div>
          )}

          {/* Theme Switcher */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2.5 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-black/10 text-[#6E6E73] dark:text-white transition-colors cursor-pointer"
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Genuine User Profile Avatar Button */}
          <button
            onClick={() => setIsProfileModalOpen(true)}
            className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-2xl bg-[#7957E8]/10 hover:bg-[#7957E8]/20 text-[#7957E8] dark:bg-[#7957E8]/20 dark:text-[#A78BFA] transition-colors cursor-pointer"
            title="Profile & Settings"
          >
            {userPhoto ? (
              <img
                src={userPhoto}
                alt={displayName}
                className="w-7 h-7 rounded-xl object-cover border border-[#7957E8]/30"
              />
            ) : (
              <div className="w-7 h-7 rounded-xl bg-[#7957E8] text-white flex items-center justify-center text-xs font-bold">
                {displayName[0] || 'U'}
              </div>
            )}
            <span className="hidden md:inline text-xs font-semibold text-[#1D1D1F] dark:text-white truncate max-w-[130px]">
              {displayName}
            </span>
          </button>

          {/* Explicit Sign Out Button */}
          <button
            onClick={logOut}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl text-xs font-semibold text-[#6E6E73] dark:text-[#98989D] hover:text-red-600 dark:hover:text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Sign out of account"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Layout Body */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6 sm:gap-8">
        {/* Desktop Collapsible Navigation Sidebar */}
        <aside
          className={`hidden md:flex flex-col justify-between shrink-0 transition-all duration-300 ${
            isSidebarCollapsed ? 'w-20' : 'w-64'
          }`}
        >
          <div className="space-y-1.5">
            {currentNav.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#7957E8] text-white shadow-sm'
                      : 'text-[#6E6E73] dark:text-[#AEAEB2] hover:bg-white dark:hover:bg-[#1C1C1E] hover:text-[#1D1D1F] dark:hover:text-white'
                  }`}
                  title={item.label}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-[#6E6E73] dark:text-[#AEAEB2]'}`} />
                  {!isSidebarCollapsed && (
                    <span className="flex-1 text-left flex items-center justify-between">
                      {item.label}
                      {item.badge && (
                        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white uppercase">
                          {item.badge}
                        </span>
                      )}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Sidebar Footer Controls */}
          <div className="pt-6 border-t border-black/5 dark:border-white/10 space-y-2">
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-semibold text-[#6E6E73] dark:text-[#AEAEB2] hover:bg-white dark:hover:bg-[#1C1C1E] transition-colors cursor-pointer"
            >
              <Settings className="w-4 h-4 shrink-0" />
              {!isSidebarCollapsed && <span>Profile & Settings</span>}
            </button>
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-[11px] text-[#6E6E73] dark:text-[#8E8E93] hover:text-[#1D1D1F] dark:hover:text-white transition-colors cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" />
              {!isSidebarCollapsed && <span>{isSidebarCollapsed ? 'Expand' : 'Collapse Sidebar'}</span>}
            </button>
          </div>
        </aside>

        {/* Mobile Slide-out Menu */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden bg-black/40 backdrop-blur-sm flex">
            <div className="bg-white dark:bg-[#1C1C1E] w-72 h-full p-6 flex flex-col justify-between shadow-2xl">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-black/5 dark:border-white/10 mb-4">
                  <span className="text-base font-extrabold text-[#7957E8]">Speak Bloom</span>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1 rounded-lg text-[#6E6E73] cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-1">
                  {currentNav.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                          isActive
                            ? 'bg-[#7957E8] text-white'
                            : 'text-[#6E6E73] dark:text-[#AEAEB2] hover:bg-black/5'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-black/5 dark:border-white/10 space-y-2">
                <button
                  onClick={() => {
                    setIsProfileModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#7957E8]/10 text-[#7957E8] text-xs font-semibold text-center cursor-pointer"
                >
                  Settings ({displayName})
                </button>
                <button
                  onClick={logOut}
                  className="w-full py-2 rounded-xl text-xs text-red-600 font-semibold text-center cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Primary Content View Container */}
        <main className="flex-1 min-w-0">
          {/* Admin Dashboard */}
          {isAdminView && (
            <AdminDashboard
              onSwitchPerspective={(persp) => setAdminPerspective(persp)}
            />
          )}

          {/* Student Dashboard Views */}
          {!isAdminView && !isTeacherView && (
            <>
              {activeTab === 'overview' && (
                <StudentOverview
                  profile={profile}
                  submissions={submissions.filter((s) => s.studentId === profile.uid)}
                  practiceSessions={practiceSessions}
                  activities={activities}
                  onStartPractice={(act) => setDirectStudioActivity(act)}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                />
              )}
              {activeTab === 'practice' && (
                <StudentPractice
                  activities={activities}
                  onCompletePractice={handleCompletePractice}
                />
              )}
              {activeTab === 'coach' && <AICoachInteractive />}
              {activeTab === 'courses' && (
                <StudentCourses
                  courses={courses}
                  studentId={profile.uid}
                  onEnroll={handleEnrollCourse}
                  onStartLessonTask={handleStartLessonTask}
                />
              )}
              {activeTab === 'assignments' && (
                <StudentAssignments
                  assignments={assignments}
                  submissions={submissions.filter((s) => s.studentId === profile.uid)}
                  studentId={profile.uid}
                  onSubmitAssignment={handleSubmitAssignment}
                />
              )}
              {activeTab === 'progress' && (
                <StudentProgress
                  submissions={submissions.filter((s) => s.studentId === profile.uid)}
                  practiceSessions={practiceSessions}
                />
              )}
            </>
          )}

          {/* Teacher Dashboard Views */}
          {!isAdminView && isTeacherView && (
            <>
              {activeTab === 'overview' && (
                <TeacherOverview
                  courses={courses}
                  assignments={assignments}
                  submissions={submissions}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                  onReviewSubmission={() => setActiveTab('assignments')}
                />
              )}
              {activeTab === 'courses' && (
                <TeacherCourseManagement
                  courses={courses}
                  teacherId={profile.uid}
                  teacherName={profile.displayName || 'Instructor'}
                  onCreateCourse={handleCreateCourse}
                />
              )}
              {activeTab === 'builder' && (
                <TeacherActivityBuilder
                  teacherId={profile.uid}
                  onSaveActivity={handleCreateActivity}
                  existingActivities={activities}
                />
              )}
              {activeTab === 'assignments' && (
                <TeacherAssignments
                  assignments={assignments}
                  submissions={submissions}
                  teacherId={profile.uid}
                  teacherName={profile.displayName || 'Instructor'}
                  onCreateAssignment={handleCreateAssignment}
                  onGradeSubmission={handleGradeSubmission}
                  onRequestRevision={handleRequestRevision}
                />
              )}
              {activeTab === 'students' && (
                <TeacherStudents
                  submissions={submissions}
                  practiceSessions={practiceSessions}
                />
              )}
              {activeTab === 'analytics' && <TeacherAnalytics submissions={submissions} />}
            </>
          )}
        </main>
      </div>

      {/* Direct Recording Studio Modal (e.g. from Overview or Course lesson) */}
      {directStudioActivity && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {directStudioResult ? (
              <SpeakingFeedbackCard
                assessment={directStudioResult.result}
                audioUrl={directStudioResult.audioUrl}
                onTryAgain={() => setDirectStudioResult(null)}
                onContinue={() => {
                  setDirectStudioActivity(null);
                  setDirectStudioResult(null);
                }}
              />
            ) : (
              <AudioRecorderStudio
                activity={directStudioActivity}
                onAssessmentComplete={(res, url, dur) => {
                  handleCompletePractice(directStudioActivity, res, dur);
                  setDirectStudioResult({ result: res, audioUrl: url });
                }}
                onCancel={() => setDirectStudioActivity(null)}
                submitButtonText="Evaluate Speaking Response"
              />
            )}
          </div>
        </div>
      )}

      {/* Footer with Mandatory Author Copyright */}
      <footer className="mt-auto py-8 px-4 sm:px-8 border-t border-black/5 dark:border-white/10 bg-white/50 dark:bg-[#1C1C1E]/50 backdrop-blur-sm text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6E6E73] dark:text-[#8E8E93]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#1D1D1F] dark:text-white">Speak Bloom</span>
            <span>•</span>
            <span>Dedicated English Speaking Learning Platform</span>
          </div>

          {/* EXACT MANDATORY COPYRIGHT STRING */}
          <div className="font-normal text-[11px] sm:text-xs tracking-tight">
            © 2026 Jamalova Ummikhabiba. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Profile & Settings Modal */}
      <ProfileSettingsModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
