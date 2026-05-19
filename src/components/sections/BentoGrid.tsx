"use client";

import React from 'react';
import { Rocket, GitMerge } from 'lucide-react';
import { SpotlightCard } from '@/components/ui/SpotlightCard';

export const BentoGrid = () => {
  return (
    <section id="platform" className="py-16 sm:py-24 lg:py-32 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="reveal-element text-center md:text-left mb-10 sm:mb-16">
          <h2 className="text-[#C6FF00] font-mono text-sm uppercase tracking-widest mb-3 border border-[#C6FF00]/30 inline-block px-3 py-1 rounded-full bg-[#C6FF00]/5">Core Features</h2>
          <h3 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white tracking-tight">Everything to scale <br/> your dev career.</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SpotlightCard className="md:col-span-2 p-6 sm:p-8 reveal-element delay-100 min-h-[220px]">
            <div className="flex h-full flex-col justify-between relative z-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-black mb-4">
                <Rocket className="h-6 w-6" />
              </div>
              <div>
                <h4 className="mb-2 text-xl sm:text-2xl font-bold text-white">Production Grade Focus</h4>
                <p className="text-gray-400">Hum toy apps nahi banate. Microservices, Redis caching, aur complex state management seekhein.</p>
              </div>
            </div>
          </SpotlightCard>

          <SpotlightCard className="p-6 sm:p-8 reveal-element delay-200 min-h-[220px]">
            <div className="flex h-full flex-col justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#C6FF00]/10 text-[#C6FF00] mb-4">
                <GitMerge className="h-6 w-6" />
              </div>
              <div>
                <h4 className="mb-2 text-xl font-bold text-white">Code Reviews</h4>
                <p className="text-sm text-gray-400">Top 1% engineers se real feedback lein.</p>
              </div>
            </div>
          </SpotlightCard>
        </div>
      </div>
    </section>
  );
};
