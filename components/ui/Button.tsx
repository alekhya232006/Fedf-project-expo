import React from 'react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { ThemeType } from '../../types';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  label: string;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', label, icon, className, ...props }) => {
  const { settings } = useAccessibility();

  // Base classes
  let baseClasses = "rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-4 focus:ring-opacity-50 ";

  // Motor Mode Adjustments
  if (settings.motorMode) {
    baseClasses += "p-6 text-xl active:scale-95 "; // Larger hit area
  } else {
    baseClasses += "px-4 py-2 active:scale-95 ";
  }

  // Theme & Variant Logic
  if (settings.theme === ThemeType.HIGH_CONTRAST) {
    // High Contrast overrides
    if (variant === 'primary') baseClasses += "bg-yellow-400 text-black border-4 border-white hover:bg-yellow-300 focus:ring-white ";
    else baseClasses += "bg-black text-yellow-400 border-4 border-yellow-400 hover:bg-gray-900 focus:ring-yellow-400 ";
  } else {
    // Standard Themes
    switch (variant) {
      case 'primary':
        baseClasses += "bg-blue-600 text-white hover:bg-blue-700 shadow-md focus:ring-blue-500 ";
        break;
      case 'secondary':
        baseClasses += "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400 dark:bg-slate-700 dark:text-white ";
        break;
      case 'danger':
        baseClasses += "bg-red-500 text-white hover:bg-red-600 focus:ring-red-400 ";
        break;
      case 'ghost':
        baseClasses += "bg-transparent hover:bg-black/5 dark:hover:bg-white/10 ";
        break;
    }
  }

  return (
    <button className={`${baseClasses} ${className || ''}`} {...props} aria-label={label}>
      {icon && <span className="text-current">{icon}</span>}
      <span>{label}</span>
    </button>
  );
};
