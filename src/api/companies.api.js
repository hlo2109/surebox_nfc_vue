import apiClient, { handleApiError } from './config';

/**
 * Companies API Module
 * Handles all company-related API calls
 */

/**
 * Get the current user's company
 * @returns {Promise<object>} Response with user's company data
 */
export const getMyCompany = async (companyId = null) => {
	try {
		// If companyId is provided, get that specific company
		// Otherwise, use the /companies/my endpoint
		const endpoint = companyId ? `/companies/${companyId}` : '/companies/my';
		const response = await apiClient.get(endpoint);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Get all companies (paginated)
 * @param {object} params - Query parameters
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Items per page (default: 10)
 * @returns {Promise<object>} Response with companies array and pagination
 */
export const getCompanies = async (params = {}) => {
	try {
		const response = await apiClient.get('/companies', { params });
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Get a specific company by ID
 * @param {number} companyId - Company ID
 * @returns {Promise<object>} Response with company data
 */
export const getCompany = async (companyId) => {
	try {
		const response = await apiClient.get(`/companies/${companyId}`);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Create a new company
 * @param {object} companyData - Company data
 * @param {string} companyData.name - Company name (required)
 * @param {string} companyData.email - Company email (required)
 * @param {string} companyData.phone - Company phone (required)
 * @param {string} companyData.address - Company address (optional)
 * @param {string} companyData.city - City (optional)
 * @param {string} companyData.country - Country (optional)
 * @returns {Promise<object>} Response with created company
 */
export const createCompany = async (companyData) => {
	try {
		const response = await apiClient.post('/companies', companyData);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Update an existing company
 * @param {number} companyId - Company ID
 * @param {object} companyData - Updated company data
 * @param {string} companyData.name - Company name (optional)
 * @param {string} companyData.email - Company email (optional)
 * @param {string} companyData.phone - Company phone (optional)
 * @param {string} companyData.address - Company address (optional)
 * @returns {Promise<object>} Response with updated company
 */
export const updateCompany = async (companyId, companyData) => {
	try {
		const response = await apiClient.put(`/companies/${companyId}`, companyData);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Delete a company (admin only)
 * @param {number} companyId - Company ID
 * @returns {Promise<object>} Response
 */
export const deleteCompany = async (companyId) => {
	try {
		const response = await apiClient.delete(`/companies/${companyId}`);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Get company members (paginated)
 * @param {number} companyId - Company ID
 * @param {object} params - Query parameters
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Items per page (default: 20)
 * @param {string} params.status - Filter by status: 'active' or 'inactive' (optional)
 * @returns {Promise<object>} Response with members array and pagination
 */
export const getCompanyMembers = async (companyId, params = {}) => {
	try {
		const response = await apiClient.get(`/companies/${companyId}/members`, { params });
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Add a member to a company
 * @param {number} companyId - Company ID
 * @param {object} memberData - Member data
 * @param {string} memberData.userId - User ID to add (required)
 * @param {string} memberData.role - Member role (optional)
 * @returns {Promise<object>} Response
 */
export const addCompanyMember = async (companyId, memberData) => {
	try {
		const response = await apiClient.post(`/companies/${companyId}/members`, memberData);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Update a company member
 * @param {number} companyId - Company ID
 * @param {number} userId - User ID
 * @param {object} memberData - Updated member data
 * @param {string} memberData.role - Member role (optional)
 * @returns {Promise<object>} Response
 */
export const updateCompanyMember = async (companyId, userId, memberData) => {
	try {
		const response = await apiClient.put(`/companies/${companyId}/members/${userId}`, memberData);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Remove a member from a company
 * @param {number} companyId - Company ID
 * @param {number} userId - User ID
 * @returns {Promise<object>} Response
 */
export const removeCompanyMember = async (companyId, userId) => {
	try {
		const response = await apiClient.delete(`/companies/${companyId}/members/${userId}`);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Get company locations
 * @param {number} companyId - Company ID
 * @returns {Promise<object>} Response with locations array
 */
export const getCompanyLocations = async (companyId) => {
	try {
		const response = await apiClient.get(`/companies/${companyId}/locations`);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Update a company location
 * @param {number} companyId - Company ID
 * @param {number} locationId - Location ID
 * @param {object} locationData - Updated location data
 * @param {string} locationData.name - Location name (optional)
 * @param {string} locationData.address - Address (optional)
 * @param {number} locationData.cityId - City ID from cities table (optional)
 * @param {string} locationData.phone - Phone number (optional)
 * @param {number} locationData.lat - Latitude (optional)
 * @param {number} locationData.lng - Longitude (optional)
 * @returns {Promise<object>} Response with updated location
 */
export const updateCompanyLocation = async (companyId, locationId, locationData) => {
	try {
		const response = await apiClient.put(`/companies/${companyId}/locations/${locationId}`, locationData);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Add a location to a company
 * @param {number} companyId - Company ID
 * @param {object} locationData - Location data
 * @param {string} locationData.name - Location name (required)
 * @param {string} locationData.address - Address (required)
 * @param {number} locationData.cityId - City ID from cities table (optional)
 * @param {string} locationData.phone - Phone number (optional)
 * @param {number} locationData.lat - Latitude (optional)
 * @param {number} locationData.lng - Longitude (optional)
 * @returns {Promise<object>} Response with created location
 */
export const addCompanyLocation = async (companyId, locationData) => {
	try {
		const response = await apiClient.post(`/companies/${companyId}/locations`, locationData);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Delete a company location
 * @param {number} companyId - Company ID
 * @param {number} locationId - Location ID
 * @returns {Promise<object>} Response
 */
export const deleteCompanyLocation = async (companyId, locationId) => {
	try {
		const response = await apiClient.delete(`/companies/${companyId}/locations/${locationId}`);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Get company categories
 * @param {number} companyId - Company ID
 * @returns {Promise<object>} Response with categories array
 */
export const getCompanyCategories = async (companyId) => {
	try {
		const response = await apiClient.get(`/companies/${companyId}/categories`);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Get a specific company category
 * @param {number} companyId - Company ID
 * @param {number} categoryId - Category ID
 * @returns {Promise<object>} Response with category data
 */
export const getCompanyCategory = async (companyId, categoryId) => {
	try {
		const response = await apiClient.get(`/companies/${companyId}/categories/${categoryId}`);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Create a category in a company
 * @param {number} companyId - Company ID
 * @param {object} categoryData - Category data
 * @param {string} categoryData.name - Category name (required)
 * @param {string} categoryData.description - Category description (optional)
 * @returns {Promise<object>} Response with created category
 */
export const createCompanyCategory = async (companyId, categoryData) => {
	try {
		const response = await apiClient.post(`/companies/${companyId}/categories`, categoryData);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Update a company category
 * @param {number} companyId - Company ID
 * @param {number} categoryId - Category ID
 * @param {object} categoryData - Updated category data
 * @param {string} categoryData.name - Category name (required)
 * @param {string} categoryData.description - Category description (optional)
 * @returns {Promise<object>} Response with updated category
 */
export const updateCompanyCategory = async (companyId, categoryId, categoryData) => {
	try {
		const response = await apiClient.put(`/companies/${companyId}/categories/${categoryId}`, categoryData);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Delete a company category
 * @param {number} companyId - Company ID
 * @param {number} categoryId - Category ID
 * @returns {Promise<object>} Response
 */
export const deleteCompanyCategory = async (companyId, categoryId) => {
	try {
		const response = await apiClient.delete(`/companies/${companyId}/categories/${categoryId}`);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

export default {
	getMyCompany,
	getCompanies,
	getCompany,
	createCompany,
	updateCompany,
	deleteCompany,
	getCompanyMembers,
	addCompanyMember,
	updateCompanyMember,
	removeCompanyMember,
	getCompanyLocations,
	addCompanyLocation,
	updateCompanyLocation,
	deleteCompanyLocation,
	getCompanyCategories,
	getCompanyCategory,
	createCompanyCategory,
	updateCompanyCategory,
	deleteCompanyCategory,
};
