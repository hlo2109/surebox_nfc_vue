<template>
	<div
		class="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer p-5"
		@click="handleClick"
	>
		<!-- Header: status icon + service name + date + badge -->
		<div class="flex items-start justify-between gap-3 mb-4">
			<div class="flex items-center gap-3 min-w-0">
				<!-- Status icon circle -->
				<div :class="statusIconClass" class="shrink-0">
					<!-- pending: clock -->
					<svg
						v-if="request.status === 'pending'"
						class="w-4 h-4"
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
					<!-- quoted: document -->
					<svg
						v-else-if="request.status === 'quoted'"
						class="w-4 h-4"
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
					<!-- accepted / completed: check-circle -->
					<svg
						v-else-if="
							request.status === 'accepted' ||
							request.status === 'completed'
						"
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
					<!-- in_progress: spinner/refresh -->
					<svg
						v-else-if="request.status === 'in_progress'"
						class="w-4 h-4"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
						/>
					</svg>
					<!-- cancelled / rejected: x-circle -->
					<svg
						v-else
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
				</div>

				<div class="min-w-0">
					<h3 class="font-semibold text-gray-900 text-base truncate">
						{{ request.service?.name || "Service Request" }}
					</h3>
					<p class="text-sm text-gray-500">{{ formattedDate }}</p>
				</div>
			</div>

			<!-- Status badge -->
			<span
				class="inline-flex items-center shrink-0 px-2.5 py-0.5 rounded-full text-xs font-medium"
				:class="statusBadgeClass"
			>
				{{ statusLabel }}
			</span>
		</div>

		<!-- Body -->
		<div class="space-y-3">
			<!-- Location -->
			<div class="flex items-start gap-2">
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
						d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
					/>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
					/>
				</svg>
				<div class="flex-1 min-w-0">
					<p class="text-xs text-gray-500">Location</p>
					<p class="text-sm font-medium text-gray-800 truncate">
						{{ request.location || "Not specified" }}
					</p>
				</div>
			</div>

			<!-- Description -->
			<div v-if="request.description" class="flex items-start gap-2">
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
				<div class="flex-1 min-w-0">
					<p class="text-xs text-gray-500">Description</p>
					<p class="text-sm text-gray-800 line-clamp-2">
						{{ request.description }}
					</p>
				</div>
			</div>

			<!-- Budget -->
			<div v-if="request.budget" class="flex items-start gap-2">
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
						d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
				<div class="flex-1 min-w-0">
					<p class="text-xs text-gray-500">Budget</p>
					<p class="text-sm font-medium text-green-600">
						{{ formatCurrency(request.budget) }}
					</p>
				</div>
			</div>

			<!-- Preferred Date -->
			<div v-if="request.preferredDate" class="flex items-start gap-2">
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
				<div class="flex-1 min-w-0">
					<p class="text-xs text-gray-500">Preferred Date</p>
					<p class="text-sm font-medium text-gray-800">
						{{ formatDate(request.preferredDate) }}
					</p>
				</div>
			</div>

			<!-- Quotes count -->
			<div
				v-if="request.quotes && request.quotes.length > 0"
				class="flex items-center gap-2 pt-2 border-t border-gray-100"
			>
				<svg
					class="w-4 h-4 text-blue-500 shrink-0"
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
				<span class="text-sm font-medium text-blue-600">
					{{ request.quotes.length }}
					{{
						request.quotes.length === 1 ? "Quote" : "Quotes"
					}}
					received
				</span>
			</div>

			<!-- Assigned employee -->
			<div
				v-if="request.assignment?.employee"
				class="flex items-center gap-2 pt-2 border-t border-gray-100"
			>
				<svg
					class="w-4 h-4 text-purple-500 shrink-0"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
					/>
				</svg>
				<span class="text-sm font-medium text-purple-600">
					Assigned to {{ request.assignment.employee.name }}
				</span>
			</div>
		</div>

		<!-- Footer: company name + action button -->
		<div
			class="flex items-center justify-between mt-4 pt-4 border-t border-gray-100"
		>
			<div class="flex items-center gap-2 text-sm text-gray-500 min-w-0">
				<svg
					class="w-4 h-4 shrink-0"
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
				<span class="truncate">
					{{ request.service?.company?.name || "Company" }}
				</span>
			</div>

			<button
				class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all shrink-0 ml-3"
				@click.stop="handleAction"
			>
				View Details
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
						d="M9 5l7 7-7 7"
					/>
				</svg>
			</button>
		</div>
	</div>
</template>

<script setup>
import { computed } from "vue";
import { formatCurrency, formatDate, formatDateTime } from "@/utils/formatters";

const props = defineProps({
	request: {
		type: Object,
		required: true,
	},
});

const emit = defineEmits(["click", "action"]);

// Status configuration
const statusConfig = {
	pending: {
		label: "Pending",
		iconClass:
			"bg-yellow-100 text-yellow-600 w-10 h-10 rounded-full flex items-center justify-center",
		badgeClass: "bg-yellow-100 text-yellow-800",
	},
	quoted: {
		label: "Quoted",
		iconClass:
			"bg-blue-100 text-blue-600 w-10 h-10 rounded-full flex items-center justify-center",
		badgeClass: "bg-blue-100 text-blue-800",
	},
	accepted: {
		label: "Accepted",
		iconClass:
			"bg-green-100 text-green-600 w-10 h-10 rounded-full flex items-center justify-center",
		badgeClass: "bg-green-100 text-green-800",
	},
	in_progress: {
		label: "In Progress",
		iconClass:
			"bg-purple-100 text-purple-600 w-10 h-10 rounded-full flex items-center justify-center",
		badgeClass: "bg-purple-100 text-purple-800",
	},
	completed: {
		label: "Completed",
		iconClass:
			"bg-green-100 text-green-600 w-10 h-10 rounded-full flex items-center justify-center",
		badgeClass: "bg-green-100 text-green-800",
	},
	cancelled: {
		label: "Cancelled",
		iconClass:
			"bg-red-100 text-red-600 w-10 h-10 rounded-full flex items-center justify-center",
		badgeClass: "bg-red-100 text-red-800",
	},
	rejected: {
		label: "Rejected",
		iconClass:
			"bg-red-100 text-red-600 w-10 h-10 rounded-full flex items-center justify-center",
		badgeClass: "bg-red-100 text-red-800",
	},
};

const currentStatus = computed(() => {
	return statusConfig[props.request.status] || statusConfig.pending;
});

const statusLabel = computed(() => currentStatus.value.label);
const statusIconClass = computed(() => currentStatus.value.iconClass);
const statusBadgeClass = computed(() => currentStatus.value.badgeClass);

const formattedDate = computed(() => {
	return formatDateTime(props.request.createdAt || props.request.created_at);
});

const handleClick = () => {
	emit("click", props.request);
};

const handleAction = () => {
	emit("action", props.request);
};
</script>
