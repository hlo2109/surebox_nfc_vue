<template>
	<div class="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
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
							View and manage your company information
						</p>
					</div>
					<button
						v-if="!isEditing && canEditCompany"
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
			<div v-if="loading" class="flex items-center justify-center py-12">
				<div class="text-center">
					<div
						class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0D65AE] mx-auto"
					></div>
					<p class="text-gray-600 mt-4">Loading your company...</p>
				</div>
			</div>

			<!-- No Company State -->
			<div
				v-else-if="!company"
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
			<div v-else>
				<div
					class="bg-white rounded-xl border border-gray-200 shadow-sm"
				>
					<!-- Card Header -->
					<div
						class="flex items-center justify-between px-6 py-4 border-b border-gray-100"
					>
						<h2
							class="text-lg font-semibold text-gray-900 flex items-center gap-2"
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
								/>
							</svg>
							Company Information
						</h2>
						<div v-if="isEditing" class="flex items-center gap-2">
							<button
								@click="cancelEditing"
								class="px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
							>
								Cancel
							</button>
							<button
								@click="saveCompanyInfo"
								:disabled="saving"
								class="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-[#0D65AE] rounded-lg hover:bg-[#0a4f87] disabled:opacity-60 transition-all"
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
									/>
									<path
										class="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									/>
								</svg>
								{{ saving ? "Saving…" : "Save Changes" }}
							</button>
						</div>
					</div>

					<!-- Edit Form -->
					<form
						v-if="isEditing"
						@submit.prevent="saveCompanyInfo"
						class="p-6"
					>
						<div
							class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
						>
							<div>
								<label
									class="block text-sm font-medium text-gray-700 mb-1"
								>
									Company Name
								</label>
								<input
									v-model="editForm.name"
									type="text"
									class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D65AE] focus:border-transparent transition-all"
									placeholder="Company name"
								/>
							</div>
							<div>
								<label
									class="block text-sm font-medium text-gray-700 mb-1"
								>
									Email
								</label>
								<input
									v-model="editForm.email"
									type="email"
									class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D65AE] focus:border-transparent transition-all"
									placeholder="company@email.com"
								/>
							</div>
							<div>
								<label
									class="block text-sm font-medium text-gray-700 mb-1"
								>
									Phone
								</label>
								<input
									v-model="editForm.phone"
									type="text"
									class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D65AE] focus:border-transparent transition-all"
									placeholder="+1 000 000 0000"
								/>
							</div>
							<div>
								<label
									class="block text-sm font-medium text-gray-700 mb-1"
								>
									Address
								</label>
								<input
									v-model="editForm.address"
									type="text"
									class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D65AE] focus:border-transparent transition-all"
									placeholder="Street address"
								/>
							</div>
							<div>
								<label
									class="block text-sm font-medium text-gray-700 mb-1"
								>
									City
								</label>
								<input
									v-model="editForm.city"
									type="text"
									class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D65AE] focus:border-transparent transition-all"
									placeholder="City"
								/>
							</div>
							<div>
								<label
									class="block text-sm font-medium text-gray-700 mb-1"
								>
									Country
								</label>
								<input
									v-model="editForm.country"
									type="text"
									class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D65AE] focus:border-transparent transition-all"
									placeholder="Country"
								/>
							</div>
						</div>
					</form>

					<!-- View Mode -->
					<div v-else class="p-6">
						<div
							class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
						>
							<div>
								<label
									class="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1"
								>
									Company Name
								</label>
								<p class="text-gray-900 font-medium">
									{{ company.name || "—" }}
								</p>
							</div>
							<div>
								<label
									class="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1"
								>
									Email
								</label>
								<p class="text-gray-900">
									{{ company.email || "—" }}
								</p>
							</div>
							<div>
								<label
									class="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1"
								>
									Phone
								</label>
								<p class="text-gray-900">
									{{ company.phone || "—" }}
								</p>
							</div>
							<div>
								<label
									class="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1"
								>
									Address
								</label>
								<p class="text-gray-900">
									{{ company.address || "—" }}
								</p>
							</div>
							<div>
								<label
									class="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1"
								>
									City
								</label>
								<p class="text-gray-900">
									{{ company.city || "—" }}
								</p>
							</div>
							<div>
								<label
									class="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1"
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
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useCompanies, useToast, usePermissions } from "@/composables";

const router = useRouter();
const { showToast } = useToast();
const { fetchMyCompany, updateMyCompany } = useCompanies();
const { canEditCompany } = usePermissions();

const company = ref(null);
const loading = ref(false);
const saving = ref(false);
const isEditing = ref(false);

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
});

async function loadCompany() {
	loading.value = true;
	const result = await fetchMyCompany();
	if (result.success) {
		company.value = result.data;
	} else {
		showToast("error", "Error", "Failed to load your company information.");
		router.push("/");
	}
	loading.value = false;
}

function startEditing() {
	editForm.value = {
		name: company.value.name || "",
		email: company.value.email || "",
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
	const result = await updateMyCompany(editForm.value);
	if (result.success) {
		company.value = result.data;
		isEditing.value = false;
		showToast(
			"success",
			"Saved",
			"Company information updated successfully.",
		);
	} else {
		showToast("error", "Error", "Failed to save company information.");
	}
	saving.value = false;
}
</script>
