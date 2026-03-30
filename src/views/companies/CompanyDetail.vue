<template>
	<div class="company-detail-view min-h-screen bg-gray-50 py-8">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

			<!-- Company Content -->
			<div v-else-if="currentCompany">
				<!-- Header with Back Button -->
				<div class="mb-6">
					<Button
						label="Back to Companies"
						icon="pi pi-arrow-left"
						class="p-button-text mb-4"
						@click="handleGoBack"
					/>

					<!-- Company Header Card -->
					<div class="bg-white rounded-lg shadow-md p-6">
						<div class="flex items-start justify-between">
							<div class="flex-1">
								<div class="flex items-center gap-3 mb-2">
									<h1
										class="text-3xl font-bold text-gray-900"
									>
										{{ currentCompany.name }}
									</h1>
									<span
										:class="statusClass"
										class="px-3 py-1 rounded-full text-sm font-medium"
									>
										{{ currentCompany.status || "Active" }}
									</span>
								</div>

								<!-- Company Info Grid -->
								<div
									class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4"
								>
									<div
										v-if="currentCompany.email"
										class="flex items-center gap-2 text-gray-700"
									>
										<i
											class="pi pi-envelope text-gray-400"
										></i>
										<a
											:href="`mailto:${currentCompany.email}`"
											class="hover:text-blue-600"
										>
											{{ currentCompany.email }}
										</a>
									</div>

									<div
										v-if="currentCompany.phone"
										class="flex items-center gap-2 text-gray-700"
									>
										<i
											class="pi pi-phone text-gray-400"
										></i>
										<a
											:href="`tel:${currentCompany.phone}`"
											class="hover:text-blue-600"
										>
											{{ currentCompany.phone }}
										</a>
									</div>

									<div
										v-if="fullAddress"
										class="flex items-start gap-2 text-gray-700 md:col-span-2"
									>
										<i
											class="pi pi-map-marker text-gray-400 mt-1"
										></i>
										<span>{{ fullAddress }}</span>
									</div>
								</div>

								<!-- Created Date -->
								<div
									v-if="currentCompany.created_at"
									class="mt-4 pt-4 border-t border-gray-200"
								>
									<p class="text-sm text-gray-600">
										<i class="pi pi-calendar mr-2"></i>
										Created
										{{
											formatDate(
												currentCompany.created_at,
											)
										}}
									</p>
								</div>
							</div>

							<!-- Action Buttons -->
							<div
								v-if="
									canEditThisCompany || menuItems.length > 1
								"
								class="flex gap-2 ml-4"
							>
								<Button
									v-if="canEditThisCompany"
									label="Edit"
									icon="pi pi-pencil"
									class="p-button-outlined"
									@click="handleEditCompany"
								/>
								<Button
									v-if="menuItems.length > 1"
									icon="pi pi-ellipsis-v"
									class="p-button-outlined p-button-secondary"
									@click="toggleMenu"
									aria-haspopup="true"
									aria-controls="overlay_menu"
								/>
								<Menu
									ref="menu"
									id="overlay_menu"
									:model="menuItems"
									:popup="true"
								/>
							</div>
						</div>
					</div>
				</div>

				<!-- Stats Cards -->
				<div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
					<div class="bg-white rounded-lg shadow p-6">
						<div class="flex items-center">
							<div class="flex-shrink-0">
								<i
									class="pi pi-users text-2xl text-blue-600"
								></i>
							</div>
							<div class="ml-3">
								<p class="text-sm font-medium text-gray-600">
									Members
								</p>
								<p class="text-xl font-semibold text-gray-900">
									{{ currentCompanyMembersCount }}
								</p>
							</div>
						</div>
					</div>

					<div class="bg-white rounded-lg shadow p-6">
						<div class="flex items-center">
							<div class="flex-shrink-0">
								<i
									class="pi pi-map-marker text-2xl text-green-600"
								></i>
							</div>
							<div class="ml-3">
								<p class="text-sm font-medium text-gray-600">
									Locations
								</p>
								<p class="text-xl font-semibold text-gray-900">
									{{ currentCompanyLocationsCount }}
								</p>
							</div>
						</div>
					</div>

					<div class="bg-white rounded-lg shadow p-6">
						<div class="flex items-center">
							<div class="flex-shrink-0">
								<i
									class="pi pi-tag text-2xl text-purple-600"
								></i>
							</div>
							<div class="ml-3">
								<p class="text-sm font-medium text-gray-600">
									Categories
								</p>
								<p class="text-xl font-semibold text-gray-900">
									{{ categoriesCount }}
								</p>
							</div>
						</div>
					</div>

					<div class="bg-white rounded-lg shadow p-6">
						<div class="flex items-center">
							<div class="flex-shrink-0">
								<i
									class="pi pi-briefcase text-2xl text-orange-600"
								></i>
							</div>
							<div class="ml-3">
								<p class="text-sm font-medium text-gray-600">
									Services
								</p>
								<p class="text-xl font-semibold text-gray-900">
									{{ servicesCount }}
								</p>
							</div>
						</div>
					</div>
				</div>

				<!-- Tabs -->
				<TabView v-model:activeIndex="activeTab">
					<!-- Members Tab -->
					<TabPanel header="Members">
						<MembersList
							:members="state.currentCompanyMembers"
							:loading="membersLoading"
							:can-add-members="canManageMembersHere"
							:can-manage-members="canManageMembersHere"
							@add-member="handleAddMember"
							@edit-member="handleEditMember"
							@remove-member="handleRemoveMember"
						/>
					</TabPanel>

					<!-- Locations Tab -->
					<TabPanel header="Locations">
						<LocationsList
							:locations="state.currentCompanyLocations"
							:loading="locationsLoading"
							:can-add-locations="canManageLocationsHere"
							:can-manage-locations="canManageLocationsHere"
							@add-location="handleAddLocation"
							@edit-location="handleEditLocation"
							@delete-location="handleDeleteLocation"
						/>
					</TabPanel>

					<!-- Categories Tab -->
					<TabPanel header="Categories">
						<div class="categories-section">
							<CategoriesList
								:categories="state.currentCompanyCategories"
								:loading="categoriesLoading"
								:can-add-categories="canManageCategoriesHere"
								:can-manage-categories="canManageCategoriesHere"
								@add-category="handleAddCategory"
								@edit-category="handleEditCategory"
								@delete-category="handleDeleteCategory"
							/>
						</div>
					</TabPanel>

					<!-- Services Tab -->
					<TabPanel header="Services">
						<CompanyServices
							:company-id="companyId"
							:company-name="currentCompany?.name"
						/>
					</TabPanel>
				</TabView>
			</div>
		</div>

		<!-- Add Member Dialog -->
		<Dialog
			v-model:visible="showAddMemberDialog"
			header="Add Team Member"
			:modal="true"
			:closable="true"
			:style="{ width: '500px' }"
		>
			<div class="space-y-4">
				<div>
					<label
						for="member-email"
						class="block text-sm font-medium text-gray-700 mb-2"
					>
						Email Address *
					</label>
					<InputText
						id="member-email"
						v-model="newMember.email"
						placeholder="member@example.com"
						class="w-full"
					/>
				</div>

				<div>
					<label
						for="member-role"
						class="block text-sm font-medium text-gray-700 mb-2"
					>
						Role
					</label>
					<InputText
						id="member-role"
						v-model="newMember.role"
						placeholder="e.g., Manager, Admin"
						class="w-full"
					/>
				</div>
			</div>

			<template #footer>
				<Button
					label="Cancel"
					class="p-button-text"
					@click="showAddMemberDialog = false"
				/>
				<Button
					label="Add Member"
					:loading="addingMember"
					@click="submitAddMember"
				/>
			</template>
		</Dialog>

		<!-- Add Location Dialog -->
		<Dialog
			v-model:visible="showAddLocationDialog"
			header="Add Location"
			:modal="true"
			:closable="true"
			:style="{ width: '600px' }"
		>
			<div class="space-y-4">
				<div>
					<label
						for="location-name"
						class="block text-sm font-medium text-gray-700 mb-2"
					>
						Location Name *
					</label>
					<InputText
						id="location-name"
						v-model="newLocation.name"
						placeholder="e.g., Main Office"
						class="w-full"
					/>
				</div>

				<div>
					<label
						for="location-address"
						class="block text-sm font-medium text-gray-700 mb-2"
					>
						Address *
					</label>
					<InputText
						id="location-address"
						v-model="newLocation.address"
						placeholder="Street address"
						class="w-full"
					/>
				</div>

				<div class="grid grid-cols-2 gap-4">
					<div>
						<label
							for="location-phone"
							class="block text-sm font-medium text-gray-700 mb-2"
						>
							Phone
						</label>
						<InputText
							id="location-phone"
							v-model="newLocation.phone"
							placeholder="Phone number"
							class="w-full"
						/>
					</div>

					<div>
						<label
							for="location-email"
							class="block text-sm font-medium text-gray-700 mb-2"
						>
							Email
						</label>
						<InputText
							id="location-email"
							v-model="newLocation.email"
							placeholder="Email"
							class="w-full"
						/>
					</div>
				</div>
			</div>

			<template #footer>
				<Button
					label="Cancel"
					class="p-button-text"
					@click="showAddLocationDialog = false"
				/>
				<Button
					label="Add Location"
					:loading="addingLocation"
					@click="submitAddLocation"
				/>
			</template>
		</Dialog>

		<!-- Add Category Dialog -->
		<Dialog
			v-model:visible="showAddCategoryDialog"
			header="Add Category"
			:modal="true"
			:closable="true"
			:style="{ width: '500px' }"
		>
			<div class="space-y-4">
				<div>
					<label
						for="category-name"
						class="block text-sm font-medium text-gray-700 mb-2"
					>
						Category Name *
					</label>
					<InputText
						id="category-name"
						v-model="newCategory.name"
						placeholder="e.g., Plumbing"
						class="w-full"
					/>
				</div>

				<div>
					<label
						for="category-description"
						class="block text-sm font-medium text-gray-700 mb-2"
					>
						Description
					</label>
					<Textarea
						id="category-description"
						v-model="newCategory.description"
						rows="3"
						placeholder="Category description"
						class="w-full"
					/>
				</div>
			</div>

			<template #footer>
				<Button
					label="Cancel"
					class="p-button-text"
					@click="showAddCategoryDialog = false"
				/>
				<Button
					label="Add Category"
					:loading="addingCategory"
					@click="submitAddCategory"
				/>
			</template>
		</Dialog>
	</div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import Button from "primevue/button";
