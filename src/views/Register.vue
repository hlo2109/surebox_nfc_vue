<template>
	<!-- Page Header -->
	<div class="mb-12">
		<h1 class="text-4xl font-bold text-gray-900 mb-3 tracking-tight">
			Create account
		</h1>
		<p class="text-gray-600 text-lg">Get started with Surebox today</p>
		<div
			v-if="isInviteFlow"
			class="mt-4 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-900"
		>
			Estás creando la cuenta para aceptar una invitación a una empresa. El correo debe
			coincidir con el de la invitación.
		</div>
	</div>

	<!-- Auth Container -->
	<div class="space-y-8">
		<!-- Tab Switcher -->
		<div class="flex gap-1 p-1 bg-gray-100 rounded-xl">
			<router-link
				:to="{ path: '/login', query: authQuery }"
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

		<!-- Register Form -->
		<form @submit.prevent="handleRegister" class="space-y-6">
			<!-- Name Field -->
			<div class="space-y-2">
				<label
					for="name"
					class="block text-sm font-semibold text-gray-900"
				>
					Full Name
				</label>
				<input
					id="name"
					type="text"
					v-model="name"
					placeholder="John Doe"
					:disabled="loading"
					required
					class="w-full px-4 py-3 text-gray-900 bg-white border-2 border-gray-200 rounded-xl focus:border-[#0D65AE] focus:outline-none transition-colors disabled:bg-gray-50 disabled:text-gray-500"
				/>
			</div>

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
					placeholder="name@company.com"
					:disabled="loading"
					:readonly="isInviteFlow"
					required
					:class="[
						'w-full px-4 py-3 text-gray-900 border-2 border-gray-200 rounded-xl focus:border-[#0D65AE] focus:outline-none transition-colors disabled:bg-gray-50 disabled:text-gray-500',
						isInviteFlow ? 'bg-gray-50 cursor-not-allowed' : 'bg-white',
					]"
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
						placeholder="Create a strong password"
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
				<p class="text-xs text-gray-500 mt-2">
					At least 8 characters with uppercase, lowercase, number, and
					special character
				</p>
			</div>

			<!-- Confirm Password Field -->
			<div class="space-y-2">
				<label
					for="confirmPassword"
					class="block text-sm font-semibold text-gray-900"
				>
					Confirm Password
				</label>
				<div class="relative">
					<input
						id="confirmPassword"
						:type="showConfirmPassword ? 'text' : 'password'"
						v-model="confirmPassword"
						placeholder="Re-enter your password"
						:disabled="loading"
						required
						class="w-full px-4 py-3 pr-12 text-gray-900 bg-white border-2 border-gray-200 rounded-xl focus:border-[#0D65AE] focus:outline-none transition-colors disabled:bg-gray-50 disabled:text-gray-500"
					/>
					<button
						type="button"
						@click="showConfirmPassword = !showConfirmPassword"
						class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
					>
						<svg
							v-if="!showConfirmPassword"
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

			<!-- Company Registration Toggle (hidden during company invite) -->
			<div v-if="!isInviteFlow" class="pt-2">
				<label class="flex items-center gap-3 cursor-pointer group">
					<Checkbox
						v-model="registerWithCompany"
						:binary="true"
						inputId="registerWithCompany"
						class="[&_.p-checkbox-box]:w-5 [&_.p-checkbox-box]:h-5 [&_.p-checkbox-box]:rounded-lg [&_.p-checkbox-box]:border-2 [&_.p-checkbox-box]:border-gray-300 [&_.p-checkbox-box]:transition-all [&_.p-checkbox-box:hover]:border-[#0D65AE] [&_.p-checkbox-box.p-checked]:bg-[#0D65AE] [&_.p-checkbox-box.p-checked]:border-[#0D65AE] [&_.p-checkbox-icon]:text-white [&_.p-checkbox-icon]:text-xs [&_.p-checkbox-icon]:w-3 [&_.p-checkbox-icon]:h-3"
					/>
					<span
						class="text-sm font-medium text-gray-700 group-hover:text-gray-900 select-none"
					>
						I'm registering for my company
					</span>
				</label>
			</div>

			<!-- Company Fields (Conditional) -->
			<div
				v-if="registerWithCompany"
				class="space-y-6 pt-6 border-t-2 border-gray-100"
			>
				<div class="flex items-center gap-2 mb-2">
					<svg
						class="w-5 h-5 text-[#0D65AE]"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
						/>
					</svg>
					<h3 class="text-sm font-semibold text-gray-900">
						Company Information
					</h3>
				</div>

				<!-- Company Name -->
				<div class="space-y-2">
					<label
						for="companyName"
						class="block text-sm font-semibold text-gray-900"
					>
						Company Name
					</label>
					<input
						id="companyName"
						type="text"
						v-model="companyName"
						placeholder="Acme Corporation"
						:disabled="loading"
						:required="registerWithCompany"
						class="w-full px-4 py-3 text-gray-900 bg-white border-2 border-gray-200 rounded-xl focus:border-[#0D65AE] focus:outline-none transition-colors disabled:bg-gray-50 disabled:text-gray-500"
					/>
				</div>

				<!-- Company Email -->
				<div class="space-y-2">
					<label
						for="companyEmail"
						class="block text-sm font-semibold text-gray-900"
					>
						Company Email
					</label>
					<input
						id="companyEmail"
						type="email"
						v-model="companyEmail"
						placeholder="contact@company.com"
						:disabled="loading"
						:required="registerWithCompany"
						class="w-full px-4 py-3 text-gray-900 bg-white border-2 border-gray-200 rounded-xl focus:border-[#0D65AE] focus:outline-none transition-colors disabled:bg-gray-50 disabled:text-gray-500"
					/>
				</div>

				<!-- Company Phone -->
				<div class="space-y-2">
					<label
						for="companyPhone"
						class="block text-sm font-semibold text-gray-900"
					>
						Company Phone
						<span class="text-gray-400 font-normal"
							>(Optional)</span
						>
					</label>
					<input
						id="companyPhone"
						type="tel"
						v-model="companyPhone"
						placeholder="+1 (555) 123-4567"
						:disabled="loading"
						class="w-full px-4 py-3 text-gray-900 bg-white border-2 border-gray-200 rounded-xl focus:border-[#0D65AE] focus:outline-none transition-colors disabled:bg-gray-50 disabled:text-gray-500"
					/>
				</div>
			</div>

			<!-- Submit Button -->
			<button
				type="submit"
				:disabled="loading"
				class="w-full py-4 bg-[#0D65AE] hover:bg-[#0a4f87] text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 mt-8"
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
				<span>{{
					loading ? "Creating account..." : "Create Account"
				}}</span>
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
				Already have an account?
				<router-link
					:to="{ path: '/login', query: authQuery }"
					class="font-semibold text-[#0D65AE] hover:text-[#0a4f87] transition-colors ml-1"
				>
					Sign in
				</router-link>
			</p>
		</div>
	</div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuth, useToast } from "@/composables";
