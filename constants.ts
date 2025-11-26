import { AccessibilitySettings, FontType, ThemeType } from "./types";

export const DEFAULT_SETTINGS: AccessibilitySettings = {
  font: FontType.LEXEND,
  theme: ThemeType.LIGHT,
  fontSize: 1.1, // Slightly larger by default
  wordSpacing: 0.1,
  motorMode: false,
  distractionFree: false,
};

export const MOCK_DOCS = [
  {
    id: '1',
    title: 'Project Proposal',
    content: 'The goal of this project is to create an accessible web application...',
    lastModified: Date.now(),
    wordCount: 120
  },
  {
    id: '2',
    title: 'Weekly Journal',
    content: 'Today was a productive day. I managed to finish the core module...',
    lastModified: Date.now() - 86400000,
    wordCount: 45
  }
];

export const KEYBOARD_LAYOUT_1 = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm']
];