import Menu from "primevue/menu";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import { useCompanies } from "@/composables/useCompanies";
import { useServices } from "@/composables/useServices";
import { useToast } from "@/composables/useToast";
import { usePermissions } from "@/composables/usePermissions";
import { useConfirm } from "primevue/useconfirm";
import LoadingSpinner from "@/components/common/LoadingSpinner.vue";
import EmptyState from "@/components/common/EmptyState.vue";
import MembersList from "@/components/companies/MembersList.vue";
import LocationsList from "@/components/companies/LocationsList.vue";
import CategoriesList from "@/components/companies/CategoriesList.vue";
import CompanyServices from "@/views/services/CompanyServices.vue";
import { formatDate } from "@/utils/formatters";

const router = useRouter();
const route = useRoute();
const { showSuccess, showError } = useToast();
const confirm = useConfirm();
const {
	canManage,
	canEditCompany,
	canDeleteCompany,
	canManageMembers,
	canManageLocations,
	canManageCategories,
	canViewCompany,
} = usePermissions();

// Composable
const {
	state,
	currentCompanyMembersCount,
	currentCompanyLocationsCount,
	fetchCompany,
	fetchCompanyMembers,
	fetchCompanyLocations,
	fetchCompanyCategories,
	addCompanyMember,
	addCompanyLocation,
	createCompanyCategory,
	removeCompanyMember,
	deleteCompanyLocation,
	deleteCompanyCategory,
	deleteCompany,
} = useCompanies();

