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
							Browse Services
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
							Discover services offered by our partners
						</p>
					</div>
				</div>
			</div>

			<!-- Stats Cards -->
			<div
				v-if="!loading && services.length > 0"
				class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
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
								{{ categoriesCount }}
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
								Active Services
							</p>
							<p class="text-2xl font-semibold text-gray-900">
								{{ activeServicesCount }}
							</p>
						</div>
					</div>
				</div>
			</div>

			<!-- Filters & Search -->
			<div
				class="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-6"
			>
				<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
					<!-- Search -->
					<div class="relative">
						<svg
							class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
							/>
						</svg>
						<input
							v-model="searchQuery"
							type="text"
							placeholder="Search services..."
							class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:border-[#0D65AE] focus:ring-2 focus:ring-[#0D65AE] focus:ring-opacity-20 focus:outline-none transition-all"
						/>
					</div>

					<!-- Category Filter -->
					<select
						v-model="selectedCategory"
						class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#0D65AE] focus:ring-2 focus:ring-[#0D65AE] focus:ring-opacity-20 focus:outline-none transition-all"
					>
						<option :value="null">All Categories</option>
						<option
							v-for="category in categories"
							:key="category.id"
							:value="category.id"
						>
							{{ category.name }}
						</option>
					</select>

					<!-- Price Sort -->
					<select
						v-model="priceSort"
						class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#0D65AE] focus:ring-2 focus:ring-[#0D65AE] focus:ring-opacity-20 focus:outline-none transition-all"
					>
						<option value="">Sort by Price</option>
						<option value="asc">Price: Low to High</option>
						<option value="desc">Price: High to Low</option>
					</select>
				</div>
			</div>

			<!-- Loading State -->
			<div v-if="loading" class="flex items-center justify-center py-12">
				<div class="text-center">
					<div
						class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0D65AE] mx-auto"
					></div>
					<p class="text-gray-600 mt-4">Loading services...</p>
				</div>
			</div>

			<!-- Empty State -->
			<div
				v-else-if="!loading && services.length === 0"
				class="text-center py-12 bg-white rounded-xl border border-gray-200 shadow-sm"
			>
				<svg
					class="w-16 h-16 text-gray-400 mx-auto mb-4"
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
				<h3 class="text-xl font-semibold text-gray-900 mb-2">
					No Services Available
				</h3>
				<p class="text-gray-600">Check back later for new services</p>
			</div>

			<!-- No Results State -->
			<div
				v-else-if="!loading && filteredServices.length === 0"
				class="text-center py-12 bg-white rounded-xl border border-gray-200 shadow-sm"
			>
				<svg
					class="w-16 h-16 text-gray-400 mx-auto mb-4"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
					/>
				</svg>
				<h3 class="text-xl font-semibold text-gray-900 mb-2">
					No Services Found
				</h3>
				<p class="text-gray-600 mb-4">
					Try adjusting your filters or search query
				</p>
				<button
					@click="clearFilters"
					class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
				>
					Clear Filters
				</button>
			</div>

			<!-- Services Grid -->
			<div v-else class="space-y-6">
				<!-- Services Cards -->
				<div
					class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
				>
					<div
						v-for="service in paginatedServices"
						:key="service.id"
						class="bg-white rounded-lg border border-gray-200 hover:border-[#0D65AE] shadow-sm hover:shadow-md transition-all overflow-hidden cursor-pointer"
						@click="viewService(service)"
					>
						<!-- Service Card Content -->
						<div class="p-5">
							<div class="flex items-start justify-between mb-3">
								<div class="flex-1 min-w-0">
									<h3
										class="text-lg font-semibold text-gray-900 mb-1 truncate"
									>
										{{ service.name }}
									</h3>
									<div
										class="flex items-center gap-2 flex-wrap"
									>
										<!-- Category Badge -->
										<span
											v-if="
												getCategoryName(
													service.categoryId,
												)
											"
											class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
										>
											{{
												getCategoryName(
													service.categoryId,
												)
											}}
										</span>
										<!-- Status Badge -->
										<span
											v-if="service.status"
											:class="
												getStatusClass(service.status)
											"
											class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
										>
											{{ formatStatus(service.status) }}
										</span>
									</div>
								</div>
							</div>

							<!-- Description -->
							<p
								v-if="service.description"
								class="text-sm text-gray-600 line-clamp-2 mb-4"
							>
								{{ service.description }}
							</p>

							<!-- Price and Duration -->
							<div
								class="flex items-center justify-between pt-3 border-t border-gray-100"
							>
								<div class="flex items-center gap-1.5">
									<svg
										class="w-5 h-5 text-gray-400"
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
									<span
										class="text-lg font-semibold text-[#0D65AE]"
									>
										{{ formatPrice(service.price) }}
									</span>
								</div>
								<div
									v-if="service.duration"
									class="flex items-center gap-1.5"
								>
									<svg
										class="w-5 h-5 text-gray-400"
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
									<span class="text-sm text-gray-600">
										{{ formatDuration(service.duration) }}
									</span>
								</div>
							</div>

							<!-- Company Info -->
							<div
								v-if="service.company"
								class="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100"
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
										d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
									/>
								</svg>
								<span class="text-sm text-gray-600">{{
									service.company.name
								}}</span>
							</div>
						</div>

						<!-- View Button -->
						<div
							class="bg-gray-50 px-5 py-3 border-t border-gray-200"
						>
							<button
								@click.stop="viewService(service)"
								class="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-[#0D65AE] hover:bg-[#0D65AE] hover:text-white border border-[#0D65AE] rounded-lg transition-all"
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
				</div>

				<!-- Pagination -->
				<div
					v-if="totalPages > 1"
					class="flex items-center justify-center gap-2 mt-8"
				>
					<button
						@click="previousPage"
						:disabled="currentPage === 1"
						class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
								d="M15 19l-7-7 7-7"
							/>
						</svg>
					</button>

					<div class="flex items-center gap-1">
						<button
							v-for="page in visiblePages"
							:key="page"
							@click="goToPage(page)"
							:class="[
								'px-4 py-2 text-sm font-medium rounded-lg transition-all',
								currentPage === page
									? 'bg-[#0D65AE] text-white'
									: 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50',
							]"
						>
							{{ page }}
						</button>
					</div>

					<button
						@click="nextPage"
						:disabled="currentPage === totalPages"
						class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
								d="M9 5l7 7-7 7"
							/>
						</svg>
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useServices } from "@/composables/useServices";
import {
	formatCurrency,
	formatDuration,
	formatStatus,
} from "@/utils/formatters";

