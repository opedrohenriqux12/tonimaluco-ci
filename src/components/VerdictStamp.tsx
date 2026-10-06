'use client';

import React from 'react';
import clsx from 'clsx';

interface VerdictBadgeProps {
  verdict: 'INVESTIR' | 'TESTAR' | 'EVITAR';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const VerdictStamp: React.FC<VerdictBadgeProps> = ({ verdict, className, size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-[10px] px-2.5 py-0.5',
    md: 'text-xs px-3 py-1',
    lg: 'text-sm px-4 py-1.5'
  };

  const verdictStyles = {
    INVESTIR: 'badge-investir',
    TESTAR: 'badge-testar',
    EVITAR: 'badge-evitar'
  };

  const dots = {
    INVESTIR: 'bg-[#22C55E] shadow-[0_0_8px_#22C55E]',
    TESTAR: 'bg-[#F5B72E] shadow-[0_0_8px_#F5B72E]',
    EVITAR: 'bg-[#EF4444] shadow-[0_0_8px_#EF4444]'
  };

  return (
    <div
      className={clsx(
        'badge-verdict transition-all duration-300',
        sizeClasses[size],
        verdictStyles[verdict],
        className
      )}
    >
      <span className={clsx('w-2 h-2 rounded-full', dots[verdict])} />
      {verdict}
    </div>
  );
};
