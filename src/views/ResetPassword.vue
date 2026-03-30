<template>
	<!-- Page Header -->
	<div class="mb-12">
		<h1 class="text-4xl font-bold text-gray-900 mb-3 tracking-tight">
			Set new password
		</h1>
		<p class="text-gray-600 text-lg">
			Choose a strong password for your account
		</p>
	</div>

	<!-- Auth Container -->
	<div class="space-y-8">
		<!-- Success Message -->
		<div
			v-if="passwordReset"
			class="p-4 bg-green-50 border-l-4 border-green-500 rounded-r-xl"
		>
			<div class="flex gap-3">
				<svg
					class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
					fill="currentColor"
					viewBox="0 0 20 20"
				>
					<path
						fill-rule="evenodd"
						d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
						clip-rule="evenodd"
					/>
				</svg>
				<div class="flex-1">
					<p class="text-sm text-green-800 font-medium mb-1">
						Password reset successful!
					</p>
					<p class="text-sm text-green-700">
						Your password has been updated. You can now sign in with
						your new password.
					</p>
				</div>
			</div>
		</div>

		<!-- Error Message -->
		<div
			v-if="errorMessage"
			class="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl"
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
					{{ errorMessage }}
				</p>
			</div>
		</div>

		<!-- Reset Password Form -->
		<form
			v-if="!passwordReset"
			@submit.prevent="handleResetPassword"
			class="space-y-6"
		>
			<!-- New Password Field -->
			<div class="space-y-2">
				<label
					for="password"
					class="block text-sm font-semibold text-gray-900"
				>
					New Password
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

			<!-- Password Strength Indicator -->
			<div v-if="password" class="space-y-3">
				<div class="flex items-center justify-between">
					<span class="text-sm font-medium text-gray-700"
						>Password strength</span
					>
					<span
						:class="{
							'text-red-600': passwordStrength === 'weak',
							'text-orange-600': passwordStrength === 'medium',
							'text-green-600': passwordStrength === 'strong',
						}"
						class="text-sm font-semibold capitalize"
					>
						{{ passwordStrength }}
					</span>
				</div>
				<div class="h-2 bg-gray-100 rounded-full overflow-hidden">
					<div
						:class="{
							'bg-red-500 w-1/3': passwordStrength === 'weak',
							'bg-orange-500 w-2/3':
								passwordStrength === 'medium',
							'bg-green-500 w-full':
								passwordStrength === 'strong',
						}"
						class="h-full transition-all duration-300 rounded-full"
					></div>
				</div>
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
				<span>{{ loading ? "Resetting..." : "Reset Password" }}</span>
			</button>
		</form>

		<!-- Success State - Go to Login -->
		<div v-else>
			<router-link
				to="/login"
				class="w-full py-4 bg-[#0D65AE] hover:bg-[#0a4f87] text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-3"
			>
				<svg
					class="w-5 h-5"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
					/>
				</svg>
				<span>Go to Sign In</span>
			</router-link>
		</div>

		<!-- Info Box -->
		<div class="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-xl">
			<div class="flex gap-3">
				<svg
					class="w-5 h-5 text-blue-500 flex-shrink-0"
					fill="currentColor"
					viewBox="0 0 20 20"
				>
					<path
						fill-rule="evenodd"
						d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
						clip-rule="evenodd"
					/>
				</svg>
				<div class="flex-1">
					<p class="text-sm text-blue-800">
						<span class="font-semibold">Security tip:</span> Choose
						a unique password that you don't use for other accounts.
						Consider using a password manager.
					</p>
				</div>
			</div>
		</div>

		<!-- Footer Links -->
		<div class="text-center pt-4">
			<router-link
				to="/login"
				class="inline-flex items-center gap-2 text-sm font-semibold text-[#0D65AE] hover:text-[#0a4f87] transition-colors"
			>
				<svg
					class="w-4 h-4"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M15 19l-7-7 7-7"
					/>
				</svg>
				<span>Back to Sign In</span>
			</router-link>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useToast } from "@/composables";
import { validatePassword } from "@/utils/validators";

const router = useRouter();
const route = useRoute();
const { showToast } = useToast();

const password = ref("");
const confirmPassword = ref("");
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const loading = ref(false);
const passwordReset = ref(false);
const errorMessage = ref("");
const resetToken = ref("");

onMounted(() => {
	resetToken.value = route.query.token || "";
	if (!resetToken.value) {
		errorMessage.value =
			"Invalid or missing reset token. Please request a new password reset link.";
		showToast(
			"error",
			"Invalid Token",
			"Please request a new password reset link.",
		);
	}
});

const passwordStrength = computed(() => {
	if (!password.value) return "weak";

	let strength = 0;
	const checks = {
		length: password.value.length >= 8,
		uppercase: /[A-Z]/.test(password.value),
		lowercase: /[a-z]/.test(password.value),
		number: /[0-9]/.test(password.value),
		special: /[!@#$%^&*()]/.test(password.value),
	};

	strength = Object.values(checks).filter(Boolean).length;

	if (strength <= 2) return "weak";
	if (strength <= 4) return "medium";
	return "strong";
});

async function handleResetPassword() {
	errorMessage.value = "";

	if (!resetToken.value) {
		errorMessage.value =
			"Invalid or missing reset token. Please request a new password reset link.";
		return;
	}

	const passwordValidation = validatePassword(password.value);
	if (!passwordValidation.valid) {
		errorMessage.value = passwordValidation.error;
		showToast("error", "Validation Error", passwordValidation.error);
		return;
	}

	if (password.value !== confirmPassword.value) {
		errorMessage.value = "Passwords do not match";
		showToast("error", "Validation Error", "Passwords do not match");
		return;
	}

	loading.value = true;

	try {
		// TODO: Replace with actual API call
		// const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
		// 	method: 'POST',
		// 	headers: { 'Content-Type': 'application/json' },
		// 	body: JSON.stringify({
		// 		token: resetToken.value,
		// 		password: password.value
		// 	})
		// });

		await new Promise((resolve) => setTimeout(resolve, 1500));

		passwordReset.value = true;
		showToast(
			"success",
			"Password Reset Successful",
			"You can now sign in with your new password",
		);

		setTimeout(() => {
			router.push("/login");
		}, 2000);
	} catch (error) {
		console.error("Reset password error:", error);
		errorMessage.value =
			"An error occurred while resetting your password. Please try again or request a new reset link.";
		showToast(
			"error",
			"Error",
			"Failed to reset password. Please try again.",
		);
	} finally {
		loading.value = false;
	}
}
</script>
