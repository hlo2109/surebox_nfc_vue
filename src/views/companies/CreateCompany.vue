<template>
	<div class="create-company-view p-6">
		<div class="max-w-4xl mx-auto">
			<div class="mb-6">
				<Button
					label="Back to Companies"
					icon="pi pi-arrow-left"
					class="p-button-text mb-4"
					@click="handleGoBack"
				/>

				<h1 class="text-3xl font-bold text-gray-900">Create Company</h1>
				<p class="mt-2 text-sm text-gray-600">
					Fill in the details below to create a new company
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
						class="flex items-center justify-end gap-3 pt-6 border-t border-gray-200"
					>
						<Button
							label="Cancel"
							class="p-button-text"
							@click="handleCancel"
							:disabled="isSubmitting"
						/>
						<Button
							label="Create Company"
							type="submit"
							icon="pi pi-check"
							:loading="isSubmitting"
							:disabled="!isFormValid"
						/>
					</div>
				</form>
			</div>

			<!-- Help Text -->
			<div class="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
				<div class="flex">
					<div class="flex-shrink-0">
						<i class="pi pi-info-circle text-blue-600"></i>
					</div>
					<div class="ml-3">
						<h3 class="text-sm font-medium text-blue-800">
							Company Information
						</h3>
						<div class="mt-2 text-sm text-blue-700">
							<ul class="list-disc list-inside space-y-1">
								<li>
									All required fields must be filled in to
									create a company
								</li>
								<li>
									You will be automatically added as the
									company owner
								</li>
								<li>
									You can add team members and locations after
									creation
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Dropdown from "primevue/dropdown";
import { useCompanies } from "@/composables/useCompanies";
import { useToast } from "@/composables/useToast";
import { usePermissions } from "@/composables/usePermissions";
import { isValidEmail, isValidPhone } from "@/utils/validators";

const router = useRouter();
const { showSuccess, showError } = useToast();
const { createCompany } = useCompanies();
const { canCreateCompany } = usePermissions();

// Check permissions on mount
onMounted(() => {
	if (!canCreateCompany.value) {
		showError("You do not have permission to create companies");
		router.push({ name: "Unauthorized" });
	}
});

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

// Form state
const isSubmitting = ref(false);
const errors = ref({});

// Status options
const statusOptions = [
	{ label: "Active", value: "active" },
	{ label: "Inactive", value: "inactive" },
	{ label: "Pending", value: "pending" },
];

// Computed
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

// Handlers
const handleSubmit = async () => {
	// Double-check permission before submitting
	if (!canCreateCompany.value) {
		showError("You do not have permission to create companies");
		return;
	}

	if (!validateForm()) {
		showError("Please fix the errors in the form");
		return;
	}

	isSubmitting.value = true;

	try {
		const result = await createCompany(formData.value);

		if (result.success) {
			showSuccess("Company created successfully");

			// Navigate to the company detail page
			if (result.data?.id) {
				router.push({
					name: "CompanyDetail",
					params: { id: result.data.id },
				});
			} else {
				router.push({ name: "MyCompanies" });
			}
		} else {
			showError(result.error || "Failed to create company");
		}
	} catch (error) {
		console.error("Error creating company:", error);
		showError("An error occurred while creating the company");
	} finally {
		isSubmitting.value = false;
	}
};

const handleCancel = () => {
	router.push({ name: "MyCompanies" });
};

const handleGoBack = () => {
	router.push({ name: "MyCompanies" });
};
</script>

<style scoped>
.create-company-view {
	min-height: calc(100vh - 4rem);
}
</style>
