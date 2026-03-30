<template>
	<div class="create-request-view p-6">
		<!-- Header -->
		<div class="mb-6">
			<Button
				icon="pi pi-arrow-left"
				label="Back"
				text
				@click="handleBack"
				class="mb-4"
			/>
			<h1 class="text-3xl font-bold text-gray-800">
				Create Service Request
			</h1>
			<p class="text-gray-600 mt-1">Request a service from a company</p>
		</div>

		<!-- Form Card -->
		<Card class="max-w-4xl">
			<template #content>
				<form @submit.prevent="handleSubmit" class="space-y-6">
					<!-- Service Selection -->
					<div class="form-group">
						<label
							for="service"
							class="block text-sm font-medium text-gray-700 mb-2"
						>
							Service <span class="text-red-500">*</span>
						</label>
						<Dropdown
							id="service"
							v-model="formData.serviceId"
							:options="availableServices"
							optionLabel="name"
							optionValue="id"
							placeholder="Select a service"
							class="w-full"
							:class="{ 'p-invalid': errors.serviceId }"
							:loading="loadingServices"
							filter
							@change="onServiceChange"
						>
							<template #value="slotProps">
								<div
									v-if="slotProps.value"
									class="flex items-center gap-2"
								>
									<span>{{
										getServiceName(slotProps.value)
									}}</span>
								</div>
								<span v-else>{{ slotProps.placeholder }}</span>
							</template>
							<template #option="slotProps">
								<div class="flex flex-col">
									<div class="font-medium">
										{{ slotProps.option.name }}
									</div>
									<div class="text-sm text-gray-500">
										{{ slotProps.option.company?.name }} -
										{{
											formatCurrency(
												slotProps.option.price,
											)
										}}
									</div>
								</div>
							</template>
						</Dropdown>
						<small v-if="errors.serviceId" class="p-error">{{
							errors.serviceId
						}}</small>
						<small v-else class="text-gray-500"
							>Select the service you need</small
						>
					</div>

					<!-- Selected Service Info -->
					<div
						v-if="selectedService"
						class="bg-blue-50 border border-blue-200 rounded-lg p-4"
					>
						<div class="flex items-start justify-between">
							<div class="flex-1">
								<h3 class="font-semibold text-lg text-blue-900">
									{{ selectedService.name }}
								</h3>
								<p class="text-sm text-blue-700 mt-1">
									{{ selectedService.company?.name }}
								</p>
								<p
									v-if="selectedService.description"
									class="text-sm text-gray-600 mt-2"
								>
									{{ selectedService.description }}
								</p>
								<div class="flex items-center gap-4 mt-3">
									<div
										class="flex items-center gap-1 text-sm"
									>
										<i
											class="pi pi-dollar text-green-600"
										></i>
										<span
											class="font-medium text-green-600"
											>{{
												formatCurrency(
													selectedService.price,
												)
											}}</span
										>
									</div>
									<div
										v-if="selectedService.duration"
										class="flex items-center gap-1 text-sm"
									>
										<i
											class="pi pi-clock text-blue-600"
										></i>
										<span class="text-gray-600"
											>{{
												selectedService.duration
											}}
											min</span
										>
									</div>
								</div>
							</div>
						</div>
					</div>

					<!-- Location -->
					<div class="form-group">
						<label
							for="location"
							class="block text-sm font-medium text-gray-700 mb-2"
						>
							Location <span class="text-red-500">*</span>
						</label>
						<div class="relative">
							<IconField iconPosition="left" class="w-full">
								<InputIcon>
									<i class="pi pi-map-marker" />
								</InputIcon>
								<InputText
									id="location"
									v-model="formData.location"
									placeholder="Enter service location"
									class="w-full"
									:class="{ 'p-invalid': errors.location }"
								/>
							</IconField>
						</div>
						<small v-if="errors.location" class="p-error">{{
							errors.location
						}}</small>
						<small v-else class="text-gray-500"
							>Where should the service be performed?</small
						>
					</div>

					<!-- Description -->
					<div class="form-group">
						<label
							for="description"
							class="block text-sm font-medium text-gray-700 mb-2"
						>
							Description
						</label>
						<Textarea
							id="description"
							v-model="formData.description"
							rows="5"
							placeholder="Describe your requirements, any specific details, or special requests..."
							class="w-full"
							:class="{ 'p-invalid': errors.description }"
						/>
						<small v-if="errors.description" class="p-error">{{
							errors.description
						}}</small>
						<small v-else class="text-gray-500"
							>Provide details about your service request
							(optional)</small
						>
					</div>

					<!-- Preferred Date -->
					<div class="form-group">
						<label
							for="preferredDate"
							class="block text-sm font-medium text-gray-700 mb-2"
						>
							Preferred Date
						</label>
						<Calendar
							id="preferredDate"
							v-model="formData.preferredDate"
							dateFormat="yy-mm-dd"
							:minDate="minDate"
							placeholder="Select preferred date"
							class="w-full"
							showIcon
							:class="{ 'p-invalid': errors.preferredDate }"
						/>
						<small v-if="errors.preferredDate" class="p-error">{{
							errors.preferredDate
						}}</small>
						<small v-else class="text-gray-500"
							>When would you like the service? (optional)</small
						>
					</div>

					<!-- Budget -->
					<div class="form-group">
						<label
							for="budget"
							class="block text-sm font-medium text-gray-700 mb-2"
						>
							Budget
						</label>
						<div class="relative">
							<IconField iconPosition="left" class="w-full">
								<InputIcon>
									<i class="pi pi-dollar" />
								</InputIcon>
								<InputNumber
									id="budget"
									v-model="formData.budget"
									mode="currency"
									currency="USD"
									locale="en-US"
									placeholder="Enter your budget"
									class="w-full"
									:class="{ 'p-invalid': errors.budget }"
									:min="0"
								/>
							</IconField>
						</div>
						<small v-if="errors.budget" class="p-error">{{
							errors.budget
						}}</small>
						<small v-else class="text-gray-500"
							>What is your budget for this service?
							(optional)</small
						>
					</div>

					<!-- Contact Information -->
					<div
						class="bg-gray-50 border border-gray-200 rounded-lg p-4"
					>
						<h3
							class="font-semibold text-gray-800 mb-3 flex items-center gap-2"
						>
							<i class="pi pi-user"></i>
							Contact Information
						</h3>
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div class="form-group">
								<label
									for="contactName"
									class="block text-sm font-medium text-gray-700 mb-2"
								>
									Name
								</label>
								<InputText
									id="contactName"
									v-model="formData.contactName"
									placeholder="Your name"
									class="w-full"
								/>
								<small class="text-gray-500"
									>Optional - defaults to your account
									name</small
								>
							</div>
							<div class="form-group">
								<label
									for="contactPhone"
									class="block text-sm font-medium text-gray-700 mb-2"
								>
									Phone
								</label>
								<InputText
									id="contactPhone"
									v-model="formData.contactPhone"
									placeholder="Your phone number"
									class="w-full"
								/>
								<small class="text-gray-500"
									>Optional - for service provider to contact
									you</small
								>
							</div>
						</div>
					</div>

					<!-- Form Actions -->
					<div
						class="flex items-center justify-end gap-3 pt-6 border-t"
					>
						<Button
							label="Cancel"
							icon="pi pi-times"
							severity="secondary"
							outlined
							@click="handleCancel"
							:disabled="isSubmitting"
						/>
						<Button
							type="submit"
							label="Create Request"
							icon="pi pi-check"
							severity="success"
							:loading="isSubmitting"
							:disabled="!isFormValid"
						/>
					</div>
				</form>
			</template>
		</Card>

		<!-- Confirmation Dialog -->
		<Dialog
			v-model:visible="showConfirmDialog"
			header="Confirm Service Request"
			:modal="true"
			:closable="false"
			class="max-w-md"
		>
			<div class="space-y-4">
				<p class="text-gray-700">
					Are you sure you want to submit this service request?
				</p>

				<div class="bg-gray-50 rounded-lg p-4 space-y-2">
					<div class="flex justify-between">
						<span class="text-sm text-gray-600">Service:</span>
						<span class="font-medium">{{
							selectedService?.name
						}}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-sm text-gray-600">Company:</span>
						<span class="font-medium">{{
							selectedService?.company?.name
						}}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-sm text-gray-600">Location:</span>
						<span class="font-medium">{{ formData.location }}</span>
					</div>
					<div v-if="formData.budget" class="flex justify-between">
						<span class="text-sm text-gray-600">Budget:</span>
						<span class="font-medium text-green-600">{{
							formatCurrency(formData.budget)
						}}</span>
					</div>
				</div>
			</div>

			<template #footer>
				<div class="flex justify-end gap-2">
					<Button
						label="Cancel"
						icon="pi pi-times"
						severity="secondary"
						outlined
						@click="showConfirmDialog = false"
						:disabled="isSubmitting"
					/>
					<Button
						label="Confirm"
						icon="pi pi-check"
						severity="success"
						@click="confirmSubmit"
						:loading="isSubmitting"
					/>
				</div>
			</template>
		</Dialog>
	</div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useServiceRequests } from "@/composables/useServiceRequests";
