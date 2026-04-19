<template>
	<!-- Page Header -->
	<div class="mb-12">
		<h1 class="text-4xl font-bold text-gray-900 mb-3 tracking-tight">
			Welcome back
		</h1>
		<p class="text-gray-600 text-lg">Sign in to access your dashboard</p>
	</div>

	<!-- Auth Container -->
	<div class="space-y-8">
		<!-- Tab Switcher -->
		<div class="flex gap-1 p-1 bg-gray-100 rounded-xl">
			<router-link
				to="/login"
				class="flex-1 text-center py-3 px-4 rounded-lg font-medium transition-all"
				:class="
					isLoginRoute
						? 'bg-white text-gray-900'
						: 'text-gray-600 hover:text-gray-900'
				"
			>
				Sign In
			</router-link>
			<router-link
				:to="{ path: '/register', query: authQuery }"
				class="flex-1 text-center py-3 px-4 rounded-lg font-medium transition-all"
				:class="
					!isLoginRoute
						? 'bg-white text-gray-900'
						: 'text-gray-600 hover:text-gray-900'
				"
			>
				Sign Up
			</router-link>
		</div>

		<!-- Error Message -->
		<div
			v-if="loginError"
			class="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg"
		>
			<div class="flex gap-3">
				<svg
					class="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"
					fill="currentColor"
					viewBox="0 0 20 20"
				>
					<path
						fill-rule="evenodd"
						d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
						clip-rule="evenodd"
					/>
				</svg>
				<p class="text-sm text-red-800 font-medium">
					{{ loginError }}
				</p>
			</div>
		</div>

		<!-- Login Form -->
		<form @submit.prevent="handleLogin" class="space-y-6">
			<!-- Email Field -->
			<div class="space-y-2">
				<label
					for="email"
					class="block text-sm font-semibold text-gray-900"
				>
					Email
				</label>
				<input
					id="email"
					type="email"
					v-model="email"
					autocomplete="username"
					placeholder="name@company.com"
					:disabled="loading"
					required
					class="w-full px-4 py-3 text-gray-900 bg-white border-2 border-gray-200 rounded-xl focus:border-[#0D65AE] focus:outline-none transition-colors disabled:bg-gray-50 disabled:text-gray-500"
				/>
			</div>

			<!-- Password Field -->
			<div class="space-y-2">
				<label
					for="password"
					class="block text-sm font-semibold text-gray-900"
				>
					Password
				</label>
				<div class="relative">
					<input
						id="password"
						:type="showPassword ? 'text' : 'password'"
						v-model="password"
						autocomplete="current-password"
						placeholder="Enter your password"
						:disabled="loading"
						required
						class="w-full px-4 py-3 pr-12 text-gray-900 bg-white border-2 border-gray-200 rounded-xl focus:border-[#0D65AE] focus:outline-none transition-colors disabled:bg-gray-50 disabled:text-gray-500"
					/>
					<button
						type="button"
						@click="showPassword = !showPassword"
						class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
					>
						<svg
							v-if="!showPassword"
							class="w-5 h-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
							/>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
							/>
						</svg>
						<svg
							v-else
							class="w-5 h-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
							/>
						</svg>
					</button>
				</div>
			</div>

			<!-- Options Row -->
			<div class="flex items-center justify-between">
				<label class="flex items-center gap-3 cursor-pointer group">
					<Checkbox
						v-model="rememberMe"
						:binary="true"
						inputId="rememberMe"
						class="[&_.p-checkbox-box]:w-5 [&_.p-checkbox-box]:h-5 [&_.p-checkbox-box]:rounded-lg [&_.p-checkbox-box]:border-2 [&_.p-checkbox-box]:border-gray-300 [&_.p-checkbox-box]:transition-all [&_.p-checkbox-box:hover]:border-[#0D65AE] [&_.p-checkbox-box.p-checked]:bg-[#0D65AE] [&_.p-checkbox-box.p-checked]:border-[#0D65AE] [&_.p-checkbox-icon]:text-white [&_.p-checkbox-icon]:text-xs [&_.p-checkbox-icon]:w-3 [&_.p-checkbox-icon]:h-3"
					/>
					<span
						class="text-sm font-medium text-gray-700 group-hover:text-gray-900 select-none"
						>Remember me</span
					>
				</label>

				<button
					type="button"
					@click="goForgot"
					class="text-sm font-semibold text-[#0D65AE] hover:text-[#0a4f87] transition-colors"
				>
					Forgot password?
				</button>
			</div>

			<!-- Submit Button -->
			<button
				type="submit"
				:disabled="loading"
				class="w-full py-4 bg-[#0D65AE] hover:bg-[#0a4f87] text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
			>
				<svg
					v-if="loading"
					class="animate-spin w-5 h-5"
					fill="none"
					viewBox="0 0 24 24"
				>
					<circle
						class="opacity-25"
						cx="12"
						cy="12"
						r="10"
						stroke="currentColor"
						stroke-width="4"
					></circle>
					<path
						class="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					></path>
				</svg>
				<span>{{ loading ? "Signing in..." : "Sign In" }}</span>
			</button>
		</form>

		<!-- Divider -->
		<div class="relative">
			<div class="absolute inset-0 flex items-center">
				<div class="w-full border-t-2 border-gray-100"></div>
			</div>
			<div class="relative flex justify-center">
				<span
					class="px-4 bg-gradient-to-br from-gray-50 via-white to-gray-50 text-sm text-gray-500 font-medium"
					>Or continue with</span
				>
			</div>
		</div>

		<!-- Social Login -->
		<div class="grid grid-cols-3 gap-3">
			<button
				type="button"
				@click="continueWith('google')"
				class="py-3 px-4 bg-white border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center"
			>
				<span class="w-5 h-5" v-html="icons.google"></span>
			</button>
			<button
				type="button"
				@click="continueWith('apple')"
				class="py-3 px-4 bg-white border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center"
			>
				<span class="w-5 h-5" v-html="icons.apple"></span>
			</button>
			<button
				type="button"
				@click="continueWith('microsoft')"
				class="py-3 px-4 bg-white border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center"
			>
				<span class="w-5 h-5" v-html="icons.microsoft"></span>
			</button>
		</div>

		<!-- Footer Link -->
		<div class="text-center pt-4">
			<p class="text-sm text-gray-600">
				New to Surebox?
				<router-link
					:to="{ path: '/register', query: authQuery }"
					class="font-semibold text-[#0D65AE] hover:text-[#0a4f87] transition-colors ml-1"
				>
					Create an account
				</router-link>
			</p>
		</div>
	</div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuth, useToast } from "@/composables";
