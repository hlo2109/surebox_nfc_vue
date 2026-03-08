<script setup>
import { useRoute } from "vue-router";
import Toast from "primevue/toast";
import ConfirmDialog from "primevue/confirmdialog";

const route = useRoute();
</script>

<template>
	<!-- Styled Toast Notifications -->
	<Toast
		position="top-right"
		:pt="{
			root: { class: 'w-96 max-w-[calc(100vw-2rem)] space-y-3' },
			message: ({ props }) => ({
				class: [
					'rounded-lg border shadow-sm transition-all duration-300 mb-3',
					{
						'bg-teal-50 border-teal-300':
							props.message.severity === 'success',
						'bg-rose-50 border-rose-300':
							props.message.severity === 'error',
						'bg-orange-50 border-orange-300':
							props.message.severity === 'warn',
						'bg-sky-50 border-sky-300':
							props.message.severity === 'info',
					},
				],
			}),
			messageContent: 'flex items-start gap-3 p-4',
			messageIcon: ({ props }) => ({
				class: [
					'p-2 rounded-lg flex-shrink-0 flex items-center justify-center',
					{
						'bg-teal-600 border border-teal-600':
							props.message.severity === 'success',
						'bg-rose-600 border border-rose-600':
							props.message.severity === 'error',
						'bg-orange-500 border border-orange-500':
							props.message.severity === 'warn',
						'bg-sky-600 border border-sky-600':
							props.message.severity === 'info',
					},
				],
			}),
			icon: ({ props }) => ({
				class: 'hidden',
			}),
			messageText: 'flex-1 min-w-0 flex flex-col gap-0',
			summary: 'text-sm font-semibold text-gray-900 mb-1',
			detail: 'text-xs text-gray-600 mt-0.5',
			closeButton: ({ props }) => ({
				class: [
					'ml-2 w-5 h-5 flex items-center justify-center transition-colors rounded hover:bg-white/50',
					{
						'text-teal-600 hover:text-teal-700':
							props.message.severity === 'success',
						'text-rose-600 hover:text-rose-700':
							props.message.severity === 'error',
						'text-orange-600 hover:text-orange-700':
							props.message.severity === 'warn',
						'text-sky-600 hover:text-sky-700':
							props.message.severity === 'info',
					},
				],
			}),
			closeIcon: 'w-3.5 h-3.5',
		}"
	>
		<template #messageicon="slotProps">
			<!-- Success Icon with Background -->
			<div
				v-if="slotProps.class?.includes('teal')"
				class="bg-teal-600 border border-teal-600 p-1.5 rounded-lg flex items-center justify-center"
			>
				<svg
					class="w-4 h-4 text-white"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2.5"
						d="M5 13l4 4L19 7"
					></path>
				</svg>
			</div>
			<!-- Error Icon with Background -->
			<div
				v-else-if="slotProps.class?.includes('rose')"
				class="bg-rose-600 border border-rose-600 p-1.5 rounded-lg flex items-center justify-center"
			>
				<svg
					class="w-4 h-4 text-white"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2.5"
						d="M6 18L18 6M6 6l12 12"
					></path>
				</svg>
			</div>
			<!-- Warning Icon with Background -->
			<div
				v-else-if="slotProps.class?.includes('orange')"
				class="bg-orange-500 border border-orange-500 p-1.5 rounded-lg flex items-center justify-center"
			>
				<svg
					class="w-4 h-4 text-white"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
					></path>
				</svg>
			</div>
			<!-- Info Icon with Background -->
			<div
				v-else-if="slotProps.class?.includes('sky')"
				class="bg-sky-600 border border-sky-600 p-1.5 rounded-lg flex items-center justify-center"
			>
				<svg
					class="w-4 h-4 text-white"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					></path>
				</svg>
			</div>
			<!-- Fallback -->
			<span v-else class="text-white text-xs">?</span>
		</template>
	</Toast>
	<ConfirmDialog />
	<router-view />
</template>

<style scoped>
.logo {
	height: 6em;
	padding: 1.5em;
	will-change: filter;
	transition: filter 300ms;
}

.logo:hover {
	filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
	filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
