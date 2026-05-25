"use client";

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { UserButton, useUser } from '@clerk/nextjs';
import { 
  ShieldAlert, 
  LayoutDashboard, 
  Users, 
  Terminal, 
  FileText,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoaded } = useUser();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [roleLoaded, setRoleLoaded] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      setRoleLoaded(true);
      setUserRole(null);
      return;
    }

    let isMounted = true;

    const loadRole = async () => {
      try {
        const response = await fetch('/api/me/role', { cache: 'no-store' });
        const data = await response.json();

        if (isMounted) {
          setUserRole(data.role ?? null);
        }
      } catch {
        if (isMounted) {
          setUserRole(null);
        }
      } finally {
        if (isMounted) {
          setRoleLoaded(true);
        }
      }
    };

    loadRole();

    return () => {
      isMounted = false;
    };
  }, [isLoaded, user]);

  useEffect(() => {
    if (roleLoaded && userRole !== 'ADMIN') {
      router.replace('/hub');
    }
  }, [roleLoaded, userRole, router]);

  if (!isLoaded || !roleLoaded) {
    return null;
  }

  if (userRole !== 'ADMIN') {
    return null;
  }

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Hackathons', href: '/admin/hackathons', icon: Terminal },
    { name: 'Applications', href: '/applications', icon: FileText },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#030303] text-gray-300">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 border-b border-white/5 bg-[#030303]/90 backdrop-blur-xl z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-emerald-700" />
          <span className="font-bold text-white tracking-tight">Admin Console</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-gray-500 hover:text-white">
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-40 w-64 border-r border-[#111] bg-[#0A0A0A] transition-transform duration-300 ease-in-out flex flex-col
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
      `}>
        <div className="hidden md:flex h-20 items-center gap-3 px-6">
          <ShieldAlert className="w-6 h-6 text-emerald-700" />
          <span className="text-xl font-bold tracking-tight text-white">Admin Console</span>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2 mt-16 md:mt-0">
          <div className="text-xs font-mono text-gray-600 uppercase tracking-widest px-4 mb-4">Management</div>
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link key={item.name} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive 
                    ? 'bg-emerald-900/20 text-emerald-500 font-medium border border-emerald-900/30' 
                    : 'text-gray-500 hover:bg-[#111] hover:text-gray-300 border border-transparent'
                }`}>
                  <item.icon className="w-4 h-4" />
                  <span className="text-sm">{item.name}</span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-[#111]">
          <Link href="/hub" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-[#111] hover:text-gray-300 transition-colors mb-2">
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Exit to Hub</span>
          </Link>
          <div className="flex items-center gap-3 bg-[#111] p-3 rounded-xl border border-white/5">
            <UserButton />
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium text-white truncate">{user?.firstName || 'Admin'}</span>
              <span className="text-xs text-gray-500 font-mono">System Administrator</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative overflow-y-auto pt-16 md:pt-0">
        <div className="relative z-10 h-full p-4 md:p-8">
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
