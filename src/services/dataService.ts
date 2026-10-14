import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestoreErrors';
import {
  SpeakingActivity,
  Course,
  Assignment,
  Submission,
  PracticeSession,
} from '../types';
import {
  SYSTEM_SPEAKING_ACTIVITIES,
  INITIAL_DEFAULT_COURSES,
} from '../data/speakingLibrary';

// Initial seed assignments for rich demo experience
const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'assign-wk-1',
    title: 'Executive Perspective: Sustainable Urban Mobility',
    courseId: 'course-master-fluency',
    courseTitle: 'Natural English Fluency & Spoken Rhythm',
    teacherId: 'demo-teacher-bloom',
    teacherName: 'Prof. Eleanor Vance',
    prompt: 'Deliver a 90-second spoken proposal evaluating the transition to electric autonomous shuttles in city centers. Detail the economic viability and public adoption obstacles. Maintain clear paragraph transitions.',
    activityType: 'presentation',
    dueDate: '2026-10-25',
    targetClass: 'Advanced Fluency Cohort B',
    assignedStudentIds: [],
    maxDurationSeconds: 120,
    rubric: {
      fluencyWeight: 25,
      pronunciationWeight: 20,
      clarityWeight: 25,
      vocabularyWeight: 15,
      relevanceWeight: 15,
    },
    createdAt: '2026-10-10T12:00:00Z',
  },
  {
    id: 'assign-wk-2',
    title: 'Picture Interpretation: Collaborative Innovation',
    courseId: 'course-master-fluency',
    courseTitle: 'Natural English Fluency & Spoken Rhythm',
    teacherId: 'teacher-system',
    teacherName: 'Prof. Eleanor Vance',
    prompt: 'Analyze the dynamics of high-performing modern teams. Describe how psychological safety allows team members to voice unorthodox ideas without fear of reprimand. Provide a 60-second spoken insight.',
    activityType: 'picture_description',
    dueDate: '2026-10-28',
    targetClass: 'Advanced Fluency Cohort B',
    assignedStudentIds: [],
    maxDurationSeconds: 90,
    rubric: {
      fluencyWeight: 30,
      pronunciationWeight: 20,
      clarityWeight: 20,
      vocabularyWeight: 15,
      relevanceWeight: 15,
    },
    createdAt: '2026-10-12T14:00:00Z',
  },
];

const INITIAL_SUBMISSIONS: Submission[] = [];
const INITIAL_PRACTICE_SESSIONS: PracticeSession[] = [];

class DataService {
  private localActivities = [...SYSTEM_SPEAKING_ACTIVITIES];
  private localCourses = [...INITIAL_DEFAULT_COURSES];
  private localAssignments = [...INITIAL_ASSIGNMENTS];
  private localSubmissions: Submission[] = [];
  private localPracticeSessions: PracticeSession[] = [];

  // Activities
  async getActivities(): Promise<SpeakingActivity[]> {
    try {
      const snap = await getDocs(collection(db, 'activities'));
      if (!snap.empty) {
        const remote = snap.docs.map((d) => ({ id: d.id, ...d.data() } as SpeakingActivity));
        // Merge with system prompts
        const combined = [...remote];
        SYSTEM_SPEAKING_ACTIVITIES.forEach((sys) => {
          if (!combined.some((a) => a.id === sys.id)) {
            combined.push(sys);
          }
        });
        return combined;
      }
    } catch {
      // Fallback to local
    }
    return this.localActivities;
  }

  async createActivity(activity: Omit<SpeakingActivity, 'id' | 'createdAt'>): Promise<SpeakingActivity> {
    const id = `act-${Date.now()}`;
    const newActivity: SpeakingActivity = {
      ...activity,
      id,
      createdAt: new Date().toISOString(),
    };
    try {
      await setDoc(doc(db, 'activities', id), newActivity);
    } catch {
      // Local fallback
    }
    this.localActivities.unshift(newActivity);
    return newActivity;
  }