// Services composable
const {
	state: servicesState,
	servicesCount: servicesCountComputed,
	fetchCompanyServices,
} = useServices();

// Local state
const isLoading = ref(false);
const membersLoading = ref(false);
const locationsLoading = ref(false);
const categoriesLoading = ref(false);
const servicesLoading = ref(false);
const error = ref(null);
const activeTab = ref(0);
const menu = ref();

// Dialog states
const showAddMemberDialog = ref(false);
const showAddLocationDialog = ref(false);
const showAddCategoryDialog = ref(false);
const addingMember = ref(false);
const addingLocation = ref(false);
const addingCategory = ref(false);

// Form data
const newMember = ref({ email: "", role: "" });
const newLocation = ref({ name: "", address: "", phone: "", email: "" });
const newCategory = ref({ name: "", description: "" });

// Computed
const companyId = computed(() => parseInt(route.params.id));

const currentCompany = computed(() => state.currentCompany);

const statusClass = computed(() => {
	const status = currentCompany.value?.status?.toLowerCase();

	if (status === "active") {
		return "bg-green-100 text-green-800";
	} else if (status === "inactive") {
		return "bg-gray-100 text-gray-800";
	} else if (status === "pending") {
		return "bg-yellow-100 text-yellow-800";
	}

	return "bg-gray-100 text-gray-800";
});

