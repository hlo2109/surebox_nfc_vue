<template>
	<div class="min-h-screen bg-gray-50 p-4">
		<div class="max-w-4xl mx-auto">
			<!-- Header -->
			<div class="mb-8">
				<div class="flex items-center gap-3 mb-2">
					<Button icon="pi pi-arrow-left" severity="secondary" text @click="$router.push('/mybox')"
						class="p-2" />
					<h1 class="text-4xl font-bold text-gray-900">Add New Box</h1>
				</div>
				<p class="text-gray-600">Register a new box to your account</p>
			</div>

			<!-- Main Form Card -->
			<Card class="shadow-lg border-0">
				<template #content>
					<form @submit="handleSubmit" class="space-y-8">

						<!-- Box ID Section -->
						<div class="space-y-4">
							<h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
								<i class="pi pi-qrcode text-gray-500"></i>
								Box Identification
							</h3>
							<div class="space-y-3">
								<label class="block text-sm font-medium text-gray-700">Box ID *</label>
								<div class="flex gap-2">
									<InputText v-model="codebox_id" class="flex-1"
										placeholder="Enter box ID or scan QR/NFC" required />
									<Button type="button" @click="scanQR" icon="pi pi-qrcode" severity="secondary"
										outlined v-tooltip="'Scan QR Code'" />
									<Button type="button" @click="readNFC" icon="pi pi-wifi" severity="success" outlined
										v-tooltip="'Read NFC'" />
								</div>
							</div>
						</div>

						<Divider />

						<!-- Contact Information -->
						<div class="space-y-4">
							<h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
								<i class="pi pi-user text-gray-500"></i>
								Contact Information
							</h3>
							<div class="grid md:grid-cols-2 gap-6">
								<div class="space-y-3">
									<label class="block text-sm font-medium text-gray-700">Phone Number *</label>
									<InputText v-model="phone" placeholder="E.g.: +61 4XX XXX XXX or 04XX XXX XXX"
										:class="{ 'p-invalid': phone && !phoneValid }" required />
									<small v-if="phone && !phoneValid" class="text-red-500">
										Invalid Australian phone format
									</small>
									<small v-else class="text-gray-500">
										Enter a valid Australian phone number
									</small>
								</div>
							</div>
						</div>

						<Divider />

						<!-- Location Information -->
						<div class="space-y-4">
							<h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
								<i class="pi pi-map-marker text-gray-500"></i>
								Location Information
							</h3>

							<div class="space-y-6">
								<!-- Address Input -->
								<div class="space-y-3">
									<label class="block text-sm font-medium text-gray-700">Address *</label>
									<div class="relative">
										<InputText v-model="address" placeholder="Start typing an address..."
											class="w-full" autocomplete="off" required @focus="showSuggestions = true"
											@blur="hideSuggestions" />

										<Popover v-if="showSuggestions && addressSuggestions.length" class="w-full"
											style="margin-top: 4px;">
											<div class="max-h-48 overflow-y-auto">
												<div v-for="suggestion in addressSuggestions"
													:key="suggestion.formattedAddress"
													@mousedown.prevent="selectAddress(suggestion)"
													class="p-3 cursor-pointer hover:bg-gray-50 border-b last:border-b-0">
													<div class="flex items-center gap-2">
														<i class="pi pi-map-marker text-gray-400"></i>
														<span class="text-sm">{{ suggestion.formattedAddress }}</span>
													</div>
												</div>
											</div>
										</Popover>
									</div>
								</div>


								<!-- Geolocation -->
								<div class="space-y-3">
									<label class="block text-sm font-medium text-gray-700">Geolocation *</label>
									<div class="flex gap-2">
										<InputText v-model="geolocation" class="flex-1"
											placeholder="Latitude, Longitude" required />
										<Button type="button" @click="getCurrentLocation" icon="pi pi-compass"
											severity="success" outlined v-tooltip="'Use current location'"
											:loading="loadingLocation" />
									</div>
								</div>

								<!-- Map Display -->
								<div v-if="showMap && geolocation" class="space-y-2">
									<div class="bg-gray-100 rounded-lg p-4 border-2 border-dashed border-gray-300">
										<div ref="mapContainer" style="height: 300px; width: 100%; border-radius: 8px;">
										</div>
									</div>
									<p class="text-xs text-gray-500 text-center">📍 Location preview on map</p>
								</div>
							</div>
						</div>

						<Divider />

						<!-- Images Section -->
						<div class="space-y-4">
							<h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
								<i class="pi pi-camera text-gray-500"></i>
								Images
							</h3>

							<div class="space-y-4">
								<Button type="button" @click="startCamera" icon="pi pi-camera" label="Activate Camera"
									outlined :disabled="showCamera" />

								<!-- Camera View -->
								<Card v-if="showCamera" class="bg-gray-900">
									<template #content>
										<div class="space-y-4">
											<video ref="videoElement" class="w-full max-h-80 rounded-lg" autoplay
												playsinline></video>
											<div class="flex gap-2 justify-center">
												<Button type="button" @click="takePhoto" icon="pi pi-circle"
													label="Take Photo" />
												<Button type="button" @click="stopCamera" icon="pi pi-times"
													label="Close Camera" severity="danger" />
											</div>
										</div>
									</template>
								</Card>

								<!-- Image Gallery -->
								<div v-if="images.length" class="space-y-3">
									<h4 class="font-medium text-gray-700">Captured Images ({{ images.length }})</h4>
									<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
										<div v-for="(img, i) in images" :key="i" class="relative group">
											<img :src="img.url"
												class="w-full h-24 object-cover rounded-lg border shadow-sm"
												:alt="`Box image ${i + 1}`" />
											<Button type="button" @click="removeImage(i)" icon="pi pi-times"
												severity="danger" text rounded size="small"
												class="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity" />
										</div>
									</div>
								</div>
							</div>
						</div>

						<Divider />

						<!-- Description Section -->
						<div class="space-y-4">
							<h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
								<i class="pi pi-file-edit text-gray-500"></i>
								Description
							</h3>
							<div class="space-y-3">
								<label class="block text-sm font-medium text-gray-700">Description *</label>
								<Textarea v-model="description" rows="4"
									placeholder="Describe the box location, nearby landmarks, or any other relevant information..."
									class="w-full" required />
								<small class="text-gray-500">
									Provide details that will help identify this box location
								</small>
							</div>
						</div>

						<!-- Error Message -->
						<Message v-if="error" severity="error" :closable="false">
							{{ error }}
						</Message>

						<!-- Action Buttons -->
						<div class="flex gap-3 pt-6 border-t">
							<Button type="submit" icon="pi pi-check" label="Create Box"
								class="flex-1 md:flex-none md:px-8" :loading="submitting" />
							<Button type="button" @click="$router.push('/mybox')" icon="pi pi-times" label="Cancel"
								severity="secondary" outlined class="flex-1 md:flex-none md:px-8" />
						</div>
					</form>
				</template>
			</Card>
		</div>
	</div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { isValidPhoneNumber } from 'libphonenumber-js'