import { useAuthStore } from "@/stores/auth.store";
import {
	canManageCompanyWorkspace,
	userHasCompanyMembership,
} from "@/utils/companyContext";
import { acceptInvitation } from "@/api/auth.api";
import Checkbox from "primevue/checkbox";
const { showSuccess, showError, showWarning, showInfo, showToast } = useToast();

const route = useRoute();
const router = useRouter();
const { login, getCurrentUser, state: authState } = useAuth();
const authStore = useAuthStore();

/** Preserve invite token when switching to register */
const authQuery = computed(() => {
	const q = route.query;
	const out = {};
	if (typeof q.inviteToken === "string" && q.inviteToken) {
		out.inviteToken = q.inviteToken;
	}
	if (typeof q.email === "string" && q.email) {
		out.email = q.email;
	}
	return out;
});

const email = ref("");
const password = ref("");
const rememberMe = ref(true);
const showPassword = ref(false);
const loginError = ref("");

const loading = computed(() => authState.isLoading);
const isLoginRoute = computed(() => true);

onMounted(() => {
	const em = route.query.email;
	if (typeof em === "string" && em) {
		try {
			email.value = decodeURIComponent(em);
		} catch {
			email.value = em;
		}
	}
});

function goForgot() {
	router.push("/forgot-password");
}

