import type { CSSProperties } from 'react';

type Intent = 'primary' | 'secondary' | 'danger' | 'success';
type Size   = 'sm' | 'md' | 'lg';

interface ButtonProps {
  label:    string;
  intent?:  Intent;
  size?:    Size;
  disabled?: boolean;
  onClick?: () => void;
}

const padding: Record<Size, string> = {
  sm: 'var(--space-xs) var(--space-sm)',
  md: 'var(--space-sm) var(--space-md)',
  lg: 'var(--space-md) var(--space-lg)',
};

const fontSize: Record<Size, string> = {
  sm: 'var(--text-sm)',
  md: 'var(--text-md)',
  lg: 'var(--text-lg)',
};

export function Button({ label, intent = 'primary', size = 'md', disabled = false, onClick }: ButtonProps) {
  const style: CSSProperties = {
    background:   `var(--color-${intent})`,
    color:        `var(--color-on-${intent})`,
    border:       'none',
    padding:      padding[size],
    borderRadius: 'var(--radius-md)',
    fontSize:     fontSize[size],
    cursor:       disabled ? 'not-allowed' : 'pointer',
    opacity:      disabled ? 0.5 : 1,
    fontFamily:   'system-ui, sans-serif',
    transition:   'opacity 0.15s',
  };

  return (
    <button style={style} disabled={disabled} onClick={onClick}>
      {label}
    </button>
  );
}