import axios from 'axios'

// PrimeVue Components
import Card from 'primevue/card'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Message from 'primevue/message'
import Divider from 'primevue/divider'
import OverlayPanel from 'primevue/overlaypanel'

const API_BASE_URL = import.meta.env.VITE_API_URL
const RADAR_API_KEY = import.meta.env.VITE_RADAR_API_KEY
const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dtcwghtqp/image/upload'
const CLOUDINARY_UPLOAD_PRESET = 'ml_default'

// Form data
const codebox_id = ref('')
const phone = ref('')
const address = ref('')
const geolocation = ref('')
const images = ref([])
const description = ref('')
const error = ref('')

// UI states
const showCamera = ref(false)
const showSuggestions = ref(false)
const showMap = ref(false)
const submitting = ref(false)
const loadingLocation = ref(false)
const phoneValid = ref(true)

// Address suggestions
const addressSuggestions = ref([])

// Camera and map refs
const videoStream = ref(null)
const videoElement = ref(null)
const mapContainer = ref(null)
const map = ref(null)
const lat = ref('')
const lng = ref('')

// Setup axios interceptor
axios.interceptors.request.use(config => {
	const token = localStorage.getItem('jwt')
	if (token) {
		config.headers.Authorization = `Bearer ${token}`
	}
	return config
})

// Phone validation watcher
watch(phone, (newVal) => {
	phoneValid.value = isValidAustralianPhone(newVal)
})

// Address autocomplete watcher
watch(address, async (newVal) => {
	if (newVal.length > 2) {
		try {
			const res = await fetch(`https://api.radar.io/v1/search/autocomplete?query=${encodeURIComponent(newVal)}`, {
				headers: { 'Authorization': RADAR_API_KEY }
			})
			if (res.ok) {
				const data = await res.json()
				addressSuggestions.value = data.addresses || []
				showSuggestions.value = true
			} else {
				addressSuggestions.value = []
				showSuggestions.value = false
			}
		} catch {
			addressSuggestions.value = []
			showSuggestions.value = false
		}
	} else {
		addressSuggestions.value = []
		showSuggestions.value = false
	}
})

function isValidAustralianPhone(phone) {
	try {
		return isValidPhoneNumber(phone, 'AU')
	} catch {
		return false
	}
}

function selectAddress(suggestion) {
	address.value = suggestion.formattedAddress
	geolocation.value = `${suggestion.latitude},${suggestion.longitude}`
	lat.value = suggestion.latitude
	lng.value = suggestion.longitude
	showSuggestions.value = false
	showMap.value = true
	initializeMap()
}

function initializeMap() {
	nextTick(() => {
		if (mapContainer.value && lat.value && lng.value) {
			// Clear existing map
			if (map.value) {
				map.value.remove()
			}

			map.value = L.map(mapContainer.value).setView([lat.value, lng.value], 16)
			L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				maxZoom: 19,
				attribution: '© OpenStreetMap contributors'
			}).addTo(map.value)

			L.marker([lat.value, lng.value])
				.addTo(map.value)
				.bindPopup('📍 Selected location')
				.openPopup()
		}
	})
}

