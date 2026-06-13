import { useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { theme, styledTheme } from './theme';

const Root = styled.div`
  font-family: system-ui, sans-serif;
  padding: var(--space-xl);
  background: var(--color-background);
  color: var(--color-text);
  min-height: 100vh;
`;

const Heading = styled.h1`
  font-size: var(--text-xl);
  margin-bottom: var(--space-sm);
  margin-top: 0;
`;

const Muted = styled.p`
  color: var(--color-muted);
  font-size: var(--text-sm);
  margin-bottom: var(--space-lg);
`;

const Button = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.onPrimary};
  border: none;
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: var(--text-sm);
  margin-bottom: var(--space-xl);
`;

const Card = styled.div`
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  margin-bottom: var(--space-lg);
`;

const CardHeading = styled.h2`
  font-size: var(--text-md);
  margin-top: 0;
  margin-bottom: var(--space-md);
`;

const Swatches = styled.div`
  display: flex;
  gap: var(--space-sm);
  flex-wrap: wrap;
`;

const Swatch = styled.div<{ $color: string }>`
  width: 48px;
  height: 48px;
  border-radius: var(--radius-sm);
  background: ${p => p.$color};
  border: 1px solid var(--color-border);
`;

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
    <ThemeProvider theme={styledTheme}>
      <Root>
        <Heading>salt-theme-gen — styled-components</Heading>
        <Muted>Preset: ocean &nbsp;·&nbsp; {mode} mode &nbsp;·&nbsp; typed theme props via module augmentation</Muted>

        <Button onClick={toggle}>Toggle dark mode</Button>

        <Card>
          <CardHeading>Color palette ({colors.length} colors)</CardHeading>
          <Swatches>
            {colors.map(([name, value]) => (
              <Swatch key={name} $color={value} title={`${name}: ${value}`} />
            ))}
          </Swatches>
        </Card>

        <Card>
          <CardHeading>Spacing scale</CardHeading>
          {spacing.map(([k, v]) => (
            <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ width: 40, fontSize: 12, color: 'var(--color-muted)' }}>{k}</span>
              <div style={{ height: 4, background: 'var(--color-primary)', width: (v as number) * 1.5 }} />
              <span style={{ fontSize: 12, color: 'var(--color-muted)' }}>{v}px</span>
            </div>
          ))}
        </Card>
      </Root>
    </ThemeProvider>
  );
}
