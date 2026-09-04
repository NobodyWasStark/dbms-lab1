'use client';

import React, { type ComponentPropsWithoutRef, type CSSProperties, type FC } from 'react';
import { cn } from '@/lib/utils';

export interface AnimatedShinyTextProps extends ComponentPropsWithoutRef<'span'> {
  shimmerWidth?: number;
}

export const AnimatedShinyText: FC<AnimatedShinyTextProps> = ({
  children,
  className,
  shimmerWidth = 120,
  ...props
}) => {
  return (
    <span
      style={
        {
          '--shiny-width': `${shimmerWidth}px`,
        } as CSSProperties
      }
      className={cn(
        'mx-auto text-zinc-300',
        'animate-[shiny-text_4s_infinite]',
        'bg-clip-text text-transparent',
        'bg-gradient-to-r from-zinc-400 via-white via-50% to-zinc-400',
        'bg-[length:200%_100%]',
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
