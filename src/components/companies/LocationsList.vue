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

					<div class="md:col-span-2 border-t border-gray-100 pt-4 mt-1">
						<h4 class="text-sm font-semibold text-gray-900 mb-1">
							Fixed site &amp; daily clock-in
						</h4>
						<p class="text-xs text-gray-500 mb-3">
							Link the branch tag with the device (same
							<strong>My NFC</strong> registry as the rest of the
							app). Employees must scan this tag for Start time.
						</p>
						<div
							v-if="hasLinkedSiteNfc"
							class="rounded-lg border border-green-100 bg-green-50/80 px-3 py-2.5 text-sm text-gray-800 mb-3"
						>
							<p class="font-medium text-green-900">Tag linked</p>
							<p class="text-xs text-gray-600 mt-0.5">
								{{ siteNfcSummary }}
							</p>
						</div>
						<div
							v-else
							class="rounded-lg border border-amber-100 bg-amber-50/60 px-3 py-2 text-xs text-amber-900 mb-3"
						>
							No branch tag linked yet. Scan a tag that is already
							registered to an active employee or manager of your
							company.
						</div>
						<div class="flex flex-wrap gap-2">
							<button
								type="button"
								:disabled="editing || siteNfcScanning || !siteNfcSupported"
								class="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-[#0D65AE] rounded-lg hover:bg-[#0a4f87] disabled:opacity-50 disabled:cursor-not-allowed"
								@click="handleScanBranchSiteNfc"
							>
								<svg
									:class="[
										'w-4 h-4',
										siteNfcScanning ? 'animate-spin' : '',
									]"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
									/>
								</svg>
								{{
									siteNfcScanning
										? "Hold tag near device…"
										: "Scan NFC to link"
								}}
							</button>
							<button
								v-if="hasLinkedSiteNfc"
								type="button"
								:disabled="editing || siteNfcScanning"
								class="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-700 bg-white border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50"
								@click="handleClearBranchSiteNfc"
							>
								Remove tag
							</button>
						</div>
						<p
							v-if="!siteNfcSupported"
							class="text-xs text-amber-800 mt-2"
						>
							Web NFC is not available in this browser. Use Chrome on
							Android to link the branch tag.
						</p>
						<p v-if="siteNfcError" class="text-xs text-red-600 mt-2">
							{{ siteNfcError }}
						</p>
					</div>

					<div
						v-if="canManageLocations"
						class="md:col-span-2"
					>
						<label
							class="block text-sm font-medium text-gray-800 mb-1.5"
						>
							Fixed-site employees
						</label>
						<p class="text-xs text-gray-500 mb-2">
							Active employees and managers listed here see
							<strong>Start time</strong> on their assignment home
							to begin and end the workday at this branch.
						</p>
						<div
							v-if="!siteNfcReadyForStaff"
							class="mb-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900"
						>
							<strong>Branch NFC required.</strong> Use
							<em>Scan NFC to link</em> above first; the API will
							not save fixed-site staff until a tag is linked (or a
							legacy site code exists).
						</div>
						<input
							v-model="staffSearchQuery"
							type="search"
							:disabled="editing || !siteNfcReadyForStaff"
							placeholder="Search by name, email, or phone…"
							class="w-full mb-2 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-[#0D65AE] focus:ring-1 focus:ring-[#0D65AE] focus:outline-none"
						/>
						<div
							v-if="editStaffLoading"
							class="text-sm text-gray-500 py-3"
						>
							Loading team…
						</div>
						<div
							v-else
							class="max-h-52 overflow-y-auto rounded-lg border border-gray-200 divide-y divide-gray-100 bg-gray-50/50"
						>
							<label
								v-for="m in membersForStaffPick"
								:key="memberUuid(m)"
								class="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-white text-sm"
							>
								<input
									type="checkbox"
									class="rounded border-gray-300 text-[#0D65AE] focus:ring-[#0D65AE]"
									:value="memberUuid(m)"
									v-model="editForm.fixedStaffUuids"
									:disabled="editing || !siteNfcReadyForStaff"
								/>
								<span class="flex-1 min-w-0">
									<span class="font-medium text-gray-900">{{
										memberDisplayName(m)
									}}</span>
									<span
										class="block text-xs text-gray-500 truncate"
										>{{ memberSecondaryLine(m) }}</span
									>
								</span>
								<span
									class="text-xs uppercase text-gray-400 shrink-0"
									>{{
										m.role_in_company || m.roleInCompany
									}}</span
								>
							</label>
							<p
								v-if="!membersForStaffPick.length"
								class="px-3 py-4 text-sm text-gray-500 text-center"
							>
								No eligible employees or managers match your
								search.
							</p>
						</div>
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
import * as companiesApi from "@/api/companies.api";

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
const editStaffLoading = ref(false);
const membersForStaffPick = ref([]);
const staffSearchQuery = ref("");
const siteNfcScanning = ref(false);
const siteNfcError = ref("");
let staffSearchDebounce = null;

