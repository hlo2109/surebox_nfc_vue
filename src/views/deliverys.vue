<template>
	<div class="max-w-5xl mx-auto mt-8 space-y-6">
		<h1 class="text-2xl font-bold">My Packages</h1>

		<!-- Deliveries Accordion -->
	<Accordion :multiple="true" @tab-open="onTabOpen" @tab-close="onTabClose">
			<AccordionTab v-for="(delivery, idx) in deliveries" :key="delivery.id" :selected="openedTabs.includes(idx)">
      <template #header>
        <div class="flex items-center gap-2">
          <span>
            📦 {{ delivery.package_id }} | {{ delivery.company.name }} |
            <span :class="['px-2 py-1 rounded text-xs font-semibold', delivery.state === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700']">
              {{ delivery.state }}
            </span>
          </span>
          <span class="ml-auto">
            <template v-if="openedTabs.includes(idx)">
              <i class="pi pi-chevron-up" />
            </template>
            <template v-else>
              <i class="pi pi-chevron-down" />
            </template>
          </span>
        </div>
  </template>
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
						<a href="#" @click.prevent="refreshDelivery(delivery.id, delivery.package_id)">
							<i class="pi pi-refresh" :class="{'animate-spin': loadingId === delivery.id}" />
						</a>
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
const loadingId = ref(null);
const openedTabs = ref([]);

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
 

async function fetchDeliveries() {
	try {
		const res = await axios.get(`${API_BASE_URL}/delivery`);
		deliveries.value = res.data;
	} catch (err) {
		console.error("Error fetching deliveries:", err);
	}
}
onMounted(fetchDeliveries);

function onTabOpen(event) {
  // event.index es el índice del tab abierto
  if (!openedTabs.value.includes(event.index)) {
    openedTabs.value.push(event.index);
  }
	const delivery = deliveries.value[event.index];
	if (!delivery) return;
	const latLng = getLatLng(delivery.info);
	const mapId = "map-" + delivery.id;
	const mapContainer = document.getElementById(mapId);
	if (!mapContainer) return;
	if (mapContainer._leaflet_map) {
		// Si el mapa ya existe, ajusta el tamaño
		setTimeout(() => {
			mapContainer._leaflet_map.invalidateSize();
		}, 100);
	} else {
		// Inicializa el mapa solo cuando el tab está abierto
		const map = L.map(mapContainer).setView([latLng.lat, latLng.lng], 5);
		L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
			maxZoom: 20,
			attribution: "© OpenStreetMap contributors",
		}).addTo(map);
		L.marker([latLng.lat, latLng.lng])
			.addTo(map)
			.bindPopup(`Package: ${delivery.package_id}`)
			.openPopup();
		mapContainer._leaflet_map = map;
		setTimeout(() => {
			map.invalidateSize();
		}, 100);
	}
}

function onTabClose(event) {
  // event.index es el índice del tab cerrado
  openedTabs.value = openedTabs.value.filter(i => i !== event.index);
}

async function refreshDelivery(id, barcode) {
  loadingId.value = id;
  try {
    const res = await axios.get(`${API_BASE_URL}/delivery/${barcode}`);
    // Buscar el índice y actualizar solo ese item
    const idx = deliveries.value.findIndex(d => d.id === id);
    if (idx !== -1) {
      deliveries.value[idx] = res.data;
      // Esperar a que el DOM se actualice y refrescar el mapa
      await nextTick();
      const delivery = deliveries.value[idx];
      const latLng = getLatLng(delivery.info);
      const mapId = "map-" + delivery.id;
      const mapContainer = document.getElementById(mapId);
      if (mapContainer && delivery.info?.location) {
        if (mapContainer._leaflet_map) {
          // Actualiza la vista y el marcador
          mapContainer._leaflet_map.setView([latLng.lat, latLng.lng], 5);
          mapContainer._leaflet_map.eachLayer(layer => {
            if (layer instanceof L.Marker) {
              layer.setLatLng([latLng.lat, latLng.lng]);
              layer.setPopupContent(`Package: ${delivery.package_id}`);
            }
          });
          setTimeout(() => {
            mapContainer._leaflet_map.invalidateSize();
          }, 100);
        } else {
          // Si el mapa no existe, créalo
          const map = L.map(mapContainer).setView([latLng.lat, latLng.lng], 5);
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 20,
            attribution: "© OpenStreetMap contributors",
          }).addTo(map);
          L.marker([latLng.lat, latLng.lng])
            .addTo(map)
            .bindPopup(`Package: ${delivery.package_id}`)
            .openPopup();
          mapContainer._leaflet_map = map;
          setTimeout(() => {
            map.invalidateSize();
          }, 100);
        }
      }
    }
  } catch (err) {
    console.error('Error refreshing delivery:', err);
  } finally {
    loadingId.value = null;
  }
}

</script>

<style>
.p-icon.p-accordionheader-toggle-icon {
  display: none !important;
}
.leaflet-container {
	z-index: 0;
}
.animate-spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