import { useAuthStore } from "@/stores/auth.store";
import { validateEmail, validatePassword } from "@/utils/validators";
import { canManageCompanyWorkspace } from "@/utils/companyContext";
import { acceptInvitation } from "@/api/auth.api";
import Checkbox from "primevue/checkbox";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const { register, login, getCurrentUser } = useAuth();
const { showToast } = useToast();
const loading = computed(() => authStore.state.isLoading);

const isInviteFlow = computed(
	() =>
		typeof route.query.inviteToken === "string" &&
		!!String(route.query.inviteToken).trim(),
);

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

const name = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const registerWithCompany = ref(false);
const companyName = ref("");
const companyEmail = ref("");
const companyPhone = ref("");

watch(
	isInviteFlow,
	(inv) => {
		if (inv) {
			registerWithCompany.value = false;
		}
	},
	{ immediate: true },
);

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

const isLoginRoute = computed(() => false);

async function handleRegister() {
	if (!name.value.trim()) {
		showToast("error", "Validation Error", "Name is required");
		return;
	}

	const emailValidation = validateEmail(email.value);
	if (!emailValidation.valid) {
		showToast("error", "Validation Error", emailValidation.error);
		return;
	}

	const passwordValidation = validatePassword(password.value);
	if (!passwordValidation.valid) {
		showToast("error", "Validation Error", passwordValidation.error);
		return;
	}

	if (password.value !== confirmPassword.value) {
		showToast("error", "Validation Error", "Passwords do not match");
		return;
	}

	if (registerWithCompany.value) {
		if (!companyName.value.trim()) {
			showToast("error", "Validation Error", "Company name is required");
			return;
		}
		if (!companyEmail.value.trim()) {
			showToast("error", "Validation Error", "Company email is required");
			return;
		}
		const companyEmailValidation = validateEmail(companyEmail.value);
		if (!companyEmailValidation.valid) {
			showToast(
				"error",
				"Validation Error",
				"Invalid company email: " + companyEmailValidation.error,
			);
			return;
		}
	}

	const registrationData = {
		name: name.value,
		email: email.value,
		password: password.value,
	};

	if (registerWithCompany.value) {
		registrationData.company = {
			name: companyName.value,
			email: companyEmail.value,
			phone: companyPhone.value || undefined,
		};
	}

	const registrationResult = await register(registrationData);

	if (!registrationResult?.success) {
		return;
	}

	const tok =
		typeof route.query.inviteToken === "string"
			? route.query.inviteToken.trim()
			: "";

	if (tok) {
		const loginRes = await login({
			email: email.value,
			password: password.value,
		});
		if (loginRes?.success) {
			try {
				await acceptInvitation(tok, {});
				await getCurrentUser().catch(() => {});
				showToast(
					"success",
					"Listo",
					"Cuenta creada y unido a la empresa.",
				);
			} catch (accErr) {
				const m = accErr?.message || "";
				if (!m.toLowerCase().includes("already a member")) {
					showToast(
						"warn",
						"Invitación",
						m || "No se pudo aplicar la invitación. Prueba desde el enlace o contacta al administrador.",
					);
				}
			}
			const u = authStore.state.user;
			router.replace(canManageCompanyWorkspace(u) ? "/my-company" : "/");
			return;
		}
		showToast(
			"success",
			"Cuenta creada",
			"Inicia sesión para completar la invitación.",
		);
		router.replace({
			path: "/login",
			query: {
				inviteToken: tok,
				email: encodeURIComponent(email.value),
			},
		});
		return;
	}

	showToast(
		"success",
		"Registration Successful",
		"Your account has been created. Redirecting to login...",
	);

	setTimeout(() => {
		router.push("/login");
	}, 1500);
}

