<template>
	<div class="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
		<div class="max-w-7xl mx-auto">
			<!-- Page Header -->
			<div class="mb-6 sm:mb-8">
				<div
					class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
				>
					<div>
						<h1
							class="text-3xl sm:text-4xl font-bold text-gray-900 mb-1 sm:mb-2"
						>
							{{ companyName }}
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
									d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
								/>
							</svg>
							Manage company services
						</p>
					</div>
					<button
						v-if="canManageCompany"
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
						Back to Company
					</button>
				</div>
			</div>

			<!-- Stats Cards -->
			<div
				v-if="!loading && services.length > 0"
				class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
			>
				<div
					class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6"
				>
					<div class="flex items-center">
						<div class="flex-shrink-0">
							<div
								class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"
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
										d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
									/>
								</svg>
							</div>
						</div>
						<div class="ml-4">
							<p class="text-sm font-medium text-gray-600">
								Total Services
							</p>
							<p class="text-2xl font-semibold text-gray-900">
								{{ servicesCount }}
							</p>
						</div>
					</div>
				</div>

				<div
					class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6"
				>
					<div class="flex items-center">
						<div class="flex-shrink-0">
							<div
								class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"
							>
								<svg
									class="w-6 h-6 text-green-600"
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
						<div class="ml-4">
							<p class="text-sm font-medium text-gray-600">
								Active
							</p>
							<p class="text-2xl font-semibold text-gray-900">
								{{ activeServicesCount }}
							</p>
						</div>
					</div>
				</div>

				<div
					class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6"
				>
					<div class="flex items-center">
						<div class="flex-shrink-0">
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
										d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
									/>
								</svg>
							</div>
						</div>
						<div class="ml-4">
							<p class="text-sm font-medium text-gray-600">
								Categories
							</p>
							<p class="text-2xl font-semibold text-gray-900">
								{{ usedCategoriesCount }}
							</p>
						</div>
					</div>
				</div>

				<div
					class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6"
				>
					<div class="flex items-center">
						<div class="flex-shrink-0">
							<div
								class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center"
							>
								<svg
									class="w-6 h-6 text-orange-600"
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
						</div>
						<div class="ml-4">
							<p class="text-sm font-medium text-gray-600">
								Avg Price
							</p>
							<p class="text-2xl font-semibold text-gray-900">
								{{ averagePrice }}
							</p>
						</div>
					</div>
				</div>
			</div>

			<!-- Loading State -->
			<div v-if="loading" class="flex items-center justify-center py-12">
				<div class="text-center">
					<div
						class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0D65AE] mx-auto"
					></div>
					<p class="text-gray-600 mt-4">
						Loading company services...
					</p>
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
					Error Loading Services
				</h3>
				<p class="text-gray-600 mb-4">{{ error }}</p>
				<button
					@click="loadData"
					class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0D65AE] rounded-lg hover:bg-[#0a4f87] transition-all"
				>
					Try Again
				</button>
			</div>

			<!-- Content -->
			<div v-else>
				<!-- Service Categories Section -->
				<div
					v-if="canManageCompany"
					class="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6"
				>
					<ServiceCategoriesManager
						:categories="categories"
						:loading="loadingCategories"
						:can-create="canManageCompany"
						:can-edit="canManageCompany"
						:can-delete="canManageCompany"
						@refresh="loadCategories"
					/>
				</div>

				<!-- Divider -->
				<div
					v-if="canManageCompany"
					class="my-8 border-t border-gray-200"
				></div>

				<!-- Company Services Section -->
				<div
					class="bg-white rounded-xl border border-gray-200 shadow-sm p-6"
				>
					<CompanyServicesManager
						:company-id="companyId"
						:services="services"
						:categories="categories"
						:loading="loadingServices"
						:can-create="canManageCompany"
						:can-edit="canManageCompany"
						:can-delete="canManageCompany"
						@refresh="loadServices"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useServices } from "@/composables/useServices";
import { useCompanies } from "@/composables/useCompanies";
import { usePermissions } from "@/composables/usePermissions";
import { useToast } from "@/composables/useToast";
import { formatCurrency } from "@/utils/formatters";
import ServiceCategoriesManager from "@/components/services/ServiceCategoriesManager.vue";
import CompanyServicesManager from "@/components/services/CompanyServicesManager.vue";

const route = useRoute();
const router = useRouter();
const { showError } = useToast();
const { canManage } = usePermissions();

const {
	fetchCompanyServices,
	fetchServiceCategories,
	servicesCount: totalServicesCount,
	activeServices,
} = useServices();

const { fetchCompany } = useCompanies();

// State
const loading = ref(false);
const loadingServices = ref(false);
const loadingCategories = ref(false);
const error = ref(null);
const company = ref(null);
const services = ref([]);
const categories = ref([]);

// Computed
const companyId = computed(() => parseInt(route.params.companyId));

const companyName = computed(() => {
	return company.value?.name || "Company";
});

const canManageCompany = computed(() => {
	return canManage(companyId.value);
});

const servicesCount = computed(() => {
	return services.value.length;
});

const activeServicesCount = computed(() => {
	return services.value.filter((s) => s.status === "active").length;
});

const usedCategoriesCount = computed(() => {
	const categoryIds = new Set(
		services.value.map((s) => s.categoryId).filter(Boolean),
	);
	return categoryIds.size;
});

const averagePrice = computed(() => {
	if (services.value.length === 0) return "$0.00";
	const total = services.value.reduce((sum, s) => sum + (s.price || 0), 0);
	const avg = total / services.value.length;
	return formatCurrency(avg);
});

// Methods
const loadCompany = async () => {
	try {
		const result = await fetchCompany(companyId.value);
		if (result.success) {
			company.value = result.data;
		} else {
			throw new Error(result.error || "Failed to load company");
		}
	} catch (err) {
		console.error("Error loading company:", err);
		error.value = err.message || "Failed to load company information";
	}
};

const loadServices = async () => {
	loadingServices.value = true;
	try {
		const result = await fetchCompanyServices(companyId.value);
		if (result.success) {
			services.value = result.data;
		} else {
			throw new Error(result.error || "Failed to load services");
		}
	} catch (err) {
		console.error("Error loading services:", err);
		showError("Failed to load services");
	} finally {
		loadingServices.value = false;
	}
};

const loadCategories = async () => {
	loadingCategories.value = true;
	try {
		const result = await fetchServiceCategories();
		if (result.success) {
			categories.value = result.data;
		} else {
			throw new Error(result.error || "Failed to load categories");
		}
	} catch (err) {
		console.error("Error loading categories:", err);
		showError("Failed to load categories");
	} finally {
		loadingCategories.value = false;
	}
};

const loadData = async () => {
	loading.value = true;
	error.value = null;

	try {
		await Promise.all([loadCompany(), loadCategories(), loadServices()]);
	} catch (err) {
		console.error("Error loading data:", err);
		error.value = err.message || "Failed to load data";
	} finally {
		loading.value = false;
	}
};

const goBack = () => {
	router.push({ name: "MyCompany" });
};

// Lifecycle
onMounted(() => {
	loadData();
});
</script>

<style scoped>
/* Additional styles if needed */
</style>
