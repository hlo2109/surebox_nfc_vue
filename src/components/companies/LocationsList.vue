<!-- RadarAddressField + PhoneInput: shared NFC-style inputs -->
<template>
	<div class="locations-list">
		<!-- Header -->
		<div class="flex items-center justify-between mb-6">
			<div>
				<h3 class="text-lg font-semibold text-gray-900">Locations</h3>
				<p class="text-sm text-gray-600 mt-1">
					{{ locationsCount }}
					{{ locationsCount === 1 ? "location" : "locations" }}
				</p>
			</div>
			<button
				v-if="canAddLocations"
				@click="showAddDialog = true"
				class="px-4 py-2 bg-[#0D65AE] text-white rounded-lg hover:bg-[#0a4f87] transition-colors flex items-center gap-2"
			>
				<svg
					class="w-5 h-5"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 6v6m0 0v6m0-6h6m-6 0H6"
					/>
				</svg>
				Add Location
			</button>
		</div>

		<!-- Loading State -->
		<div v-if="loading" class="flex items-center justify-center py-8">
			<div
				class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0D65AE]"
			></div>
		</div>

		<!-- Empty State -->
		<div
			v-else-if="!loading && locations.length === 0"
			class="text-center py-8"
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
					d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
				/>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
				/>
			</svg>
			<h3 class="text-lg font-semibold text-gray-900 mb-2">
				No locations yet
			</h3>
			<p class="text-gray-600">Add your first location to get started</p>
		</div>

		<!-- Locations table -->
		<div v-else class="overflow-x-auto rounded-lg border border-gray-200">
			<table class="min-w-full divide-y divide-gray-200 text-sm">
				<thead class="bg-gray-50">
					<tr>
						<th
							scope="col"
							class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600"
						>
							Name
						</th>
						<th
							scope="col"
							class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600"
						>
							Address
						</th>
						<th
							scope="col"
							class="hidden sm:table-cell px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600"
						>
							City / Country
						</th>
						<th
							scope="col"
							class="hidden md:table-cell px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600"
						>
							Phone
						</th>
						<th
							scope="col"
							class="hidden lg:table-cell px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600"
						>
							Coordinates
						</th>
						<th
							scope="col"
							class="hidden lg:table-cell px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600"
						>
							Added
						</th>
						<th
							scope="col"
							class="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-600"
						>
							Actions
						</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-100 bg-white">
					<tr
						v-for="location in locations"
						:key="location.uuid || location.id"
						class="hover:bg-gray-50/80 transition-colors"
					>
						<td class="px-4 py-3 align-top">
							<div class="font-medium text-gray-900">
								{{ location.name }}
							</div>
							<div
								class="sm:hidden mt-1 text-xs text-gray-500"
								v-if="formatCityCountry(location)"
							>
								{{ formatCityCountry(location) }}
							</div>
						</td>
						<td class="px-4 py-3 align-top text-gray-700 max-w-[220px] md:max-w-xs">
							<span class="line-clamp-2">{{ location.address || "—" }}</span>
						</td>
						<td
							class="hidden sm:table-cell px-4 py-3 align-top text-gray-600 whitespace-nowrap"
						>
							{{ formatCityCountry(location) || "—" }}
						</td>
						<td class="hidden md:table-cell px-4 py-3 align-top text-gray-600">
							{{ location.phone || "—" }}
						</td>
						<td class="hidden lg:table-cell px-4 py-3 align-top text-gray-500 font-mono text-xs">
							<template v-if="hasCoordinates(location)">
								{{ formatCoordinates(location) }}
							</template>
							<template v-else>—</template>
						</td>
						<td class="hidden lg:table-cell px-4 py-3 align-top text-gray-500 text-xs whitespace-nowrap">
							{{
								location.created_at
									? formatDate(location.created_at)
									: "—"
							}}
						</td>
						<td class="px-4 py-3 align-top text-right whitespace-nowrap">
							<div class="inline-flex flex-wrap items-center justify-end gap-1">
								<Button
									v-if="hasCoordinates(location)"
									label="Map"
									icon="pi pi-map"
									class="p-button-sm p-button-text p-button-outlined hidden sm:inline-flex"
									@click="handleViewMap(location)"
								/>
								<button
									v-if="hasCoordinates(location)"
									type="button"
									class="sm:hidden p-2 text-gray-600 hover:text-[#0D65AE] hover:bg-gray-100 rounded-lg"
									title="View map"
									@click="handleViewMap(location)"
								>
									<i class="pi pi-map"></i>
								</button>
								<template v-if="canManageLocations">
									<button
										type="button"
										@click="startEditLocation(location)"
										class="p-2 text-gray-600 hover:text-[#0D65AE] hover:bg-gray-100 rounded-lg transition-colors"
										title="Edit location"
									>
										<svg
											class="w-5 h-5"
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
									</button>
									<button
										type="button"
										@click="confirmDeleteLocation(location)"
										class="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
										title="Delete location"
									>
										<svg
											class="w-5 h-5"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
											/>
										</svg>
									</button>
								</template>
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<!-- Map Modal -->
		<Dialog
			v-model:visible="showMapModal"
			:header="selectedLocation?.name || 'Location Map'"
			:modal="true"
			:closable="true"
			:style="{ width: '90vw', maxWidth: '800px' }"
		>
			<div class="map-container" style="height: 400px; width: 100%">
				<div
					v-if="selectedLocation"
					id="location-map"
					class="w-full h-full rounded-lg"
				></div>
			</div>
		</Dialog>

		<!-- Add Location Dialog -->
		<Dialog
			v-model:visible="showAddDialog"
			:modal="true"
			:draggable="false"
			:style="{ width: '90vw', maxWidth: '600px' }"
			:pt="{
				root: { class: 'rounded-xl shadow-2xl' },
				header: { class: 'border-b border-gray-200 px-6 py-4' },
				content: { class: 'px-6 py-4' },
				footer: { class: 'border-t border-gray-200 px-6 py-4' },
			}"
		>
			<template #header>
				<div class="flex items-center gap-3">
					<div
						class="w-10 h-10 rounded-full bg-[#0D65AE] bg-opacity-10 flex items-center justify-center"
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
								d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
							/>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
							/>
						</svg>
					</div>
					<div>
						<h3 class="text-lg font-semibold text-gray-900">
							Add Location
						</h3>
						<p class="text-sm text-gray-500">
							Add a new location to your company
						</p>
					</div>
				</div>
			</template>

			<form @submit.prevent="handleAddLocation" class="space-y-5 py-2">
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div class="md:col-span-2">
						<label
							class="block text-sm font-semibold text-gray-900 mb-2"
						>
							Name *
						</label>
						<input
							v-model="addForm.name"
							type="text"
							required
							placeholder="Enter location name"
							class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-[#0D65AE] focus:ring-2 focus:ring-[#0D65AE] focus:ring-opacity-20 focus:outline-none transition-all text-sm"
						/>
					</div>
					<div class="md:col-span-2">
						<RadarAddressField
							v-model="addForm.address"
							label="Address"
							placeholder="Search for an address…"
							:required="true"
							:disabled="adding"
							@select="onAddAddressSelect"
						/>
					</div>
					<div class="md:col-span-2">
						<LocationSelector
							ref="addLocationSelectorRef"
							:disabled="adding"
							@change="onAddLocationChange"
						/>
					</div>
					<div class="md:col-span-2">
						<PhoneInput
							v-model="addForm.phone"
							label="Phone"
							placeholder=""
							:default-country="addPhoneDefaultCountry"
							:disabled="adding"
							:required="false"
							:show-examples="false"
							:show-success-message="false"
							:auto-format="true"
						/>
					</div>
					<div>
						<label
							class="block text-sm font-semibold text-gray-900 mb-2"
						>
							Latitude
						</label>
						<input
							v-model.number="addForm.lat"
							type="number"
							step="any"
							placeholder="e.g., 40.7128"
							class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-[#0D65AE] focus:ring-2 focus:ring-[#0D65AE] focus:ring-opacity-20 focus:outline-none transition-all text-sm"
						/>
					</div>
					<div>
						<label
							class="block text-sm font-semibold text-gray-900 mb-2"
						>
							Longitude
						</label>
						<input
							v-model.number="addForm.lng"
							type="number"
							step="any"
							placeholder="e.g., -74.0060"
							class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-[#0D65AE] focus:ring-2 focus:ring-[#0D65AE] focus:ring-opacity-20 focus:outline-none transition-all text-sm"
						/>
					</div>
				</div>

				<div class="flex justify-end gap-3 pt-2">
					<button
						type="button"
						@click="showAddDialog = false"
						:disabled="adding"
						class="px-4 py-2.5 text-sm font-medium border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
					>
						Cancel
					</button>
					<button
						type="submit"
						:disabled="adding"
						class="px-4 py-2.5 text-sm font-medium bg-[#0D65AE] text-white rounded-lg hover:bg-[#0a4f87] focus:ring-2 focus:ring-[#0D65AE] focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
					>
						<svg
							v-if="adding"
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
						{{ adding ? "Adding..." : "Add Location" }}
					</button>
				</div>
			</form>
		</Dialog>

		<!-- Edit Location Dialog -->
		<Dialog
			v-model:visible="showEditDialog"
			:modal="true"
			:draggable="false"
			:style="{ width: '90vw', maxWidth: '600px' }"
			:pt="{
				root: { class: 'rounded-xl shadow-2xl' },
				header: { class: 'border-b border-gray-200 px-6 py-4' },
				content: { class: 'px-6 py-4' },
				footer: { class: 'border-t border-gray-200 px-6 py-4' },
			}"
		>
			<template #header>
				<div class="flex items-center gap-3">
					<div
						class="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center"
					>
						<svg
							class="w-5 h-5 text-blue-600"
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
					</div>
					<div>
						<h3 class="text-lg font-semibold text-gray-900">
							Edit Location
						</h3>
						<p class="text-sm text-gray-500">
							Update location information
						</p>
					</div>
				</div>
			</template>

			<form @submit.prevent="handleEditLocation" class="space-y-5 py-2">
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div class="md:col-span-2">
						<label
							class="block text-sm font-semibold text-gray-900 mb-2"
						>
							Name *
						</label>
						<input
							v-model="editForm.name"
							type="text"
							required
							placeholder="Enter location name"
							class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-[#0D65AE] focus:ring-2 focus:ring-[#0D65AE] focus:ring-opacity-20 focus:outline-none transition-all text-sm"
						/>
					</div>
					<div class="md:col-span-2">
						<RadarAddressField
							v-model="editForm.address"
							label="Address"
							placeholder="Search for an address…"
							:required="true"
							:disabled="editing"
							@select="onEditAddressSelect"
						/>
					</div>
					<div class="md:col-span-2">
						<LocationSelector
							:key="'edit-loc-' + (locationToEdit?.uuid || 'x') + '-' + editLocationSessionKey"
							ref="editLocationSelectorRef"
							:initial-country-id="editForm.countryId"
							:initial-department-id="editForm.departmentId"
							:initial-city-id="editForm.cityId"
							:disabled="editing"
							@change="onEditLocationChange"
						/>
					</div>
					<div class="md:col-span-2">
						<PhoneInput
							v-model="editForm.phone"
							label="Phone"
							placeholder=""
							:default-country="editPhoneDefaultCountry"
							:disabled="editing"
							:required="false"
							:show-examples="false"
							:show-success-message="false"
							:auto-format="true"
						/>
					</div>
					<div>
						<label
							class="block text-sm font-semibold text-gray-900 mb-2"
						>
							Latitude
						</label>
						<input
							v-model.number="editForm.lat"
							type="number"
							step="any"
							placeholder="e.g., 40.7128"
							class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-[#0D65AE] focus:ring-2 focus:ring-[#0D65AE] focus:ring-opacity-20 focus:outline-none transition-all text-sm"
						/>
					</div>
					<div>
						<label
							class="block text-sm font-semibold text-gray-900 mb-2"
						>
							Longitude
						</label>
						<input
							v-model.number="editForm.lng"
							type="number"
							step="any"
							placeholder="e.g., -74.0060"
							class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-[#0D65AE] focus:ring-2 focus:ring-[#0D65AE] focus:ring-opacity-20 focus:outline-none transition-all text-sm"
						/>
					</div>
				</div>

				<div class="flex justify-end gap-3 pt-2">
					<button
						type="button"
						@click="showEditDialog = false"
						:disabled="editing"
						class="px-4 py-2.5 text-sm font-medium border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
					>
						Cancel
					</button>
					<button
						type="submit"
						:disabled="editing"
						class="px-4 py-2.5 text-sm font-medium bg-[#0D65AE] text-white rounded-lg hover:bg-[#0a4f87] focus:ring-2 focus:ring-[#0D65AE] focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
					>
						<svg
							v-if="editing"
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
						{{ editing ? "Saving..." : "Save Changes" }}
					</button>
				</div>
			</form>
		</Dialog>

		<!-- Delete Location Confirmation Dialog -->
		<Dialog
			v-model:visible="showDeleteDialog"
			:modal="true"
			:draggable="false"
			:style="{ width: '90vw', maxWidth: '480px' }"
			:pt="{
				root: { class: 'rounded-xl shadow-2xl' },
				header: { class: 'border-b border-gray-200 px-6 py-4' },
				content: { class: 'px-6 py-5' },
				footer: { class: 'border-t border-gray-200 px-6 py-4' },
			}"
		>
			<template #header>
				<div class="flex items-center gap-3">
					<div
						class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center"
					>
						<svg
							class="w-5 h-5 text-red-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
							/>
						</svg>
					</div>
					<div>
						<h3 class="text-lg font-semibold text-gray-900">
							Delete Location
						</h3>
						<p class="text-sm text-gray-500">
							This action cannot be undone
						</p>
					</div>
				</div>
			</template>

			<div class="py-2">
				<div class="bg-red-50 border border-red-100 rounded-lg p-4">
					<p class="text-sm text-gray-700 leading-relaxed">
						Are you sure you want to delete
						<strong class="text-gray-900 font-semibold">{{
							locationToDelete?.name
						}}</strong>
						location?
					</p>
					<p class="text-sm text-red-600 mt-2 flex items-start gap-2">
						<svg
							class="w-4 h-4 mt-0.5 flex-shrink-0"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
							/>
						</svg>
						<span
							>This will permanently remove this location and
							cannot be undone.</span
						>
					</p>
				</div>

				<div class="flex justify-end gap-3 pt-5">
					<button
						type="button"
						@click="showDeleteDialog = false"
						:disabled="deleting"
						class="px-4 py-2.5 text-sm font-medium border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
					>
						Cancel
					</button>
					<button
						@click="handleDeleteLocation"
						:disabled="deleting"
						class="px-4 py-2.5 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
					>
						<svg
							v-if="deleting"
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
						{{ deleting ? "Deleting..." : "Delete Location" }}
					</button>
				</div>
			</div>
		</Dialog>
	</div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from "vue";
import { isValidPhoneNumber } from "libphonenumber-js";
import LocationSelector from "@/components/common/LocationSelector.vue";
import RadarAddressField from "@/components/common/RadarAddressField.vue";
import PhoneInput from "@/components/common/PhoneInput.vue";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import { useCompanies, useToast } from "@/composables";
import { formatDate } from "@/utils/formatters";

const {
	addMyCompanyLocation,
	updateMyCompanyLocation,
	deleteMyCompanyLocation,
} = useCompanies();
const { showToast } = useToast();

const props = defineProps({
	companyId: {
		type: String,
		required: true,
	},
	locations: {
		type: Array,
		default: () => [],
	},
	loading: {
		type: Boolean,
		default: false,
	},
	canAddLocations: {
		type: Boolean,
		default: false,
	},
	canManageLocations: {
		type: Boolean,
		default: false,
	},
});

const emit = defineEmits(["refresh"]);

// Dialog states
const showAddDialog = ref(false);
const showEditDialog = ref(false);
const showDeleteDialog = ref(false);
const showMapModal = ref(false);
const adding = ref(false);
const editing = ref(false);
const deleting = ref(false);

// Form data
const addForm = ref({
	name: "",
	address: "",
	city: "",
	country: "",
	phone: "",
	cityId: null,
	countryId: null,
	departmentId: null,
	lat: null,
	lng: null,
});

const editForm = ref({
	name: "",
	address: "",
	city: "",
	country: "",
	phone: "",
	cityId: null,
	countryId: null,
	departmentId: null,
	lat: null,
	lng: null,
});

const locationToEdit = ref(null);
const locationToDelete = ref(null);
const selectedLocation = ref(null);
const addLocationSelectorRef = ref(null);
const editLocationSelectorRef = ref(null);
/** ISO2 for PhoneInput default country (aligned with NFC CreateBox default). */
const addPhoneDefaultCountry = ref("AU");
const editPhoneDefaultCountry = ref("AU");
/** Bumps so LocationSelector remounts every time Edit opens (same uuid re-open). */
const editLocationSessionKey = ref(0);
let mapInstance = null;

// Computed
const locationsCount = computed(() => {
	return props.locations.length;
});

// Methods — API / MySQL may use camelCase, snake_case, or lowercase keys
const locationStr = (loc, ...names) => {
	if (!loc) return "";
	for (const name of names) {
		const v = loc[name];
		if (v != null && String(v).trim() !== "") return String(v).trim();
	}
	for (const name of names) {
		const key = Object.keys(loc).find(
			(k) => k.toLowerCase() === name.toLowerCase(),
		);
		if (key != null) {
			const v = loc[key];
			if (v != null && String(v).trim() !== "") return String(v).trim();
		}
	}
	return "";
};

const locationNum = (loc, ...names) => {
	if (!loc) return null;
	for (const name of names) {
		const v = loc[name];
		const n = Number(v);
		if (v !== undefined && v !== null && v !== "" && Number.isFinite(n)) {
			return n;
		}
	}
	for (const name of names) {
		const key = Object.keys(loc).find(
			(k) => k.toLowerCase() === name.toLowerCase(),
		);
		if (key != null) {
			const n = Number(loc[key]);
			if (Number.isFinite(n)) return n;
		}
	}
	return null;
};

const formatCityCountry = (location) => {
	const city = locationStr(
		location,
		"city",
		"cityName",
		"city_name",
		"cityname",
	);
	const state = locationStr(
		location,
		"department",
		"departmentName",
		"department_name",
		"departmentname",
		"state",
		"stateName",
	);
	const country = locationStr(
		location,
		"country",
		"countryName",
		"country_name",
		"countryname",
	);
	if (city && state && country) {
		return `${city}, ${state} — ${country}`;
	}
	if (city && country) {
		return `${city} — ${country}`;
	}
	return [city, state, country].filter(Boolean).join(", ");
};

const hasCoordinates = (location) => {
	return location.lat != null && location.lng != null;
};

const formatCoordinates = (location) => {
	if (!hasCoordinates(location)) return "";

	const lat = parseFloat(location.lat).toFixed(6);
	const lng = parseFloat(location.lng).toFixed(6);

	return `${lat}, ${lng}`;
};

// Event handlers
const handleAddLocation = async () => {
	if (!addForm.value.name || !addForm.value.address) {
		showToast("error", "Validation Error", "Name and address are required");
		return;
	}

	const phoneTrim = addForm.value.phone?.trim();
	if (phoneTrim && !isValidPhoneNumber(phoneTrim)) {
		showToast(
			"error",
			"Invalid phone",
			"Please enter a valid phone number for the selected country.",
		);
		return;
	}

	adding.value = true;
	const locationData = {
		name: addForm.value.name,
		address: addForm.value.address,
		city: addForm.value.city || undefined,
		country: addForm.value.country || undefined,
		phone: addForm.value.phone || undefined,
		cityId: addForm.value.cityId || undefined,
		countryId: addForm.value.countryId || undefined,
		departmentId: addForm.value.departmentId || undefined,
		lat: addForm.value.lat || undefined,
		lng: addForm.value.lng || undefined,
	};

	const result = await addMyCompanyLocation(locationData);

	if (result.success) {
		showAddDialog.value = false;
		addForm.value = {
			name: "",
			address: "",
			city: "",
			country: "",
			phone: "",
			cityId: null,
			countryId: null,
			departmentId: null,
			lat: null,
			lng: null,
		};
		addPhoneDefaultCountry.value = "AU";
		emit("refresh");
	}
	adding.value = false;
};

const toNumericId = (v) => {
	if (v === undefined || v === null || v === "") return null;
	const n = Number(v);
	return Number.isFinite(n) ? n : null;
};

const startEditLocation = (location) => {
	locationToEdit.value = location;
	editForm.value = {
		name: locationStr(location, "name"),
		address: locationStr(location, "address"),
		city: locationStr(
			location,
			"city",
			"cityName",
			"city_name",
			"cityname",
		),
		country: locationStr(
			location,
			"country",
			"countryName",
			"country_name",
			"countryname",
		),
		phone: locationStr(location, "phone"),
		cityId: locationNum(location, "cityId", "city_id", "cityid"),
		countryId: locationNum(
			location,
			"countryId",
			"country_id",
			"countryid",
		),
		departmentId: locationNum(
			location,
			"departmentId",
			"department_id",
			"departmentid",
		),
		lat: location.lat != null ? Number(location.lat) : null,
		lng: location.lng != null ? Number(location.lng) : null,
	};
	const iso = iso2FromCountryCode(
		locationStr(location, "countryCode", "country_code", "countrycode"),
	);
	editPhoneDefaultCountry.value = iso || "AU";
	editLocationSessionKey.value += 1;
	showEditDialog.value = true;
};

const handleEditLocation = async () => {
	if (!editForm.value.name || !editForm.value.address) {
		showToast("error", "Validation Error", "Name and address are required");
		return;
	}

	const phoneTrim = editForm.value.phone?.trim();
	if (phoneTrim && !isValidPhoneNumber(phoneTrim)) {
		showToast(
			"error",
			"Invalid phone",
			"Please enter a valid phone number for the selected country.",
		);
		return;
	}

	const loc = locationToEdit.value;
	const locationKey = loc?.uuid ?? loc?.id;
	if (!locationKey) {
		showToast("error", "Error", "Could not determine location to update.");
		return;
	}

	const locationData = {
		name: editForm.value.name,
		address: editForm.value.address,
		city: editForm.value.city || undefined,
		country: editForm.value.country || undefined,
		phone: editForm.value.phone || undefined,
		cityId: editForm.value.cityId || undefined,
		countryId: editForm.value.countryId || undefined,
		departmentId: editForm.value.departmentId || undefined,
		lat: editForm.value.lat ?? undefined,
		lng: editForm.value.lng ?? undefined,
	};

	editing.value = true;
	const result = await updateMyCompanyLocation(locationKey, locationData);
	if (result.success) {
		showEditDialog.value = false;
		locationToEdit.value = null;
		emit("refresh");
	}
	editing.value = false;
};

const iso2FromCountryCode = (code) => {
	if (!code) return null;
	const s = String(code).trim().toUpperCase();
	return s.length >= 2 ? s.slice(0, 2) : null;
};

const onAddLocationChange = (location) => {
	addForm.value.countryId = location.countryId;
	addForm.value.country = location.countryName;
	addForm.value.departmentId = location.departmentId;
	addForm.value.cityId = location.cityId;
	addForm.value.city = location.cityName;
	const iso = iso2FromCountryCode(location.countryCode);
	if (iso) addPhoneDefaultCountry.value = iso;
};

const onEditLocationChange = (location) => {
	editForm.value.countryId = location.countryId;
	editForm.value.country = location.countryName;
	editForm.value.departmentId = location.departmentId;
	editForm.value.cityId = location.cityId;
	editForm.value.city = location.cityName;
	const iso = iso2FromCountryCode(location.countryCode);
	if (iso) editPhoneDefaultCountry.value = iso;
};

const applyRadarCoordsAndLabels = (targetForm, address) => {
	const lat = address.latitude ?? address.lat;
	const lng = address.longitude ?? address.lng;
	if (lat != null && lat !== "") targetForm.lat = Number(lat);
	if (lng != null && lng !== "") targetForm.lng = Number(lng);
	if (address.country || address.countryName) {
		targetForm.country = address.country || address.countryName;
	}
	if (address.city) {
		targetForm.city = address.city;
	}
};

/**
 * Called when the user picks an address suggestion in the Add dialog.
 * Fills coordinates and tries to align Country / Department / City from Radar.
 */
const onAddAddressSelect = async (address) => {
	applyRadarCoordsAndLabels(addForm.value, address);
	await nextTick();
	addLocationSelectorRef.value?.applyFromRadar?.(address);
};

/**
 * Called when the user picks an address suggestion in the Edit dialog.
 */
const onEditAddressSelect = async (address) => {
	applyRadarCoordsAndLabels(editForm.value, address);
	await nextTick();
	editLocationSelectorRef.value?.applyFromRadar?.(address);
};

const confirmDeleteLocation = (location) => {
	locationToDelete.value = location;
	showDeleteDialog.value = true;
};

const handleDeleteLocation = async () => {
	if (!locationToDelete.value) return;

	deleting.value = true;
	const result = await deleteMyCompanyLocation(locationToDelete.value.uuid);

	if (result.success) {
		showDeleteDialog.value = false;
		locationToDelete.value = null;
		emit("refresh");
	}
	deleting.value = false;
};

const handleViewMap = async (location) => {
	if (!hasCoordinates(location)) {
		return;
	}

	selectedLocation.value = location;
	showMapModal.value = true;

	// Wait for modal to render
	await nextTick();
	initializeMap(location);
};

// Map initialization
const initializeMap = async (location) => {
	// Cleanup existing map
	if (mapInstance) {
		mapInstance.remove();
		mapInstance = null;
	}

	try {
		// Dynamically import Leaflet
		const L = (await import("leaflet")).default;

		// Wait a tick for DOM to be ready
		await nextTick();

		const mapElement = document.getElementById("location-map");
		if (!mapElement) return;

		// Create map
		mapInstance = L.map("location-map").setView(
			[location.lat, location.lng],
			15,
		);

		// Add tile layer
		L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
			attribution: "© OpenStreetMap contributors",
			maxZoom: 19,
		}).addTo(mapInstance);

		// Add marker
		const marker = L.marker([location.lat, location.lng]).addTo(
			mapInstance,
		);

		// Add popup with location info
		const popupContent = `
			<div class="text-center">
				<strong>${location.name}</strong><br/>
				${location.address || ""}
			</div>
		`;
		marker.bindPopup(popupContent).openPopup();

		// Force map to recalculate size
		setTimeout(() => {
			if (mapInstance) {
				mapInstance.invalidateSize();
			}
		}, 100);
	} catch (error) {
		console.error("Error initializing map:", error);
	}
};

// Cleanup map when modal closes
watch(showMapModal, (newValue) => {
	if (!newValue && mapInstance) {
		mapInstance.remove();
		mapInstance = null;
		selectedLocation.value = null;
	}
});

watch(showAddDialog, (open) => {
	if (open) addPhoneDefaultCountry.value = "AU";
});
</script>

<style scoped>
.locations-list {
	/* Component wrapper styles */
}

.map-container {
	background-color: #f3f4f6;
	border-radius: 0.5rem;
}

/* Leaflet popup styling */
:deep(.leaflet-popup-content-wrapper) {
	border-radius: 0.5rem;
}

:deep(.leaflet-popup-content) {
	margin: 0.75rem;
}
</style>
