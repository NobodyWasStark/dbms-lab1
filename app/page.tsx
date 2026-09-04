'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import {
  ShieldCheck,
  ArrowRight,
  Lock,
  Terminal,
} from 'lucide-react';
import { Particles } from '@/components/magicui/particles';

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Smooth GSAP entrance
    const ctx = gsap.context(() => {
      gsap.from('.fade-in-item', {
        opacity: 0,
        y: 16,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power2.out',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-[#09090b]">
      {/* High-Quality Professional Data Center Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <Image
          src="/hero-bg.jpg"
          alt="Enterprise Database Infrastructure"
          fill
          priority
          quality={75}
          className="object-cover object-center opacity-30"
        />
        {/* Subtle Vignette & Depth Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#09090b]/75 via-[#09090b]/85 to-[#09090b]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_15%,_#09090b_90%)]" />
      </div>

      {/* Atmospheric Silver Stardust Particles */}
      <Particles
        className="absolute inset-0 z-10"
        quantity={65}
        ease={50}
        color="#e4e4e7"
        size={0.45}
        staticity={45}
        refresh
      />

      {/* Top Navbar with Official Brand Logo & Live Connection Status */}
      <header className="relative z-20 w-full border-b border-zinc-800/80 bg-zinc-950/60 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
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
            <div className="flex items-baseline gap-2">
              <span className="font-semibold text-sm text-zinc-100 tracking-tight">DBMS Lab Portal</span>
              <span className="text-[11px] font-mono text-zinc-500 hidden sm:inline">CSE311L</span>
            </div>
          </div>

          {/* Live DBMS Status Indicator */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/80 border border-zinc-800 text-[11px] font-mono text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-zinc-300">PostgreSQL 16</span>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-500">Port 5432</span>
            <span className="text-zinc-600">•</span>
            <span className="text-emerald-400 font-medium">Online</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-3.5 py-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-4 py-1.5 text-xs font-semibold text-zinc-950 bg-white hover:bg-zinc-100 rounded-lg transition-all shadow-xs active:scale-[0.98]"
            >
              Register Student
            </Link>
          </div>
        </div>
      </header>

      {/* Main Hero */}
      <main className="relative z-20 max-w-4xl mx-auto px-6 py-16 sm:py-20 flex flex-col items-center text-center my-auto">
        {/* Sleek Hero Pill Badge with Official PostgreSQL Engine Tag */}
        <div className="fade-in-item inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-white/[0.12] bg-white/[0.04] backdrop-blur-md text-xs font-medium mb-7 shadow-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-zinc-300 font-medium">University DBMS Lab Project</span>
          <span className="text-zinc-600">•</span>
          <span className="text-zinc-400 font-mono text-[11px] flex items-center gap-1">
            <Image src="/postgres.svg" alt="PostgreSQL" width={12} height={12} className="inline-block" />
            PostgreSQL 16
          </span>
          <span className="text-zinc-500 text-[10px] pl-0.5">→</span>
        </div>

        {/* Dual-Tone Typographic Headline */}
        <h1 className="fade-in-item text-4xl sm:text-5xl lg:text-6xl font-bold tracking-[-0.035em] text-zinc-100 max-w-3xl leading-[1.12]">
          Student Registration{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-zinc-100 via-zinc-300 to-zinc-500/80">
            &amp; Database Management System
          </span>
        </h1>

        {/* Clean Subtitle */}
        <p className="fade-in-item mt-6 text-base text-zinc-400 max-w-2xl leading-relaxed">
          A production-grade university DBMS demonstration featuring live PostgreSQL connectivity,
          normalized multi-table schemas, custom JWT sessions via httpOnly cookies, bcrypt hashing, and real-time queries.
        </p>

        {/* Tactile Action Buttons */}
        <div className="fade-in-item mt-8 flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
          <Link
            href="/register"
            className="w-full sm:w-auto px-7 py-3 rounded-xl font-semibold text-sm text-zinc-950 bg-white hover:bg-zinc-100 transition-all duration-200 shadow-[0_0_24px_rgba(255,255,255,0.14)] hover:shadow-[0_0_32px_rgba(255,255,255,0.22)] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Create Student Account</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/login"
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-sm text-zinc-300 bg-zinc-900/80 hover:bg-zinc-800/90 border border-zinc-800 hover:border-zinc-700 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] shadow-xs"
          >
            <Lock className="w-4 h-4 text-zinc-400" />
            <span>Sign In to Dashboard</span>
          </Link>
        </div>

        {/* Technical Product Cards with Official Logos & Assets */}
        <div className="fade-in-item mt-16 grid grid-cols-1 md:grid-cols-3 gap-4.5 w-full text-left">
          {/* Card 1: PostgreSQL & Prisma */}
          <div className="p-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-sm hover:bg-zinc-900/70 hover:border-zinc-700/80 transition-all duration-200 group flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-xl bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center p-2 shadow-xs">
                  <Image
                    src="/postgres.svg"
                    alt="PostgreSQL Logo"
                    width={20}
                    height={20}
                    className="w-5 h-5 object-contain"
                  />
                </div>
                <div className="w-9 h-9 rounded-xl bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center p-2 shadow-xs">
                  <Image
                    src="/prisma.svg"
                    alt="Prisma Logo"
                    width={18}
                    height={18}
                    className="w-4.5 h-4.5 object-contain opacity-90"
                  />
                </div>
              </div>

              <h3 className="text-sm font-semibold text-zinc-100 mb-1.5">
                PostgreSQL 16 &amp; Prisma
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Normalized dual-table schema (<code className="text-zinc-300 font-mono">User</code> &amp; <code className="text-zinc-300 font-mono">Course</code>) with primary UUID keys, constraints, and B-Tree indexes.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-800/60 text-[11px] font-mono text-zinc-500 group-hover:text-zinc-400 transition-colors flex items-center justify-between">
              <span>2 Relational Tables</span>
              <span className="text-emerald-400/80">3NF Normalized</span>
            </div>
          </div>

          {/* Card 2: Docker & Session Security */}
          <div className="p-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-sm hover:bg-zinc-900/70 hover:border-zinc-700/80 transition-all duration-200 group flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-xl bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center p-2 shadow-xs">
                  <Image
                    src="/docker.svg"
                    alt="Docker Container"
                    width={22}
                    height={22}
                    className="w-5 h-5 object-contain"
                  />
                </div>
                <div className="w-9 h-9 rounded-xl bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center text-zinc-300 shadow-xs">
                  <ShieldCheck className="w-4.5 h-4.5 text-zinc-300" />
                </div>
              </div>

              <h3 className="text-sm font-semibold text-zinc-100 mb-1.5">
                Docker &amp; httpOnly Session
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                PostgreSQL 16 containerized via Docker. Custom JWT session tokens signed with <code className="text-zinc-300 font-mono">jose</code> in secure httpOnly cookies.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-800/60 text-[11px] font-mono text-zinc-500 group-hover:text-zinc-400 transition-colors flex items-center justify-between">
              <span>Bcrypt (Salt 12)</span>
              <span className="text-emerald-400/80">Edge Protected</span>
            </div>
          </div>

          {/* Card 3: Live Database Queries */}
          <div className="p-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-sm hover:bg-zinc-900/70 hover:border-zinc-700/80 transition-all duration-200 group flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-xl bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center text-zinc-200 mb-4 group-hover:text-white transition-colors">
                <Terminal className="w-4.5 h-4.5 text-zinc-300" />
              </div>

              <h3 className="text-sm font-semibold text-zinc-100 mb-1.5">
                Live Database Queries
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Real-time query execution for user profiles, paginated student directory lists, aggregate counters, and course catalogs.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-800/60 text-[11px] font-mono text-zinc-500 group-hover:text-zinc-400 transition-colors flex items-center justify-between">
              <span>COUNT &amp; SELECT</span>
              <span className="text-emerald-400/80">Parameterized</span>
            </div>
          </div>
        </div>
      </main>

      {/* Clean Minimalist Footer with Official Brand Stack Badges */}
      <footer className="relative z-20 w-full border-t border-zinc-800/80 py-6 text-xs text-zinc-500 bg-zinc-950/60 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Image src="/postgres.svg" alt="PostgreSQL" width={16} height={16} className="w-4 h-4 object-contain opacity-80" />
            <span>DBMS Lab Mid-Assignment • Next.js &amp; PostgreSQL</span>
          </div>

          {/* Official Tech Stack Assets */}
          <div className="flex items-center gap-5 text-xs text-zinc-400 font-medium">
            <div className="flex items-center gap-1.5 hover:text-zinc-200 transition-colors">
              <Image src="/postgres.svg" alt="PostgreSQL" width={14} height={14} className="w-3.5 h-3.5 object-contain" />
              <span>PostgreSQL</span>
            </div>
            <div className="flex items-center gap-1.5 hover:text-zinc-200 transition-colors">
              <Image src="/prisma.svg" alt="Prisma" width={12} height={12} className="w-3 h-3 object-contain" />
              <span>Prisma</span>
            </div>
            <div className="flex items-center gap-1.5 hover:text-zinc-200 transition-colors">
              <Image src="/docker.svg" alt="Docker" width={14} height={14} className="w-3.5 h-3.5 object-contain" />
              <span>Docker</span>
            </div>
            <div className="flex items-center gap-1.5 hover:text-zinc-200 transition-colors">
              <Image src="/next.svg" alt="Next.js" width={14} height={14} className="w-3.5 h-3.5 object-contain invert opacity-80" />
              <span>Next.js</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
