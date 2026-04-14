<template>
	<div class="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
		<div class="max-w-4xl mx-auto">
			<!-- Loading State -->
			<div v-if="loading" class="flex items-center justify-center py-12">
				<div class="text-center">
					<div
						class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0D65AE] mx-auto"
					></div>
					<p class="text-gray-600 mt-4">Loading service details...</p>
				</div>
			</div>

			<!-- Error State -->
			<div
				v-else-if="error"
				class="text-center py-12 bg-white rounded-xl border border-red-200 shadow-sm"
			>
				<svg
					class="w-16 h-16 text-red-400 mx-auto mb-4"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
					/>
				</svg>
				<h3 class="text-xl font-semibold text-gray-900 mb-2">
					Error Loading Service
				</h3>
				<p class="text-gray-600 mb-4">{{ error }}</p>
				<div class="flex items-center justify-center gap-3">
					<button
						@click="loadService"
						class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0D65AE] rounded-lg hover:bg-[#0a4f87] transition-all"
					>
						Try Again
					</button>
					<button
						@click="goBack"
						class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
					>
						Go Back
					</button>
				</div>
			</div>

			<!-- Service Content -->
			<div v-else-if="service">
				<!-- Back Button -->
				<div class="mb-6">
					<button
						@click="goBack"
						class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-[#0D65AE] focus:ring-offset-2 transition-all"
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
								d="M10 19l-7-7m0 0l7-7m-7 7h18"
							/>
						</svg>
						Back
					</button>
				</div>

				<!-- Service Header Card -->
				<div
					class="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8 mb-6"
				>
					<div class="flex items-start justify-between mb-4">
						<div class="flex-1">
							<h1
								class="text-3xl sm:text-4xl font-bold text-gray-900 mb-3"
							>
								{{ service.name }}
							</h1>
							<div class="flex items-center gap-2 flex-wrap">
								<!-- Category Badge -->
								<span
									v-if="categoryName"
									class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
								>
									<svg
										class="w-4 h-4 mr-1"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
										/>
									</svg>
									{{ categoryName }}
								</span>
								<!-- Status Badge -->
								<span
									v-if="service.status"
									:class="statusClass"
									class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
								>
									{{ formatStatus(service.status) }}
								</span>
							</div>
						</div>
					</div>

					<!-- Price and Duration -->
					<div
						class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-gray-200"
					>
						<div class="flex items-center gap-3">
							<div
								class="w-12 h-12 bg-[#0D65AE]/10 rounded-lg flex items-center justify-center"
							>
								<svg
									class="w-6 h-6 text-[#0D65AE]"
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
							<div>
								<p class="text-sm text-gray-600">Price</p>
								<p class="text-2xl font-bold text-[#0D65AE]">
									{{ formatPrice(service.price) }}
								</p>
							</div>
						</div>
						<div
							v-if="service.duration"
							class="flex items-center gap-3"
						>
							<div
								class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center"
							>
								<svg
									class="w-6 h-6 text-purple-600"
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
							<div>
								<p class="text-sm text-gray-600">Duration</p>
								<p class="text-2xl font-bold text-purple-600">
									{{ formatDuration(service.duration) }}
								</p>
							</div>
						</div>
					</div>
				</div>

				<!-- Description Section -->
				<div
					v-if="service.description"
					class="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8 mb-6"
				>
					<h2
						class="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2"
					>
						<svg
							class="w-5 h-5 text-[#0D65AE]"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 6h16M4 12h16M4 18h7"
							/>
						</svg>
						Description
					</h2>
					<p
						class="text-gray-700 leading-relaxed whitespace-pre-wrap"
					>
						{{ service.description }}
					</p>
				</div>

				<!-- Company Information -->
				<div
					v-if="service.company"
					class="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8 mb-6"
				>
					<h2
						class="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2"
					>
						<svg
							class="w-5 h-5 text-[#0D65AE]"
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
						Offered By
					</h2>
					<div class="flex items-start gap-4">
						<div
							class="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0"
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
									stroke-width="2"
									d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
								/>
							</svg>
						</div>
						<div class="flex-1">
							<h3
								class="text-lg font-semibold text-gray-900 mb-1"
							>
								{{ service.company.name }}
							</h3>
							<div class="space-y-2 text-sm text-gray-600">
								<p
									v-if="service.company.email"
									class="flex items-center gap-2"
								>
									<svg
										class="w-4 h-4 text-gray-400"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
										/>
									</svg>
									{{ service.company.email }}
								</p>
								<p
									v-if="service.company.phone"
									class="flex items-center gap-2"
								>
									<svg
										class="w-4 h-4 text-gray-400"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
										/>
									</svg>
									{{ service.company.phone }}
								</p>
								<p
									v-if="service.company.address"
									class="flex items-center gap-2"
								>
									<svg
										class="w-4 h-4 text-gray-400"
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
									{{ service.company.address }}
								</p>
							</div>
						</div>
					</div>
				</div>

				<!-- Metadata Section -->
				<div
					class="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8"
				>
					<h2
						class="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2"
					>
						<svg
							class="w-5 h-5 text-[#0D65AE]"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						Additional Information
					</h2>
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div
							v-if="service.created_at"
							class="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg"
						>
							<span class="text-sm text-gray-600">Created</span>
							<span class="text-sm font-medium text-gray-900">
								{{ formatDate(service.created_at) }}
							</span>
						</div>
						<div
							v-if="service.updated_at"
							class="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg"
						>
							<span class="text-sm text-gray-600"
								>Last Updated</span
							>
							<span class="text-sm font-medium text-gray-900">
								{{ formatDate(service.updated_at) }}
							</span>
						</div>
						<div
							v-if="service.id"
							class="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg"
						>
							<span class="text-sm text-gray-600"
								>Service ID</span
							>
							<span class="text-sm font-medium text-gray-900">
								#{{ service.id }}
							</span>
						</div>
					</div>
				</div>

				<!-- Action Buttons -->
				<div
					class="mt-6 flex flex-col sm:flex-row gap-3 sticky bottom-4"
				>
					<button
						v-if="service.status === 'active'"
						@click="bookService"
						class="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-medium text-white bg-[#0D65AE] rounded-lg hover:bg-[#0a4f87] focus:ring-2 focus:ring-[#0D65AE] focus:ring-offset-2 transition-all shadow-lg"
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
								d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
							/>
						</svg>
						Book This Service
					</button>
					<button
						@click="contactCompany"
						class="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-medium text-[#0D65AE] bg-white border border-[#0D65AE] rounded-lg hover:bg-[#0D65AE] hover:text-white focus:ring-2 focus:ring-[#0D65AE] focus:ring-offset-2 transition-all"
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
								d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
							/>
						</svg>
						Contact Company
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useServices } from "@/composables/useServices";
import { useToast } from "@/composables/useToast";
import { useAuthStore } from "@/stores/auth.store";
import {
	formatCurrency,
	formatDuration,
	formatStatus,
	formatDate,
} from "@/utils/formatters";

const route = useRoute();
const router = useRouter();
const { fetchService, getCategoryById } = useServices();
const { showInfo } = useToast();
const authStore = useAuthStore();

// State
const loading = ref(false);
const error = ref(null);
const service = ref(null);

// Computed
const serviceId = computed(() => parseInt(route.params.id));

const categoryName = computed(() => {
	if (!service.value) return "";
	if (service.value.category?.name) {
		return service.value.category.name;
	}
	if (service.value.categoryId) {
		const category = getCategoryById(service.value.categoryId);
		return category?.name || "";
	}
	return "";
});

const statusClass = computed(() => {
	if (!service.value?.status) return "bg-gray-100 text-gray-800";

	const status = service.value.status.toLowerCase();
	if (status === "active") {
		return "bg-green-100 text-green-800";
	} else if (status === "inactive") {
		return "bg-gray-100 text-gray-800";
	} else if (status === "draft") {
		return "bg-yellow-100 text-yellow-800";
	}
	return "bg-gray-100 text-gray-800";
});

// Methods
const formatPrice = (price) => {
	return formatCurrency(price);
};

const loadService = async () => {
	loading.value = true;
	error.value = null;

	try {
		const result = await fetchService(serviceId.value);
		if (result.success) {
			service.value = result.data;
		} else {
			throw new Error(result.error || "Failed to load service");
		}
	} catch (err) {
		console.error("Error loading service:", err);
		error.value = err.message || "Failed to load service details";
	} finally {
		loading.value = false;
	}
};

const goBack = () => {
	router.go(-1);
};

const bookService = () => {
	const serviceId = service.value?.uuid || service.value?.id;
	if (!serviceId) {
		showInfo("Service information not available");
		return;
	}
	router.push({
		name: "CreateRequest",
		query: { serviceId: String(serviceId) },
	});
};

const contactCompany = () => {
	if (service.value?.company?.email) {
		window.location.href = `mailto:${service.value.company.email}`;
	} else {
		showInfo("Company contact information not available");
	}
};

// Lifecycle
onMounted(() => {
	loadService();
});
</script>

<style scoped>
/* Additional styles if needed */
</style>
