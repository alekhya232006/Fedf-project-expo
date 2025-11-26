import React, { useState } from 'react';
import { AccessibilityProvider, useAccessibility } from './context/AccessibilityContext';
import { Editor } from './components/Editor';
import { SettingsPanel } from './components/SettingsPanel';
import { Button } from './components/ui/Button';

const MainLayout: React.FC = () => {
  const [showSettings, setShowSettings] = useState(false);
  const { settings, updateSettings } = useAccessibility();

  return (
    <div className="flex flex-col h-screen relative transition-colors duration-300">
      
      {/* Header / Nav - Hidden in distraction free mode */}
      {!settings.distractionFree && (
        <header className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg">
              A
            </div>
            <h1 className="text-xl font-bold tracking-tight hidden sm:block">AbleAssist</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
                label={settings.distractionFree ? "Exit Focus" : "Focus Mode"}
                onClick={() => updateSettings({ distractionFree: !settings.distractionFree })}
                variant="ghost"
                className="hidden sm:flex"
            />
            <Button 
              label="Settings" 
              onClick={() => setShowSettings(true)} 
              variant="primary"
              icon="⚙️"
            />
          </div>
        </header>
      )}

      {/* Distraction Free Exit Button */}
      {settings.distractionFree && (
          <div className="fixed top-4 right-4 z-50">
               <Button 
                label="Exit Focus"
                onClick={() => updateSettings({ distractionFree: false })}
                variant="secondary"
            />
          </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative">
        <Editor />
      </main>

      {/* Settings Panel Slide-over */}
      {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AccessibilityProvider>
      <MainLayout />
    </AccessibilityProvider>
  );
};

export default App;