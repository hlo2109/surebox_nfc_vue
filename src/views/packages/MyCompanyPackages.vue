<template>
	<div class="bg-slate-50 min-h-screen p-4 sm:p-6 lg:p-8">
		<div class="max-w-6xl mx-auto space-y-6">
			<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 class="text-2xl sm:text-3xl font-bold text-slate-900">
						Packages &amp; live tracking
					</h1>
					<p class="text-sm text-slate-600 mt-1 max-w-2xl">
						Every route must reference a customer&apos;s registered SureBox NFC tag (UUID or code).
						Use <strong>Tracking</strong> on each row to see the map timeline and alerts. Import up to
						<strong>1000</strong> stops per CSV, or use an API token. Duplicate
						<code class="text-xs bg-slate-100 px-1 rounded">external_route_ref</code> values are skipped.
					</p>
				</div>
				<button
					type="button"
					class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
					@click="reloadAll"
					:disabled="loadingList"
				>
					<svg
						:class="['w-4 h-4', loadingList ? 'animate-spin' : '']"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
						/>
					</svg>
					Refresh
				</button>
			</div>

			<div class="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
				<button
					v-for="t in tabs"
					:key="t.id"
					type="button"
					:class="[
						'px-3 py-1.5 text-sm font-medium rounded-lg transition-colors',
						activeTab === t.id
							? 'bg-[#0D65AE] text-white'
							: 'text-slate-600 hover:bg-white border border-transparent',
					]"
					@click="activeTab = t.id"
				>
					{{ t.label }}
				</button>
			</div>

			<!-- List -->
			<div v-show="activeTab === 'list'" class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
				<div class="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
					<h2 class="text-sm font-semibold text-slate-800">Company routes</h2>
					<span class="text-xs text-slate-500">{{ deliveries.length }} rows</span>
				</div>
				<div v-if="loadingList" class="p-8 text-center text-slate-500 text-sm">Loading…</div>
				<div v-else-if="!deliveries.length" class="p-8 text-center text-slate-500 text-sm">
					No package deliveries yet. Create one or import CSV.
				</div>
				<div v-else class="overflow-x-auto">
					<table class="min-w-full text-sm">
						<thead class="bg-slate-50 text-slate-600 text-left">
							<tr>
								<th class="px-4 py-2 font-medium">UUID</th>
								<th class="px-4 py-2 font-medium">Status</th>
								<th class="px-4 py-2 font-medium">Route ref</th>
								<th class="px-4 py-2 font-medium">Customer NFC</th>
								<th class="px-4 py-2 font-medium">Destination</th>
								<th class="px-4 py-2 font-medium w-[1%] whitespace-nowrap">Tracking</th>
							</tr>
						</thead>
						<tbody>
							<tr
								v-for="row in deliveries"
								:key="row.uuid"
								class="border-t border-slate-100 hover:bg-slate-50/80"
							>
								<td class="px-4 py-2 font-mono text-xs">{{ row.uuid }}</td>
								<td class="px-4 py-2 capitalize">{{ row.status }}</td>
								<td class="px-4 py-2 font-mono text-xs">
									{{ row.external_route_ref || row.externalRouteRef || "—" }}
								</td>
								<td class="px-4 py-2 max-w-[10rem] truncate text-xs">
									<span v-if="row.recipient_nfc_nickname || row.recipientNfcNickname" class="text-slate-800">{{
										row.recipient_nfc_nickname || row.recipientNfcNickname
									}}</span>
									<span v-else class="text-slate-400">—</span>
								</td>
								<td class="px-4 py-2 max-w-xs truncate">
									{{ row.destination_address || row.destinationAddress || "—" }}
								</td>
								<td class="px-4 py-2">
									<button
										type="button"
										class="px-2.5 py-1 text-xs font-medium text-white bg-[#0D65AE] rounded-lg hover:bg-[#0a4f87]"
										@click="openCompanyTracking(row.uuid)"
									>
										Live tracking
									</button>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>

			<!-- Single create -->
			<div v-show="activeTab === 'create'" class="bg-white rounded-xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-4 max-w-xl">
				<h2 class="text-sm font-semibold text-slate-800">New standalone route</h2>
				<p class="text-xs text-slate-500">
					Requires a <strong>registered customer SureBox tag</strong> (<code class="bg-slate-100 px-1 rounded">recipientUserNfcUuid</code> from the app, or the physical NFC code).
					Assign a courier via <code class="bg-slate-100 px-1 rounded">PUT /packages/:uuid/assign</code>.
				</p>
				<div class="space-y-3">
					<label class="block text-xs font-medium text-slate-600">external_route_ref (unique per company)</label>
					<input v-model="createForm.externalRouteRef" type="text" class="w-full border rounded-lg px-3 py-2 text-sm" placeholder="ROUTE-2026-0001" />
					<label class="block text-xs font-medium text-slate-600">Destination address *</label>
					<input v-model="createForm.destinationAddress" type="text" class="w-full border rounded-lg px-3 py-2 text-sm" />
					<div class="grid grid-cols-2 gap-3">
						<div>
							<label class="block text-xs font-medium text-slate-600">Lat</label>
							<input v-model="createForm.destinationLat" type="text" class="w-full border rounded-lg px-3 py-2 text-sm" placeholder="optional" />
						</div>
						<div>
							<label class="block text-xs font-medium text-slate-600">Lng</label>
							<input v-model="createForm.destinationLng" type="text" class="w-full border rounded-lg px-3 py-2 text-sm" placeholder="optional" />
						</div>
					</div>
					<label class="block text-xs font-medium text-slate-600">Customer NFC (UUID or tag code) *</label>
					<input
						v-model="createForm.requiredNfcCode"
						type="text"
						class="w-full border rounded-lg px-3 py-2 text-sm font-mono"
						placeholder="user_nfc UUID or NFC code"
					/>
					<div class="grid grid-cols-2 gap-3">
						<div>
							<label class="block text-xs font-medium text-slate-600">Recipient</label>
							<input v-model="createForm.recipientName" type="text" class="w-full border rounded-lg px-3 py-2 text-sm" />
						</div>
						<div>
							<label class="block text-xs font-medium text-slate-600">Phone</label>
							<input v-model="createForm.recipientPhone" type="text" class="w-full border rounded-lg px-3 py-2 text-sm" />
						</div>
					</div>
					<label class="block text-xs font-medium text-slate-600">max_distance_meters</label>
					<input v-model.number="createForm.maxDistanceMeters" type="number" class="w-full border rounded-lg px-3 py-2 text-sm" />
				</div>
				<button
					type="button"
					class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0D65AE] rounded-lg hover:bg-[#0a4f87] disabled:opacity-50"
					:disabled="creating"
					@click="submitCreate"
				>
					{{ creating ? "Creating…" : "Create package" }}
				</button>
			</div>

			<!-- CSV -->
			<div v-show="activeTab === 'csv'" class="space-y-4">
				<div class="bg-white rounded-xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-4">
					<h2 class="text-sm font-semibold text-slate-800">Import CSV</h2>
					<p class="text-xs text-slate-600 leading-relaxed">
						Headers on row 1. Required:
						<code class="bg-slate-100 px-1 rounded">external_route_ref</code>,
						either <code class="bg-slate-100 px-1 rounded">recipient_user_nfc_uuid</code> or
						<code class="bg-slate-100 px-1 rounded">required_nfc_code</code> (must match an active customer tag),
						and either <code class="bg-slate-100 px-1 rounded">destination_address</code> or lat+lng.
						Max <strong>1000</strong> rows per upload.
					</p>
					<button
						type="button"
						class="text-sm text-[#0D65AE] font-medium hover:underline"
						@click="downloadTemplate"
					>
						Download example CSV
					</button>
					<input ref="csvInput" type="file" accept=".csv,.txt" class="block text-sm text-slate-600" @change="onCsvFile" />
					<button
						type="button"
						class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0D65AE] rounded-lg hover:bg-[#0a4f87] disabled:opacity-50"
						:disabled="bulkSubmitting || !parsedPackages.length"
						@click="submitBulk(parsedPackages)"
					>
						{{ bulkSubmitting ? "Importing…" : `Import ${parsedPackages.length} rows` }}
					</button>
					<pre v-if="lastBulkResult" class="text-xs bg-slate-900 text-green-100 p-3 rounded-lg overflow-x-auto max-h-64">{{ lastBulkResult }}</pre>
				</div>
			</div>

			<!-- API -->
			<div v-show="activeTab === 'api'" class="bg-white rounded-xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-5">
				<h2 class="text-sm font-semibold text-slate-800">API token (bulk automation)</h2>
				<p class="text-xs text-slate-600">
					Create a token once and store it in your TMS/ERP. Call the integration endpoint with
					<code class="bg-slate-100 px-1 rounded">Authorization: Bearer &lt;token&gt;</code>
					or header <code class="bg-slate-100 px-1 rounded">X-Surebox-Package-Import-Token</code>.
				</p>
				<div class="flex flex-wrap gap-2">
					<input
						v-model="newTokenLabel"
						type="text"
						placeholder="Label (e.g. TMS production)"
						class="flex-1 min-w-[200px] border rounded-lg px-3 py-2 text-sm"
					/>
					<button
						type="button"
						class="px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 disabled:opacity-50"
						:disabled="tokenCreating"
						@click="createToken"
					>
						{{ tokenCreating ? "…" : "Generate token" }}
					</button>
				</div>
				<div
					v-if="revealedToken"
					class="rounded-lg border border-amber-300 bg-amber-50 text-amber-950 p-3 text-sm space-y-2"
				>
					<p class="font-semibold">Copy this token now — it will not be shown again.</p>
					<code class="block break-all text-xs bg-white border border-amber-200 rounded p-2 select-all">{{ revealedToken }}</code>
					<p class="text-xs">
						POST {{ integrationUrl }}
					</p>
				</div>
				<div>
					<h3 class="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Active tokens</h3>
					<ul class="space-y-2 text-sm">
						<li
							v-for="tok in tokens"
							:key="tok.uuid"
							class="flex items-center justify-between border border-slate-100 rounded-lg px-3 py-2"
						>
							<div>
								<p class="font-medium text-slate-800">{{ tok.label || "(no label)" }}</p>
								<p class="text-xs text-slate-500 font-mono">{{ tok.tokenPrefix }}</p>
								<p class="text-[11px] text-slate-400">{{ tok.createdAt }}</p>
							</div>
							<button
								v-if="!tok.revokedAt"
								type="button"
								class="text-xs text-red-600 hover:underline"
								@click="revokeTok(tok.uuid)"
							>
								Revoke
							</button>
							<span v-else class="text-xs text-slate-400">Revoked</span>
						</li>
					</ul>
				</div>
				<div class="rounded-lg bg-slate-900 text-slate-100 p-3 text-xs font-mono overflow-x-auto">
					<p class="text-slate-400 mb-1"># Example (curl)</p>
					<p>curl -X POST "{{ integrationUrl }}" \</p>
					<p>&nbsp;&nbsp;-H "Authorization: Bearer sbpkg_…" \</p>
					<p>&nbsp;&nbsp;-H "Content-Type: application/json" \</p>
					<p>&nbsp;&nbsp;-d '{{ exampleCurlBody }}'</p>
				</div>
			</div>
		</div>

		<Teleport to="body">
			<div
				v-if="trackingOpen"
				class="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/40 p-4"
				@click.self="closeCompanyTracking"
			>
				<div class="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-5 space-y-4">
					<div class="flex items-start justify-between gap-2">
						<h2 class="text-lg font-semibold text-slate-900">Company — live tracking</h2>
						<button type="button" class="text-slate-400 hover:text-slate-700 text-xl leading-none" @click="closeCompanyTracking">×</button>
					</div>
					<div v-if="trackingLoading" class="text-sm text-slate-500 py-6 text-center">Loading…</div>
					<template v-else-if="trackingDetail">
						<div class="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm space-y-2">
							<p class="text-xs font-semibold text-slate-500 uppercase">Status</p>
							<p class="text-base font-semibold capitalize">{{ trackingDetail.delivery?.status }}</p>
							<div v-if="trackingDetail.delivery?.destinationNfc" class="pt-2 border-t border-slate-200">
								<p class="text-xs font-semibold text-slate-500 uppercase mb-1">Customer SureBox tag</p>
								<p class="text-sm font-medium text-slate-900">
									{{ trackingDetail.delivery.destinationNfc.nickname || "NFC" }}
								</p>
								<p v-if="trackingDetail.delivery.destinationNfc.address" class="text-xs text-slate-600 mt-1">
									{{ trackingDetail.delivery.destinationNfc.address }}
								</p>
								<a
									v-if="osmNfc(trackingDetail.delivery.destinationNfc)"
									:href="osmNfc(trackingDetail.delivery.destinationNfc)"
									target="_blank"
									rel="noopener noreferrer"
									class="text-xs text-[#0D65AE] font-medium hover:underline mt-2 inline-block"
								>
									Tag on map
								</a>
							</div>
							<p v-if="trackingDetail.delivery?.destinationAddress" class="text-xs text-slate-600 pt-2 border-t">
								<span class="font-medium">Route:</span> {{ trackingDetail.delivery.destinationAddress }}
							</p>
						</div>
						<div v-if="trackingDetail.alerts?.length" class="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm">
							<p class="text-xs font-semibold text-amber-800 uppercase mb-2">Alerts</p>
							<ul class="space-y-2 text-xs text-amber-950">
								<li v-for="(a, i) in trackingDetail.alerts" :key="a.uuid || i">
									<span class="font-medium capitalize">{{ String(a.alertType || "").replace(/_/g, " ") }}</span>
									<span> — {{ a.message }}</span>
									<span class="text-amber-700 block">{{ formatTrackingDt(a.createdAt) }}</span>
								</li>
							</ul>
						</div>
						<div>
							<p class="text-xs font-semibold text-slate-500 uppercase mb-2">Timeline</p>
							<ul v-if="trackingDetail.events?.length" class="space-y-3 text-sm border-l-2 border-slate-200 ml-2 pl-4">
								<li v-for="(ev, i) in trackingDetail.events" :key="ev.uuid || i" class="relative">
									<span class="absolute -left-[1.15rem] top-1.5 w-2.5 h-2.5 rounded-full bg-[#0D65AE] ring-4 ring-white" />
									<p class="font-medium text-slate-800 capitalize">{{ String(ev.eventType || "").replace(/_/g, " ") }}</p>
									<p class="text-xs text-slate-500">{{ formatTrackingDt(ev.createdAt) }}</p>
									<p v-if="ev.employeeUuid" class="text-[10px] text-slate-400 font-mono mt-0.5">Courier {{ ev.employeeUuid }}</p>
									<a
										v-if="ev.lat != null && ev.lng != null"
										:href="osmEv(ev.lat, ev.lng)"
										target="_blank"
										rel="noopener noreferrer"
										class="text-xs text-[#0D65AE] hover:underline mt-1 inline-block"
									>
										Map
									</a>
									<p v-if="trackingEventExtra(ev)" class="text-xs text-slate-600 mt-1">{{ trackingEventExtra(ev) }}</p>
								</li>
							</ul>
							<p v-else class="text-xs text-slate-500">No events yet.</p>
						</div>
					</template>
				</div>
			</div>
		</Teleport>
	</div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useToast } from "@/composables/useToast";