const router = useRouter();

const {
	state,
	servicesCount,
	activeServices,
	categoriesCount,
	fetchServices,
	fetchServiceCategories,
} = useServices();

// Local state
const loading = ref(false);
const searchQuery = ref("");
const selectedCategory = ref(null);
const priceSort = ref("");
const currentPage = ref(1);
const pageSize = ref(12);

// Data
const services = ref([]);
const categories = ref([]);

// Computed
const activeServicesCount = computed(() => {
	return services.value.filter((s) => s.status === "active").length;
});

const filteredServices = computed(() => {
	let filtered = [...services.value];

	// Filter by search query
	if (searchQuery.value) {
		const query = searchQuery.value.toLowerCase();
		filtered = filtered.filter(
			(service) =>
				service.name?.toLowerCase().includes(query) ||
				service.description?.toLowerCase().includes(query),
		);
	}

	// Filter by category
	if (selectedCategory.value) {
		filtered = filtered.filter(
			(service) => service.categoryId === selectedCategory.value,
		);
	}

	// Sort by price
	if (priceSort.value === "asc") {
		filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
	} else if (priceSort.value === "desc") {
		filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
	}

	return filtered;
});

const totalPages = computed(() => {
	return Math.ceil(filteredServices.value.length / pageSize.value);
});

const paginatedServices = computed(() => {
	const start = (currentPage.value - 1) * pageSize.value;
	const end = start + pageSize.value;
	return filteredServices.value.slice(start, end);
});

const visiblePages = computed(() => {
	const pages = [];
	const maxVisible = 5;
	let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2));
	let end = Math.min(totalPages.value, start + maxVisible - 1);

	if (end - start + 1 < maxVisible) {
		start = Math.max(1, end - maxVisible + 1);
	}

	for (let i = start; i <= end; i++) {
		pages.push(i);
	}

	return pages;
});

// Methods
const getCategoryName = (categoryId) => {
	const category = categories.value.find((cat) => cat.id === categoryId);
	return category?.name || "";
};

const getStatusClass = (status) => {
	const statusLower = status?.toLowerCase();
	if (statusLower === "active") {
		return "bg-green-100 text-green-800";
	} else if (statusLower === "inactive") {
		return "bg-gray-100 text-gray-800";
	} else if (statusLower === "draft") {
		return "bg-yellow-100 text-yellow-800";
	}
	return "bg-gray-100 text-gray-800";
};

const formatPrice = (price) => {
	return formatCurrency(price);
};

const clearFilters = () => {
	searchQuery.value = "";
	selectedCategory.value = null;
	priceSort.value = "";
};

const viewService = (service) => {
	router.push({
		name: "ServiceDetail",
		params: { id: service.id },
	});
};

const previousPage = () => {
	if (currentPage.value > 1) {
		currentPage.value--;
		window.scrollTo({ top: 0, behavior: "smooth" });
	}
};

const nextPage = () => {
	if (currentPage.value < totalPages.value) {
		currentPage.value++;
		window.scrollTo({ top: 0, behavior: "smooth" });
	}
};

const goToPage = (page) => {
	currentPage.value = page;
	window.scrollTo({ top: 0, behavior: "smooth" });
};

const loadData = async () => {
	loading.value = true;
	try {
		// Load categories
		const categoriesResult = await fetchServiceCategories();
		if (categoriesResult.success) {
			categories.value = categoriesResult.data;
		}

		// Load services
		const servicesResult = await fetchServices({ status: "active" });
		if (servicesResult.success) {
			services.value = servicesResult.data;
		}
	} catch (error) {
		console.error("Error loading data:", error);
	} finally {
		loading.value = false;
	}
};

// Lifecycle
onMounted(() => {
	loadData();
});
</script>

<style scoped>
.line-clamp-2 {
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
}
</style>
