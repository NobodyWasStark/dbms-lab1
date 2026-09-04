'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  BookOpen,
  Calendar,
  Phone,
  Mail,
  RefreshCw,
  Fingerprint,
  ShieldCheck,
  Check,
  Copy,
  AlertTriangle,
} from 'lucide-react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import UserTable, { UserRecord } from '@/components/dashboard/UserTable';
import CourseTable, { CourseRecord } from '@/components/dashboard/CourseTable';
import GenderDistributionChart from '@/components/dashboard/GenderDistributionChart';
import QueryInspector from '@/components/dashboard/QueryInspector';
import StatCounter from '@/components/ui/StatCounter';
import { useToast } from '@/components/ui/Toast';

interface CurrentUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [stats, setStats] = useState<{ totalUsers: number; totalCourses: number } | null>(null);
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [courses, setCourses] = useState<CourseRecord[]>([]);

  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<string>('');
  const [copiedId, setCopiedId] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    setIsRefreshing(true);
    setDbError(null);
    try {
      const [statsRes, usersRes, coursesRes] = await Promise.all([
        fetch('/api/dashboard/stats'),
        fetch('/api/dashboard/users'),
        fetch('/api/dashboard/courses'),
      ]);

      if (!statsRes.ok || !usersRes.ok || !coursesRes.ok) {
        throw new Error('Database query execution failed.');
      }

      const statsData = await statsRes.json();
      const usersData = await usersRes.json();
      const coursesData = await coursesRes.json();

      setStats({
        totalUsers: statsData.totalUsers,
        totalCourses: statsData.totalCourses,
      });
      setUsers(usersData.users || []);
      setCourses(coursesData.courses || []);

      setLastRefreshed(
        new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );

      // Subtle flash highlight on stat cards
      setIsFlashing(true);
      setTimeout(() => setIsFlashing(false), 380);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Database query failed';
      setDbError(msg);
      showToast('Database connection failed. Please retry.', 'error');
    } finally {
      setIsLoadingData(false);
      setIsRefreshing(false);
    }
  }, [showToast]);

  useEffect(() => {
    let ignore = false;

    async function loadInitialData() {
      try {
        const res = await fetch('/api/auth/session');
        if (!res.ok) {
          setIsLoadingSession(false);
          router.replace('/login?from=/dashboard');
          return;
        }
        const data = await res.json();
        if (ignore) return;
        setCurrentUser(data.user);
        setIsLoadingSession(false);

        if (data.user) {
          await fetchDashboardData();
        }
      } catch {
        if (!ignore) {
          setIsLoadingSession(false);
          router.replace('/login?from=/dashboard');
        }
      }
    }

    loadInitialData();

    return () => {
      ignore = true;
    };
  }, [router, fetchDashboardData]);

  const handleManualRefresh = async () => {
    await fetchDashboardData();
    if (!dbError) {
      showToast('Live database queries executed', 'success');
    }
  };

  const handleCopyUserId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 1800);
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  if (isLoadingSession) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#09090b] text-zinc-400">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-mono tracking-widest text-zinc-400 uppercase">
            Connecting to PostgreSQL...
          </p>
          <a
            href="/login"
            className="text-xs text-zinc-500 hover:text-zinc-300 underline underline-offset-4 mt-2 transition-colors"
          >
            Session expired? Click to Sign In
          </a>
        </div>
      </div>
    );
  }

  if (!currentUser) return null;

  return (
    <div className="relative min-h-screen flex flex-col pb-20 bg-[#09090b] text-zinc-100 selection:bg-zinc-800 selection:text-white">
      <DashboardHeader user={currentUser} />

      <main className="relative z-10 max-w-6xl w-full mx-auto px-6 space-y-6">
        {/* Top Control Bar with Pulsing Heartbeat */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-zinc-800/70">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-100">
                Database Dashboard
              </h1>

              {/* Heartbeat Status Dot */}
              <div className="flex items-center gap-2 px-3 py-1 rounded-md text-xs font-mono text-zinc-300 bg-zinc-900 border border-zinc-800">
                <motion.span
                  animate={{
                    scale: [1, 1.25, 1],
                    opacity: [1, 0.6, 1],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: 'easeInOut',
                  }}
                  className="w-2 h-2 rounded-full bg-emerald-400 inline-block"
                />
                <span>PostgreSQL 16</span>
              </div>
            </div>
            <p className="text-sm text-zinc-400 mt-1">
              Real-time query execution via Prisma ORM on normalized PostgreSQL database
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Animated Query Time Transition */}
            {lastRefreshed && (
              <div className="text-xs text-zinc-400 font-mono hidden sm:flex items-center gap-1.5">
                <span>Query Time:</span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={lastRefreshed}
                    initial={{ opacity: 0, y: -3 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 3 }}
                    transition={{ duration: 0.15 }}
                    className="text-zinc-200 font-medium"
                  >
                    {lastRefreshed}
                  </motion.span>
                </AnimatePresence>
              </div>
            )}

            {/* Tactile Professional Re-run Queries Button */}
            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-zinc-950 bg-zinc-100 hover:bg-white transition-all shadow-sm disabled:opacity-50 cursor-pointer active:scale-[0.98]"
            >
              <RefreshCw className={`w-4 h-4 text-zinc-700 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Querying...' : 'Re-run Queries'}</span>
            </button>
          </div>
        </div>

        {/* Database Error State */}
        {dbError && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl border border-red-500/30 bg-red-950/20 flex items-center justify-between gap-3 text-sm"
          >
            <div className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Connection failed: {dbError}</span>
            </div>
            <button
              onClick={handleManualRefresh}
              className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-medium text-xs sm:text-sm transition-colors cursor-pointer"
            >
              Retry
            </button>
          </motion.div>
        )}

        {/* Top 3 Metric Cards: Students, Courses, and Demographic Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Total Students (COUNT) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className={`rounded-2xl border p-6 flex flex-col justify-between transition-all duration-300 backdrop-blur-sm ${
              isFlashing
                ? 'border-zinc-500/80 bg-zinc-800/30 ring-1 ring-zinc-500/30'
                : 'border-zinc-800/80 bg-zinc-900/30 hover:border-zinc-700/80'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Total Students
              </span>
              <div className="w-7 h-7 rounded-lg bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-zinc-400">
                <Users className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline gap-2.5 my-1.5">
              {isLoadingData || !stats ? (
                <div className="h-10 bg-zinc-800 rounded w-20 animate-pulse my-0.5" />
              ) : (
                <StatCounter
                  value={stats.totalUsers}
                  duration={1.2}
                  className="text-4xl sm:text-5xl font-bold text-zinc-100 tracking-tight font-mono"
                />
              )}
              <span className="text-sm text-zinc-400 font-normal">registered students</span>
            </div>

            <div className="mt-3 pt-3 border-t border-zinc-800/60 text-xs font-mono text-zinc-500 flex items-center justify-between">
              <span>SELECT COUNT(*)</span>
              <span className="text-zinc-300">&quot;User&quot; Table</span>
            </div>
          </motion.div>

          {/* Card 2: Course Catalog (COUNT) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.12 }}
            className={`rounded-2xl border p-6 flex flex-col justify-between transition-all duration-300 backdrop-blur-sm ${
              isFlashing
                ? 'border-zinc-500/80 bg-zinc-800/30 ring-1 ring-zinc-500/30'
                : 'border-zinc-800/80 bg-zinc-900/30 hover:border-zinc-700/80'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Course Catalog
              </span>
              <div className="w-7 h-7 rounded-lg bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-zinc-400">
                <BookOpen className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline gap-2.5 my-1.5">
              {isLoadingData || !stats ? (
                <div className="h-10 bg-zinc-800 rounded w-20 animate-pulse my-0.5" />
              ) : (
                <StatCounter
                  value={stats.totalCourses}
                  duration={1.2}
                  className="text-4xl sm:text-5xl font-bold text-zinc-100 tracking-tight font-mono"
                />
              )}
              <span className="text-sm text-zinc-400 font-normal">active courses</span>
            </div>

            <div className="mt-3 pt-3 border-t border-zinc-800/60 text-xs font-mono text-zinc-500 flex items-center justify-between">
              <span>SELECT COUNT(*)</span>
              <span className="text-zinc-300">&quot;Course&quot; Table</span>
            </div>
          </motion.div>

          {/* Card 3: Demographic Distribution Segmented Bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.18 }}
          >
            <GenderDistributionChart users={users} isLoading={isLoadingData} />
          </motion.div>
        </div>

        {/* System Architecture Telemetry Pill Strip with Official Logos */}
        <div className="px-5 py-3 rounded-xl border border-zinc-800/70 bg-zinc-950/40 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-[13px] font-mono text-zinc-400">
          <div className="flex items-center gap-2.5">
            <Image
              src="/postgres.svg"
              alt="PostgreSQL"
              width={18}
              height={18}
              className="w-4.5 h-4.5 object-contain"
            />
            <span className="text-zinc-200 font-medium">PostgreSQL 16 Engine</span>
            <span className="text-zinc-700">·</span>
            <span className="text-zinc-400">Port 5432</span>
            <span className="text-zinc-700">·</span>
            <span className="text-zinc-300">ACID Transactions</span>
          </div>

          <div className="flex items-center gap-4 text-zinc-400">
            <div className="flex items-center gap-1.5 text-zinc-300">
              <Image
                src="/docker.svg"
                alt="Docker"
                width={16}
                height={16}
                className="w-4 h-4 object-contain"
              />
              <span>Docker Container</span>
            </div>
            <span className="text-zinc-700">·</span>
            <div className="flex items-center gap-1.5 text-zinc-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Bcrypt Salt 12</span>
            </div>
            <span className="text-zinc-700">·</span>
            <span>httpOnly JWT</span>
            <span className="text-zinc-700">·</span>
            <span className="text-zinc-200 font-medium">Edge Protected</span>
          </div>
        </div>

        {/* Handcrafted Active Session Account Banner (Requirement 1) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-6 backdrop-blur-sm"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Identity */}
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-zinc-800 border border-zinc-700/80 flex items-center justify-center font-mono font-bold text-zinc-200 text-sm shrink-0">
                {getInitials(currentUser.fullName)}
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-base sm:text-lg font-bold text-zinc-100">
                    {currentUser.fullName}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Active Session
                  </span>
                </div>
                <p className="text-xs text-zinc-400 font-mono mt-0.5">
                  SELECT * FROM &quot;User&quot; WHERE id = &apos;{currentUser.id.substring(0, 8)}...&apos;
                </p>
              </div>
            </div>

            {/* Telemetry metadata in a clean horizontal strip */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm">
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-zinc-950/60 border border-zinc-800/80">
                <Mail className="w-4 h-4 text-zinc-500" />
                <span className="text-zinc-200 font-medium">{currentUser.email}</span>
              </div>

              <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-zinc-950/60 border border-zinc-800/80">
                <Phone className="w-4 h-4 text-zinc-500" />
                <span className="text-zinc-200 font-mono text-xs sm:text-sm">{currentUser.phone}</span>
              </div>

              <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-zinc-950/60 border border-zinc-800/80">
                <Fingerprint className="w-4 h-4 text-zinc-500" />
                <span className="text-zinc-200 font-medium">{currentUser.gender}</span>
              </div>

              <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-zinc-950/60 border border-zinc-800/80">
                <Calendar className="w-4 h-4 text-zinc-500" />
                <span className="text-zinc-200 text-xs sm:text-sm">Joined {formatDate(currentUser.createdAt)}</span>
              </div>

              <div className="relative">
                <button
                  onClick={() => handleCopyUserId(currentUser.id)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-zinc-950/60 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-zinc-100 transition-colors font-mono text-xs sm:text-sm cursor-pointer"
                  title="Copy UUID"
                >
                  <span>UUID: {currentUser.id.substring(0, 8)}...</span>
                  {copiedId ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-zinc-500" />
                  )}
                </button>

                <AnimatePresence>
                  {copiedId && (
                    <motion.span
                      initial={{ opacity: 0, y: 3, scale: 0.85 }}
                      animate={{ opacity: 1, y: -26, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.85 }}
                      transition={{ duration: 0.12 }}
                      className="absolute right-0 bg-zinc-800 border border-zinc-700 text-zinc-100 font-mono text-xs font-semibold px-2.5 py-1 rounded shadow-lg pointer-events-none z-20 whitespace-nowrap"
                    >
                      Copied!
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Registered Students Table (Requirement 3) */}
        <div>
          <UserTable users={users} isLoading={isLoadingData} />
        </div>

        {/* Sample Course Table (Requirement 4) */}
        <div>
          <CourseTable courses={courses} isLoading={isLoadingData} />
        </div>
      </main>

      {/* Floating Query Inspector Button and Modal for Viva */}
      <QueryInspector />
    </div>
  );
}