import {
	getCompanyPackageDeliveries,
	getCompanyPackageDeliveryDetail,
	createCompanyPackageDelivery,
	bulkImportCompanyPackages,
	createCompanyPackageImportToken,
	listCompanyPackageImportTokens,
	revokeCompanyPackageImportToken,
} from "@/api/packages.api";

const toast = useToast();
const route = useRoute();
const trackingOpen = ref(false);
const trackingLoading = ref(false);
const trackingDetail = ref(null);
const activeTab = ref("list");
const tabs = [
	{ id: "list", label: "List" },
	{ id: "create", label: "New package" },
	{ id: "csv", label: "Import CSV" },
	{ id: "api", label: "API & tokens" },
];

const loadingList = ref(false);
const deliveries = ref([]);
const tokens = ref([]);
const revealedToken = ref("");
const newTokenLabel = ref("");
const tokenCreating = ref(false);
const parsedPackages = ref([]);
const lastBulkResult = ref("");
const bulkSubmitting = ref(false);
const csvInput = ref(null);

const createForm = ref({
	externalRouteRef: "",
	destinationAddress: "",
	destinationLat: "",
	destinationLng: "",
	requiredNfcCode: "",
	recipientName: "",
	recipientPhone: "",
	maxDistanceMeters: 100,
});
const creating = ref(false);

