import axios from 'axios';

/**
 * Radar API Module
 * Handles address autocomplete using the Radar Search API.
 *
 * Endpoint: GET https://api.radar.io/v1/search/autocomplete
 * Auth level: Publishable (safe to use client-side)
 * Docs: https://docs.radar.com/api#tag/Search/operation/autocomplete
 *
 * Response address fields used:
 *   formattedAddress  – full human-readable address
 *   addressLabel      – street number + street name (first line)
 *   latitude / longitude
 *   street, number, city, state, stateCode, country, countryCode, postalCode
 */

const RADAR_BASE_URL = 'https://api.radar.io/v1';
const RADAR_API_KEY = import.meta.env.VITE_RADAR_API_KEY;

/** Shared axios instance pre-configured for Radar */
const radarClient = axios.create({
	baseURL: RADAR_BASE_URL,
	timeout: 8000,
	headers: {
		Authorization: RADAR_API_KEY,
	},
});

/**
 * Autocomplete a partial address or place name.
 *
 * @param {string} query            – Partial address the user has typed
 * @param {object} [options]
 * @param {number} [options.limit]  – Max results (1-100). Defaults to 6.
 * @param {string} [options.layers] – Comma-separated layer filters.
 *                                    Defaults to 'address' for precise results.
 *                                    Use 'address,place' to also include POIs.
 * @param {string} [options.near]   – 'lat,lng' to bias results by proximity.
 * @param {string} [options.countryCode] – 2-letter ISO country code to restrict
 *                                         results (e.g. 'CO', 'US').
 * @returns {Promise<Array>} Array of address objects (empty on error / short query)
 */
export const autocompleteAddress = async (query, options = {}) => {
	if (!RADAR_API_KEY) {
		console.warn('[Radar] VITE_RADAR_API_KEY is not set. Address autocomplete is disabled.');
		return [];
	}

	const trimmed = query?.trim() ?? '';
	if (trimmed.length < 3) return [];

	try {
		const params = {
			query: trimmed,
			limit: options.limit ?? 6,
			layers: options.layers ?? 'address',
		};

		if (options.near) params.near = options.near;
		if (options.countryCode) params.countryCode = options.countryCode;

		const response = await radarClient.get('/search/autocomplete', { params });
		return response.data?.addresses ?? [];
	} catch (error) {
		if (import.meta.env.DEV) {
			console.error('[Radar] Autocomplete request failed:', {
				query: trimmed,
				status: error.response?.status,
				message: error.message,
			});
		}
		return [];
	}
};

export default {
	autocompleteAddress,
};
