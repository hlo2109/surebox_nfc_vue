<template>
	<div class="bg-gray-50 p-4 sm:p-6 lg:p-8">
		<div class="max-w-7xl mx-auto">
			<!-- Header -->
			<div class="mb-6 sm:mb-8">
				<div
					class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
				>
					<div>
						<h1
							class="text-3xl sm:text-4xl font-bold text-gray-900 mb-1 sm:mb-2"
						>
							My Assignments
						</h1>
						<p
							class="text-sm sm:text-base text-gray-600 flex items-center gap-2"
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
									d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
								/>
							</svg>
							Track and manage all your assigned jobs
						</p>
					</div>
					<button
						@click="loadAssignments"
						:disabled="loading"
						class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-[#0D65AE] focus:ring-offset-2 disabled:opacity-50 transition-all"
					>
						<svg
							:class="['w-4 h-4', loading ? 'animate-spin' : '']"
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
						<span>Refresh</span>
					</button>
				</div>
			</div>

			<!-- Stats Cards -->
			<div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 sm:mb-8">
				<!-- Pendientes -->
				<div
					:class="[
						'bg-white rounded-xl border transition-all p-4 sm:p-5 cursor-pointer',
						activeFilter === 'pending'
							? 'border-yellow-400 ring-2 ring-yellow-200'
							: 'border-gray-200 hover:border-yellow-300',
					]"
					@click="setFilter('pending')"
				>
					<div class="flex items-center justify-between">
						<div class="flex-1">
							<p
								class="text-gray-500 text-xs sm:text-sm font-medium mb-1"
							>
								Pending
							</p>
							<h3
								class="text-2xl sm:text-3xl font-bold text-yellow-600"
							>
								{{ pendingAssignments.length }}
							</h3>
						</div>
						<div
							class="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center"
						>
							<svg
								class="w-5 h-5 text-yellow-500"
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
						</div>
					</div>
				</div>

				<!-- Aceptadas -->
				<div
					:class="[
						'bg-white rounded-xl border transition-all p-4 sm:p-5 cursor-pointer',
						activeFilter === 'accepted'
							? 'border-blue-400 ring-2 ring-blue-200'
							: 'border-gray-200 hover:border-blue-300',
					]"
					@click="setFilter('accepted')"
				>
					<div class="flex items-center justify-between">
						<div class="flex-1">
							<p
								class="text-gray-500 text-xs sm:text-sm font-medium mb-1"
							>
								Accepted
							</p>
							<h3
								class="text-2xl sm:text-3xl font-bold text-blue-600"
							>
								{{ acceptedAssignments.length }}
							</h3>
						</div>
						<div
							class="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center"
						>
							<svg
								class="w-5 h-5 text-blue-500"
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
						</div>
					</div>
				</div>

				<!-- En Progreso -->
				<div
					:class="[
						'bg-white rounded-xl border transition-all p-4 sm:p-5 cursor-pointer',
						activeFilter === 'in_progress'
							? 'border-teal-400 ring-2 ring-teal-200'
							: 'border-gray-200 hover:border-teal-300',
					]"
					@click="setFilter('in_progress')"
				>
					<div class="flex items-center justify-between">
						<div class="flex-1">
							<p
								class="text-gray-500 text-xs sm:text-sm font-medium mb-1"
							>
								In Progress
							</p>
							<h3
								class="text-2xl sm:text-3xl font-bold text-teal-600"
							>
								{{ inProgressAssignments.length }}
							</h3>
						</div>
						<div
							class="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center"
						>
							<svg
								class="w-5 h-5 text-teal-500"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M13 10V3L4 14h7v7l9-11h-7z"
								/>
							</svg>
						</div>
					</div>
				</div>

				<!-- Completadas -->
				<div
					:class="[
						'bg-white rounded-xl border transition-all p-4 sm:p-5 cursor-pointer',
						activeFilter === 'completed'
							? 'border-green-400 ring-2 ring-green-200'
							: 'border-gray-200 hover:border-green-300',
					]"
					@click="setFilter('completed')"
				>
					<div class="flex items-center justify-between">
						<div class="flex-1">
							<p
								class="text-gray-500 text-xs sm:text-sm font-medium mb-1"
							>
								Completed
							</p>
							<h3
								class="text-2xl sm:text-3xl font-bold text-green-600"
							>
								{{ completedAssignments.length }}
							</h3>
						</div>
						<div
							class="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center"
						>
							<svg
								class="w-5 h-5 text-green-500"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M5 13l4 4L19 7"
								/>
							</svg>
						</div>
					</div>
				</div>
			</div>

			<!-- Filter Tabs -->
			<div
				class="bg-white rounded-xl border border-gray-200 p-1 flex gap-1 mb-6 overflow-x-auto"
			>
				<button
					v-for="tab in filterTabs"
					:key="tab.value"
					@click="setFilter(tab.value)"
					:class="[
						'flex-shrink-0 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all',
						activeFilter === tab.value
							? 'bg-[#0D65AE] text-white shadow-sm'
							: 'text-gray-600 hover:bg-gray-100',
					]"
				>
					{{ tab.label }}
					<span
						v-if="tab.count !== null"
						:class="[
							'ml-1.5 px-1.5 py-0.5 rounded-full text-xs font-bold',
							activeFilter === tab.value
								? 'bg-white/25 text-white'
								: 'bg-gray-100 text-gray-600',
						]"
						>{{ tab.count }}</span
					>
				</button>
			</div>

			<!-- Loading State -->
			<div
				v-if="loading && assignments.length === 0"
				class="flex flex-col items-center justify-center py-20"
			>
				<svg
					class="w-10 h-10 text-[#0D65AE] animate-spin mb-4"
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
					/>
					<path
						class="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
					/>
				</svg>
				<p class="text-gray-500 text-sm">Loading assignments...</p>
			</div>

			<!-- Error State -->
			<div
				v-else-if="error && assignments.length === 0"
				class="bg-white rounded-xl border border-red-200 p-8 text-center"
			>
				<div
					class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
				>
					<svg
						class="w-6 h-6 text-red-500"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
				</div>
				<h3 class="text-lg font-semibold text-gray-900 mb-1">
					Failed to load
				</h3>
				<p class="text-gray-500 text-sm mb-4">{{ error }}</p>
				<button
					@click="loadAssignments"
					class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0D65AE] rounded-lg hover:bg-[#0D65AE]/90 transition-all"
				>
					Retry
				</button>
			</div>

			<!-- Empty State -->
			<div
				v-else-if="!loading && filteredAssignments.length === 0"
				class="bg-white rounded-xl border border-gray-200 p-10 sm:p-16 text-center"
			>
				<div
					class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
				>
					<svg
						class="w-8 h-8 text-gray-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1.5"
							d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
						/>
					</svg>
				</div>
				<h3 class="text-lg font-semibold text-gray-900 mb-1">
					{{
						activeFilter === "all"
							? "No assignments"
							: `No ${activeFilterLabel} assignments`
					}}
				</h3>
				<p class="text-gray-500 text-sm">
					{{
						activeFilter === "all"
							? "When the company assigns jobs to you, they will appear here."
							: "No assignments with this status."
					}}
				</p>
				<button
					v-if="activeFilter !== 'all'"
					@click="setFilter('all')"
					class="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#0D65AE] border border-[#0D65AE]/30 rounded-lg hover:bg-[#0D65AE]/5 transition-all"
				>
					View all
				</button>
			</div>

			<!-- Assignment Cards Grid -->
			<div
				v-else
				class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6"
			>
				<div
					v-for="assignment in filteredAssignments"
					:key="assignment.uuid || assignment.id"
					class="bg-white rounded-xl border border-gray-200 hover:border-[#0D65AE]/40 hover:shadow-md transition-all flex flex-col"
				>
					<!-- Card Header -->
					<div class="p-5 border-b border-gray-100">
						<div class="flex items-start justify-between gap-3">
							<div class="flex-1 min-w-0">
								<h3
									class="font-semibold text-gray-900 text-base leading-snug truncate"
								>
									{{ getServiceName(assignment) }}
								</h3>
								<p
									class="text-sm text-gray-500 mt-0.5 truncate"
								>
									{{ getCustomerName(assignment) }}
								</p>
							</div>
							<span
								:class="[
									'flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold',
									statusClasses[assignment.status] ||
										'bg-gray-100 text-gray-600',
								]"
							>
								{{
									statusLabels[assignment.status] ||
									assignment.status
								}}
							</span>
						</div>
					</div>

					<!-- Card Body -->
					<div class="p-5 flex-1 space-y-3">
						<!-- Location -->
						<div
							v-if="getLocation(assignment)"
							class="flex items-start gap-2 text-sm text-gray-600"
						>
							<svg
								class="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400"
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
							<span class="line-clamp-2">{{
								getLocation(assignment)
							}}</span>
						</div>

						<!-- Date -->
						<div
							v-if="
								assignment.assignedAt ||
								assignment.assigned_at ||
								assignment.createdAt
							"
							class="flex items-center gap-2 text-sm text-gray-600"
						>
							<svg
								class="w-4 h-4 flex-shrink-0 text-gray-400"
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
							<span>{{
								formatDate(
									assignment.assignedAt ||
										assignment.assigned_at ||
										assignment.createdAt,
								)
							}}</span>
						</div>

						<!-- Preferred date -->
						<div
							v-if="
								assignment.serviceRequest?.preferredDate ||
								assignment.serviceRequest?.preferred_date
							"
							class="flex items-center gap-2 text-sm text-gray-600"
						>
							<svg
								class="w-4 h-4 flex-shrink-0 text-gray-400"
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
							<span
								>Preferred:
								{{
									formatDate(
										assignment.serviceRequest
											.preferredDate ||
											assignment.serviceRequest
												.preferred_date,
									)
								}}</span
							>
						</div>

						<!-- NFC badge -->
						<div
							v-if="hasNfc(assignment)"
							class="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-purple-50 text-purple-700 text-xs font-medium"
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
									d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
								/>
							</svg>
							NFC required
						</div>
					</div>

					<!-- Card Footer -->
					<div class="px-5 pb-5">
						<!-- Action hint for pending -->
						<div
							v-if="
								assignment.status === 'pending' ||
								assignment.status === 'assigned'
							"
							class="flex items-center gap-1.5 mb-3 text-xs text-yellow-700 bg-yellow-50 rounded-lg px-3 py-2"
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
									d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							Awaiting your response
						</div>
						<!-- Action hint for in_progress -->
						<div
							v-if="assignment.status === 'in_progress'"
							class="flex items-center gap-1.5 mb-3 text-xs text-teal-700 bg-teal-50 rounded-lg px-3 py-2"
						>
							<span
								class="w-2 h-2 rounded-full bg-teal-500 animate-pulse"
							></span>
							Service in progress
						</div>

						<router-link
							:to="`/my-assignments/${assignment.uuid}`"
							class="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-[#0D65AE] rounded-lg hover:bg-[#0D65AE]/90 focus:ring-2 focus:ring-[#0D65AE] focus:ring-offset-2 transition-all"
						>
							<span>View Details</span>
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
						</router-link>
					</div>
				</div>
			</div>

		</div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useEmployeeAssignments } from "@/composables/useEmployeeAssignments";