const integrationPath = "/integrations/company/package-deliveries/bulk";
const integrationUrl = computed(() => {
	const base = (import.meta.env.VITE_API_URL || "/api/v1").replace(/\/$/, "");
	if (base.startsWith("http")) {
		return `${base}${integrationPath}`;
	}
	if (typeof window !== "undefined") {
		return `${window.location.origin}${base}${integrationPath}`;
	}
	return `${base}${integrationPath}`;
});

const exampleCurlBody = `{"packages":[{"externalRouteRef":"API-001","destinationAddress":"Calle 1","recipientUserNfcUuid":"<user_nfc-uuid-from-customer-app>"}]}`;

const CSV_TEMPLATE = `external_route_ref,recipient_user_nfc_uuid,recipient_name,recipient_phone,destination_address,destination_lat,destination_lng,required_nfc_code,max_distance_meters,notes
ROUTE-001,aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee,Juan Perez,600000001,"Calle Mayor 1, Madrid",,,,100,UUID from customer app
ROUTE-002,,Maria Lopez,,,40.4168,-3.7038,CUSTOMER-NFC-CODE,150,Or use required_nfc_code with the physical tag`;

function unwrapList(res) {
	if (Array.isArray(res)) return res;
	if (Array.isArray(res?.data)) return res.data;
	return [];
}

