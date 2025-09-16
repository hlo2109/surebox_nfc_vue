<template>
	<div>
		<h1 class="text-3xl font-bold mb-4">Edit Box</h1>
		<div class="max-w-xl mx-auto p-6 bg-white rounded shadow">
			<form @submit="handleSubmit" class="space-y-4">
				<div>
					<label class="block mb-1 font-medium">Box ID</label>
					<div class="flex items-center gap-2">

						<span>{{ codebox_id }}</span>
					</div>
				</div>
				<div>
					<label class="block mb-1 font-medium">Phone</label>
					<input v-model="phone" type="text" class="w-full border rounded px-3 py-2" required
						placeholder="E.g.: +61 4XX XXX XXX or 04XX XXX XXX"
						:class="{ 'border-green-500': phoneValid, 'border-red-500': !phoneValid && phone }" />
					<div v-if="phone && !phoneValid" class="text-xs text-red-500 mt-1">Invalid Australian phone format
					</div>
				</div>
				<div>
					<label class="block mb-1 font-medium">Address</label>
					<input v-model="address" type="text" class="w-full border rounded px-3 py-2" required
						autocomplete="off" />
					<ul v-if="showSuggestions && addressSuggestions.length" class="bg-white border rounded shadow mt-1">
						<li v-for="suggestion in addressSuggestions" :key="suggestion.formattedAddress"
							@click="selectAddress(suggestion)" class="px-3 py-2 cursor-pointer hover:bg-blue-100">
							{{ suggestion.formattedAddress }}
						</li>
					</ul>
				</div>
				<div>
					<label class="block mb-1 font-medium">Geolocation</label>
					<div class="flex items-center gap-2">
						<input v-model="geolocation" type="text" class="w-full border rounded px-3 py-2" required />
						<button type="button" @click="getCurrentLocation"
							class="p-2 bg-gray-200 rounded hover:bg-gray-300" title="Usar mi ubicación">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
								stroke="currentColor" class="w-6 h-6 text-green-600">
								<path stroke-linecap="round" stroke-linejoin="round"
									d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M6.05 17.95l-1.414 1.414M17.95 17.95l-1.414-1.414M6.05 6.05L4.636 7.464" />
							</svg>
						</button>
					</div>
					<div v-if="showMap && geolocation" class="mt-2">
						<div ref="mapContainer" style="height: 300px; width: 100%; border-radius:8px;"></div>
						<div class="text-xs text-gray-500 mt-1">Current location on the map</div>
					</div>
				</div>
				<div>
					<label class="block mb-1 font-medium">Images</label>
					<button type="button" @click="startCamera"
						class="bg-green-500 text-white px-3 py-2 rounded mb-2">Activate camera</button>
					<div v-if="showCamera" class="mb-2">
						<video ref="videoElement" style="width:100%;max-height:300px;border-radius:8px;"
							autoplay></video>
						<div class="flex gap-2 mt-2">
							<button type="button" @click="takePhoto"
								class="bg-blue-500 text-white px-3 py-2 rounded">Take photo</button>
							<button type="button" @click="stopCamera"
								class="bg-gray-500 text-white px-3 py-2 rounded">Close camera</button>
						</div>
					</div>
					<div class="flex flex-wrap gap-2 mt-2">
						<img v-for="(img, i) in images" :key="i" :src="img.url"
							class="w-24 h-24 object-cover rounded border" />
					</div>
				</div>
				<div>
					<label class="block mb-1 font-medium">Description</label>
					<textarea v-model="description" class="w-full border rounded px-3 py-2" rows="3"
						required></textarea>
				</div>
				<div v-if="error" class="text-red-500">{{ error }}</div>
				<button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Edit</button>
				<router-link to="/mybox" class="bg-gray-500 text-white px-4 py-2 ml-2 rounded hover:bg-gray-600">
					Cancel
				</router-link>

			</form>
		</div>
	</div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { isValidPhoneNumber, parsePhoneNumber } from 'libphonenumber-js';
import axios from 'axios';
import { useRoute } from 'vue-router';

const API_BASE_URL = import.meta.env.VITE_API_URL;
const boxId = ref(null);
const route = useRoute();
const codebox_id = ref('');
const phone = ref('');
const address = ref('');
const geolocation = ref('');
const images = ref([]);
const showCamera = ref(false);
const videoStream = ref(null);
const videoElement = ref(null);
const description = ref('');
const error = ref('');
const addressSuggestions = ref([]);
const showSuggestions = ref(false);
const RADAR_API_KEY = import.meta.env.VITE_RADAR_API_KEY;
const showMap = ref(true);
const lat = ref('');
const lng = ref('');
const map = ref(null);
const mapContainer = ref(null);
const phoneValid = ref(true);

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dtcwghtqp/image/upload';
const CLOUDINARY_UPLOAD_PRESET = 'ml_default';

