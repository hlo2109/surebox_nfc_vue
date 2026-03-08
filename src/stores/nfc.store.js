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
	state.nfcTags = tags;
};

const addNfcTag = (tag) => {
	state.nfcTags.push(tag);
};

const updateNfcTag = (updatedTag) => {
	const index = state.nfcTags.findIndex(tag => tag.id === updatedTag.id);
	if (index !== -1) {
		state.nfcTags[index] = updatedTag;
	}
	// Update current NFC if it's the same one
	if (state.currentNfc?.id === updatedTag.id) {
		state.currentNfc = updatedTag;
	}
};

const removeNfcTag = (tagId) => {
	state.nfcTags = state.nfcTags.filter(tag => tag.id !== tagId);
	// Clear current NFC if it's the same one
	if (state.currentNfc?.id === tagId) {
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
	return state.nfcTags.find(tag => tag.id === id);
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
