'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { UserRecord } from '@/components/dashboard/UserTable';
import { BarChart3 } from 'lucide-react';

interface GenderChartProps {
  users: UserRecord[];
  isLoading?: boolean;
}

export default function GenderDistributionChart({ users, isLoading = false }: GenderChartProps) {
  const stats = useMemo(() => {
    let male = 0;
    let female = 0;
    let other = 0;

    users.forEach((u) => {
      if (u.gender === 'MALE') male++;
      else if (u.gender === 'FEMALE') female++;
      else other++;
    });

    const total = users.length || 1;
    return {
      male,
      female,
      other,
      total: users.length,
      malePercent: Math.round((male / total) * 100),
      femalePercent: Math.round((female / total) * 100),
      otherPercent: Math.round((other / total) * 100),
    };
  }, [users]);

  return (
    <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-5 backdrop-blur-sm flex flex-col justify-between hover:border-zinc-700/80 transition-all duration-200">
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
            Demographic Distribution
          </span>
          <div className="w-7 h-7 rounded-lg bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-zinc-400">
            <BarChart3 className="w-4 h-4" />
          </div>
        </div>

        <p className="text-xs text-zinc-400 font-mono">
          GROUP BY gender COUNT
        </p>
      </div>

      {/* Segmented Visual Proportion Bar (GitHub / Linear telemetry style) */}
      <div className="my-4 space-y-2.5">
        {isLoading ? (
          <div className="h-3.5 w-full bg-zinc-800 rounded-full animate-pulse" />
        ) : (
          <>
            <div className="h-3 w-full rounded-full bg-zinc-950 border border-zinc-800 overflow-hidden flex p-0.5 gap-1">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stats.femalePercent}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full rounded-sm bg-zinc-200"
                title={`Female: ${stats.femalePercent}%`}
              />
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stats.malePercent}%` }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
                className="h-full rounded-sm bg-zinc-500"
                title={`Male: ${stats.malePercent}%`}
              />
              {stats.other > 0 && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.otherPercent}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                  className="h-full rounded-sm bg-zinc-700"
                  title={`Other: ${stats.otherPercent}%`}
                />
              )}
            </div>

            {/* Micro Breakdown Metrics */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/70">
                <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-200" />
                  <span>Female</span>
                </div>
                <div className="text-base font-bold text-zinc-100 font-mono mt-0.5">
                  {stats.female}{' '}
                  <span className="text-xs text-zinc-400 font-normal">
                    ({stats.femalePercent}%)
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/70">
                <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
                  <span>Male</span>
                </div>
                <div className="text-base font-bold text-zinc-100 font-mono mt-0.5">
                  {stats.male}{' '}
                  <span className="text-xs text-zinc-400 font-normal">
                    ({stats.malePercent}%)
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/70">
                <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                  <span>Other</span>
                </div>
                <div className="text-base font-bold text-zinc-100 font-mono mt-0.5">
                  {stats.other}{' '}
                  <span className="text-xs text-zinc-400 font-normal">
                    ({stats.otherPercent}%)
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* SQL Footnote */}
      <div className="pt-3 border-t border-zinc-800/60 flex items-center justify-between text-xs font-mono text-zinc-400">
        <span>Aggregation</span>
        <span className="text-zinc-300 font-medium">{stats.total} Active Records</span>
      </div>
    </div>
  );
}
