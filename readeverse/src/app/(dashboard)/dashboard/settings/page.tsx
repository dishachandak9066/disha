'use client';

import React, { useState } from 'react';
import { Headphones, Bell, Shield, Trash2, ChevronRight, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

const TABS = [
  { id: 'audio', label: 'Audio & Playback', icon: Headphones },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'account', label: 'Account Security', icon: Shield },
] as const;

type TabId = (typeof TABS)[number]['id'];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('audio');
  const { theme, toggleTheme } = useTheme();

  const [highQuality, setHighQuality] = useState(true);
  const [autoPlay, setAutoPlay] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [emailDigests, setEmailDigests] = useState(false);

  const renderToggle = (
    label: string,
    description: string,
    checked: boolean,
    onChange: (val: boolean) => void
  ) => (
    <div className="flex items-center justify-between py-4 border-b border-black/10 dark:border-white/10 last:border-0">
      <div className="pr-8">
        <h4 className="font-bold mb-1">{label}</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${
          checked ? 'bg-primary' : 'bg-black/20 dark:bg-gray-600'
        }`}
        aria-label={label}
      >
        <div
          className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400">Manage your preferences and account settings</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 flex-shrink-0 space-y-2">
          <div className="glass rounded-2xl p-4 flex items-center justify-between">
            <div className="min-w-0">
              <p className="font-semibold">Theme</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Light / Dark</p>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>

          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
                  isActive
                    ? 'bg-primary/20 text-primary font-bold border border-primary/30'
                    : 'glass text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 border border-black/10 dark:border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </div>
                <ChevronRight className={`w-4 h-4 ${isActive ? 'opacity-100' : 'opacity-0'} transition-opacity`} />
              </button>
            );
          })}
        </div>

        <div className="flex-1 glass rounded-3xl p-6 md:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none -mt-20 -mr-20" />

          <div className="relative z-10">
            {activeTab === 'audio' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <h2 className="text-2xl font-bold border-b border-black/10 dark:border-white/10 pb-4">Audio & Playback</h2>
                <div>
                  {renderToggle(
                    'High-Quality Audio',
                    'Stream audiobooks in maximum fidelity (uses more data).',
                    highQuality,
                    setHighQuality
                  )}
                  {renderToggle(
                    'Auto-Play Next Chapter',
                    'Automatically start the next chapter when one finishes.',
                    autoPlay,
                    setAutoPlay
                  )}
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <h2 className="text-2xl font-bold border-b border-black/10 dark:border-white/10 pb-4">Notifications</h2>
                <div>
                  {renderToggle(
                    'Push Notifications',
                    'Receive alerts for reading goals and new recommendations.',
                    pushNotifs,
                    setPushNotifs
                  )}
                  {renderToggle(
                    'Email Digests',
                    'Receive a weekly summary of your reading activity.',
                    emailDigests,
                    setEmailDigests
                  )}
                </div>
              </div>
            )}

            {activeTab === 'account' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <h2 className="text-2xl font-bold border-b border-black/10 dark:border-white/10 pb-4">Account Security</h2>

                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Current Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full bg-white/70 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">New Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full bg-white/70 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                  </div>
                  <button
                    type="button"
                    className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white font-medium rounded-xl transition-all w-full"
                  >
                    Change Password
                  </button>
                </div>

                <div className="pt-8 border-t border-black/10 dark:border-red-500/20">
                  <h4 className="font-bold text-red-600 mb-2">Danger Zone</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Permanently delete your account and all associated reading data. This action cannot be undone.
                  </p>
                  <button
                    type="button"
                    className="flex items-center gap-2 px-6 py-2.5 bg-white/70 dark:bg-red-500/10 hover:bg-red-50 dark:hover:bg-red-500/20 text-red-600 dark:text-red-500 border border-red-200/70 dark:border-red-500/20 font-medium rounded-xl transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Account
                  </button>
                </div>
              </div>
            )}

            <div className="mt-12 pt-6 border-t border-black/10 dark:border-white/10 flex justify-end" />
          </div>
        </div>
      </div>
    </div>
  );
}
