<template>
	<div class="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
		<div class="max-w-2xl mx-auto">
			<!-- Header -->
			<div class="mb-6">
				<button
					type="button"
					@click="handleBack"
					class="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors"
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
							d="M15 19l-7-7 7-7"
						/>
					</svg>
					Back
				</button>
				<h1 class="text-2xl sm:text-3xl font-bold text-gray-900">
					Create Service Request
				</h1>
				<p class="text-gray-500 mt-1 text-sm">
					Fill in the details to request a service from a company
				</p>
			</div>

			<!-- Loading services skeleton -->
			<div
				v-if="loadingServices"
				class="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center"
			>
				<div
					class="w-8 h-8 border-4 border-[#0D65AE] border-t-transparent rounded-full animate-spin mx-auto mb-4"
				></div>
				<p class="text-sm text-gray-500">Loading available services…</p>
			</div>

			<!-- Form -->
			<div
				v-else
				class="bg-white rounded-xl border border-gray-200 shadow-sm"
			>
				<form
					@submit.prevent="handleSubmit"
					class="p-6 space-y-6"
					novalidate
				>
					<!-- ── 1. Service selection ── -->
					<div>
						<label
							class="block text-sm font-medium text-gray-700 mb-1.5"
						>
							Service <span class="text-red-500">*</span>
						</label>

						<!-- Selected chip -->
						<div
							v-if="selectedService"
							class="flex items-center gap-3 p-3 bg-[#0D65AE]/5 border border-[#0D65AE]/20 rounded-lg"
						>
							<div class="flex-1 min-w-0">
								<p
									class="font-medium text-gray-900 text-sm truncate"
								>
									{{ selectedService.name }}
								</p>
								<p class="text-xs text-gray-500 mt-0.5">
									{{ selectedService.company?.name }}
								</p>
							</div>
							<button
								type="button"
								@click="clearService"
								class="flex-shrink-0 p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
								title="Change service"
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
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
						</div>

						<!-- Search combobox -->
						<div
							v-else
							class="relative"
							v-click-outside="closeServiceDropdown"
						>
							<div class="relative">
								<svg
									class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
									/>
								</svg>
								<input
									v-model="serviceSearch"
									type="text"
									placeholder="Search services…"
									autocomplete="off"
									@focus="showServiceDropdown = true"
									@input="showServiceDropdown = true"
									class="w-full pl-9 pr-4 py-2.5 text-sm border rounded-lg outline-none transition-colors"
									:class="[
										errors.serviceId
											? 'border-red-400 focus:ring-2 focus:ring-red-200'
											: 'border-gray-300 focus:ring-2 focus:ring-[#0D65AE]/30 focus:border-[#0D65AE]',
									]"
								/>
							</div>

							<!-- Dropdown list -->
							<div
								v-if="showServiceDropdown"
								class="absolute z-20 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
							>
								<div
									v-if="filteredServiceOptions.length === 0"
									class="px-4 py-6 text-sm text-gray-400 text-center"
								>
									{{
										serviceSearch
											? "No services match your search"
											: "No services available"
									}}
								</div>
								<button
									v-for="svc in filteredServiceOptions"
									:key="svc.id"
									type="button"
									@click="selectService(svc)"
									class="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors"
								>
									<div
										class="font-medium text-gray-900 text-sm"
									>
										{{ svc.name }}
									</div>
									<div class="flex items-center gap-2 mt-0.5">
										<span class="text-xs text-gray-500">{{
											svc.company?.name
										}}</span>
										<span
											v-if="svc.price"
											class="text-xs font-medium text-[#0D65AE]"
										>
											· {{ formatCurrency(svc.price) }}
										</span>
										<span
											v-if="svc.duration"
											class="text-xs text-gray-400"
										>
											· {{ svc.duration }} min
										</span>
									</div>
								</button>
							</div>
						</div>

						<p
							v-if="errors.serviceId"
							class="mt-1.5 text-xs text-red-500 flex items-center gap-1"
						>
							<svg
								class="w-3.5 h-3.5 flex-shrink-0"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path
									fill-rule="evenodd"
									d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
									clip-rule="evenodd"
								/>
							</svg>
							{{ errors.serviceId }}
						</p>
						<p v-else class="mt-1.5 text-xs text-gray-400">
							Select the service you need
						</p>
					</div>

					<!-- ── Selected service info card ── -->
					<div
						v-if="selectedService"
						class="rounded-lg bg-blue-50 border border-blue-200 p-4"
					>
						<div class="flex items-start justify-between gap-4">
							<div class="flex-1 min-w-0">
								<h3 class="font-semibold text-blue-900 text-sm">
									{{ selectedService.name }}
								</h3>
								<p class="text-xs text-blue-700 mt-0.5">
									{{ selectedService.company?.name }}
								</p>
								<p
									v-if="selectedService.description"
									class="text-sm text-gray-600 mt-2 leading-relaxed"
								>
									{{ selectedService.description }}
								</p>
							</div>
						</div>
						<div class="flex items-center gap-4 mt-3">
							<div
								v-if="selectedService.price"
								class="flex items-center gap-1"
							>
								<svg
									class="w-4 h-4 text-green-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
								<span
									class="text-sm font-semibold text-green-600"
									>{{
										formatCurrency(selectedService.price)
									}}</span
								>
							</div>
							<div
								v-if="selectedService.duration"
								class="flex items-center gap-1"
							>
								<svg
									class="w-4 h-4 text-blue-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
								<span class="text-xs text-blue-700"
									>{{ selectedService.duration }} min</span
								>
							</div>
						</div>
					</div>

					<!-- ── 2. Location ── -->
					<div>
						<label
							for="location"
							class="block text-sm font-medium text-gray-700 mb-1.5"
						>
							Location <span class="text-red-500">*</span>
						</label>

						<!-- NFC box picker -->
						<div class="mb-3">
							<p
								class="text-xs text-gray-500 mb-2 flex items-center gap-1.5"
							>
								<svg
									class="w-3.5 h-3.5 text-[#0D65AE] flex-shrink-0"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2v-4M9 21H5a2 2 0 01-2-2v-4m0 0h18"
									/>
								</svg>
								Pick one of your SureBoxes to auto-fill the
								address
							</p>

							<!-- Loading skeleton -->
							<div
								v-if="loadingBoxes"
								class="flex gap-2 flex-wrap"
							>
								<div
									v-for="n in 3"
									:key="n"
									class="h-9 w-32 rounded-lg bg-gray-100 animate-pulse"
								/>
							</div>

							<!-- No boxes registered -->
							<p
								v-else-if="availableBoxes.length === 0"
								class="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2"
							>
								You have no SureBoxes registered. Please add one
								in
								<router-link
									to="/mybox"
									class="underline font-medium"
									>My Boxes</router-link
								>
								before creating a request.
							</p>

							<!-- Box cards -->
							<div v-else class="flex flex-wrap gap-2">
								<button
									v-for="box in availableBoxes"
									:key="box.uuid || box.id"
									type="button"
									@click="selectBox(box)"
									:class="[
										selectedBoxId === (box.uuid || box.id)
											? 'border-[#0D65AE] bg-[#0D65AE]/5 text-[#0D65AE] ring-1 ring-[#0D65AE]/30'
											: 'border-gray-200 bg-white text-gray-700 hover:border-[#0D65AE]/40 hover:bg-gray-50',
										'flex items-center gap-2 px-3 py-2 border rounded-lg text-xs font-medium transition-colors max-w-[220px]',
									]"
								>
									<!-- NFC chip icon -->
									<svg
										class="w-3.5 h-3.5 flex-shrink-0"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2v-4M9 21H5a2 2 0 01-2-2v-4m0 0h18"
										/>
									</svg>
									<span class="truncate">{{
										box.nickname || box.code || "SureBox"
									}}</span>
									<span
										v-if="box.address"
										class="text-gray-400 font-normal truncate"
										>· {{ box.address }}</span
									>
								</button>
							</div>
						</div>

						<p
							v-if="errors.location"
							class="mt-1.5 text-xs text-red-500 flex items-center gap-1"
						>
							<svg
								class="w-3.5 h-3.5 flex-shrink-0"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path
									fill-rule="evenodd"
									d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
									clip-rule="evenodd"
								/>
							</svg>
							{{ errors.location }}
						</p>
						<p v-else class="mt-1.5 text-xs text-gray-400">
							Select one of your SureBoxes to set the service
							location
						</p>
					</div>

					<!-- ── 3. Description ── -->
					<div>
						<label
							for="description"
							class="block text-sm font-medium text-gray-700 mb-1.5"
						>
							Description
						</label>
						<textarea
							id="description"
							v-model="formData.description"
							rows="4"
							placeholder="Describe your requirements, any specific details, or special requests…"
							class="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg outline-none resize-none transition-colors focus:ring-2 focus:ring-[#0D65AE]/30 focus:border-[#0D65AE]"
						></textarea>
						<p class="mt-1.5 text-xs text-gray-400">
							Optional — provide any helpful context
						</p>
					</div>

					<!-- ── 4. Preferred Date ── -->
					<div>
						<label
							for="preferredDate"
							class="block text-sm font-medium text-gray-700 mb-1.5"
						>
							Preferred Date
						</label>
						<div class="relative">
							<svg
								class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
								/>
							</svg>
							<input
								id="preferredDate"
								v-model="formData.preferredDate"
								type="date"
								:min="minDateString"
								class="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg outline-none transition-colors focus:ring-2 focus:ring-[#0D65AE]/30 focus:border-[#0D65AE]"
							/>
						</div>
						<p class="mt-1.5 text-xs text-gray-400">
							Optional — when would you like it?
						</p>
					</div>

					<!-- ── Form actions ── -->
					<div
						class="flex items-center justify-end gap-3 pt-4 border-t border-gray-100"
					>
						<button
							type="button"
							@click="handleCancel"
							:disabled="isSubmitting"
							class="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
						>
							Cancel
						</button>
						<button
							type="submit"
							:disabled="!isFormValid || isSubmitting"
							class="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-[#0D65AE] rounded-lg hover:bg-[#0a4f87] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
						>
							<svg
								v-if="isSubmitting"
								class="w-4 h-4 animate-spin"
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
									d="M4 12a8 8 0 018-8v8H4z"
								/>
							</svg>
							<svg
								v-else
								class="w-4 h-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							{{
								isSubmitting ? "Submitting…" : "Create Request"
							}}
						</button>
					</div>
				</form>
			</div>
		</div>

		<!-- ── Confirmation modal ── -->
		<Transition name="modal">
			<div
				v-if="showConfirmDialog"
				class="fixed inset-0 z-50 flex items-center justify-center p-4"
			>
				<!-- Backdrop -->
				<div
					class="absolute inset-0 bg-black/40 backdrop-blur-sm"
					@click="!isSubmitting && (showConfirmDialog = false)"
				></div>

				<!-- Panel -->
				<div
					class="relative bg-white rounded-xl shadow-xl w-full max-w-md"
				>
					<!-- Header -->
					<div
						class="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100"
					>
						<div>
							<h2 class="text-base font-bold text-gray-900">
								Confirm Service Request
							</h2>
							<p class="text-xs text-gray-500 mt-0.5">
								Review the details before submitting
							</p>
						</div>
						<button
							type="button"
							:disabled="isSubmitting"
							@click="showConfirmDialog = false"
							class="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
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
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</div>

					<!-- Summary -->
					<div class="px-6 py-4">
						<div
							class="bg-gray-50 rounded-lg border border-gray-200 divide-y divide-gray-100"
						>
							<div
								class="flex items-start justify-between px-4 py-2.5 gap-4"
							>
								<span
									class="text-xs text-gray-500 flex-shrink-0 pt-0.5"
									>Service</span
								>
								<span
									class="text-sm font-medium text-gray-900 text-right"
									>{{ selectedService?.name }}</span
								>
							</div>
							<div
								class="flex items-start justify-between px-4 py-2.5 gap-4"
							>
								<span
									class="text-xs text-gray-500 flex-shrink-0 pt-0.5"
									>Company</span
								>
								<span
									class="text-sm font-medium text-gray-900 text-right"
									>{{ selectedService?.company?.name }}</span
								>
							</div>
							<div
								class="flex items-start justify-between px-4 py-2.5 gap-4"
							>
								<span
									class="text-xs text-gray-500 flex-shrink-0 pt-0.5"
									>Location</span
								>
								<span
									class="text-sm font-medium text-gray-900 text-right"
									>{{
										selectedService
											? availableBoxes.find(
													(b) =>
														(b.uuid || b.id) ===
														selectedBoxId,
												)?.nickname ||
												availableBoxes.find(
													(b) =>
														(b.uuid || b.id) ===
														selectedBoxId,
												)?.address ||
												"SureBox selected"
											: "—"
									}}</span
								>
							</div>
							<div
								v-if="formData.preferredDate"
								class="flex items-center justify-between px-4 py-2.5 gap-4"
							>
								<span class="text-xs text-gray-500">Date</span>
								<span
									class="text-sm font-medium text-gray-900"
									>{{ formData.preferredDate }}</span
								>
							</div>
						</div>
					</div>

					<!-- Footer -->
					<div
						class="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100"
					>
						<button
							type="button"
							:disabled="isSubmitting"
							@click="showConfirmDialog = false"
							class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
						>
							Go back
						</button>
						<button
							type="button"
							:disabled="isSubmitting"
							@click="confirmSubmit"
							class="inline-flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-[#0D65AE] rounded-lg hover:bg-[#0a4f87] disabled:opacity-50 transition-colors"
						>
							<svg
								v-if="isSubmitting"
								class="w-4 h-4 animate-spin"
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
									d="M4 12a8 8 0 018-8v8H4z"
								/>
							</svg>
							{{
								isSubmitting
									? "Submitting…"
									: "Confirm & Submit"
							}}
						</button>
					</div>
				</div>
			</div>
		</Transition>
	</div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useServiceRequests } from "@/composables/useServiceRequests";