const siteNfcSupported =
	typeof window !== "undefined" && "NDEFReader" in window;

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
	fixedStaffUuids: [],
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

const hasLinkedSiteNfc = computed(() => {
	const loc = locationToEdit.value;
	return !!locationStr(loc, "siteUserNfcUuid", "site_user_nfc_uuid");
});

const siteNfcSummary = computed(() => {
	const loc = locationToEdit.value;
	const nick = locationStr(
		loc,
		"siteUserNfcNickname",
		"site_user_nfc_nickname",
	);
	if (nick) {
		return nick;
	}
	if (locationStr(loc, "siteUserNfcUuid", "site_user_nfc_uuid")) {
		return "Registered tag (My NFC)";
	}
	if (locationStr(loc, "siteNfcCode", "site_nfc_code")) {
		return "Legacy text code on file — scan a My NFC tag to upgrade.";
	}
	return "";
});

/** Branch NFC (linked tag or legacy text) required before fixed-site staff. */
const siteNfcReadyForStaff = computed(() => {
	const loc = locationToEdit.value;
	if (!loc) {
		return false;
	}
	if (locationStr(loc, "siteUserNfcUuid", "site_user_nfc_uuid")) {
		return true;
	}
	return !!locationStr(loc, "siteNfcCode", "site_nfc_code");
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

const memberUuid = (m) =>
	m?.user_uuid || m?.userUuid || m?.uuid || "";

const memberDisplayName = (m) =>
	m?.user_name ||
	m?.userName ||
	m?.name ||
	m?.full_name ||
	m?.fullName ||
	m?.email ||
	memberUuid(m);

const memberSecondaryLine = (m) => {
	const email = m?.user_email || m?.userEmail || m?.email;
	const phone = m?.user_phone || m?.userPhone || m?.phone;
	if (email && phone) {
		return `${email} · ${phone}`;
	}
	return email || phone || "";
};

async function loadStaffMembersForEdit() {
	if (!props.canManageLocations || !locationToEdit.value?.uuid) {
		return;
	}
	editStaffLoading.value = true;
	try {
		const memWrap = await companiesApi.getMyCompanyMembers({
			limit: 500,
			status: "active",
			...(staffSearchQuery.value.trim()
				? { search: staffSearchQuery.value.trim() }
				: {}),
		});
		const memRows = Array.isArray(memWrap?.data) ? memWrap.data : [];
		membersForStaffPick.value = memRows.filter((m) => {
			const role = String(
				m.role_in_company || m.roleInCompany || "",
			).toLowerCase();
			return role === "employee" || role === "manager";
		});
	} catch (err) {
		showToast(
			"error",
			"Members",
			err?.message || "Could not load company members.",
		);
		membersForStaffPick.value = [];
	} finally {
		editStaffLoading.value = false;
	}
}

watch(staffSearchQuery, () => {
	if (!showEditDialog.value || !props.canManageLocations) {
		return;
	}
	clearTimeout(staffSearchDebounce);
	staffSearchDebounce = setTimeout(() => {
		loadStaffMembersForEdit();
	}, 350);
});

watch(showEditDialog, (open) => {
	if (!open) {
		staffSearchQuery.value = "";
		siteNfcError.value = "";
		clearTimeout(staffSearchDebounce);
	}
});

async function readNfcTextFromDevice() {
	return new Promise((resolve, reject) => {
		const ndef = new window.NDEFReader();
		let settled = false;
		const finish = (err, val) => {
			if (settled) {
				return;
			}
			settled = true;
			if (err) {
				reject(err);
			} else {
				resolve(val);
			}
		};
		ndef
			.scan()
			.then(() => {
				ndef.addEventListener("reading", ({ message }) => {
					let code = "";
					for (const record of message.records) {
						if (record.recordType === "text") {
							const decoder = new TextDecoder(
								record.encoding || "utf-8",
							);
							code = decoder.decode(record.data);
							break;
						}
					}
					if (!code || !String(code).trim()) {
						finish(new Error("No text payload on this NFC tag."));
						return;
					}
					finish(null, String(code).trim());
				});
				ndef.addEventListener("readingerror", () => {
					finish(new Error("NFC read error."));
				});
			})
			.catch((e) => finish(e || new Error("Could not start NFC reader")));
	});
}

async function handleScanBranchSiteNfc() {
	siteNfcError.value = "";
	if (!siteNfcSupported) {
		siteNfcError.value =
			"Web NFC is not available. Use Chrome on Android.";
		return;
	}
	const locKey = locationToEdit.value?.uuid ?? locationToEdit.value?.id;
	if (!locKey) {
		return;
	}
	siteNfcScanning.value = true;
	try {
		const code = await readNfcTextFromDevice();
		const res = await companiesApi.postMyCompanyLocationSiteNfc(locKey, {
			nfcCode: code,
		});
		if (res.success === false) {
			throw new Error(res.message || "Could not link tag");
		}
		const payload = res.data || {};
		locationToEdit.value = {
			...locationToEdit.value,
			siteUserNfcUuid: payload.siteUserNfcUuid,
			siteUserNfcNickname: payload.siteUserNfcNickname,
			siteNfcCode: null,
		};
		showToast("success", "Branch NFC", res.message || "Tag linked.");
		emit("refresh");
	} catch (err) {
		siteNfcError.value =
			err?.message || "Could not read or link this NFC tag.";
	} finally {
		siteNfcScanning.value = false;
	}
}

async function handleClearBranchSiteNfc() {
	siteNfcError.value = "";
	const locKey = locationToEdit.value?.uuid ?? locationToEdit.value?.id;
	if (!locKey) {
		return;
	}
	siteNfcScanning.value = true;
	try {
		const res = await companiesApi.deleteMyCompanyLocationSiteNfc(locKey);
		if (res.success === false) {
			throw new Error(res.message || "Could not remove tag");
		}
		locationToEdit.value = {
			...locationToEdit.value,
			siteUserNfcUuid: null,
			siteUserNfcNickname: null,
			siteNfcCode: null,
		};
		showToast("success", "Branch NFC", res.message || "Tag removed.");
		emit("refresh");
	} catch (err) {
		siteNfcError.value = err?.message || "Could not remove tag.";
	} finally {
		siteNfcScanning.value = false;
	}
}

const startEditLocation = async (location) => {
	locationToEdit.value = location;
	staffSearchQuery.value = "";
	siteNfcError.value = "";
	membersForStaffPick.value = [];
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
		fixedStaffUuids: [],
	};
	const iso = iso2FromCountryCode(
		locationStr(location, "countryCode", "country_code", "countrycode"),
	);
	editPhoneDefaultCountry.value = iso || "AU";
	editLocationSessionKey.value += 1;
	showEditDialog.value = true;

	const locKey = location?.uuid ?? location?.id;
	if (!props.canManageLocations || !locKey) {
		return;
	}

	editStaffLoading.value = true;
	try {
		const staffWrap = await companiesApi.getMyCompanyLocationFixedStaff(
			locKey,
		);
		const staffRows = staffWrap?.data ?? [];
		editForm.value.fixedStaffUuids = staffRows
			.map((r) => r.userUuid || r.user_uuid)
			.filter(Boolean);

		await loadStaffMembersForEdit();
	} catch (err) {
		showToast(
			"error",
			"Could not load staff",
			err?.message || "Try again or save location details only.",
		);
	} finally {
		editStaffLoading.value = false;
	}
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
		if (props.canManageLocations) {
			try {
				const staffRes =
					await companiesApi.replaceMyCompanyLocationFixedStaff(
						locationKey,
						editForm.value.fixedStaffUuids || [],
					);
				if (staffRes.success === false) {
					showToast(
						"error",
						"Fixed staff",
						staffRes.message ||
							"Location saved but fixed staff list could not be updated.",
					);
				}
			} catch (err) {
				showToast(
					"error",
					"Fixed staff",
					err?.message ||
						"Location saved but fixed staff list could not be updated.",
				);
			}
		}
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
