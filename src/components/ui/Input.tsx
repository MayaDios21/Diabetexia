import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export function Input({ label, error, helperText, icon, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      <label className="block text-sm mb-2 text-[var(--text-primary)]">{label}</label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">
            {icon}
          </div>
        )}
        <input
          className={`w-full px-4 py-3 ${icon ? 'pl-10' : ''} rounded-xl border border-[var(--border)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)] focus:border-transparent transition-all ${error ? 'border-[var(--error)]' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-sm text-[var(--error)] mt-1">{error}</p>}
      {helperText && !error && <p className="text-sm text-[var(--text-secondary)] mt-1">{helperText}</p>}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, error, options, className = '', ...props }: SelectProps) {
  return (
    <div className="w-full">
      <label className="block text-sm mb-2 text-[var(--text-primary)]">{label}</label>
      <select
        className={`w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)] focus:border-transparent transition-all appearance-none cursor-pointer ${error ? 'border-[var(--error)]' : ''} ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-[var(--error)] mt-1">{error}</p>}
    </div>
  );
}
