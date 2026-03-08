<template>
	<div class="bg-gray-50 p-4 sm:p-6 lg:p-8">
		<div class="max-w-4xl mx-auto">
			<!-- Main Card -->
			<div
				class="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm mt-12"
			>
				<!-- Icon Section with Soft Gradient Background -->
				<div
					class="bg-gradient-to-br from-red-50 via-orange-50 to-red-50 p-12 sm:p-16 text-center relative overflow-hidden border-b border-red-100"
				>
					<!-- Decorative Background Pattern -->
					<div
						class="absolute inset-0 opacity-5"
						style="
							background-image: radial-gradient(
								circle at 2px 2px,
								#ef4444 1px,
								transparent 0
							);
							background-size: 32px 32px;
						"
					></div>

					<!-- Icon Container -->
					<div class="relative z-10">
						<div
							class="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-red-100 mb-6"
						>
							<svg
								class="w-10 h-10 sm:w-12 sm:h-12 text-red-500"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
								></path>
							</svg>
						</div>
						<h1
							class="text-3xl sm:text-4xl font-bold text-gray-900 mb-3"
						>
							Access Denied
						</h1>
						<p
							class="text-base sm:text-lg text-gray-600 max-w-xl mx-auto"
						>
							You don't have permission to access this resource
						</p>
					</div>
				</div>

				<!-- Content Section -->
				<div class="p-8 sm:p-12 space-y-6">
					<!-- Custom Message -->
					<div v-if="message" class="text-center">
						<div
							class="inline-block bg-amber-50 rounded-lg p-5 border border-amber-200 max-w-2xl"
						>
							<div class="flex items-start gap-3">
								<svg
									class="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path
										fill-rule="evenodd"
										d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
										clip-rule="evenodd"
									></path>
								</svg>
								<p class="text-sm text-gray-700 font-medium">
									{{ message }}
								</p>
							</div>
						</div>
					</div>

					<!-- User Info Card - Single Column -->
					<div
						v-if="user"
						class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200"
					>
						<div class="flex items-center gap-4">
							<div
								class="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0"
							>
								<svg
									class="w-6 h-6 text-blue-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
									></path>
								</svg>
							</div>
							<div class="flex-1">
								<p
									class="text-xs font-medium text-blue-900 uppercase tracking-wide mb-1"
								>
									Logged in as
								</p>
								<p
									class="text-base font-semibold text-gray-900"
								>
									{{ user.name || user.email }}
								</p>
							</div>
							<div v-if="userRole">
								<span
									class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-800 bg-blue-100 rounded-lg"
								>
									<svg
										class="w-3.5 h-3.5"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
										></path>
									</svg>
									{{ formatRole(userRole) }}
								</span>
							</div>
						</div>
					</div>

					<!-- Information Banner -->
					<div
						class="bg-blue-50 rounded-xl p-5 border border-blue-200"
					>
						<div class="flex items-start gap-3">
							<svg
								class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path
									fill-rule="evenodd"
									d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
									clip-rule="evenodd"
								></path>
							</svg>
							<div class="flex-1">
								<p
									class="text-sm font-semibold text-blue-900 mb-1"
								>
									About Permissions
								</p>
								<p class="text-sm text-blue-800">
									Access to features depends on your role.
									Contact your administrator to request
									additional permissions.
								</p>
							</div>
						</div>
					</div>

					<!-- Action Buttons -->
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
						<button
							@click="goHome"
							class="inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-semibold text-white bg-[#0D65AE] rounded-xl hover:bg-[#0a4f87] focus:ring-4 focus:ring-[#0D65AE]/30 transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
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
									d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
								></path>
							</svg>
							Go to Dashboard
						</button>
						<button
							@click="goBack"
							class="inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-semibold text-gray-700 bg-white rounded-xl hover:bg-gray-50 transition-all border-2 border-gray-300 hover:border-gray-400 focus:ring-4 focus:ring-gray-200 transform hover:-translate-y-0.5"
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
									d="M10 19l-7-7m0 0l7-7m-7 7h18"
								></path>
							</svg>
							Go Back
						</button>
					</div>

					<!-- Help Section -->
					<div class="pt-6 border-t border-gray-200">
						<p
							class="text-sm font-medium text-gray-700 mb-3 text-center"
						>
							Need assistance?
						</p>
						<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
							<a
								href="mailto:support@surebox.com"
								class="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 border border-gray-200 hover:border-[#0D65AE] transition-all"
							>
								<svg
									class="w-4 h-4 text-gray-500"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
									></path>
								</svg>
								Contact Support
							</a>
							<router-link
								to="/help"
								class="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 border border-gray-200 hover:border-[#0D65AE] transition-all"
							>
								<svg
									class="w-4 h-4 text-gray-500"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
									></path>
								</svg>
								Help Documentation
							</router-link>
						</div>
					</div>
				</div>
			</div>

			<!-- Footer Info -->
			<div class="mt-6 text-center">
				<p class="text-sm text-gray-500">
					If you believe this is an error, please contact your system
					administrator
				</p>
			</div>
		</div>
	</div>
</template>

<script setup>
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { usePermissions } from "@/composables/usePermissions";

const router = useRouter();
const route = useRoute();

const { user, formatRole } = usePermissions();

// Get message from route query or use default
const message = computed(() => route.query.message || null);

// Get user's primary role
const userRole = computed(() => {
	if (!user.value) return null;

	// Handle different role structures
	if (user.value.role) return user.value.role;
	if (user.value.roles && user.value.roles.length > 0) {
		const firstRole = user.value.roles[0];
		return typeof firstRole === "string" ? firstRole : firstRole.name;
	}

	return null;
});

const goBack = () => {
	// Try to go back in history, or go home if no history
	if (window.history.length > 1) {
		router.back();
	} else {
		goHome();
	}
};

const goHome = () => {
	router.push("/");
};
</script>

<style scoped>
/* Smooth transitions for interactive elements */
button,
a {
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Enhanced hover effects */
button:hover,
a:hover {
	transform: translateY(-2px);
}

button:active,
a:active {
	transform: translateY(0);
}

/* Focus styles for accessibility */
button:focus-visible,
a:focus-visible {
	outline: 3px solid #0d65ae;
	outline-offset: 3px;
}

/* Subtle animation for the main card */
@keyframes fadeInUp {
	from {
		opacity: 0;
		transform: translateY(20px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.bg-white {
	animation: fadeInUp 0.6s ease-out;
}
</style>