import { useServices } from "@/composables/useServices";
import { usePermissions } from "@/composables/usePermissions";
import { useToast } from "@/composables/useToast";
import Card from "primevue/card";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Dropdown from "primevue/dropdown";
import Calendar from "primevue/calendar";
import InputNumber from "primevue/inputnumber";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import Dialog from "primevue/dialog";
import { formatCurrency } from "@/utils/formatters";

const router = useRouter();
const route = useRoute();
const { showSuccess, showError } = useToast();

const { createServiceRequest } = useServiceRequests();
const { fetchServices, state: servicesState } = useServices();
const { canCreateRequest } = usePermissions();

// Check permissions on mount
onMounted(async () => {
	if (!canCreateRequest.value) {
		showError("You do not have permission to create service requests");
		router.push({ name: "Unauthorized" });
		return;
	}
	await loadServices();
});

// Form data
const formData = ref({
	serviceId: null,
	location: "",
	description: "",
	preferredDate: null,
	budget: null,
	contactName: "",
	contactPhone: "",
});

// State
const errors = ref({});
const isSubmitting = ref(false);
const showConfirmDialog = ref(false);
const loadingServices = ref(false);
const availableServices = ref([]);
const minDate = ref(new Date());

// Computed
const selectedService = computed(() => {
	if (!formData.value.serviceId) return null;
	return availableServices.value.find(
		(s) => s.id === formData.value.serviceId,
	);
});

