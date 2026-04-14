<template>
	<div class="relative" ref="wrapperRef">
		<!-- Input -->
		<div class="relative">
			<input
				ref="inputRef"
				:value="inputValue"
				type="text"
				:placeholder="placeholder"
				:disabled="disabled"
				:required="required"
				autocomplete="off"
				class="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg bg-white text-sm text-gray-900 focus:border-[#0D65AE] focus:ring-2 focus:ring-[#0D65AE] focus:ring-opacity-20 focus:outline-none transition-all disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
				@input="onInput($event.target.value)"
				@keydown.down.prevent="moveHighlight(1)"
				@keydown.up.prevent="moveHighlight(-1)"
				@keydown.enter.prevent="confirmHighlighted"
				@keydown.escape="close"
				@focus="onFocus"
			/>

			<!-- trailing icon: spinner while searching, search icon otherwise -->
			<div class="pointer-events-none absolute inset-y-0 right-3 flex items-center">
				<svg
					v-if="loading"
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
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
					/>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
					/>
				</svg>
			</div>
		</div>

		<!-- Suggestions dropdown -->
		<Transition
			enter-active-class="transition ease-out duration-100"
			enter-from-class="opacity-0 translate-y-1"
			enter-to-class="opacity-100 translate-y-0"
			leave-active-class="transition ease-in duration-75"
			leave-from-class="opacity-100 translate-y-0"
			leave-to-class="opacity-0 translate-y-1"
		>
			<ul
				v-if="isOpen && suggestions.length > 0"
				class="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
				role="listbox"
			>
				<li
					v-for="(item, index) in suggestions"
					:key="index"
					role="option"
					:aria-selected="index === highlightedIndex"
					:class="[
						'flex items-start gap-3 px-4 py-3 cursor-pointer text-sm border-b border-gray-100 last:border-b-0 transition-colors',
						index === highlightedIndex
							? 'bg-blue-50'
							: 'hover:bg-gray-50',
					]"
					@mousedown.prevent="selectSuggestion(item)"
					@mousemove="highlightedIndex = index"
				>
					<!-- pin icon -->
					<svg
						class="mt-0.5 h-4 w-4 shrink-0 text-[#0D65AE]"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
						/>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
						/>
					</svg>

					<div class="min-w-0">
						<!-- Primary: street number + street name -->
						<p class="font-semibold text-gray-900 truncate">
							{{ primaryLabel(item) }}
						</p>
						<!-- Secondary: city, state, country -->
						<p class="text-xs text-gray-500 truncate mt-0.5">
							{{ secondaryLabel(item) }}
						</p>
					</div>
				</li>
			</ul>

			<!-- No-results message -->
			<div
				v-else-if="isOpen && noResults"
				class="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg px-4 py-3 text-sm text-gray-500"
			>
				No addresses found for "{{ lastQuery }}"
			</div>
		</Transition>
	</div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import axios from "axios";

// ── Props ──────────────────────────────────────────────────────────────────

const props = defineProps({
	/** Bound address string (v-model) */
	modelValue: { type: String, default: "" },
	placeholder: { type: String, default: "Search address…" },
	disabled: { type: Boolean, default: false },
	required: { type: Boolean, default: false },
	/** Optional "near" hint passed to Radar to bias results, "lat,lng" */
	near: { type: String, default: null },
	/** Max suggestions to show (1-10) */
	limit: { type: Number, default: 5 },
});

// ── Emits ──────────────────────────────────────────────────────────────────

const emit = defineEmits([
	/**
	 * Standard v-model emit — fires with the address string on every
	 * keystroke so the parent formData stays in sync.
	 */
	"update:modelValue",
	/**
	 * Fired only when the user explicitly picks a suggestion.
	 * Payload: full Radar address object
	 * {
	 *   formattedAddress, latitude, longitude,
	 *   street, number, city, state, stateCode,
	 *   country, countryCode, postalCode, …
	 * }
	 */
	"select",
]);

// ── Internal state ─────────────────────────────────────────────────────────

const wrapperRef = ref(null);
const inputRef = ref(null);

const inputValue = ref(props.modelValue ?? "");
const suggestions = ref([]);
const loading = ref(false);
const isOpen = ref(false);
const noResults = ref(false);
const lastQuery = ref("");
const highlightedIndex = ref(-1);

// ── Sync external modelValue → inputValue (e.g., form resets) ─────────────

watch(
	() => props.modelValue,
	(val) => {
		if (val !== inputValue.value) {
			inputValue.value = val ?? "";
		}
	},
);

