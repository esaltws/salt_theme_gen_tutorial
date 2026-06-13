import { theme, injectTheme } from './theme';
import './styles/main.scss';

injectTheme();

const app = document.getElementById('app')!;
const colors = Object.entries(theme.light.colors);
const spacing = Object.entries(theme.light.spacing);

function render(mode: string) {
  app.innerHTML = `
    <div class="root">
      <h1>salt-theme-gen — Sass</h1>
      <p class="muted">Preset: ocean &nbsp;·&nbsp; ${mode} mode &nbsp;·&nbsp; SCSS variables alias CSS custom properties</p>
      <button class="btn" id="toggle">Toggle dark mode</button>

      <div class="card">
        <h2>Color palette (${colors.length} colors)</h2>
        <div class="swatches">
          ${colors.map(([name, value]) => `<div class="swatch" style="background:${value}" title="${name}: ${value}"></div>`).join('')}
        </div>
      </div>

      <div class="card">
        <h2>Spacing scale</h2>
        ${spacing.map(([k, v]) => `
          <div class="spacing-row">
            <span class="spacing-label">${k}</span>
            <div class="spacing-bar" style="width:${(v as number) * 1.5}px"></div>
            <span class="spacing-value">${v}px</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  document.getElementById('toggle')!.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const next = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    render(next);
  });
}

const stored = localStorage.getItem('theme') ?? 'light';
render(stored);
