import apiClient, { handleApiError } from './config';

/**
 * Location API Module
 * Handles the geographic hierarchy: Country → Department → City
 *
 * Endpoints used:
 *   GET /countries
 *   GET /departments?countryId=:id
 *   GET /cities?departmentId=:id
 *
 * DB columns reference:
 *   countries   → id, name, code, isActive, createdAt, updatedAt
 *   departments → id, name, code, countryId, isActive, createdAt, updatedAt
 *   cities      → id, name, code, countryId, departmentId, isActive, createdAt, updatedAt
 */

/**
 * Get all active countries
 * @returns {Promise<object>} Response with countries array
 */
export const getCountries = async () => {
	try {
		const response = await apiClient.get('/countries');
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Get departments belonging to a specific country
 * @param {number} countryId - Country ID (e.g. 44)
 * @returns {Promise<object>} Response with departments array
 */
export const getDepartments = async (countryId) => {
	try {
		const response = await apiClient.get('/departments', {
			params: { countryId },
		});
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Get cities belonging to a specific department
 * @param {number} departmentId - Department ID (e.g. 699)
 * @returns {Promise<object>} Response with cities array
 */
export const getCities = async (departmentId) => {
	try {
		const response = await apiClient.get('/cities', {
			params: { departmentId },
		});
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

export default {
	getCountries,
	getDepartments,
	getCities,
};