function formatTrackingDt(v) {
	if (!v) return "";
	try {
		return new Date(v).toLocaleString();
	} catch {
		return String(v);
	}
}

function osmEv(lat, lng) {
	return `https://www.openstreetmap.org/?mlat=${encodeURIComponent(lat)}&mlon=${encodeURIComponent(lng)}#map=16/${lat}/${lng}`;
}

function osmNfc(nfc) {
	if (!nfc || nfc.lat == null || nfc.lng == null) return "";
	return osmEv(nfc.lat, nfc.lng);
}

function trackingEventExtra(ev) {
	const p = ev.payload;
	if (!p || typeof p !== "object") return "";
	if (typeof p.distanceMeters === "number") {
		return `Distance from destination zone: ${Math.round(p.distanceMeters)} m`;
	}
	return "";
}

async function openCompanyTracking(uuid) {
	if (!uuid) return;
	trackingOpen.value = true;
	trackingDetail.value = null;
	trackingLoading.value = true;
	try {
		const res = await getCompanyPackageDeliveryDetail(uuid);
		const inner =
			res?.data &&
			(res.data.delivery !== undefined || Array.isArray(res.data.events))
				? res.data
				: res;
		trackingDetail.value = inner;
	} catch (e) {
		toast.showError(e?.message || "Could not load tracking");
		trackingOpen.value = false;
	} finally {
		trackingLoading.value = false;
	}
}

