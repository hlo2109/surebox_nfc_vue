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
							Add New Box
						</h1>
						<p class="text-sm text-gray-600">
							Register a new box to your account
						</p>
					</div>
				</div>
			</div>

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
									class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D65AE] focus:border-[#0D65AE] outline-none transition-all"
									required
								/>
								<button
									type="button"
									@click="scanQR"
									class="px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
									:disabled="isNFCReading || isDesktop"
									:class="[
										'px-3 py-2 border rounded-lg transition-colors',
										isNFCReading
											? 'text-gray-400 bg-gray-50 border-gray-200 cursor-wait'
											: isDesktop
												? 'text-gray-400 bg-gray-50 border-gray-200 cursor-not-allowed opacity-50'
												: canUseNFC
													? 'text-[#0D65AE] bg-[#0D65AE]/5 border-[#0D65AE]/20 hover:bg-[#0D65AE]/10'
													: 'text-yellow-600 bg-yellow-50 border-yellow-200 hover:bg-yellow-100',
									]"
									:title="
										isDesktop
											? 'NFC is only available on mobile devices'
											: canUseNFC
												? 'Read NFC Tag'
												: 'NFC not available - click for info'
									"
								>
									<svg
										v-if="!isNFCReading"
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
									<svg
										v-else
										class="w-5 h-5 animate-spin"
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
								</button>
							</div>
							<!-- NFC Helper Text -->
							<div
								v-if="isDesktop"
								class="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg"
							>
								<svg
									class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									></path>
								</svg>
								<div class="flex-1">
									<p class="text-sm text-blue-800">
										<strong>Desktop detected:</strong> NFC
										reading is only available on mobile
										devices. Please use your phone or tablet
										to scan NFC tags, or enter the box code
										manually.
									</p>
								</div>
							</div>
							<div
								v-else-if="!canUseNFC"
								class="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
							>
								<svg
									class="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
									></path>
								</svg>
								<div class="flex-1">
									<p class="text-sm text-yellow-800">
										<strong>NFC not available:</strong> Your
										browser or device doesn't support NFC
										reading. Please enter the box code
										manually or use Chrome on an Android
										device.
									</p>
								</div>
							</div>
							<div
								v-else
								class="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg"
							>
								<svg
									class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
									></path>
								</svg>
								<div class="flex-1">
									<p class="text-sm text-green-800">
										<strong>NFC ready:</strong> Tap the NFC
										button and hold your device near the box
										tag to read it automatically.
									</p>
								</div>
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
								:required="true"
								:show-examples="false"
								:show-success-message="false"
								:auto-format="true"
							/>
						</div>
					</div>

					<div class="border-t border-gray-200"></div>

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
							<RadarAddressField
								v-model="address"
								label="Address"
								label-class="block text-sm font-medium text-gray-700 mb-2"
								placeholder="Start typing an address…"
								:required="true"
								:limit="6"
								@select="onRadarAddressSelect"
							/>

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
								@click="cameraModalOpen = true"
								class="inline-flex items-center gap-2 px-4 py-2 text-[#0D65AE] bg-white border border-[#0D65AE]/20 rounded-lg hover:bg-[#0D65AE]/5 transition-colors"
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
								Take photos
							</button>
							<p class="text-xs text-gray-500">
								Opens the camera in a window. You can take several shots;
								photos are added when you confirm. Gallery upload is not
								available.
							</p>

							<CameraCaptureModal
								v-model="cameraModalOpen"
								:max-photos="12"
								@confirm="onCameraConfirm"
							/>

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
							{{ submitting ? "Creating..." : "Create Box" }}
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
import { useRouter } from "vue-router";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { isValidPhoneNumber } from "libphonenumber-js";
import { useNfc, useToast, usePermissions } from "@/composables";
import { useNfcReader } from "@/composables/useNfcReader";
import PhoneInput from "@/components/common/PhoneInput.vue";
import RadarAddressField from "@/components/common/RadarAddressField.vue";
import CameraCaptureModal from "@/components/CameraCaptureModal.vue";

const router = useRouter();
const { createNfcCode } = useNfc();
const submitting = ref(false);
const error = ref("");
const { showSuccess, showError, showWarning, showInfo, showToast } = useToast();
const { canCreateNfc } = usePermissions();
const {
	readNFC: performNFCRead,
	isReading: isNFCReading,
	canUseNFC,
	isDesktop,
	showNFCInfo,
} = useNfcReader();

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
const cameraModalOpen = ref(false);
const showMap = ref(false);
const loadingLocation = ref(false);
const phoneValid = ref(false);

