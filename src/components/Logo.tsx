import React from 'react';

interface LogoProps {
  variant?: 'light' | 'dark' | 'cream';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ variant = 'cream', className = '', size = 'md' }) => {
  const isDark = variant === 'dark';
  
  const circleStroke = isDark ? '#DCE5D5' : '#234D35';
  const arrowFill = isDark ? '#FFFEFA' : '#626B45';
  const textColor = isDark ? 'text-[#FFFEFA]' : 'text-[#234D35]';
  const subColor = isDark ? 'text-[#DCE5D5]/80' : 'text-[#626B45]';

  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl'
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Circular Resource Recovery Symbol */}
      <div className={`relative ${iconSizes[size]} shrink-0 flex items-center justify-center`}>
        <svg viewBox="0 0 36 36" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {/* Outer continuous circular recovery loop */}
          <circle 
            cx="18" 
            cy="18" 
            r="15" 
            stroke={circleStroke} 
            strokeWidth="2.25" 
            strokeDasharray="4 2.5" 
            className="opacity-75"
          />
          {/* Inner organic triple-node loop */}
          <path 
            d="M18 7C24.0751 7 29 11.9249 29 18C29 20.892 27.882 23.523 26.05 25.48L24 23.2" 
            stroke={circleStroke} 
            strokeWidth="2.2" 
            strokeLinecap="round"
          />
          <path 
            d="M26 26.5L25.8 21.5L21 24.5" 
            fill={arrowFill} 
            stroke={arrowFill} 
            strokeWidth="1.2" 
            strokeLinejoin="round"
          />
          <path 
            d="M18 29C11.9249 29 7 24.0751 7 18C7 15.108 8.118 12.477 9.95 10.52L12 12.8" 
            stroke={circleStroke} 
            strokeWidth="2.2" 
            strokeLinecap="round"
          />
          <path 
            d="M10 9.5L10.2 14.5L15 11.5" 
            fill={arrowFill} 
            stroke={arrowFill} 
            strokeWidth="1.2" 
            strokeLinejoin="round"
          />
          {/* Center core resource node */}
          <circle cx="18" cy="18" r="3.2" fill={arrowFill} />
        </svg>
      </div>

      {/* Sophisticated Wordmark */}
      <div className="flex flex-col leading-none">
        <div className="flex items-baseline gap-1.5">
          <span className={`font-serif-heading ${textSizes[size]} font-normal tracking-tight ${textColor}`}>
            RESTOCK
          </span>
          <span className={`text-[10px] uppercase font-bold tracking-[0.2em] px-1.5 py-0.5 rounded ${isDark ? 'bg-[#FFFEFA]/15 text-[#FFFEFA]' : 'bg-[#234D35]/10 text-[#234D35]'}`}>
            AI
          </span>
        </div>
        <span className={`text-[9px] tracking-widest uppercase font-medium mt-0.5 ${subColor}`}>
          Resource Reuse
        </span>
      </div>
    </div>
  );
};