import { useServices } from "@/composables/useServices";
import { useCompanies } from "@/composables/useCompanies";
import { useNfc } from "@/composables/useNfc";
import { usePermissions } from "@/composables/usePermissions";
import { useToast } from "@/composables/useToast";
import { formatCurrency } from "@/utils/formatters";

const router = useRouter();
const route = useRoute();
const { showSuccess, showError } = useToast();

const { createServiceRequest } = useServiceRequests();
const { fetchService, fetchServiceCategories, fetchCompanyServices } =
	useServices();
const { fetchCompanies } = useCompanies();
const { fetchMyNfcTags } = useNfc();
const { canCreateRequest } = usePermissions();

// ─── State ────────────────────────────────────────────────────────────────────

const formData = ref({
	serviceId: null,
	companyId: null,
	location: "",
	description: "",
	preferredDate: "",
	budget: null,
	contactName: "",
	contactPhone: "",
});

const errors = ref({});
const isSubmitting = ref(false);
const showConfirmDialog = ref(false);

// Services list
const loadingServices = ref(false);
const availableServices = ref([]);

// NFC boxes (for location picker)
const loadingBoxes = ref(false);
const availableBoxes = ref([]);
const selectedBoxId = ref(null);

// Combobox state
const serviceSearch = ref("");
const showServiceDropdown = ref(false);

