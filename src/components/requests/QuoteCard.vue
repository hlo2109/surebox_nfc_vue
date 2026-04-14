<template>
	<div
		class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all"
		:class="cardClass"
	>
		<!-- Header -->
		<div
			class="flex items-center justify-between px-5 py-4 border-b border-gray-100"
		>
			<div class="flex items-center gap-3">
				<!-- Status icon circle -->
				<div :class="statusIconClass">
					<svg
						class="w-4 h-4"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							v-if="quote.status === 'pending'"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
						<path
							v-else-if="quote.status === 'accepted'"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
						<path
							v-else
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
				</div>
				<div>
					<h4 class="font-semibold text-gray-900 text-base">
						Quote #{{ quote.id }}
					</h4>
					<p class="text-sm text-gray-500">{{ formattedDate }}</p>
				</div>
			</div>

			<!-- Status badge -->
			<span
				class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
				:class="statusBadgeClass"
			>
				{{ statusLabel }}
			</span>
		</div>

		<!-- Content -->
		<div class="px-5 py-4 space-y-4">
			<!-- Amount -->
			<div
				class="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg"
			>
				<div>
					<p class="text-sm text-gray-500">Quote Amount</p>
					<p class="text-2xl font-bold text-green-600">
						{{ formatCurrency(quote.amount) }}
					</p>
				</div>
				<svg
					class="w-10 h-10 text-gray-200"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
			</div>

			<!-- Estimated Duration -->
			<div class="flex items-start gap-3">
				<svg
					class="w-4 h-4 text-gray-400 mt-0.5 shrink-0"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
					/>
				</svg>
				<div class="flex-1">
					<p class="text-sm text-gray-500">Estimated Duration</p>
					<p class="font-medium text-gray-800">
						{{ quote.estimatedDays }}
						{{ quote.estimatedDays === 1 ? "day" : "days" }}
					</p>
				</div>
			</div>

			<!-- Notes -->
			<div v-if="quote.notes" class="flex items-start gap-3">
				<svg
					class="w-4 h-4 text-gray-400 mt-0.5 shrink-0"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
					/>
				</svg>
				<div class="flex-1">
					<p class="text-sm text-gray-500">Notes</p>
					<p class="text-gray-800">{{ quote.notes }}</p>
				</div>
			</div>

			<!-- Company Info -->
			<div
				v-if="quote.company"
				class="flex items-start gap-3 pt-3 border-t border-gray-100"
			>
				<svg
					class="w-4 h-4 text-gray-400 mt-0.5 shrink-0"
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
				<div class="flex-1">
					<p class="text-sm text-gray-500">Company</p>
					<p class="font-medium text-gray-800">
						{{ quote.company.name }}
					</p>
					<p v-if="quote.company.phone" class="text-sm text-gray-500">
						{{ quote.company.phone }}
					</p>
				</div>
			</div>

			<!-- Valid Until -->
			<div v-if="quote.validUntil" class="flex items-start gap-3">
				<svg
					class="w-4 h-4 text-gray-400 mt-0.5 shrink-0"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
				<div class="flex-1">
					<p class="text-sm text-gray-500">Valid Until</p>
					<p class="font-medium text-gray-800">
						{{ formatDate(quote.validUntil) }}
					</p>
				</div>
			</div>
		</div>

		<!-- Footer Actions -->
		<div
			v-if="showActions"
			class="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-100"
		>
			<template v-if="canAccept">
				<button
					class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-all"
					:disabled="loading"
					@click="handleAccept"
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
							d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					Accept Quote
				</button>
				<button
					class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-all"
					:disabled="loading"
					@click="handleReject"
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
							d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					Reject
				</button>
			</template>
			<button
				v-else
				class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
				@click="handleView"
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
						d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
					/>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
					/>
				</svg>
				View Details
			</button>
		</div>
	</div>
</template>

<script setup>
import { computed, ref } from "vue";
import { formatCurrency, formatDate, formatDateTime } from "@/utils/formatters";

const props = defineProps({
	quote: {
		type: Object,
		required: true,
	},
	showActions: {
		type: Boolean,
		default: true,
	},
});

const emit = defineEmits(["accept", "reject", "view"]);

const loading = ref(false);

// Status configuration
const statusConfig = {
	pending: {
		label: "Pending",
		iconClass:
			"bg-yellow-100 text-yellow-600 w-10 h-10 rounded-full flex items-center justify-center",
		badgeClass: "bg-yellow-100 text-yellow-800",
		canAccept: true,
		canReject: true,
	},
	accepted: {
		label: "Accepted",
		iconClass:
			"bg-green-100 text-green-600 w-10 h-10 rounded-full flex items-center justify-center",
		badgeClass: "bg-green-100 text-green-800",
		canAccept: false,
		canReject: false,
	},
	rejected: {
		label: "Rejected",
		iconClass:
			"bg-red-100 text-red-600 w-10 h-10 rounded-full flex items-center justify-center",
		badgeClass: "bg-red-100 text-red-800",
		canAccept: false,
		canReject: false,
	},
};

const currentStatus = computed(() => {
	return statusConfig[props.quote.status] || statusConfig.pending;
});

const statusLabel = computed(() => currentStatus.value.label);
const statusIconClass = computed(() => currentStatus.value.iconClass);
const statusBadgeClass = computed(() => currentStatus.value.badgeClass);
const canAccept = computed(
	() => currentStatus.value.canAccept && props.showActions,
);
const canReject = computed(
	() => currentStatus.value.canReject && props.showActions,
);

const cardClass = computed(() => {
	if (props.quote.status === "accepted") return "border-green-500 border-2";
	if (props.quote.status === "rejected") return "opacity-75";
	return "";
});

const formattedDate = computed(() => {
	return formatDateTime(props.quote.createdAt || props.quote.created_at);
});

const handleAccept = async () => {
	loading.value = true;
	emit("accept", props.quote);
	// Note: Parent should handle loading state reset
	setTimeout(() => {
		loading.value = false;
	}, 2000);
};

const handleReject = async () => {
	loading.value = true;
	emit("reject", props.quote);
	// Note: Parent should handle loading state reset
	setTimeout(() => {
		loading.value = false;
	}, 2000);
};

const handleView = () => {
	emit("view", props.quote);
};
</script>
