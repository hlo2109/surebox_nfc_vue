<template>
	<div class="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
		<div class="max-w-7xl mx-auto">
			<!-- Page Header -->
			<div class="mb-6 sm:mb-8">
				<h1 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">
					Categories
				</h1>
				<p class="text-sm sm:text-base text-gray-600">
					Manage service categories for your company
				</p>
			</div>

			<!-- No Company State -->
			<div
				v-if="!loading && !companyId"
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
						d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
					/>
				</svg>
				<h3 class="text-xl font-semibold text-gray-900 mb-2">
					No Company Found
				</h3>
				<p class="text-gray-600 mb-4">
					You need to be associated with a company to manage categories
				</p>
			</div>

			<!-- Loading State -->
			<div
				v-else-if="loading"
				class="flex items-center justify-center py-12"
			>
				<div class="text-center">
					<div
						class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0D65AE] mx-auto"
					></div>
					<p class="text-gray-600 mt-4">Loading categories...</p>
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
					Error Loading Categories
				</h3>
				<p class="text-gray-600 mb-4">{{ error }}</p>
				<button
					@click="loadCategories"
					class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0D65AE] rounded-lg hover:bg-[#0a4f87] transition-all"
				>
					Try Again
				</button>
			</div>

			<!-- Content -->
			<div
				v-else
				class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6"
			>
				<ServiceCategoriesManager
					:company-id="companyId"
					:categories="categories"
					:loading="loading"
					:can-create="canManageCategories"
					:can-edit="canManageCategories"
					:can-delete="canManageCategories"
					@refresh="loadCategories"
				/>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth.store";
import { usePermissions } from "@/composables/usePermissions";
import { useServices } from "@/composables/useServices";
import ServiceCategoriesManager from "@/components/services/ServiceCategoriesManager.vue";

const authStore = useAuthStore();
const { canManageCategories } = usePermissions();
const { fetchMyCompanyCategories } = useServices();

// State
const loading = ref(false);
const error = ref(null);
const categories = ref([]);

// Computed
const companyId = computed(() => authStore.companyId.value);

// Methods
const loadCategories = async () => {
	if (!companyId.value) {
		loading.value = false;
		return;
	}

	loading.value = true;
	error.value = null;

	try {
		const result = await fetchMyCompanyCategories();
		if (result.success) {
			categories.value = result.data;
		} else {
			throw new Error(result.error || "Failed to load categories");
		}
	} catch (err) {
		console.error("Error loading categories:", err);
		error.value = err.message || "Failed to load categories";
	} finally {
		loading.value = false;
	}
};

// Lifecycle
onMounted(() => {
	loadCategories();
});
</script>
