<template>
	<div class="edit-company-view min-h-screen bg-gray-50 py-8">
		<div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
			<!-- Loading State -->
			<LoadingSpinner v-if="isLoading" size="large" class="my-12" />

			<!-- Error State -->
			<div v-else-if="error" class="text-center py-12">
				<i
					class="pi pi-exclamation-triangle text-6xl text-red-500 mb-4"
				></i>
				<h2 class="text-2xl font-semibold text-gray-900 mb-2">
					Error Loading Company
				</h2>
				<p class="text-gray-600 mb-6">{{ error }}</p>
				<Button
					label="Go Back"
					icon="pi pi-arrow-left"
					class="p-button-outlined"
					@click="handleGoBack"
				/>
			</div>

			<!-- Edit Form -->
			<div v-else-if="currentCompany">
				<!-- Header -->
				<div class="mb-6">
					<Button
						label="Back to Company"
						icon="pi pi-arrow-left"
						class="p-button-text mb-4"
						@click="handleGoBack"
					/>

					<h1 class="text-3xl font-bold text-gray-900">
						Edit Company
					</h1>
					<p class="mt-2 text-sm text-gray-600">
						Update your company information
					</p>
				</div>

				<!-- Form Card -->
				<div class="bg-white rounded-lg shadow-md p-6">
					<form @submit.prevent="handleSubmit">
						<!-- Company Name -->
						<div class="mb-6">
							<label
								for="name"
								class="block text-sm font-medium text-gray-700 mb-2"
							>
								Company Name *
							</label>
							<InputText
								id="name"
								v-model="formData.name"
								placeholder="Enter company name"
								class="w-full"
								:class="{ 'p-invalid': errors.name }"
								@blur="validateField('name')"
							/>
							<small v-if="errors.name" class="p-error">{{
								errors.name
							}}</small>
						</div>

						<!-- Email -->
						<div class="mb-6">
							<label
								for="email"
								class="block text-sm font-medium text-gray-700 mb-2"
							>
								Email Address *
							</label>
							<InputText
								id="email"
								v-model="formData.email"
								type="email"
								placeholder="company@example.com"
								class="w-full"
								:class="{ 'p-invalid': errors.email }"
								@blur="validateField('email')"
							/>
							<small v-if="errors.email" class="p-error">{{
								errors.email
							}}</small>
						</div>

						<!-- Phone -->
						<div class="mb-6">
							<label
								for="phone"
								class="block text-sm font-medium text-gray-700 mb-2"
							>
								Phone Number *
							</label>
							<InputText
								id="phone"
								v-model="formData.phone"
								type="tel"
								placeholder="+1 (555) 123-4567"
								class="w-full"
								:class="{ 'p-invalid': errors.phone }"
								@blur="validateField('phone')"
							/>
							<small v-if="errors.phone" class="p-error">{{
								errors.phone
							}}</small>
						</div>

						<!-- Address -->
						<div class="mb-6">
							<label
								for="address"
								class="block text-sm font-medium text-gray-700 mb-2"
							>
								Address
							</label>
							<InputText
								id="address"
								v-model="formData.address"
								placeholder="Street address"
								class="w-full"
							/>
						</div>

						<!-- City and Country -->
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
							<div>
								<label
									for="city"
									class="block text-sm font-medium text-gray-700 mb-2"
								>
									City
								</label>
								<InputText
									id="city"
									v-model="formData.city"
									placeholder="City"
									class="w-full"
								/>
							</div>

							<div>
								<label
									for="country"
									class="block text-sm font-medium text-gray-700 mb-2"
								>
									Country
								</label>
								<InputText
									id="country"
									v-model="formData.country"
									placeholder="Country"
									class="w-full"
								/>
							</div>
						</div>

						<!-- Website (Optional) -->
						<div class="mb-6">
							<label
								for="website"
								class="block text-sm font-medium text-gray-700 mb-2"
							>
								Website
							</label>
							<InputText
								id="website"
								v-model="formData.website"
								type="url"
								placeholder="https://example.com"
								class="w-full"
							/>
						</div>

						<!-- Description (Optional) -->
						<div class="mb-6">
							<label
								for="description"
								class="block text-sm font-medium text-gray-700 mb-2"
							>
								Description
							</label>
							<Textarea
								id="description"
								v-model="formData.description"
								rows="4"
								placeholder="Brief description of your company"
								class="w-full"
							/>
						</div>

						<!-- Status -->
						<div class="mb-6">
							<label
								for="status"
								class="block text-sm font-medium text-gray-700 mb-2"
							>
								Status
							</label>
							<Dropdown
								id="status"
								v-model="formData.status"
								:options="statusOptions"
								option-label="label"
								option-value="value"
								placeholder="Select status"
								class="w-full"
							/>
						</div>

						<!-- Form Actions -->
						<div
							class="flex items-center justify-between pt-6 border-t border-gray-200"
						>
							<Button
								v-if="canDeleteCompany && canManage(companyId)"
								label="Delete Company"
								icon="pi pi-trash"
								class="p-button-danger p-button-outlined"
								@click="handleDelete"
								:disabled="isSubmitting"
							/>
							<div class="flex gap-3">
								<Button
									label="Cancel"
									class="p-button-text"
									@click="handleCancel"
									:disabled="isSubmitting"
								/>
								<Button
									label="Save Changes"
									type="submit"
									icon="pi pi-check"
									:loading="isSubmitting"
									:disabled="!isFormValid || !hasChanges"
								/>
							</div>
						</div>
					</form>
				</div>

				<!-- Last Updated Info -->
				<div
					v-if="currentCompany.updated_at"
					class="mt-4 text-sm text-gray-600 text-center"
				>
					Last updated {{ formatDate(currentCompany.updated_at) }}
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Dropdown from "primevue/dropdown";
import { useConfirm } from "primevue/useconfirm";
import { useCompanies } from "@/composables/useCompanies";
import { useToast } from "@/composables/useToast";
import { usePermissions } from "@/composables/usePermissions";
import LoadingSpinner from "@/components/common/LoadingSpinner.vue";
import { isValidEmail, isValidPhone } from "@/utils/validators";
import { formatDate } from "@/utils/formatters";

