import React from 'react';

interface ChipProps {
  children: React.ReactNode;
  variant?: 'blue' | 'green' | 'gray';
  icon?: React.ReactNode;
  className?: string;
}

export function Chip({ children, variant = 'blue', icon, className = '' }: ChipProps) {
  const variants = {
    blue: 'bg-[var(--primary-blue-light)] text-[var(--primary-blue-dark)] border-[var(--primary-blue)]',
    green: 'bg-[var(--accent-green-light)] text-[#2E7D2E] border-[var(--accent-green)]',
    gray: 'bg-gray-100 text-gray-700 border-gray-300'
  };
  
  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm ${variants[variant]} ${className}`}>
      {icon}
      <span>{children}</span>
    </div>
  );
}
