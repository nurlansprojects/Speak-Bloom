import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestoreErrors';
import { UserProfile, UserRole, TeacherApplicationStatus } from '../types';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  authError: string | null;
  signInWithGoogle: () => Promise<void>;
  logOut: () => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  applyForTeacherRole: () => Promise<void>;
  approveTeacherApplication: (targetUid: string) => Promise<void>;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      setAuthError(null);

      if (user) {
        setCurrentUser(user);
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const snap = await getDoc(userDocRef);

          const isAuthorizedAdmin = user.email === 'dev.nurlan@gmail.com';
          const defaultDisplayName = user.displayName?.trim() || user.email?.split('@')[0] || 'User';

          if (snap.exists()) {
            const existing = snap.data() as UserProfile;
            // Sync any updated Google account information (e.g., photoURL or displayName if changed)
            // while strictly preserving database records, streak, role, and progress
            const roleToUse: UserRole = isAuthorizedAdmin ? 'admin' : existing.role || 'student';
            const updatedProfile: UserProfile = {
              ...existing,
              uid: user.uid,
              email: user.email || existing.email || '',
              displayName: existing.displayName || defaultDisplayName,
              photoURL: user.photoURL || existing.photoURL || undefined,
              role: roleToUse,
              updatedAt: new Date().toISOString(),
            };

            // Update in Firestore to keep Google display and photo in sync if needed
            try {
              await updateDoc(userDocRef, {
                displayName: updatedProfile.displayName,
                email: updatedProfile.email,
                photoURL: updatedProfile.photoURL || null,
                role: updatedProfile.role,
                updatedAt: updatedProfile.updatedAt,
              });
            } catch (syncErr) {
              // Non-blocking sync error
              console.warn('Profile sync warning:', syncErr);
            }

            setProfile(updatedProfile);
          } else {
            // First time Google Sign-In: create genuine user profile in Firestore
            const newProfile: UserProfile = {
              uid: user.uid,
              email: user.email || '',
              displayName: defaultDisplayName,
              role: isAuthorizedAdmin ? 'admin' : 'student',
              teacherStatus: isAuthorizedAdmin ? 'approved' : 'none',
              photoURL: user.photoURL || undefined,
              dailyGoalMinutes: 15,
              streakDays: 1,
              lastPracticeDate: new Date().toISOString().split('T')[0],
              createdAt: new Date().toISOString(),
            };

            await setDoc(userDocRef, newProfile);
            setProfile(newProfile);
          }
        } catch (err: any) {
          console.error('Error fetching or creating profile in Firestore:', err);
          setAuthError('Failed to load user profile from database. Please check connection.');
          handleFirestoreError(err, OperationType.GET, `users/${user.uid}`);
        }
      } else {
        // Logged out: strictly reset state. NO demo user, NO guest profile.
        setCurrentUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      setAuthError(null);
      // Ensure Google sign-in prompts account chooser
      googleProvider.setCustomParameters({
        prompt: 'select_account',
      });
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error('Google sign in error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setAuthError('Sign-in cancelled. Please select a Google account to continue.');
      } else if (err.code === 'auth/cancelled-popup-request') {
        setAuthError('Another sign-in window was opened. Please try again.');
      } else {
        setAuthError(err.message || 'Unable to sign in with Google. Please try again.');
      }
      setLoading(false);
    }
  };

  const logOut = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      setCurrentUser(null);
      setProfile(null);
    } catch (err: any) {
      console.error('Sign out error:', err);
      setAuthError('Failed to sign out. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!profile || !currentUser) return;
    const updated = {
      ...profile,
      ...data,
      // Prevent client self-escalation of roles
      role: profile.role,
      updatedAt: new Date().toISOString(),
    };
    setProfile(updated);
    try {
      await updateDoc(doc(db, 'users', profile.uid), updated);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${profile.uid}`);
    }
  };

  const applyForTeacherRole = async () => {
    if (!profile || !currentUser) return;
    const updated: UserProfile = {
      ...profile,
      teacherStatus: 'pending',
      updatedAt: new Date().toISOString(),
    };
    setProfile(updated);
    try {
      await updateDoc(doc(db, 'users', profile.uid), {
        teacherStatus: 'pending',
        updatedAt: updated.updatedAt,
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${profile.uid}`);
    }
  };

  const approveTeacherApplication = async (targetUid: string) => {
    if (!profile || profile.role !== 'admin') return;
    try {
      await updateDoc(doc(db, 'users', targetUid), {
        role: 'teacher',
        teacherStatus: 'approved',
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${targetUid}`);
    }
  };

  const clearAuthError = () => setAuthError(null);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        profile,
        loading,
        authError,
        signInWithGoogle,
        logOut,
        updateUserProfile,
        applyForTeacherRole,
        approveTeacherApplication,
        clearAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