const fullAddress = computed(() => {
	if (!currentCompany.value) return "";

	const parts = [
		currentCompany.value.address,
		currentCompany.value.city,
		currentCompany.value.country,
	].filter(Boolean);

	return parts.join(", ");
});

const categoriesCount = computed(() => state.currentCompanyCategories.length);
const servicesCount = computed(() => servicesCountComputed.value || 0);

const canManageCompany = computed(() => {
	return canManage(companyId.value);
});

const canEditThisCompany = computed(() => {
	return canManageCompany.value && canEditCompany.value;
});

const canDeleteThisCompany = computed(() => {
	return canManageCompany.value && canDeleteCompany.value;
});

const canManageMembersHere = computed(() => {
	return canManageCompany.value && canManageMembers.value;
});

const canManageLocationsHere = computed(() => {
	return canManageCompany.value && canManageLocations.value;
});

const canManageCategoriesHere = computed(() => {
	return canManageCompany.value && canManageCategories.value;
});

const menuItems = computed(() => {
	const items = [
		{
			label: "Refresh",
			icon: "pi pi-refresh",
			command: loadCompanyData,
		},
	];

	if (canDeleteThisCompany.value) {
		items.push(
			{
				separator: true,
			},
			{
				label: "Delete Company",
				icon: "pi pi-trash",
				command: handleDeleteCompany,
				class: "text-red-600",
			},
		);
	}

	return items;
});

// Methods
const loadCompanyData = async () => {
	isLoading.value = true;
	error.value = null;

	try {
		const result = await fetchCompany(companyId.value);

		if (!result.success) {
			error.value = result.error || "Failed to load company";
			return;
		}

		// Check view permission after loading
		if (currentCompany.value && !canViewCompany.value) {
			showError("You do not have permission to view this company");
			router.push({ name: "Unauthorized" });
			return;
		}

		// Load related data in parallel
		await Promise.all([
			loadMembers(),
			loadLocations(),
			loadCategories(),
			loadServices(),
		]);
	} catch (err) {
		error.value = err.message || "An error occurred";
		console.error("Error loading company:", err);
	} finally {
		isLoading.value = false;
	}
};

const loadMembers = async () => {
	membersLoading.value = true;
	try {
		await fetchCompanyMembers(companyId.value);
	} catch (err) {
		console.error("Error loading members:", err);
	} finally {
		membersLoading.value = false;
	}
};

const loadLocations = async () => {
	locationsLoading.value = true;
	try {
		await fetchCompanyLocations(companyId.value);
	} catch (err) {
		console.error("Error loading locations:", err);
	} finally {
		locationsLoading.value = false;
	}
};

const loadCategories = async () => {
	categoriesLoading.value = true;
	try {
		await fetchCompanyCategories(companyId.value);
	} catch (err) {
		console.error("Error loading categories:", err);
	} finally {
		categoriesLoading.value = false;
	}
};

const loadServices = async () => {
	servicesLoading.value = true;
	try {
		await fetchCompanyServices(companyId.value);
	} catch (err) {
		console.error("Error loading services:", err);
	} finally {
		servicesLoading.value = false;
	}
};

const toggleMenu = (event) => {
	menu.value.toggle(event);
};

const handleGoBack = () => {
	router.push({ name: "MyCompanies" });
};

const handleEditCompany = () => {
	if (!canEditThisCompany.value) {
		showError("You do not have permission to edit this company");
		return;
	}

	router.push({
		name: "EditCompany",
		params: { id: companyId.value },
	});
};

