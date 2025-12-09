import React from 'react';
import { Heart } from 'lucide-react';
import logo from 'figma:asset/f80e4d54fed4d5464fb9e70ac865852663d91f1e.png';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export function Logo({ size = 'md', showTagline = true }: LogoProps) {
  const sizes = {
    sm: { height: 'h-10', tagline: 'text-xs' },
    md: { height: 'h-16', tagline: 'text-sm' },
    lg: { height: 'h-20', tagline: 'text-base' }
  };

  const currentSize = sizes[size];

  return (
    <div className="flex flex-col items-center gap-2">
      <img src={logo} alt="DiabetEX" className={`${currentSize.height}`} />
      {showTagline && (
        <p className={`${currentSize.tagline} text-[var(--text-secondary)] text-center`}>
          Apoyo para Diabetes Tipo 2
        </p>
      )}
    </div>
  );
}