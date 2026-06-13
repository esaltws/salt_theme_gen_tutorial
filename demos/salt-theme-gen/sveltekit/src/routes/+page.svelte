<script lang="ts">
  import { theme } from '$lib/theme';

  const colors = Object.entries(theme.light.colors);
  const spacing = Object.entries(theme.light.spacing);

  let mode = $state<'light' | 'dark'>('light');

  function toggle() {
    const next = mode === 'light' ? 'dark' : 'light';
    mode = next;
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  }
</script>

<div style="font-family: system-ui, sans-serif; padding: var(--space-xl, 32px); background: var(--color-background, #fff); color: var(--color-text, #111); min-height: 100vh">
  <h1 style="font-size: var(--text-xl, 20px); margin-bottom: var(--space-sm, 8px)">salt-theme-gen — SvelteKit</h1>
  <p style="color: var(--color-muted, #666); font-size: var(--text-sm, 14px); margin-bottom: var(--space-lg, 24px)">
    Preset: ocean &nbsp;·&nbsp; {mode} mode
  </p>

  <button
    onclick={toggle}
    style="background: var(--color-primary, #2563eb); color: var(--color-on-primary, #fff); border: none; padding: var(--space-sm, 8px) var(--space-md, 16px); border-radius: var(--radius-md, 8px); cursor: pointer; font-size: var(--text-sm, 14px); margin-bottom: var(--space-xl, 32px)"
  >
    Toggle dark mode
  </button>

  <div style="background: var(--color-surface, #f5f5f5); border: 1px solid var(--color-border, #e0e0e0); border-radius: var(--radius-lg, 12px); padding: var(--space-lg, 24px); margin-bottom: var(--space-lg, 24px)">
    <h2 style="font-size: var(--text-md, 16px); margin-bottom: var(--space-md, 16px)">Color palette ({colors.length} colors)</h2>
    <div style="display: flex; gap: var(--space-sm, 8px); flex-wrap: wrap">
      {#each colors as [name, value]}
        <div title="{name}: {value}" style="width: 48px; height: 48px; border-radius: var(--radius-sm, 4px); background: {value}; border: 1px solid var(--color-border, #e0e0e0)" />
      {/each}
    </div>
  </div>

  <div style="background: var(--color-surface, #f5f5f5); border: 1px solid var(--color-border, #e0e0e0); border-radius: var(--radius-lg, 12px); padding: var(--space-lg, 24px)">
    <h2 style="font-size: var(--text-md, 16px); margin-bottom: var(--space-md, 16px)">Spacing scale</h2>
    {#each spacing as [k, v]}
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px">
        <span style="width: 40px; font-size: 12px; color: var(--color-muted, #666)">{k}</span>
        <div style="height: 4px; background: var(--color-primary, #2563eb); width: {(v as number) * 1.5}px" />
        <span style="font-size: 12px; color: var(--color-muted, #666)">{v}px</span>
      </div>
    {/each}
  </div>
</div>
