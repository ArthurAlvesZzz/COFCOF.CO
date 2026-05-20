import React from 'react';
import { Link } from 'react-router-dom';

export interface BrandLogoProps {
  size?: 'nav' | 'footer' | 'hero' | 'admin' | 'custom';
  className?: string;
  asLink?: boolean;
  to?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'nav',
  className = '',
  asLink = true,
  to = '/'
}) => {
  const getStyleClasses = () => {
    const baseClasses = 'font-["Montserrat",sans-serif] font-[800] tracking-[0.08em] uppercase leading-none';
    
    switch (size) {
      case 'nav':
        return `${baseClasses} text-[15px] md:text-[16px]`;
      case 'footer':
        return `${baseClasses} text-[clamp(32px,4.5vw,48px)]`;
      case 'hero':
        return `${baseClasses} text-[48px] md:text-[64px]`;
      case 'admin':
        return `${baseClasses} text-lg md:text-xl`;
      case 'custom':
        return baseClasses;
      default:
        return `${baseClasses} text-[15px]`;
    }
  };

  const Content = (
    <span className={`${getStyleClasses()} text-[#F6F1EB] ${className}`.trim()}>
      COFCOF.CO
    </span>
  );

  if (asLink) {
    return (
      <Link to={to} className="inline-block hover:opacity-80 transition-opacity">
        {Content}
      </Link>
    );
  }

  return (
    <div className="inline-block">
      {Content}
    </div>
  );
};
