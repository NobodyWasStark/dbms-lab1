'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Loader2, AlertCircle, Check, ShieldCheck } from 'lucide-react';
import { registerSchema, RegisterInput } from '@/lib/validation';
import PasswordStrength from '@/components/forms/PasswordStrength';
import { useToast } from '@/components/ui/Toast';

export default function RegisterForm() {
  const router = useRouter();
  const { showToast } = useToast();

  const [formData, setFormData] = useState<RegisterInput>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    gender: 'MALE',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shake, setShake] = useState(false);

  // Field-level validity check
  const isFieldValid = (field: keyof RegisterInput) => {
    if (!touched[field] || !formData[field]) return false;
    const result = registerSchema.safeParse(formData);
    if (result.success) return true;
    const fieldErrors = result.error.flatten().fieldErrors;
    return !fieldErrors[field];
  };

  const validateField = (field: keyof RegisterInput, value: string) => {
    const updated = { ...formData, [field]: value };
    const result = registerSchema.safeParse(updated);

    if (result.success) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        if (field === 'password' && updated.confirmPassword) {
          delete next.confirmPassword;
        }
        return next;
      });
    } else {
      const fieldErrors = result.error.flatten().fieldErrors;
      const errorMsg = fieldErrors[field]?.[0];
      setErrors((prev) => {
        const next = { ...prev };
        if (errorMsg) {
          next[field] = errorMsg;
        } else {
          delete next[field];
        }
        return next;
      });
    }
  };

  const handleChange = (field: keyof RegisterInput, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setServerError(null);
    if (touched[field]) {
      validateField(field, value);
    }
  };

  const handleBlur = (field: keyof RegisterInput) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field, formData[field]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    const result = registerSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      const flattened = result.error.flatten().fieldErrors;
      Object.keys(flattened).forEach((key) => {
        const err = flattened[key as keyof typeof flattened]?.[0];
        if (err) fieldErrors[key] = err;
      });
      setErrors(fieldErrors);
      setTouched({
        fullName: true,
        email: true,
        password: true,
        confirmPassword: true,
        phone: true,
        gender: true,
      });
      setShake(true);
      setTimeout(() => setShake(false), 500);
      showToast('Please check the highlighted fields.', 'error');
      return;
    }

    if (!agreedTerms) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      showToast('Please confirm your agreement with the Terms & Conditions.', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.error || 'Registration failed. Please try again.');
        setShake(true);
        setTimeout(() => setShake(false), 500);
        showToast(data.error || 'Registration failed', 'error');
        setIsSubmitting(false);
        return;
      }

      showToast('Student registered in PostgreSQL! Redirecting to login...', 'success');
      setTimeout(() => {
        router.push('/login?registered=true');
      }, 800);
    } catch {
      setServerError('A network error occurred. Please try again.');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      showToast('Network error during registration.', 'error');
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
          Student Registration
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          University DBMS Lab • Direct PostgreSQL 16 Account Creation
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
        {/* Full Name */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-zinc-700">
              Full Name <span className="text-rose-500">*</span>
            </label>
            {isFieldValid('fullName') && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                <Check className="w-3 h-3 stroke-[3]" /> Valid
              </span>
            )}
          </div>
          <div className="relative">
            <input
              type="text"
              name="fullName"
              id="fullName"
              placeholder="e.g. John Doe"
              value={formData.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              onBlur={() => handleBlur('fullName')}
              className={`w-full h-11 px-3.5 pr-10 rounded-xl bg-[#f0f2f5] text-zinc-900 placeholder:text-zinc-400 text-sm border transition-all focus:bg-white focus:outline-none ${
                touched.fullName && errors.fullName
                  ? 'border-rose-400 bg-rose-50/20'
                  : isFieldValid('fullName')
                  ? 'border-emerald-400/80 bg-white'
                  : 'border-transparent focus:border-zinc-300 focus:ring-3 focus:ring-zinc-900/5'
              }`}
            />
            {isFieldValid('fullName') && (
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-500 pointer-events-none">
                <Check className="w-4 h-4 stroke-[2.5]" />
              </div>
            )}
          </div>
          {touched.fullName && errors.fullName && (
            <p className="text-[11px] text-rose-500 font-medium pl-1">{errors.fullName}</p>
          )}
        </div>

        {/* Email Address */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-zinc-700">
              Student Email Address <span className="text-rose-500">*</span>
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

        {/* 2-Column Row: Phone Number & Gender */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-start">
          {/* Phone Number */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-zinc-700">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              {isFieldValid('phone') && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                  <Check className="w-3 h-3 stroke-[3]" /> Valid
                </span>
              )}
            </div>
            <div className="relative">
              <input
                type="tel"
                name="phone"
                id="phone"
                placeholder="01712345678"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                onBlur={() => handleBlur('phone')}
                className={`w-full h-11 px-3.5 pr-10 rounded-xl bg-[#f0f2f5] text-zinc-900 placeholder:text-zinc-400 text-sm border transition-all focus:bg-white focus:outline-none ${
                  touched.phone && errors.phone
                    ? 'border-rose-400 bg-rose-50/20'
                    : isFieldValid('phone')
                    ? 'border-emerald-400/80 bg-white'
                    : 'border-transparent focus:border-zinc-300 focus:ring-3 focus:ring-zinc-900/5'
                }`}
              />
              {isFieldValid('phone') && (
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-500 pointer-events-none">
                  <Check className="w-4 h-4 stroke-[2.5]" />
                </div>
              )}
            </div>
            {touched.phone && errors.phone && (
              <p className="text-[11px] text-rose-500 font-medium pl-1 leading-tight">{errors.phone}</p>
            )}
          </div>

          {/* Gender */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 block">
              Gender <span className="text-rose-500">*</span>
            </label>
            <div className="w-full h-11 p-1 rounded-xl bg-[#f0f2f5] flex items-center gap-1">
              {(['MALE', 'FEMALE', 'OTHER'] as const).map((g) => (
                <button
                  type="button"
                  key={g}
                  onClick={() => handleChange('gender', g)}
                  className={`flex-1 h-9 rounded-lg text-xs font-semibold transition-all capitalize cursor-pointer ${
                    formData.gender === g
                      ? 'bg-white text-zinc-900 shadow-xs'
                      : 'text-zinc-500 hover:text-zinc-900'
                  }`}
                >
                  {g.toLowerCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Password & Confirm Password Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-start">
          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-zinc-700">
                Password <span className="text-rose-500">*</span>
              </label>
              {isFieldValid('password') && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                  <Check className="w-3 h-3 stroke-[3]" /> Valid
                </span>
              )}
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                id="password"
                placeholder="Min 8 characters"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                onBlur={() => handleBlur('password')}
                className={`w-full h-11 pl-3.5 pr-10 rounded-xl bg-[#f0f2f5] text-zinc-900 placeholder:text-zinc-400 text-sm border transition-all focus:bg-white focus:outline-none ${
                  touched.password && errors.password
                    ? 'border-rose-400 bg-rose-50/20'
                    : isFieldValid('password')
                    ? 'border-emerald-400/80 bg-white'
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
              <p className="text-[11px] text-rose-500 font-medium pl-1 leading-tight">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-zinc-700">
                Confirm Password <span className="text-rose-500">*</span>
              </label>
              {isFieldValid('confirmPassword') && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                  <Check className="w-3 h-3 stroke-[3]" /> Matches
                </span>
              )}
            </div>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                id="confirmPassword"
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                onBlur={() => handleBlur('confirmPassword')}
                className={`w-full h-11 pl-3.5 pr-10 rounded-xl bg-[#f0f2f5] text-zinc-900 placeholder:text-zinc-400 text-sm border transition-all focus:bg-white focus:outline-none ${
                  touched.confirmPassword && errors.confirmPassword
                    ? 'border-rose-400 bg-rose-50/20'
                    : isFieldValid('confirmPassword')
                    ? 'border-emerald-400/80 bg-white'
                    : 'border-transparent focus:border-zinc-300 focus:ring-3 focus:ring-zinc-900/5'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors p-1"
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {touched.confirmPassword && errors.confirmPassword && (
              <p className="text-[11px] text-rose-500 font-medium pl-1 leading-tight">{errors.confirmPassword}</p>
            )}
          </div>
        </div>

        {/* Animated Password Strength Indicator Bar */}
        {formData.password && (
          <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/70">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700 mb-1">
              <ShieldCheck className="w-4 h-4 text-orange-500" />
              <span>Password Security Strength</span>
            </div>
            <PasswordStrength password={formData.password} />
          </div>
        )}

        {/* Terms and Conditions Checkbox */}
        <div className="flex items-center gap-2.5 pt-1">
          <button
            type="button"
            role="checkbox"
            aria-checked={agreedTerms}
            onClick={() => setAgreedTerms(!agreedTerms)}
            className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all cursor-pointer ${
              agreedTerms
                ? 'bg-[#ff4d00] border-[#ff4d00] text-white shadow-xs'
                : 'bg-zinc-100 border-zinc-300 hover:border-zinc-400'
            }`}
          >
            {agreedTerms && <Check className="w-3 h-3 stroke-[3]" />}
          </button>
          <label
            onClick={() => setAgreedTerms(!agreedTerms)}
            className="text-xs text-zinc-500 cursor-pointer select-none"
          >
            I confirm all information is correct and agree to the{' '}
            <span className="text-zinc-800 underline font-medium">Lab Code of Conduct</span>
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
                <span>SAVING TO POSTGRESQL...</span>
              </>
            ) : (
              <span>REGISTER STUDENT</span>
            )}
          </button>
        </div>

        {/* Footer Link */}
        <div className="text-center pt-2">
          <p className="text-xs text-zinc-500">
            Already registered?{' '}
            <Link
              href="/login"
              className="text-zinc-900 font-semibold underline underline-offset-2 hover:text-black"
            >
              Sign In to Dashboard
            </Link>
          </p>
        </div>
      </form>
    </motion.div>
  );
}
