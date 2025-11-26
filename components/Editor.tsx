import React, { useState, useEffect, useRef } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { Button } from './ui/Button';
import { VirtualKeyboard } from './VirtualKeyboard';
import { OCRModal } from './OCRModal';
import { processTextWithAI, getSmartSuggestions } from '../services/geminiService';
import { ThemeType } from '../types';

export const Editor: React.FC = () => {
  const { settings } = useAccessibility();
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [showOCR, setShowOCR] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  
  // Speech Recognition Refs
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Debounce suggestion fetching
    const timer = setTimeout(() => {
        if (text.length > 10 && !aiLoading) {
            getSmartSuggestions(text).then(setSuggestions);
        }
    }, 1500);
    return () => clearTimeout(timer);
  }, [text]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (!('webkitSpeechRecognition' in window)) {
        alert("Browser does not support speech recognition.");
        return;
      }
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US'; // Could expand to multi-lang select

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        
        if (finalTranscript) {
          setText(prev => prev + ' ' + finalTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        console.error(event.error);
        setIsListening(false);
      };
      
      recognition.onend = () => {
          setIsListening(false);
      }

      recognitionRef.current = recognition;
      recognition.start();
      setIsListening(true);
    }
  };

  const handleAIAction = async (task: 'rewrite' | 'fix_grammar' | 'summarize') => {
    if (!text) return;
    setAiLoading(true);
    try {
      const result = await processTextWithAI({ task, text });
      if (task === 'summarize') {
        alert("Summary:\n\n" + result);
      } else {
        setText(result);
      }
    } catch (e) {
      alert("AI failed to process.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleReadAloud = () => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  // Virtual Keyboard Handlers
  const handleVirtualKey = (char: string) => setText(prev => prev + char);
  const handleVirtualBackspace = () => setText(prev => prev.slice(0, -1));
  const handleVirtualSpace = () => setText(prev => prev + ' ');
  const handleVirtualEnter = () => setText(prev => prev + '\n');

  const insertSuggestion = (s: string) => setText(prev => prev + " " + s);

  return (
    <div className={`relative flex flex-col h-full ${settings.distractionFree ? 'p-0' : 'p-4 md:p-8 max-w-5xl mx-auto'}`}>
      
      {/* Toolbar */}
      {!settings.distractionFree && (
        <div className="flex flex-wrap gap-3 mb-6 bg-white/50 dark:bg-slate-800/50 p-4 rounded-xl backdrop-blur-md border border-gray-200 dark:border-gray-700 shadow-sm sticky top-2 z-30">
          <Button 
            label={isListening ? "Stop Listening" : "Voice Input"} 
            onClick={toggleListening} 
            className={isListening ? "bg-red-500 animate-pulse text-white" : ""}
            icon={isListening ? "🛑" : "🎤"}
          />
          <Button label="Read Aloud" onClick={handleReadAloud} variant="secondary" icon="🔊" />
          <Button label="Fix Grammar" onClick={() => handleAIAction('fix_grammar')} variant="secondary" icon="✨" disabled={aiLoading} />
          <Button label="Rewrite" onClick={() => handleAIAction('rewrite')} variant="secondary" icon="🖊️" disabled={aiLoading} />
          <Button label="Scan Text" onClick={() => setShowOCR(true)} variant="secondary" icon="📷" />
          <Button 
            label="Download" 
            variant="secondary"
            icon="💾"
            onClick={() => {
                const element = document.createElement("a");
                const file = new Blob([text], {type: 'text/plain'});
                element.href = URL.createObjectURL(file);
                element.download = "accessible-doc.txt";
                document.body.appendChild(element);
                element.click();
            }} 
          />
        </div>
      )}

      {/* Editor Area */}
      <div className="flex-1 relative group">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start writing or dictating here..."
          className={`
            w-full h-[60vh] p-6 resize-none outline-none rounded-xl shadow-inner
            transition-all duration-300
            ${settings.theme === ThemeType.HIGH_CONTRAST 
                ? 'bg-black text-yellow-400 border-2 border-yellow-400 focus:ring-4 focus:ring-yellow-400' 
                : 'bg-white dark:bg-slate-800 border-gray-100 dark:border-gray-700 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900'}
            ${settings.motorMode ? 'text-2xl p-8 leading-loose' : 'text-lg leading-relaxed'}
          `}
          style={{
              fontSize: `${settings.fontSize}rem`,
              letterSpacing: `${settings.wordSpacing}em`,
              fontFamily: settings.font === 'font-dyslexic' ? 'OpenDyslexic' : undefined 
          }}
        />

        {/* Predictive Suggestions Overlay */}
        {suggestions.length > 0 && (
            <div className="absolute bottom-4 left-4 flex gap-2 flex-wrap">
                {suggestions.map((s, i) => (
                    <button 
                        key={i}
                        onClick={() => insertSuggestion(s)}
                        className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-4 py-2 rounded-full shadow-lg border border-blue-200 hover:bg-blue-200 transition-transform active:scale-95"
                    >
                        {s}
                    </button>
                ))}
            </div>
        )}
      </div>

      {/* Stats Footer */}
      <div className="mt-4 flex justify-between text-sm opacity-70 px-2">
        <span>Words: {text.split(/\s+/).filter(w => w.length > 0).length}</span>
        <span>{isListening ? 'Microphone Active' : 'Ready'}</span>
      </div>

      <VirtualKeyboard 
        onKeyPress={handleVirtualKey}
        onBackspace={handleVirtualBackspace}
        onSpace={handleVirtualSpace}
        onEnter={handleVirtualEnter}
      />

      {showOCR && (
        <OCRModal 
          onClose={() => setShowOCR(false)} 
          onTextExtracted={(extracted) => setText(prev => prev + '\n' + extracted)} 
        />
      )}
    </div>
  );
};
