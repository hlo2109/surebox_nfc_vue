<template>
	<div class="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
		<div class="max-w-4xl mx-auto">
			<!-- Header -->
			<div class="mb-6 sm:mb-8">
				<div class="flex items-center gap-3 mb-2">
					<button
						@click="$router.push('/mybox')"
						class="p-2 text-gray-600 hover:text-[#0D65AE] hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
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
								d="M10 19l-7-7m0 0l7-7m-7 7h18"
							></path>
						</svg>
					</button>
					<div>
						<h1
							class="text-2xl sm:text-3xl font-bold text-gray-900"
						>
							Edit Box
						</h1>
						<p class="text-sm text-gray-600">
							Update box information
						</p>
					</div>
				</div>
			</div>

			<!-- Toast Notifications -->
			<Toast
				position="top-right"
				:pt="{
					root: { class: 'w-80' },
					container: { class: 'mb-3' },
					message: ({ props }) => ({
						class: [
							'rounded-lg bg-white border backdrop-blur-sm',
							{
								'border-[#0D65AE]/30':
									props.message.severity === 'success',
								'border-red-300':
									props.message.severity === 'error',
								'border-yellow-300':
									props.message.severity === 'warn',
								'border-blue-300':
									props.message.severity === 'info',
							},
						],
					}),
					messageContent: 'flex items-center gap-2.5 px-3 py-2.5',
					messageIcon: ({ props }) => ({
						class: [
							'w-4 h-4 flex-shrink-0',
							{
								'text-[#0D65AE]':
									props.message.severity === 'success',
								'text-red-500':
									props.message.severity === 'error',
								'text-yellow-500':
									props.message.severity === 'warn',
								'text-blue-500':
									props.message.severity === 'info',
							},
						],
					}),
					messageText: 'flex-1 min-w-0',
					summary: 'text-xs font-medium text-gray-900',
					detail: 'text-xs text-gray-600 mt-0.5',
					closeButton: {
						class: 'ml-2 w-5 h-5 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors rounded hover:bg-gray-100',
					},
					closeIcon: 'w-3 h-3',
				}"
			/>

			<!-- Main Form Card -->
			<div class="bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
				<form @submit="handleSubmit" class="space-y-8">
					<!-- Box ID Section -->
					<div class="space-y-4">
						<h3
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
									d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
								></path>
							</svg>
							Box Identification
						</h3>
						<div class="space-y-3">
							<label
								class="block text-sm font-medium text-gray-700"
								>Box ID *</label
							>
							<div class="flex gap-2">
								<input
									v-model="codebox_id"
									type="text"
									placeholder="Enter box ID or scan QR/NFC"
									class="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
									disabled
									required
								/>
								<button
									type="button"
									@click="scanQR"
									class="px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors opacity-50 cursor-not-allowed"
									title="Scan QR Code"
									disabled
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
											d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
										></path>
									</svg>
								</button>
								<button
									type="button"
									@click="readNFC"
									class="px-3 py-2 text-[#0D65AE] bg-[#0D65AE]/5 border border-[#0D65AE]/20 rounded-lg hover:bg-[#0D65AE]/10 transition-colors opacity-50 cursor-not-allowed"
									title="Read NFC"
									disabled
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
											d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
										></path>
									</svg>
								</button>
							</div>
						</div>
					</div>

					<div class="border-t border-gray-200"></div>
					<!-- Contact Information -->
					<div class="space-y-4">
						<h3
							class="text-lg font-semibold text-gray-900 flex items-center gap-2"
						>
							<i class="pi pi-user text-gray-500"></i>
							Contact Information
						</h3>
						<div class="grid md:grid-cols-2 gap-6">
							<PhoneInput
								v-model="phone"
								label="Phone Number"
								placeholder="04XX XXX XXX"
								helper-text="Enter Australian mobile number"
								:required="true"
								:show-examples="true"
								:show-success-message="true"
								:auto-format="true"
								@valid="phoneValid = true"
								@invalid="phoneValid = false"
							/>
						</div>
					</div>

					<Divider />

					<!-- Location Information -->
					<div class="space-y-4">
						<h3
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
									d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
								></path>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
								></path>
							</svg>
							Location Information
						</h3>
						<div class="space-y-6">
							<!-- Address Input -->
							<div class="space-y-3">
								<label
									class="block text-sm font-medium text-gray-700"
									>Address *</label
								>
								<div class="relative">
									<input
										v-model="address"
										type="text"
										placeholder="Start typing an address..."
										class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D65AE] focus:border-[#0D65AE] outline-none transition-all"
										autocomplete="off"
										required
										@focus="showSuggestions = true"
										@blur="hideSuggestions"
									/>
									<div
										v-if="
											showSuggestions &&
											addressSuggestions.length
										"
										class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg overflow-hidden max-h-48 overflow-y-auto"
									>
										<div
											v-for="suggestion in addressSuggestions"
											:key="suggestion.formattedAddress"
											@mousedown.prevent="
												selectAddress(suggestion)
											"
											class="p-3 cursor-pointer hover:bg-gray-50 border-b last:border-b-0 transition-colors"
										>
											<div
												class="flex items-center gap-2"
											>
												<svg
													class="w-4 h-4 text-gray-400"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
													></path>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
													></path>
												</svg>
												<span
													class="text-sm text-gray-700"
													>{{
														suggestion.formattedAddress
													}}</span
												>
											</div>
										</div>
									</div>
								</div>
							</div>

							<!-- Geolocation -->
							<div class="space-y-3">
								<label
									class="block text-sm font-medium text-gray-700"
									>Geolocation *</label
								>
								<div class="flex gap-2">
									<input
										v-model="geolocation"
										type="text"
										placeholder="Latitude, Longitude"
										class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D65AE] focus:border-[#0D65AE] outline-none transition-all"
										required
									/>
									<button
										type="button"
										@click="getCurrentLocation"
										:disabled="loadingLocation"
										class="px-3 py-2 text-[#0D65AE] bg-[#0D65AE]/5 border border-[#0D65AE]/20 rounded-lg hover:bg-[#0D65AE]/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
										title="Use current location"
									>
										<svg
											v-if="!loadingLocation"
											class="w-5 h-5"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
											></path>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
											></path>
										</svg>
										<svg
											v-else
											class="w-5 h-5 animate-spin"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
											></path>
										</svg>
									</button>
								</div>
							</div>

							<!-- Map Display -->
							<div
								v-if="showMap && geolocation"
								class="space-y-2"
							>
								<div
									class="bg-gray-50 rounded-lg p-4 border border-gray-200"
								>
									<div
										ref="mapContainer"
										style="
											height: 300px;
											width: 100%;
											border-radius: 8px;
										"
									></div>
								</div>
								<p
									class="text-xs text-gray-500 text-center flex items-center justify-center gap-1"
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
											d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
										></path>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
										></path>
									</svg>
									Location preview on map
								</p>
							</div>
						</div>
					</div>

					<div class="border-t border-gray-200"></div>
					<!-- Images Section -->
					<div class="space-y-4">
						<h3
							class="text-lg font-semibold text-gray-900 flex items-center gap-2"
						>
							<i class="pi pi-camera text-gray-500"></i>
							Images
						</h3>

						<div class="space-y-4">
							<button
								type="button"
								@click="startCamera"
								:disabled="showCamera"
								class="inline-flex items-center gap-2 px-4 py-2 text-[#0D65AE] bg-white border border-[#0D65AE]/20 rounded-lg hover:bg-[#0D65AE]/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
										d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
									></path>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
									></path>
								</svg>
								Activate Camera
							</button>

							<!-- Camera View -->
							<div
								v-if="showCamera"
								class="bg-gray-900 rounded-lg border border-gray-700 p-4 space-y-4"
							>
								<video
									ref="videoElement"
									class="w-full max-h-80 rounded-lg"
									autoplay
									playsinline
								></video>
								<div class="flex gap-2 justify-center">
									<button
										type="button"
										@click="takePhoto"
										class="inline-flex items-center gap-2 px-4 py-2 text-white bg-[#0D65AE] rounded-lg hover:bg-[#0D65AE]/90 transition-colors border border-[#0D65AE]"
									>
										<svg
											class="w-5 h-5"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<circle cx="10" cy="10" r="8" />
										</svg>
										Take Photo
									</button>
									<button
										type="button"
										@click="stopCamera"
										class="inline-flex items-center gap-2 px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors border border-red-600"
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
												d="M6 18L18 6M6 6l12 12"
											></path>
										</svg>
										Close Camera
									</button>
								</div>
							</div>

							<!-- Image Gallery -->
							<div v-if="images.length" class="space-y-3">
								<h4 class="font-medium text-gray-700">
									Captured Images ({{ images.length }})
								</h4>
								<div
									class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
								>
									<div
										v-for="(img, i) in images"
										:key="i"
										class="relative group"
									>
										<img
											:src="img.url"
											class="w-full h-24 object-cover rounded-lg border border-gray-200"
											:alt="`Box image ${i + 1}`"
										/>
										<button
											type="button"
											@click="removeImage(i)"
											class="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 border border-red-600"
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
												></path>
											</svg>
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div class="border-t border-gray-200"></div>

					<!-- Description Section -->
					<div class="space-y-4">
						<h3
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
									d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
								></path>
							</svg>
							Description
						</h3>
						<div class="space-y-3">
							<label
								class="block text-sm font-medium text-gray-700"
								>Description *</label
							>
							<textarea
								v-model="description"
								rows="4"
								placeholder="Describe the box location, nearby landmarks, or any other relevant information..."
								class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D65AE] focus:border-[#0D65AE] outline-none transition-all resize-none"
								required
							></textarea>
							<p class="text-sm text-gray-500">
								Provide details that will help identify this box
								location
							</p>
						</div>
					</div>

					<!-- Error Message -->
					<div
						v-if="error"
						class="p-4 bg-red-50 border border-red-200 rounded-lg"
					>
						<div class="flex items-start gap-3">
							<svg
								class="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path
									fill-rule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
									clip-rule="evenodd"
								></path>
							</svg>
							<p class="text-sm font-medium text-red-800">
								{{ error }}
							</p>
						</div>
					</div>

					<!-- Action Buttons -->
					<div
						class="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200"
					>
						<button
							type="submit"
							:disabled="submitting"
							class="inline-flex items-center justify-center gap-2 px-6 py-3 text-white bg-[#0D65AE] rounded-lg hover:bg-[#0D65AE]/90 transition-all border border-[#0D65AE] disabled:opacity-50 disabled:cursor-not-allowed"
						>
							<svg
								v-if="!submitting"
								class="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M5 13l4 4L19 7"
								></path>
							</svg>
							<svg
								v-else
								class="w-5 h-5 animate-spin"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
								></path>
							</svg>
							{{ submitting ? "Updating..." : "Update Box" }}
						</button>
						<button
							type="button"
							@click="$router.push('/mybox')"
							class="inline-flex items-center justify-center gap-2 px-6 py-3 text-gray-700 bg-white rounded-lg hover:bg-gray-50 transition-all border border-gray-300"
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
									d="M6 18L18 6M6 6l12 12"
								></path>
							</svg>
							Cancel
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>
<script setup>
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { isValidPhoneNumber } from "libphonenumber-js";
import Toast from "primevue/toast";
import { useNfc, useToast, usePermissions } from "@/composables";
import PhoneInput from "@/components/PhoneInput.vue";

const router = useRouter();
const route = useRoute();
const boxId = route.params.id;
const { fetchNfcCodes, updateNfcCode, getNfcById, getNfcByCode } = useNfc();
const submitting = ref(false);
// Resolved from the loaded NFC object — may differ from the route param.
const nfcRecordId = ref(null);
const { showToast } = useToast();
const { canEditNfc, canViewNfc } = usePermissions();

const RADAR_API_KEY = import.meta.env.VITE_RADAR_API_KEY;
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dtcwghtqp/image/upload";
const CLOUDINARY_UPLOAD_PRESET = "ml_default";

// Form data
const codebox_id = ref("");
const phone = ref("");
const address = ref("");
const geolocation = ref("");
const images = ref([]);
const description = ref("");

// UI states
const showCamera = ref(false);
const showSuggestions = ref(false);
const showMap = ref(false);
const loadingLocation = ref(false);
const phoneValid = ref(true);

// Address suggestions
const addressSuggestions = ref([]);

// Camera and map refs
const videoStream = ref(null);
const videoElement = ref(null);
const mapContainer = ref(null);
const map = ref(null);
const lat = ref("");
const lng = ref("");

// Phone validation watcher
watch(phone, (newVal) => {
	phoneValid.value = isValidAustralianPhone(newVal);
});

// Address autocomplete watcher
watch(address, async (newVal) => {
	if (newVal.length > 2) {
		try {
			const res = await fetch(
				`https://api.radar.io/v1/search/autocomplete?query=${encodeURIComponent(newVal)}`,
				{
					headers: { Authorization: RADAR_API_KEY },
				},
			);
			if (res.ok) {
				const data = await res.json();
				addressSuggestions.value = data.addresses || [];
				showSuggestions.value = true;
			} else {
				addressSuggestions.value = [];
				showSuggestions.value = false;
			}
		} catch {
			addressSuggestions.value = [];
			showSuggestions.value = false;
		}
	} else {
		addressSuggestions.value = [];
		showSuggestions.value = false;
	}
});

function selectAddress(suggestion) {
	address.value = suggestion.formattedAddress;
	geolocation.value = `${suggestion.latitude},${suggestion.longitude}`;
	lat.value = suggestion.latitude;
	lng.value = suggestion.longitude;
	showSuggestions.value = false;
	showMap.value = true;
	initializeMap();
}

function initializeMap() {
	nextTick(() => {
		if (mapContainer.value && lat.value && lng.value) {
			// Clear existing map
			if (map.value) {
				map.value.remove();
			}

			map.value = L.map(mapContainer.value).setView(
				[lat.value, lng.value],
				16,
			);
			L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
				maxZoom: 19,
				attribution: "© OpenStreetMap contributors",
			}).addTo(map.value);

			L.marker([lat.value, lng.value])
				.addTo(map.value)
				.bindPopup("📍 Selected location")
				.openPopup();
		}
	});
}

