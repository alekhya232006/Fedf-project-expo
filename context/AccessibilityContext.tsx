import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AccessibilitySettings, FontType, ThemeType } from '../types';
import { DEFAULT_SETTINGS } from '../constants';

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSettings: (newSettings: Partial<AccessibilitySettings>) => void;
  resetSettings: () => void;
  getThemeClasses: () => string;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    const saved = localStorage.getItem('ableAssistSettings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem('ableAssistSettings', JSON.stringify(settings));
    // Apply body classes for global overrides if needed
    if (settings.theme === ThemeType.HIGH_CONTRAST) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [settings]);

  const updateSettings = (newSettings: Partial<AccessibilitySettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  const getThemeClasses = () => {
    let classes = `transition-all duration-300 ${settings.font} `;
    
    // Theme colors
    switch (settings.theme) {
      case ThemeType.DARK:
        classes += 'bg-slate-900 text-slate-100 ';
        break;
      case ThemeType.HIGH_CONTRAST:
        classes += 'bg-black text-yellow-300 ';
        break;
      case ThemeType.SOFT:
        classes += 'bg-[#fbf0d9] text-[#5f4b32] ';
        break;
      default:
        classes += 'bg-slate-50 text-slate-900 ';
        break;
    }
    return classes;
  };

  return (
    <AccessibilityContext.Provider value={{ settings, updateSettings, resetSettings, getThemeClasses }}>
      <div 
        className={getThemeClasses() + " min-h-screen w-full overflow-x-hidden"}
        style={{ 
          fontSize: `${settings.fontSize}rem`,
          letterSpacing: `${settings.wordSpacing}em`
        }}
      >
        {children}
      </div>
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) throw new Error('useAccessibility must be used within AccessibilityProvider');
  return context;
};