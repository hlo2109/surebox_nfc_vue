import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import { definePreset } from '@primeuix/themes';
import 'primeicons/primeicons.css'
import App from './App.vue';
import './index.css';
import router from './router';

const MyPreset = definePreset(Aura, {
	semantic: {
		primary: {
			50: '#E6F0F7',
			100: '#CCE1EF',
			200: '#99C2DF',
			300: '#66A4CF',
			400: '#3385BF',
			500: '#0D65AE', // main brand color
			600: '#0B5899',
			700: '#094A82',
			800: '#073C6B',
			900: '#052E55',
			950: '#031F3E'
		}
	}
});

const app = createApp(App);
app.use(PrimeVue, {
	theme: {
		preset: MyPreset,
		options: {
			darkModeSelector: '',
			cssLayer: false
		}
	}
});
app.use(router);
app.mount('#app');