async function getCurrentLocation() {
	if (!navigator.geolocation) {
		showToast(
			"error",
			"Not Supported",
			"Geolocation is not supported by your browser",
		);
		return;
	}

	loadingLocation.value = true;

	navigator.geolocation.getCurrentPosition(
		(pos) => {
			lat.value = pos.coords.latitude;
			lng.value = pos.coords.longitude;
			geolocation.value = `${lat.value},${lng.value}`;
			showMap.value = true;
			loadingLocation.value = false;
			initializeMap();
			showToast(
				"success",
				"Location Found",
				"Your current location has been set successfully",
			);
		},
		(err) => {
			showToast(
				"error",
				"Location Error",
				"Could not get your current location. Please check permissions.",
			);
			loadingLocation.value = false;
		},
		{ timeout: 10000, enableHighAccuracy: true },
	);
}

async function startCamera() {
	showCamera.value = true;
	try {
		videoStream.value = await navigator.mediaDevices.getUserMedia({
			video: { facingMode: "environment" },
		});
		if (videoElement.value) {
			videoElement.value.srcObject = videoStream.value;
			videoElement.value.play();
		}
		showToast(
			"info",
			"Camera Ready",
			"Camera activated. Position and take photos.",
		);
	} catch (err) {
		showToast(
			"error",
			"Camera Error",
			"Could not access camera. Please check permissions.",
		);
		showCamera.value = false;
	}
}

