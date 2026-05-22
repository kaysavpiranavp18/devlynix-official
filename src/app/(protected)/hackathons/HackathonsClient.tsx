"use client";

import React, { useState, useRef, MouseEvent } from 'react';
import { Search, Trophy, Calendar, Users, Terminal, ArrowRight, Zap, Sparkles, Star } from 'lucide-react';
import type { Hackathon } from '@prisma/client';

// --- Spotlight Card Component ---
interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  isFeatured?: boolean;
}

function SpotlightCard({ children, className = "", isFeatured = false }: SpotlightCardProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!divRef.current || isFocused) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={() => { setIsFocused(true); setOpacity(1); }}
      onBlur={() => { setIsFocused(false); setOpacity(0); }}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={`relative rounded-3xl border bg-[#0A0A0A] overflow-hidden ${
        isFeatured ? 'border-[#C6FF00]/50 shadow-[0_0_30px_rgba(198,255,0,0.15)]' : 'border-white/10'
      } ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(198,255,0,0.1), transparent 40%)`,
        }}
      />
      {children}
    </div>
  );
}

export default function HackathonsClient({ initialHackathons }: { initialHackathons: Hackathon[] }) {
  const [activeTab, setActiveTab] = useState<'Active' | 'Upcoming' | 'Past'>('Active');
  const [searchQuery, setSearchQuery] = useState('');

  // Example status logic: we determine status by dates for now, since Prisma just has start/end date
  const getStatus = (start: Date, end: Date) => {
    const now = new Date();
    if (now < start) return 'Upcoming';
    if (now > end) return 'Past';
    return 'Active';
  };

  const processedHackathons = initialHackathons.map((h) => {
    const status = getStatus(h.start_date, h.end_date);
    const daysLeft = Math.max(0, Math.ceil((new Date(h.end_date).getTime() - new Date().getTime()) / (1000 * 3600 * 24)));
    return {
      ...h,
      status,
      daysLeft,
      // Defaulting some UI specific fields that aren't in Prisma yet
      prizePool: 'TBA',
      participants: 0,
      tags: [],
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800'
    };
  });

  const filteredHackathons = processedHackathons.filter((h) => {
    const matchesTab = h.status === activeTab;
    const matchesSearch = h.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#030303] pb-24">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#C6FF00]/5 to-transparent pointer-events-none z-0" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]" style={{
        backgroundSize: "40px 40px",
        backgroundImage: "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)"
      }} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 md:pt-16 relative z-10">
        
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C6FF00]/10 border border-[#C6FF00]/20 text-[#C6FF00] text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" /> The Arena is Open
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight">
            Compete. Build.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C6FF00] to-green-400">
              Win Epic Prizes.
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            Join the most elite builder competitions on the internet. Team up, ship incredible products, and get noticed by top companies.
          </p>
        </div>

        {/* Controls: Tabs & Search */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-10 bg-[#0A0A0A]/50 p-2 rounded-2xl border border-white/10 backdrop-blur-md">
          <div className="flex w-full md:w-auto gap-1 bg-[#111] p-1 rounded-xl border border-white/5">
            {['Active', 'Upcoming', 'Past'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === tab
                    ? 'bg-[#C6FF00] text-black shadow-[0_0_15px_rgba(198,255,0,0.3)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[#C6FF00] transition-colors" />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#111] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#C6FF00]/50 focus:bg-[#151515] transition-all placeholder:text-gray-600"
            />
          </div>
        </div>

        {/* Hackathons Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-20">
          {filteredHackathons.length > 0 ? (
            filteredHackathons.map((hackathon) => (
              <SpotlightCard key={hackathon.id} isFeatured={hackathon.is_featured} className="group cursor-pointer">
                <div className="flex flex-col h-full relative z-10">
                  {/* Image Header */}
                  <div className="h-48 w-full relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent z-10" />
                    <img 
                      src={hackathon.image} 
                      alt={hackathon.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    
                    <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                      {hackathon.is_featured && (
                        <span className="px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-[#C6FF00] to-green-400 text-black shadow-[0_0_20px_rgba(198,255,0,0.6)] flex items-center gap-1 uppercase tracking-wider animate-pulse">
                          <Star className="w-3 h-3 fill-black" /> Featured
                        </span>
                      )}
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md flex items-center gap-1 w-max ${
                        hackathon.status === 'Active' ? 'bg-[#C6FF00]/20 border-[#C6FF00]/50 text-[#C6FF00]' :
                        hackathon.status === 'Upcoming' ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' :
                        'bg-gray-500/20 border-gray-500/50 text-gray-400'
                      }`}>
                        {hackathon.status === 'Active' && <span className="w-1.5 h-1.5 rounded-full bg-[#C6FF00] animate-pulse" />}
                        {hackathon.status}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-[#C6FF00] transition-colors">
                      {hackathon.title}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-2 mb-6 flex-1">
                      {hackathon.description}
                    </p>

                    <div className="grid grid-cols-3 gap-4 mb-6 py-4 border-y border-white/5">
                      <div>
                        <div className="text-xs text-gray-500 font-mono mb-1 flex items-center gap-1"><Trophy className="w-3 h-3"/> Prize Pool</div>
                        <div className="font-bold text-white">{hackathon.prizePool}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 font-mono mb-1 flex items-center gap-1"><Users className="w-3 h-3"/> Builders</div>
                        <div className="font-bold text-white">{hackathon.participants.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 font-mono mb-1 flex items-center gap-1"><Calendar className="w-3 h-3"/> {hackathon.status === 'Active' ? 'Ends In' : 'Starts'}</div>
                        <div className="font-bold text-white">
                          {hackathon.status === 'Active' ? `${hackathon.daysLeft} Days` : 
                           hackathon.status === 'Upcoming' ? new Date(hackathon.start_date).toLocaleDateString() : 'Ended'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex flex-wrap gap-2">
                        {hackathon.tags.map(tag => (
                          <span key={tag} className="px-2 py-1 bg-[#111] border border-white/10 rounded-md text-xs text-gray-400 font-mono">
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <button className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 text-white group-hover:bg-[#C6FF00] group-hover:text-black group-hover:border-[#C6FF00] transition-all duration-300">
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </SpotlightCard>
            ))
          ) : (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-center border border-white/5 rounded-3xl bg-[#0A0A0A]/50 backdrop-blur-sm">
              <Terminal className="w-12 h-12 text-gray-600 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No hackathons found</h3>
              <p className="text-gray-500">Try adjusting your search query or check a different tab.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
