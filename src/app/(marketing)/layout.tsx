"use client";

import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useScrollDirection } from '@/lib/hooks/useScrollDirection';
import Link from 'next/link';
import { Show, SignInButton, UserButton } from "@clerk/nextjs";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const scrollDirection = useScrollDirection();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 border-b border-white/5 bg-[#030303]/90 backdrop-blur-2xl transition-transform duration-500 ${scrollDirection === "down" && !isMobileMenuOpen ? "-translate-y-full" : "translate-y-0"}`}>

        {/* Main navbar row */}
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">

          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-3 cursor-pointer group flex-shrink-0">
            <img src="https://i.ibb.co/HDHsqdqL/1000100954.png" alt="Devlynix" className="h-8 w-8 object-contain transition-transform group-hover:rotate-12" />
            <span className="text-lg sm:text-xl font-bold tracking-tight text-white">Devlynix</span>
          </div>

          {/* Desktop: centre nav pills */}
          <div className="hidden md:flex items-center gap-8 rounded-full bg-white/5 px-6 py-2 border border-white/10 backdrop-blur-md">
            <a href="#platform" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Platform</a>
            <a href="#pricing"  className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Pricing</a>
            <a href="#faq"      className="text-sm font-medium text-gray-400 hover:text-white transition-colors">FAQ</a>
            <Link href="/hub"   className="text-sm font-medium text-[#C6FF00] hover:text-white transition-colors">Builder Hub</Link>
          </div>

          {/* Desktop: CTA / avatar */}
          <div className="hidden md:flex items-center gap-4">
            <Show when="signed-out">
              <SignInButton>
                <button className="rounded-lg bg-[#C6FF00] px-5 py-2 text-sm font-bold text-black transition-all hover:scale-105 shadow-[0_0_15px_rgba(198,255,0,0.2)]">
                  Enter Hub
                </button>
              </SignInButton>
            </Show>
            <Show when="signed-in">
              <UserButton />
            </Show>
          </div>

          {/* ── Mobile: Builder Hub link + Enter Hub button + hamburger ── */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Builder Hub — always visible in bar */}
            <Link
              href="/hub"
              className="text-xs font-bold text-[#C6FF00] border border-[#C6FF00]/30 bg-[#C6FF00]/5 px-3 py-1.5 rounded-lg whitespace-nowrap hover:bg-[#C6FF00]/10 active:scale-95 transition-all"
            >
              Builder Hub
            </Link>

            {/* Enter Hub / Avatar — always visible in bar */}
            <Show when="signed-out">
              <SignInButton>
                <button className="rounded-lg bg-[#C6FF00] px-3 py-1.5 text-xs font-bold text-black whitespace-nowrap shadow-[0_0_12px_rgba(198,255,0,0.3)] hover:bg-[#d4ff33] active:scale-95 transition-all">
                  Enter Hub
                </button>
              </SignInButton>
            </Show>
            <Show when="signed-in">
              <UserButton />
            </Show>

            {/* Hamburger — only toggles nav-links dropdown */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle navigation"
              className="p-2 rounded-lg border border-white/10 bg-white/5 text-white hover:bg-white/10 active:scale-95 transition-all"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ── Mobile dropdown — nav links only, slides down ──────────────── */}
        <div
          className={`md:hidden border-t border-white/5 bg-[#080808]/98 backdrop-blur-2xl overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
          }`}
        >
          <div className="flex flex-col px-3 py-3 gap-0.5">
            <a
              href="#platform"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-3 px-4 text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all"
            >
              Platform
            </a>
            <a
              href="#pricing"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-3 px-4 text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all"
            >
              Pricing
            </a>
            <a
              href="#faq"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-3 px-4 text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all"
            >
              FAQ
            </a>
            <Link
              href="/hub"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-3 px-4 text-sm font-semibold text-[#C6FF00] hover:bg-[#C6FF00]/5 rounded-xl transition-all flex items-center gap-2"
            >
              Builder Hub <span className="text-xs opacity-60">↗</span>
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#000] pt-10 sm:pt-12 pb-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col items-center gap-6 text-sm text-gray-500 mb-8">
            <div className="flex items-center gap-3">
              <img src="https://i.ibb.co/HDHsqdqL/1000100954.png" alt="Devlynix" className="w-6 h-6 grayscale opacity-70" />
              <span className="font-bold text-white">Devlynix © {new Date().getFullYear()}</span>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-5 sm:gap-8">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms"   className="hover:text-white transition-colors">Terms of Service</Link>
              <a href="mailto:devlynix@gmail.com" className="hover:text-[#C6FF00] transition-colors font-mono">devlynix@gmail.com</a>
            </div>

            <div className="flex items-center gap-6">
              <a href="https://www.linkedin.com/company/devlynix/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
              <a href="https://github.com/yashharfode"              target="_blank" rel="noreferrer" className="hover:text-white transition-colors">GitHub</a>
            </div>
          </div>

          <div className="flex justify-center items-center gap-2 text-xs text-gray-600 border-t border-white/5 pt-8">
            <span className="w-2 h-2 rounded-full bg-[#C6FF00] animate-pulse"></span> Systems Active • Secured for Engineers
          </div>
        </div>
      </footer>
    </div>
  );
}
