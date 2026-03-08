<template>
	<div
		class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow"
	>
		<div class="flex items-center">
			<div class="flex-shrink-0">
				<div
					:class="[
						'w-12 h-12 rounded-lg flex items-center justify-center',
						iconBgClass,
					]"
				>
					<svg
						class="w-6 h-6"
						:class="iconColorClass"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							:d="iconPath"
						/>
					</svg>
				</div>
			</div>
			<div class="ml-4 flex-1">
				<p class="text-sm font-medium text-gray-600">{{ label }}</p>
				<p
					class="text-2xl font-semibold text-gray-900 flex items-baseline gap-2"
				>
					{{ value }}
					<span
						v-if="trend"
						:class="[
							'text-xs font-medium',
							trendUp ? 'text-green-600' : 'text-red-600',
						]"
					>
						<svg
							v-if="trendUp"
							class="w-3 h-3 inline"
							fill="currentColor"
							viewBox="0 0 20 20"
						>
							<path
								fill-rule="evenodd"
								d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
								clip-rule="evenodd"
							/>
						</svg>
						<svg
							v-else
							class="w-3 h-3 inline"
							fill="currentColor"
							viewBox="0 0 20 20"
						>
							<path
								fill-rule="evenodd"
								d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
								clip-rule="evenodd"
							/>
						</svg>
						{{ trend }}
					</span>
				</p>
				<p v-if="subtitle" class="text-xs text-gray-500 mt-1">
					{{ subtitle }}
				</p>
			</div>
		</div>
	</div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
	label: {
		type: String,
		required: true,
	},
	value: {
		type: [String, Number],
		required: true,
	},
	subtitle: {
		type: String,
		default: "",
	},
	icon: {
		type: String,
		default: "default",
		validator: (value) =>
			["default", "services", "active", "categories", "price", "duration", "bookings", "revenue"].includes(
				value
			),
	},
	trend: {
		type: String,
		default: "",
	},
	trendUp: {
		type: Boolean,
		default: true,
	},
});

const iconPaths = {
	default: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
	services:
		"M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
	active: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
	categories:
		"M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z",
	price:
		"M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
	duration: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
	bookings:
		"M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
	revenue:
		"M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
};

const iconColors = {
	default: { bg: "bg-gray-100", color: "text-gray-600" },
	services: { bg: "bg-blue-100", color: "text-blue-600" },
	active: { bg: "bg-green-100", color: "text-green-600" },
	categories: { bg: "bg-purple-100", color: "text-purple-600" },
	price: { bg: "bg-orange-100", color: "text-orange-600" },
	duration: { bg: "bg-indigo-100", color: "text-indigo-600" },
	bookings: { bg: "bg-teal-100", color: "text-teal-600" },
	revenue: { bg: "bg-emerald-100", color: "text-emerald-600" },
};

const iconPath = computed(() => iconPaths[props.icon] || iconPaths.default);

const iconBgClass = computed(
	() => iconColors[props.icon]?.bg || iconColors.default.bg
);

const iconColorClass = computed(
	() => iconColors[props.icon]?.color || iconColors.default.color
);
</script>

<style scoped>
/* Additional styles if needed */
</style>
