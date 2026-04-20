<template>
	<div class="bg-slate-50 min-h-screen p-4 sm:p-6 lg:p-8">
		<div class="max-w-4xl mx-auto space-y-6">
			<div class="flex items-center justify-between gap-4">
				<div>
					<h1 class="text-2xl sm:text-3xl font-bold text-slate-900">My packages</h1>
					<p class="text-sm text-slate-600 mt-1">
						Each delivery is tied to your SureBox NFC tag. Follow the route timeline and alerts here.
					</p>
				</div>
				<button
					type="button"
					class="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
					@click="load"
					:disabled="loading"
				>
					<svg :class="['w-4 h-4', loading ? 'animate-spin' : '']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
					</svg>
					Refresh
				</button>
			</div>

			<div v-if="loading" class="text-center text-slate-500 py-12 text-sm">Loading…</div>
			<div
				v-else-if="!items.length"
				class="bg-white rounded-xl border border-slate-200 p-10 text-center text-slate-500 text-sm"
			>
				No deliveries yet. When a company ships to your SureBox tag (or to a request with your NFC drop-off),
				it will show up here with live tracking.
			</div>
			<ul v-else class="space-y-3">
				<li
					v-for="p in items"
					:key="p.deliveryUuid"
					class="bg-white rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
				>
					<div class="min-w-0">
						<p class="text-sm font-semibold text-slate-900">{{ p.serviceName || "Package delivery" }}</p>
						<p v-if="p.destinationNfcNickname || p.destinationNfcUuid" class="text-xs text-slate-600 mt-0.5">
							<span class="font-medium text-slate-700">Your tag:</span>
							{{ p.destinationNfcNickname || "SureBox NFC" }}
							<span v-if="p.destinationNfcUuid" class="text-slate-400 font-mono"> · {{ truncateUuid(p.destinationNfcUuid) }}</span>
						</p>
						<p class="text-xs text-slate-500 font-mono truncate mt-1">{{ p.deliveryUuid }}</p>
						<p v-if="p.destinationAddress" class="text-xs text-slate-600 mt-1">{{ p.destinationAddress }}</p>
						<router-link
							v-if="p.serviceRequestUuid"
							:to="{ name: 'RequestDetail', params: { id: p.serviceRequestUuid } }"
							class="text-xs text-[#0D65AE] font-medium hover:underline mt-2 inline-block"
						>
							Open service request
						</router-link>
					</div>
					<div class="flex items-center gap-2 shrink-0">
						<span class="text-xs font-medium capitalize px-2 py-1 rounded-full bg-slate-100 text-slate-800">{{ p.status }}</span>
						<button
							type="button"
							class="px-3 py-1.5 text-xs font-medium text-white bg-[#0D65AE] rounded-lg hover:bg-[#0a4f87]"
							@click="openTracking(p.deliveryUuid)"
						>
							Tracking
						</button>
					</div>
				</li>
			</ul>
		</div>

		<Teleport to="body">
			<div
				v-if="detailOpen"
				class="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/40 p-4"
				@click.self="detailOpen = false"
			>
				<div class="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-5 space-y-4">
					<div class="flex items-start justify-between gap-2">
						<h2 class="text-lg font-semibold text-slate-900">Delivery tracking</h2>
						<button type="button" class="text-slate-400 hover:text-slate-700 text-xl leading-none" @click="detailOpen = false">×</button>
					</div>
					<div v-if="detailLoading" class="text-sm text-slate-500 py-6 text-center">Loading…</div>
					<template v-else-if="detail">
						<div class="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm space-y-2">
							<p class="text-xs font-semibold text-slate-500 uppercase">Status</p>
							<p class="text-base font-semibold capitalize">{{ detail.delivery?.status }}</p>
							<div v-if="detail.delivery?.destinationNfc" class="pt-2 border-t border-slate-200 mt-2">
								<p class="text-xs font-semibold text-slate-500 uppercase mb-1">Your SureBox tag</p>
								<p class="text-sm text-slate-800 font-medium">
									{{ detail.delivery.destinationNfc.nickname || "Drop-off NFC" }}
								</p>
								<p v-if="detail.delivery.destinationNfc.address" class="text-xs text-slate-600 mt-1">
									{{ detail.delivery.destinationNfc.address }}
								</p>
								<a
									v-if="mapLink(detail.delivery.destinationNfc)"
									:href="mapLink(detail.delivery.destinationNfc)"
									target="_blank"
									rel="noopener noreferrer"
									class="text-xs text-[#0D65AE] font-medium hover:underline mt-2 inline-block"
								>
									Open tag location in maps
								</a>
							</div>
							<p v-if="detail.delivery?.destinationAddress" class="text-xs text-slate-600 pt-2 border-t border-slate-200">
								<span class="font-medium text-slate-700">Route address:</span>
								{{ detail.delivery.destinationAddress }}
							</p>
						</div>

						<div v-if="detail.alerts?.length" class="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm">
							<p class="text-xs font-semibold text-amber-800 uppercase mb-2">Alerts</p>
							<ul class="space-y-2">
								<li v-for="(a, i) in detail.alerts" :key="a.uuid || i" class="text-xs text-amber-950">
									<span class="font-medium capitalize">{{ String(a.alertType || "").replace(/_/g, " ") }}</span>
									<span class="text-amber-700/80"> — {{ a.message }}</span>
									<span class="text-amber-600 block mt-0.5">{{ formatDt(a.createdAt) }}</span>
								</li>
							</ul>
						</div>

						<div>
							<p class="text-xs font-semibold text-slate-500 uppercase mb-2">Timeline</p>
							<ul v-if="detail.events?.length" class="space-y-3 text-sm border-l-2 border-slate-200 ml-2 pl-4">
								<li v-for="(ev, i) in detail.events" :key="ev.uuid || i" class="relative">
									<span
										class="absolute -left-[1.15rem] top-1.5 w-2.5 h-2.5 rounded-full bg-[#0D65AE] ring-4 ring-white"
									/>
									<p class="font-medium text-slate-800 capitalize">{{ eventLabel(ev.eventType) }}</p>
									<p class="text-xs text-slate-500">{{ formatDt(ev.createdAt) }}</p>
									<a
										v-if="ev.lat != null && ev.lng != null"
										:href="osmLink(ev.lat, ev.lng)"
										target="_blank"
										rel="noopener noreferrer"
										class="text-xs text-[#0D65AE] hover:underline mt-1 inline-block"
									>
										View on map
									</a>
									<p v-if="eventExtra(ev)" class="text-xs text-slate-600 mt-1">{{ eventExtra(ev) }}</p>
								</li>
							</ul>
							<p v-else class="text-xs text-slate-500">No tracking events yet. Updates appear when the courier checks in and along the route.</p>
						</div>
					</template>
				</div>
			</div>
		</Teleport>
	</div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useToast } from "@/composables/useToast";
