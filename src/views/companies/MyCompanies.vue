<template>
	<div class="bg-gray-50 p-4 sm:p-6 lg:p-8">
		<div class="max-w-7xl mx-auto">
			<!-- Header Section -->
			<div class="mb-6 sm:mb-8">
				<div
					class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
				>
					<div>
						<h1
							class="text-3xl sm:text-4xl font-bold text-gray-900 mb-1 sm:mb-2"
						>
							My Companies
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
									d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
								></path>
							</svg>
							Manage your companies and team memberships
						</p>
					</div>
					<div class="flex items-center gap-2 sm:gap-3">
						<button
							@click="loadCompanies"
							:disabled="isLoading"
							class="inline-flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-[#0D65AE] focus:ring-offset-2 disabled:opacity-50 transition-all"
						>
							<svg
								:class="[
									'w-4 h-4',
									isLoading ? 'animate-spin' : '',
								]"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
								></path>
							</svg>
							<span class="hidden sm:inline">Refresh</span>
						</button>
						<button
							v-if="canCreateCompany"
							@click="handleCreateCompany"
							class="inline-flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-medium text-white bg-[#0D65AE] rounded-lg hover:bg-[#0D65AE]/90 focus:ring-2 focus:ring-[#0D65AE] focus:ring-offset-2 transition-all"
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
									d="M12 4v16m8-8H4"
								></path>
							</svg>
							<span>Create Company</span>
						</button>
					</div>
				</div>
			</div>

			<!-- Stats Cards -->
			<div
				class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8"
			>
				<!-- Total Companies -->
				<div
					class="bg-white rounded-xl border border-gray-200 hover:border-[#0D65AE] transition-all p-5 sm:p-6"
				>
					<div class="flex items-center justify-between">
						<div class="flex-1">
							<p
								class="text-gray-500 text-xs sm:text-sm font-medium mb-1 sm:mb-2"
							>
								Total Companies
							</p>
							<h3
								class="text-2xl sm:text-3xl font-bold text-gray-900"
							>
								{{ companiesCount }}
							</h3>
							<p
								class="text-[#0D65AE] text-xs sm:text-sm mt-2 flex items-center gap-1"
							>
								<svg
									class="w-3 h-3 sm:w-4 sm:h-4"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path
										fill-rule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
										clip-rule="evenodd"
									></path>
								</svg>
								<span>All organizations</span>
							</p>
						</div>
						<div
							class="bg-[#0D65AE]/10 p-3 sm:p-4 rounded-xl border border-[#0D65AE]/20"
						>
							<svg
								class="w-6 h-6 sm:w-8 sm:h-8 text-[#0D65AE]"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
								></path>
							</svg>
						</div>
					</div>
				</div>

				<!-- Active Companies -->
				<div
					class="bg-white rounded-xl border border-gray-200 hover:border-green-400 transition-all p-5 sm:p-6"
				>
					<div class="flex items-center justify-between">
						<div class="flex-1">
							<p
								class="text-gray-500 text-xs sm:text-sm font-medium mb-1 sm:mb-2"
							>
								Active
							</p>
							<h3
								class="text-2xl sm:text-3xl font-bold text-gray-900"
							>
								{{ activeCompaniesCount }}
							</h3>
							<p
								class="text-green-600 text-xs sm:text-sm mt-2 flex items-center gap-1"
							>
								<svg
									class="w-3 h-3 sm:w-4 sm:h-4"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path
										fill-rule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
										clip-rule="evenodd"
									></path>
								</svg>
								<span>Currently active</span>
							</p>
						</div>
						<div
							class="bg-green-50 p-3 sm:p-4 rounded-xl border border-green-200"
						>
							<svg
								class="w-6 h-6 sm:w-8 sm:h-8 text-green-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
								></path>
							</svg>
						</div>
					</div>
				</div>

				<!-- Total Members -->
				<div
					class="bg-white rounded-xl border border-gray-200 hover:border-purple-400 transition-all p-5 sm:p-6"
				>
					<div class="flex items-center justify-between">
						<div class="flex-1">
							<p
								class="text-gray-500 text-xs sm:text-sm font-medium mb-1 sm:mb-2"
							>
								Total Members
							</p>
							<h3
								class="text-2xl sm:text-3xl font-bold text-gray-900"
							>
								{{ totalMembers }}
							</h3>
							<p
								class="text-purple-600 text-xs sm:text-sm mt-2 flex items-center gap-1"
							>
								<svg
									class="w-3 h-3 sm:w-4 sm:h-4"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path
										d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"
									></path>
								</svg>
								<span>Across all companies</span>
							</p>
						</div>
						<div
							class="bg-purple-50 p-3 sm:p-4 rounded-xl border border-purple-200"
						>
							<svg
								class="w-6 h-6 sm:w-8 sm:h-8 text-purple-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
								></path>
							</svg>
						</div>
					</div>
				</div>
			</div>

			<!-- Filters & Search -->
			<div
				class="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 mb-6"
			>
				<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
					<!-- Search -->
					<div class="md:col-span-2">
						<div class="relative">
							<div
								class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
							>
								<svg
									class="h-5 w-5 text-gray-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
									></path>
								</svg>
							</div>
							<input
								v-model="searchQuery"
								type="text"
								placeholder="Search companies..."
								class="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D65AE] focus:border-transparent text-sm transition-all"
							/>
						</div>
					</div>

					<!-- Status Filter -->
					<div>
						<select
							v-model="selectedStatus"
							class="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D65AE] focus:border-transparent text-sm transition-all"
						>
							<option
								v-for="option in statusOptions"
								:key="option.value"
								:value="option.value"
							>
								{{ option.label }}
							</option>
						</select>
					</div>
				</div>
			</div>

			<!-- Loading State -->
			<div
				v-if="isLoading && !state.companies.length"
				class="flex flex-col items-center justify-center py-12 sm:py-16"
			>
				<svg
					class="animate-spin h-12 w-12 text-[#0D65AE] mb-4"
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
					></circle>
					<path
						class="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					></path>
				</svg>
				<p class="text-gray-600 font-medium">Loading companies...</p>
			</div>

			<!-- Empty State -->
			<div
				v-else-if="!filteredCompanies.length && !searchQuery"
				class="bg-white rounded-xl border border-gray-200 p-8 sm:p-12 text-center"
			>
				<div
					class="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4"
				>
					<svg
						class="w-8 h-8 sm:w-10 sm:h-10 text-gray-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
						></path>
					</svg>
				</div>
				<h3 class="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
					No companies yet
				</h3>
				<p class="text-gray-600 mb-6 max-w-md mx-auto">
					Create your first company to get started with team
					collaboration and service management
				</p>
				<button
					v-if="canCreateCompany"
					@click="handleCreateCompany"
					class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0D65AE] rounded-lg hover:bg-[#0D65AE]/90 focus:ring-2 focus:ring-[#0D65AE] focus:ring-offset-2 transition-all"
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
							d="M12 4v16m8-8H4"
						></path>
					</svg>
					<span>Create Company</span>
				</button>
			</div>

			<!-- No Results State -->
			<div
				v-else-if="!filteredCompanies.length && searchQuery"
				class="bg-white rounded-xl border border-gray-200 p-8 sm:p-12 text-center"
			>
				<div
					class="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4"
				>
					<svg
						class="w-8 h-8 sm:w-10 sm:h-10 text-gray-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						></path>
					</svg>
				</div>
				<h3 class="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
					No companies found
				</h3>
				<p class="text-gray-600 max-w-md mx-auto">
					No companies match your search:
					<span class="font-medium">"{{ searchQuery }}"</span>
				</p>
			</div>

			<!-- Companies Grid -->
			<div
				v-else
				class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
			>
				<div
					v-for="company in filteredCompanies"
					:key="company.id"
					class="bg-white rounded-xl border border-gray-200 hover:border-[#0D65AE] hover:shadow-lg transition-all p-5 sm:p-6 cursor-pointer group"
					@click="handleViewCompany(company)"
				>
					<!-- Company Header -->
					<div class="flex items-start justify-between mb-4">
						<div class="flex items-center gap-3 flex-1 min-w-0">
							<div
								class="w-12 h-12 bg-gradient-to-br from-[#0D65AE] to-[#0D65AE]/70 rounded-xl flex items-center justify-center flex-shrink-0"
							>
								<span class="text-white font-bold text-lg">
									{{
										company.name?.charAt(0).toUpperCase() ||
										"C"
									}}
								</span>
							</div>
							<div class="flex-1 min-w-0">
								<h3
									class="font-semibold text-gray-900 group-hover:text-[#0D65AE] transition-colors line-clamp-1"
								>
									{{ company.name }}
								</h3>
								<span
									:class="[
										'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1',
										company.status?.toLowerCase() ===
										'active'
											? 'bg-green-100 text-green-800'
											: 'bg-gray-100 text-gray-800',
									]"
								>
									{{ company.status || "Active" }}
								</span>
							</div>
						</div>
					</div>

					<!-- Company Details -->
					<div class="space-y-2 mb-4">
						<div
							v-if="company.email"
							class="flex items-center gap-2 text-sm text-gray-600"
						>
							<svg
								class="w-4 h-4 text-gray-400 flex-shrink-0"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
								></path>
							</svg>
							<span class="truncate">{{ company.email }}</span>
						</div>
						<div
							v-if="company.phone"
							class="flex items-center gap-2 text-sm text-gray-600"
						>
							<svg
								class="w-4 h-4 text-gray-400 flex-shrink-0"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
								></path>
							</svg>
							<span>{{ company.phone }}</span>
						</div>
						<div
							v-if="company.address || company.city"
							class="flex items-center gap-2 text-sm text-gray-600"
						>
							<svg
								class="w-4 h-4 text-gray-400 flex-shrink-0"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
								></path>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
								></path>
							</svg>
							<span class="truncate">{{
								company.city || company.address
							}}</span>
						</div>
					</div>

					<!-- Company Stats -->
					<div
						class="flex items-center justify-between pt-4 border-t border-gray-100"
					>
						<div
							class="flex items-center gap-2 text-sm text-gray-600"
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
									d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
								></path>
							</svg>
							<span
								>{{ company.members_count || 0 }} members</span
							>
						</div>
						<button
							v-if="canManage(company.id)"
							@click.stop="handleEditCompany(company)"
							class="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-[#0D65AE] bg-[#0D65AE]/5 rounded-lg hover:bg-[#0D65AE]/10 transition-colors"
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
									d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
								></path>
							</svg>
							<span>Edit</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useCompanies } from "@/composables/useCompanies";
