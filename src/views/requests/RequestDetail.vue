<template>
	<div class="request-detail-view min-h-screen bg-gray-50 py-8">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<!-- Loading State -->
			<div v-if="isLoading && !currentRequest" class="flex justify-center items-center py-12">
				<ProgressSpinner />
			</div>

			<!-- Error State -->
			<div v-else-if="error" class="text-center py-12">
				<i class="pi pi-exclamation-triangle text-6xl text-red-500 mb-4"></i>
				<h2 class="text-2xl font-semibold text-gray-900 mb-2">Error Loading Request</h2>
				<p class="text-gray-600 mb-6">{{ error }}</p>
				<Button label="Go Back" icon="pi pi-arrow-left" outlined @click="handleGoBack" />
			</div>

			<!-- Request Content -->
			<div v-else-if="currentRequest">
				<!-- Header with Back Button -->
				<div class="mb-6">
					<Button
						label="Back to Requests"
						icon="pi pi-arrow-left"
						text
						@click="handleGoBack"
						class="mb-4"
					/>

					<!-- Request Header Card -->
					<Card class="bg-white shadow-md">
						<template #content>
							<div class="flex items-start justify-between">
								<div class="flex-1">
									<div class="flex items-center gap-3 mb-2">
										<div :class="statusIconClass">
											<i :class="statusIcon" class="text-xl"></i>
										</div>
										<div>
											<h1 class="text-3xl font-bold text-gray-900">
												{{ currentRequest.service?.name || 'Service Request' }}
											</h1>
											<p class="text-gray-600">Request #{{ currentRequest.id }}</p>
										</div>
									</div>

									<!-- Status and Date -->
									<div class="flex items-center gap-4 mt-4">
										<Tag :value="statusLabel" :severity="statusSeverity" class="text-lg px-4 py-2" />
										<span class="text-gray-500">
											Created {{ formatDateTime(currentRequest.createdAt || currentRequest.created_at) }}
										</span>
									</div>

									<!-- Request Info Grid -->
									<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
										<div class="flex items-start gap-2">
											<i class="pi pi-map-marker text-gray-400 mt-1"></i>
											<div>
												<p class="text-sm text-gray-600">Location</p>
												<p class="font-medium text-gray-900">{{ currentRequest.location }}</p>
											</div>
										</div>

										<div v-if="currentRequest.preferredDate" class="flex items-start gap-2">
											<i class="pi pi-calendar text-gray-400 mt-1"></i>
											<div>
												<p class="text-sm text-gray-600">Preferred Date</p>
												<p class="font-medium text-gray-900">{{ formatDate(currentRequest.preferredDate) }}</p>
											</div>
										</div>

										<div v-if="currentRequest.budget" class="flex items-start gap-2">
											<i class="pi pi-dollar text-gray-400 mt-1"></i>
											<div>
												<p class="text-sm text-gray-600">Budget</p>
												<p class="font-medium text-green-600">{{ formatCurrency(currentRequest.budget) }}</p>
											</div>
										</div>

										<div class="flex items-start gap-2">
											<i class="pi pi-building text-gray-400 mt-1"></i>
											<div>
												<p class="text-sm text-gray-600">Company</p>
												<p class="font-medium text-gray-900">{{ currentRequest.service?.company?.name || 'N/A' }}</p>
											</div>
										</div>
									</div>

									<!-- Description -->
									<div v-if="currentRequest.description" class="mt-6 pt-6 border-t">
										<p class="text-sm text-gray-600 mb-2">Description</p>
										<p class="text-gray-800">{{ currentRequest.description }}</p>
									</div>
								</div>

								<!-- Actions -->
								<div class="ml-4">
									<Menu ref="menu" :model="actionMenuItems" :popup="true" />
									<Button
										icon="pi pi-ellipsis-v"
										severity="secondary"
										text
										rounded
										@click="toggleMenu"
									/>
								</div>
							</div>
						</template>
					</Card>
				</div>

				<!-- Stats Row -->
				<div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
					<Card class="bg-blue-50 border-l-4 border-blue-500">
						<template #content>
							<div class="flex items-center justify-between">
								<div>
									<p class="text-sm text-gray-600">Quotes</p>
									<p class="text-2xl font-bold text-blue-600">{{ quotesCount }}</p>
								</div>
								<i class="pi pi-file text-4xl text-blue-300"></i>
							</div>
						</template>
					</Card>

					<Card class="bg-purple-50 border-l-4 border-purple-500">
						<template #content>
							<div class="flex items-center justify-between">
								<div>
									<p class="text-sm text-gray-600">Assigned</p>
									<p class="text-2xl font-bold text-purple-600">{{ assignmentsCount }}</p>
								</div>
								<i class="pi pi-user text-4xl text-purple-300"></i>
							</div>
						</template>
					</Card>

					<Card class="bg-green-50 border-l-4 border-green-500">
						<template #content>
							<div class="flex items-center justify-between">
								<div>
									<p class="text-sm text-gray-600">Service Price</p>
									<p class="text-2xl font-bold text-green-600">
										{{ formatCurrency(currentRequest.service?.price || 0) }}
									</p>
								</div>
								<i class="pi pi-dollar text-4xl text-green-300"></i>
							</div>
						</template>
					</Card>

					<Card class="bg-orange-50 border-l-4 border-orange-500">
						<template #content>
							<div class="flex items-center justify-between">
								<div>
									<p class="text-sm text-gray-600">Duration</p>
									<p class="text-2xl font-bold text-orange-600">
										{{ currentRequest.service?.duration || '-' }} min
									</p>
								</div>
								<i class="pi pi-clock text-4xl text-orange-300"></i>
							</div>
						</template>
					</Card>
				</div>

				<!-- Tabs -->
				<TabView v-model:activeIndex="activeTab">
					<!-- Quotes Tab -->
					<TabPanel header="Quotes">
						<div v-if="quotesLoading" class="flex justify-center py-8">
							<ProgressSpinner />
						</div>
						<div v-else-if="!currentRequest.quotes || currentRequest.quotes.length === 0" class="text-center py-12">
							<i class="pi pi-inbox text-6xl text-gray-300 mb-4"></i>
							<h3 class="text-xl font-semibold text-gray-600 mb-2">No quotes yet</h3>
							<p class="text-gray-500">Companies will send quotes for your request</p>
						</div>
						<div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
							<QuoteCard
								v-for="quote in currentRequest.quotes"
								:key="quote.id"
								:quote="quote"
								:show-actions="currentRequest.status === 'quoted' || currentRequest.status === 'pending'"
								@accept="handleAcceptQuote"
								@reject="handleRejectQuote"
								@view="handleViewQuote"
							/>
						</div>
					</TabPanel>

					<!-- Assignment Tab -->
					<TabPanel header="Assignment">
						<div v-if="currentRequest.assignment">
							<Card>
								<template #content>
									<div class="space-y-4">
										<!-- Assigned Employee -->
										<div class="flex items-start justify-between">
											<div class="flex items-start gap-3">
												<div class="bg-purple-100 text-purple-600 w-12 h-12 rounded-full flex items-center justify-center">
													<i class="pi pi-user text-xl"></i>
												</div>
												<div>
													<p class="text-sm text-gray-600">Assigned To</p>
													<p class="font-semibold text-lg">{{ currentRequest.assignment.employee?.name || 'Unknown' }}</p>
													<p class="text-sm text-gray-500">{{ currentRequest.assignment.employee?.email }}</p>
												</div>
											</div>
											<Tag :value="assignmentStatus" :severity="assignmentStatusSeverity" />
										</div>

										<!-- Assignment Date -->
										<div v-if="currentRequest.assignment.assignedDate" class="flex items-center gap-2 pt-4 border-t">
											<i class="pi pi-calendar text-gray-400"></i>
											<div>
												<p class="text-sm text-gray-600">Assigned On</p>
												<p class="font-medium">{{ formatDateTime(currentRequest.assignment.assignedDate) }}</p>
											</div>
										</div>

										<!-- Status Actions -->
										<div class="flex items-center gap-2 pt-4 border-t">
											<Button
												v-if="currentRequest.assignment.status === 'pending'"
												label="Start Work"
												icon="pi pi-play"
												severity="success"
												@click="handleUpdateAssignmentStatus('in_progress')"
											/>
											<Button
												v-if="currentRequest.assignment.status === 'in_progress'"
												label="Complete Work"
												icon="pi pi-check"
												severity="success"
												@click="handleUpdateAssignmentStatus('completed')"
											/>
											<Button
												v-if="currentRequest.assignment.status !== 'cancelled' && currentRequest.assignment.status !== 'completed'"
												label="Cancel Assignment"
												icon="pi pi-times"
												severity="danger"
												outlined
												@click="handleUpdateAssignmentStatus('cancelled')"
											/>
										</div>
									</div>
								</template>
							</Card>

							<!-- GPS Tracking Section -->
							<Card class="mt-6" v-if="currentRequest.assignment.status === 'in_progress'">
								<template #header>
									<div class="p-4 border-b">
										<h3 class="text-lg font-semibold flex items-center gap-2">
											<i class="pi pi-map-marker text-blue-600"></i>
											GPS Tracking
										</h3>
									</div>
								</template>
								<template #content>
									<div class="space-y-4">
										<div v-if="!trackingActive" class="text-center py-6">
											<i class="pi pi-map text-5xl text-gray-300 mb-3"></i>
											<p class="text-gray-600 mb-4">GPS tracking not started</p>
											<Button
												label="Start GPS Tracking"
												icon="pi pi-play"
												severity="info"
												@click="handleStartTracking"
											/>
										</div>
										<div v-else class="space-y-4">
											<div class="bg-green-50 border border-green-200 rounded-lg p-4">
												<div class="flex items-center gap-2 text-green-700">
													<i class="pi pi-check-circle"></i>
													<span class="font-medium">GPS Tracking Active</span>
												</div>
												<p class="text-sm text-green-600 mt-1">Location updates every 30 seconds</p>
											</div>
											<div v-if="lastTrackedLocation" class="grid grid-cols-2 gap-4">
												<div>
													<p class="text-sm text-gray-600">Latitude</p>
													<p class="font-mono font-medium">{{ lastTrackedLocation.latitude.toFixed(6) }}</p>
												</div>
												<div>
													<p class="text-sm text-gray-600">Longitude</p>
													<p class="font-mono font-medium">{{ lastTrackedLocation.longitude.toFixed(6) }}</p>
												</div>
												<div>
													<p class="text-sm text-gray-600">Accuracy</p>
													<p class="font-medium">{{ lastTrackedLocation.accuracy?.toFixed(1) }}m</p>
												</div>
												<div>
													<p class="text-sm text-gray-600">Last Update</p>
													<p class="font-medium text-sm">{{ formatDateTime(lastTrackedLocation.timestamp) }}</p>
												</div>
											</div>
											<Button
												label="Stop GPS Tracking"
												icon="pi pi-stop"
												severity="danger"
												outlined
												@click="handleStopTracking"
												class="w-full"
											/>
										</div>
									</div>
								</template>
							</Card>
						</div>
						<div v-else class="text-center py-12">
							<i class="pi pi-user-plus text-6xl text-gray-300 mb-4"></i>
							<h3 class="text-xl font-semibold text-gray-600 mb-2">No assignment yet</h3>
							<p class="text-gray-500">An employee will be assigned to this request</p>
						</div>
					</TabPanel>

					<!-- Activity Tab -->
					<TabPanel header="Activity">
						<div class="space-y-4">
							<Timeline :value="activityEvents" align="left">
								<template #marker="slotProps">
									<div :class="slotProps.item.iconClass">
										<i :class="slotProps.item.icon"></i>
									</div>
								</template>
								<template #content="slotProps">
									<div class="ml-4">
										<p class="font-medium text-gray-900">{{ slotProps.item.title }}</p>
										<p class="text-sm text-gray-600">{{ slotProps.item.description }}</p>
										<p class="text-xs text-gray-500 mt-1">{{ slotProps.item.date }}</p>
									</div>
								</template>
							</Timeline>
						</div>
					</TabPanel>

					<!-- Service Details Tab -->
					<TabPanel header="Service Details">
						<Card>
							<template #content>
								<div class="space-y-6">
									<div>
										<h3 class="text-xl font-bold text-gray-900 mb-2">{{ currentRequest.service?.name }}</h3>
										<p class="text-gray-600">{{ currentRequest.service?.description }}</p>
									</div>

									<div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
										<div>
											<p class="text-sm text-gray-600">Category</p>
											<p class="font-medium">{{ currentRequest.service?.category?.name || 'N/A' }}</p>
										</div>
										<div>
											<p class="text-sm text-gray-600">Price</p>
											<p class="font-medium text-green-600">{{ formatCurrency(currentRequest.service?.price || 0) }}</p>
										</div>
										<div>
											<p class="text-sm text-gray-600">Duration</p>
											<p class="font-medium">{{ currentRequest.service?.duration || 'N/A' }} minutes</p>
										</div>
										<div>
											<p class="text-sm text-gray-600">Status</p>
											<Tag :value="currentRequest.service?.status || 'active'" severity="success" />
										</div>
									</div>

									<div v-if="currentRequest.service?.company" class="pt-4 border-t">
										<h4 class="font-semibold text-gray-900 mb-3">Company Information</h4>
										<div class="bg-gray-50 rounded-lg p-4 space-y-2">
											<p class="font-medium text-lg">{{ currentRequest.service.company.name }}</p>
											<p v-if="currentRequest.service.company.email" class="text-sm text-gray-600">
												<i class="pi pi-envelope mr-2"></i>{{ currentRequest.service.company.email }}
											</p>
											<p v-if="currentRequest.service.company.phone" class="text-sm text-gray-600">
												<i class="pi pi-phone mr-2"></i>{{ currentRequest.service.company.phone }}
											</p>
											<p v-if="currentRequest.service.company.address" class="text-sm text-gray-600">
												<i class="pi pi-map-marker mr-2"></i>{{ currentRequest.service.company.address }}
											</p>
										</div>
									</div>
								</div>
							</template>
						</Card>
					</TabPanel>
				</TabView>
			</div>
		</div>

		<!-- Update Status Dialog -->
		<Dialog
			v-model:visible="showStatusDialog"
			header="Update Request Status"
			:modal="true"
			class="max-w-md"
		>
			<div class="space-y-4">
				<p class="text-gray-700">Select the new status for this request:</p>
				<Dropdown
					v-model="newStatus"
					:options="statusOptions"
					optionLabel="label"
					optionValue="value"
					placeholder="Select status"
					class="w-full"
				/>
			</div>
			<template #footer>
				<div class="flex justify-end gap-2">
					<Button label="Cancel" icon="pi pi-times" severity="secondary" outlined @click="showStatusDialog = false" />
					<Button label="Update" icon="pi pi-check" severity="success" @click="confirmUpdateStatus" :loading="isUpdating" />
				</div>
			</template>
		</Dialog>
	</div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useServiceRequests } from '@/composables/useServiceRequests';