function stopCamera() {
	if (videoStream.value) {
		videoStream.value.getTracks().forEach((track) => track.stop());
		videoStream.value = null;
	}
	showCamera.value = false;
}

async function uploadToCloudinary(imageData) {
	try {
		const formData = new FormData();
		formData.append("file", imageData);
		formData.append("folder", "surebox/");
		formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

		const response = await fetch(CLOUDINARY_URL, {
			method: "POST",
			body: formData,
		});

		if (!response.ok) throw new Error("Upload failed");

		const data = await response.json();
		return data.secure_url;
	} catch (err) {
		showToast(
			"error",
			"Upload Failed",
			"Error uploading image to cloud storage",
		);
		return null;
	}
}

async function takePhoto() {
	if (!videoElement.value) return;

	const canvas = document.createElement("canvas");
	canvas.width = videoElement.value.videoWidth;
	canvas.height = videoElement.value.videoHeight;

	const ctx = canvas.getContext("2d");
	ctx.drawImage(videoElement.value, 0, 0, canvas.width, canvas.height);

	const imageData = canvas.toDataURL("image/png");

	showToast("info", "Uploading...", "Please wait while we upload your image");

	const url = await uploadToCloudinary(imageData);

	if (url) {
		images.value.push({ url });
		showToast(
			"success",
			"Photo Added",
			"Image uploaded and added successfully",
		);
	}
}

