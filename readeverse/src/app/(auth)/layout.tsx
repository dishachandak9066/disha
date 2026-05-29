import React from 'react';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-background text-foreground">
      {/* Background gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-pink-600/10 rounded-full blur-[120px] pointer-events-none" />

      <header className="absolute top-0 left-0 right-0 p-6 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-1 rounded-xl group-hover:bg-primary/10 transition-colors">
              <img src="/logo.png" alt="Read-E-Verse Logo" className="w-8 h-8 object-contain" />
            </div>
            <span className="text-xl font-bold tracking-wider">
              READ-E-<span className="text-primary">VERSE</span>
            </span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6 mt-16 z-10">
        {children}
      </main>
    </div>
  );
}
