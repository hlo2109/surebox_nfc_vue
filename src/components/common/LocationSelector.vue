<template>
	<div class="space-y-4">
		<!-- ── Country ─────────────────────────────────────────── -->
		<div>
			<label class="block text-sm font-semibold text-gray-900 mb-2">
				Country
				<span v-if="required" class="text-red-500 ml-0.5">*</span>
			</label>
			<div class="relative">
				<select
					:value="
						internalCountryId != null && internalCountryId !== ''
							? String(internalCountryId)
							: ''
					"
					:disabled="disabled || loadingCountries"
					class="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg bg-white text-sm text-gray-900 focus:border-[#0D65AE] focus:ring-2 focus:ring-[#0D65AE] focus:ring-opacity-20 focus:outline-none transition-all appearance-none cursor-pointer disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
					@change="onCountryChange($event.target.value)"
				>
					<option value="" disabled>
						{{
							loadingCountries
								? "Loading countries…"
								: "Select a country"
						}}
					</option>
					<option
						v-for="c in countries"
						:key="c.id"
						:value="String(c.id)"
					>
						{{ c.name }}{{ c.code ? ` (${c.code})` : "" }}
					</option>
				</select>

				<!-- trailing icon: spinner while loading, chevron otherwise -->
				<div
					class="pointer-events-none absolute inset-y-0 right-3 flex items-center"
				>
					<svg
						v-if="loadingCountries"
						class="animate-spin h-4 w-4 text-[#0D65AE]"
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
						/>
						<path
							class="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
						/>
					</svg>
					<svg
						v-else
						class="h-4 w-4 text-gray-400"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
						/>
					</svg>
				</div>
			</div>
		</div>

		<!-- ── Department / State ──────────────────────────────── -->
		<div>
			<label class="block text-sm font-semibold text-gray-900 mb-2">
				Department / State
				<span v-if="required" class="text-red-500 ml-0.5">*</span>
			</label>
			<div class="relative">
				<select
					:value="
						internalDepartmentId != null &&
						internalDepartmentId !== ''
							? String(internalDepartmentId)
							: ''
					"
					:disabled="
						disabled || !internalCountryId || loadingDepartments
					"
					class="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg bg-white text-sm text-gray-900 focus:border-[#0D65AE] focus:ring-2 focus:ring-[#0D65AE] focus:ring-opacity-20 focus:outline-none transition-all appearance-none cursor-pointer disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
					@change="onDepartmentChange($event.target.value)"
				>
					<option value="" disabled>
						<template v-if="loadingDepartments"
							>Loading departments…</template
						>
						<template v-else-if="!internalCountryId"
							>Select a country first</template
						>
						<template v-else>Select a department</template>
					</option>
					<option
						v-for="d in departments"
						:key="d.id"
						:value="String(d.id)"
					>
						{{ d.name }}{{ d.code ? ` (${d.code})` : "" }}
					</option>
				</select>

				<div
					class="pointer-events-none absolute inset-y-0 right-3 flex items-center"
				>
					<svg
						v-if="loadingDepartments"
						class="animate-spin h-4 w-4 text-[#0D65AE]"
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
						/>
						<path
							class="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
						/>
					</svg>
					<svg
						v-else
						class="h-4 w-4 text-gray-400"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
						/>
					</svg>
				</div>
			</div>
		</div>

		<!-- ── City ───────────────────────────────────────────── -->
		<div>
			<label class="block text-sm font-semibold text-gray-900 mb-2">
				City
				<span v-if="required" class="text-red-500 ml-0.5">*</span>
			</label>
			<div class="relative">
				<select
					:value="
						internalCityId != null && internalCityId !== ''
							? String(internalCityId)
							: ''
					"
					:disabled="
						disabled || !internalDepartmentId || loadingCities
					"
					class="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg bg-white text-sm text-gray-900 focus:border-[#0D65AE] focus:ring-2 focus:ring-[#0D65AE] focus:ring-opacity-20 focus:outline-none transition-all appearance-none cursor-pointer disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
					@change="onCityChange($event.target.value)"
				>
					<option value="" disabled>
						<template v-if="loadingCities"
							>Loading cities…</template
						>
						<template v-else-if="!internalDepartmentId"
							>Select a department first</template
						>
						<template v-else>Select a city</template>
					</option>
					<option
						v-for="c in cities"
						:key="c.id"
						:value="String(c.id)"
					>
						{{ c.name }}{{ c.code ? ` (${c.code})` : "" }}
					</option>
				</select>

				<div
					class="pointer-events-none absolute inset-y-0 right-3 flex items-center"
				>
					<svg
						v-if="loadingCities"
						class="animate-spin h-4 w-4 text-[#0D65AE]"
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
						/>
						<path
							class="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
						/>
					</svg>
					<svg
						v-else
						class="h-4 w-4 text-gray-400"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
						/>
					</svg>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, watch } from "vue";
