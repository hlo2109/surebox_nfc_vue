<template>
	<div class="bg-gray-50 p-4 sm:p-6 lg:p-8">
		<div class="max-w-7xl mx-auto">
			<!-- Page Header -->
			<div class="mb-6 sm:mb-8">
				<div
					class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
				>
					<div>
						<h1
							class="text-3xl sm:text-4xl font-bold text-gray-900 mb-1 sm:mb-2"
						>
							My Company
						</h1>
						<p
							class="text-sm sm:text-base text-gray-600 flex items-center gap-2"
						>
							<svg
								class="w-4 h-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
								></path>
							</svg>
							Manage your company information, locations, and team
							members
						</p>
					</div>
					<button
						v-if="!isEditing"
						@click="startEditing"
						class="inline-flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-medium text-white bg-[#0D65AE] rounded-lg hover:bg-[#0a4f87] focus:ring-2 focus:ring-[#0D65AE] focus:ring-offset-2 transition-all"
					>
						<svg
							class="w-4 h-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
							/>
						</svg>
						<span class="hidden sm:inline">Edit Company</span>
						<span class="sm:hidden">Edit</span>
					</button>
				</div>
			</div>

			<!-- Loading State -->
			<div
				v-if="loading && !company"
				class="flex items-center justify-center py-12"
			>
				<div class="text-center">
					<div
						class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0D65AE] mx-auto"
					></div>
					<p class="text-gray-600 mt-4">Loading your company...</p>
				</div>
			</div>

			<!-- No Company State -->
			<div
				v-else-if="!company && !loading"
				class="text-center py-12 bg-white rounded-xl border border-gray-200"
			>
				<svg
					class="w-16 h-16 text-gray-400 mx-auto mb-4"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
					/>
				</svg>
				<h3 class="text-xl font-semibold text-gray-900 mb-2">
					No Company Found
				</h3>
				<p class="text-gray-600">
					You are not associated with any company yet.
				</p>
			</div>

			<!-- Company Content -->
			<div v-else class="space-y-6">
				<!-- Company Information Card -->
				<div
					class="bg-white rounded-xl border border-gray-200 hover:border-[#0D65AE] transition-all"
				>
					<div
						class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 sm:p-6 border-b border-gray-200"
					>
						<h2
							class="text-xl font-semibold text-gray-900 flex items-center gap-2"
						>
							<svg
								class="w-5 h-5 text-[#0D65AE]"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
								></path>
							</svg>
							Company Information
						</h2>
						<div v-if="isEditing" class="flex gap-2">
							<button
								@click="cancelEditing"
								:disabled="saving"
								class="px-3 sm:px-4 py-2 text-sm font-medium border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-[#0D65AE] focus:ring-offset-2 transition-all disabled:opacity-50"
							>
								Cancel
							</button>
							<button
								@click="saveCompanyInfo"
								:disabled="saving"
								class="px-3 sm:px-4 py-2 text-sm font-medium bg-[#0D65AE] text-white rounded-lg hover:bg-[#0a4f87] focus:ring-2 focus:ring-[#0D65AE] focus:ring-offset-2 transition-all disabled:opacity-50 flex items-center gap-2"
							>
								<svg
									v-if="saving"
									class="animate-spin w-4 h-4"
									fill="none"
									viewBox="0 0 24 24"
								>
									<circle
										class="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										stroke-width="4"
									></circle>
									<path
										class="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									></path>
								</svg>
								{{ saving ? "Saving..." : "Save Changes" }}
							</button>
						</div>
					</div>

					<div class="p-5 sm:p-6">
						<form
							v-if="isEditing"
							@submit.prevent="saveCompanyInfo"
							class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"
						>
							<div>
								<label
									class="block text-sm font-semibold text-gray-900 mb-2"
								>
									Company Name *
								</label>
								<input
									v-model="editForm.name"
									type="text"
									required
									class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#0D65AE] focus:ring-2 focus:ring-[#0D65AE] focus:ring-opacity-20 focus:outline-none transition-all"
								/>
							</div>
							<div>
								<label
									class="block text-sm font-semibold text-gray-900 mb-2"
								>
									Email *
								</label>
								<input
									v-model="editForm.email"
									type="email"
									required
									class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#0D65AE] focus:ring-2 focus:ring-[#0D65AE] focus:ring-opacity-20 focus:outline-none transition-all"
								/>
							</div>
							<div>
								<label
									class="block text-sm font-semibold text-gray-900 mb-2"
								>
									Phone
								</label>
								<input
									v-model="editForm.phone"
									type="tel"
									class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#0D65AE] focus:ring-2 focus:ring-[#0D65AE] focus:ring-opacity-20 focus:outline-none transition-all"
								/>
							</div>
							<div>
								<label
									class="block text-sm font-semibold text-gray-900 mb-2"
								>
									Address
								</label>
								<input
									v-model="editForm.address"
									type="text"
									class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#0D65AE] focus:ring-2 focus:ring-[#0D65AE] focus:ring-opacity-20 focus:outline-none transition-all"
								/>
							</div>
							<div>
								<label
									class="block text-sm font-semibold text-gray-900 mb-2"
								>
									City
								</label>
								<input
									v-model="editForm.city"
									type="text"
									class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#0D65AE] focus:ring-2 focus:ring-[#0D65AE] focus:ring-opacity-20 focus:outline-none transition-all"
								/>
							</div>
							<div>
								<label
									class="block text-sm font-semibold text-gray-900 mb-2"
								>
									Country
								</label>
								<input
									v-model="editForm.country"
									type="text"
									class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#0D65AE] focus:ring-2 focus:ring-[#0D65AE] focus:ring-opacity-20 focus:outline-none transition-all"
								/>
							</div>
						</form>

						<div
							v-else
							class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"
						>
							<div>
								<label
									class="block text-sm font-medium text-gray-500 mb-1"
								>
									Company Name
								</label>
								<p class="text-gray-900 font-medium">
									{{ company.name }}
								</p>
							</div>
							<div>
								<label
									class="block text-sm font-medium text-gray-500 mb-1"
								>
									Email
								</label>
								<p class="text-gray-900">
									{{ company.email }}
								</p>
							</div>
							<div>
								<label
									class="block text-sm font-medium text-gray-500 mb-1"
								>
									Phone
								</label>
								<p class="text-gray-900">
									{{ company.phone || "—" }}
								</p>
							</div>
							<div>
								<label
									class="block text-sm font-medium text-gray-500 mb-1"
								>
									Address
								</label>
								<p class="text-gray-900">
									{{ company.address || "—" }}
								</p>
							</div>
							<div>
								<label
									class="block text-sm font-medium text-gray-500 mb-1"
								>
									City
								</label>
								<p class="text-gray-900">
									{{ company.city || "—" }}
								</p>
							</div>
							<div>
								<label
									class="block text-sm font-medium text-gray-500 mb-1"
								>
									Country
								</label>
								<p class="text-gray-900">
									{{ company.country || "—" }}
								</p>
							</div>
						</div>
					</div>
				</div>

				<!-- Tabs -->
				<div
					class="bg-white rounded-xl border border-gray-200 hover:border-[#0D65AE] transition-all overflow-hidden"
				>
					<div class="border-b border-gray-200 bg-gray-50">
						<div class="flex gap-1 p-2">
							<button
								@click="activeTab = 'members'"
								:class="[
									'flex-1 py-2 sm:py-3 px-3 sm:px-4 rounded-lg font-medium transition-all',
									activeTab === 'members'
										? 'bg-[#0D65AE] text-white shadow-md'
										: 'text-gray-600 hover:text-gray-900 hover:bg-white',
								]"
							>
								<div
									class="flex items-center justify-center gap-2"
								>
									<svg
										class="w-4 h-4 sm:w-5 sm:h-5"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
										/>
									</svg>
									<span class="text-sm sm:text-base"
										>Members</span
									>
									<span
										v-if="members.length"
										class="px-2 py-0.5 rounded-full text-xs font-semibold"
										:class="
											activeTab === 'members'
												? 'bg-white/20 text-white'
												: 'bg-gray-200 text-gray-700'
										"
									>
										{{ members.length }}
									</span>
								</div>
							</button>
							<button
								@click="activeTab = 'locations'"
								:class="[
									'flex-1 py-2 sm:py-3 px-3 sm:px-4 rounded-lg font-medium transition-all',
									activeTab === 'locations'
										? 'bg-[#0D65AE] text-white shadow-md'
										: 'text-gray-600 hover:text-gray-900 hover:bg-white',
								]"
							>
								<div
									class="flex items-center justify-center gap-2"
								>
									<svg
										class="w-4 h-4 sm:w-5 sm:h-5"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
										/>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
										/>
									</svg>
									<span class="text-sm sm:text-base"
										>Locations</span
									>
									<span
										v-if="locations.length"
										class="px-2 py-0.5 rounded-full text-xs font-semibold"
										:class="
											activeTab === 'locations'
												? 'bg-white/20 text-white'
												: 'bg-gray-200 text-gray-700'
										"
									>
										{{ locations.length }}
									</span>
								</div>
							</button>
							<button
								@click="activeTab = 'services'"
								:class="[
									'flex-1 py-2 sm:py-3 px-3 sm:px-4 rounded-lg font-medium transition-all',
									activeTab === 'services'
										? 'bg-[#0D65AE] text-white shadow-md'
										: 'text-gray-600 hover:text-gray-900 hover:bg-white',
								]"
							>
								<div
									class="flex items-center justify-center gap-2"
								>
									<svg
										class="w-4 h-4 sm:w-5 sm:h-5"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
										/>
									</svg>
									<span class="text-sm sm:text-base"
										>Services</span
									>
									<span
										v-if="services.length"
										class="px-2 py-0.5 rounded-full text-xs font-semibold"
										:class="
											activeTab === 'services'
												? 'bg-white/20 text-white'
												: 'bg-gray-200 text-gray-700'
										"
									>
										{{ services.length }}
									</span>
								</div>
							</button>
						</div>
					</div>

					<!-- Tab Content -->
					<div class="p-4 sm:p-6">
						<!-- Members Tab -->
						<div v-if="activeTab === 'members'">
							<MembersList
								:company-id="company.id"
								:members="members"
								:loading="loading"
								@refresh="loadMembers"
							/>
						</div>

						<!-- Locations Tab -->
						<div v-if="activeTab === 'locations'">
							<LocationsList
								:company-id="company.id"
								:locations="locations"
								:loading="loading"
								@refresh="loadLocations"
							/>
						</div>

						<!-- Services Tab -->
						<div v-if="activeTab === 'services'">
							<!-- Service Categories Section -->
							<div class="mb-8">
								<ServiceCategoriesManager
									:categories="serviceCategories"
									:loading="loadingServices"
									:can-create="true"
									:can-edit="true"
									:can-delete="true"
									@refresh="loadServiceCategories"
								/>
							</div>

							<!-- Divider -->
							<div class="my-8 border-t border-gray-200"></div>

							<!-- Company Services Section -->
							<CompanyServicesManager
								:company-id="company.id"
								:services="services"
								:categories="serviceCategories"
								:loading="loadingServices"
								:can-create="true"
								:can-edit="true"
								:can-delete="true"
								@refresh="loadServices"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useCompanies, useToast, useServices } from "@/composables";