// Configurar axios para enviar el token JWT en cada petición
axios.interceptors.request.use(config => {
	const token = localStorage.getItem('jwt');
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

function handleImageUpload(e) {
	images.value = Array.from(e.target.files);
}

watch(address, async (newVal) => {
	if (newVal.length > 2) {
		try {
			const res = await fetch(`https://api.radar.io/v1/search/autocomplete?query=${encodeURIComponent(newVal)}`, {
				headers: {
					'Authorization': RADAR_API_KEY
				}
			});
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
	geolocation.value = suggestion.latitude + ',' + suggestion.longitude;
	lat.value = suggestion.latitude;
	lng.value = suggestion.longitude;
	showSuggestions.value = false;
	showMap.value = true;
	if (geolocation.value) return;
	nextTick(() => {
		// Si el mapa aún no existe, inicialízalo
		if (mapContainer.value && !map.value) {
			map.value = L.map(mapContainer.value).setView([lat.value, lng.value], 18);
			L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				maxZoom: 19,
				attribution: '© OpenStreetMap contributors'
			}).addTo(map.value);
			L.marker([lat.value, lng.value]).addTo(map.value)
				.bindPopup('Dirección seleccionada').openPopup();
		} else if (map.value && lat.value && lng.value) {
			map.value.setView([lat.value, lng.value], 18);
			L.marker([lat.value, lng.value]).addTo(map.value)
				.bindPopup('Dirección seleccionada').openPopup();
		}
	});
}

function isValidAustralianPhone(phone) {
	// Usar libphonenumber-js para validar formato australiano
	try {
		return isValidPhoneNumber(phone, 'AU');
	} catch {
		return false;
	}
}

watch(phone, (newVal) => {
	phoneValid.value = isValidAustralianPhone(newVal);
});

async function handleSubmit(e) {
	e.preventDefault();
	if (!phoneValid.value) {
		error.value = 'El teléfono debe ser válido para Australia (ejemplo: +61 4XX XXX XXX o 04XX XXX XXX)';
		return;
	}
	// Construir el payload
	const payload = {
		codebox_id: codebox_id.value,
		phone: phone.value,
		address: address.value,
		geolocation: geolocation.value,
		images: images.value.map(img => img.url),
		description: description.value
	};
	try {
		await axios.put(`${API_BASE_URL}/user-code-box/${boxId.value}`, payload);
		// Redirigir a /mybox
		// window.location.href = '/mybox';
	} catch (err) {
		error.value = 'Error al guardar la caja';
	}
}

function scanQR() {
	// Usar BarcodeDetector si está disponible
	if ('BarcodeDetector' in window) {
		const detector = new BarcodeDetector({ formats: ['qr_code'] });

		navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } } })
			.then(stream => {
				const video = document.createElement('video');
				video.srcObject = stream;
				video.setAttribute('playsinline', 'true');
				video.setAttribute('autoplay', 'true');
				video.setAttribute('muted', 'true');

				// Estilos para mostrarlo a pantalla completa
				Object.assign(video.style, {
					position: 'fixed',
					top: '0',
					left: '0',
					width: '100vw',
					height: '100vh',
					zIndex: '9999',
					background: 'rgba(0,0,0,0.8)'
				});

				document.body.appendChild(video);

				let scanning = true;

				video.onloadedmetadata = () => video.play();

				function stopScan() {
					scanning = false;
					stream.getTracks().forEach(track => track.stop());
					video.remove();
				}

				function scan() {
					if (!scanning) return;
					detector.detect(video)
						.then(barcodes => {
							if (barcodes.length) {
								codebox_id.value = barcodes[0].rawValue; // ← tu input destino
								stopScan();
							} else {
								requestAnimationFrame(scan);
							}
						})
						.catch(() => requestAnimationFrame(scan));
				}

				scan();

				// Cerrar manual tocando/clicando en el video
				video.onclick = stopScan;
			})
			.catch(() => {
				alert('Could not access the camera');
			});
	} else {
		alert('BarcodeDetector not supported in this browser');
	}
}

function readNFC() {
	alert('NFC reading function not implemented');
}



