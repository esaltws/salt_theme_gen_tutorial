'use client';
import { useState, useEffect } from 'react';
import { theme } from '@/lib/theme';

const colors = Object.entries(theme.light.colors);
const spacing = Object.entries(theme.light.spacing);

export default function Home() {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark') setMode('dark');
  }, []);

  const toggle = () => {
    const next = mode === 'light' ? 'dark' : 'light';
    setMode(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  };

  return (
    <main style={{ padding: 'var(--space-xl)' }}>
      <h1 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-sm)', marginTop: 0 }}>
        salt-theme-gen — Next.js
      </h1>
      <p style={{ color: 'var(--color-muted)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-lg)' }}>
        Preset: ocean &nbsp;·&nbsp; {mode} mode
      </p>

      <button
        onClick={toggle}
        style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary)', border: 'none', padding: 'var(--space-sm) var(--space-md)', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-xl)' }}
      >
        Toggle dark mode
      </button>

      <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-lg)', marginBottom: 'var(--space-lg)' }}>
        <h2 style={{ fontSize: 'var(--text-md)', marginTop: 0, marginBottom: 'var(--space-md)' }}>
          Color palette ({colors.length} colors)
        </h2>
        <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
          {colors.map(([name, value]) => (
            <div key={name} title={`${name}: ${value}`} style={{ width: 48, height: 48, borderRadius: 'var(--radius-sm)', background: value, border: '1px solid var(--color-border)' }} />
          ))}
        </div>
      </div>

      <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-lg)' }}>
        <h2 style={{ fontSize: 'var(--text-md)', marginTop: 0, marginBottom: 'var(--space-md)' }}>Spacing scale</h2>
        {spacing.map(([k, v]) => (
          <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ width: 40, fontSize: 12, color: 'var(--color-muted)' }}>{k}</span>
            <div style={{ height: 4, background: 'var(--color-primary)', width: (v as number) * 1.5 }} />
            <span style={{ fontSize: 12, color: 'var(--color-muted)' }}>{v}px</span>
          </div>
        ))}
      </div>
    </main>
  );
}