import QuoteCard from '@/components/requests/QuoteCard.vue';
import Card from 'primevue/card';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import ProgressSpinner from 'primevue/progressspinner';
import Menu from 'primevue/menu';
import Dialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';
import Timeline from 'primevue/timeline';
import { formatCurrency, formatDate, formatDateTime } from '@/utils/formatters';

const router = useRouter();
const route = useRoute();

const {
	state,
	fetchServiceRequest,
	updateServiceRequestStatus,
	updateQuoteStatus,
	updateAssignmentStatus,
	startTracking,
	setCurrentServiceRequest,
	clearCurrentServiceRequest,
} = useServiceRequests();

// State
const isLoading = ref(false);
const error = ref(null);
const activeTab = ref(0);
const quotesLoading = ref(false);
const menu = ref(null);
const showStatusDialog = ref(false);
const newStatus = ref(null);
const isUpdating = ref(false);
const trackingActive = ref(false);
const trackingController = ref(null);
const lastTrackedLocation = ref(null);

// Computed
const currentRequest = computed(() => state.currentServiceRequest);

const quotesCount = computed(() => currentRequest.value?.quotes?.length || 0);
const assignmentsCount = computed(() => currentRequest.value?.assignment ? 1 : 0);

const statusConfig = {
	pending: {
		label: 'Pending',
		severity: 'warning',
		icon: 'pi pi-clock',
		iconClass: 'bg-yellow-100 text-yellow-600 w-12 h-12 rounded-full flex items-center justify-center',
	},
	quoted: {
		label: 'Quoted',
		severity: 'info',
		icon: 'pi pi-file',
		iconClass: 'bg-blue-100 text-blue-600 w-12 h-12 rounded-full flex items-center justify-center',
	},
	accepted: {
		label: 'Accepted',
		severity: 'success',
		icon: 'pi pi-check-circle',
		iconClass: 'bg-green-100 text-green-600 w-12 h-12 rounded-full flex items-center justify-center',
	},
	in_progress: {
		label: 'In Progress',
		severity: 'info',
		icon: 'pi pi-spinner',
		iconClass: 'bg-blue-100 text-blue-600 w-12 h-12 rounded-full flex items-center justify-center',
	},
	completed: {
		label: 'Completed',
		severity: 'success',
		icon: 'pi pi-check',
		iconClass: 'bg-green-100 text-green-600 w-12 h-12 rounded-full flex items-center justify-center',
	},
	cancelled: {
		label: 'Cancelled',
		severity: 'danger',
		icon: 'pi pi-times-circle',
		iconClass: 'bg-red-100 text-red-600 w-12 h-12 rounded-full flex items-center justify-center',
	},
	rejected: {
		label: 'Rejected',
		severity: 'danger',
		icon: 'pi pi-ban',
		iconClass: 'bg-red-100 text-red-600 w-12 h-12 rounded-full flex items-center justify-center',
	},
};