// Min date for the date picker (today)
const minDateString = computed(() => {
	const d = new Date();
	return d.toISOString().split("T")[0];
});

// ─── Computed ─────────────────────────────────────────────────────────────────

const selectedService = computed(
	() =>
		availableServices.value.find(
			(s) => s.id === formData.value.serviceId,
		) ?? null,
);

const filteredServiceOptions = computed(() => {
	const q = serviceSearch.value.trim().toLowerCase();
	if (!q) return availableServices.value;
	return availableServices.value.filter(
		(s) =>
			s.name?.toLowerCase().includes(q) ||
			s.company?.name?.toLowerCase().includes(q) ||
			s.description?.toLowerCase().includes(q),
	);
});

const isFormValid = computed(
	() =>
		!!formData.value.serviceId &&
		!!formData.value.companyId &&
		!!selectedBoxId.value &&
		canCreateRequest.value,
);

// ─── Service selector helpers ─────────────────────────────────────────────────

// ─── NFC box selector helpers ─────────────────────────────────────────────────

function selectBox(box) {
	const id = box.uuid || box.id;
	if (selectedBoxId.value === id) {
		// Deselect if clicking the already-selected box
		selectedBoxId.value = null;
		formData.value.location = "";
	} else {
		selectedBoxId.value = id;
		formData.value.location = box.address || "";
	}
	// Clear any location error
	if (errors.value.location) {
		const { location: _drop, ...rest } = errors.value;
		errors.value = rest;
	}
}

