import { theme } from './theme';
import { useTheme } from './ThemeContext';

const colors = Object.entries(theme.light.colors);
const spacing = Object.entries(theme.light.spacing);

const s: Record<string, React.CSSProperties> = {
  root: { fontFamily: 'system-ui, sans-serif', padding: 'var(--space-xl)', background: 'var(--color-background)', color: 'var(--color-text)', minHeight: '100vh' },
  heading: { fontSize: 'var(--text-xl)', marginBottom: 'var(--space-sm)', marginTop: 0 },
  muted: { color: 'var(--color-muted)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-lg)' },
  btn: { background: 'var(--color-primary)', color: 'var(--color-on-primary)', border: 'none', padding: 'var(--space-sm) var(--space-md)', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-xl)' },
  card: { background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-lg)', marginBottom: 'var(--space-lg)' },
  cardHeading: { fontSize: 'var(--text-md)', marginBottom: 'var(--space-md)', marginTop: 0 },
  swatches: { display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' },
  swatch: { width: 48, height: 48, borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' },
  spacingRow: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 },
  spacingLabel: { width: 40, fontSize: 12, color: 'var(--color-muted)' },
  spacingValue: { fontSize: 12, color: 'var(--color-muted)' },
};

export function App() {
  const { mode, toggle } = useTheme();

  return (
    <div style={s.root}>
      <h1 style={s.heading}>salt-theme-gen — React</h1>
      <p style={s.muted}>Preset: ocean &nbsp;·&nbsp; {mode} mode</p>

      <button style={s.btn} onClick={toggle}>Toggle dark mode</button>

      <div style={s.card}>
        <h2 style={s.cardHeading}>Color palette ({colors.length} colors)</h2>
        <div style={s.swatches}>
          {colors.map(([name, value]) => (
            <div key={name} style={{ ...s.swatch, background: value }} title={`${name}: ${value}`} />
          ))}
        </div>
      </div>

      <div style={s.card}>
        <h2 style={s.cardHeading}>Spacing scale</h2>
        {spacing.map(([k, v]) => (
          <div key={k} style={s.spacingRow}>
            <span style={s.spacingLabel}>{k}</span>
            <div style={{ height: 4, background: 'var(--color-primary)', width: (v as number) * 1.5 }} />
            <span style={s.spacingValue}>{v}px</span>
          </div>
        ))}
      </div>
    </div>
  );
}
