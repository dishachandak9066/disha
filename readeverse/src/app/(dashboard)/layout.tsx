import React from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { AudioPlayerProvider } from '@/context/AudioPlayerContext';
import FloatingAudioPlayer from '@/components/dashboard/FloatingAudioPlayer';
import { TranslationProvider } from '@/context/TranslationContext';
import LanguageSwitcher from '@/components/dashboard/LanguageSwitcher';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <TranslationProvider>
        <AudioPlayerProvider>
          <div className="min-h-screen bg-background text-foreground flex">
            {/* Desktop Sidebar */}
            <div className="hidden md:block w-72 flex-shrink-0">
              <Sidebar />
            </div>

            {/* Main Content Area */}
            <main className="flex-1 min-w-0 overflow-y-auto relative pb-24">
              
              {/* Top Navigation / Actions Bar */}
              <div className="absolute top-6 right-6 md:top-10 md:right-10 z-50">
                <LanguageSwitcher />
              </div>

              <div className="max-w-7xl mx-auto p-6 md:p-10 pt-20 md:pt-24">
                {children}
              </div>
            </main>

            <FloatingAudioPlayer />
          </div>
        </AudioPlayerProvider>
      </TranslationProvider>
    </ProtectedRoute>
  );
}