const {
	assignments,
	loading,
	error,
	pendingAssignments,
	acceptedAssignments,
	inProgressAssignments,
	completedAssignments,
	fetchMyAssignments,
} = useEmployeeAssignments();

// ── Filter state ──────────────────────────────────────────────────────────────
const activeFilter = ref("all");

const filterTabs = computed(() => [
	{ value: "all", label: "All", count: assignments.value.length },
	{
		value: "pending",
		label: "Pending",
		count: pendingAssignments.value.length,
	},
	{
		value: "accepted",
		label: "Accepted",
		count: acceptedAssignments.value.length,
	},
	{
		value: "in_progress",
		label: "In Progress",
		count: inProgressAssignments.value.length,
	},
	{
		value: "completed",
		label: "Completed",
		count: completedAssignments.value.length,
	},
	{ value: "rejected", label: "Rejected", count: rejectedCount.value },
]);

const rejectedCount = computed(
	() => assignments.value.filter((a) => a.status === "rejected").length,
);

const filteredAssignments = computed(() => {
	if (activeFilter.value === "all") return assignments.value;
	if (activeFilter.value === "pending") {
		return assignments.value.filter(
			(a) => a.status === "pending" || a.status === "assigned",
		);
	}
	return assignments.value.filter((a) => a.status === activeFilter.value);
});