import {
	getCountries,
	getDepartments,
	getCities,
	getCityById,
} from "@/api/location.api";

/** Compare location strings across Radar vs DB (accents, case). */
const norm = (s) =>
	String(s ?? "")
		.toLowerCase()
		.normalize("NFD")
		.replace(/\p{M}/gu, "")
		.trim();

// ── Props ──────────────────────────────────────────────────────────────────

const props = defineProps({
	/** Pre-selected country ID – used in edit mode to seed the dropdowns */
	initialCountryId: { type: [Number, String], default: null },
	/** Pre-selected department ID – used in edit mode */
	initialDepartmentId: { type: [Number, String], default: null },
	/** Pre-selected city ID – used in edit mode */
	initialCityId: { type: [Number, String], default: null },
	/** Disables all three selects (e.g. while the parent form is submitting) */
	disabled: { type: Boolean, default: false },
	/** Renders a red asterisk on every label */
	required: { type: Boolean, default: false },
});

// ── Emits ──────────────────────────────────────────────────────────────────

const emit = defineEmits([
	"update:countryId",
	"update:departmentId",
	"update:cityId",
	/**
	 * Fired after every user change.
	 * Payload: { countryId, countryName, countryCode,
	 *            departmentId, departmentName, departmentCode,
	 *            cityId, cityName, cityCode }
	 */
	"change",
]);

// ── Internal state ─────────────────────────────────────────────────────────

const countries = ref([]);
const departments = ref([]);
const cities = ref([]);

const internalCountryId = ref(null);
const internalDepartmentId = ref(null);
const internalCityId = ref(null);

const loadingCountries = ref(false);
const loadingDepartments = ref(false);
const loadingCities = ref(false);

/**
 * While true the user-facing @change emits are suppressed so that
 * pre-populating the selects on mount does not fire false events.
 */
let isInitializing = true;

// ── API helpers ────────────────────────────────────────────────────────────

const fetchCountries = async () => {
	loadingCountries.value = true;
	try {
		const res = await getCountries();
		const raw = res?.data ?? res;
		countries.value = Array.isArray(raw) ? raw : [];
	} catch (e) {
		console.error("[LocationSelector] countries:", e.message);
		countries.value = [];
	} finally {
		loadingCountries.value = false;
	}
};

const fetchDepartments = async (countryId) => {
	if (!countryId) {
		departments.value = [];
		return;
	}
	loadingDepartments.value = true;
	try {
		const res = await getDepartments(countryId);
		const raw = res?.data ?? res;
		departments.value = Array.isArray(raw) ? raw : [];
	} catch (e) {
		console.error("[LocationSelector] departments:", e.message);
		departments.value = [];
	} finally {
		loadingDepartments.value = false;
	}
};

