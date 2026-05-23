"use client";

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { UserButton, useUser, useAuth } from '@clerk/nextjs';
import { createClerkSupabaseClient } from '@/lib/supabase';
import { 
  Zap, 
  Home, 
  Terminal, 
  Briefcase, 
  User as UserIcon,
  Settings,
  Menu,
  X,
  ShieldAlert,
  Building2
} from 'lucide-react';
import Link from 'next/link';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUser();
  const { getToken } = useAuth();
  
  const [streakDays, setStreakDays] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchStreak = async () => {
      try {
        const token = await getToken({ template: 'supabase' });
        if (!token) return;
        const client = createClerkSupabaseClient(token);
        const { data, error } = await client
          .from('profiles')
          .select('streak_days')
          .eq('clerk_user_id', user.id)
          .maybeSingle();
        if (data) setStreakDays(data.streak_days ?? 0);
      } catch (err) {
        console.error('Failed to fetch streak:', err);
      }
    };
    fetchStreak();
  }, [user, getToken]);

  const userRole = user?.publicMetadata?.role as string | undefined;

  const navItems = [
    { name: 'Hub', href: '/hub', icon: Home },
    { name: 'Hackathons', href: '/hackathons', icon: Terminal },
    { name: 'Projects', href: '/projects', icon: Briefcase },
    { name: 'Profile', href: '/profile', icon: UserIcon },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  if (userRole === 'ADMIN') {
    navItems.push({ name: 'Admin Console', href: '/applications', icon: ShieldAlert });
  } else if (userRole === 'ORGANIZER') {
    navItems.push({ name: 'Organizer Dashboard', href: '/organizer', icon: Building2 });
  } else {
    navItems.push({ name: 'Host a Hackathon', href: '/apply-to-host', icon: Building2 });
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#030303] text-white">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 border-b border-white/5 bg-[#030303]/90 backdrop-blur-xl z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2" onClick={() => router.push('/hub')}>
          <img src="https://i.ibb.co/HDHsqdqL/1000100954.png" alt="Devlynix" className="h-8 w-8 object-contain" />
          <span className="font-bold">Devlynix</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-gray-400 hover:text-white">
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`scrollbar-theme
        fixed md:static inset-y-0 left-0 z-40 w-64 border-r border-white/5 bg-[#0A0A0A] transition-transform duration-300 ease-in-out flex flex-col
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
      `}>
        <div className="hidden md:flex h-20 items-center gap-3 px-6 cursor-pointer group" onClick={() => router.push('/hub')}>
          <img src="https://i.ibb.co/HDHsqdqL/1000100954.png" alt="Devlynix" className="h-8 w-8 object-contain transition-transform group-hover:rotate-12" />
          <span className="text-xl font-bold tracking-tight text-white">Devlynix</span>
        </div>

        <div className="scrollbar-theme flex-1 overflow-y-auto py-6 px-4 space-y-2 mt-16 md:mt-0">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link key={item.name} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-[#C6FF00]/10 text-[#C6FF00] font-medium' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}>
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </div>
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 bg-[#111] p-3 rounded-xl border border-white/5">
            <UserButton />
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold truncate">{user?.firstName || 'Builder'}</span>
              {streakDays !== null && (
                <span className="text-xs text-[#C6FF00] flex items-center gap-1">
                  <Zap className="w-3 h-3" /> {streakDays} Day Streak
                </span>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="scrollbar-theme flex-1 relative overflow-y-auto pt-16 md:pt-0">
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
          backgroundSize: "40px 40px",
          backgroundImage: "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)"
        }} />
        <div className="relative z-10 h-full">
          {children}
        </div>
      </main>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 z-30 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
