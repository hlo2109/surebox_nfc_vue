import apiClient, { handleApiError } from './config';

/**
 * NFC API Module
 * Handles all NFC-related API calls
 */

/**
 * Get all NFC tags for the authenticated user
 * @returns {Promise<object>} Response with array of NFC tags
 */
export const getMyNfcTags = async () => {
	try {
		const response = await apiClient.get('/nfc');
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Get a specific NFC tag by ID
 * @param {number} nfcId - NFC tag ID
 * @returns {Promise<object>} Response with NFC tag data
 */
export const getNfcTag = async (nfcId) => {
	try {
		const response = await apiClient.get(`/nfc/${nfcId}`);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Register a new NFC tag
 * @param {object} nfcData - NFC tag data
 * @param {string} nfcData.code - NFC code (required)
 * @param {string} nfcData.nickname - Nickname for the tag (optional)
 * @param {string} nfcData.address - Address (optional)
 * @param {number} nfcData.lat - Latitude (optional)
 * @param {number} nfcData.lng - Longitude (optional)
 * @param {string} nfcData.photo - Photo URL (optional)
 * @param {number} nfcData.userId - Target user ID (optional, admin only)
 * @returns {Promise<object>} Response with created NFC tag
 */
export const createNfcTag = async (nfcData) => {
	try {
		const response = await apiClient.post('/nfc', nfcData);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Update an existing NFC tag
 * @param {number} nfcId - NFC tag ID
 * @param {object} nfcData - Updated NFC tag data
 * @param {string} nfcData.nickname - Nickname (optional)
 * @param {string} nfcData.address - Address (optional)
 * @param {number} nfcData.lat - Latitude (optional)
 * @param {number} nfcData.lng - Longitude (optional)
 * @param {string} nfcData.photo - Photo URL (optional)
 * @param {string} nfcData.status - Status: 'active' or 'inactive' (optional)
 * @returns {Promise<object>} Response with updated NFC tag
 */
export const updateNfcTag = async (nfcId, nfcData) => {
	try {
		const response = await apiClient.put(`/nfc/${nfcId}`, nfcData);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Delete/remove an NFC tag
 * @param {number} nfcId - NFC tag ID
 * @returns {Promise<object>} Response
 */
export const deleteNfcTag = async (nfcId) => {
	try {
		const response = await apiClient.delete(`/nfc/${nfcId}`);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

export default {
	getMyNfcTags,
	getNfcTag,
	createNfcTag,
	updateNfcTag,
	deleteNfcTag,
};
