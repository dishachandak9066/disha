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
    <section id="features" className="pt-20 pb-12 px-6 relative">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Supercharge Your{' '}
            <span className="text-gradient">
              Reading
            </span>
          </h2>

          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Everything you need to read more, learn faster,
            and enjoy every page.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
              whileHover={{ y: -5 }}
              onClick={() => handleFeatureClick(feature)}
              className={`glass p-8 rounded-3xl group relative overflow-hidden transition-all duration-300 ${
                feature.requiresAuth ? 'cursor-pointer' : ''
              }`}
            >
              <div
                className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br ${feature.color}`}
              />

              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg text-white`}
              >
                {feature.icon}
              </div>

              <h3 className="text-xl font-bold mb-3">
                {feature.title}
              </h3>

              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}