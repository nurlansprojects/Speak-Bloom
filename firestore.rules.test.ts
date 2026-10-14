// Security test suite verifying Firestore Rules security boundaries
// for Speak Bloom (Student & Teacher RBAC and Data Invariants)

export const securityAssertions = [
  {
    name: 'Deny role escalation by student',
    target: '/users/{studentId}',
    action: 'update',
    payload: { role: 'teacher' },
    expectedOutcome: 'PERMISSION_DENIED'
  },
  {
    name: 'Deny unauthorized access to foreign submissions',
    target: '/submissions/{submissionId}',
    action: 'get',
    requestUid: 'student_attacker',
    resourceStudentId: 'student_victim',
    resourceTeacherId: 'teacher_smith',
    expectedOutcome: 'PERMISSION_DENIED'
  },
  {
    name: 'Allow student creating valid submission for an assignment',
    target: '/submissions/{submissionId}',
    action: 'create',
    payload: { studentId: 'student_123', teacherId: 'teacher_abc', status: 'submitted' },
    expectedOutcome: 'ALLOWED'
  },
  {
    name: 'Allow teacher to grade student submission',
    target: '/submissions/{submissionId}',
    action: 'update',
    requestUid: 'teacher_abc',
    affectedKeys: ['status', 'teacherGrade', 'teacherFeedback', 'gradedAt', 'teacherRubricScores'],
    expectedOutcome: 'ALLOWED'
  },
  {
    name: 'Deny student grading own submission',
    target: '/submissions/{submissionId}',
    action: 'update',
    requestUid: 'student_123',
    affectedKeys: ['teacherGrade'],
    expectedOutcome: 'PERMISSION_DENIED'
  },
  {
    name: 'Deny unauthorized access to practice sessions',
    target: '/practice_sessions/{sessionId}',
    action: 'get',
    requestUid: 'student_attacker',
    resourceStudentId: 'student_owner',
    expectedOutcome: 'PERMISSION_DENIED'
  }
];
