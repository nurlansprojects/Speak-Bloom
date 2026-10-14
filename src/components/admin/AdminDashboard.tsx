import React, { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Award,
  BookOpen,
} from 'lucide-react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { UserProfile } from '../../types';

interface AdminDashboardProps {
  onSwitchPerspective: (perspective: 'student' | 'teacher') => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onSwitchPerspective }) => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'users'));
      const list = snap.docs.map((d) => ({ ...d.data() } as UserProfile));
      setUsers(list);
    } catch (err) {
      console.warn('Could not list all users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleApproveTeacher = async (uid: string) => {
    try {
      await updateDoc(doc(db, 'users', uid), {
        role: 'teacher',
        teacherStatus: 'approved',
        updatedAt: new Date().toISOString(),
      });
      setActionMsg('Teacher application approved successfully!');
      setTimeout(() => setActionMsg(null), 3000);
      fetchUsers();
    } catch (err: any) {
      setActionMsg('Error approving teacher: ' + err.message);
    }
  };

  const handleRejectTeacher = async (uid: string) => {
    try {
      await updateDoc(doc(db, 'users', uid), {
        role: 'student',
        teacherStatus: 'rejected',
        updatedAt: new Date().toISOString(),
      });
      setActionMsg('Application marked as rejected.');
      setTimeout(() => setActionMsg(null), 3000);
      fetchUsers();
    } catch (err: any) {
      setActionMsg('Error: ' + err.message);
    }
  };

  const pendingTeachers = users.filter((u) => u.teacherStatus === 'pending');
  const teachers = users.filter((u) => u.role === 'teacher');
  const students = users.filter((u) => u.role === 'student');

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#7957E8]/10 text-[#7957E8] dark:bg-[#7957E8]/20 dark:text-[#A78BFA] mb-2">
            <Shield className="w-3.5 h-3.5" /> Platform Administration
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F] dark:text-white">
            Administrator Command Center
          </h1>
          <p className="text-xs sm:text-sm text-[#6E6E73] dark:text-[#98989D] mt-1">
            Manage authenticated users, review instructor credentials, and maintain curriculum security.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onSwitchPerspective('teacher')}
            className="px-4 py-2 rounded-xl bg-[#7957E8] text-white text-xs font-semibold hover:bg-[#6C47E0] transition-colors cursor-pointer"
          >
            Enter Teacher Dashboard
          </button>
          <button
            onClick={() => onSwitchPerspective('student')}
            className="px-4 py-2 rounded-xl bg-white dark:bg-[#2C2C2E] border border-black/10 dark:border-white/10 text-[#1D1D1F] dark:text-white text-xs font-semibold hover:bg-black/5 transition-colors cursor-pointer"
          >
            Enter Student Studio
          </button>
        </div>
      </div>

      {actionMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> {actionMsg}
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-6 rounded-3xl bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[#6E6E73] dark:text-[#98989D]">Total Users</span>
            <Users className="w-4 h-4 text-[#7957E8]" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-[#1D1D1F] dark:text-white">
            {users.length}
          </div>
          <p className="text-[11px] text-[#6E6E73] dark:text-[#8E8E93] mt-1">
            {students.length} students • {teachers.length} teachers
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[#6E6E73] dark:text-[#98989D]">Pending Teacher Requests</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-amber-600 dark:text-amber-400">
            {pendingTeachers.length}
          </div>
          <p className="text-[11px] text-[#6E6E73] dark:text-[#8E8E93] mt-1">
            Awaiting administrator approval
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[#6E6E73] dark:text-[#98989D]">Authorized Instructors</span>
            <Award className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-[#1D1D1F] dark:text-white">
            {teachers.length}
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
            Active verified educators
          </p>
        </div>
      </div>

      {/* Pending Teacher Approvals Section */}
      <div className="rounded-3xl bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10 overflow-hidden shadow-sm p-6 sm:p-8">
        <h3 className="text-base sm:text-lg font-bold text-[#1D1D1F] dark:text-white mb-4">
          Pending Instructor Applications ({pendingTeachers.length})
        </h3>

        {pendingTeachers.length > 0 ? (
          <div className="divide-y divide-black/5 dark:divide-white/10">
            {pendingTeachers.map((user) => (
              <div key={user.uid} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-[#1D1D1F] dark:text-white">{user.displayName}</h4>
                  <p className="text-xs text-[#6E6E73] dark:text-[#98989D]">{user.email}</p>
                  <p className="text-[10px] text-[#6E6E73] dark:text-[#8E8E93] mt-1">
                    Requested on: {new Date(user.updatedAt || user.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRejectTeacher(user.uid)}
                    className="px-3.5 py-1.5 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-semibold hover:bg-red-500/20 transition-colors cursor-pointer"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleApproveTeacher(user.uid)}
                    className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors cursor-pointer shadow-sm flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Approve Instructor
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-[#6E6E73] dark:text-[#98989D]">
            No pending instructor applications at this time.
          </div>
        )}
      </div>

      {/* All Authenticated Accounts Directory */}
      <div className="rounded-3xl bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10 overflow-hidden shadow-sm p-6 sm:p-8">
        <h3 className="text-base sm:text-lg font-bold text-[#1D1D1F] dark:text-white mb-4">
          All Authenticated User Profiles
        </h3>

        <div className="divide-y divide-black/5 dark:divide-white/10 max-h-96 overflow-y-auto">
          {users.map((u) => (
            <div key={u.uid} className="py-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#7957E8]/10 text-[#7957E8] text-xs font-bold flex items-center justify-center">
                  {u.displayName?.[0] || 'U'}
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#1D1D1F] dark:text-white">{u.displayName}</div>
                  <div className="text-[11px] text-[#6E6E73] dark:text-[#98989D]">{u.email}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-black/5 dark:bg-white/10 text-[#1D1D1F] dark:text-white">
                  {u.role}
                </span>
                {u.role === 'student' && u.teacherStatus !== 'approved' && (
                  <button
                    onClick={() => handleApproveTeacher(u.uid)}
                    className="text-[11px] text-[#7957E8] font-semibold hover:underline cursor-pointer"
                  >
                    Promote to Teacher
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