const router = useRouter();
const route = useRoute();
const confirm = useConfirm();
const { showSuccess, showError } = useToast();
const { canManage, canEditCompany, canDeleteCompany } = usePermissions();

// Composable
const { state, fetchCompany, updateCompany, deleteCompany } = useCompanies();

// Form data
const formData = ref({
	name: "",
	email: "",
	phone: "",
	address: "",
	city: "",
	country: "",
	website: "",
	description: "",
	status: "active",
});

// Original data for change detection
const originalData = ref({});

// Form state
const isLoading = ref(false);
const isSubmitting = ref(false);
const error = ref(null);
const errors = ref({});

// Status options
const statusOptions = [
	{ label: "Active", value: "active" },
	{ label: "Inactive", value: "inactive" },
	{ label: "Pending", value: "pending" },
];

// Computed
const companyId = computed(() => parseInt(route.params.id));

const currentCompany = computed(() => state.currentCompany);

const isFormValid = computed(() => {
	return (
		formData.value.name &&
		formData.value.email &&
		formData.value.phone &&
		!errors.value.name &&
		!errors.value.email &&
		!errors.value.phone
	);
});

const hasChanges = computed(() => {
	return Object.keys(formData.value).some((key) => {
		return formData.value[key] !== originalData.value[key];
	});
});

// Validation
const validateField = (field) => {
	errors.value[field] = null;

	switch (field) {
		case "name":
			if (!formData.value.name) {
				errors.value.name = "Company name is required";
			} else if (formData.value.name.length < 2) {
				errors.value.name =
					"Company name must be at least 2 characters";
			}
			break;

		case "email":
			if (!formData.value.email) {
				errors.value.email = "Email is required";
			} else if (!isValidEmail(formData.value.email)) {
				errors.value.email = "Please enter a valid email address";
			}
			break;

		case "phone":
			if (!formData.value.phone) {
				errors.value.phone = "Phone number is required";
			} else if (!isValidPhone(formData.value.phone)) {
				errors.value.phone = "Please enter a valid phone number";
			}
			break;
	}
};

