<template>
	<div class="service-categories-manager">
		<!-- Header -->
		<div class="flex items-center justify-between mb-6">
			<div>
				<h3 class="text-lg font-semibold text-gray-900">
					Service Categories
				</h3>
				<p class="text-sm text-gray-600 mt-1">
					Manage categories for organizing your services
				</p>
			</div>
			<button
				v-if="canCreate"
				@click="openCreateDialog"
				class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0D65AE] rounded-lg hover:bg-[#0a4f87] focus:ring-2 focus:ring-[#0D65AE] focus:ring-offset-2 transition-all"
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
					/>
				</svg>
				Add Category
			</button>
		</div>

		<!-- Loading State -->
		<div
			v-if="loading && categories.length === 0"
			class="flex items-center justify-center py-12"
		>
			<div class="text-center">
				<div
					class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0D65AE] mx-auto"
				></div>
				<p class="text-gray-600 mt-4">Loading categories...</p>
			</div>
		</div>

		<!-- Empty State -->
		<div
			v-else-if="!loading && categories.length === 0"
			class="text-center py-12 bg-white rounded-xl border border-gray-200"
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
					d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
				/>
			</svg>
			<h3 class="text-xl font-semibold text-gray-900 mb-2">
				No Categories Yet
			</h3>
			<p class="text-gray-600 mb-4">
				Create your first category to start organizing your services
			</p>
			<button
				v-if="canCreate"
				@click="openCreateDialog"
				class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0D65AE] rounded-lg hover:bg-[#0a4f87] transition-all"
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
					/>
				</svg>
				Add Category
			</button>
		</div>

		<!-- Categories Grid -->
		<div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			<div
				v-for="category in categories"
				:key="category.id"
				class="bg-white rounded-lg border border-gray-200 hover:border-[#0D65AE] transition-all p-4"
			>
				<div class="flex items-start justify-between mb-3">
					<div class="flex items-center gap-3 flex-1">
						<div
							class="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0"
						>
							<svg
								v-if="category.icon"
								class="w-5 h-5 text-purple-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									:d="category.icon"
								/>
							</svg>
							<svg
								v-else
								class="w-5 h-5 text-purple-600"
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
						<div class="flex-1 min-w-0">
							<h4
								class="text-sm font-semibold text-gray-900 truncate"
							>
								{{ category.name }}
							</h4>
							<p
								v-if="category.services_count !== undefined"
								class="text-xs text-gray-500 mt-0.5"
							>
								{{ category.services_count }}
								{{
									category.services_count === 1
										? "service"
										: "services"
								}}
							</p>
						</div>
					</div>

					<!-- Actions Dropdown -->
					<div v-if="canEdit || canDelete" class="relative">
						<button
							@click="toggleCategoryMenu(category.id)"
							class="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
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
									d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
								/>
							</svg>
						</button>

						<!-- Dropdown Menu -->
						<div
							v-if="activeCategoryMenu === category.id"
							v-click-outside="closeCategoryMenu"
							class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10"
						>
							<button
								v-if="canEdit"
								@click="openEditDialog(category)"
								class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
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
										d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
									/>
								</svg>
								Edit Category
							</button>
							<button
								v-if="canDelete"
								@click="confirmDelete(category)"
								class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
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
										d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
									/>
								</svg>
								Delete Category
							</button>
						</div>
					</div>
				</div>

				<p
					v-if="category.description"
					class="text-sm text-gray-600 line-clamp-2"
				>
					{{ category.description }}
				</p>
			</div>
		</div>

		<!-- Create/Edit Dialog -->
		<div
			v-if="showDialog"
			class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
			@click.self="closeDialog"
		>
			<div
				class="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
			>
				<div
					class="flex items-center justify-between p-6 border-b border-gray-200"
				>
					<h3 class="text-lg font-semibold text-gray-900">
						{{ editingCategory ? "Edit Category" : "Add Category" }}
					</h3>
					<button
						@click="closeDialog"
						class="text-gray-400 hover:text-gray-600 transition-colors"
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
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>

				<form @submit.prevent="submitCategory" class="p-6 space-y-4">
					<!-- Name -->
					<div>
						<label
							for="category-name"
							class="block text-sm font-semibold text-gray-900 mb-2"
						>
							Category Name *
						</label>
						<input
							id="category-name"
							v-model="categoryForm.name"
							type="text"
							required
							class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#0D65AE] focus:ring-2 focus:ring-[#0D65AE] focus:ring-opacity-20 focus:outline-none transition-all"
							placeholder="e.g., Cleaning Services"
						/>
						<p v-if="errors.name" class="mt-1 text-sm text-red-600">
							{{ errors.name }}
						</p>
					</div>

					<!-- Description -->
					<div>
						<label
							for="category-description"
							class="block text-sm font-semibold text-gray-900 mb-2"
						>
							Description
						</label>
						<textarea
							id="category-description"
							v-model="categoryForm.description"
							rows="3"
							class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#0D65AE] focus:ring-2 focus:ring-[#0D65AE] focus:ring-opacity-20 focus:outline-none transition-all resize-none"
							placeholder="Brief description of this category"
						></textarea>
					</div>

					<!-- Icon (optional) -->
					<div>
						<label
							for="category-icon"
							class="block text-sm font-semibold text-gray-900 mb-2"
						>
							Icon (SVG Path)
						</label>
						<input
							id="category-icon"
							v-model="categoryForm.icon"
							type="text"
							class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#0D65AE] focus:ring-2 focus:ring-[#0D65AE] focus:ring-opacity-20 focus:outline-none transition-all"
							placeholder="Optional SVG path data"
						/>
						<p class="mt-1 text-xs text-gray-500">
							Optional: SVG path data for custom icon
						</p>
					</div>

					<!-- Actions -->
					<div class="flex gap-3 pt-4">
						<button
							type="button"
							@click="closeDialog"
							:disabled="saving"
							class="flex-1 px-4 py-2 text-sm font-medium border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-[#0D65AE] focus:ring-offset-2 transition-all disabled:opacity-50"
						>
							Cancel
						</button>
						<button
							type="submit"
							:disabled="saving"
							class="flex-1 px-4 py-2 text-sm font-medium bg-[#0D65AE] text-white rounded-lg hover:bg-[#0a4f87] focus:ring-2 focus:ring-[#0D65AE] focus:ring-offset-2 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
						>
							<svg
								v-if="saving"
								class="animate-spin w-4 h-4"
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
							{{
								saving
									? "Saving..."
									: editingCategory
									? "Update Category"
									: "Add Category"
							}}
						</button>
					</div>
				</form>
			</div>
		</div>

		<!-- Delete Confirmation Dialog -->
		<div
			v-if="showDeleteDialog"
			class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
			@click.self="closeDeleteDialog"
		>
			<div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
				<div class="flex items-center gap-4 mb-4">
					<div
						class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0"
					>
						<svg
							class="w-6 h-6 text-red-600"
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
					</div>
					<div>
						<h3 class="text-lg font-semibold text-gray-900">
							Delete Category
						</h3>
						<p class="text-sm text-gray-600 mt-1">
							Are you sure you want to delete "{{
								categoryToDelete?.name
							}}"?
						</p>
					</div>
				</div>

				<p class="text-sm text-gray-600 mb-6">
					This action cannot be undone. Services in this category will
					need to be reassigned.
				</p>

				<div class="flex gap-3">
					<button
						@click="closeDeleteDialog"
						:disabled="deleting"
						class="flex-1 px-4 py-2 text-sm font-medium border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50"
					>
						Cancel
					</button>
					<button
						@click="handleDelete"
						:disabled="deleting"
						class="flex-1 px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
					>
						<svg
							v-if="deleting"
							class="animate-spin w-4 h-4"
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
						{{ deleting ? "Deleting..." : "Delete Category" }}
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useServices } from "@/composables/useServices";