const currentStatus = computed(() => {
	return statusConfig[currentRequest.value?.status] || statusConfig.pending;
});

const statusLabel = computed(() => currentStatus.value.label);
const statusSeverity = computed(() => currentStatus.value.severity);
const statusIcon = computed(() => currentStatus.value.icon);
const statusIconClass = computed(() => currentStatus.value.iconClass);

const assignmentStatus = computed(() => {
	const status = currentRequest.value?.assignment?.status || 'pending';
	return status.replace('_', ' ').toUpperCase();
});

const assignmentStatusSeverity = computed(() => {
	const status = currentRequest.value?.assignment?.status;
	if (status === 'completed') return 'success';
	if (status === 'in_progress') return 'info';
	if (status === 'cancelled') return 'danger';
	return 'warning';
});

const statusOptions = [
	{ label: 'Pending', value: 'pending' },
	{ label: 'Accepted', value: 'accepted' },
	{ label: 'Rejected', value: 'rejected' },
	{ label: 'Completed', value: 'completed' },
	{ label: 'Cancelled', value: 'cancelled' },
];

const actionMenuItems = computed(() => [
	{
		label: 'Update Status',
		icon: 'pi pi-refresh',
		command: () => {
			showStatusDialog.value = true;
		}
	},
	{
		label: 'Refresh',
		icon: 'pi pi-sync',
		command: loadRequest
	},
	{
		separator: true
	},
	{
		label: 'Cancel Request',
		icon: 'pi pi-times',
		severity: 'danger',
		command: () => handleUpdateStatus('cancelled')
	}
]);