const fetchCities = async (departmentId) => {
	if (!departmentId) {
		cities.value = [];
		return;
	}
	loadingCities.value = true;
	try {
		const res = await getCities(departmentId);
		const raw = res?.data ?? res;
		cities.value = Array.isArray(raw) ? raw : [];
	} catch (e) {
		console.error("[LocationSelector] cities:", e.message);
		cities.value = [];
	} finally {
		loadingCities.value = false;
	}
};

// ── Payload builder ────────────────────────────────────────────────────────

const sameId = (a, b) =>
	a != null && b != null && Number(a) === Number(b);

const buildPayload = () => {
	const country = countries.value.find((c) =>
		sameId(c.id, internalCountryId.value),
	);
	const department = departments.value.find((d) =>
		sameId(d.id, internalDepartmentId.value),
	);
	const city = cities.value.find((c) => sameId(c.id, internalCityId.value));
	return {
		countryId: internalCountryId.value,
		countryName: country?.name ?? "",
		countryCode: country?.code ?? "",
		departmentId: internalDepartmentId.value,
		departmentName: department?.name ?? "",
		departmentCode: department?.code ?? "",
		cityId: internalCityId.value,
		cityName: city?.name ?? "",
		cityCode: city?.code ?? "",
	};
};

// ── Change handlers ────────────────────────────────────────────────────────

/**
 * Native <select> always gives us a string; convert to number (or null).
 */
const toId = (strVal) => (strVal ? Number(strVal) : null);

const onCountryChange = (strVal) => {
	const newId = toId(strVal);
	internalCountryId.value = newId;
	internalDepartmentId.value = null;
	internalCityId.value = null;
	departments.value = [];
	cities.value = [];

	emit("update:countryId", newId);
	emit("update:departmentId", null);
	emit("update:cityId", null);

	if (newId) fetchDepartments(newId);
	if (!isInitializing) emit("change", buildPayload());
};

const onDepartmentChange = (strVal) => {
	const newId = toId(strVal);
	internalDepartmentId.value = newId;
	internalCityId.value = null;
	cities.value = [];

	emit("update:departmentId", newId);
	emit("update:cityId", null);

	if (newId) fetchCities(newId);
	if (!isInitializing) emit("change", buildPayload());
};

const onCityChange = (strVal) => {
	const newId = toId(strVal);
	internalCityId.value = newId;

	emit("update:cityId", newId);
	if (!isInitializing) emit("change", buildPayload());
};

// ── Coerce API / v-model values (strings) to numeric ids ───────────────────

const coerceId = (v) => {
	if (v === undefined || v === null || v === "") return null;
	const n = Number(v);
	return Number.isFinite(n) ? n : null;
};

/** Normalize API envelopes and loose key casing (MySQL / proxies). */
const unpackEntity = (pack) => {
	const a = pack?.data ?? pack;
	if (a && typeof a === "object" && a.data != null && typeof a.data === "object") {
		return a.data;
	}
	return a;
};

const rowNum = (row, ...names) => {
	if (!row || typeof row !== "object") return null;
	for (const name of names) {
		const v = row[name];
		const n = Number(v);
		if (v !== undefined && v !== null && v !== "" && Number.isFinite(n)) {
			return n;
		}
	}
	for (const name of names) {
		const key = Object.keys(row).find(
			(k) => k.toLowerCase() === name.toLowerCase(),
		);
		if (key != null) {
			const n = Number(row[key]);
			if (Number.isFinite(n)) return n;
		}
	}
	return null;
};

/**
 * Load country → department → city chains when initial props change
 * (edit dialog, or parent fills ids after mount).
 */