function closeCompanyTracking() {
	trackingOpen.value = false;
}

/** Rough UUID v4 shape check for optional recipientUserNfcUuid field on create */
function isUuid(s) {
	return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
		String(s || "").trim(),
	);
}

async function reloadAll() {
	loadingList.value = true;
	try {
		const res = await getCompanyPackageDeliveries();
		deliveries.value = unwrapList(res);
		const tr = await listCompanyPackageImportTokens();
		tokens.value = unwrapList(tr);
	} catch (e) {
		toast.showError(e?.message || "Could not load packages");
	} finally {
		loadingList.value = false;
	}
}

function downloadTemplate() {
	const blob = new Blob([CSV_TEMPLATE], { type: "text/csv;charset=utf-8" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = "surebox-package-import-template.csv";
	a.click();
	URL.revokeObjectURL(url);
}

function parseCsv(text) {
	const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
	if (lines.length < 2) return [];
	const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
	const out = [];
	for (let i = 1; i < lines.length; i += 1) {
		const cols = splitCsvLine(lines[i]);
		const row = {};
		headers.forEach((h, idx) => {
			row[h] = cols[idx] != null ? cols[idx].trim() : "";
		});
		out.push({
			externalRouteRef: row.external_route_ref || row.route_id || "",
			recipientUserNfcUuid: row.recipient_user_nfc_uuid || "",
			recipientName: row.recipient_name || "",
			recipientPhone: row.recipient_phone || "",
			destinationAddress: row.destination_address || "",
			destinationLat: row.destination_lat || "",
			destinationLng: row.destination_lng || "",
			requiredNfcCode: row.required_nfc_code || "",
			maxDistanceMeters: row.max_distance_meters || "",
			notes: row.notes || "",
		});
	}
	return out;
}

function splitCsvLine(line) {
	const result = [];
	let cur = "";
	let inQ = false;
	for (let i = 0; i < line.length; i += 1) {
		const c = line[i];
		if (c === '"') {
			inQ = !inQ;
		} else if (c === "," && !inQ) {
			result.push(cur);
			cur = "";
		} else {
			cur += c;
		}
	}
	result.push(cur);
	return result.map((c) => c.replace(/^"|"$/g, "").trim());
}

function onCsvFile(ev) {
	const file = ev.target.files?.[0];
	if (!file) return;
	const reader = new FileReader();
	reader.onload = () => {
		const text = String(reader.result || "");
		parsedPackages.value = parseCsv(text);
		if (parsedPackages.value.length > 1000) {
			toast.showError("CSV has more than 1000 data rows. Split the file.");
			parsedPackages.value = parsedPackages.value.slice(0, 1000);
		}
		toast.showSuccess(`Parsed ${parsedPackages.value.length} rows`);
	};
	reader.readAsText(file, "UTF-8");
	ev.target.value = "";
}

async function submitBulk(packages) {
	lastBulkResult.value = "";
	bulkSubmitting.value = true;
	try {
		const res = await bulkImportCompanyPackages(packages);
		const payload = res?.data ?? res;
		lastBulkResult.value = JSON.stringify(payload, null, 2);
		toast.showSuccess("Import finished — see summary below");
		await reloadAll();
	} catch (e) {
		toast.showError(e?.message || "Import failed");
	} finally {
		bulkSubmitting.value = false;
	}
}

async function submitCreate() {
	creating.value = true;
	try {
		const body = {
			externalRouteRef: createForm.value.externalRouteRef.trim(),
			destinationAddress: createForm.value.destinationAddress.trim(),
			requiredNfcCode: createForm.value.requiredNfcCode.trim(),
			recipientUserNfcUuid: isUuid(createForm.value.requiredNfcCode.trim())
				? createForm.value.requiredNfcCode.trim()
				: undefined,
			recipientName: createForm.value.recipientName.trim() || undefined,
			recipientPhone: createForm.value.recipientPhone.trim() || undefined,
			maxDistanceMeters: createForm.value.maxDistanceMeters || 100,
		};
		if (createForm.value.destinationLat && createForm.value.destinationLng) {
			body.destinationLat = parseFloat(createForm.value.destinationLat);
			body.destinationLng = parseFloat(createForm.value.destinationLng);
		}
		await createCompanyPackageDelivery(body);
		toast.showSuccess("Package created");
		activeTab.value = "list";
		await reloadAll();
	} catch (e) {
		toast.showError(e?.message || "Create failed");
	} finally {
		creating.value = false;
	}
}

async function createToken() {
	tokenCreating.value = true;
	revealedToken.value = "";
	try {
		const res = await createCompanyPackageImportToken(newTokenLabel.value.trim());
		const d = res?.data ?? res;
		revealedToken.value = d?.token || "";
		toast.showSuccess("Token created");
		await reloadAll();
	} catch (e) {
		toast.showError(e?.message || "Could not create token");
	} finally {
		tokenCreating.value = false;
	}
}

async function revokeTok(uuid) {
	try {
		await revokeCompanyPackageImportToken(uuid);
		toast.showSuccess("Token revoked");
		await reloadAll();
	} catch (e) {
		toast.showError(e?.message || "Revoke failed");
	}
}

onMounted(async () => {
	await reloadAll();
	const t = route.query.track;
	if (t) {
		activeTab.value = "list";
		await openCompanyTracking(String(t));
	}
});
</script>
