'use client';

import {
  Brain,
  Headphones,
  Globe2,
  FileText,
  LayoutTemplate,
  LineChart,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const features = [
  {
    icon: <Brain className="w-6 h-6" />,
    title: 'AI Recommendations',
    description:
      'Discover your next favorite book with our advanced AI matching algorithm tailored to your tastes.',
    color: 'from-blue-500 to-indigo-500',
    href: '/dashboard/foryou',
    requiresAuth: true,
  },
  {
    icon: <Headphones className="w-6 h-6" />,
    title: 'Immersive Audiobooks',
    description:
      'Seamlessly switch between reading and listening with our high-quality audiobook library.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: <Globe2 className="w-6 h-6" />,
    title: 'Multilingual Support',
    description:
      'Read and listen in over 50 languages with real-time translation capabilities.',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    icon: <FileText className="w-6 h-6" />,
    title: 'AI Summaries',
    description:
      'Short on time? Get smart, comprehensive summaries of any book before you dive in.',
    color: 'from-orange-500 to-red-500',
  },
  {
    icon: <LayoutTemplate className="w-6 h-6" />,
    title: 'Smart Reader',
    description:
      'A customizable reading interface that adapts to your environment and reading habits.',
    color: 'from-pink-500 to-rose-500',
  },
  {
    icon: <LineChart className="w-6 h-6" />,
    title: 'Reading Analytics',
    description:
      'Track your reading progress, streaks, and habits with beautiful visualization dashboards.',
    color: 'from-cyan-500 to-blue-500',
  },
];

export default function FeaturesSection() {
  const router = useRouter();
  const { user } = useAuth();

  const handleFeatureClick = (feature: (typeof features)[0]) => {
    if (feature.requiresAuth) {
      if (!user) {
        router.push('/login');
      } else {
        router.push(feature.href || '#');
      }
    }
  };

  return (
    <section
      id="features"
      className="relative overflow-hidden py-24 px-6"
    >
      {/* Background Glows */}
      <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-primary/15 dark:bg-primary/10 blur-3xl pointer-events-none -z-10" />

      <div className="absolute bottom-20 right-10 w-72 h-72 rounded-full bg-blue-500/15 dark:bg-blue-500/10 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
            Supercharge{' '}
            <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Your Reading
            </span>
          </h2>

          <p className="max-w-2xl mx-auto text-lg text-muted-foreground leading-relaxed">
            Everything you need to read smarter, learn faster, and enjoy every
            page with an AI-powered reading experience.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.08,
              }}
              whileHover={{ y: -8 }}
              onClick={() => handleFeatureClick(feature)}
              className={`
                relative
                h-full
                overflow-hidden
                rounded-3xl
                border
                border-slate-200
                dark:border-white/10
                bg-white
                dark:bg-white/[0.03]
                backdrop-blur-xl
                p-8
                transition-all
                duration-500
                hover:border-primary/40
                dark:hover:border-primary/30
                hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)]
                dark:hover:shadow-2xl
                group
                ${
                  feature.requiresAuth
                    ? 'cursor-pointer'
                    : ''
                }
              `}
            >
              {/* Hover Glow */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-all duration-500`}
              />

              {/* Top Accent */}
              <div className="absolute top-0 left-1/2 h-px w-24 -translate-x-1/2 bg-gradient-to-r from-transparent via-slate-300 dark:via-white/40 to-transparent" />

              <div className="relative z-10 flex h-full flex-col">
                {/* Icon */}
                <div
                  className={`
                    mb-6
                    flex h-16 w-16 items-center justify-center
                    rounded-2xl
                    bg-gradient-to-br
                    ${feature.color}
                    text-white
                    shadow-lg
                    transition-transform
                    duration-300
                    group-hover:scale-110
                  `}
                >
                  {feature.icon}
                </div>

                {/* Title */}
                <h3 className="mb-3 text-xl font-semibold tracking-tight">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="flex-grow text-muted-foreground leading-7">
                  {feature.description}
                </p>

                {/* CTA */}
                <div
                  className="
                    mt-6
                    translate-x-[-10px]
                    opacity-0
                    transition-all
                    duration-300
                    group-hover:translate-x-0
                    group-hover:opacity-100
                  "
                >
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}