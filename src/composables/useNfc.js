import { computed } from 'vue';
import { useNfcStore } from '@/stores/nfc.store';
import * as nfcApi from '@/api/nfc.api';
import { useToast } from './useToast';

/**
 * NFC Composable
 * Handles all NFC-related operations
 */
export const useNfc = () => {
	const nfcStore = useNfcStore();
	const toast = useToast();

	/**
	 * Fetch all NFC tags for the current user
	 * @returns {Promise<object>} Result with NFC tags
	 */
	const fetchMyNfcTags = async () => {
		try {
			nfcStore.setLoading(true);
			nfcStore.clearError();

			const response = await nfcApi.getMyNfcTags();

			if (response.success !== false) {
				// API returns array directly or in data property
				const tags = Array.isArray(response) ? response : response.data || [];
				nfcStore.setNfcTags(tags);
				return { success: true, data: tags };
			} else {
				throw new Error(response.message || 'Failed to fetch NFC tags');
			}
		} catch (error) {
			const errorMessage = error.message || 'Failed to fetch NFC tags.';
			nfcStore.setError(errorMessage);
			toast.showError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			nfcStore.setLoading(false);
		}
	};

	/**
	 * Get a specific NFC tag by ID
	 * @param {number} nfcId - NFC tag ID
	 * @returns {Promise<object>} Result with NFC tag data
	 */
	const fetchNfcTag = async (nfcId) => {
		try {
			nfcStore.setLoading(true);
			nfcStore.clearError();

			const response = await nfcApi.getNfcTag(nfcId);

			if (response.success !== false) {
				const nfcTag = response.data || response;
				nfcStore.setCurrentNfc(nfcTag);
				return { success: true, data: nfcTag };
			} else {
				throw new Error(response.message || 'Failed to fetch NFC tag');
			}
		} catch (error) {
			const errorMessage = error.message || 'Failed to fetch NFC tag.';
			nfcStore.setError(errorMessage);
			toast.showError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			nfcStore.setLoading(false);
		}
	};

	/**
	 * Create/Register a new NFC tag
	 * @param {object} nfcData - NFC tag data
	 * @param {string} nfcData.code - NFC code (required)
	 * @param {string} nfcData.nickname - Nickname (optional)
	 * @param {string} nfcData.address - Address (optional)
	 * @param {number} nfcData.lat - Latitude (optional)
	 * @param {number} nfcData.lng - Longitude (optional)
	 * @param {string} nfcData.photo - Photo URL (optional)
	 * @returns {Promise<object>} Result with created NFC tag
	 */
	const createNfcTag = async (nfcData) => {
		try {
			nfcStore.setLoading(true);
			nfcStore.clearError();

			const response = await nfcApi.createNfcTag(nfcData);

			if (response.success !== false) {
				const newTag = response.data || response;
				nfcStore.addNfcTag(newTag);
				toast.showSuccess('NFC tag registered successfully!');
				return { success: true, data: newTag };
			} else {
				throw new Error(response.message || 'Failed to create NFC tag');
			}
		} catch (error) {
			const errorMessage = error.message || 'Failed to register NFC tag.';
			nfcStore.setError(errorMessage);
			toast.showError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			nfcStore.setLoading(false);
		}
	};

	/**
	 * Update an existing NFC tag
	 * @param {number} nfcId - NFC tag ID
	 * @param {object} nfcData - Updated NFC data
	 * @returns {Promise<object>} Result with updated NFC tag
	 */
	const updateNfcTag = async (nfcId, nfcData) => {
		try {
			nfcStore.setLoading(true);
			nfcStore.clearError();

			const response = await nfcApi.updateNfcTag(nfcId, nfcData);

			if (response.success !== false) {
				const updatedTag = response.data || response;
				nfcStore.updateNfcTag(updatedTag);
				toast.showSuccess('NFC tag updated successfully!');
				return { success: true, data: updatedTag };
			} else {
				throw new Error(response.message || 'Failed to update NFC tag');
			}
		} catch (error) {
			const errorMessage = error.message || 'Failed to update NFC tag.';
			nfcStore.setError(errorMessage);
			toast.showError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			nfcStore.setLoading(false);
		}
	};

	/**
	 * Delete/Remove an NFC tag
	 * @param {number} nfcId - NFC tag ID
	 * @returns {Promise<object>} Result
	 */
	const deleteNfcTag = async (nfcId) => {
		try {
			nfcStore.setLoading(true);
			nfcStore.clearError();

			// DEBUG — remove once the correct identifier is confirmed
			console.log('[useNfc.deleteNfcTag] calling DELETE /nfc/' + nfcId, '(type: ' + typeof nfcId + ')');

			const response = await nfcApi.deleteNfcTag(nfcId);

			// DEBUG — log raw server response
			console.log('[useNfc.deleteNfcTag] raw API response:', JSON.stringify(response, null, 2));

			if (response.success !== false) {
				nfcStore.removeNfcTag(nfcId);
				return { success: true };
			} else {
				throw new Error(response.message || 'Failed to delete NFC tag');
			}
		} catch (error) {
			// DEBUG — log full error so we can see the server's response body
			console.error('[useNfc.deleteNfcTag] error:', error?.message);
			console.error('[useNfc.deleteNfcTag] server response body:', JSON.stringify(error?.response?.data ?? null, null, 2));
			const errorMessage = error.message || 'Failed to remove NFC tag.';
			nfcStore.setError(errorMessage);
			toast.showError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			nfcStore.setLoading(false);
		}
	};

	/**
	 * Toggle NFC tag status (active/inactive)
	 * @param {number} nfcId - NFC tag ID
	 * @param {string} currentStatus - Current status
	 * @returns {Promise<object>} Result
	 */
	const toggleNfcStatus = async (nfcId, currentStatus) => {
		const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
		return await updateNfcTag(nfcId, { status: newStatus });
	};

	/**
	 * Get NFC tag by ID from store
	 * @param {number} id - NFC tag ID
	 * @returns {object|null} NFC tag or null
	 */
	const getNfcById = (id) => {
		return nfcStore.getNfcById(id);
	};

	/**
	 * Get NFC tag by code from store
	 * @param {string} code - NFC code
	 * @returns {object|null} NFC tag or null
	 */
	const getNfcByCode = (code) => {
		return nfcStore.getNfcByCode(code);
	};

	/**
	 * Set current NFC tag
	 * @param {object} nfc - NFC tag object
	 */
	const setCurrentNfc = (nfc) => {
		nfcStore.setCurrentNfc(nfc);
	};

	/**
	 * Clear current NFC tag
	 */
	const clearCurrentNfc = () => {
		nfcStore.clearCurrentNfc();
	};

	return {
		// State
		state: nfcStore.state,
		nfcTagsCount: nfcStore.nfcTagsCount,
		activeNfcTags: nfcStore.activeNfcTags,
		inactiveNfcTags: nfcStore.inactiveNfcTags,
		hasNfcTags: nfcStore.hasNfcTags,

		// Actions
		fetchMyNfcTags,
		fetchNfcTag,
		createNfcTag,
		updateNfcTag,
		deleteNfcTag,
		toggleNfcStatus,
		getNfcById,
		getNfcByCode,
		setCurrentNfc,
		clearCurrentNfc,

		// ========================================
		// BACKWARD COMPATIBILITY ALIASES
		// TODO: Remove these after updating views
		// ========================================
		fetchNfcCodes: fetchMyNfcTags,
		fetchNfcCode: fetchNfcTag,
		createNfcCode: createNfcTag,
		updateNfcCode: updateNfcTag,
		deleteNfcCode: deleteNfcTag,

		// Legacy state access — must be computed refs so that replacing
		// state.nfcTags (setNfcTags) or state.isLoading still triggers
		// reactivity in every component that destructures these.
		nfcCodes: computed(() => nfcStore.state.nfcTags),
		loading: computed(() => nfcStore.state.isLoading),
	};
};

export default useNfc;
