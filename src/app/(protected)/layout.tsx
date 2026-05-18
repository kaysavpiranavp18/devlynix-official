"use client";

import { useEffect, useState } from 'react';
import { Zap } from 'lucide-react';
import { useScrollDirection } from '@/lib/hooks/useScrollDirection';
import { useRouter } from 'next/navigation';
import { UserButton, useUser, useAuth } from '@clerk/nextjs';
import { createClerkSupabaseClient } from '@/lib/supabase';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const scrollDirection = useScrollDirection();
  const router = useRouter();
  const { user } = useUser();
  const { getToken } = useAuth();
  const [streakDays, setStreakDays] = useState<number | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetchStreak = async () => {
      try {
        const token = await getToken({ template: 'supabase' });
        if (!token) return;
        const client = createClerkSupabaseClient(token);
        const { data } = await client
          .from('profiles')
          .select('streak_days')
          .eq('clerk_user_id', user.id)
          .maybeSingle();
        if (data) setStreakDays(data.streak_days ?? 0);
      } catch {
        // silently fail — streak just won't show
      }
    };
    fetchStreak();
  }, [user, getToken]);

  return (
    <div className="flex min-h-screen flex-col bg-[#030303]">
      <nav className={`fixed top-0 w-full z-50 border-b border-white/5 bg-[#030303]/90 backdrop-blur-2xl transition-transform duration-500 ${scrollDirection === "down" ? "-translate-y-full" : "translate-y-0"}`}>
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => router.push('/hub')}>
            <img src="https://i.ibb.co/HDHsqdqL/1000100954.png" alt="Devlynix" className="h-8 w-8 object-contain transition-transform group-hover:rotate-12" />
            <span className="text-xl font-bold tracking-tight text-white">Devlynix</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-bold text-white">{user?.firstName || 'Builder'}</span>
              {streakDays !== null && (
                <span className="text-xs text-[#C6FF00] flex items-center gap-1">
                  <Zap className="w-3 h-3" /> {streakDays} Day Streak
                </span>
              )}
            </div>
            <UserButton />
          </div>
        </div>
      </nav>
      <main className="flex-1">{children}</main>
    </div>
  );
}