const hydrateFromProps = async () => {
	isInitializing = true;
	internalCountryId.value = null;
	internalDepartmentId.value = null;
	internalCityId.value = null;
	departments.value = [];
	cities.value = [];

	if (!countries.value.length) {
		await fetchCountries();
	}

	let cId = coerceId(props.initialCountryId);
	let dId = coerceId(props.initialDepartmentId);
	const cityId = coerceId(props.initialCityId);

	if (cityId && (cId == null || dId == null)) {
		try {
			const pack = await getCityById(cityId);
			const row = unpackEntity(pack);
			if (row && typeof row === "object") {
				if (cId == null) {
					cId = rowNum(row, "countryId", "country_id", "countryid");
				}
				if (dId == null) {
					dId = rowNum(row, "departmentId", "department_id", "departmentid");
				}
			}
		} catch {
			// Location list may already include countryId / departmentId
		}
	}

	if (cId) {
		internalCountryId.value = cId;
		await fetchDepartments(cId);
	}

	if (dId) {
		internalDepartmentId.value = dId;
		await fetchCities(dId);
	}

	if (cityId) {
		internalCityId.value = cityId;
	}

	isInitializing = false;
};

watch(
	() => [
		props.initialCountryId,
		props.initialDepartmentId,
		props.initialCityId,
	],
	() => {
		void hydrateFromProps();
	},
	{ immediate: true },
);

/**
 * After the user picks a Radar autocomplete row, map country / state / city
 * into our Country → Department → City IDs when possible.
 * @param {object} addr – Radar address (countryCode, country, state, stateCode, city, …)
 */
const applyFromRadar = async (addr) => {
	if (!addr) return;

	isInitializing = true;
	try {
		if (!countries.value.length) {
			await fetchCountries();
		}

		const cc = String(addr.countryCode || "")
			.trim()
			.toUpperCase();
		const countryName = addr.country || addr.countryName || "";

		let country =
			cc &&
			countries.value.find(
				(c) => c.code && String(c.code).trim().toUpperCase() === cc,
			);
		if (!country && countryName) {
			const nn = norm(countryName);
			country = countries.value.find((c) => norm(c.name) === nn);
		}
		if (!country) {
			internalCountryId.value = null;
			internalDepartmentId.value = null;
			internalCityId.value = null;
			departments.value = [];
			cities.value = [];
			return;
		}

		internalCountryId.value = country.id;
		internalDepartmentId.value = null;
		internalCityId.value = null;
		departments.value = [];
		cities.value = [];

		await fetchDepartments(country.id);

		const stateName = addr.state || addr.county || "";
		const stateCode = String(addr.stateCode || addr.countyCode || "")
			.trim()
			.toUpperCase();

		let department =
			stateCode &&
			departments.value.find(
				(d) => d.code && String(d.code).trim().toUpperCase() === stateCode,
			);
		if (!department && stateName) {
			const sn = norm(stateName);
			department = departments.value.find((d) => norm(d.name) === sn);
		}
		if (!department && stateName) {
			const sn = norm(stateName);
			department = departments.value.find(
				(d) =>
					sn &&
					(norm(d.name).includes(sn) ||
						sn.includes(norm(d.name)) ||
						norm(d.name).startsWith(sn)),
			);
		}

		if (!department) {
			internalDepartmentId.value = null;
			internalCityId.value = null;
			cities.value = [];
			return;
		}

		internalDepartmentId.value = department.id;
		internalCityId.value = null;
		cities.value = [];

		await fetchCities(department.id);

		const cityName = addr.city || addr.neighborhood || "";
		let city = null;
		if (cityName) {
			const cn = norm(cityName);
			city = cities.value.find((c) => norm(c.name) === cn);
			if (!city) {
				city = cities.value.find(
					(c) =>
						cn &&
						(norm(c.name).includes(cn) ||
							cn.includes(norm(c.name))),
				);
			}
		}

		internalCityId.value = city?.id ?? null;
	} finally {
		isInitializing = false;
		emit("update:countryId", internalCountryId.value);
		emit("update:departmentId", internalDepartmentId.value);
		emit("update:cityId", internalCityId.value);
		emit("change", buildPayload());
	}
};

defineExpose({ applyFromRadar });
</script>
