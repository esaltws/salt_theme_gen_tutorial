import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: ['attribute', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        primary:    'var(--color-primary)',
        secondary:  'var(--color-secondary)',
        background: 'var(--color-background)',
        surface:    'var(--color-surface)',
        text:       'var(--color-text)',
        muted:      'var(--color-muted)',
        border:     'var(--color-border)',
        danger:     'var(--color-danger)',
        success:    'var(--color-success)',
      },
      spacing: {
        'token-xs':  'var(--space-xs)',
        'token-sm':  'var(--space-sm)',
        'token-md':  'var(--space-md)',
        'token-lg':  'var(--space-lg)',
        'token-xl':  'var(--space-xl)',
        'token-xxl': 'var(--space-xxl)',
      },
      borderRadius: {
        'token-sm':   'var(--radius-sm)',
        'token-md':   'var(--radius-md)',
        'token-lg':   'var(--radius-lg)',
        'token-pill': 'var(--radius-pill)',
      },
    },
  },
  plugins: [],
};

export default config;