const props = defineProps({
	categories: {
		type: Array,
		default: () => [],
	},
	loading: {
		type: Boolean,
		default: false,
	},
	canCreate: {
		type: Boolean,
		default: true,
	},
	canEdit: {
		type: Boolean,
		default: true,
	},
	canDelete: {
		type: Boolean,
		default: true,
	},
});

const emit = defineEmits(["refresh", "category-created", "category-updated", "category-deleted"]);

const {
	createServiceCategory,
	updateServiceCategory,
	deleteServiceCategory,
} = useServices();

// State
const showDialog = ref(false);
const showDeleteDialog = ref(false);
const editingCategory = ref(null);
const categoryToDelete = ref(null);
const saving = ref(false);
const deleting = ref(false);
const activeCategoryMenu = ref(null);

const categoryForm = ref({
	name: "",
	description: "",
	icon: "",
});

const errors = ref({});

// Methods
const openCreateDialog = () => {
	editingCategory.value = null;
	categoryForm.value = {
		name: "",
		description: "",
		icon: "",
	};
	errors.value = {};
	showDialog.value = true;
};

const openEditDialog = (category) => {
	editingCategory.value = category;
	categoryForm.value = {
		name: category.name || "",
		description: category.description || "",
		icon: category.icon || "",
	};
	errors.value = {};
	showDialog.value = true;
	closeCategoryMenu();
};

