/**
 * Theme detection and mobile optimization utilities
 */

export function detectSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function forceThemeOnMobile(theme: 'light' | 'dark' = 'light'): void {
  if (typeof window === 'undefined') return;
  
  // Force light theme on mobile for better readability
  const isMobile = window.innerWidth <= 768;
  if (isMobile) {
    document.documentElement.classList.remove('dark');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }
}

export function optimizeForDevice(): void {
  if (typeof window === 'undefined') return;
  
  const isLargePhone = window.innerWidth <= 430 && window.innerHeight >= 900;
  const isMobile = window.innerWidth <= 768;
  
  if (isLargePhone) {
    document.body.classList.add('large-phone-optimized');
  }
  
  if (isMobile) {
    document.body.classList.add('mobile-optimized');
    // Force light theme for better mobile experience
    forceThemeOnMobile('light');
  }
}