const activityEvents = computed(() => {
	const events = [];

	if (currentRequest.value) {
		// Request created
		events.push({
			title: 'Request Created',
			description: `Service request for ${currentRequest.value.service?.name}`,
			date: formatDateTime(currentRequest.value.createdAt || currentRequest.value.created_at),
			icon: 'pi pi-plus-circle',
			iconClass: 'bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center'
		});

		// Quotes
		if (currentRequest.value.quotes && currentRequest.value.quotes.length > 0) {
			currentRequest.value.quotes.forEach(quote => {
				events.push({
					title: 'Quote Received',
					description: `Quote for ${formatCurrency(quote.amount)} (${quote.estimatedDays} days)`,
					date: formatDateTime(quote.createdAt || quote.created_at),
					icon: 'pi pi-file',
					iconClass: 'bg-purple-100 text-purple-600 w-8 h-8 rounded-full flex items-center justify-center'
				});
			});
		}

		// Assignment
		if (currentRequest.value.assignment) {
			events.push({
				title: 'Employee Assigned',
				description: `Assigned to ${currentRequest.value.assignment.employee?.name}`,
				date: formatDateTime(currentRequest.value.assignment.assignedDate),
				icon: 'pi pi-user',
				iconClass: 'bg-green-100 text-green-600 w-8 h-8 rounded-full flex items-center justify-center'
			});
		}

		// Status changes
		if (currentRequest.value.status === 'completed') {
			events.push({
				title: 'Request Completed',
				description: 'Service request has been completed',
				date: formatDateTime(currentRequest.value.updatedAt || currentRequest.value.updated_at),
				icon: 'pi pi-check',
				iconClass: 'bg-green-100 text-green-600 w-8 h-8 rounded-full flex items-center justify-center'
			});
		}
	}

	return events.sort((a, b) => new Date(b.date) - new Date(a.date));
});

