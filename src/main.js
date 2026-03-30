import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import { definePreset } from '@primeuix/themes';
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';
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
			cssLayer: {
				name: 'primevue',
				order: 'tailwind-base, primevue, tailwind-utilities'
			}
		}
	}
});
app.use(ToastService);
app.use(ConfirmationService);
app.use(router);
app.mount('#app');
