import { useState } from 'react';
import { theme } from './theme';

const colors = Object.entries(theme.light.colors);
const spacing = Object.entries(theme.light.spacing);

export function App() {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  const toggle = () => {
    const next = mode === 'light' ? 'dark' : 'light';
    setMode(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  };

  return (
    <div className="min-h-screen bg-background text-text p-token-xl font-sans">
      <h1 className="text-xl font-bold mb-token-sm">salt-theme-gen — Tailwind CSS</h1>
      <p className="text-muted text-sm mb-token-lg">
        Preset: ocean &nbsp;·&nbsp; {mode} mode &nbsp;·&nbsp; Tailwind reads tokens as CSS vars
      </p>

      <button
        onClick={toggle}
        className="bg-primary text-white px-token-md py-token-sm rounded-token-md text-sm mb-token-xl cursor-pointer border-0"
      >
        Toggle dark mode
      </button>

      <div className="bg-surface border border-border rounded-token-lg p-token-lg mb-token-lg">
        <h2 className="text-base font-semibold mb-token-md">Color palette ({colors.length} colors)</h2>
        <div className="flex flex-wrap gap-token-sm">
          {colors.map(([name, value]) => (
            <div
              key={name}
              title={`${name}: ${value}`}
              className="w-12 h-12 rounded-token-sm border border-border"
              style={{ background: value }}
            />
          ))}
        </div>
      </div>

      <div className="bg-surface border border-border rounded-token-lg p-token-lg">
        <h2 className="text-base font-semibold mb-token-md">Spacing scale</h2>
        {spacing.map(([k, v]) => (
          <div key={k} className="flex items-center gap-2 mb-1">
            <span className="w-10 text-xs text-muted">{k}</span>
            <div className="h-1 bg-primary" style={{ width: (v as number) * 1.5 }} />
            <span className="text-xs text-muted">{v}px</span>
          </div>
        ))}
      </div>
    </div>
  );
}