function getCurrentLocation() {
	if (!navigator.geolocation) {
		error.value = 'Geolocation not supported';
		return;
	}
	navigator.geolocation.getCurrentPosition(
		pos => {
			lat.value = pos.coords.latitude;
			lng.value = pos.coords.longitude;
			geolocation.value = `${lat.value},${lng.value}`;
			showMap.value = true;
			nextTick(() => {
				if (mapContainer.value && !map.value) {
					map.value = L.map(mapContainer.value).setView([lat.value, lng.value], 18);
					L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
						maxZoom: 19,
						attribution: '© OpenStreetMap contributors'
					}).addTo(map.value);
					// Guardar el marcador para evitar duplicados
					map.value._userMarker = L.marker([lat.value, lng.value]).addTo(map.value)
						.bindPopup('Tu ubicación').openPopup();
				} else if (map.value) {
					map.value.setView([lat.value, lng.value], 18);
					// Eliminar marcador anterior si existe
					if (map.value._userMarker) {
						map.value.removeLayer(map.value._userMarker);
					}
					map.value._userMarker = L.marker([lat.value, lng.value]).addTo(map.value)
						.bindPopup('Tu ubicación').openPopup();
				}
			});
		},
		err => {
			error.value = 'Could not get location';
		}
	);
}

onMounted(() => {
	getBoxData();
});

onMounted(() => {
	if (showMap.value) {
		nextTick(() => {
			if (lat.value && lng.value && mapContainer.value && !map.value) {
				map.value = L.map(mapContainer.value).setView([lat.value, lng.value], 18);
				L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
					maxZoom: 19,
					attribution: '© OpenStreetMap contributors'
				}).addTo(map.value);
				L.marker([lat.value, lng.value]).addTo(map.value)
					.bindPopup('Tu ubicación').openPopup();
			}
		});
	}
});

async function startCamera() {
	showCamera.value = true;
	try {
		videoStream.value = await navigator.mediaDevices.getUserMedia({ video: true });
		if (videoElement.value) {
			videoElement.value.srcObject = videoStream.value;
			videoElement.value.play();
		}
	} catch (err) {
		error.value = 'Could not access the camera';
		showCamera.value = false;
	}
}

function stopCamera() {
	if (videoStream.value) {
		videoStream.value.getTracks().forEach(track => track.stop());
		videoStream.value = null;
	}
	showCamera.value = false;
}

async function uploadToCloudinary(imageData) {
	try {
		const formData = new FormData();
		formData.append('file', imageData);
		formData.append('folder', 'surebox/');
		formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
		const response = await fetch(CLOUDINARY_URL, {
			method: 'POST',
			body: formData
		});
		const data = await response.json();
		return data.secure_url;
	} catch (err) {
		error.value = 'Error uploading image to Cloudinary';
		return null;
	}
}

async function takePhoto() {
	if (!videoElement.value) return;
	const canvas = document.createElement('canvas');
	canvas.width = videoElement.value.videoWidth;
	canvas.height = videoElement.value.videoHeight;
	const ctx = canvas.getContext('2d');
	ctx.drawImage(videoElement.value, 0, 0, canvas.width, canvas.height);
	const imageData = canvas.toDataURL('image/png');
	// Subir a Cloudinary
	const url = await uploadToCloudinary(imageData);
	if (url) {
		images.value.push({ url });
	}
}

// Get data
async function getBoxData() {
	boxId.value = route.params.id;
	try {
		const res = await axios.get(`${API_BASE_URL}/user-code-box/${boxId.value}`);
		if (!res.data) throw new Error('Error getting data');
		const data = res.data;
		// Rellena los campos del formulario con los datos de la caja
		codebox_id.value = data.codebox_id;
		phone.value = data.phone;
		address.value = data.address;
		geolocation.value = data.geolocation;
		description.value = data.description;
		images.value = (data.images || []).map(url => ({ url }));
		if (data.geolocation) {
			const [latitude, longitude] = data.geolocation.split(',').map(Number);
			lat.value = latitude;
			lng.value = longitude;
			showMap.value = true;
			nextTick(() => {
				if (mapContainer.value && !map.value) {
					map.value = L.map(mapContainer.value).setView([lat.value, lng.value], 18);
					L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
						maxZoom: 19,
						attribution: '© OpenStreetMap contributors'
					}).addTo(map.value);
					L.marker([lat.value, lng.value]).addTo(map.value)
						.bindPopup('Dirección seleccionada').openPopup();
				} else if (map.value && lat.value && lng.value) {
					map.value.setView([lat.value, lng.value], 18);
					L.marker([lat.value, lng.value]).addTo(map.value)
						.bindPopup('Dirección seleccionada').openPopup();
				}
			});
		}
	} catch (err) {
		error.value = err.message || 'Connection error';
	}
}


</script>