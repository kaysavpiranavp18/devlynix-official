"use client";

import React from 'react';
import { Check } from 'lucide-react';

export const PricingSection = () => {
  return (
    <section id="pricing" className="py-16 sm:py-24 lg:py-32 relative bg-[#050505] border-y border-white/5">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-16 reveal-element">
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4">Choose your <br/> execution path.</h2>
          <p className="text-gray-400 text-base sm:text-lg">Community hamesha free rahegi. Lekin elite execution ke liye next step lein.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <div className="rounded-[32px] border border-white/10 bg-[#0A0A0A] p-6 sm:p-10 reveal-element flex flex-col">
            <h3 className="text-2xl font-bold text-white mb-2">Community</h3>
            <p className="text-gray-400 mb-6">For developers starting to build.</p>
            <div className="text-5xl sm:text-6xl font-black text-white mb-8">$0<span className="text-lg text-gray-500 font-normal">/forever</span></div>
            
            <ul className="space-y-5 mb-10 flex-grow">
              <li className="flex items-center gap-3 text-gray-300"><Check className="w-5 h-5 text-gray-500 flex-shrink-0"/>Open WhatsApp Community</li>
              <li className="flex items-center gap-3 text-gray-300"><Check className="w-5 h-5 text-gray-500 flex-shrink-0"/>Basic Project Ideas</li>
              <li className="flex items-center gap-3 text-gray-300"><Check className="w-5 h-5 text-gray-500 flex-shrink-0"/>General Networking</li>
            </ul>
            
            <a href="https://whatsapp.com/channel/0029VbCzGzaJpe8chzjL0w1F" target="_blank" rel="noreferrer" 
               className="block w-full py-4 text-center rounded-xl border border-white/20 text-white font-bold hover:bg-white/5 transition-colors">
              Join Free
            </a>
          </div>

          <div className="rounded-[32px] border border-[#C6FF00]/50 bg-[#111] p-6 sm:p-10 relative overflow-hidden reveal-element shadow-[0_0_50px_rgba(198,255,0,0.1)] flex flex-col">
            <div className="absolute top-0 right-0 bg-[#C6FF00] text-black text-[10px] font-bold px-4 py-1.5 rounded-bl-xl tracking-widest uppercase">RECOMMENDED</div>
            <h3 className="text-2xl font-bold text-[#C6FF00] mb-2">Devlynix Elite</h3>
            <p className="text-gray-400 mb-6">For serious engineers who ship.</p>
            <div className="text-5xl sm:text-6xl font-black text-white mb-8">Invite<span className="text-lg text-gray-500 font-normal"> Only</span></div>
            
            <ul className="space-y-5 mb-10 flex-grow">
              <li className="flex items-center gap-3 text-white"><Check className="w-5 h-5 text-[#C6FF00] flex-shrink-0"/>1-on-1 Code Reviews</li>
              <li className="flex items-center gap-3 text-white"><Check className="w-5 h-5 text-[#C6FF00] flex-shrink-0"/>Production Architecture Guides</li>
              <li className="flex items-center gap-3 text-white"><Check className="w-5 h-5 text-[#C6FF00] flex-shrink-0"/>Private GitHub Org Access</li>
              <li className="flex items-center gap-3 text-white"><Check className="w-5 h-5 text-[#C6FF00] flex-shrink-0"/>Resume & Interview Prep</li>
            </ul>
            
            <button className="block w-full py-4 text-center rounded-xl bg-[#C6FF00] text-black font-bold hover:scale-105 transition-transform shadow-[0_0_20px_rgba(198,255,0,0.3)]">
              Request Access
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
