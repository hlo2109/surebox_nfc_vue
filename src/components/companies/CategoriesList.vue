<template>
	<div class="categories-list">
		<!-- Header -->
		<div class="flex items-center justify-between mb-6">
			<div>
				<h3 class="text-lg font-semibold text-gray-900">Categories</h3>
				<p class="text-sm text-gray-600 mt-1">
					{{ categoriesCount }} {{ categoriesCount === 1 ? 'category' : 'categories' }}
				</p>
			</div>
			<Button
				v-if="canAddCategories"
				label="Add Category"
				icon="pi pi-plus"
				class="p-button-sm"
				@click="handleAddCategory"
			/>
		</div>

		<!-- Loading State -->
		<LoadingSpinner v-if="loading" />

		<!-- Empty State -->
		<EmptyState
			v-else-if="!loading && categories.length === 0"
			icon="pi pi-tag"
			title="No categories yet"
			description="Add your first category to organize your services"
			:show-action="canAddCategories"
			action-label="Add Category"
			@action="handleAddCategory"
		/>

		<!-- Categories Grid -->
		<div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			<div
				v-for="category in categories"
				:key="category.id"
				class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
			>
				<!-- Category Header -->
				<div class="flex items-start justify-between mb-3">
					<div class="flex-1">
						<div class="flex items-center gap-2 mb-2">
							<div class="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
								<i class="pi pi-tag text-white text-lg"></i>
							</div>
							<h4 class="text-base font-semibold text-gray-900">
								{{ category.name }}
							</h4>
						</div>

						<p v-if="category.description" class="text-sm text-gray-600 line-clamp-2">
							{{ category.description }}
						</p>
					</div>

					<!-- Actions -->
					<div v-if="canManageCategories" class="flex items-center gap-1 ml-2">
						<Button
							icon="pi pi-pencil"
							class="p-button-sm p-button-text p-button-rounded"
							v-tooltip.left="'Edit category'"
							@click="handleEditCategory(category)"
						/>
						<Button
							icon="pi pi-trash"
							class="p-button-sm p-button-text p-button-rounded p-button-danger"
							v-tooltip.left="'Delete category'"
							@click="handleDeleteCategory(category)"
						/>
					</div>
				</div>

				<!-- Category Stats -->
				<div v-if="category.services_count !== undefined" class="mt-3 pt-3 border-t border-gray-100">
					<div class="flex items-center justify-between">
						<span class="text-xs text-gray-500">Services</span>
						<span class="text-sm font-medium text-gray-900">
							{{ category.services_count || 0 }}
						</span>
					</div>
				</div>

				<!-- Created Date -->
				<div v-if="category.created_at" class="mt-2">
					<p class="text-xs text-gray-500">
						Created {{ formatDate(category.created_at) }}
					</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { computed } from 'vue';
import Button from 'primevue/button';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import EmptyState from '@/components/common/EmptyState.vue';
import { formatDate } from '@/utils/formatters';

const props = defineProps({
	categories: {
		type: Array,
		default: () => [],
	},
	loading: {
		type: Boolean,
		default: false,
	},
	canAddCategories: {
		type: Boolean,
		default: true,
	},
	canManageCategories: {
		type: Boolean,
		default: true,
	},
});

const emit = defineEmits(['add-category', 'edit-category', 'delete-category']);

// Computed
const categoriesCount = computed(() => {
	return props.categories.length;
});

// Event handlers
const handleAddCategory = () => {
	emit('add-category');
};

const handleEditCategory = (category) => {
	emit('edit-category', category);
};

const handleDeleteCategory = (category) => {
	emit('delete-category', category);
};
</script>

<style scoped>
.categories-list {
	/* Component wrapper styles */
}

/* Line clamp utility for description */
.line-clamp-2 {
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
}
</style>