const handleDeleteCompany = () => {
	if (!canDeleteThisCompany.value) {
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

// Members handlers
const handleAddMember = () => {
	if (!canManageMembersHere.value) {
		showError("You do not have permission to add members");
		return;
	}

	newMember.value = { email: "", role: "" };
	showAddMemberDialog.value = true;
};

const handleEditMember = (member) => {
	// TODO: Implement edit member
	showError("Edit member not yet implemented");
};

const handleRemoveMember = (member) => {
	if (!canManageMembersHere.value) {
		showError("You do not have permission to remove members");
		return;
	}

	confirm.require({
		message: `Are you sure you want to remove ${member.name || member.email} from this company?`,
		header: "Remove Member",
		icon: "pi pi-exclamation-triangle",
		acceptClass: "p-button-danger",
		accept: async () => {
			try {
				const result = await removeCompanyMember(
					companyId.value,
					member.user_id || member.id,
				);
				if (result.success) {
					showSuccess("Member removed successfully");
					loadMembers();
				} else {
					showError(result.error || "Failed to remove member");
				}
			} catch (err) {
				showError("An error occurred while removing the member");
			}
		},
	});
};

const submitAddMember = async () => {
	if (!canManageMembersHere.value) {
		showError("You do not have permission to add members");
		return;
	}

	if (!newMember.value.email) {
		showError("Please enter an email address");
		return;
	}

	addingMember.value = true;

	try {
		const result = await addCompanyMember(companyId.value, {
			email: newMember.value.email,
			role: newMember.value.role || "member",
		});

		if (result.success) {
			showSuccess("Member added successfully");
			showAddMemberDialog.value = false;
			loadMembers();
		} else {
			showError(result.error || "Failed to add member");
		}
	} catch (err) {
		showError("An error occurred while adding the member");
	} finally {
		addingMember.value = false;
	}
};

// Locations handlers
const handleAddLocation = () => {
	if (!canManageLocationsHere.value) {
		showError("You do not have permission to add locations");
		return;
	}

	newLocation.value = { name: "", address: "", phone: "", email: "" };
	showAddLocationDialog.value = true;
};

const handleEditLocation = (location) => {
	// TODO: Implement edit location
	showError("Edit location not yet implemented");
};

const handleDeleteLocation = (location) => {
	if (!canManageLocationsHere.value) {
		showError("You do not have permission to delete locations");
		return;
	}

	confirm.require({
		message: `Are you sure you want to delete "${location.name}"?`,
		header: "Delete Location",
		icon: "pi pi-exclamation-triangle",
		acceptClass: "p-button-danger",
		accept: async () => {
			try {
				const result = await deleteCompanyLocation(
					companyId.value,
					location.id,
				);
				if (result.success) {
					showSuccess("Location deleted successfully");
					loadLocations();
				} else {
					showError(result.error || "Failed to delete location");
				}
			} catch (err) {
				showError("An error occurred while deleting the location");
			}
		},
	});
};

const submitAddLocation = async () => {
	if (!canManageLocationsHere.value) {
		showError("You do not have permission to add locations");
		return;
	}

	if (!newLocation.value.name || !newLocation.value.address) {
		showError("Please fill in all required fields");
		return;
	}

	addingLocation.value = true;

	try {
		const result = await addCompanyLocation(
			companyId.value,
			newLocation.value,
		);

		if (result.success) {
			showSuccess("Location added successfully");
			showAddLocationDialog.value = false;
			loadLocations();
		} else {
			showError(result.error || "Failed to add location");
		}
	} catch (err) {
		showError("An error occurred while adding the location");
	} finally {
		addingLocation.value = false;
	}
};

// Categories handlers
const handleAddCategory = () => {
	if (!canManageCategoriesHere.value) {
		showError("You do not have permission to add categories");
		return;
	}

	newCategory.value = { name: "", description: "" };
	showAddCategoryDialog.value = true;
};

const handleEditCategory = (category) => {
	// TODO: Implement edit category
	showError("Edit category not yet implemented");
};

const handleDeleteCategory = (category) => {
	if (!canManageCategoriesHere.value) {
		showError("You do not have permission to delete categories");
		return;
	}

	confirm.require({
		message: `Are you sure you want to delete the category "${category.name}"?`,
		header: "Delete Category",
		icon: "pi pi-exclamation-triangle",
		acceptClass: "p-button-danger",
		accept: async () => {
			try {
				const result = await deleteCompanyCategory(
					companyId.value,
					category.id,
				);
				if (result.success) {
					showSuccess("Category deleted successfully");
					loadCategories();
				} else {
					showError(result.error || "Failed to delete category");
				}
			} catch (err) {
				showError("An error occurred while deleting the category");
			}
		},
	});
};

const submitAddCategory = async () => {
	if (!canManageCategoriesHere.value) {
		showError("You do not have permission to add categories");
		return;
	}

	if (!newCategory.value.name) {
		showError("Please enter a category name");
		return;
	}

	addingCategory.value = true;

	try {
		const result = await createCompanyCategory(
			companyId.value,
			newCategory.value,
		);

		if (result.success) {
			showSuccess("Category added successfully");
			showAddCategoryDialog.value = false;
			loadCategories();
		} else {
			showError(result.error || "Failed to add category");
		}
	} catch (err) {
		showError("An error occurred while adding the category");
	} finally {
		addingCategory.value = false;
	}
};

// Lifecycle
onMounted(() => {
	loadCompanyData();
});
</script>

<style scoped>
.company-detail-view {
	min-height: calc(100vh - 4rem);
}
</style>
