'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { LogOut, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

interface DashboardHeaderProps {
  user: {
    fullName: string;
    email: string;
  };
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (res.ok) {
        showToast('Logged out successfully', 'info');
        router.push('/login');
        router.refresh();
      } else {
        showToast('Failed to logout. Please try again.', 'error');
      }
    } catch {
      showToast('Network error during logout.', 'error');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-zinc-800/70 bg-[#09090b]/85 backdrop-blur-xl px-6 py-2.5 mb-7">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {/* Brand with Proper PostgreSQL & DBMS Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center p-1.5 shadow-xs">
            <Image
              src="/postgres.svg"
              alt="PostgreSQL Logo"
              width={22}
              height={22}
              className="w-5 h-5 object-contain"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-zinc-100 tracking-tight">
              DBMS Portal
            </span>
            <span className="text-zinc-600 text-sm">/</span>
            <span className="text-sm text-zinc-400 font-medium">
              Console
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-mono text-zinc-400 bg-zinc-900/80 border border-zinc-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              PostgreSQL 16
            </span>
          </div>
        </div>

        {/* User profile & action */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900/60 border border-zinc-800/60">
            <div className="w-5 h-5 rounded-md bg-zinc-800 border border-zinc-700/60 flex items-center justify-center font-semibold text-zinc-200 text-xs">
              {getInitials(user.fullName)}
            </div>
            <span className="text-sm font-medium text-zinc-200">{user.fullName}</span>
          </div>

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-zinc-400 hover:text-zinc-100 bg-zinc-900/40 hover:bg-zinc-800/80 border border-zinc-800 transition-all disabled:opacity-50 cursor-pointer"
            title="Sign out of current session"
          >
            {isLoggingOut ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <LogOut className="w-3.5 h-3.5 text-zinc-500" />
            )}
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
