<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { theme } from './theme';

const colors = Object.entries(theme.light.colors);
const spacing = Object.entries(theme.light.spacing);
const mode = ref<'light' | 'dark'>('light');

onMounted(() => {
  const stored = localStorage.getItem('theme');
  if (stored === 'dark') mode.value = 'dark';
});

function toggle() {
  const next = mode.value === 'light' ? 'dark' : 'light';
  mode.value = next;
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
}
</script>

<template>
  <div class="root">
    <h1>salt-theme-gen — Vue</h1>
    <p class="muted">Preset: ocean &nbsp;·&nbsp; {{ mode }} mode</p>

    <button class="btn" @click="toggle">Toggle dark mode</button>

    <div class="card">
      <h2>Color palette ({{ colors.length }} colors)</h2>
      <div class="swatches">
        <div
          v-for="[name, value] in colors"
          :key="name"
          class="swatch"
          :style="{ background: value }"
          :title="`${name}: ${value}`"
        />
      </div>
    </div>

    <div class="card">
      <h2>Spacing scale</h2>
      <div v-for="[k, v] in spacing" :key="k" class="spacing-row">
        <span class="spacing-label">{{ k }}</span>
        <div class="spacing-bar" :style="{ width: `${(v as number) * 1.5}px` }" />
        <span class="spacing-value">{{ v }}px</span>
      </div>
    </div>
  </div>
</template>

<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
.root { font-family: system-ui, sans-serif; padding: var(--space-xl); background: var(--color-background); color: var(--color-text); min-height: 100vh; }
h1 { font-size: var(--text-xl); margin-bottom: var(--space-sm); }
h2 { font-size: var(--text-md); margin-bottom: var(--space-md); }
.muted { color: var(--color-muted); font-size: var(--text-sm); margin-bottom: var(--space-lg); }
.btn { background: var(--color-primary); color: var(--color-on-primary); border: none; padding: var(--space-sm) var(--space-md); border-radius: var(--radius-md); cursor: pointer; font-size: var(--text-sm); margin-bottom: var(--space-xl); }
.card { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: var(--space-lg); margin-bottom: var(--space-lg); }
.swatches { display: flex; gap: var(--space-sm); flex-wrap: wrap; }
.swatch { width: 48px; height: 48px; border-radius: var(--radius-sm); border: 1px solid var(--color-border); }
.spacing-row { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
.spacing-label { width: 40px; font-size: 12px; color: var(--color-muted); }
.spacing-bar { height: 4px; background: var(--color-primary); }
.spacing-value { font-size: 12px; color: var(--color-muted); }
</style>
