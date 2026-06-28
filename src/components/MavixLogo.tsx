import React from 'react';

interface MavixLogoProps {
  className?: string; // Tailwind classes: default "w-10 h-10 text-[#35FF90]"
  size?: number | string; // Optionally override width/height
}

export default function MavixLogo({ className = "w-10 h-10", size }: MavixLogoProps) {
  const customStyle = size ? { width: size, height: size } : undefined;

  return (
    <svg
      id="mavix-logo-svg"
      viewBox="0 0 256 256"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} select-none`}
      style={customStyle}
    >
      <defs>
        {/* Glow drop-shadow filter */}
        <filter id="logo-neon-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComponentTransfer in="blur" result="glow">
            <feFuncA type="linear" slope="0.85" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Dynamic bright neon green/emerald gradient matching user's logo */}
        <linearGradient id="mavix-emerald-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#35FF90" />
          <stop offset="50%" stopColor="#22D3EE" /> {/* Turquoise/cyan shift */}
          <stop offset="100%" stopColor="#10B981" /> {/* Deep emerald */}
        </linearGradient>
      </defs>

      {/* Symmetrical futuristic skull/horns mask */}
      <g filter="url(#logo-neon-glow)">
        {/* 1. Symmetrical Central Head & Horns */}
        <path
          id="logo-horns-body"
          d="M128 152 
             L114 130 
             L96 68 
             L118 114 
             L92 60 
             L67 98 
             L98 126 
             L111 160 
             L115 208 
             L123 148 
             L128 138 
             L133 148 
             L141 208 
             L145 160 
             L158 126 
             L189 98 
             L164 60 
             L138 114 
             L160 68 
             L142 130 
             Z"
          fill="url(#mavix-emerald-grad)"
        />

        {/* 2. Symmetrical Outer Cheek Blades / Accents */}
        <path
          id="logo-left-blade"
          d="M76 122 
             L88 152 
             L97 154 
             L86 130 
             Z"
          fill="url(#mavix-emerald-grad)"
        />
        <path
          id="logo-right-blade"
          d="M180 122 
             L168 152 
             L159 154 
             L170 130 
             Z"
          fill="url(#mavix-emerald-grad)"
        />
      </g>
    </svg>
  );
}
