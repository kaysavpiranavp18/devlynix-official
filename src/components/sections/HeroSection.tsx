"use client";

import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';

export const HeroSection = ({ onSignUp }: { onSignUp: () => void }) => {
  const [terminalLines, setTerminalLines] = useState<{ text: string, type: string, delay?: number }[]>([]);

  useEffect(() => {
    const fullTerminalScript = [
      { text: "devlynix init --premium", type: "cmd" },
      { text: "Building robust architecture...", type: "sys", delay: 800 },
      { text: "✔ Connected to cluster", type: "ok", delay: 400 },
      { text: "✔ Scalability tests passed", type: "ok", delay: 300 },
      { text: "devlynix ship --prod", type: "cmd", delay: 1000 },
      { text: "Deploying to edge network...", type: "sys", delay: 1200 },
      { text: "🚀 Live at devlynix.com", type: "highlight", delay: 500 }
    ];

    let currentIndex = 0;
    const runTerminal = () => {
      if (currentIndex < fullTerminalScript.length) {
        const line = fullTerminalScript[currentIndex];
        setTimeout(() => {
          setTerminalLines(prev => [...prev, line]);
          currentIndex++;
          runTerminal();
        }, line.delay || 600);
      }
    };
    runTerminal();
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      <div className="absolute inset-0 bg-grid-complex pointer-events-none opacity-50 z-0"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-[#C6FF00]/10 blur-[150px] pointer-events-none hidden md:block"></div>

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 lg:gap-16 px-4 sm:px-6 lg:grid-cols-2 mt-6 lg:mt-10">
        <div className="flex flex-col items-start z-20 reveal-element">
          <div className="mb-5 flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-[#C6FF00] animate-pulse"></span>
            <span className="text-xs sm:text-sm text-gray-300">Join 15,000+ builders executing daily</span>
          </div>
          
          <h1 className="mb-5 text-5xl sm:text-6xl font-black leading-[1.05] tracking-tight text-white md:text-7xl lg:text-8xl">
            Code. <br />
            Ship. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C6FF00] to-green-500" style={{textShadow: "0 0 20px rgba(198,255,0,0.4)"}}>Dominate.</span>
          </h1>
          
          <p className="mb-8 max-w-lg text-base sm:text-xl text-gray-400 leading-relaxed font-light">
            Tutorial hell se bahar aao. Devlynix ek elite platform hai jahan hum production-ready apps build karte hain.
          </p>
          
          <div className="flex flex-col gap-4 sm:flex-row w-full sm:w-auto">
            <button onClick={onSignUp} className="group flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-base sm:text-lg font-bold text-black transition-all hover:bg-[#C6FF00] hover:shadow-[0_0_30px_rgba(198,255,0,0.5)]">
              Start Executing <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        <div className="relative z-10 lg:ml-auto w-full max-w-lg mx-auto reveal-element animate-float">
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-[#C6FF00]/30 to-blue-500/30 opacity-50 blur-2xl"></div>
          <div className="rounded-[24px] border border-white/10 bg-[#0A0A0A]/90 backdrop-blur-2xl shadow-2xl overflow-hidden relative">
            <div className="flex items-center justify-between border-b border-white/10 bg-[#111] px-4 py-3">
              <div className="flex gap-2">
                <div className="h-3 w-3 rounded-full bg-[#FF5F56]"></div>
                <div className="h-3 w-3 rounded-full bg-[#FFBD2E]"></div>
                <div className="h-3 w-3 rounded-full bg-[#27C93F]"></div>
              </div>
              <div className="text-xs font-mono text-gray-500 truncate max-w-[120px] sm:max-w-none">yash@devlynix-core ~ %</div>
              <div className="w-10"></div> 
            </div>
            
            <div className="p-4 sm:p-6 font-mono text-xs sm:text-sm leading-loose h-[240px] sm:h-[300px] overflow-hidden flex flex-col text-left">
              {terminalLines.map((line, i) => (
                <div key={i} className="mb-2 animate-[slideIn_0.3s_ease-out]">
                  {line.type === 'cmd' && <span className="text-[#C6FF00]">➜ </span>}
                  <span className={
                    line.type === 'cmd' ? 'text-white font-medium' : 
                    line.type === 'ok' ? 'text-green-400' : 
                    line.type === 'highlight' ? 'text-[#C6FF00] font-bold bg-[#C6FF00]/10 px-2 py-1 rounded' : 'text-gray-500'
                  }>{line.text}</span>
                </div>
              ))}
              <div className="mt-2 text-[#C6FF00] blinking-cursor"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
