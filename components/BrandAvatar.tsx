import React from 'react';

interface BrandAvatarProps {
  className?: string;
  showText?: boolean;
}

const BrandAvatar: React.FC<BrandAvatarProps> = ({ className = "w-full h-full", showText = true }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg 
        viewBox="0 0 500 500" 
        className="w-full h-full" 
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background */}
        <rect width="500" height="500" fill="#EC4899" />
        
        {/* Abstract F shape (left side) */}
        {/* Top curved line */}
        <path 
          d="M 60 180 Q 150 100 240 100" 
          stroke="white" 
          strokeWidth="25" 
          strokeLinecap="round" 
          fill="none" 
        />
        {/* Diagonal line */}
        <path 
          d="M 60 180 L 200 340" 
          stroke="white" 
          strokeWidth="25" 
          strokeLinecap="round" 
          fill="none" 
        />

        {/* Face */}
        {/* Left Eye */}
        <circle cx="210" cy="210" r="18" fill="white" />
        <circle cx="210" cy="210" r="6" fill="#EC4899" />
        
        {/* Right Eye */}
        <circle cx="310" cy="200" r="18" fill="white" />
        <circle cx="310" cy="200" r="6" fill="#EC4899" />
        
        {/* Nose */}
        <rect x="250" y="230" width="15" height="30" rx="5" fill="white" />
        
        {/* Smile */}
        <path 
          d="M 230 300 Q 280 340 320 290" 
          stroke="white" 
          strokeWidth="20" 
          strokeLinecap="round" 
          fill="none" 
        />

        {/* Text */}
        <text 
          x="250" 
          y="440" 
          textAnchor="middle" 
          fill="white" 
          fontWeight="900" 
          fontSize="100" 
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