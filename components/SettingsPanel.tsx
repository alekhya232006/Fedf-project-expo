import React from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { FontType, ThemeType } from '../types';
import { Button } from './ui/Button';

export const SettingsPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { settings, updateSettings, resetSettings } = useAccessibility();

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white dark:bg-slate-800 shadow-2xl z-50 p-6 overflow-y-auto border-l border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Accessibility Settings</h2>
        <Button variant="ghost" label="Close" onClick={onClose} />
      </div>

      <div className="space-y-8">
        {/* Visual Theme */}
        <section>
          <h3 className="text-lg font-semibold mb-3">Display Mode</h3>
          <div className="grid grid-cols-2 gap-3">
            {Object.values(ThemeType).map((t) => (
              <button
                key={t}
                onClick={() => updateSettings({ theme: t })}
                className={`p-3 rounded-md border-2 capitalize ${
                  settings.theme === t 
                    ? 'border-blue-500 ring-2 ring-blue-200' 
                    : 'border-gray-200 dark:border-gray-600'
                }`}
              >
                {t.replace('-', ' ')}
              </button>
            ))}
          </div>
        </section>

        {/* Fonts */}
        <section>
          <h3 className="text-lg font-semibold mb-3">Typography</h3>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="font"
                checked={settings.font === FontType.DEFAULT}
                onChange={() => updateSettings({ font: FontType.DEFAULT })}
                className="w-5 h-5 text-blue-600"
              />
              <span className="font-sans">Standard Sans</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="font"
                checked={settings.font === FontType.DYSLEXIC}
                onChange={() => updateSettings({ font: FontType.DYSLEXIC })}
                className="w-5 h-5 text-blue-600"
              />
              <span className="font-dyslexic">Open Dyslexic</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="font"
                checked={settings.font === FontType.LEXEND}
                onChange={() => updateSettings({ font: FontType.LEXEND })}
                className="w-5 h-5 text-blue-600"
              />
              <span className="font-lexend">Lexend (Readability)</span>
            </label>
          </div>
        </section>

        {/* Sizing */}
        <section>
          <h3 className="text-lg font-semibold mb-3">Text Size & Spacing</h3>
          <div className="space-y-4">
            <div>
              <label className="block mb-1 text-sm">Font Size ({settings.fontSize}x)</label>
              <input 
                type="range" 
                min="0.8" 
                max="2.5" 
                step="0.1"
                value={settings.fontSize}
                onChange={(e) => updateSettings({ fontSize: parseFloat(e.target.value) })}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm">Word Spacing</label>
              <input 
                type="range" 
                min="0" 
                max="0.5" 
                step="0.05"
                value={settings.wordSpacing}
                onChange={(e) => updateSettings({ wordSpacing: parseFloat(e.target.value) })}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </section>

        {/* Motor Disability */}
        <section className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
             Motor Assist
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-sm opacity-80">Enlarge buttons & Hit areas</span>
            <button 
              onClick={() => updateSettings({ motorMode: !settings.motorMode })}
              className={`w-12 h-6 rounded-full transition-colors relative ${settings.motorMode ? 'bg-blue-600' : 'bg-gray-400'}`}
            >
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.motorMode ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
        </section>

        <Button variant="danger" label="Reset All Settings" onClick={resetSettings} className="w-full" />
      </div>
    </div>
  );
};
