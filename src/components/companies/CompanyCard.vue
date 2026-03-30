<template>
	<div
		class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden cursor-pointer border border-gray-200"
		@click="handleClick"
	>
		<!-- Company Header -->
		<div class="p-6">
			<div class="flex items-start justify-between mb-4">
				<div class="flex-1">
					<h3 class="text-xl font-semibold text-gray-900 mb-1">
						{{ company.name }}
					</h3>
					<p v-if="company.email" class="text-sm text-gray-600 flex items-center gap-1">
						<i class="pi pi-envelope text-xs"></i>
						{{ company.email }}
					</p>
				</div>

				<!-- Status Badge -->
				<span
					:class="statusClass"
					class="px-3 py-1 rounded-full text-xs font-medium"
				>
					{{ statusText }}
				</span>
			</div>

			<!-- Company Info -->
			<div class="space-y-2">
				<div v-if="company.phone" class="flex items-center gap-2 text-sm text-gray-700">
					<i class="pi pi-phone text-gray-400"></i>
					<span>{{ company.phone }}</span>
				</div>

				<div v-if="company.address" class="flex items-center gap-2 text-sm text-gray-700">
					<i class="pi pi-map-marker text-gray-400"></i>
					<span>{{ fullAddress }}</span>
				</div>
			</div>
		</div>

		<!-- Company Stats -->
		<div class="bg-gray-50 px-6 py-4 border-t border-gray-200">
			<div class="grid grid-cols-2 gap-4">
				<div class="text-center">
					<p class="text-2xl font-bold text-gray-900">
						{{ company.members_count || 0 }}
					</p>
					<p class="text-xs text-gray-600 mt-1">Members</p>
				</div>
				<div class="text-center">
					<p class="text-2xl font-bold text-gray-900">
						{{ company.locations_count || 0 }}
					</p>
					<p class="text-xs text-gray-600 mt-1">Locations</p>
				</div>
			</div>
		</div>

		<!-- Actions Footer (Optional) -->
		<div v-if="showActions" class="bg-white px-6 py-3 border-t border-gray-200 flex gap-2">
			<Button
				label="View"
				icon="pi pi-eye"
				class="p-button-sm p-button-text flex-1"
				@click.stop="handleView"
			/>
			<Button
				label="Edit"
				icon="pi pi-pencil"
				class="p-button-sm p-button-text flex-1"
				@click.stop="handleEdit"
			/>
		</div>

		<!-- Created Date -->
		<div v-if="showDate" class="px-6 pb-3 text-xs text-gray-500">
			Created {{ formattedDate }}
		</div>
	</div>
</template>

<script setup>
import { computed } from 'vue';
import Button from 'primevue/button';
import { formatDate } from '@/utils/formatters';

const props = defineProps({
	company: {
		type: Object,
		required: true,
	},
	showActions: {
		type: Boolean,
		default: false,
	},
	showDate: {
		type: Boolean,
		default: true,
	},
});

const emit = defineEmits(['click', 'view', 'edit']);

// Computed properties
const statusClass = computed(() => {
	const status = props.company.status?.toLowerCase();

	if (status === 'active') {
		return 'bg-green-100 text-green-800';
	} else if (status === 'inactive') {
		return 'bg-gray-100 text-gray-800';
	} else if (status === 'pending') {
		return 'bg-yellow-100 text-yellow-800';
	}

	return 'bg-gray-100 text-gray-800';
});

const statusText = computed(() => {
	return props.company.status || 'Unknown';
});

const fullAddress = computed(() => {
	const parts = [
		props.company.address,
		props.company.city,
		props.company.country,
	].filter(Boolean);

	return parts.join(', ');
});

const formattedDate = computed(() => {
	if (!props.company.created_at) return '';
	return formatDate(props.company.created_at);
});

// Event handlers
const handleClick = () => {
	emit('click', props.company);
};

const handleView = () => {
	emit('view', props.company);
};

const handleEdit = () => {
	emit('edit', props.company);
};
</script>

<style scoped>
/* Additional hover effects */
.bg-white:hover {
	transform: translateY(-2px);
	transition: transform 0.2s ease;
}
</style>