function selectService(svc) {
	formData.value.serviceId = svc.id;
	formData.value.companyId = svc.companyUuid || svc.company?.uuid || null;
	if (svc.price) formData.value.budget = svc.price;
	serviceSearch.value = "";
	showServiceDropdown.value = false;
	// Clear any service error
	if (errors.value.serviceId) {
		const { serviceId: _drop, ...rest } = errors.value;
		errors.value = rest;
	}
}

function clearService() {
	formData.value.serviceId = null;
	formData.value.companyId = null;
	serviceSearch.value = "";
	showServiceDropdown.value = false;
}

function closeServiceDropdown() {
	showServiceDropdown.value = false;
}

// ─── Data loading ─────────────────────────────────────────────────────────────

/**
 * Load all services across all companies using the same approach as ServicesList.
 */
const loadAllServices = async () => {
	const companiesResult = await fetchCompanies({ limit: 100 });
	if (!companiesResult.success) {
		throw new Error(companiesResult.error || "Failed to fetch companies");
	}

	const companies = companiesResult.data || [];

	const results = await Promise.all(
		companies.map((c) => fetchCompanyServices(c.uuid, { limit: 100 })),
	);

	return results.flatMap((result, idx) => {
		if (!result.success) return [];
		const companyUuid = companies[idx]?.uuid || null;
		return (result.data || []).map((s) => normalizeService(s, companyUuid));
	});
};

