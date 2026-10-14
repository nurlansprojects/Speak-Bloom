import React from 'react';
import {
  Mic,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AuthScreen: React.FC = () => {
  const { signInWithGoogle, loading, authError, clearAuthError } = useAuth();

  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-[#000000] text-[#1D1D1F] dark:text-[#F5F5F7] flex flex-col justify-between p-4 sm:p-8 font-sans transition-colors duration-200">
      {/* Top Navigation Bar */}
      <header className="max-w-7xl w-full mx-auto flex items-center justify-between py-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#7957E8] to-[#9A7DFA] text-white flex items-center justify-center shadow-sm">
            <Mic className="w-5 h-5" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-[#1D1D1F] dark:text-white">
            Speak Bloom
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-[#6E6E73] dark:text-[#98989D]">
          <ShieldCheck className="w-4 h-4 text-[#7957E8]" />
          <span>Secure Google Identity</span>
        </div>
      </header>

      {/* Main Authentication Centerpiece */}
      <main className="max-w-md w-full mx-auto my-auto py-8">
        <div className="bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10 rounded-3xl p-8 sm:p-10 shadow-sm backdrop-blur-md">
          {/* Logo & Headline */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-3xl bg-[#7957E8]/10 text-[#7957E8] dark:bg-[#7957E8]/20 dark:text-[#A78BFA] mb-4">
              <Sparkles className="w-7 h-7" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1D1D1F] dark:text-white">
              Welcome to Speak Bloom
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-[#6E6E73] dark:text-[#98989D] leading-relaxed">
              The modern educational platform exclusively designed to cultivate English speaking fluency, natural cadence, and vocal confidence.
            </p>
          </div>

          {/* Auth Error Banner */}
          {authError && (
            <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p>{authError}</p>
                <button
                  onClick={clearAuthError}
                  className="mt-1 text-[11px] underline font-semibold cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {/* Two Distinct Google Authentication Actions */}
          <div className="space-y-3.5">
            {/* 1. Continue with Google (New or Returning) */}
            <button
              onClick={signInWithGoogle}
              disabled={loading}
              className="w-full py-3.5 px-5 rounded-2xl bg-[#7957E8] hover:bg-[#6C47E0] disabled:opacity-50 text-white font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-3 cursor-pointer shadow-sm hover:scale-[1.01] active:scale-[0.99]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in with Google...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 bg-white rounded-full p-0.5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                  <ArrowRight className="w-4 h-4 ml-auto opacity-70" />
                </>
              )}
            </button>

            {/* 2. Sign in with Google (For returning users) */}
            <button
              onClick={signInWithGoogle}
              disabled={loading}
              className="w-full py-3.5 px-5 rounded-2xl bg-[#F5F5F7] dark:bg-[#2C2C2E] hover:bg-[#E5E5EA] dark:hover:bg-[#3A3A3C] disabled:opacity-50 text-[#1D1D1F] dark:text-white font-semibold text-xs sm:text-sm border border-black/5 dark:border-white/10 transition-all flex items-center justify-center gap-3 cursor-pointer shadow-sm hover:scale-[1.01] active:scale-[0.99]"
            >
              {loading ? (
                <span className="text-xs text-[#6E6E73] dark:text-[#98989D]">Connecting...</span>
              ) : (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Sign in with Google</span>
                </>
              )}
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-black/5 dark:border-white/10 text-center">
            <p className="text-[11px] text-[#6E6E73] dark:text-[#8E8E93] leading-relaxed">
              By authenticating with Google, your account is verified securely and your personalized speaking progress and recordings are saved to your private profile.
            </p>
          </div>
        </div>
      </main>

      {/* Footer with Mandatory Author Notice */}
      <footer className="max-w-7xl w-full mx-auto py-4 text-center text-xs text-[#6E6E73] dark:text-[#8E8E93]">
        <div className="font-normal text-[11px] sm:text-xs">
          © 2026 Jamalova Ummikhabiba. All rights reserved.
        </div>
      </footer>
    </div>
  );
};
