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
					:value="internalCountryId ?? ''"
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
					:value="internalDepartmentId ?? ''"
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
					:value="internalCityId ?? ''"
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
import { ref, onMounted } from "vue";
import { getCountries, getDepartments, getCities } from "@/api/location.api";

// ── Props ──────────────────────────────────────────────────────────────────

const props = defineProps({
	/** Pre-selected country ID – used in edit mode to seed the dropdowns */
	initialCountryId: { type: Number, default: null },
	/** Pre-selected department ID – used in edit mode */
	initialDepartmentId: { type: Number, default: null },
	/** Pre-selected city ID – used in edit mode */
	initialCityId: { type: Number, default: null },
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

const buildPayload = () => {
	const country = countries.value.find(
		(c) => c.id === internalCountryId.value,
	);
	const department = departments.value.find(
		(d) => d.id === internalDepartmentId.value,
	);
	const city = cities.value.find((c) => c.id === internalCityId.value);
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

// ── Mount: load lists and pre-fill initial values (edit mode) ──────────────

onMounted(async () => {
	isInitializing = true;

	await fetchCountries();

	if (props.initialCountryId) {
		internalCountryId.value = props.initialCountryId;
		await fetchDepartments(props.initialCountryId);
	}

	if (props.initialDepartmentId) {
		internalDepartmentId.value = props.initialDepartmentId;
		await fetchCities(props.initialDepartmentId);
	}

	if (props.initialCityId) {
		internalCityId.value = props.initialCityId;
	}

	isInitializing = false;
});
</script>