const activeFilterLabel = computed(() => {
	const tab = filterTabs.value.find((t) => t.value === activeFilter.value);
	return tab ? tab.label.toLowerCase() : "";
});

function setFilter(value) {
	activeFilter.value = activeFilter.value === value ? "all" : value;
}

// ── Status display helpers ────────────────────────────────────────────────────
const statusLabels = {
	assigned: "Confirm service",
	pending: "Confirm service",
	accepted: "Accepted",
	in_progress: "In Progress",
	completed: "Completed",
	rejected: "Rejected",
	cancelled: "Cancelled",
};

const statusClasses = {
	assigned: "bg-yellow-100 text-yellow-800",
	pending: "bg-yellow-100 text-yellow-800",
	accepted: "bg-blue-100 text-blue-800",
	in_progress: "bg-teal-100 text-teal-800",
	completed: "bg-green-100 text-green-800",
	rejected: "bg-red-100 text-red-800",
	cancelled: "bg-gray-100 text-gray-600",
};

// ── Data helpers ──────────────────────────────────────────────────────────────
function getServiceName(assignment) {
	return (
		assignment.serviceRequest?.service?.name ||
		assignment.service_request?.service?.name ||
		assignment.serviceName ||
		"Servicio sin nombre"
	);
}

function getCustomerName(assignment) {
	const req = assignment.serviceRequest || assignment.service_request;
	const customer = req?.customer || req?.user;
	if (!customer) return "Cliente desconocido";
	return (
		customer.name ||
		customer.fullName ||
		customer.full_name ||
		customer.email ||
		"Cliente"
	);
}

function getLocation(assignment) {
	const req = assignment.serviceRequest || assignment.service_request;
	const loc = req?.location || assignment.location;
	if (!loc) return null;
	return loc.address || loc.name || loc.description || null;
}

function hasNfc(assignment) {
	const req = assignment.serviceRequest || assignment.service_request;
	const loc = req?.location || assignment.location;
	return !!(loc?.nfcCode || loc?.nfc_code || loc?.nfcTag);
}

function formatDate(dateStr) {
	if (!dateStr) return "";
	const d = new Date(dateStr);
	if (isNaN(d)) return dateStr;
	return d.toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
}

// ── Load ──────────────────────────────────────────────────────────────────────
async function loadAssignments() {
	await fetchMyAssignments({ page: 1, limit: 100 });
}

onMounted(() => {
	loadAssignments();
});
</script>

<style scoped>
.line-clamp-2 {
	display: -webkit-box;
	-webkit-line-clamp: 2;
	line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
}
</style>
