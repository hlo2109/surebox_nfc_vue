import apiClient, { handleApiError } from './config';
import { ApiNfc } from '@/constants/apiRoutes';

/**
 * NFC API module — tags for users / locations (SureBox field operations).
 *
 *   GET    ApiNfc.LIST              — tags del usuario autenticado
 *   GET    ApiNfc.BY_ID(id)         — detalle
 *   POST   ApiNfc.LIST              — alta
 *   PUT    ApiNfc.BY_ID(id)         — actualización
 *   DELETE ApiNfc.BY_ID(id)         — baja
 */

/**
 * Get all NFC tags for the authenticated user
 * @returns {Promise<object>} Response with array of NFC tags
 */
export const getMyNfcTags = async () => {
	try {
		const response = await apiClient.get(ApiNfc.LIST);
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
		const response = await apiClient.get(ApiNfc.BY_ID(nfcId));
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
 * @param {string} [nfcData.photo] - First photo URL (optional; legacy)
 * @param {string[]} [nfcData.photos] - Gallery image URLs (optional)
 * @param {string} [nfcData.description] - Free-text description (optional)
 * @param {number} [nfcData.userId] - Target user ID (optional, admin only)
 * @returns {Promise<object>} Response with created NFC tag
 */
export const createNfcTag = async (nfcData) => {
	try {
		const response = await apiClient.post(ApiNfc.LIST, nfcData);
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
 * @param {string} [nfcData.photo] - Primary photo URL (optional)
 * @param {string[]} [nfcData.photos] - Gallery URLs (optional)
 * @param {string} [nfcData.description] - Description (optional)
 * @param {string} [nfcData.status] - Status: 'active' or 'inactive' (optional)
 * @returns {Promise<object>} Response with updated NFC tag
 */
export const updateNfcTag = async (nfcId, nfcData) => {
	try {
		const response = await apiClient.put(ApiNfc.BY_ID(nfcId), nfcData);
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
		const response = await apiClient.delete(ApiNfc.BY_ID(nfcId));
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
