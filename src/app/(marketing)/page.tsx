"use client";

import React from 'react';
import { HeroSection } from '@/components/sections/HeroSection';
import { BentoGrid } from '@/components/sections/BentoGrid';
import { PricingSection } from '@/components/sections/PricingSection';
import { FAQSection } from '@/components/sections/FAQSection';
import { useIntersectionObserver } from '@/lib/hooks/useIntersectionObserver';
import { Zap, ArrowRight } from 'lucide-react';

export default function MarketingPage() {
  useIntersectionObserver();

  return (
    <>
      {/* Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        .bg-grid-complex {
          background-size: 60px 60px;
          background-image: 
            linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
          mask-image: radial-gradient(circle at center, black 10%, transparent 80%);
        }
        @keyframes slideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .blinking-cursor::after { content: '█'; animation: blink 1s step-start infinite; color: #C6FF00; margin-left:4px;}
        @keyframes blink { 50% { opacity: 0; } }
        @keyframes float { 0% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-15px) rotate(1deg); } 100% { transform: translateY(0px) rotate(0deg); } }
        .animate-float { animation: float 6s ease-in-out infinite; }
      `}} />

      <HeroSection onSignUp={() => {}} />
      <BentoGrid />
      <PricingSection />
      <FAQSection />

      {/* Final CTA */}
      <section className="py-20 sm:py-32 lg:py-40 relative overflow-hidden border-t border-white/5 bg-[#050505]">
        <div className="absolute inset-0 bg-grid-complex opacity-20"></div>
        <div className="absolute bottom-[-20%] left-1/2 -translate-x-1/2 w-[300px] sm:w-[600px] h-[300px] sm:h-[400px] bg-[#C6FF00]/20 blur-[150px] rounded-full pointer-events-none"></div>
        
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center relative z-10 reveal-element">
          <div className="flex justify-center mb-8 sm:mb-10">
             <div className="relative">
                <div className="absolute inset-0 bg-[#C6FF00] blur-2xl opacity-60 rounded-full"></div>
                <img src="https://i.ibb.co/HDHsqdqL/1000100954.png" alt="Devlynix Logo" className="w-16 sm:w-24 h-16 sm:h-24 relative z-10" />
             </div>
          </div>
          
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight mb-6 sm:mb-8 leading-[1.1]">
            Build the future. <br/> Together.
          </h2>
          
          <p className="text-base sm:text-lg text-gray-400 mb-10 sm:mb-12 max-w-xl mx-auto font-light">
            Hazaron developers already ship kar rahe hain. Aap kis cheez ka wait kar rahe hain? Aaj hi apna pehla prod-ready app build karein.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <button className="flex w-full sm:w-auto items-center justify-center gap-3 rounded-xl bg-white px-8 sm:px-10 py-4 sm:py-5 text-lg sm:text-xl font-bold text-black transition-all hover:bg-[#C6FF00] hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
              <Zap className="w-6 h-6 fill-black" /> Initialize Now
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