function removeImage(index) {
	images.value.splice(index, 1);
	showToast(
		"info",
		"Image Removed",
		"The image has been removed from the gallery",
	);
}

async function handleSubmit(e) {
	e.preventDefault();

	// Guard against double submission
	if (submitting.value) return;

	// Validation
	if (!codebox_id.value.trim()) {
		showToast("warn", "Validation Error", "Box ID is required");
		return;
	}

	if (phone.value && !phoneValid.value) {
		showToast(
			"warn",
			"Invalid Phone",
			"Please enter a valid Australian phone number",
		);
		return;
	}

	// Build payload
	const payload = {
		code: codebox_id.value,
		name: phone.value || undefined,
		location: address.value || undefined,
		coordinates: geolocation.value
			? parseCoordinates(geolocation.value)
			: undefined,
		images: images.value.map((img) => img.url),
		description: description.value || undefined,
	};

	submitting.value = true;
	try {
		// Use the identifier resolved from the loaded object (uuid or id),
		// falling back to the raw route param as a last resort.
		const result = await updateNfcCode(nfcRecordId.value || boxId, payload);

		if (result?.success) {
			showToast(
				"success",
				"Box Updated",
				"Box information has been updated successfully",
			);
			setTimeout(() => {
				router.push("/mybox");
			}, 1500);
		}
	} finally {
		submitting.value = false;
	}
}