// Methods
const loadRequest = async () => {
	isLoading.value = true;
	error.value = null;
	try {
		const requestId = parseInt(route.params.id);
		const result = await fetchServiceRequest(requestId);

		if (!result.success) {
			error.value = result.error || 'Failed to load request';
		}
	} catch (err) {
		error.value = err.message || 'Failed to load request';
	} finally {
		isLoading.value = false;
	}
};

const handleGoBack = () => {
	router.push({ name: 'MyRequests' });
};

const toggleMenu = (event) => {
	menu.value.toggle(event);
};

const handleUpdateStatus = async (status) => {
	newStatus.value = status;
	await confirmUpdateStatus();
};

const confirmUpdateStatus = async () => {
	if (!newStatus.value) return;

	isUpdating.value = true;
	try {
		const result = await updateServiceRequestStatus(currentRequest.value.id, newStatus.value);
		if (result.success) {
			showStatusDialog.value = false;
			await loadRequest(); // Reload to get updated data
		}
	} finally {
		isUpdating.value = false;
	}
};

const handleAcceptQuote = async (quote) => {
	const result = await updateQuoteStatus(quote.id, 'accepted');
	if (result.success) {
		await loadRequest();
	}
};

const handleRejectQuote = async (quote) => {
	const result = await updateQuoteStatus(quote.id, 'rejected');
	if (result.success) {
		await loadRequest();
	}
};

