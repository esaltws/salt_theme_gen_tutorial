import { createApp } from 'vue';
import { injectTheme } from './theme';
import App from './App.vue';

injectTheme();
createApp(App).mount('#app');
