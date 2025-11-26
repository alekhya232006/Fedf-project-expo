import React from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { KEYBOARD_LAYOUT_1 } from '../constants';

interface VirtualKeyboardProps {
  onKeyPress: (char: string) => void;
  onBackspace: () => void;
  onSpace: () => void;
  onEnter: () => void;
}

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({ onKeyPress, onBackspace, onSpace, onEnter }) => {
  const { settings } = useAccessibility();

  if (!settings.motorMode) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-gray-100 dark:bg-slate-900 border-t border-gray-300 dark:border-gray-700 p-2 sm:p-4 z-40 shadow-up transition-transform">
      <div className="max-w-4xl mx-auto flex flex-col gap-2">
        {KEYBOARD_LAYOUT_1.map((row, i) => (
          <div key={i} className="flex justify-center gap-2">
            {row.map((char) => (
              <button
                key={char}
                onClick={() => onKeyPress(char)}
                className="flex-1 min-w-[32px] sm:min-w-[48px] h-12 sm:h-16 rounded-lg bg-white dark:bg-slate-700 shadow-md hover:bg-blue-50 active:bg-blue-200 text-xl font-bold uppercase transition-transform active:scale-95 border-b-4 border-gray-300 dark:border-gray-800"
              >
                {char}
              </button>
            ))}
          </div>
        ))}
        <div className="flex gap-2 mt-1">
          <button onClick={onSpace} className="flex-[4] h-12 sm:h-16 rounded-lg bg-white dark:bg-slate-700 shadow-md text-sm font-bold border-b-4 border-gray-300">SPACE</button>
          <button onClick={onBackspace} className="flex-1 h-12 sm:h-16 rounded-lg bg-red-100 dark:bg-red-900/50 shadow-md text-sm font-bold border-b-4 border-red-200 text-red-800 dark:text-red-200">⌫</button>
          <button onClick={onEnter} className="flex-1 h-12 sm:h-16 rounded-lg bg-blue-100 dark:bg-blue-900/50 shadow-md text-sm font-bold border-b-4 border-blue-200 text-blue-800 dark:text-blue-200">⏎</button>
        </div>
      </div>
    </div>
  );
};
