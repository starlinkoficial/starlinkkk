
import React from 'react';

interface StarlinkLogoProps {
  className?: string;
}

export const StarlinkLogo: React.FC<StarlinkLogoProps> = ({ className }) => {
  return (
    <svg 
      viewBox="0 0 1000 130" 
      fill="currentColor" 
      className={className} 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M112.5 125L0 0H75L187.5 125H112.5ZM287.5 125L175 0H250L362.5 125H287.5ZM462.5 125L350 0H425L537.5 125H462.5ZM637.5 125L525 0H600L712.5 125H637.5ZM812.5 125L700 0H775L887.5 125H812.5ZM912.5 125L1000 28H930L875 125H912.5Z" fillOpacity="0.1"/>
      <text 
        x="500" 
        y="85" 
        textAnchor="middle" 
        style={{ 
          fontFamily: 'Inter', 
          fontWeight: 900, 
          fontSize: '70px', 
          letterSpacing: '0.4em', 
          textTransform: 'uppercase' 
        }}
      >
        STARLINK
      </text>
      <path d="M920 10L945 35L900 80" stroke="white" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};