const handleViewQuote = (quote) => {
	// Could open a detail dialog or navigate to quote detail
	console.log('View quote:', quote);
};

const handleUpdateAssignmentStatus = async (status) => {
	if (!currentRequest.value?.assignment) return;

	const result = await updateAssignmentStatus(currentRequest.value.assignment.id, status);
	if (result.success) {
		await loadRequest();
	}
};

const handleStartTracking = () => {
	if (!currentRequest.value?.assignment) return;

	trackingController.value = startTracking(currentRequest.value.assignment.id);
	trackingActive.value = true;

	// Simulate tracking updates (in real app, this would come from the composable)
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(
			(position) => {
				lastTrackedLocation.value = {
					latitude: position.coords.latitude,
					longitude: position.coords.longitude,
					accuracy: position.coords.accuracy,
					timestamp: new Date().toISOString()
				};
			},
			(error) => {
				console.error('Geolocation error:', error);
			}
		);
	}
};

const handleStopTracking = () => {
	if (trackingController.value && trackingController.value.stop) {
		trackingController.value.stop();
	}
	trackingActive.value = false;
	trackingController.value = null;
};

// Lifecycle
onMounted(() => {
	loadRequest();
});

onUnmounted(() => {
	// Stop tracking if active
	if (trackingController.value && trackingController.value.stop) {
		trackingController.value.stop();
	}
	clearCurrentServiceRequest();
});
</script>

<style scoped>
.request-detail-view {
	background-color: #f9fafb;
}

:deep(.p-card) {
	border-radius: 12px;
}

:deep(.p-tabview-nav-link) {
	font-weight: 500;
}

:deep(.p-timeline-event-content) {
	padding-bottom: 1.5rem;
}
</style>