/**
 * Normalize API service fields to what the template expects.
 * @param {object} s           - Raw service object from the API
 * @param {string|null} companyUuid - UUID of the owning company (from the request context)
 */
function normalizeService(s, companyUuid = null) {
	return {
		...s,
		id: s.uuid || s.id,
		price: s.basePrice ?? s.price,
		companyUuid: companyUuid || s.companyUuid || null,
		company: s.companyName
			? { name: s.companyName, uuid: companyUuid }
			: s.company || null,
	};
}

// ─── Lifecycle ────────────────────────────────────────────────────────────────

onMounted(async () => {
	// Guard: only users who can create requests may access this page
	if (!canCreateRequest.value) {
		showError("You do not have permission to create service requests");
		router.push({ name: "Unauthorized" });
		return;
	}

	// Load the user's NFC boxes in parallel with services
	loadingBoxes.value = true;
	fetchMyNfcTags()
		.then((result) => {
			if (result.success) {
				availableBoxes.value = result.data || [];
			}
		})
		.catch(() => {
			/* non-fatal — user can still enter address manually */
		})
		.finally(() => {
			loadingBoxes.value = false;
		});

	loadingServices.value = true;
	try {
		const preselectedId = route.query.serviceId;

		if (preselectedId) {
			// Fast path: a specific service was linked from the services list.
			// Fetch only that service so the page loads instantly, then load
			// the rest in the background so the user can still change it.
			const result = await fetchService(preselectedId);
			if (result.success && result.data) {
				const normalized = normalizeService(result.data);
				availableServices.value = [normalized];
				formData.value.serviceId = normalized.id;
			}
			// Load the full list silently in the background
			loadAllServices()
				.then((all) => {
					// Merge — keep preselected at the top if not already in list
					const existing = availableServices.value[0];
					const merged = all.some((s) => s.id === existing?.id)
						? all
						: [existing, ...all].filter(Boolean);
					availableServices.value = merged;
				})
				.catch(() => {
					/* non-fatal — user already has the preselected service */
				});
		} else {
			// Normal path: load all services for the dropdown
			availableServices.value = await loadAllServices();
		}
	} catch (err) {
		console.error("Failed to load services:", err);
		showError("Failed to load available services");
	} finally {
		loadingServices.value = false;
	}
});

