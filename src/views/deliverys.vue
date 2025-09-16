<template>
	<div class="max-w-5xl mx-auto mt-8 space-y-6">
		<h1 class="text-2xl font-bold">My Packages</h1>

		<!-- Deliveries Accordion -->
		<Accordion :multiple="true">
			<AccordionTab v-for="delivery in deliveries" :key="delivery.id" :header="accordionHeader(delivery)">
				<!-- Package Details -->
				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div class="space-y-2 text-sm">
						<div><strong>Package ID:</strong> {{ delivery.package_id }}</div>
						<div><strong>Company:</strong> {{ delivery.company.name }}</div>
						<div><strong>User:</strong> {{ delivery.user.name }} ({{ delivery.user.email }})</div>
						<div><strong>Delivery time:</strong> {{ formatDate(delivery.delivery_time) }}</div>
						<div><strong>Status:</strong>
							<span :class="[
								'px-2 py-1 rounded text-xs font-semibold',
								delivery.state === 'delivered'
									? 'bg-green-100 text-green-700'
									: 'bg-yellow-100 text-yellow-700'
							]">
								{{ delivery.state }}
							</span>
						</div>
					</div>

					<!-- Map -->
					<div v-if="delivery.info?.location" class="rounded-lg overflow-hidden">
						<div :id="'map-' + delivery.id" class="h-64 w-full rounded-lg"></div>
					</div>
				</div>
			</AccordionTab>
		</Accordion>
	</div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import Card from "primevue/card";
import Accordion from "primevue/accordion";
import AccordionTab from "primevue/accordiontab";
import axios from "axios";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

axios.interceptors.request.use((config) => {
	const token = localStorage.getItem("jwt");
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

const API_BASE_URL = import.meta.env.VITE_API_URL;
const deliveries = ref([]);

function getLatLng(info) {
	try {
		if (info?.location?.lat && info?.location?.lng) {
			return {
				lat: parseFloat(info.location.lat),
				lng: parseFloat(info.location.lng),
			};
		}
		return { lat: -33.8688, lng: 151.2093 }; // Sydney default
	} catch {
		return { lat: -33.8688, lng: 151.2093 };
	}
}

function formatDate(iso) {
	return new Date(iso).toLocaleString("en-US", {
		dateStyle: "medium",
		timeStyle: "short",
	});
}

function accordionHeader(delivery) {
	return `
    📦 ${delivery.package_id} | ${delivery.company.name} | State: ${delivery.state}
  `;
}

async function fetchDeliveries() {
	try {
		const res = await axios.get(`${API_BASE_URL}/delivery`);
		deliveries.value = res.data;

		// Wait for DOM then init maps
		nextTick(() => {
			deliveries.value.forEach((delivery) => {
				const latLng = getLatLng(delivery.info);
				if (!latLng) return;

				const mapId = "map-" + delivery.id;
				const mapContainer = document.getElementById(mapId);

				if (mapContainer && !mapContainer._leaflet_map) {
					const map = L.map(mapContainer).setView([latLng.lat, latLng.lng], 5);

					L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
						maxZoom: 19,
						attribution: "© OpenStreetMap contributors",
					}).addTo(map);

					L.marker([latLng.lat, latLng.lng])
						.addTo(map)
						.bindPopup(`Package: ${delivery.package_id}`)
						.openPopup();

					mapContainer._leaflet_map = map;
				}
			});
		});
	} catch (err) {
		console.error("Error fetching deliveries:", err);
	}
}

onMounted(fetchDeliveries);
</script>

<style>
.leaflet-container {
	z-index: 0;
}
</style>