// Map refs
const mapContainer = ref(null);
const map = ref(null);
const lat = ref("");
const lng = ref("");

// Keep in sync with PhoneInput's E.164 model (single source for submit checks)
watch(
	phone,
	(newVal) => {
		const v = (newVal || "").trim();
		if (!v) {
			phoneValid.value = false;
			return;
		}
		try {
			phoneValid.value = isValidPhoneNumber(v);
		} catch {
			phoneValid.value = false;
		}
	},
	{ immediate: true },
);

function onRadarAddressSelect(suggestion) {
	const la = suggestion.latitude ?? suggestion.lat;
	const lo = suggestion.longitude ?? suggestion.lng;
	address.value =
		suggestion.formattedAddress ||
		suggestion.addressLabel ||
		address.value;
	if (la != null && lo != null) {
		lat.value = la;
		lng.value = lo;
		geolocation.value = `${la},${lo}`;
		showMap.value = true;
		initializeMap();
	}
}

function initializeMap() {
	nextTick(() => {
		if (mapContainer.value && lat.value && lng.value) {
			// Clear existing map (close popup first — avoids Leaflet zoom errors)
			if (map.value) {
				map.value.closePopup();
				map.value.remove();
				map.value = null;
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
				.bindPopup("📍 Selected location");
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

async function onCameraConfirm(dataUrls) {
	if (!Array.isArray(dataUrls) || !dataUrls.length) return;
	showToast("info", "Uploading…", "Uploading your photos…");
	let added = 0;
	for (const dataUrl of dataUrls) {
		const url = await uploadToCloudinary(dataUrl);
		if (url) {
			images.value.push({ url });
			added += 1;
		}
	}
	if (added) {
		showToast(
			"success",
			"Photos added",
			added === 1
				? "1 photo was added to your box."
				: `${added} photos were added to your box.`,
		);
	} else {
		showToast(
			"error",
			"Upload failed",
			"Could not upload the photos. Try again.",
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

	error.value = "";

	// Validation
	if (!codebox_id.value.trim()) {
		showToast("warn", "Validation Error", "Box ID is required");
		return;
	}

	if (!phone.value?.trim()) {
		showToast("warn", "Validation Error", "Phone number is required");
		return;
	}

	if (!phoneValid.value) {
		showToast(
			"warn",
			"Invalid Phone",
			"Please enter a valid phone number for the selected country",
		);
		return;
	}

	const coords = geolocation.value
		? parseCoordinates(geolocation.value)
		: null;
	const imageUrls = images.value.map((img) => img.url).filter(Boolean);

	const payload = {
		code: codebox_id.value.trim(),
		nickname: phone.value?.trim() || undefined,
		address: address.value?.trim() || undefined,
		lat:
			coords != null && !Number.isNaN(coords.latitude)
				? coords.latitude
				: undefined,
		lng:
			coords != null && !Number.isNaN(coords.longitude)
				? coords.longitude
				: undefined,
		photo: imageUrls[0] || undefined,
		photos: imageUrls,
		description: description.value?.trim() || undefined,
	};

	submitting.value = true;
	try {
		const result = await createNfcCode(payload);

		if (result?.success) {
			showToast(
				"success",
				"Box Created",
				"Your new box has been registered successfully",
			);
			setTimeout(() => {
				router.push("/mybox");
			}, 1500);
		} else {
			error.value =
				result?.error || "Could not register the box. Please try again.";
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

async function readNFC() {
	// Check if NFC is available
	if (isDesktop.value) {
		showToast(
			"info",
			"Desktop Device",
			"NFC reading is only available on mobile devices. Please use your phone or tablet, or enter the box code manually.",
		);
		return;
	}

	if (!canUseNFC.value) {
		showNFCInfo();
		return;
	}

	// Read NFC tag
	const code = await performNFCRead({
		timeout: 15000,
		onSuccess: (readCode) => {
			codebox_id.value = readCode;
		},
	});

	// Code is automatically set in the onSuccess callback
	if (code) {
		console.log("NFC code read successfully:", code);
	}
}

// Check permissions on mount
onMounted(() => {
	if (!canCreateNfc.value) {
		router.push({
			path: "/unauthorized",
			query: {
				message: "You do not have permission to create NFC boxes.",
			},
		});
	}
});

// Clean up on unmount
onBeforeUnmount(() => {
	if (map.value) {
		map.value.closePopup();
		map.value.remove();
		map.value = null;
	}
});
</script>