import { useToast } from "@/composables/useToast";
import { usePermissions } from "@/composables/usePermissions";

const router = useRouter();
const { showError } = useToast();
const { canCreateCompany, canManage } = usePermissions();

// Composable
const { state, companiesCount, activeCompanies, fetchCompanies } =
	useCompanies();

// Local state
const isLoading = ref(false);
const searchQuery = ref("");
const selectedStatus = ref("all");

// Status options
const statusOptions = [
	{ label: "All Companies", value: "all" },
	{ label: "Active", value: "active" },
	{ label: "Inactive", value: "inactive" },
];

// Computed
const activeCompaniesCount = computed(() => activeCompanies.value.length);

const totalMembers = computed(() => {
	return state.companies.reduce((sum, company) => {
		return sum + (company.members_count || 0);
	}, 0);
});

const filteredCompanies = computed(() => {
	let companies = [...state.companies];

	// Filter by status
	if (selectedStatus.value !== "all") {
		companies = companies.filter(
			(company) => company.status?.toLowerCase() === selectedStatus.value,
		);
	}

	// Filter by search query
	if (searchQuery.value) {
		const query = searchQuery.value.toLowerCase();
		companies = companies.filter((company) => {
			return (
				company.name?.toLowerCase().includes(query) ||
				company.email?.toLowerCase().includes(query) ||
				company.address?.toLowerCase().includes(query) ||
				company.city?.toLowerCase().includes(query)
			);
		});
	}

	return companies;
});

// Methods
const loadCompanies = async () => {
	isLoading.value = true;

	try {
		await fetchCompanies({
			page: 1,
			limit: 100,
		});
	} catch (error) {
		showError("Failed to load companies");
		console.error("Error loading companies:", error);
	} finally {
		isLoading.value = false;
	}
};

const handleCreateCompany = () => {
	router.push({ name: "CreateCompany" });
};

const handleViewCompany = (company) => {
	router.push({
		name: "CompanyDetail",
		params: { id: company.id },
	});
};

const handleEditCompany = (company) => {
	// Check permission before navigating
	if (!canManage(company.id)) {
		showError("You do not have permission to edit this company");
		return;
	}

	router.push({
		name: "EditCompany",
		params: { id: company.id },
	});
};

// Lifecycle
onMounted(() => {
	loadCompanies();
});
</script>

<style scoped>
.line-clamp-1 {
	display: -webkit-box;
	-webkit-line-clamp: 1;
	-webkit-box-orient: vertical;
	overflow: hidden;
}
</style>