  // Courses
  async getCourses(): Promise<Course[]> {
    try {
      const snap = await getDocs(collection(db, 'courses'));
      if (!snap.empty) {
        const remote = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Course));
        const combined = [...remote];
        INITIAL_DEFAULT_COURSES.forEach((c) => {
          if (!combined.some((x) => x.id === c.id)) combined.push(c);
        });
        return combined;
      }
    } catch {
      // Local fallback
    }
    return this.localCourses;
  }

  async createCourse(course: Omit<Course, 'id' | 'createdAt'>): Promise<Course> {
    const id = `course-${Date.now()}`;
    const newCourse: Course = {
      ...course,
      id,
      createdAt: new Date().toISOString(),
    };
    try {
      await setDoc(doc(db, 'courses', id), newCourse);
    } catch {
      // Local fallback
    }
    this.localCourses.unshift(newCourse);
    return newCourse;
  }

  async enrollCourse(courseId: string, studentId: string): Promise<void> {
    try {
      const ref = doc(db, 'courses', courseId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const current = (snap.data().enrolledStudentIds || []) as string[];
        if (!current.includes(studentId)) {
          await updateDoc(ref, { enrolledStudentIds: [...current, studentId] });
        }
      }
    } catch {
      // Local fallback
    }
    const local = this.localCourses.find((c) => c.id === courseId);
    if (local && !local.enrolledStudentIds.includes(studentId)) {
      local.enrolledStudentIds.push(studentId);
    }
  }

  // Assignments
  async getAssignments(): Promise<Assignment[]> {
    try {
      const snap = await getDocs(collection(db, 'assignments'));
      if (!snap.empty) {
        const remote = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Assignment));
        const combined = [...remote];
        INITIAL_ASSIGNMENTS.forEach((a) => {
          if (!combined.some((x) => x.id === a.id)) combined.push(a);
        });
        return combined;
      }
    } catch {
      // Local fallback
    }
    return this.localAssignments;
  }

  async createAssignment(assign: Omit<Assignment, 'id' | 'createdAt'>): Promise<Assignment> {
    const id = `assign-${Date.now()}`;
    const newAssign: Assignment = {
      ...assign,
      id,
      createdAt: new Date().toISOString(),
    };
    try {
      await setDoc(doc(db, 'assignments', id), newAssign);
    } catch {
      // Local fallback
    }
    this.localAssignments.unshift(newAssign);
    return newAssign;
  }

  // Submissions
  async getSubmissionsForStudent(studentId: string): Promise<Submission[]> {
    try {
      const q = query(collection(db, 'submissions'), where('studentId', '==', studentId));
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Submission));
      }
    } catch {
      // Local fallback
    }
    return this.localSubmissions.filter((s) => s.studentId === studentId);
  }

  async getSubmissionsForTeacher(teacherId: string): Promise<Submission[]> {
    try {
      const q = query(collection(db, 'submissions'), where('teacherId', '==', teacherId));
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Submission));
      }
    } catch {
      // Local fallback
    }
    return this.localSubmissions.filter((s) => s.teacherId === teacherId);
  }

  async getAllSubmissions(): Promise<Submission[]> {
    try {
      const snap = await getDocs(collection(db, 'submissions'));
      if (!snap.empty) {
        return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Submission));
      }
    } catch {
      // Local fallback
    }
    return this.localSubmissions;
  }

  async createSubmission(sub: Omit<Submission, 'id'>): Promise<Submission> {
    const id = `sub-${Date.now()}`;
    const newSub: Submission = { ...sub, id };
    try {
      await setDoc(doc(db, 'submissions', id), newSub);
    } catch {
      // Local fallback
    }
    this.localSubmissions.unshift(newSub);
    return newSub;
  }

  async gradeSubmission(
    submissionId: string,
    grade: number,
    feedback: string,
    rubricScores?: Submission['teacherRubricScores']
  ): Promise<void> {
    const payload = {
      status: 'graded' as const,
      teacherGrade: grade,
      teacherFeedback: feedback,
      teacherRubricScores: rubricScores,
      gradedAt: new Date().toISOString(),
    };
    try {
      await updateDoc(doc(db, 'submissions', submissionId), payload);
    } catch {
      // Local fallback
    }
    const item = this.localSubmissions.find((s) => s.id === submissionId);
    if (item) {
      Object.assign(item, payload);
    }
  }

  async requestRevision(submissionId: string, feedback: string): Promise<void> {
    const payload = {
      status: 'needs_revision' as const,
      teacherFeedback: feedback,
      gradedAt: new Date().toISOString(),
    };
    try {
      await updateDoc(doc(db, 'submissions', submissionId), payload);
    } catch {
      // Local fallback
    }
    const item = this.localSubmissions.find((s) => s.id === submissionId);
    if (item) {
      Object.assign(item, payload);
    }
  }

  // Practice Sessions
  async getPracticeSessions(studentId: string): Promise<PracticeSession[]> {
    try {
      const q = query(
        collection(db, 'practice_sessions'),
        where('studentId', '==', studentId),
        orderBy('completedAt', 'desc'),
        limit(50)
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs.map((d) => ({ id: d.id, ...d.data() } as PracticeSession));
      }
    } catch {
      // Local fallback
    }
    return this.localPracticeSessions.filter((s) => s.studentId === studentId);
  }

  async savePracticeSession(session: Omit<PracticeSession, 'id'>): Promise<PracticeSession> {
    const id = `prac-${Date.now()}`;
    const newSession: PracticeSession = { ...session, id };
    try {
      await setDoc(doc(db, 'practice_sessions', id), newSession);
    } catch {
      // Local fallback
    }
    this.localPracticeSessions.unshift(newSession);
    return newSession;
  }
}

export const dataService = new DataService();