import { useAuthStore } from "@/stores/auth.store";
import MembersList from "@/components/companies/MembersList.vue";
import LocationsList from "@/components/companies/LocationsList.vue";
import ServiceCategoriesManager from "@/components/services/ServiceCategoriesManager.vue";
import CompanyServicesManager from "@/components/services/CompanyServicesManager.vue";

const router = useRouter();
const { showToast } = useToast();
const authStore = useAuthStore();

const {
	fetchMyCompany,
	updateCompany,
	fetchCompanyMembers,
	fetchCompanyLocations,
	state,
} = useCompanies();

const { fetchServiceCategories, fetchCompanyServices } = useServices();

const company = ref(null);
const members = ref([]);
const locations = ref([]);
const services = ref([]);
const serviceCategories = ref([]);
const loading = ref(false);
const loadingServices = ref(false);
const saving = ref(false);
const isEditing = ref(false);
const activeTab = ref("members");

const editForm = ref({
	name: "",
	email: "",
	phone: "",
	address: "",
	city: "",
	country: "",
});

onMounted(async () => {
	await loadCompany();
	await loadServiceCategories();
});

async function loadCompany() {
	loading.value = true;
	const result = await fetchMyCompany();
	if (result.success) {
		company.value = result.data;
		// Load members, locations, and services
		await Promise.all([loadMembers(), loadLocations(), loadServices()]);
	} else {
		// If fetch fails, user might not have a company
		showToast(
			"error",
			"Error",
			"Failed to load your company information. You may not have a company associated with your account.",
		);
		router.push("/");
	}
	loading.value = false;
}

