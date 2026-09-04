'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

interface PasswordStrengthProps {
  password: string;
}

export default function PasswordStrength({ password }: PasswordStrengthProps) {
  const criteria = useMemo(() => {
    return [
      { label: '8+ characters', met: password.length >= 8 },
      { label: 'Uppercase letter', met: /[A-Z]/.test(password) },
      { label: 'Number (0-9)', met: /[0-9]/.test(password) },
      { label: 'Special character', met: /[^A-Za-z0-9]/.test(password) },
    ];
  }, [password]);

  const score = useMemo(() => {
    return criteria.filter((c) => c.met).length;
  }, [criteria]);

  const { label, colorClass, barColor } = useMemo(() => {
    if (!password) {
      return { label: '', colorClass: 'text-zinc-400', barColor: 'bg-zinc-200' };
    }
    switch (score) {
      case 1:
        return { label: 'Weak', colorClass: 'text-rose-500', barColor: 'bg-rose-500' };
      case 2:
        return { label: 'Fair', colorClass: 'text-amber-500', barColor: 'bg-amber-500' };
      case 3:
        return { label: 'Good', colorClass: 'text-blue-500', barColor: 'bg-blue-500' };
      case 4:
        return { label: 'Strong', colorClass: 'text-emerald-500', barColor: 'bg-emerald-500' };
      default:
        return { label: 'Weak', colorClass: 'text-rose-500', barColor: 'bg-rose-500' };
    }
  }, [password, score]);

  if (!password) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="space-y-2 pt-1 text-xs overflow-hidden"
    >
      {/* Animated Framer Motion progress meter */}
      <div className="flex items-center gap-2">
        <div className="flex-1 grid grid-cols-4 gap-1.5 h-1.5">
          {[1, 2, 3, 4].map((step) => {
            const isFilled = score >= step;
            return (
              <div key={step} className="h-full rounded-full bg-zinc-200 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: isFilled ? '100%' : '0%' }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className={`h-full ${barColor}`}
                />
              </div>
            );
          })}
        </div>
        <span className={`text-[11px] font-semibold min-w-[42px] text-right ${colorClass}`}>
          {label}
        </span>
      </div>

      {/* Criteria check indicators */}
      <div className="grid grid-cols-2 gap-x-2 gap-y-1 pt-1 text-[11px]">
        {criteria.map((item, idx) => (
          <div
            key={idx}
            className={`flex items-center gap-1.5 transition-colors duration-150 ${
              item.met ? 'text-zinc-700' : 'text-zinc-400'
            }`}
          >
            {item.met ? (
              <Check className="w-3 h-3 text-emerald-500 shrink-0 stroke-[2.5]" />
            ) : (
              <X className="w-3 h-3 text-zinc-300 shrink-0" />
            )}
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
