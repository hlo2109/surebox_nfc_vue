<template>
	<div class="min-h-screen flex flex-col bg-surface-50 light:bg-surface-950">
		<!-- Top map header -->
		<section class="relative h-40 md:h-56 w-full bg-center bg-cover"
			:style="{ backgroundImage: `linear-gradient(rgba(0,0,0,.25), rgba(0,0,0,.25)), url('${mapBgUrl}')` }">
			<div class="relative z-10 h-full px-6 md:px-10 lg:px-16 flex items-start">
				<div class="w-full pt-4 flex items-center justify-between">
					<!-- Back button -->
					<button type="button" @click="goBack"
						class="inline-flex items-center gap-2 text-surface-0/90 hover:text-white cursor-pointer transition-colors">
						<i class="pi pi-arrow-left text-lg" />
						<span class="font-medium">Back</span>
					</button>

					<!-- Forgot password link -->
					<button type="button" @click="goForgot"
						class="text-surface-0/90 cursor-pointer hover:text-white font-medium">
						Forgot your password?
					</button>
				</div>
			</div>
		</section>

		<!-- Auth card -->
		<section class="relative z-20 px-6 md:px-10 lg:px-16 -mt-10 md:-mt-12 pb-10 grow">
			<div
				class="max-w-md mx-auto bg-surface-0 light:bg-surface-900 shadow-sm rounded-2xl p-6 md:p-8 flex flex-col gap-6">
				<!-- Title -->
				<h1 class="text-surface-900 light:text-surface-0 text-2xl font-semibold">Welcome back</h1>

				<!-- Switcher -->
				<div
					class="flex w-full rounded-full overflow-hidden border border-surface-200 light:border-surface-800">
					<router-link to="/login" class="flex-1 text-center py-2 font-medium transition-colors" :class="[
						isLoginRoute ? 'bg-primary text-white' : 'text-surface-700 light:text-surface-200 hover:bg-surface-100 light:hover:bg-surface-800'
					]">
						Login
					</router-link>
					<router-link to="/register" class="flex-1 text-center py-2 font-medium transition-colors" :class="[
						!isLoginRoute ? 'bg-primary text-white' : 'text-surface-700 light:text-surface-200 hover:bg-surface-100 light:hover:bg-surface-800'
					]">
						Register
					</router-link>
				</div>

				<!-- Error message -->
				<div v-if="error"
					class="text-sm text-red-600 light:text-red-400 bg-red-50 light:bg-red-950/30 border border-red-200 light:border-red-800 rounded-md p-3">
					{{ error }}
				</div>

				<!-- Login form -->
				<form @submit="handleLogin" class="flex flex-col gap-6">
					<div class="flex flex-col gap-5 w-full">
						<div class="flex flex-col gap-2 w-full">
							<label for="email1" class="text-zinc-500 text-sm leading-normal">Email
								address</label>
							<InputText id="email1" type="email" v-model="email" placeholder="you@example.com"
								class="w-full px-3 py-2.5 shadow-sm text-sm rounded-lg border border-zinc-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
						</div>

						<div class="flex flex-col gap-2 w-full">
							<label for="password1" class="text-zinc-500 text-sm leading-normal">Password</label>
							<Password id="password1" v-model="password" placeholder="Password" :toggleMask="true"
								:feedback="false"
								input-class="w-full px-3 py-2.5 shadow-sm text-sm rounded-lg border border-zinc-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
						</div>
						<div class="flex items-center justify-between w-full">
							<div class="flex items-center gap-2">
								<Checkbox id="rememberme1" v-model="checked1" :binary="true" />
								<label for="rememberme1"
									class="text-surface-900 light:text-surface-0 leading-normal">Remember me</label>
							</div>
							<button type="button" @click="goForgot"
								class="text-primary cursor-pointer font-medium hover:text-primary-emphasis">Forgot
								password?</button>
						</div>
					</div>

					<Button type="submit" :disabled="loading" :label="loading ? 'Signing in…' : 'Sign In'"
						class="w-full py-3 cursor-pointer rounded-full text-white font-semibold"
						style="background-color: #202224; border-color: #202224;">
						<template #icon>
							<i v-if="!loading" class="pi pi-user" />
							<i v-else class="pi pi-spin pi-spinner" />
						</template>
					</Button>
				</form> <!-- Divider -->
				<div class="flex items-center gap-3 select-none">
					<div class="h-px grow bg-surface-200 light:bg-surface-800"></div>
					<span class="text-surface-500 light:text-surface-300 text-sm">or continue with</span>
					<div class="h-px grow bg-surface-200 light:bg-surface-800"></div>
				</div>

				<!-- Social buttons -->
				<div class="flex flex-col gap-3">
					<Button
						class="w-full py-3 h-auto rounded-full flex items-center justify-center gap-3 border border-surface-300 light:border-surface-700 bg-transparent hover:bg-surface-50 light:hover:bg-surface-800"
						outlined @click="continueWith('google')">
						<span class="inline-flex h-5 w-5" aria-hidden="true" v-html="icons.google"></span>
						<span class="font-medium text-surface-900 light:text-surface-0">Continue with Google</span>
					</Button>
					<Button
						class="w-full py-3 rounded-full flex items-center justify-center gap-3 border border-surface-300 light:border-surface-700 bg-transparent hover:bg-surface-50 light:hover:bg-surface-800"
						outlined @click="continueWith('apple')">
						<span class="inline-flex h-5 w-5" aria-hidden="true" v-html="icons.apple"></span>
						<span class="font-medium text-surface-900 light:text-surface-0">Continue with Apple</span>
					</Button>
					<Button
						class="w-full py-3 rounded-full flex items-center justify-center gap-3 border border-surface-300 light:border-surface-700 bg-transparent hover:bg-surface-50 light:hover:bg-surface-800"
						outlined @click="continueWith('microsoft')">
						<span class="inline-flex h-5 w-5" aria-hidden="true" v-html="icons.microsoft"></span>
						<span class="font-medium text-surface-900 light:text-surface-0">Continue with Microsoft</span>
					</Button>
				</div>
			</div>
		</section>
	</div>
