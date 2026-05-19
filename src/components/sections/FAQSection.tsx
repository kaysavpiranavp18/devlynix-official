"use client";

import React from 'react';
import { FAQItem } from '@/components/ui/FAQItem';

export const FAQSection = () => {
  return (
    <section id="faq" className="py-16 sm:py-24 lg:py-32 bg-[#030303]">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-16 reveal-element">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">Frequently Asked <br/> Questions</h2>
        </div>
        <div className="space-y-2">
          <FAQItem 
            question="Kya Devlynix absolute beginners ke liye hai?" 
            answer="Haan, agar aapko basic HTML/CSS/JS aati hai, toh aap yahan se direct modern stack (React/Node) par switch kar sakte hain without wasting time." 
          />
          <FAQItem 
            question="Main community kaise join kar sakta hu?" 
            answer="Aap hamara WhatsApp channel join kar sakte hain jo bilkul free hai. Ya fir upar 'Sign Up' karke Builder's Hub access karein." 
          />
          <FAQItem 
            question="Kya yahan certificates milte hain?" 
            answer="Hum certificates par nahi, Proof of Work (projects) par focus karte hain. Ek live deployed project kisi bhi certificate se zyada value rakhta hai." 
          />
        </div>
      </div>
    </section>
  );
};
