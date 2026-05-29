'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page w-full max-w-md p-8 glass border-2 border-black/10 dark:border-white/10 rounded-3xl shadow-lg relative overflow-hidden text-black dark:text-white">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 text-primary dark:text-primary">Welcome Back</h1>
        <p className="text-black dark:text-primary text-sm font-medium">Sign in to continue to READ-E-VERSE</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-400 dark:border-red-500/20 text-red-700 dark:text-red-400 text-sm rounded-lg text-center font-medium">
            {error}
          </div>
        )}

        <div className="space-y-1">
          <label className="text-sm font-semibold text-black dark:text-gray-200 ml-1">Email</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white dark:bg-white/5 border-2 border-black dark:border-white/10 rounded-xl py-3 pl-10 pr-4 text-black dark:text-white placeholder-gray-600 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all caret-black dark:caret-white"
              placeholder="Your Email Address"
            />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between ml-1">
            <label className="text-sm font-semibold text-black dark:text-gray-200">Password</label>
            <Link href="#" className="text-xs text-primary dark:text-primary hover:text-black dark:hover:text-primary/80 transition-colors font-medium">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white dark:bg-white/5 border-2 border-black dark:border-white/10 rounded-xl py-3 pl-10 pr-10 text-black dark:text-white placeholder-gray-600 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all caret-black dark:caret-white"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-gray-100 transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white font-medium rounded-xl transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
          {isSubmitting ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div className="mt-8 flex items-center gap-4">
        <div className="flex-1 h-px bg-black dark:bg-white/10" />
        <span className="text-xs text-primary dark:text-primary font-semibold">OR CONTINUE WITH</span>
        <div className="flex-1 h-px bg-black dark:bg-white/10" />
      </div>

      <div className="mt-6 flex justify-center">
        <button
          type="button"
          className="flex items-center justify-center gap-2 py-2.5 px-6 bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 border-2 border-black dark:border-white/10 rounded-xl transition-colors text-black dark:text-white font-medium"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
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
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span className="text-sm font-medium">Google</span>
        </button>
      </div>

      <p className="mt-8 text-center text-sm text-black dark:text-gray-400">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-primary dark:text-primary font-medium hover:text-black dark:hover:text-primary/80 transition-colors">
          Sign up
        </Link>
      </p>
    </div>
  );
}
