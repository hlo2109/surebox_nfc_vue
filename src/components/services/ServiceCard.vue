<template>
	<div
		class="service-card bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden border border-gray-200"
		:class="{ 'opacity-60': !isActive }"
	>
		<!-- Service Header -->
		<div class="p-6">
			<div class="flex items-start justify-between mb-4">
				<div class="flex-1">
					<div class="flex items-center gap-2 mb-2">
						<h3 class="text-lg font-semibold text-gray-900">
							{{ service.name }}
						</h3>
						<span
							v-if="service.status"
							:class="statusClass"
							class="px-2 py-1 rounded-full text-xs font-medium"
						>
							{{ service.status }}
						</span>
					</div>

					<!-- Category Badge -->
					<div v-if="categoryName" class="flex items-center gap-2 mb-3">
						<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
							<i class="pi pi-tag mr-1 text-xs"></i>
							{{ categoryName }}
						</span>
					</div>

					<!-- Description -->
					<p v-if="service.description" class="text-sm text-gray-600 line-clamp-2">
						{{ service.description }}
					</p>
				</div>
			</div>

			<!-- Service Details -->
			<div class="grid grid-cols-2 gap-4 mb-4">
				<!-- Price -->
				<div class="flex items-center gap-2">
					<i class="pi pi-dollar text-gray-400"></i>
					<div>
						<p class="text-xs text-gray-500">Price</p>
						<p class="text-lg font-semibold text-gray-900">
							{{ formattedPrice }}
						</p>
					</div>
				</div>

				<!-- Duration -->
				<div v-if="service.duration" class="flex items-center gap-2">
					<i class="pi pi-clock text-gray-400"></i>
					<div>
						<p class="text-xs text-gray-500">Duration</p>
						<p class="text-sm font-medium text-gray-900">
							{{ formattedDuration }}
						</p>
					</div>
				</div>
			</div>

			<!-- Company Info (if showing company) -->
			<div v-if="showCompany && service.company" class="flex items-center gap-2 text-sm text-gray-600 pt-3 border-t border-gray-100">
				<i class="pi pi-building text-gray-400"></i>
				<span>{{ service.company.name }}</span>
			</div>
		</div>

		<!-- Actions Footer -->
		<div v-if="showActions" class="bg-gray-50 px-6 py-3 border-t border-gray-200 flex gap-2">
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
			<Button
				v-if="showBookButton"
				label="Book"
				icon="pi pi-calendar-plus"
				class="p-button-sm flex-1"
				@click.stop="handleBook"
			/>
		</div>

		<!-- Footer Info -->
		<div v-if="showDate && service.created_at" class="px-6 py-3 border-t border-gray-100">
			<p class="text-xs text-gray-500">
				<i class="pi pi-calendar mr-1"></i>
				Created {{ formatDate(service.created_at) }}
			</p>
		</div>
	</div>
</template>

<script setup>
import { computed } from 'vue';
import Button from 'primevue/button';
import { formatDate, formatCurrency, formatDuration } from '@/utils/formatters';

const props = defineProps({
	service: {
		type: Object,
		required: true,
	},
	showActions: {
		type: Boolean,
		default: false,
	},
	showBookButton: {
		type: Boolean,
		default: false,
	},
	showCompany: {
		type: Boolean,
		default: false,
	},
	showDate: {
		type: Boolean,
		default: true,
	},
});

const emit = defineEmits(['view', 'edit', 'book']);

// Computed properties
const isActive = computed(() => {
	return props.service.status === 'active' || !props.service.status;
});

const statusClass = computed(() => {
	const status = props.service.status?.toLowerCase();

	if (status === 'active') {
		return 'bg-green-100 text-green-800';
	} else if (status === 'inactive') {
		return 'bg-gray-100 text-gray-800';
	} else if (status === 'draft') {
		return 'bg-yellow-100 text-yellow-800';
	}

	return 'bg-gray-100 text-gray-800';
});

const categoryName = computed(() => {
	if (props.service.category?.name) {
		return props.service.category.name;
	}
	if (props.service.categoryName) {
		return props.service.categoryName;
	}
	return null;
});

const isQuote = computed(() => {
	const m = props.service.pricing_mode || props.service.pricingMode;
	return m === 'quote';
});

const formattedPrice = computed(() => {
	const list =
		props.service.price ??
		props.service.basePrice ??
		props.service.base_price;
	if (isQuote.value) {
		if (list == null || list === '') {
			return 'Quote on request';
		}
		return `${formatCurrency(list)} (guide)`;
	}
	if (list == null || list === '') {
		return 'N/A';
	}
	return formatCurrency(list);
});

const formattedDuration = computed(() => {
	if (!props.service.duration) return 'N/A';
	return formatDuration(props.service.duration);
});

// Event handlers
const handleView = () => {
	emit('view', props.service);
};

const handleEdit = () => {
	emit('edit', props.service);
};

const handleBook = () => {
	emit('book', props.service);
};
</script>

<style scoped>
.service-card {
	cursor: pointer;
	transition: all 0.2s ease;
}

.service-card:hover {
	transform: translateY(-2px);
}

/* Line clamp for description */
.line-clamp-2 {
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
}
</style>
