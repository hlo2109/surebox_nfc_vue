<template>
	<div class="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
		<div class="max-w-5xl mx-auto space-y-6">
			<!-- Header -->
			<div class="flex items-center justify-between">
				<div>
					<h1 class="text-2xl sm:text-3xl font-bold text-gray-900">My Packages</h1>
					<p class="text-sm text-gray-600 mt-1">Track your deliveries in real-time</p>
				</div>
				<button @click="fetchDeliveries"
					class="inline-flex items-center gap-2 px-4 py-2 text-[#0D65AE] bg-white border border-[#0D65AE]/20 rounded-lg hover:bg-[#0D65AE]/5 transition-colors">
					<svg class="w-5 h-5" :class="{ 'animate-spin': isRefreshing }" fill="none" stroke="currentColor"
						viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
							d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15">
						</path>
					</svg>
					<span class="hidden sm:inline">Refresh All</span>
				</button>
			</div>

			<!-- Filters Section -->
			<div class="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
				<div class="flex items-center justify-between mb-4">
					<h2 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
						<svg class="w-5 h-5 text-[#0D65AE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
								d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z">
							</path>
						</svg>
						Filters
					</h2>
					<button v-if="hasActiveFilters" @click="clearFilters"
						class="text-sm text-[#0D65AE] hover:text-[#0D65AE]/80 font-medium">
						Clear All
					</button>
				</div>

				<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
					<!-- Search Filter -->
					<div class="relative">
						<label for="search-filter" class="block text-sm font-medium text-gray-700 mb-1.5">Search</label>
						<div class="relative">
							<input id="search-filter" v-model="filters.search" type="text" placeholder="Package ID..."
								class="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D65AE]/20 focus:border-[#0D65AE] transition-colors" />
							<svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none"
								stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
							</svg>
						</div>
					</div>

					<!-- Status Filter -->
					<div>
						<label for="status-filter" class="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
						<select id="status-filter" v-model="filters.status"
							class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D65AE]/20 focus:border-[#0D65AE] transition-colors">
							<option value="">All Statuses</option>
							<option value="delivered">Delivered</option>
							<option value="in_transit">In Transit</option>
							<option value="pending">Pending</option>
						</select>
					</div>

					<!-- Company Filter -->
					<div>
						<label for="company-filter"
							class="block text-sm font-medium text-gray-700 mb-1.5">Company</label>
						<select id="company-filter" v-model="filters.company"
							class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D65AE]/20 focus:border-[#0D65AE] transition-colors">
							<option value="">All Companies</option>
							<option v-for="company in uniqueCompanies" :key="company" :value="company">
								{{ company }}
							</option>
						</select>
					</div>

					<!-- Date Range Filter -->
					<div>
						<label for="daterange-filter" class="block text-sm font-medium text-gray-700 mb-1.5">Date
							Range</label>
						<select id="daterange-filter" v-model="filters.dateRange"
							class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D65AE]/20 focus:border-[#0D65AE] transition-colors">
							<option value="">All Time</option>
							<option value="today">Today</option>
							<option value="week">Last 7 Days</option>
							<option value="month">Last 30 Days</option>
							<option value="custom">Custom Range</option>
						</select>
					</div>
				</div>

				<!-- Custom Date Range -->
				<div v-if="filters.dateRange === 'custom'" class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div>
						<label for="custom-from-date" class="block text-sm font-medium text-gray-700 mb-1.5">From
							Date</label>
						<input id="custom-from-date" v-model="filters.customDateFrom" type="date"
							class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D65AE]/20 focus:border-[#0D65AE] transition-colors" />
					</div>
					<div>
						<label for="custom-to-date" class="block text-sm font-medium text-gray-700 mb-1.5">To
							Date</label>
						<input id="custom-to-date" v-model="filters.customDateTo" type="date"
							class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D65AE]/20 focus:border-[#0D65AE] transition-colors" />
					</div>
				</div>

				<!-- Results Summary -->
				<div
					class="mt-4 pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm">
					<span class="text-gray-600">
						<span v-if="isLoadingFilters" class="inline-flex items-center gap-2">
							<svg class="w-4 h-4 animate-spin text-[#0D65AE]" fill="none" stroke="currentColor"
								viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15">
								</path>
							</svg>
							Loading...
						</span>
						<span v-else>
							Showing <span class="font-semibold text-gray-900">{{ ((pagination.currentPage - 1) *
								pagination.perPage) + 1 }}</span>
							to <span class="font-semibold text-gray-900">{{ Math.min(pagination.currentPage *
								pagination.perPage, pagination.totalRecords) }}</span>
							of <span class="font-semibold text-gray-900">{{ pagination.totalRecords }}</span> packages
						</span>
					</span>
					<div class="flex items-center gap-2">
						<label for="sort-select" class="text-gray-600">Sort by:</label>
						<select id="sort-select" v-model="filters.sortBy"
							class="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D65AE]/20 focus:border-[#0D65AE] transition-colors text-sm">
							<option value="date-desc">Newest First</option>
							<option value="date-asc">Oldest First</option>
							<option value="company">Company (A-Z)</option>
							<option value="status">Status</option>
						</select>
					</div>
				</div>
			</div>

			<!-- Empty State -->
			<div v-if="deliveries.length === 0" class="bg-white rounded-xl border border-gray-200 p-12 text-center">
				<svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
						d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4">
					</path>
				</svg>
				<h3 class="text-lg font-semibold text-gray-900 mb-2">No packages yet</h3>
				<p class="text-gray-600">Your deliveries will appear here when they arrive</p>
			</div>

			<!-- No Results State -->
			<div v-else-if="filteredDeliveries.length === 0"
				class="bg-white rounded-xl border border-gray-200 p-12 text-center">
				<svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
				</svg>
				<h3 class="text-lg font-semibold text-gray-900 mb-2">No packages found</h3>
				<p class="text-gray-600">Try adjusting your filters to find what you're looking for</p>
				<button @click="clearFilters"
					class="mt-4 inline-flex items-center gap-2 px-4 py-2 text-[#0D65AE] bg-[#0D65AE]/5 border border-[#0D65AE]/20 rounded-lg hover:bg-[#0D65AE]/10 transition-colors">
					Clear Filters
				</button>
			</div>

			<!-- Deliveries List -->
			<div v-else class="space-y-4 relative">
				<!-- Loading Overlay -->
				<div v-if="isLoadingFilters"
					class="absolute inset-0 bg-white/75 backdrop-blur-sm z-10 flex items-center justify-center rounded-xl">
					<div class="text-center">
						<svg class="w-12 h-12 mx-auto text-[#0D65AE] animate-spin mb-2" fill="none"
							stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
								d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15">
							</path>
						</svg>
						<p class="text-sm font-medium text-gray-900">Loading deliveries...</p>
					</div>
				</div>

				<div v-for="(delivery, idx) in filteredDeliveries" :key="delivery.id"
					class="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all hover:border-[#0D65AE]/30">
					<!-- Delivery Header -->
					<button @click="toggleDelivery(idx)"
						class="w-full px-4 sm:px-6 py-4 flex items-center gap-3 text-left hover:bg-gray-50 transition-colors">
						<div
							class="flex-shrink-0 w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center p-1.5 overflow-hidden">
							<img v-if="getCompanyLogo(delivery.company.name)"
								:src="getCompanyLogo(delivery.company.name)" :alt="delivery.company.name"
								class="w-full h-full object-contain" @error="e => e.target.style.display = 'none'" />
							<svg v-else class="w-5 h-5 text-[#0D65AE]" fill="none" stroke="currentColor"
								viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4">
								</path>
							</svg>
						</div>
						<div class="flex-1 min-w-0">
							<div class="flex items-center gap-2 flex-wrap">
								<p class="text-sm font-semibold text-gray-900">{{ delivery.package_id }}</p>
								<span class="text-gray-400">•</span>
								<p class="text-sm text-gray-600">{{ delivery.company.name }}</p>
							</div>
							<p class="text-xs text-gray-500 mt-0.5">{{ formatDate(delivery.delivery_time) }}</p>
						</div>
						<span
							:class="['px-2.5 py-1 rounded-md text-xs font-medium border', delivery.state === 'delivered' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200']">
							{{ delivery.state }}
						</span>
						<svg class="w-5 h-5 text-gray-400 transition-transform flex-shrink-0"
							:class="{ 'rotate-180': openedTabs.includes(idx) }" fill="none" stroke="currentColor"
							viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7">
							</path>
						</svg>
					</button>

					<!-- Delivery Details (Expandable) -->
					<div v-show="openedTabs.includes(idx)" class="border-t border-gray-200">
						<div class="p-4 sm:p-6">
							<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
								<!-- Package Information -->
								<div class="space-y-4">
									<h3 class="text-sm font-semibold text-gray-900 flex items-center gap-2">
										<svg class="w-4 h-4 text-[#0D65AE]" fill="none" stroke="currentColor"
											viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
												d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
										</svg>
										Package Details
									</h3>
									<div class="space-y-3">
										<div class="flex items-start justify-between py-2 border-b border-gray-100">
											<span class="text-sm text-gray-600">Package ID</span>
											<span class="text-sm font-medium text-gray-900">{{ delivery.package_id
											}}</span>
										</div>
										<div class="flex items-start justify-between py-2 border-b border-gray-100">
											<span class="text-sm text-gray-600">Company</span>
											<span class="text-sm font-medium text-gray-900">{{ delivery.company.name
											}}</span>
										</div>
										<div class="flex items-start justify-between py-2 border-b border-gray-100">
											<span class="text-sm text-gray-600">Recipient</span>
											<div class="text-right">
												<p class="text-sm font-medium text-gray-900">{{ delivery.user.name }}
												</p>
												<p class="text-xs text-gray-500">{{ delivery.user.email }}</p>
											</div>
										</div>
										<div class="flex items-start justify-between py-2 border-b border-gray-100">
											<span class="text-sm text-gray-600">Delivery Time</span>
											<span class="text-sm font-medium text-gray-900">{{
												formatDate(delivery.delivery_time) }}</span>
										</div>
										<div class="flex items-start justify-between py-2">
											<span class="text-sm text-gray-600">Status</span>
											<span
												:class="['px-2.5 py-1 rounded-md text-xs font-medium border', delivery.state === 'delivered' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200']">
												{{ delivery.state }}
											</span>
										</div>
									</div>

									<!-- Action Buttons -->
									<div class="flex flex-col sm:flex-row gap-2">
										<button @click="refreshDelivery(delivery.id, delivery.package_id)"
											:disabled="loadingId === delivery.id"
											class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 text-[#0D65AE] bg-[#0D65AE]/5 border border-[#0D65AE]/20 rounded-lg hover:bg-[#0D65AE]/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
											<svg class="w-4 h-4" :class="{ 'animate-spin': loadingId === delivery.id }"
												fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
													d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15">
												</path>
											</svg>
											{{ loadingId === delivery.id ? 'Refreshing...' : 'Refresh Tracking' }}
										</button>
										<a :href="getCompanyTrackingUrl(delivery.company.name, delivery.package_id)"
											target="_blank" rel="noopener noreferrer"
											class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 text-white bg-[#0D65AE] border border-[#0D65AE] rounded-lg hover:bg-[#0D65AE]/90 transition-colors">
											<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
													d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14">
												</path>
											</svg>
											Track on Website
										</a>
									</div>
								</div>

								<!-- Map -->
								<div v-if="delivery.info?.location" class="space-y-2">
									<h3 class="text-sm font-semibold text-gray-900 flex items-center gap-2">
										<svg class="w-4 h-4 text-[#0D65AE]" fill="none" stroke="currentColor"
											viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
												d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z">
											</path>
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
												d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
										</svg>
										Location Tracking
									</h3>
									<div class="rounded-lg overflow-hidden border border-gray-200">
										<div :id="'map-' + delivery.id" class="h-64 w-full"></div>
									</div>
								</div>
								<div v-else
									class="flex items-center justify-center h-64 bg-gray-50 rounded-lg border border-gray-200">
									<div class="text-center">
										<svg class="w-12 h-12 mx-auto text-gray-300 mb-2" fill="none"
											stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
												d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z">
											</path>
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
												d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
										</svg>
										<p class="text-sm text-gray-500">Location not available</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Pagination -->
			<div v-if="pagination.totalPages > 1"
				class="bg-white rounded-xl border border-gray-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
				<div class="text-sm text-gray-600">
					Page <span class="font-semibold text-gray-900">{{ pagination.currentPage }}</span> of
					<span class="font-semibold text-gray-900">{{ pagination.totalPages }}</span>
				</div>

				<div class="flex items-center gap-2">
					<!-- First Page -->
					<button @click="goToPage(1)" :disabled="pagination.currentPage === 1"
						class="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
								d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path>
						</svg>
					</button>

					<!-- Previous Page -->
					<button @click="previousPage" :disabled="pagination.currentPage === 1"
						class="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7">
							</path>
						</svg>
					</button>

					<!-- Page Numbers -->
					<div class="hidden sm:flex items-center gap-1">
						<button v-for="page in getPageNumbers()" :key="page" @click="goToPage(page)"
							:class="['px-3 py-2 text-sm border rounded-lg transition-colors', page === pagination.currentPage ? 'bg-[#0D65AE] text-white border-[#0D65AE]' : 'border-gray-300 hover:bg-gray-50']"
							:disabled="page === '...'">
							{{ page }}
						</button>
					</div>

					<!-- Next Page -->
					<button @click="nextPage" :disabled="pagination.currentPage === pagination.totalPages"
						class="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7">
							</path>
						</svg>
					</button>

					<!-- Last Page -->
					<button @click="goToPage(pagination.totalPages)"
						:disabled="pagination.currentPage === pagination.totalPages"
						class="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
								d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>
						</svg>
					</button>
				</div>

				<!-- Per Page Selector -->
				<div class="flex items-center gap-2 text-sm">
					<label for="per-page" class="text-gray-600">Show:</label>
					<select id="per-page" v-model="pagination.perPage" @change="applyFilters"
						class="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D65AE]/20 focus:border-[#0D65AE] transition-colors">
						<option :value="10">10</option>
						<option :value="25">25</option>
						<option :value="50">50</option>
						<option :value="100">100</option>
					</select>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from "vue";
import axios from "axios";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

axios.interceptors.request.use((config) => {
	const token = localStorage.getItem("jwt");
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

const API_BASE_URL = import.meta.env.VITE_API_URL;
const deliveries = ref([]);
const loadingId = ref(null);
const openedTabs = ref([]);
const isRefreshing = ref(false);
const isLoadingFilters = ref(false);

// Pagination
const pagination = ref({
	currentPage: 1,
	perPage: 10,
	totalPages: 1,
	totalRecords: 0
});

// Filters
const filters = ref({
	search: '',
	status: '',
	company: '',
	dateRange: '',
	customDateFrom: '',
	customDateTo: '',
	sortBy: 'date-desc'
});

// Debounce timer for search
let searchDebounceTimer = null;

// Computed: Unique companies from deliveries (for filter dropdown)
const uniqueCompanies = computed(() => {
	const companies = deliveries.value.map(d => d.company.name);
	return [...new Set(companies)].sort();
});

// Computed: Check if any filters are active
const hasActiveFilters = computed(() => {
	return filters.value.search !== '' ||
		filters.value.status !== '' ||
		filters.value.company !== '' ||
		filters.value.dateRange !== '';
});

// For display purposes, we now use deliveries directly from server
const filteredDeliveries = computed(() => deliveries.value);

// Build query parameters for API request
function buildQueryParams(page = 1) {
	const params = new URLSearchParams();

	// Pagination
	params.append('page', page);
	params.append('per_page', pagination.value.perPage);

	// Filters
	if (filters.value.search) {
		params.append('search', filters.value.search);
	}

	if (filters.value.status) {
		params.append('status', filters.value.status);
	}

	if (filters.value.company) {
		params.append('company', filters.value.company);
	}

	// Date range filters
	if (filters.value.dateRange) {
		if (filters.value.dateRange === 'custom') {
			if (filters.value.customDateFrom) {
				params.append('date_from', filters.value.customDateFrom);
			}
			if (filters.value.customDateTo) {
				params.append('date_to', filters.value.customDateTo);
			}
		} else {
			params.append('date_range', filters.value.dateRange);
		}
	}

	// Sort
	params.append('sort_by', filters.value.sortBy);

	return params.toString();
}

// Fetch deliveries with filters and pagination
async function fetchDeliveries(page = 1, showLoading = true) {
	if (showLoading) {
		isRefreshing.value = true;
	}
	try {
		const queryString = buildQueryParams(page);
		const res = await axios.get(`${API_BASE_URL}/delivery?${queryString}`);

		// Handle paginated response
		if (res.data.data) {
			// Assuming API returns: { data: [...], pagination: { current_page, total_pages, total, per_page } }
			deliveries.value = res.data.data;
			pagination.value = {
				currentPage: res.data.pagination?.current_page || page,
				perPage: res.data.pagination?.per_page || 10,
				totalPages: res.data.pagination?.total_pages || 1,
				totalRecords: res.data.pagination?.total || res.data.data.length
			};
		} else {
			// Fallback for non-paginated response
			deliveries.value = res.data;
			pagination.value = {
				currentPage: 1,
				perPage: res.data.length,
				totalPages: 1,
				totalRecords: res.data.length
			};
		}

		// Reset opened tabs when changing pages
		openedTabs.value = [];
	} catch (err) {
		console.error("Error fetching deliveries:", err);
	} finally {
		if (showLoading) {
			isRefreshing.value = false;
		}
	}
}

// Apply filters (called when any filter changes)
async function applyFilters() {
	isLoadingFilters.value = true;
	pagination.value.currentPage = 1; // Reset to first page
	await fetchDeliveries(1, false);
	isLoadingFilters.value = false;
}

// Debounced search to avoid too many API calls
function handleSearchChange() {
	clearTimeout(searchDebounceTimer);
	searchDebounceTimer = setTimeout(() => {
		applyFilters();
	}, 500); // Wait 500ms after user stops typing
}

// Watch for filter changes
watch(() => filters.value.search, handleSearchChange);

watch(() => [
	filters.value.status,
	filters.value.company,
	filters.value.dateRange,
	filters.value.customDateFrom,
	filters.value.customDateTo,
	filters.value.sortBy
], () => {
	applyFilters();
}, { deep: true });

// Clear all filters
function clearFilters() {
	filters.value = {
		search: '',
		status: '',
		company: '',
		dateRange: '',
		customDateFrom: '',
		customDateTo: '',
		sortBy: 'date-desc'
	};
	applyFilters();
}

// Pagination functions
function goToPage(page) {
	if (page >= 1 && page <= pagination.value.totalPages) {
		fetchDeliveries(page);
	}
}

function nextPage() {
	if (pagination.value.currentPage < pagination.value.totalPages) {
		goToPage(pagination.value.currentPage + 1);
	}
}

function previousPage() {
	if (pagination.value.currentPage > 1) {
		goToPage(pagination.value.currentPage - 1);
	}
}

// Generate page numbers for pagination
function getPageNumbers() {
	const pages = [];
	const current = pagination.value.currentPage;
	const total = pagination.value.totalPages;

	if (total <= 7) {
		// Show all pages if 7 or fewer
		for (let i = 1; i <= total; i++) {
			pages.push(i);
		}
	} else {
		// Always show first page
		pages.push(1);

		if (current > 3) {
			pages.push('...');
		}

		// Show pages around current page
		for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
			pages.push(i);
		}

		if (current < total - 2) {
			pages.push('...');
		}

		// Always show last page
		pages.push(total);
	}

	return pages;
}

function getLatLng(info) {
	try {
		if (info?.location?.lat && info?.location?.lng) {
			return {
				lat: parseFloat(info.location.lat),
				lng: parseFloat(info.location.lng),
			};
		}
		return { lat: -33.8688, lng: 151.2093 }; // Sydney default
	} catch {
		return { lat: -33.8688, lng: 151.2093 };
	}
}

function formatDate(iso) {
	return new Date(iso).toLocaleString("en-US", {
		dateStyle: "medium",
		timeStyle: "short",
	});
}

// Company logo mapping
function getCompanyLogo(companyName) {
	const logos = {
		'DHL': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/DHL_Logo.svg/200px-DHL_Logo.svg.png',
		'FedEx': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/FedEx_Express.svg/200px-FedEx_Express.svg.png',
		'UPS': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/UPS_logo_2014.svg/200px-UPS_logo_2014.svg.png',
		'USPS': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/US-PostalService-Logo.svg/200px-US-PostalService-Logo.svg.png',
		'Australia Post': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Australia_Post_logo.svg/200px-Australia_Post_logo.svg.png',
		'TNT': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/TNT_Express_logo.svg/200px-TNT_Express_logo.svg.png',
		'Aramex': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Aramex_Logo.svg/200px-Aramex_Logo.svg.png',
		'Uber Eats': 'https://logo.clearbit.com/ubereats.com',
		'Amazon': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/200px-Amazon_logo.svg.png',
	};

	// Try exact match first
	if (logos[companyName]) {
		return logos[companyName];
	}

	// Try case-insensitive match
	const lowerName = companyName.toLowerCase();
	for (const [key, value] of Object.entries(logos)) {
		if (key.toLowerCase() === lowerName) {
			return value;
		}
	}

	return null;
}

// Company tracking URL mapping
function getCompanyTrackingUrl(companyName, trackingNumber) {
	const trackingUrls = {
		'DHL': `https://www.dhl.com/en/express/tracking.html?AWB=${trackingNumber}`,
		'FedEx': `https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}`,
		'UPS': `https://www.ups.com/track?tracknum=${trackingNumber}`,
		'USPS': `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`,
		'Australia Post': `https://auspost.com.au/mypost/track/#/details/${trackingNumber}`,
		'TNT': `https://www.tnt.com/express/en_us/site/tracking.html?searchType=con&cons=${trackingNumber}`,
		'Aramex': `https://www.aramex.com/us/en/track/shipments?ShipmentNumber=${trackingNumber}`,
		'Uber Eats': `https://www.ubereats.com/orders/${trackingNumber}`,
		'Amazon': `https://www.amazon.com/progress-tracker/package/ref=ppx_yo_dt_b_track_package?_encoding=UTF8&itemId=${trackingNumber}`,
	};

	// Try exact match first
	if (trackingUrls[companyName]) {
		return trackingUrls[companyName];
	}

	// Try case-insensitive match
	const lowerName = companyName.toLowerCase();
	for (const [key, value] of Object.entries(trackingUrls)) {
		if (key.toLowerCase() === lowerName) {
			return value;
		}
	}

	// Default fallback - search on Google
	return `https://www.google.com/search?q=${encodeURIComponent(companyName + ' tracking ' + trackingNumber)}`;
}

// Initial load
onMounted(() => fetchDeliveries(1));

function toggleDelivery(index) {
	if (openedTabs.value.includes(index)) {
		openedTabs.value = openedTabs.value.filter(i => i !== index);
	} else {
		openedTabs.value.push(index);
		initializeMap(index);
	}
}

function initializeMap(index) {
	const delivery = filteredDeliveries.value[index];
	if (!delivery) return;
	nextTick(() => {
		const latLng = getLatLng(delivery.info);
		const mapId = "map-" + delivery.id;
		const mapContainer = document.getElementById(mapId);
		if (!mapContainer) return;
		if (mapContainer._leaflet_map) {
			setTimeout(() => {
				mapContainer._leaflet_map.invalidateSize();
			}, 100);
		} else {
			const map = L.map(mapContainer).setView([latLng.lat, latLng.lng], 5);
			L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
				maxZoom: 20,
				attribution: "© OpenStreetMap contributors",
			}).addTo(map);
			L.marker([latLng.lat, latLng.lng])
				.addTo(map)
				.bindPopup(`Package: ${delivery.package_id}`)
				.openPopup();
			mapContainer._leaflet_map = map;
			setTimeout(() => {
				map.invalidateSize();
			}, 100);
		}
	});
}

async function refreshDelivery(id, barcode) {
	loadingId.value = id;
	try {
		const res = await axios.get(`${API_BASE_URL}/delivery/${barcode}`);
		// Buscar el índice y actualizar solo ese item
		const idx = deliveries.value.findIndex(d => d.id === id);
		if (idx !== -1) {
			deliveries.value[idx] = res.data;
			// Esperar a que el DOM se actualice y refrescar el mapa
			await nextTick();
			const delivery = deliveries.value[idx];
			const latLng = getLatLng(delivery.info);
			const mapId = "map-" + delivery.id;
			const mapContainer = document.getElementById(mapId);
			if (mapContainer && delivery.info?.location) {
				if (mapContainer._leaflet_map) {
					// Actualiza la vista y el marcador
					mapContainer._leaflet_map.setView([latLng.lat, latLng.lng], 5);
					mapContainer._leaflet_map.eachLayer(layer => {
						if (layer instanceof L.Marker) {
							layer.setLatLng([latLng.lat, latLng.lng]);
							layer.setPopupContent(`Package: ${delivery.package_id}`);
						}
					});
					setTimeout(() => {
						mapContainer._leaflet_map.invalidateSize();
					}, 100);
				} else {
					// Si el mapa no existe, créalo
					const map = L.map(mapContainer).setView([latLng.lat, latLng.lng], 5);
					L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
						maxZoom: 20,
						attribution: "© OpenStreetMap contributors",
					}).addTo(map);
					L.marker([latLng.lat, latLng.lng])
						.addTo(map)
						.bindPopup(`Package: ${delivery.package_id}`)
						.openPopup();
					mapContainer._leaflet_map = map;
					setTimeout(() => {
						map.invalidateSize();
					}, 100);
				}
			}
		}
	} catch (err) {
		console.error('Error refreshing delivery:', err);
	} finally {
		loadingId.value = null;
	}
}

</script>

<style scoped>
.leaflet-container {
	z-index: 0;
}
</style>
