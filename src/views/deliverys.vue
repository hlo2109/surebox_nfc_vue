<template>
  <div class="max-w-2xl mx-auto mt-8">
    <h1 class="text-2xl font-bold mb-4">My Deliveries</h1>
    <div v-for="delivery in deliveries" :key="delivery.id" class="mb-4">
      <details class="bg-white rounded shadow p-4">
        <summary class="cursor-pointer font-semibold text-lg">
          Package: {{ delivery.package_id }} <br> Company: {{ delivery.company.name }} <br> State: {{ delivery.state ?? 'N/A' }} <br> User: {{ delivery.user.name }}
        </summary>
        <div class="mt-2">
          <div><strong>Delivery time:</strong> {{ delivery.delivery_time }}</div>
          <div><strong>ID:</strong> {{ delivery.id }}</div>
          <div><strong>Info:</strong> {{ delivery.info }}</div>
        </div>
        <div v-if="delivery.info && getLatLng(delivery.info)" class="mt-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Package location</label>
          <div :id="'map-' + delivery.id" style="height: 250px; width: 100%; border-radius:8px;"></div>
        </div>
      </details>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

axios.interceptors.request.use(config => {
  const token = localStorage.getItem('jwt');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


const API_BASE_URL = import.meta.env.VITE_API_URL;
const deliveries = ref([]);

function getLatLng(info) {
  try {
    const data = typeof info === 'string' ? JSON.parse(info) : info;
    if (data.lat && data.lng) return { lat: data.lat, lng: data.lng };
    if (data.geolocation) {
      const [lat, lng] = data.geolocation.split(',').map(Number);
      return { lat, lng };
    }
    // Coordenadas por defecto (Sydney, Australia)
    return { lat: -33.8688, lng: 151.2093 };
  } catch {
    // Coordenadas por defecto (Sydney, Australia)
    return { lat: -33.8688, lng: 151.2093 };
  }
}

async function fetchDeliveries() {
  try {
    const res = await axios.get(`${API_BASE_URL}/delivery`);
    deliveries.value = res.data;
    nextTick(() => {
      deliveries.value.forEach(delivery => {
        const latLng = getLatLng(delivery.info);
        if (latLng) {
          const mapId = 'map-' + delivery.id;
          const mapContainer = document.getElementById(mapId);
          if (mapContainer && !mapContainer._leaflet_map) {
            const map = L.map(mapContainer).setView([latLng.lat, latLng.lng], 16);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              maxZoom: 19,
              attribution: '© OpenStreetMap contributors'
            }).addTo(map);
            L.marker([latLng.lat, latLng.lng]).addTo(map)
              .bindPopup('Ubicación del paquete').openPopup();
            mapContainer._leaflet_map = map;
          }
        }
      });
    });
  } catch (err) {
    // Manejo de error
  }
}

onMounted(() => {
  fetchDeliveries();
});
</script>

<style>
/* Agrega aquí tus estilos personalizados si es necesario */
</style>