import React from 'react';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      style={{ overflow: 'visible' }}
    >
       {/* Background Shape: Rounded Rect, Skewed to match the italic style */}
      <rect 
        x="10" 
        y="10" 
        width="80" 
        height="80" 
        rx="20" 
        fill="#dc2626" 
        transform="skewX(-10)"
        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        filter="drop-shadow(0px 4px 6px rgba(185, 28, 28, 0.4))"
      />
      
      {/* The Letter M */}
      <text 
        x="50" 
        y="70" 
        fill="white" 
        fontSize="55" 
        fontFamily="Inter, sans-serif" 
        fontWeight="900" 
        fontStyle="italic" 
        textAnchor="middle"
        transform="skewX(-10)"
        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
      >
        M
      </text>
    </svg>
  );
};