<template>
	<Card class="service-request-card hover:shadow-lg transition-shadow cursor-pointer" @click="handleClick">
		<template #header>
			<div class="flex items-center justify-between p-4 border-b">
				<div class="flex items-center gap-3">
					<div :class="statusIconClass">
						<i :class="statusIcon" class="text-xl"></i>
					</div>
					<div>
						<h3 class="font-semibold text-lg">{{ request.service?.name || 'Service Request' }}</h3>
						<p class="text-sm text-gray-500">{{ formattedDate }}</p>
					</div>
				</div>
				<Tag :value="statusLabel" :severity="statusSeverity" />
			</div>
		</template>

		<template #content>
			<div class="space-y-3">
				<!-- Location -->
				<div class="flex items-start gap-2">
					<i class="pi pi-map-marker text-gray-400 mt-1"></i>
					<div class="flex-1">
						<p class="text-sm text-gray-600">Location</p>
						<p class="font-medium">{{ request.location || 'Not specified' }}</p>
					</div>
				</div>

				<!-- Description -->
				<div v-if="request.description" class="flex items-start gap-2">
					<i class="pi pi-align-left text-gray-400 mt-1"></i>
					<div class="flex-1">
						<p class="text-sm text-gray-600">Description</p>
						<p class="text-gray-800 line-clamp-2">{{ request.description }}</p>
					</div>
				</div>

				<!-- Budget -->
				<div v-if="request.budget" class="flex items-start gap-2">
					<i class="pi pi-dollar text-gray-400 mt-1"></i>
					<div class="flex-1">
						<p class="text-sm text-gray-600">Budget</p>
						<p class="font-medium text-green-600">{{ formatCurrency(request.budget) }}</p>
					</div>
				</div>

				<!-- Preferred Date -->
				<div v-if="request.preferredDate" class="flex items-start gap-2">
					<i class="pi pi-calendar text-gray-400 mt-1"></i>
					<div class="flex-1">
						<p class="text-sm text-gray-600">Preferred Date</p>
						<p class="font-medium">{{ formatDate(request.preferredDate) }}</p>
					</div>
				</div>

				<!-- Quotes Count -->
				<div v-if="request.quotes && request.quotes.length > 0" class="flex items-center gap-2 pt-2 border-t">
					<i class="pi pi-file text-blue-500"></i>
					<span class="text-sm font-medium text-blue-600">
						{{ request.quotes.length }} {{ request.quotes.length === 1 ? 'Quote' : 'Quotes' }}
					</span>
				</div>

				<!-- Assigned Employee -->
				<div v-if="request.assignment?.employee" class="flex items-center gap-2 pt-2 border-t">
					<i class="pi pi-user text-purple-500"></i>
					<span class="text-sm font-medium text-purple-600">
						Assigned to {{ request.assignment.employee.name }}
					</span>
				</div>
			</div>
		</template>

		<template #footer>
			<div class="flex items-center justify-between pt-3 border-t">
				<div class="flex items-center gap-2 text-sm text-gray-500">
					<i class="pi pi-building"></i>
					<span>{{ request.service?.company?.name || 'Company' }}</span>
				</div>
				<Button
					:label="actionLabel"
					:icon="actionIcon"
					size="small"
					:severity="actionSeverity"
					@click.stop="handleAction"
				/>
			</div>
		</template>
	</Card>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import Card from 'primevue/card';
import Tag from 'primevue/tag';
import Button from 'primevue/button';
import { formatCurrency, formatDate, formatDateTime } from '@/utils/formatters';

const props = defineProps({
	request: {
		type: Object,
		required: true
	}
});

const emit = defineEmits(['click', 'action']);

const router = useRouter();

// Status mapping
const statusConfig = {
	pending: {
		label: 'Pending',
		severity: 'warning',
		icon: 'pi pi-clock',
		iconClass: 'bg-yellow-100 text-yellow-600 w-10 h-10 rounded-full flex items-center justify-center',
		actionLabel: 'View Details',
		actionIcon: 'pi pi-eye',
		actionSeverity: 'info'
	},
	quoted: {
		label: 'Quoted',
		severity: 'info',
		icon: 'pi pi-file',
		iconClass: 'bg-blue-100 text-blue-600 w-10 h-10 rounded-full flex items-center justify-center',
		actionLabel: 'View Quotes',
		actionIcon: 'pi pi-eye',
		actionSeverity: 'info'
	},
	accepted: {
		label: 'Accepted',
		severity: 'success',
		icon: 'pi pi-check-circle',
		iconClass: 'bg-green-100 text-green-600 w-10 h-10 rounded-full flex items-center justify-center',
		actionLabel: 'View Details',
		actionIcon: 'pi pi-arrow-right',
		actionSeverity: 'success'
	},
	in_progress: {
		label: 'In Progress',
		severity: 'info',
		icon: 'pi pi-spinner',
		iconClass: 'bg-blue-100 text-blue-600 w-10 h-10 rounded-full flex items-center justify-center',
		actionLabel: 'Track',
		actionIcon: 'pi pi-map-marker',
		actionSeverity: 'info'
	},
	completed: {
		label: 'Completed',
		severity: 'success',
		icon: 'pi pi-check',
		iconClass: 'bg-green-100 text-green-600 w-10 h-10 rounded-full flex items-center justify-center',
		actionLabel: 'View',
		actionIcon: 'pi pi-eye',
		actionSeverity: 'secondary'
	},
	cancelled: {
		label: 'Cancelled',
		severity: 'danger',
		icon: 'pi pi-times-circle',
		iconClass: 'bg-red-100 text-red-600 w-10 h-10 rounded-full flex items-center justify-center',
		actionLabel: 'View',
		actionIcon: 'pi pi-eye',
		actionSeverity: 'secondary'
	},
	rejected: {
		label: 'Rejected',
		severity: 'danger',
		icon: 'pi pi-ban',
		iconClass: 'bg-red-100 text-red-600 w-10 h-10 rounded-full flex items-center justify-center',
		actionLabel: 'View',
		actionIcon: 'pi pi-eye',
		actionSeverity: 'secondary'
	}
};

const currentStatus = computed(() => {
	return statusConfig[props.request.status] || statusConfig.pending;
});

const statusLabel = computed(() => currentStatus.value.label);
const statusSeverity = computed(() => currentStatus.value.severity);
const statusIcon = computed(() => currentStatus.value.icon);
const statusIconClass = computed(() => currentStatus.value.iconClass);
const actionLabel = computed(() => currentStatus.value.actionLabel);
const actionIcon = computed(() => currentStatus.value.actionIcon);
const actionSeverity = computed(() => currentStatus.value.actionSeverity);

const formattedDate = computed(() => {
	return formatDateTime(props.request.createdAt || props.request.created_at);
});

const handleClick = () => {
	emit('click', props.request);
	router.push({ name: 'RequestDetail', params: { id: props.request.id } });
};

const handleAction = () => {
	emit('action', props.request);
	router.push({ name: 'RequestDetail', params: { id: props.request.id } });
};
</script>

<style scoped>
.service-request-card {
	border-radius: 12px;
}

.line-clamp-2 {
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
}

.service-request-card:hover {
	transform: translateY(-2px);
	transition: transform 0.2s ease-in-out;
}
</style>
