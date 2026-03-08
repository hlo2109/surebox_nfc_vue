<template>
	<div
		class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex flex-col"
	>
		<!-- Top Bar -->
		<header class="border-b border-gray-100">
			<div
				class="max-w-6xl mx-auto px-6 lg:px-8 py-4 flex items-center justify-between"
			>
				<!-- Logo -->
				<router-link to="/" class="flex items-center gap-3 group">
					<div class="relative">
						<svg
							class="h-8 w-auto transition-transform"
							viewBox="0 0 92 122"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M61.3333 0H92V30.5H61.3333V0ZM30.6667 0H61.3333V30.5H30.6667V0ZM0 30.5H30.6667V61H0V30.5ZM61.3333 61H92V91.5H61.3333V61ZM61.3333 91.5H92V122H61.3333V91.5ZM0 91.5H30.6667V122H0V91.5ZM0 0H30.6667V30.5H0V0ZM30.6667 91.5H61.3333V122H30.6667V91.5Z"
								fill="#0D65AE"
							/>
						</svg>
					</div>
				</router-link>

				<!-- Right Navigation -->
				<div class="hidden sm:flex items-center gap-2 text-sm">
					<span class="text-gray-600">{{ navigationHint }}</span>
					<router-link
						:to="navigationLink"
						class="px-4 py-2 text-[#0D65AE] font-medium hover:bg-[#0D65AE]/5 rounded-lg transition-colors"
					>
						{{ navigationText }}
					</router-link>
				</div>
			</div>
		</header>

		<!-- Main Content -->
		<main
			class="flex-1 flex items-center justify-center px-6 py-12 lg:py-16"
		>
			<div class="w-full max-w-md">
				<router-view />
			</div>
		</main>

		<!-- Footer -->
		<footer class="border-t border-gray-100 py-8">
			<div class="max-w-6xl mx-auto px-6 lg:px-8">
				<div
					class="flex flex-col sm:flex-row items-center justify-between gap-6"
				>
					<!-- Copyright -->
					<p class="text-sm text-gray-500">
						© {{ currentYear }} Surebox. All rights reserved.
					</p>

					<!-- Links -->
					<div class="flex items-center gap-8 text-sm">
						<a
							href="#"
							class="text-gray-600 hover:text-gray-900 transition-colors"
						>
							Privacy
						</a>
						<a
							href="#"
							class="text-gray-600 hover:text-gray-900 transition-colors"
						>
							Terms
						</a>
						<a
							href="#"
							class="text-gray-600 hover:text-gray-900 transition-colors"
						>
							Help
						</a>
					</div>
				</div>
			</div>
		</footer>
	</div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const currentYear = new Date().getFullYear();

const navigationHint = computed(() => {
	const path = route.path;
	if (path.includes("/login")) return "Don't have an account?";
	if (path.includes("/register")) return "Already have an account?";
	if (path.includes("/forgot-password")) return "Remember your password?";
	if (path.includes("/reset-password")) return "Back to";
	return "";
});

const navigationText = computed(() => {
	const path = route.path;
	if (path.includes("/login")) return "Sign up";
	if (path.includes("/register")) return "Sign in";
	if (path.includes("/forgot-password")) return "Sign in";
	if (path.includes("/reset-password")) return "Sign in";
	return "";
});

const navigationLink = computed(() => {
	const path = route.path;
	if (path.includes("/login")) return "/register";
	if (path.includes("/register")) return "/login";
	if (path.includes("/forgot-password")) return "/login";
	if (path.includes("/reset-password")) return "/login";
	return "/";
});
</script>