// ─── Validation ───────────────────────────────────────────────────────────────

const validateForm = () => {
	const newErrors = {};

	if (!formData.value.serviceId) {
		newErrors.serviceId = "Please select a service";
	}

	if (!formData.value.companyId) {
		newErrors.serviceId =
			newErrors.serviceId || "Selected service has no associated company";
	}

	if (!selectedBoxId.value) {
		newErrors.location = "Please select one of your NFC locations";
	}

	errors.value = newErrors;
	return Object.keys(newErrors).length === 0;
};

// ─── Submit ───────────────────────────────────────────────────────────────────

const handleSubmit = () => {
	if (!validateForm()) return;
	showConfirmDialog.value = true;
};

const confirmSubmit = async () => {
	if (!validateForm()) {
		showConfirmDialog.value = false;
		return;
	}

	isSubmitting.value = true;
	try {
		// Build payload with only the fields the API accepts:
		// serviceId (required), companyId (required), locationId (optional),
		// preferredDate (optional), notes (optional)
		const requestData = {
			serviceId: formData.value.serviceId,
			companyId: formData.value.companyId,
		};

		if (selectedBoxId.value) {
			requestData.locationId = selectedBoxId.value;
		}
		if (formData.value.preferredDate) {
			requestData.preferredDate = new Date(
				formData.value.preferredDate,
			).toISOString();
		}
		if (formData.value.description?.trim()) {
			requestData.notes = formData.value.description.trim();
		}

		const result = await createServiceRequest(requestData);

		if (result.success) {
			showSuccess("Service request created successfully!");
			router.push({
				name: "RequestDetail",
				params: { id: result.data?.uuid },
			});
		}
	} catch (err) {
		console.error("Failed to create request:", err);
		showError("Failed to submit request. Please try again.");
	} finally {
		isSubmitting.value = false;
		showConfirmDialog.value = false;
	}
};

// ─── Navigation ───────────────────────────────────────────────────────────────

const handleCancel = () => {
	if (
		(formData.value.serviceId ||
			formData.value.location ||
			formData.value.description) &&
		!confirm("Discard this request? All entered data will be lost.")
	) {
		return;
	}
	router.back();
};

const handleBack = () => {
	router.back();
};

// ─── v-click-outside directive ────────────────────────────────────────────────

const vClickOutside = {
	mounted(el, binding) {
		el._clickOutside = (e) => {
			if (!(el === e.target || el.contains(e.target))) {
				binding.value(e);
			}
		};
		document.addEventListener("click", el._clickOutside);
	},
	unmounted(el) {
		document.removeEventListener("click", el._clickOutside);
	},
};
</script>

<style scoped>
/* Modal enter/leave transitions */
.modal-enter-active,
.modal-leave-active {
	transition: opacity 0.2s ease;
}
.modal-enter-active .relative,
.modal-leave-active .relative {
	transition:
		transform 0.2s ease,
		opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
	opacity: 0;
}
.modal-enter-from .relative {
	transform: scale(0.95);
	opacity: 0;
}
.modal-leave-to .relative {
	transform: scale(0.95);
	opacity: 0;
}

/* Native date input icon color on webkit */
input[type="date"]::-webkit-calendar-picker-indicator {
	opacity: 0.5;
	cursor: pointer;
}
</style>
