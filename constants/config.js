// API Configuration
// Get free API key from openweathermap.org

export const API_KEY = process.env.EXPO_PUBLIC_OWM_KEY;
export const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Dark theme colors
export const DARK = {
  background:  '#0A0E1A',
  card:        'rgba(255,255,255,0.10)',
  cardBorder:  'rgba(255,255,255,0.15)',
  white:       '#FFFFFF',
  grey:        '#94A3B8',
  darkGrey:    '#64748B',
  blue:        '#60A5FA',
  red:         '#EF4444',
  tabBar:      '#0F172A',
  tabBorder:   'rgba(255,255,255,0.08)',
  text:        '#FFFFFF',
};

// Light theme colors
export const LIGHT = {
  background:  '#F0F4F8',
  card:        'rgba(184, 170, 170, 0.12)',
  cardBorder:  'rgba(0,0,0,0.25)',
  white:       '#1A1A2E',
  grey:        '#4A5568',
  darkGrey:    '#718096',
  blue:        '#2563EB',
  red:         '#EF4444',
  tabBar:      '#FFFFFF',
  tabBorder:   'rgba(0,0,0,0.1)',
  text:        '#1A1A2E',
};

// Keep COLORS for backward compatibility
export const COLORS = DARK;