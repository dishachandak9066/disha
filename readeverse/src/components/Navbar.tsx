'use client';

import { BookOpen, Moon, Sun } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

export default function Navbar() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleAudiobooksClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(user ? '/dashboard/audiobooks' : '/signup');
  };

  const handleLibraryClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(user ? '/dashboard/library' : '/signup');
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="relative mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-1 rounded-xl group-hover:bg-primary/10 transition-colors">
            <img src="/logo.png" alt="Read-E-Verse Logo" className="w-8 h-8 object-contain" />
          </div>
          <span className="text-xl font-bold tracking-wider text-gray-900">
            READ-E-<span className="text-primary">VERSE</span>
          </span>
        </Link>
        
        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-8 text-sm font-medium text-gray-600">
          <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
          <Link href="/dashboard/library" onClick={handleLibraryClick} className="hover:text-primary transition-colors">My Library</Link>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-full border border-white/10 text-sm font-medium text-gray-600 hover:text-primary hover:border-primary transition-all"
            aria-label="Toggle light and dark mode"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>
          {!user ? (
            <Link
              href="/login"
              className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-gray-200 text-sm font-medium text-gray-600 hover:text-primary hover:border-primary transition-all"
            >
              Sign In
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleLogout}
              className="hidden sm:inline-flex px-5 py-2.5 rounded-full border border-gray-200 text-sm font-medium text-gray-700 hover:border-primary hover:text-primary transition-all"
            >
              Log Out
            </button>
          )}
          
        </div>
      </div>
    </motion.nav>
  );
}