async function getCurrentLocation() {
	if (!navigator.geolocation) {
		error.value = 'Geolocation not supported in this browser'
		return
	}

	loadingLocation.value = true
	error.value = ''

	navigator.geolocation.getCurrentPosition(
		pos => {
			lat.value = pos.coords.latitude
			lng.value = pos.coords.longitude
			geolocation.value = `${lat.value},${lng.value}`
			showMap.value = true
			loadingLocation.value = false
			initializeMap()
		},
		err => {
			error.value = 'Could not get your current location'
			loadingLocation.value = false
		},
		{ timeout: 10000, enableHighAccuracy: true }
	)
}

async function startCamera() {
	showCamera.value = true
	try {
		videoStream.value = await navigator.mediaDevices.getUserMedia({
			video: { facingMode: 'environment' }
		})
		if (videoElement.value) {
			videoElement.value.srcObject = videoStream.value
			videoElement.value.play()
		}
	} catch (err) {
		error.value = 'Could not access camera. Please check permissions.'
		showCamera.value = false
	}
}

function stopCamera() {
	if (videoStream.value) {
		videoStream.value.getTracks().forEach(track => track.stop())
		videoStream.value = null
	}
	showCamera.value = false
}

async function uploadToCloudinary(imageData) {
	try {
		const formData = new FormData()
		formData.append('file', imageData)
		formData.append('folder', 'surebox/')
		formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)

		const response = await fetch(CLOUDINARY_URL, {
			method: 'POST',
			body: formData
		})

		if (!response.ok) throw new Error('Upload failed')

		const data = await response.json()
		return data.secure_url
	} catch (err) {
		error.value = 'Error uploading image to cloud storage'
		return null
	}
}

async function takePhoto() {
	if (!videoElement.value) return

	const canvas = document.createElement('canvas')
	canvas.width = videoElement.value.videoWidth
	canvas.height = videoElement.value.videoHeight

	const ctx = canvas.getContext('2d')
	ctx.drawImage(videoElement.value, 0, 0, canvas.width, canvas.height)

	const imageData = canvas.toDataURL('image/png')
	const url = await uploadToCloudinary(imageData)

	if (url) {
		images.value.push({ url })
	}
}

function removeImage(index) {
	images.value.splice(index, 1)
}

async function handleSubmit(e) {
	e.preventDefault()

	if (!phoneValid.value) {
		error.value = 'Please enter a valid Australian phone number'
		return
	}

	submitting.value = true
	error.value = ''

	const payload = {
		codebox_id: codebox_id.value,
		phone: phone.value,
		address: address.value,
		geolocation: geolocation.value,
		images: images.value.map(img => img.url),
		description: description.value
	}

	try {
		await axios.post(`${API_BASE_URL}/user-code-box`, payload)
		// Navigate back to boxes list
		window.location.href = '/mybox'
	} catch (err) {
		error.value = err.response?.data?.message || 'Error saving the box. Please try again.'
	} finally {
		submitting.value = false
	}
}

function scanQR() {
	if ('BarcodeDetector' in window) {
		const detector = new BarcodeDetector({ formats: ['qr_code'] })

		navigator.mediaDevices.getUserMedia({
			video: { facingMode: { ideal: "environment" } }
		})
			.then(stream => {
				const video = document.createElement('video')
				video.srcObject = stream
				video.setAttribute('playsinline', 'true')
				video.setAttribute('autoplay', 'true')
				video.setAttribute('muted', 'true')

				Object.assign(video.style, {
					position: 'fixed',
					top: '0',
					left: '0',
					width: '100vw',
					height: '100vh',
					zIndex: '9999',
					background: 'rgba(0,0,0,0.8)'
				})

				document.body.appendChild(video)

				let scanning = true

				video.onloadedmetadata = () => video.play()

				function stopScan() {
					scanning = false
					stream.getTracks().forEach(track => track.stop())
					video.remove()
				}

				function scan() {
					if (!scanning) return
					detector.detect(video)
						.then(barcodes => {
							if (barcodes.length) {
								codebox_id.value = barcodes[0].rawValue
								stopScan()
							} else {
								requestAnimationFrame(scan)
							}
						})
						.catch(() => requestAnimationFrame(scan))
				}

				scan()
				video.onclick = stopScan
			})
			.catch(() => {
				error.value = 'Could not access camera for QR scanning'
			})
	} else {
		error.value = 'QR code scanning not supported in this browser'
	}
}

function readNFC() {
	error.value = 'NFC reading functionality will be implemented soon'
}

// Clean up on unmount
onMounted(() => {
	return () => {
		if (map.value) {
			map.value.remove()
		}
		if (videoStream.value) {
			videoStream.value.getTracks().forEach(track => track.stop())
		}
	}
})
</script>