import {
	getMyCustomerPackageDeliveries,
	getMyCustomerPackageDeliveryDetail,
} from "@/api/packages.api";

const toast = useToast();
const loading = ref(false);
const items = ref([]);
const detailOpen = ref(false);
const detailLoading = ref(false);
const detail = ref(null);

function truncateUuid(u) {
	if (!u || typeof u !== "string") return "";
	return u.length > 12 ? `${u.slice(0, 8)}…` : u;
}

function formatDt(v) {
	if (!v) return "";
	try {
		return new Date(v).toLocaleString();
	} catch {
		return String(v);
	}
}

function eventLabel(t) {
	return String(t || "").replace(/_/g, " ");
}

function osmLink(lat, lng) {
	return `https://www.openstreetmap.org/?mlat=${encodeURIComponent(lat)}&mlon=${encodeURIComponent(lng)}#map=16/${lat}/${lng}`;
}

function mapLink(nfc) {
	if (!nfc || nfc.lat == null || nfc.lng == null) return "";
	return osmLink(nfc.lat, nfc.lng);
}

function eventExtra(ev) {
	const p = ev.payload;
	if (!p || typeof p !== "object") return "";
	if (typeof p.distanceMeters === "number") {
		return `Distance from destination zone: ${Math.round(p.distanceMeters)} m`;
	}
	return "";
}

async function load() {
	loading.value = true;
	try {
		const res = await getMyCustomerPackageDeliveries();
		const inner = Array.isArray(res?.data) ? res.data : res;
		items.value = Array.isArray(inner) ? inner : [];
	} catch (e) {
		toast.showError(e?.message || "Could not load packages");
	} finally {
		loading.value = false;
	}
}

async function openTracking(deliveryUuid) {
	detailOpen.value = true;
	detail.value = null;
	detailLoading.value = true;
	try {
		const res = await getMyCustomerPackageDeliveryDetail(deliveryUuid);
		const inner =
			res?.data &&
			(res.data.delivery !== undefined || Array.isArray(res.data.events))
				? res.data
				: res?.data ?? res;
		detail.value = inner;
	} catch (e) {
		toast.showError(e?.message || "Could not load tracking");
		detailOpen.value = false;
	} finally {
		detailLoading.value = false;
	}
}

onMounted(load);
</script>
