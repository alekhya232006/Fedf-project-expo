export enum AppMode {
  EDITOR = 'EDITOR',
  SETTINGS = 'SETTINGS',
  DASHBOARD = 'DASHBOARD'
}

export enum FontType {
  DEFAULT = 'font-sans',
  DYSLEXIC = 'font-dyslexic',
  LEXEND = 'font-lexend',
}

export enum ThemeType {
  LIGHT = 'light',
  DARK = 'dark',
  HIGH_CONTRAST = 'high-contrast',
  SOFT = 'soft', // Sepia-like
}

export interface AccessibilitySettings {
  font: FontType;
  theme: ThemeType;
  fontSize: number; // 1 = base, 1.25 = lg, 1.5 = xl
  wordSpacing: number;
  motorMode: boolean; // Enables large targets, sticky keys visual aid
  distractionFree: boolean;
}

export interface DocumentData {
  id: string;
  title: string;
  content: string;
  lastModified: number;
  wordCount: number;
}

export interface AIRequestOptions {
  task: 'rewrite' | 'fix_grammar' | 'summarize' | 'expand';
  text: string;
}

export interface VirtualKey {
  label: string;
  value: string;
  width?: string;
}