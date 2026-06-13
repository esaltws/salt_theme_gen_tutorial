import { theme, injectTheme } from './theme.js';

injectTheme();

// Render color swatches
const swatchContainer = document.getElementById('swatches');
for (const [name, value] of Object.entries(theme.light.colors)) {
  const el = document.createElement('div');
  el.className = 'swatch';
  el.style.backgroundColor = value;
  el.title = `${name}: ${value}`;
  swatchContainer.appendChild(el);
}

// Render spacing scale
const spacingContainer = document.getElementById('spacing');
for (const [k, v] of Object.entries(theme.light.spacing)) {
  const row = document.createElement('div');
  row.className = 'spacing-row';
  row.innerHTML = `
    <span class="spacing-label">${k}</span>
    <div class="spacing-bar" style="width:${v * 1.5}px;"></div>
    <span class="spacing-value">${v}px</span>
  `;
  spacingContainer.appendChild(row);
}

// Dark mode toggle
const toggle = document.getElementById('toggle');
const modeLabel = document.getElementById('mode-label');

toggle.addEventListener('click', () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const next = isDark ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  modeLabel.textContent = `${next} mode`;
});