const validateForm = () => {
	validateField("name");
	validateField("email");
	validateField("phone");

	return Object.values(errors.value).every((error) => !error);
};

// Methods
const loadCompany = async () => {
	isLoading.value = true;
	error.value = null;

	try {
		const result = await fetchCompany(companyId.value);

		if (!result.success) {
			error.value = result.error || "Failed to load company";
			return;
		}

		// Check permissions after loading company
		if (currentCompany.value && !canManage(companyId.value)) {
			showError("You do not have permission to edit this company");
			router.push({ name: "Unauthorized" });
			return;
		}

		// Populate form with current company data
		if (currentCompany.value) {
			populateForm(currentCompany.value);
		}
	} catch (err) {
		error.value = err.message || "An error occurred";
		console.error("Error loading company:", err);
	} finally {
		isLoading.value = false;
	}
};

const populateForm = (company) => {
	formData.value = {
		name: company.name || "",
		email: company.email || "",
		phone: company.phone || "",
		address: company.address || "",
		city: company.city || "",
		country: company.country || "",
		website: company.website || "",
		description: company.description || "",
		status: company.status || "active",
	};

	// Store original data for change detection
	originalData.value = { ...formData.value };
};

// Handlers
const handleSubmit = async () => {
	// Check permission before submitting
	if (!canManage(companyId.value) || !canEditCompany.value) {
		showError("You do not have permission to edit this company");
		return;
	}

	if (!validateForm()) {
		showError("Please fix the errors in the form");
		return;
	}

	if (!hasChanges.value) {
		showError("No changes to save");
		return;
	}

	isSubmitting.value = true;

	try {
		const result = await updateCompany(companyId.value, formData.value);

		if (result.success) {
			showSuccess("Company updated successfully");

			// Update original data to reflect saved changes
			originalData.value = { ...formData.value };

			// Optionally navigate back
			setTimeout(() => {
				router.push({
					name: "CompanyDetail",
					params: { id: companyId.value },
				});
			}, 500);
		} else {
			showError(result.error || "Failed to update company");
		}
	} catch (error) {
		console.error("Error updating company:", error);
		showError("An error occurred while updating the company");
	} finally {
		isSubmitting.value = false;
	}
};

const handleCancel = () => {
	if (hasChanges.value) {
		confirm.require({
			message:
				"You have unsaved changes. Are you sure you want to cancel?",
			header: "Unsaved Changes",
			icon: "pi pi-exclamation-triangle",
			acceptClass: "p-button-danger",
			accept: () => {
				handleGoBack();
			},
		});
	} else {
		handleGoBack();
	}
};

const handleGoBack = () => {
	router.push({
		name: "CompanyDetail",
		params: { id: companyId.value },
	});
};

const handleDelete = () => {
	// Check permission before deleting
	if (!canManage(companyId.value) || !canDeleteCompany.value) {
		showError("You do not have permission to delete this company");
		return;
	}

	confirm.require({
		message: `Are you sure you want to delete "${currentCompany.value.name}"? This action cannot be undone.`,
		header: "Delete Company",
		icon: "pi pi-exclamation-triangle",
		acceptClass: "p-button-danger",
		accept: async () => {
			try {
				const result = await deleteCompany(companyId.value);

				if (result.success) {
					showSuccess("Company deleted successfully");
					router.push({ name: "MyCompanies" });
				} else {
					showError(result.error || "Failed to delete company");
				}
			} catch (err) {
				showError("An error occurred while deleting the company");
			}
		},
	});
};

// Lifecycle
onMounted(() => {
	loadCompany();
});

// Watch for changes to current company (in case it updates)
watch(currentCompany, (newCompany) => {
	if (newCompany && !hasChanges.value) {
		populateForm(newCompany);
	}
});
</script>

<style scoped>
.edit-company-view {
	min-height: calc(100vh - 4rem);
}
</style>
