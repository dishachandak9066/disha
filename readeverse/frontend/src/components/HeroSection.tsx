'use client';

import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

export default function HeroSection() {
  const router = useRouter();
  const { user } = useAuth();

  const handleStartReading = (e: React.MouseEvent) => {
    e.preventDefault();

    if (user) {
      router.push('/dashboard');
    } else {
      router.push('/signup');
    }
  };

  return (
    <section className="relative pt-28 pb-16 md:pt-40 md:pb-24 px-6 overflow-hidden">

      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto text-center">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 text-sm font-medium"
        >
          <Sparkles className="w-4 h-4 text-primary" />

          <span>
            The next generation of reading
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight mb-5 leading-tight"
        >
          Unlock the Universe 
          <br className="hidden md:block" />

          <span className="text-gradient">
           of Knowledge
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-8 leading-relaxed"
        >
          Experience a limitless library powered by AI.
          Get personalized recommendations, seamless cross-device syncing,
          and immersive audiobooks in a premium reading environment.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={handleStartReading}
            className="w-full sm:w-auto px-8 py-3.5 bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-medium rounded-full transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_25px_rgba(139,92,246,0.35)] flex items-center justify-center gap-2"
          >
            Start Reading Now

            <ArrowRight className="w-5 h-5" />
          </button>

          <Link
            href="#features"
            className="w-full sm:w-auto px-8 py-3.5 glass hover:bg-white/10 text-[color:var(--foreground)] text-lg font-medium rounded-full transition-all duration-300 hover:scale-105 active:scale-95"
          >
            Explore Features
          </Link>
        </motion.div>
      </div>
    </section>
  );
}