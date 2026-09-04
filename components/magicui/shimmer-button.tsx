'use client';

import React, { type ComponentPropsWithoutRef, type CSSProperties } from 'react';
import { cn } from '@/lib/utils';

export interface ShimmerButtonProps extends ComponentPropsWithoutRef<'button'> {
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  className?: string;
  children?: React.ReactNode;
}

export const ShimmerButton = React.forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  (
    {
      shimmerColor = '#ffffff',
      shimmerSize = '0.05em',
      shimmerDuration = '3s',
      borderRadius = '12px',
      background = '#ffffff',
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        style={
          {
            '--spread': '90deg',
            '--shimmer-color': shimmerColor,
            '--radius': borderRadius,
            '--speed': shimmerDuration,
            '--cut': shimmerSize,
            '--bg': background,
          } as CSSProperties
        }
        className={cn(
          'group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden [border-radius:var(--radius)] border border-white/20 px-6 py-3 whitespace-nowrap text-zinc-950 [background:var(--bg)] font-semibold text-sm',
          'transform-gpu transition-all duration-300 ease-in-out hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-white/5',
          className
        )}
        ref={ref}
        {...props}
      >
        {/* Shimmer Light Reflection */}
        <div
          className={cn(
            '-z-30 blur-[2px]',
            'absolute inset-0 overflow-visible'
          )}
        >
          <div className="absolute inset-0 aspect-square h-full rounded-none animate-[shimmer-slide_var(--speed)_linear_infinite]" />
        </div>

        {/* Content */}
        <span className="relative z-10 flex items-center gap-2">{children}</span>

        {/* Ambient Subtle Highlight */}
        <div
          className={cn(
            'absolute inset-0 size-full pointer-events-none',
            'rounded-[var(--radius)] shadow-[inset_0_-4px_8px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.8)]'
          )}
        />
      </button>
    );
  }
);

ShimmerButton.displayName = 'ShimmerButton';
