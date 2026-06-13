<script lang="ts">
  import { onMount } from 'svelte';
  import { buildCss } from '$lib/theme';

  const css = buildCss();

  onMount(() => {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    const stored = localStorage.getItem('theme');
    if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  });
</script>

<svelte:head>
  <style>{`* { box-sizing: border-box; margin: 0; padding: 0; } body { font-family: system-ui, sans-serif; }`}</style>
</svelte:head>

<slot />
