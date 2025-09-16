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
						Create an Account</div>
					<div class="text-center w-full">
						<span class="text-surface-700 light:text-surface-200 leading-normal">Already have an
							account?</span>
						<router-link to="/login"
							class="text-primary font-medium ml-1 cursor-pointer hover:text-primary-emphasis">Login</router-link>
					</div>
				</div>
			</div>
			<form @submit="handleRegister" class="flex flex-col gap-8">
				<div class="flex flex-col gap-6 w-full">
					<div class="flex flex-col gap-2 w-full">
						<label for="name1"
							class="text-surface-900 light:text-surface-0 font-medium leading-normal">Name</label>
						<InputText id="name1" v-model="name" type="text" placeholder="Name"
							class="w-full px-3 py-2 shadow-sm rounded-lg" />
					</div>
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
					<div class="flex flex-col gap-2 w-full">
						<label for="password2"
							class="text-surface-900 light:text-surface-0 font-medium leading-normal">Confirm
							Password</label>

						<Password id="password2" v-model="confirmPassword" placeholder="Password" :toggleMask="true"
							:feedback="false" input-class="w-full!" />
					</div>
				</div>
				<Button type="submit" label="Sign Up" icon="pi pi-user"
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
import { useRouter } from 'vue-router';
import axios from 'axios';

const name = ref('');
const address = ref('');
const geolocation = ref('');
const phone = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const error = ref('');
const router = useRouter();

const API_BASE_URL = import.meta.env.VITE_API_URL;

async function handleRegister(e) {
	e.preventDefault();
	error.value = '';
	if (password.value.length < 6) {
		error.value = 'Password must be at least 6 characters long';
		return;
	}
	if (password.value !== confirmPassword.value) {
		error.value = 'Passwords do not match';
		return;
	}

	try {
		const res = await axios.post(`${API_BASE_URL}/register`, {
			name: name.value,
			email: email.value,
			password: password.value
		});
		// localStorage.setItem('jwt', res.data.token);
		router.push('/login');
	} catch (err) {
		error.value = err.response?.data?.message || err.message || 'Connection error';
	}
}
</script>