function continueWith(provider) {
	console.log(`Continue with ${provider}`);
}

const icons = {
	google: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M23.04 12.261c0-.815-.073-1.597-.209-2.348H12v4.44h6.205a5.305 5.305 0 0 1-2.302 3.478v2.887h3.726c2.18-2.007 3.41-4.965 3.41-8.457Z" fill="#4285F4"/><path d="M12 24c3.24 0 5.957-1.073 7.943-2.922l-3.726-2.887c-1.036.694-2.36 1.107-4.217 1.107-3.24 0-5.985-2.187-6.966-5.126H1.199v3.04A11.997 11.997 0 0 0 12 24Z" fill="#34A853"/><path d="M5.034 14.172A7.197 7.197 0 0 1 4.66 12c0-.752.13-1.48.359-2.172V6.788H1.199A11.997 11.997 0 0 0 0 12c0 1.918.46 3.729 1.199 5.212l3.835-3.04Z" fill="#FBBC05"/><path d="M12 4.749c1.76 0 3.337.606 4.584 1.796l3.438-3.438C17.957 1.2 15.24 0 12 0 7.32 0 3.285 2.69 1.199 6.788l3.82 3.04C6 6.936 8.76 4.75 12 4.75Z" fill="#EA4335"/></svg>',
	apple: '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M16.365 1.43c0 1.14-.45 2.22-1.26 3.03-.9.9-2.07 1.41-3.21 1.32-.09-1.14.42-2.28 1.23-3.12.9-.96 2.25-1.62 3.24-1.65.03.15.03.3.03.42ZM21.75 18.42c-.48 1.14-1.05 2.22-1.8 3.24-.96 1.35-2.13 3.03-3.69 3.06-1.38.03-1.77-.87-3.6-.87-1.83 0-2.28.84-3.66.9-1.56.06-2.73-1.47-3.72-2.82-2.01-2.76-3.57-7.8-1.5-11.22 1.02-1.65 2.85-2.7 4.83-2.73 1.5-.03 2.91 1.02 3.6 1.02.66 0 2.34-1.26 3.96-1.08.67.03 2.55.27 3.75 2.1-.09.06-2.25 1.32-2.22 3.96.03 3.15 2.76 4.2 2.79 4.2Z"/></svg>',
	microsoft:
		'<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#F35325" d="M11.5 11.5H2V2h9.5z"/><path fill="#81BC06" d="M22 11.5h-9.5V2H22z"/><path fill="#05A6F0" d="M11.5 22H2v-9.5h9.5z"/><path fill="#FFBA08" d="M22 22h-9.5v-9.5H22z"/></svg>',
};
</script>
