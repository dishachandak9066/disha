'use client';

import React, { useState } from 'react';
import { FileText, Sparkles, BrainCircuit, ChevronDown, CheckCircle2, ChevronRight, BookOpen, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_CHAPTERS = [
  {
    id: 1,
    title: 'The Surprising Power of Atomic Habits',
    overview: 'Success is the product of daily habits—not once-in-a-lifetime transformations. Small, incremental changes compound over time, leading to massive results. Focus on the trajectory you are on, rather than the results you have right now.',
    highlights: [
      'Habits are the compound interest of self-improvement.',
      'If you can get 1% better each day for one year, you’ll end up 37 times better by the time you’re done.',
      'You get what you repeat. Time magnifies the margin between success and failure.'
    ],
    aiExplains: 'Think of habits like compounding money in a bank. A 1% daily improvement doesn\'t seem like much right now (just like a few dollars of interest), but multiplied over 365 days, it leads to massive, exponential growth. It’s about the system, not the goal.'
  },
  {
    id: 2,
    title: 'How Your Habits Shape Your Identity',
    overview: 'True behavior change is identity change. You might start a habit because of motivation, but the only reason you’ll stick with one is that it becomes part of your identity. The ultimate form of intrinsic motivation is when a habit becomes part of who you are.',
    highlights: [
      'There are three layers of behavior change: outcomes, processes, and identity.',
      'The most effective way to change your habits is to focus not on what you want to achieve, but on who you wish to become.',
      'Every action you take is a vote for the type of person you wish to become.'
    ],
    aiExplains: 'Instead of saying "I want to run a marathon" (outcome), tell yourself "I am a runner" (identity). Once you believe you are a runner, putting on your shoes and jogging every day becomes a natural consequence of who you are, rather than a forced chore.'
  },
  {
    id: 3,
    title: 'How to Build Better Habits in 4 Simple Steps',
    overview: 'The process of building a habit can be divided into four simple steps: cue, craving, response, and reward. This four-step pattern is the backbone of every habit, and your brain runs through these steps in the same order every time.',
    highlights: [
      'Cue triggers your brain to initiate a behavior.',
      'Craving is the motivational force behind every habit.',
      'Response is the actual habit you perform.',
      'Reward is the end goal of every habit.'
    ],
    aiExplains: 'The Cue makes you notice a reward (seeing a donut). The Craving makes you want the reward (desiring sugar). The Response is obtaining the reward (eating the donut). The Reward satisfies your craving and teaches your brain to do it again.'
  }
];

export default function SummariesPage() {
  const [quickRevision, setQuickRevision] = useState(false);
  const [expandedChapters, setExpandedChapters] = useState<number[]>([1]);

  const toggleChapter = (id: number) => {
    setExpandedChapters(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      
      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 rounded-full text-primary text-xs font-bold uppercase tracking-wider mb-3 border border-primary/30">
            <Sparkles className="w-3 h-3" />
            AI Study Companion
          </div>
          <h1 className="text-3xl font-bold mb-2">Smart Summaries</h1>
          <p className="text-gray-400">Master complex books in minutes with AI-generated insights.</p>
        </div>

        {/* Quick Revision Toggle */}
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl">
          <span className="text-sm font-medium">Quick Revision Mode</span>
          <button 
            onClick={() => setQuickRevision(!quickRevision)}
            className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${quickRevision ? 'bg-primary' : 'bg-gray-600'}`}
          >
            <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${quickRevision ? 'translate-x-6' : 'translate-x-0.5'}`} />
          </button>
        </div>
      </div>

      {/* Active Book Selector (Mock) */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-4 custom-scrollbar">
        <button className="flex-shrink-0 flex items-center gap-3 bg-gradient-to-r from-primary/30 to-purple-900/30 border border-primary/50 px-5 py-3 rounded-2xl text-left shadow-[0_0_15px_rgba(139,92,246,0.2)] min-w-[250px]">
          <div className="w-12 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-md shadow-md" />
          <div>
            <h4 className="font-bold text-sm text-white">Atomic Habits</h4>
            <p className="text-xs text-primary font-medium">Currently Studying</p>
          </div>
        </button>
        <button className="flex-shrink-0 flex items-center gap-3 glass hover:bg-white/10 border border-white/10 px-5 py-3 rounded-2xl text-left min-w-[250px] opacity-60 hover:opacity-100 transition-all">
          <div className="w-12 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-md shadow-md" />
          <div>
            <h4 className="font-bold text-sm text-white">Thinking, Fast and Slow</h4>
            <p className="text-xs text-gray-400">12 Chapters saved</p>
          </div>
        </button>
      </div>

      {/* Chapters Accordion */}
      <div className="space-y-4 max-w-4xl">
        {MOCK_CHAPTERS.map((chapter) => {
          const isExpanded = expandedChapters.includes(chapter.id);

          return (
            <div key={chapter.id} className="glass rounded-2xl overflow-hidden border border-white/10 transition-all">
              {/* Accordion Header */}
              <button 
                onClick={() => toggleChapter(chapter.id)}
                className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-colors text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold text-gray-400">
                    {chapter.id}
                  </div>
                  <h3 className="text-lg font-bold">{chapter.title}</h3>
                </div>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
              </button>

              {/* Accordion Body */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="p-5 pt-0 border-t border-white/10 mt-2 space-y-6">
                      
                      {/* Overview (Hidden in Quick Revision) */}
                      {!quickRevision && (
                        <div className="flex gap-4">
                          <BookOpen className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                          <p className="text-gray-300 leading-relaxed text-sm">
                            {chapter.overview}
                          </p>
                        </div>
                      )}

                      {/* Highlights */}
                      <div className="bg-white/5 rounded-xl p-5">
                        <h4 className="text-sm font-bold text-primary mb-4 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" />
                          Key Takeaways
                        </h4>
                        <ul className="space-y-3">
                          {chapter.highlights.map((highlight, idx) => (
                            <li key={idx} className="flex gap-3 text-sm text-gray-300">
                              <span className="text-primary mt-0.5">•</span>
                              {highlight}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* AI Explains */}
                      {!quickRevision && (
                        <div className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-xl p-5">
                          <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                            <BrainCircuit className="w-4 h-4 text-primary" />
                            AI Explains it simply
                          </h4>
                          <p className="text-sm text-gray-400 italic">
                            "{chapter.aiExplains}"
                          </p>
                        </div>
                      )}

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

    </div>
  );
}
