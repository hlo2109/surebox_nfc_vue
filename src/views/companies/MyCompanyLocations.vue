<template>
	<div class="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
		<div class="max-w-7xl mx-auto">
			<!-- Page Header -->
			<div class="mb-6 sm:mb-8">
				<h1
					class="text-3xl sm:text-4xl font-bold text-gray-900 mb-1 sm:mb-2"
				>
					Locations
				</h1>
				<p class="text-sm sm:text-base text-gray-600">
					Manage your company's locations
				</p>
			</div>

			<!-- Loading State -->
			<div
				v-if="loading && !locations.length"
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
					/>
					<path
						class="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					/>
				</svg>
				<p class="text-gray-600 font-medium">Loading locations...</p>
			</div>

			<!-- Error State -->
			<div
				v-else-if="loadError"
				class="bg-white rounded-xl border border-red-200 p-8 sm:p-12 text-center"
			>
				<div
					class="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-red-100 rounded-full flex items-center justify-center mb-4"
				>
					<svg
						class="w-8 h-8 sm:w-10 sm:h-10 text-red-600"
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
				<h3 class="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
					Error Loading Locations
				</h3>
				<p class="text-gray-600 mb-6">{{ loadError }}</p>
				<button
					@click="loadLocations"
					class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0D65AE] rounded-lg hover:bg-[#0D65AE]/90 transition-all"
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
							d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
						/>
					</svg>
					<span>Try Again</span>
				</button>
			</div>

			<!-- No Company State -->
			<div
				v-else-if="!companyId"
				class="text-center py-12 bg-white rounded-xl border border-gray-200"
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
						/>
					</svg>
				</div>
				<h3 class="text-xl font-semibold text-gray-900 mb-2">
					No Company Found
				</h3>
				<p class="text-gray-600 max-w-md mx-auto">
					You are not associated with any company yet. You need a
					company before you can manage locations.
				</p>
			</div>

			<!-- Locations Content -->
			<div
				v-else
				class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6"
			>
				<LocationsList
					:company-id="companyId"
					:locations="locations"
					:loading="loading"
					:can-add-locations="canManageCompanyLocations"
					:can-manage-locations="canManageCompanyLocations"
					@refresh="loadLocations"
				/>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth.store";
import { usePermissions, useCompanies } from "@/composables";
import LocationsList from "@/components/companies/LocationsList.vue";

const authStore = useAuthStore();
const companyId = computed(() => authStore.companyId.value);

const { canManageLocations, canEditCompany, isSuperAdmin } = usePermissions();

/** API permissions can omit manage_company_locations while the user is still company admin. */
const canManageCompanyLocations = computed(
	() =>
		canManageLocations.value ||
		canEditCompany.value ||
		authStore.isCompanyAdmin.value ||
		authStore.isAdmin.value ||
		isSuperAdmin.value,
);

const { fetchMyCompanyLocations } = useCompanies();

const locations = ref([]);
const loading = ref(false);
const loadError = ref(null);

async function loadLocations() {
	loading.value = true;
	loadError.value = null;
	try {
		const result = await fetchMyCompanyLocations();
		if (result.success) {
			locations.value = result.data;
		} else {
			loadError.value =
				result.error || "Failed to load locations. Please try again.";
		}
	} catch (err) {
		loadError.value = "An unexpected error occurred. Please try again.";
	} finally {
		loading.value = false;
	}
}

onMounted(async () => {
	if (companyId.value) {
		await loadLocations();
	}
});
</script>
