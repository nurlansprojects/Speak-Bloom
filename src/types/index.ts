export type UserRole = 'student' | 'teacher' | 'admin';
export type TeacherApplicationStatus = 'none' | 'pending' | 'approved' | 'rejected';

export type SpeakingLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type ActivityType =
  | 'discussion'
  | 'picture_description'
  | 'storytelling'
  | 'role_play'
  | 'interview'
  | 'presentation'
  | 'timed_challenge';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  teacherStatus?: TeacherApplicationStatus;
  photoURL?: string;
  dailyGoalMinutes: number;
  streakDays: number;
  lastPracticeDate?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CourseLesson {
  id: string;
  title: string;
  speakingObjective: string;
  speakingTask: string;
  durationMinutes: number;
  order: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  level: SpeakingLevel;
  teacherId: string;
  teacherName: string;
  published: boolean;
  lessonCount: number;
  lessons: CourseLesson[];
  enrolledStudentIds: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface SpeakingActivity {
  id: string;
  title: string;
  type: ActivityType;
  category: string;
  promptText: string;
  imageUrl?: string;
  prepTimeSeconds: number;
  minDurationSeconds: number;
  maxDurationSeconds: number;
  difficulty: SpeakingLevel;
  createdBy: string;
  isSystemPrompt?: boolean;
  rubricCriteria?: string[];
  hints?: string[];
  exampleResponse?: string;
  createdAt: string;
}

export interface RubricWeight {
  fluencyWeight: number;
  pronunciationWeight: number;
  clarityWeight: number;
  vocabularyWeight: number;
  relevanceWeight: number;
}

export interface Assignment {
  id: string;
  title: string;
  courseId?: string;
  courseTitle?: string;
  teacherId: string;
  teacherName: string;
  prompt: string;
  activityType: ActivityType;
  dueDate: string;
  targetClass: string;
  assignedStudentIds: string[];
  maxDurationSeconds: number;
  rubric: RubricWeight;
  createdAt: string;
}

export interface AIAssessmentResult {
  transcript: string;
  fluencyScore: number;
  pronunciationScore: number;
  clarityScore: number;
  vocabularyScore: number;
  relevanceScore: number;
  overallScore: number;
  speakingPaceWpm: number;
  pauseAnalysis?: string;
  detectedFillers?: string[];
  strengths: string[];
  improvementTips: string[];
  pronunciationNotes?: string[];
  detailedFeedback: string;
  disclaimer: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  teacherId: string;
  audioUrl?: string;
  durationSeconds: number;
  status: 'submitted' | 'processing' | 'graded' | 'needs_revision';
  transcript?: string;
  aiAssessment?: AIAssessmentResult;
  teacherFeedback?: string;
  teacherGrade?: number;
  teacherRubricScores?: {
    fluency: number;
    pronunciation: number;
    clarity: number;
    vocabulary: number;
    relevance: number;
  };
  submittedAt: string;
  gradedAt?: string;
}

export interface PracticeSession {
  id: string;
  studentId: string;
  activityId: string;
  activityTitle: string;
  activityType: ActivityType;
  durationSeconds: number;
  transcript?: string;
  aiAssessment?: AIAssessmentResult;
  completedAt: string;
}
