<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { generateTheme } from 'salt-theme-gen';

const theme = generateTheme({ preset: 'ocean' });
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
  <NuxtRouteAnnouncer />
  <div class="root">
    <h1>salt-theme-gen — Nuxt</h1>
    <p class="muted">Preset: ocean &nbsp;·&nbsp; {{ mode }} mode</p>
    <button class="btn" @click="toggle">Toggle dark mode</button>

    <div class="card">
      <h2>Color palette ({{ colors.length }} colors)</h2>
      <div class="swatches">
        <div v-for="[name, value] in colors" :key="name" class="swatch" :style="{ background: value }" :title="`${name}: ${value}`" />
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
.root { font-family: system-ui, sans-serif; padding: var(--space-xl, 32px); background: var(--color-background, #fff); color: var(--color-text, #111); min-height: 100vh; }
h1 { font-size: var(--text-xl, 20px); margin-bottom: var(--space-sm, 8px); }
h2 { font-size: var(--text-md, 16px); margin-bottom: var(--space-md, 16px); }
.muted { color: var(--color-muted, #666); font-size: var(--text-sm, 14px); margin-bottom: var(--space-lg, 24px); }
.btn { background: var(--color-primary, #2563eb); color: var(--color-on-primary, #fff); border: none; padding: var(--space-sm, 8px) var(--space-md, 16px); border-radius: var(--radius-md, 8px); cursor: pointer; font-size: var(--text-sm, 14px); margin-bottom: var(--space-xl, 32px); }
.card { background: var(--color-surface, #f5f5f5); border: 1px solid var(--color-border, #e0e0e0); border-radius: var(--radius-lg, 12px); padding: var(--space-lg, 24px); margin-bottom: var(--space-lg, 24px); }
.swatches { display: flex; gap: var(--space-sm, 8px); flex-wrap: wrap; }
.swatch { width: 48px; height: 48px; border-radius: var(--radius-sm, 4px); border: 1px solid var(--color-border, #e0e0e0); }
.spacing-row { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
.spacing-label { width: 40px; font-size: 12px; color: var(--color-muted, #666); }
.spacing-bar { height: 4px; background: var(--color-primary, #2563eb); }
.spacing-value { font-size: 12px; color: var(--color-muted, #666); }
</style>
