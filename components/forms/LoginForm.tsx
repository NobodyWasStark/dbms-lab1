'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Loader2, AlertCircle, Check } from 'lucide-react';
import { loginSchema, LoginInput } from '@/lib/validation';
import { useToast } from '@/components/ui/Toast';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  const [formData, setFormData] = useState<LoginInput>({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      showToast('Registration successful! Please sign in with your credentials.', 'success');
    }
  }, [searchParams, showToast]);

  const isFieldValid = (field: keyof LoginInput) => {
    if (!touched[field] || !formData[field]) return false;
    const result = loginSchema.safeParse(formData);
    if (result.success) return true;
    const fieldErrors = result.error.flatten().fieldErrors;
    return !fieldErrors[field];
  };

  const handleChange = (field: keyof LoginInput, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setServerError(null);
  };

  const handleBlur = (field: keyof LoginInput) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const result = loginSchema.safeParse(formData);
    if (!result.success) {
      const err = result.error.flatten().fieldErrors[field]?.[0];
      if (err) {
        setErrors((prev) => ({ ...prev, [field]: err }));
      } else {
        setErrors((prev) => {
          const next = { ...prev };
          delete next[field];
          return next;
        });
      }
    } else {
      setErrors({});
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    const result = loginSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      const flattened = result.error.flatten().fieldErrors;
      Object.keys(flattened).forEach((key) => {
        const err = flattened[key as keyof typeof flattened]?.[0];
        if (err) fieldErrors[key] = err;
      });
      setErrors(fieldErrors);
      setTouched({ email: true, password: true });
      setShake(true);
      setTimeout(() => setShake(false), 500);
      showToast('Please enter your email and password.', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.error || 'Invalid email or password.');
        setShake(true);
        setTimeout(() => setShake(false), 500);
        showToast(data.error || 'Authentication failed', 'error');
        setIsSubmitting(false);
        return;
      }

      showToast('Authentication successful! Loading dashboard...', 'success');
      const destination = searchParams.get('from') || '/dashboard';
      router.push(destination);
      router.refresh();
    } catch {
      setServerError('A network error occurred. Please check your connection.');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      showToast('Network error during login.', 'error');
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      animate={shake ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
      transition={{ duration: 0.35 }}
      className="w-full"
    >
      {/* Brand Header */}
      <div className="text-center mb-6">
        <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-3 shadow-sm p-2.5">
          <Image
            src="/postgres.svg"
            alt="PostgreSQL"
            width={28}
            height={28}
            className="w-7 h-7 object-contain"
          />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          Student Portal Sign In
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Verify credentials against PostgreSQL 16 database
        </p>
      </div>

      {/* Server Error Alert */}
      <AnimatePresence>
        {serverError && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-600 text-xs"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1 font-medium leading-relaxed">{serverError}</div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-4 text-left" noValidate>
        {/* Email Address */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-zinc-700">
              Student Email Address
            </label>
            {isFieldValid('email') && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                <Check className="w-3 h-3 stroke-[3]" /> Valid
              </span>
            )}
          </div>
          <div className="relative">
            <input
              type="email"
              name="email"
              id="email"
              placeholder="student@university.edu"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              className={`w-full h-11 px-3.5 pr-10 rounded-xl bg-[#f0f2f5] text-zinc-900 placeholder:text-zinc-400 text-sm border transition-all focus:bg-white focus:outline-none ${
                touched.email && errors.email
                  ? 'border-rose-400 bg-rose-50/20'
                  : isFieldValid('email')
                  ? 'border-emerald-400/80 bg-white'
                  : 'border-transparent focus:border-zinc-300 focus:ring-3 focus:ring-zinc-900/5'
              }`}
            />
            {isFieldValid('email') && (
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-500 pointer-events-none">
                <Check className="w-4 h-4 stroke-[2.5]" />
              </div>
            )}
          </div>
          {touched.email && errors.email && (
            <p className="text-[11px] text-rose-500 font-medium pl-1">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-700 block">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              id="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              onBlur={() => handleBlur('password')}
              className={`w-full h-11 pl-3.5 pr-10 rounded-xl bg-[#f0f2f5] text-zinc-900 placeholder:text-zinc-400 text-sm border transition-all focus:bg-white focus:outline-none ${
                touched.password && errors.password
                  ? 'border-rose-400 bg-rose-50/20'
                  : 'border-transparent focus:border-zinc-300 focus:ring-3 focus:ring-zinc-900/5'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors p-1"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {touched.password && errors.password && (
            <p className="text-[11px] text-rose-500 font-medium pl-1">{errors.password}</p>
          )}
        </div>

        {/* Remember Me Checkbox */}
        <div className="flex items-center gap-2.5 pt-0.5">
          <button
            type="button"
            role="checkbox"
            aria-checked={formData.rememberMe}
            onClick={() => handleChange('rememberMe', !formData.rememberMe)}
            className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all cursor-pointer ${
              formData.rememberMe
                ? 'bg-[#ff4d00] border-[#ff4d00] text-white shadow-xs'
                : 'bg-zinc-100 border-zinc-300 hover:border-zinc-400'
            }`}
          >
            {formData.rememberMe && <Check className="w-3 h-3 stroke-[3]" />}
          </button>
          <label
            onClick={() => handleChange('rememberMe', !formData.rememberMe)}
            className="text-xs text-zinc-500 cursor-pointer select-none"
          >
            Remember this session for 7 days (httpOnly cookie)
          </label>
        </div>

        {/* Primary Action Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 rounded-xl bg-[#ff4d00] hover:bg-[#eb4700] text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-orange-500/25 transition-all hover:shadow-orange-500/35 active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>AUTHENTICATING...</span>
              </>
            ) : (
              <span>SIGN IN TO DASHBOARD</span>
            )}
          </button>
        </div>

        {/* Footer Link */}
        <div className="text-center pt-2">
          <p className="text-xs text-zinc-500">
            Need an account?{' '}
            <Link
              href="/register"
              className="text-zinc-900 font-semibold underline underline-offset-2 hover:text-black"
            >
              Register as New Student
            </Link>
          </p>
        </div>
      </form>
    </motion.div>
  );
}
