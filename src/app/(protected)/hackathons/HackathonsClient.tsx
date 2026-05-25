"use client";

import React, { useState, useRef, MouseEvent } from 'react';
import { Search, Trophy, Calendar, Users, Terminal, ArrowRight, Sparkles, Star, Building2, MapPinned, TimerReset } from 'lucide-react';
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
      prizePool: h.prize_pool || 'TBA',
      maxTeamSize: h.max_team_size ?? 4,
    };
  });

  const filteredHackathons = processedHackathons.filter((h) => {
    const matchesTab = h.status === activeTab;
    const searchableText = [h.title, h.tagline, h.description, h.organization_name, h.theme, h.mode]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    const matchesSearch = searchableText.includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const featuredCount = processedHackathons.filter((hackathon) => hackathon.is_featured).length;
  const activeCount = processedHackathons.filter((hackathon) => hackathon.status === 'Active').length;
  const upcomingCount = processedHackathons.filter((hackathon) => hackathon.status === 'Upcoming').length;
  const pastCount = processedHackathons.filter((hackathon) => hackathon.status === 'Past').length;

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
        <div className="mb-12 grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-6 items-stretch">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_right,rgba(198,255,0,0.12),transparent_38%),linear-gradient(135deg,rgba(10,10,10,0.96),rgba(6,6,6,0.88))] p-8 md:p-10 shadow-[0_0_80px_rgba(0,0,0,0.35)]">
            <div className="absolute inset-0 opacity-[0.04]" style={{
              backgroundImage: "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
              backgroundSize: "28px 28px"
            }} />
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C6FF00]/10 border border-[#C6FF00]/20 text-[#C6FF00] text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" /> Hosted Hackathons
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight">
                Compete. Build.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C6FF00] to-green-400">
                  Win Epic Prizes.
                </span>
              </h1>
              <p className="text-gray-400 text-lg leading-8 max-w-2xl">
                Browse approved hackathons hosted by organizers, discover the theme, mode, prize pool, and team limits, and join the right challenge for your team.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-3xl border border-white/10 bg-[#0A0A0A] p-5 flex flex-col justify-between">
              <span className="text-xs uppercase tracking-[0.3em] text-gray-500 font-mono">Featured</span>
              <div className="text-3xl font-black text-white mt-4">{featuredCount}</div>
              <p className="text-sm text-gray-500 mt-2">Highlighted hackathons</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-[#0A0A0A] p-5 flex flex-col justify-between">
              <span className="text-xs uppercase tracking-[0.3em] text-gray-500 font-mono">Active</span>
              <div className="text-3xl font-black text-white mt-4">{activeCount}</div>
              <p className="text-sm text-gray-500 mt-2">Live right now</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-[#0A0A0A] p-5 flex flex-col justify-between">
              <span className="text-xs uppercase tracking-[0.3em] text-gray-500 font-mono">Upcoming</span>
              <div className="text-3xl font-black text-white mt-4">{upcomingCount}</div>
              <p className="text-sm text-gray-500 mt-2">Coming soon</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-[#0A0A0A] p-5 flex flex-col justify-between">
              <span className="text-xs uppercase tracking-[0.3em] text-gray-500 font-mono">Past</span>
              <div className="text-3xl font-black text-white mt-4">{pastCount}</div>
              <p className="text-sm text-gray-500 mt-2">Completed events</p>
            </div>
          </div>
        </div>

        {/* Controls: Tabs & Search */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-10 bg-[#0A0A0A]/60 p-2 rounded-2xl border border-white/10 backdrop-blur-md">
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

          <div className="flex items-center gap-3 text-xs text-gray-500 font-mono bg-[#111] border border-white/5 rounded-xl px-4 py-3 w-full md:w-auto justify-between md:justify-start">
            <span className="inline-flex items-center gap-2"><Star className="w-3 h-3 text-[#C6FF00]" /> Featured-first sorting</span>
            <span className="hidden md:inline text-gray-700">|</span>
            <span>Approved only</span>
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
                  <div className="relative overflow-hidden border-b border-white/5 bg-[radial-gradient(circle_at_top_right,rgba(198,255,0,0.18),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))] p-6 min-h-[220px]">
                    <div className="absolute inset-0 opacity-[0.08]" style={{
                      backgroundImage: "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
                      backgroundSize: "24px 24px"
                    }} />

                    <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-3">
                          <div className="flex flex-wrap gap-2">
                            {hackathon.is_featured && (
                              <span className="px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-[#C6FF00] to-green-400 text-black shadow-[0_0_20px_rgba(198,255,0,0.35)] flex items-center gap-1 uppercase tracking-wider">
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

                          <div>
                            <p className="text-xs uppercase tracking-[0.35em] text-gray-500 font-mono mb-2 flex items-center gap-2">
                              <Building2 className="w-3 h-3" /> {hackathon.organization_name}
                            </p>
                            <h3 className="text-2xl font-bold text-white group-hover:text-[#C6FF00] transition-colors">
                              {hackathon.title}
                            </h3>
                            {hackathon.tagline && (
                              <p className="text-sm text-gray-300 mt-2 max-w-xl">
                                {hackathon.tagline}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="hidden sm:flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-black/30 text-[#C6FF00]">
                          <Trophy className="w-6 h-6" />
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {hackathon.theme && (
                          <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-gray-300 font-mono flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-[#C6FF00]" /> {hackathon.theme}
                          </span>
                        )}
                        {hackathon.mode && (
                          <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-gray-300 font-mono flex items-center gap-1">
                            <MapPinned className="w-3 h-3 text-gray-400" /> {hackathon.mode}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <p className="text-gray-400 text-sm line-clamp-3 mb-6 flex-1 leading-6">
                      {hackathon.description || 'No description provided yet.'}
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 py-4 border-y border-white/5">
                      <div>
                        <div className="text-xs text-gray-500 font-mono mb-1 flex items-center gap-1"><Trophy className="w-3 h-3"/> Prize Pool</div>
                        <div className="font-bold text-white">{hackathon.prizePool}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 font-mono mb-1 flex items-center gap-1"><Users className="w-3 h-3"/> Team Size</div>
                        <div className="font-bold text-white">Up to {hackathon.maxTeamSize}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 font-mono mb-1 flex items-center gap-1"><Calendar className="w-3 h-3"/> {hackathon.status === 'Active' ? 'Ends In' : 'Starts'}</div>
                        <div className="font-bold text-white">
                          {hackathon.status === 'Active' ? `${hackathon.daysLeft} Days` : 
                           hackathon.status === 'Upcoming' ? new Date(hackathon.start_date).toLocaleDateString() : 'Ended'}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 font-mono mb-1 flex items-center gap-1"><TimerReset className="w-3 h-3"/> Dates</div>
                        <div className="font-bold text-white text-xs leading-5">
                          {new Date(hackathon.start_date).toLocaleDateString()}<br />
                          {new Date(hackathon.end_date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                      <div className="text-xs text-gray-500 flex items-center gap-2 font-mono">
                        <span className="inline-flex items-center gap-1"><Building2 className="w-3 h-3" /> {hackathon.organization_name}</span>
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
              <p className="text-gray-500 max-w-md">
                Try adjusting your search query, switch to another tab, or check back after an organizer submits a request and an admin approves it.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
