# Speak Bloom Security Specification

## 1. Data Invariants
1. A user document at `/users/{userId}` can only be read by that user or a verified teacher/admin. Self-updates must not elevate roles or forge foreign user IDs.
2. An Activity can be read by all authenticated users; only teachers can create/modify teacher-owned activities.
3. A Course can be read by all authenticated users; only the course creator (teacher) can edit or archive it.
4. An Assignment can be read by enrolled students and teachers; only the creator teacher can modify it.
5. A Submission belongs strictly to the student submitting it (`studentId == request.auth.uid`), can only be graded/reviewed by the designated `teacherId`, and students cannot modify teacher grades or feedback.
6. A PracticeSession belongs strictly to the student who recorded it (`studentId == request.auth.uid`) and can only be accessed or modified by that student.

## 2. The Dirty Dozen Payloads (Targeting Exploits to Deny)
1. Role Escalation: Student updating `/users/{studentId}` setting `role: "teacher"` or `role: "admin"`.
2. Foreign User Impersonation: User A creating `/users/{userB}` with `uid: userB`.
3. Malicious Profile Poisoning: Attempting to inject oversized JSON string (>100KB) into `displayName`.
4. Ghost Assignment Tampering: Student attempting to update `/assignments/{assignmentId}` to alter `dueDate` or `rubric`.
5. Grade Self-Grant: Student attempting to update `/submissions/{submissionId}` setting `teacherGrade: 100` and `status: "graded"`.
6. Foreign Audio Interception: Unrelated Student C attempting to read `/submissions/{submissionId}` of Student A.
7. Orphaned Submission: Creating a submission with foreign `studentId != request.auth.uid`.
8. Unauthorized Course Deletion: Student attempting to delete `/courses/{courseId}` owned by a teacher.
9. Practice Session Snooping: Student B attempting to read `/practice_sessions/{sessionId}` belonging to Student A.
10. ID Poisoning: Path parameter exploit attempting `path/with/special/junk/characters/../../` outside `[a-zA-Z0-9_\-]+`.
11. System Prompt Overwrite: Non-admin trying to overwrite default system speaking prompts.
12. Status Lockout Bypass: Submitting edits to an already locked or graded submission without teacher permission.
