<template>
	<!-- Page Header -->
	<div class="mb-12">
		<h1 class="text-4xl font-bold text-gray-900 mb-3 tracking-tight">
			Reset password
		</h1>
		<p class="text-gray-600 text-lg">
			We'll send you a link to reset your password
		</p>
	</div>

	<!-- Auth Container -->
	<div class="space-y-8">
		<!-- Success Message -->
		<div
			v-if="emailSent"
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
						Email sent successfully!
					</p>
					<p class="text-sm text-green-700">
						Check your inbox for instructions to reset your
						password. Don't forget to check your spam folder.
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

		<!-- Forgot Password Form -->
		<form @submit.prevent="handleForgotPassword" class="space-y-6">
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
					:disabled="loading || emailSent"
					required
					class="w-full px-4 py-3 text-gray-900 bg-white border-2 border-gray-200 rounded-xl focus:border-[#0D65AE] focus:outline-none transition-colors disabled:bg-gray-50 disabled:text-gray-500"
				/>
			</div>

			<!-- Submit Button -->
			<button
				type="submit"
				:disabled="loading || emailSent"
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
				<svg
					v-else-if="emailSent"
					class="w-5 h-5"
					fill="currentColor"
					viewBox="0 0 20 20"
				>
					<path
						fill-rule="evenodd"
						d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
						clip-rule="evenodd"
					/>
				</svg>
				<span>{{
					loading
						? "Sending..."
						: emailSent
							? "Email Sent"
							: "Send Reset Link"
				}}</span>
			</button>
		</form>

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
						<span class="font-semibold">Security tip:</span> For
						your security, we'll never confirm if an email is
						registered. If you don't receive an email, please check
						your spam folder.
					</p>
				</div>
			</div>
		</div>

		<!-- Footer Links -->
		<div class="text-center pt-4 space-y-4">
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

			<p class="text-sm text-gray-600">
				Don't have an account?
				<router-link
					to="/register"
					class="font-semibold text-[#0D65AE] hover:text-[#0a4f87] transition-colors ml-1"
				>
					Create account
				</router-link>
			</p>
		</div>
	</div>
</template>

<script setup>
import { ref } from "vue";
import { useToast } from "@/composables";
import { validateEmail } from "@/utils/validators";

const { showToast } = useToast();

const email = ref("");
const loading = ref(false);
const emailSent = ref(false);
const errorMessage = ref("");

async function handleForgotPassword() {
	errorMessage.value = "";

	const emailValidation = validateEmail(email.value);
	if (!emailValidation.valid) {
		errorMessage.value = emailValidation.error;
		return;
	}

	loading.value = true;

	try {
		// TODO: Replace with actual API call
		// const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
		// 	method: 'POST',
		// 	headers: { 'Content-Type': 'application/json' },
		// 	body: JSON.stringify({ email: email.value })
		// });

		await new Promise((resolve) => setTimeout(resolve, 1500));

		emailSent.value = true;
		showToast(
			"success",
			"Email Sent",
			"Check your inbox for password reset instructions",
		);
	} catch (error) {
		console.error("Forgot password error:", error);
		errorMessage.value =
			"An error occurred. Please try again later or contact support.";
		showToast(
			"error",
			"Error",
			"Failed to send reset email. Please try again.",
		);
	} finally {
		loading.value = false;
	}
}
</script>