const isFormValid = computed(() => {
	return (
		formData.value.serviceId &&
		formData.value.location.trim() !== "" &&
		canCreateRequest.value
	);
});

// Methods
const loadServices = async () => {
	loadingServices.value = true;
	try {
		await fetchServices({ limit: 100 });
		availableServices.value = servicesState.services;
	} catch (error) {
		console.error("Failed to load services:", error);
		showError("Failed to load services");
	} finally {
		loadingServices.value = false;
	}
};

const getServiceName = (serviceId) => {
	const service = availableServices.value.find((s) => s.id === serviceId);
	return service ? service.name : "";
};

const onServiceChange = () => {
	// Clear budget if service changes
	if (selectedService.value && selectedService.value.price) {
		formData.value.budget = selectedService.value.price;
	}
};

const validateForm = () => {
	const newErrors = {};

	if (!formData.value.serviceId) {
		newErrors.serviceId = "Please select a service";
	}

	if (!formData.value.location.trim()) {
		newErrors.location = "Location is required";
	}

	if (formData.value.budget && formData.value.budget < 0) {
		newErrors.budget = "Budget must be a positive number";
	}

	errors.value = newErrors;
	return Object.keys(newErrors).length === 0;
};

const handleSubmit = () => {
	if (!validateForm()) {
		return;
	}
	showConfirmDialog.value = true;
};

const confirmSubmit = async () => {
	if (!validateForm()) {
		showConfirmDialog.value = false;
		return;
	}

	isSubmitting.value = true;

	try {
		// Prepare request data
		const requestData = {
			serviceId: formData.value.serviceId,
			location: formData.value.location,
		};

		if (formData.value.description) {
			requestData.description = formData.value.description;
		}

		if (formData.value.preferredDate) {
			requestData.preferredDate =
				formData.value.preferredDate.toISOString();
		}

		if (formData.value.budget) {
			requestData.budget = formData.value.budget;
		}

		if (formData.value.contactName) {
			requestData.contactName = formData.value.contactName;
		}

		if (formData.value.contactPhone) {
			requestData.contactPhone = formData.value.contactPhone;
		}

		const result = await createServiceRequest(requestData);

		if (result.success) {
			// Navigate to the request detail page
			router.push({
				name: "RequestDetail",
				params: { id: result.data.id },
			});
		}
	} catch (error) {
		console.error("Failed to create request:", error);
	} finally {
		isSubmitting.value = false;
		showConfirmDialog.value = false;
	}
};

const handleCancel = () => {
	if (
		confirm(
			"Are you sure you want to cancel? All entered data will be lost.",
		)
	) {
		router.back();
	}
};

const handleBack = () => {
	router.back();
};

// Watchers
watch(
	() => route.query.serviceId,
	(newServiceId) => {
		if (newServiceId) {
			formData.value.serviceId = parseInt(newServiceId);
		}
	},
	{ immediate: true },
);

// Lifecycle
onMounted(() => {
	loadServices();
});
</script>

<style scoped>
.create-request-view {
	max-width: 1200px;
	margin: 0 auto;
}

.form-group {
	margin-bottom: 0;
}

:deep(.p-inputtext),
:deep(.p-dropdown),
:deep(.p-calendar),
:deep(.p-inputnumber-input) {
	width: 100%;
}

:deep(.p-error) {
	display: block;
	margin-top: 0.25rem;
	color: #ef4444;
	font-size: 0.875rem;
}

:deep(.p-invalid) {
	border-color: #ef4444;
}
</style>
