import React from 'react';

export default function Logo({ size = 'default', showText = true }) {
  const sizes = {
    small: { svg: 28, text: 'text-lg' },
    default: { svg: 36, text: 'text-xl' },
    large: { svg: 48, text: 'text-2xl' }
  };
  
  const { svg, text } = sizes[size];

  return (
    <div className="flex items-center gap-2">
      {/* OncoScan Logo - Thyroid Shape */}
      <svg width={svg} height={svg} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3C7CE3"/>
            <stop offset="100%" stopColor="#0F3F96"/>
          </linearGradient>
          <linearGradient id="redGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E85B6C"/>
            <stop offset="100%" stopColor="#D4273E"/>
          </linearGradient>
        </defs>
        {/* Left lobe - Blue */}
        <path d="M15 35C15 20 25 15 35 15C45 15 50 25 50 45C50 55 45 70 40 80C35 85 25 85 20 75C15 65 15 50 15 35Z" fill="url(#blueGrad)"/>
        {/* Right lobe - Red */}
        <path d="M85 35C85 20 75 15 65 15C55 15 50 25 50 45C50 55 55 70 60 80C65 85 75 85 80 75C85 65 85 50 85 35Z" fill="url(#redGrad)"/>
        {/* Center connection */}
        <ellipse cx="50" cy="45" rx="8" ry="12" fill="#0C2D5C" opacity="0.3"/>
      </svg>
      
      {showText && (
        <div className={`font-semibold ${text}`}>
          <span className="text-[#0C2D5C]">Onco</span>
          <span className="text-[#D4273E]">Scan</span>
          <span className="text-[#0F3F96] text-xs ml-1 font-normal">AI™</span>
        </div>
      )}
    </div>
  );
}