function parseCoordinates(geoString) {
	if (!geoString) return null;
	const [latitude, longitude] = geoString
		.split(",")
		.map((s) => parseFloat(s.trim()));
	return { latitude, longitude };
}

function scanQR() {
	showToast(
		"info",
		"Coming Soon",
		"QR code scanning feature is under development",
	);
}

function readNFC() {
	showToast(
		"info",
		"Coming Soon",
		"NFC reading feature is under development",
	);
}

// Load existing NFC data
onMounted(async () => {
	// Check permissions before loading data
	if (!canEditNfc.value && !canViewNfc.value) {
		router.push({
			path: "/unauthorized",
			query: {
				message: "You do not have permission to edit NFC boxes.",
			},
		});
		return;
	}

	if (boxId) {
		// 1. Try the store first — already populated when coming from MyBox.
		let nfc = getNfcById(boxId) || getNfcByCode(boxId);

		// 2. Store empty (e.g. hard reload) — load the full list then retry.
		//    This avoids relying on GET /nfc/:id which may not exist.
		if (!nfc) {
			await fetchNfcCodes();
			nfc = getNfcById(boxId) || getNfcByCode(boxId);
		}

		if (nfc) {
			// Resolve the real identifier (uuid → id → code) for the update call.
			nfcRecordId.value = nfc.uuid || nfc.id || nfc.code || boxId;

			// Populate form fields
			codebox_id.value = nfc.code || "";
			phone.value = nfc.name || "";
			address.value = nfc.location || "";

			// Handle coordinates
			if (nfc.coordinates) {
				geolocation.value = `${nfc.coordinates.latitude},${nfc.coordinates.longitude}`;
				lat.value = nfc.coordinates.latitude;
				lng.value = nfc.coordinates.longitude;
				showMap.value = true;
				nextTick(() => {
					initializeMap();
				});
			}

			// Handle images
			if (nfc.images && Array.isArray(nfc.images)) {
				images.value = nfc.images.map((url) => ({ url }));
			}

			description.value = nfc.description || "";
		} else {
			showToast("error", "Not Found", "Box not found");
			router.push("/mybox");
		}
	}
});

// Clean up on unmount
onBeforeUnmount(() => {
	if (map.value) {
		map.value.remove();
	}
	if (videoStream.value) {
		stopCamera();
	}
});
</script>
