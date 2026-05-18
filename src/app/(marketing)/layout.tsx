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
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3 cursor-pointer group z-50">
            <img src="https://i.ibb.co/HDHsqdqL/1000100954.png" alt="Devlynix" className="h-8 w-8 object-contain transition-transform group-hover:rotate-12" />
            <span className="text-xl font-bold tracking-tight text-white">Devlynix</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 rounded-full bg-white/5 px-6 py-2 border border-white/10 backdrop-blur-md">
            <a href="#platform" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Platform</a>
            <a href="#pricing" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">FAQ</a>
            <Link href="/hub" className="text-sm font-medium text-[#C6FF00] hover:text-white transition-colors">Builder Hub</Link>
          </div>

          <div className="hidden items-center gap-4 md:flex">
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

          <button className="md:hidden text-white z-50 p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`fixed inset-0 bg-[#030303] z-40 transition-transform duration-500 ease-in-out md:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col items-center justify-center h-full gap-8 px-6 pt-20 pb-10 overflow-y-auto">
            <a href="#platform" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-bold text-gray-300 hover:text-white transition-colors">Platform</a>
            <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-bold text-gray-300 hover:text-white transition-colors">Pricing</a>
            <a href="#faq" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-bold text-gray-300 hover:text-white transition-colors">FAQ</a>
            
            <div className="w-full h-px bg-white/10 my-4"></div>
            
            <div className="w-full flex flex-col gap-4">
              <Show when="signed-out">
                <SignInButton>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="w-full py-4 rounded-xl bg-[#C6FF00] text-black font-bold text-lg text-center">
                    Enter Hub
                  </button>
                </SignInButton>
              </Show>
              <Show when="signed-in">
                <div className="flex justify-center">
                  <UserButton />
                </div>
              </Show>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#000] pt-12 pb-8">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-sm text-gray-500 mb-8">
            <div className="flex items-center gap-3">
              <img src="https://i.ibb.co/HDHsqdqL/1000100954.png" alt="Devlynix" className="w-6 h-6 grayscale opacity-70" />
              <span className="font-bold text-white">Devlynix © {new Date().getFullYear()}</span>
            </div>
            
            <div className="flex flex-wrap justify-center items-center gap-8">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <a href="mailto:devlynix@gmail.com" className="hover:text-[#C6FF00] transition-colors font-mono">devlynix@gmail.com</a>
            </div>

            <div className="flex items-center gap-6">
              <a href="https://www.linkedin.com/company/devlynix/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
              <a href="https://github.com/yashharfode" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">GitHub</a>
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
