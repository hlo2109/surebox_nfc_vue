<template>
	<div class="bg-surface-50 light:bg-surface-950 px-6 py-20 md:px-20 lg:px-80 min-h-screen">
		<div
			class="bg-surface-0 light:bg-surface-900 p-8 md:p-12 shadow-sm rounded-2xl w-full max-w-md mx-auto flex flex-col gap-8">
			<div class="flex flex-col items-center gap-4">
				<div class="flex items-center gap-4">
					<img src="/logo-surebox.svg" alt="Logo">
				</div>
				<div class="flex flex-col items-center gap-2 w-full">
					<div
						class="text-surface-900 light:text-surface-0 text-2xl font-semibold leading-tight text-center w-full">
						Welcome Back</div>
					<div class="text-center w-full">
						<span class="text-surface-700 light:text-surface-200 leading-normal">Don't have an
							account?</span>
						<router-link to="/register"
							class="text-primary font-medium ml-1 cursor-pointer hover:text-primary-emphasis">Sign
							Up</router-link>
					</div>
				</div>
			</div>
			<form @submit="handleLogin" class="flex flex-col gap-8">
				<div class="flex flex-col gap-6 w-full">
					<div class="flex flex-col gap-2 w-full">
						<label for="email1"
							class="text-surface-900 light:text-surface-0 font-medium leading-normal">Email
							Address</label>
						<InputText id="email1" type="text" v-model="email" placeholder="Email address"
							class="w-full px-3 py-2 shadow-sm rounded-lg" />
					</div>
					<div class="flex flex-col gap-2 w-full">
						<label for="password1"
							class="text-surface-900 light:text-surface-0 font-medium leading-normal">Password</label>

						<Password id="password1" v-model="password" placeholder="Password" :toggleMask="true"
							:feedback="false" input-class="w-full!" />
					</div>
					<div
						class="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-3 sm:gap-0">
						<div class="flex items-center gap-2">
							<Checkbox id="rememberme1" v-model="checked1" :binary="true" />
							<label for="rememberme1"
								class="text-surface-900 light:text-surface-0 leading-normal">Remember
								me</label>
						</div>
						<a class="text-primary font-medium cursor-pointer hover:text-primary-emphasis">Forgot your
							password?</a>
					</div>
				</div>
				<Button type="submit" label="Sign In" icon="pi pi-user"
					class="w-full py-2 rounded-lg flex justify-center items-center gap-2">
					<template #icon>
						<i class="pi pi-user text-base! leading-normal!" />
					</template>
				</Button>
			</form>
		</div>
	</div>
</template>
<script setup>
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';

import { ref } from 'vue';

const checked1 = ref(true);
import { useRouter } from 'vue-router';
import axios from 'axios';

const email = ref('');
const password = ref('');
const error = ref('');
const router = useRouter();

const API_BASE_URL = import.meta.env.VITE_API_URL;

async function handleLogin(e) {
	e.preventDefault();
	error.value = '';
	try {
		const res = await axios.post(`${API_BASE_URL}/login`, {
			email: email.value,
			password: password.value
		});
		localStorage.setItem('jwt', res.data.token);
		router.push('/');
	} catch (err) {
		error.value = err.response?.data?.message || err.message || 'Connection error';
	}
}
</script>
