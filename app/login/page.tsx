'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import LoginForm from '@/components/forms/LoginForm';

function LoginFormWrapper() {
  return <LoginForm />;
}

export default function LoginPage() {
  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-[#fbfbfb] text-zinc-900 antialiased overflow-x-hidden">
      {/* Ambient Lighting Accents */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-zinc-100/80 to-transparent" />
        <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-t from-orange-200/60 via-amber-100/40 to-transparent rounded-full blur-3xl opacity-70" />
      </div>

      {/* Top Navigation */}
      <header className="relative z-10 w-full max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-zinc-200/80 text-xs font-semibold text-zinc-700 hover:text-zinc-950 hover:border-zinc-300 shadow-xs transition-all active:scale-[0.98]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>

        <div className="text-xs text-zinc-500">
          Need an account?{' '}
          <Link
            href="/register"
            className="text-zinc-900 font-semibold underline underline-offset-2 hover:text-black ml-1"
          >
            Sign Up
          </Link>
        </div>
      </header>

      {/* Main Centered Form Card */}
      <main className="relative z-10 w-full max-w-[440px] mx-auto px-4 my-auto py-6">
        <div className="bg-white rounded-3xl border border-zinc-200/80 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] p-7 sm:p-9">
          <Suspense fallback={<div className="h-48 flex items-center justify-center text-zinc-400 text-xs">Loading sign-in...</div>}>
            <LoginFormWrapper />
          </Suspense>
        </div>

        {/* Security & Lab Badge */}
        <div className="mt-6 flex items-center justify-center gap-2 text-zinc-400 text-[11px] font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Protected by Next.js Edge Middleware &amp; httpOnly JWT</span>
        </div>
      </main>

      {/* Clean Footer */}
      <footer className="relative z-10 w-full text-center py-6 text-[11px] text-zinc-400">
        <span>CSE311L Database Management Systems Lab</span>
      </footer>
    </div>
  );
}
