import { reactive, computed } from 'vue';

/**
 * NFC Store
 * Manages NFC tags state using Vue 3 Composition API
 */

// Reactive state
const state = reactive({
	nfcTags: [],
	currentNfc: null,
	isLoading: false,
	error: null,
});

// Computed properties
const nfcTagsCount = computed(() => state.nfcTags.length);

const activeNfcTags = computed(() =>
	state.nfcTags.filter(nfc => nfc.status === 'active')
);

const inactiveNfcTags = computed(() =>
	state.nfcTags.filter(nfc => nfc.status === 'inactive')
);

const hasNfcTags = computed(() => state.nfcTags.length > 0);

// Actions
const setNfcTags = (tags) => {
	// Deduplicate by the best available identifier (uuid → id → code).
	const seen = new Set();
	state.nfcTags = tags.filter(tag => {
		const key = String(tag.uuid ?? tag.id ?? tag.code);
		if (seen.has(key)) return false;
		seen.add(key);
		return true;
	});
};

const addNfcTag = (tag) => {
	// Avoid pushing a record that is already in the list (e.g. when the API
	// returns the same item for a duplicate submit due to a uniqueness constraint).
	const tagKey = String(tag.uuid ?? tag.id ?? tag.code);
	const exists = state.nfcTags.some(t => String(t.uuid ?? t.id ?? t.code) === tagKey);
	if (!exists) {
		state.nfcTags.push(tag);
	}
};

const updateNfcTag = (updatedTag) => {
	const updatedKey = String(updatedTag.uuid ?? updatedTag.id ?? updatedTag.code);
	const index = state.nfcTags.findIndex(tag => String(tag.uuid ?? tag.id ?? tag.code) === updatedKey);
	if (index !== -1) {
		state.nfcTags[index] = updatedTag;
	}
	if (String(state.currentNfc?.uuid ?? state.currentNfc?.id ?? state.currentNfc?.code) === updatedKey) {
		state.currentNfc = updatedTag;
	}
};

const removeNfcTag = (tagId) => {
	// Accepts uuid, numeric id, or code — whichever the caller provides.
	state.nfcTags = state.nfcTags.filter(
		tag => String(tag.uuid ?? tag.id ?? tag.code) !== String(tagId)
	);
	if (String(state.currentNfc?.uuid ?? state.currentNfc?.id ?? state.currentNfc?.code) === String(tagId)) {
		state.currentNfc = null;
	}
};

const setCurrentNfc = (nfc) => {
	state.currentNfc = nfc;
};

const clearCurrentNfc = () => {
	state.currentNfc = null;
};

const setLoading = (loading) => {
	state.isLoading = loading;
};

const setError = (error) => {
	state.error = error;
};

const clearError = () => {
	state.error = null;
};

const getNfcById = (id) => {
	const sid = String(id);
	return state.nfcTags.find(
		tag => String(tag.uuid ?? tag.id ?? tag.code) === sid,
	);
};

const getNfcByCode = (code) => {
	return state.nfcTags.find(tag => tag.code === code);
};

const reset = () => {
	state.nfcTags = [];
	state.currentNfc = null;
	state.isLoading = false;
	state.error = null;
};

// Export store
export const useNfcStore = () => {
	return {
		// State
		state,

		// Computed
		nfcTagsCount,
		activeNfcTags,
		inactiveNfcTags,
		hasNfcTags,

		// Actions
		setNfcTags,
		addNfcTag,
		updateNfcTag,
		removeNfcTag,
		setCurrentNfc,
		clearCurrentNfc,
		setLoading,
		setError,
		clearError,
		getNfcById,
		getNfcByCode,
		reset,
	};
};

export default useNfcStore;