// ── Radar config ───────────────────────────────────────────────────────────

const RADAR_KEY = import.meta.env.VITE_RADAR_API_KEY;
const RADAR_AUTOCOMPLETE = "https://api.radar.io/v1/search/autocomplete";

// ── Debounce timer ─────────────────────────────────────────────────────────

let debounceTimer = null;

// ── API call ───────────────────────────────────────────────────────────────

const fetchSuggestions = async (query) => {
	if (!RADAR_KEY) {
		console.warn("[AddressAutocomplete] VITE_RADAR_API_KEY is not set.");
		return;
	}
	if (!query || query.trim().length < 3) {
		suggestions.value = [];
		isOpen.value = false;
		noResults.value = false;
		return;
	}

	loading.value = true;
	lastQuery.value = query.trim();

	try {
		const params = {
			query: query.trim(),
			limit: Math.min(Math.max(props.limit, 1), 10),
			layers: "address,place",
		};
		if (props.near) params.near = props.near;

		const { data } = await axios.get(RADAR_AUTOCOMPLETE, {
			params,
			headers: { Authorization: RADAR_KEY },
		});

		suggestions.value = data?.addresses ?? [];
		noResults.value = suggestions.value.length === 0;
		highlightedIndex.value = -1;
		isOpen.value = true;
	} catch (err) {
		console.error("[AddressAutocomplete] Radar API error:", err.message);
		suggestions.value = [];
		noResults.value = true;
		isOpen.value = true;
	} finally {
		loading.value = false;
	}
};

// ── Input handler (debounced) ──────────────────────────────────────────────

const onInput = (val) => {
	inputValue.value = val;
	emit("update:modelValue", val);
	noResults.value = false;

	clearTimeout(debounceTimer);
	if (val.trim().length < 3) {
		suggestions.value = [];
		isOpen.value = false;
		return;
	}
	debounceTimer = setTimeout(() => fetchSuggestions(val), 300);
};

// ── Focus: reopen suggestions if we already have some ─────────────────────

const onFocus = () => {
	if (suggestions.value.length > 0) {
		isOpen.value = true;
	}
};

// ── Keyboard navigation ────────────────────────────────────────────────────

const moveHighlight = (dir) => {
	if (!isOpen.value || suggestions.value.length === 0) return;
	const max = suggestions.value.length - 1;
	highlightedIndex.value = Math.max(
		0,
		Math.min(highlightedIndex.value + dir, max),
	);
};

const confirmHighlighted = () => {
	if (
		isOpen.value &&
		highlightedIndex.value >= 0 &&
		suggestions.value[highlightedIndex.value]
	) {
		selectSuggestion(suggestions.value[highlightedIndex.value]);
	}
};

// ── Selection ──────────────────────────────────────────────────────────────

const selectSuggestion = (address) => {
	const display = address.formattedAddress || address.addressLabel || "";
	inputValue.value = display;
	emit("update:modelValue", display);
	emit("select", address);
	close();
};

// ── Close dropdown ─────────────────────────────────────────────────────────

const close = () => {
	isOpen.value = false;
	highlightedIndex.value = -1;
};

// ── Outside-click listener ─────────────────────────────────────────────────

const onDocumentClick = (e) => {
	if (wrapperRef.value && !wrapperRef.value.contains(e.target)) {
		close();
	}
};

onMounted(() => document.addEventListener("mousedown", onDocumentClick));
onBeforeUnmount(() => {
	document.removeEventListener("mousedown", onDocumentClick);
	clearTimeout(debounceTimer);
});

// ── Label helpers ──────────────────────────────────────────────────────────

/**
 * The "headline" part shown in bold.
 * Prefers `placeLabel` (place name) or `addressLabel` (number + street).
 * Falls back to the full formattedAddress.
 */
const primaryLabel = (addr) => {
	return (
		addr.placeLabel ||
		addr.addressLabel ||
		[addr.number, addr.street].filter(Boolean).join(" ") ||
		addr.formattedAddress
	);
};

/**
 * The "subtitle" part: city, state, country.
 */
const secondaryLabel = (addr) => {
	const parts = [
		addr.city,
		addr.stateCode || addr.state,
		addr.postalCode,
		addr.countryCode || addr.country,
	].filter(Boolean);
	// If the primary is already the full address don't repeat it
	if (!addr.placeLabel && !addr.addressLabel) return "";
	return parts.join(", ");
};
</script>