</template>
<script setup>
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';

import { computed, ref } from 'vue';

const checked1 = ref(true);
import { useRouter } from 'vue-router';
import axios from 'axios';

const email = ref('');
const password = ref('');
const error = ref('');
const router = useRouter();
const loading = ref(false);

// Switcher state based on route
const isLoginRoute = computed(() => true);

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Map background: place an image at public/images/map-bg.jpg (fallback to a subtle pattern if missing)
const mapBgUrl = '/bg-map.svg';

function goBack() {
	router.back();
}

function goForgot() {
	// Adjust to your route when available
	try {
		router.push('/forgot-password');
	} catch {
		// no-op if route doesn't exist
	}
}

async function handleLogin(e) {
	e.preventDefault();
	error.value = '';
	loading.value = true;
	try {
		const res = await axios.post(`${API_BASE_URL}/login`, {
			email: email.value,
			password: password.value
		});
		localStorage.setItem('jwt', res.data.token);
		router.push('/');
	} catch (err) {
		error.value = err.response?.data?.message || err.message || 'Connection error';
	} finally {
		loading.value = false;
	}
}

function continueWith(provider) {
	// Replace with your actual OAuth endpoints if available
	// e.g., window.location.href = `${API_BASE_URL}/auth/${provider}`
	console.log(`Continue with ${provider}`);
}

// Inline SVG icons for reliability (no external assets required)
const icons = {
	google: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M23.04 12.261c0-.815-.073-1.597-.209-2.348H12v4.44h6.205a5.305 5.305 0 0 1-2.302 3.478v2.887h3.726c2.18-2.007 3.41-4.965 3.41-8.457Z" fill="#4285F4"/><path d="M12 24c3.24 0 5.957-1.073 7.943-2.922l-3.726-2.887c-1.036.694-2.36 1.107-4.217 1.107-3.24 0-5.985-2.187-6.966-5.126H1.199v3.04A11.997 11.997 0 0 0 12 24Z" fill="#34A853"/><path d="M5.034 14.172A7.197 7.197 0 0 1 4.66 12c0-.752.13-1.48.359-2.172V6.788H1.199A11.997 11.997 0 0 0 0 12c0 1.918.46 3.729 1.199 5.212l3.835-3.04Z" fill="#FBBC05"/><path d="M12 4.749c1.76 0 3.337.606 4.584 1.796l3.438-3.438C17.957 1.2 15.24 0 12 0 7.32 0 3.285 2.69 1.199 6.788l3.82 3.04C6 6.936 8.76 4.75 12 4.75Z" fill="#EA4335"/></svg>',
	apple: '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M16.365 1.43c0 1.14-.45 2.22-1.26 3.03-.9.9-2.07 1.41-3.21 1.32-.09-1.14.42-2.28 1.23-3.12.9-.96 2.25-1.62 3.24-1.65.03.15.03.3.03.42ZM21.75 18.42c-.48 1.14-1.05 2.22-1.8 3.24-.96 1.35-2.13 3.03-3.69 3.06-1.38.03-1.77-.87-3.6-.87-1.83 0-2.28.84-3.66.9-1.56.06-2.73-1.47-3.72-2.82-2.01-2.76-3.57-7.8-1.5-11.22 1.02-1.65 2.85-2.7 4.83-2.73 1.5-.03 2.91 1.02 3.6 1.02.66 0 2.34-1.26 3.96-1.08.67.03 2.55.27 3.75 2.1-.09.06-2.25 1.32-2.22 3.96.03 3.15 2.76 4.2 2.79 4.2Z"/></svg>',
	microsoft: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#F35325" d="M11.5 11.5H2V2h9.5z"/><path fill="#81BC06" d="M22 11.5h-9.5V2H22z"/><path fill="#05A6F0" d="M11.5 22H2v-9.5h9.5z"/><path fill="#FFBA08" d="M22 22h-9.5v-9.5H22z"/></svg>'
};
</script>
