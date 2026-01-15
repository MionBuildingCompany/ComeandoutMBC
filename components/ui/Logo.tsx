import React from 'react';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = "w-10 h-10" }) => {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      {/* Red Hexagon Background - Symbolizing Construction/Structure */}
      <path 
        d="M12 2L20.66 7V17L12 22L3.34 17V7L12 2Z" 
        className="fill-red-600" 
      />
      
      {/* Bold White Letter M */}
      <path 
        d="M7.5 7V17H10V11.5L12 14.5L14 11.5V17H16.5V7H13.5L12 9.5L10.5 7H7.5Z" 
        fill="white" 
      />
    </svg>
  );
};