const closeDialog = () => {
	showDialog.value = false;
	editingCategory.value = null;
	categoryForm.value = {
		name: "",
		description: "",
		icon: "",
	};
	errors.value = {};
};

const validateForm = () => {
	errors.value = {};

	if (!categoryForm.value.name || categoryForm.value.name.trim() === "") {
		errors.value.name = "Category name is required";
	}

	return Object.keys(errors.value).length === 0;
};

const submitCategory = async () => {
	if (!validateForm()) {
		return;
	}

	saving.value = true;

	try {
		const categoryData = {
			name: categoryForm.value.name.trim(),
			description: categoryForm.value.description.trim() || undefined,
			icon: categoryForm.value.icon.trim() || undefined,
		};

		let result;
		if (editingCategory.value) {
			result = await updateServiceCategory(
				editingCategory.value.id,
				categoryData
			);
			if (result.success) {
				emit("category-updated", result.data);
			}
		} else {
			result = await createServiceCategory(categoryData);
			if (result.success) {
				emit("category-created", result.data);
			}
		}

		if (result.success) {
			closeDialog();
			emit("refresh");
		}
	} catch (error) {
		console.error("Error saving category:", error);
	} finally {
		saving.value = false;
	}
};

const confirmDelete = (category) => {
	categoryToDelete.value = category;
	showDeleteDialog.value = true;
	closeCategoryMenu();
};

const closeDeleteDialog = () => {
	showDeleteDialog.value = false;
	categoryToDelete.value = null;
};

const handleDelete = async () => {
	if (!categoryToDelete.value) return;

	deleting.value = true;

	try {
		const result = await deleteServiceCategory(categoryToDelete.value.id);

		if (result.success) {
			emit("category-deleted", categoryToDelete.value.id);
			closeDeleteDialog();
			emit("refresh");
		}
	} catch (error) {
		console.error("Error deleting category:", error);
	} finally {
		deleting.value = false;
	}
};

const toggleCategoryMenu = (categoryId) => {
	if (activeCategoryMenu.value === categoryId) {
		activeCategoryMenu.value = null;
	} else {
		activeCategoryMenu.value = categoryId;
	}
};

const closeCategoryMenu = () => {
	activeCategoryMenu.value = null;
};

// Click outside directive
const vClickOutside = {
	mounted(el, binding) {
		el.clickOutsideEvent = (event) => {
			if (!(el === event.target || el.contains(event.target))) {
				binding.value(event);
			}
		};
		document.addEventListener("click", el.clickOutsideEvent);
	},
	unmounted(el) {
		document.removeEventListener("click", el.clickOutsideEvent);
	},
};
</script>

<style scoped>
.line-clamp-2 {
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
}
</style>
