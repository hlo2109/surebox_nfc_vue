<template>
	<div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex flex-col">
		<header class="border-b border-gray-100 bg-white/80 backdrop-blur-sm">
			<div
				class="max-w-4xl mx-auto px-6 lg:px-8 py-4 flex items-center justify-between gap-4"
			>
				<router-link to="/" class="flex items-center gap-3 group shrink-0">
					<img
						:src="logoUrl"
						alt="SureBox"
						class="h-9 w-auto"
						width="120"
						height="36"
					/>
				</router-link>
				<nav class="flex items-center gap-4 text-sm text-gray-600">
					<router-link to="/terms" class="hover:text-[#0D65AE] transition-colors">
						Términos
					</router-link>
					<router-link to="/privacy" class="hover:text-[#0D65AE] transition-colors">
						Privacidad
					</router-link>
					<router-link to="/login" class="hover:text-[#0D65AE] transition-colors">
						Acceder
					</router-link>
				</nav>
			</div>
		</header>

		<main class="flex-1 w-full max-w-4xl mx-auto px-6 py-10 lg:py-14">
			<router-view />
		</main>

		<footer class="border-t border-gray-100 py-8 mt-auto bg-white/60">
			<div class="max-w-4xl mx-auto px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
				<p>© {{ year }} SureBox</p>
				<div class="flex flex-wrap items-center justify-center gap-6">
					<router-link to="/terms" class="hover:text-gray-800">Términos y condiciones</router-link>
					<router-link to="/privacy" class="hover:text-gray-800">Política de privacidad</router-link>
					<router-link to="/help" class="hover:text-gray-800">Ayuda</router-link>
				</div>
			</div>
		</footer>
	</div>
</template>

<script setup>
import { computed } from 'vue';
import { publicAssetUrl } from '@/composables/usePublicAppUrl';

const year = new Date().getFullYear();
const logoUrl = computed(() => publicAssetUrl('/logo-surebox.svg'));
</script>
