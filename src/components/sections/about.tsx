'use client';

import { motion } from 'framer-motion';
import { Sparkles, Zap, Shield, Globe } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';
import { Reveal } from '@/components/ui/reveal';
import { AnimatedCounter } from '@/components/ui/animated-counter';

const features = [
  { icon: Sparkles, title: 'Premium Quality', desc: 'Every piece of content is carefully curated for excellence.' },
  { icon: Zap, title: 'Lightning Fast', desc: 'Optimized for speed with 100/100 Lighthouse scores.' },
  { icon: Shield, title: 'Secure Platform', desc: 'Enterprise-grade security with Row Level Security.' },
  { icon: Globe, title: 'Global Access', desc: 'Available worldwide with CDN-powered delivery.' },
];

export function About() {
  return (
    <section className="section-padding">
      <div className="container-max">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <SectionHeading
              eyebrow="About"
              title="Crafted for Creators"
              subtitle="Lumina is a premium media showcase platform designed for artists, photographers, and content creators who demand excellence."
            />
            <div className="grid grid-cols-2 gap-6 mt-8">
              {[
                { label: 'Active Users', value: 15000, suffix: '+' },
                { label: 'Media Items', value: 1200, suffix: '+' },
                { label: 'Countries', value: 45, suffix: '' },
                { label: 'Uptime', value: 99, suffix: '%' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-3xl font-bold gradient-text">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -6 }}
                  className="p-6 rounded-2xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 h-full"
                >
                  <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center mb-4">
                    <f.icon className="w-6 h-6 text-brand-500" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{f.title}</h3>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{f.desc}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
