<template>
	<Card class="quote-card" :class="cardClass">
		<template #header>
			<div class="flex items-center justify-between p-4 border-b">
				<div class="flex items-center gap-3">
					<div :class="statusIconClass">
						<i :class="statusIcon" class="text-xl"></i>
					</div>
					<div>
						<h4 class="font-semibold text-lg">Quote #{{ quote.id }}</h4>
						<p class="text-sm text-gray-500">{{ formattedDate }}</p>
					</div>
				</div>
				<Tag :value="statusLabel" :severity="statusSeverity" />
			</div>
		</template>

		<template #content>
			<div class="space-y-4">
				<!-- Amount -->
				<div class="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
					<div>
						<p class="text-sm text-gray-600">Quote Amount</p>
						<p class="text-2xl font-bold text-green-600">{{ formatCurrency(quote.amount) }}</p>
					</div>
					<i class="pi pi-dollar text-4xl text-gray-300"></i>
				</div>

				<!-- Estimated Days -->
				<div class="flex items-start gap-2">
					<i class="pi pi-calendar text-gray-400 mt-1"></i>
					<div class="flex-1">
						<p class="text-sm text-gray-600">Estimated Duration</p>
						<p class="font-medium text-gray-800">
							{{ quote.estimatedDays }} {{ quote.estimatedDays === 1 ? 'day' : 'days' }}
						</p>
					</div>
				</div>

				<!-- Notes -->
				<div v-if="quote.notes" class="flex items-start gap-2">
					<i class="pi pi-align-left text-gray-400 mt-1"></i>
					<div class="flex-1">
						<p class="text-sm text-gray-600">Notes</p>
						<p class="text-gray-800">{{ quote.notes }}</p>
					</div>
				</div>

				<!-- Company Info -->
				<div v-if="quote.company" class="flex items-start gap-2 pt-3 border-t">
					<i class="pi pi-building text-gray-400 mt-1"></i>
					<div class="flex-1">
						<p class="text-sm text-gray-600">Company</p>
						<p class="font-medium text-gray-800">{{ quote.company.name }}</p>
						<p v-if="quote.company.phone" class="text-sm text-gray-500">{{ quote.company.phone }}</p>
					</div>
				</div>

				<!-- Valid Until -->
				<div v-if="quote.validUntil" class="flex items-start gap-2">
					<i class="pi pi-clock text-gray-400 mt-1"></i>
					<div class="flex-1">
						<p class="text-sm text-gray-600">Valid Until</p>
						<p class="font-medium text-gray-800">{{ formatDate(quote.validUntil) }}</p>
					</div>
				</div>
			</div>
		</template>

		<template #footer v-if="showActions">
			<div class="flex items-center justify-end gap-2 pt-3 border-t">
				<Button
					v-if="canAccept"
					label="Accept Quote"
					icon="pi pi-check"
					severity="success"
					@click="handleAccept"
					:loading="loading"
				/>
				<Button
					v-if="canReject"
					label="Reject"
					icon="pi pi-times"
					severity="danger"
					outlined
					@click="handleReject"
					:loading="loading"
				/>
				<Button
					v-if="!canAccept && !canReject"
					label="View Details"
					icon="pi pi-eye"
					severity="info"
					outlined
					@click="handleView"
				/>
			</div>
		</template>
	</Card>
</template>

<script setup>
import { computed, ref } from 'vue';
import Card from 'primevue/card';
import Tag from 'primevue/tag';
import Button from 'primevue/button';
import { formatCurrency, formatDate, formatDateTime } from '@/utils/formatters';

const props = defineProps({
	quote: {
		type: Object,
		required: true
	},
	showActions: {
		type: Boolean,
		default: true
	}
});

const emit = defineEmits(['accept', 'reject', 'view']);

const loading = ref(false);

// Status configuration
const statusConfig = {
	pending: {
		label: 'Pending',
		severity: 'warning',
		icon: 'pi pi-clock',
		iconClass: 'bg-yellow-100 text-yellow-600 w-10 h-10 rounded-full flex items-center justify-center',
		canAccept: true,
		canReject: true
	},
	accepted: {
		label: 'Accepted',
		severity: 'success',
		icon: 'pi pi-check-circle',
		iconClass: 'bg-green-100 text-green-600 w-10 h-10 rounded-full flex items-center justify-center',
		canAccept: false,
		canReject: false
	},
	rejected: {
		label: 'Rejected',
		severity: 'danger',
		icon: 'pi pi-times-circle',
		iconClass: 'bg-red-100 text-red-600 w-10 h-10 rounded-full flex items-center justify-center',
		canAccept: false,
		canReject: false
	}
};

const currentStatus = computed(() => {
	return statusConfig[props.quote.status] || statusConfig.pending;
});

const statusLabel = computed(() => currentStatus.value.label);
const statusSeverity = computed(() => currentStatus.value.severity);
const statusIcon = computed(() => currentStatus.value.icon);
const statusIconClass = computed(() => currentStatus.value.iconClass);
const canAccept = computed(() => currentStatus.value.canAccept && props.showActions);
const canReject = computed(() => currentStatus.value.canReject && props.showActions);

const cardClass = computed(() => {
	if (props.quote.status === 'accepted') return 'border-2 border-green-500';
	if (props.quote.status === 'rejected') return 'opacity-75';
	return '';
});

const formattedDate = computed(() => {
	return formatDateTime(props.quote.createdAt || props.quote.created_at);
});

const handleAccept = async () => {
	loading.value = true;
	emit('accept', props.quote);
	// Note: Parent should handle loading state reset
	setTimeout(() => {
		loading.value = false;
	}, 2000);
};

const handleReject = async () => {
	loading.value = true;
	emit('reject', props.quote);
	// Note: Parent should handle loading state reset
	setTimeout(() => {
		loading.value = false;
	}, 2000);
};

const handleView = () => {
	emit('view', props.quote);
};
</script>

<style scoped>
.quote-card {
	border-radius: 12px;
	transition: all 0.3s ease;
}

.quote-card:hover {
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>