async function handleLogin() {
	loginError.value = "";

	try {
		const result = await login({
			email: email.value,
			password: password.value,
		});

		if (result.success) {
			const inviteTok = route.query.inviteToken;
			if (typeof inviteTok === "string" && inviteTok.trim()) {
				try {
					await acceptInvitation(inviteTok.trim(), {});
					await getCurrentUser().catch(() => {});
					showSuccess("Te has unido a la empresa.");
				} catch (accErr) {
					const m = accErr?.message || "";
					if (m.toLowerCase().includes("already a member")) {
						showInfo("Ya formabas parte de esta empresa.");
					} else {
						showError(m || "No se pudo aplicar la invitación.");
					}
				}
				await getCurrentUser().catch(() => {});
				const u = authStore.state.user;
				router.replace(
					canManageCompanyWorkspace(u) ? "/my-company" : "/",
				);
				return;
			}

			const redirect = router.currentRoute.value.query.redirect;
			if (redirect) {
				router.push(redirect);
			} else {
				const user = authStore.state.user;
				if (canManageCompanyWorkspace(user)) {
					router.push("/my-company");
				} else if (userHasCompanyMembership(user)) {
					router.push("/");
				} else {
					router.push("/services");
				}
			}
		} else {
			loginError.value =
				result.error || "Login failed. Please check your credentials.";
		}
	} catch (error) {
		loginError.value =
			error.message || "An unexpected error occurred. Please try again.";
	}
}

function continueWith(provider) {
	//console.log(`Continue with ${provider}`);
	showInfo(
		`The "${provider}" login is not implemented yet.`,
		"Feature not implemented",
	);
}

const icons = {
	google: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M23.04 12.261c0-.815-.073-1.597-.209-2.348H12v4.44h6.205a5.305 5.305 0 0 1-2.302 3.478v2.887h3.726c2.18-2.007 3.41-4.965 3.41-8.457Z" fill="#4285F4"/><path d="M12 24c3.24 0 5.957-1.073 7.943-2.922l-3.726-2.887c-1.036.694-2.36 1.107-4.217 1.107-3.24 0-5.985-2.187-6.966-5.126H1.199v3.04A11.997 11.997 0 0 0 12 24Z" fill="#34A853"/><path d="M5.034 14.172A7.197 7.197 0 0 1 4.66 12c0-.752.13-1.48.359-2.172V6.788H1.199A11.997 11.997 0 0 0 0 12c0 1.918.46 3.729 1.199 5.212l3.835-3.04Z" fill="#FBBC05"/><path d="M12 4.749c1.76 0 3.337.606 4.584 1.796l3.438-3.438C17.957 1.2 15.24 0 12 0 7.32 0 3.285 2.69 1.199 6.788l3.82 3.04C6 6.936 8.76 4.75 12 4.75Z" fill="#EA4335"/></svg>',
	apple: '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M16.365 1.43c0 1.14-.45 2.22-1.26 3.03-.9.9-2.07 1.41-3.21 1.32-.09-1.14.42-2.28 1.23-3.12.9-.96 2.25-1.62 3.24-1.65.03.15.03.3.03.42ZM21.75 18.42c-.48 1.14-1.05 2.22-1.8 3.24-.96 1.35-2.13 3.03-3.69 3.06-1.38.03-1.77-.87-3.6-.87-1.83 0-2.28.84-3.66.9-1.56.06-2.73-1.47-3.72-2.82-2.01-2.76-3.57-7.8-1.5-11.22 1.02-1.65 2.85-2.7 4.83-2.73 1.5-.03 2.91 1.02 3.6 1.02.66 0 2.34-1.26 3.96-1.08.67.03 2.55.27 3.75 2.1-.09.06-2.25 1.32-2.22 3.96.03 3.15 2.76 4.2 2.79 4.2Z"/></svg>',
	microsoft:
		'<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#F35325" d="M11.5 11.5H2V2h9.5z"/><path fill="#81BC06" d="M22 11.5h-9.5V2H22z"/><path fill="#05A6F0" d="M11.5 22H2v-9.5h9.5z"/><path fill="#FFBA08" d="M22 22h-9.5v-9.5H22z"/></svg>',
};
</script>