async function loadMembers() {
	if (!company.value) return;
	// Request full user details with members
	const result = await fetchCompanyMembers(company.value.id, {
		include: "user",
	});
	if (result.success) {
		members.value = result.data;
	}
}

async function loadLocations() {
	if (!company.value) return;
	const result = await fetchCompanyLocations(company.value.id);
	if (result.success) {
		locations.value = result.data;
	}
}

async function loadServices() {
	if (!company.value) return;
	loadingServices.value = true;
	const result = await fetchCompanyServices(company.value.id);
	if (result.success) {
		services.value = result.data;
	}
	loadingServices.value = false;
}

async function loadServiceCategories() {
	loadingServices.value = true;
	const result = await fetchServiceCategories();
	if (result.success) {
		serviceCategories.value = result.data;
	}
	loadingServices.value = false;
}

function startEditing() {
	editForm.value = {
		name: company.value.name,
		email: company.value.email,
		phone: company.value.phone || "",
		address: company.value.address || "",
		city: company.value.city || "",
		country: company.value.country || "",
	};
	isEditing.value = true;
}

function cancelEditing() {
	isEditing.value = false;
	editForm.value = {
		name: "",
		email: "",
		phone: "",
		address: "",
		city: "",
		country: "",
	};
}

async function saveCompanyInfo() {
	saving.value = true;
	const result = await updateCompany(company.value.id, editForm.value);
	if (result.success) {
		company.value = result.data;
		isEditing.value = false;
		await loadCompany();
	}
	saving.value = false;
}
</script>
