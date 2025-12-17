import React from 'react';

interface BrandAvatarProps {
  className?: string;
  showText?: boolean;
}

const BrandAvatar: React.FC<BrandAvatarProps> = ({ className = "w-full h-full", showText = true }) => {
  return (
    <div className={`relative flex items-center justify-center bg-[#EC4899] ${className}`}>
      <svg 
        viewBox="0 0 500 500" 
        className="w-full h-full" 
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="500" height="500" fill="#EC4899" />
        
        {/* Abstract Face / F Shape */}
        <g stroke="white" strokeWidth="25" strokeLinecap="round" fill="none">
            {/* Left curved F-like shape */}
            <path d="M 100 130 Q 180 80 260 130" />
            <path d="M 100 130 L 220 330" />
            <path d="M 160 210 L 240 180" />
            
            {/* Smile */}
            <path d="M 280 320 Q 330 360 380 310" strokeWidth="30" />
        </g>
        
        {/* Eyes */}
        <circle cx="280" cy="200" r="25" fill="white" />
        <circle cx="380" cy="180" r="25" fill="white" />
        
        {/* Nose */}
        <rect x="325" y="240" width="15" height="35" rx="7" fill="white" />

        {/* Text */}
        <text 
          x="250" 
          y="440" 
          textAnchor="middle" 
          fill="white" 
          fontWeight="900" 
          fontSize="95" 
          fontFamily="Arial, sans-serif"
          style={{ letterSpacing: '-2px' }}
        >
          Foodi Ai
        </text>
      </svg>
    </div>
  );
};

export default BrandAvatar;