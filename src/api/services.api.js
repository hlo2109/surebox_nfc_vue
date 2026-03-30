import apiClient, { handleApiError } from './config';

/**
 * Services API Module
 * Handles all service-related API calls including services, categories, and company services
 */

// ==================== SERVICE CATEGORIES ====================

/**
 * Get all service categories
 * @param {object} params - Query parameters
 * @param {number} params.page - Page number (optional)
 * @param {number} params.limit - Items per page (optional)
 * @param {string} params.search - Search query (optional)
 * @returns {Promise<object>} Response with categories array
 */
export const getServiceCategories = async (params = {}) => {
	try {
		const response = await apiClient.get('/services/categories', { params });
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Get a specific service category by ID
 * @param {number} categoryId - Category ID
 * @returns {Promise<object>} Response with category data
 */
export const getServiceCategory = async (categoryId) => {
	try {
		const response = await apiClient.get(`/services/categories/${categoryId}`);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Create a new service category (admin only)
 * @param {object} categoryData - Category data
 * @param {string} categoryData.name - Category name (required)
 * @param {string} categoryData.description - Category description (optional)
 * @param {string} categoryData.icon - Category icon (optional)
 * @returns {Promise<object>} Response with created category
 */
export const createServiceCategory = async (categoryData) => {
	try {
		const response = await apiClient.post('/services/categories', categoryData);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Update a service category (admin only)
 * @param {number} categoryId - Category ID
 * @param {object} categoryData - Updated category data
 * @returns {Promise<object>} Response with updated category
 */
export const updateServiceCategory = async (categoryId, categoryData) => {
	try {
		const response = await apiClient.put(`/services/categories/${categoryId}`, categoryData);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Delete a service category (admin only)
 * @param {number} categoryId - Category ID
 * @returns {Promise<object>} Response
 */
export const deleteServiceCategory = async (categoryId) => {
	try {
		const response = await apiClient.delete(`/services/categories/${categoryId}`);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

// ==================== COMPANY SERVICES ====================

/**
 * Get all services for a specific company
 * @param {number} companyId - Company ID
 * @param {object} params - Query parameters
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Items per page (default: 10)
 * @param {string} params.search - Search query (optional)
 * @param {number} params.categoryId - Filter by category ID (optional)
 * @param {string} params.status - Filter by status (optional)
 * @returns {Promise<object>} Response with services array and pagination
 */
export const getCompanyServices = async (companyId, params = {}) => {
	try {
		const response = await apiClient.get(`/services/companies/${companyId}/services`, { params });
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Create a new service for a company
 * @param {number} companyId - Company ID
 * @param {object} serviceData - Service data
 * @param {string} serviceData.name - Service name (required)
 * @param {number} serviceData.categoryId - Category ID (required)
 * @param {string} serviceData.description - Service description (optional)
 * @param {number} serviceData.price - Service price (required)
 * @param {number} serviceData.duration - Service duration in minutes (optional)
 * @param {string} serviceData.status - Service status: 'active', 'inactive', 'draft' (optional)
 * @returns {Promise<object>} Response with created service
 */
export const createCompanyService = async (companyId, serviceData) => {
	try {
		const response = await apiClient.post(`/services/companies/${companyId}/services`, serviceData);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Get a specific company service
 * @param {number} companyId - Company ID
 * @param {number} serviceId - Service ID
 * @returns {Promise<object>} Response with service data
 */
export const getCompanyService = async (companyId, serviceId) => {
	try {
		const response = await apiClient.get(`/services/companies/${companyId}/services/${serviceId}`);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Update a company service
 * @param {number} companyId - Company ID
 * @param {number} serviceId - Service ID
 * @param {object} serviceData - Updated service data
 * @returns {Promise<object>} Response with updated service
 */
export const updateCompanyService = async (companyId, serviceId, serviceData) => {
	try {
		const response = await apiClient.put(`/services/companies/${companyId}/services/${serviceId}`, serviceData);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Delete a company service
 * @param {number} companyId - Company ID
 * @param {number} serviceId - Service ID
 * @returns {Promise<object>} Response
 */
export const deleteCompanyService = async (companyId, serviceId) => {
	try {
		const response = await apiClient.delete(`/services/companies/${companyId}/services/${serviceId}`);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

// ==================== GENERAL SERVICES ====================

/**
 * Get all services (public/admin view)
 * @param {object} params - Query parameters
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Items per page (default: 10)
 * @param {string} params.search - Search query (optional)
 * @param {number} params.categoryId - Filter by category ID (optional)
 * @param {number} params.companyId - Filter by company ID (optional)
 * @returns {Promise<object>} Response with services array and pagination
 */
export const getServices = async (params = {}) => {
	try {
		const response = await apiClient.get('/services', { params });
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Get a specific service by ID
 * @param {number} serviceId - Service ID
 * @returns {Promise<object>} Response with service data
 */
export const getService = async (serviceId) => {
	try {
		const response = await apiClient.get(`/services/${serviceId}`);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Update an existing service (generic endpoint)
 * @param {number} serviceId - Service ID
 * @param {object} serviceData - Updated service data
 * @param {string} serviceData.name - Service name (optional)
 * @param {string} serviceData.description - Service description (optional)
 * @param {number} serviceData.price - Service price (optional)
 * @param {number} serviceData.duration - Service duration in minutes (optional)
 * @param {string} serviceData.status - Service status (optional)
 * @returns {Promise<object>} Response with updated service
 */
export const updateService = async (serviceId, serviceData) => {
	try {
		const response = await apiClient.put(`/services/${serviceId}`, serviceData);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Delete a service (generic endpoint)
 * @param {number} serviceId - Service ID
 * @returns {Promise<object>} Response
 */
export const deleteService = async (serviceId) => {
	try {
		const response = await apiClient.delete(`/services/${serviceId}`);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

// ==================== SERVICE STATISTICS ====================

/**
 * Get service statistics for a company
 * @param {number} companyId - Company ID
 * @returns {Promise<object>} Response with statistics
 */
export const getCompanyServiceStats = async (companyId) => {
	try {
		const response = await apiClient.get(`/services/companies/${companyId}/stats`);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Get popular services
 * @param {object} params - Query parameters
 * @param {number} params.limit - Number of services to return
 * @param {number} params.companyId - Filter by company ID (optional)
 * @returns {Promise<object>} Response with popular services
 */
export const getPopularServices = async (params = {}) => {
	try {
		const response = await apiClient.get('/services/popular', { params });
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

export default {
	// Categories
	getServiceCategories,
	getServiceCategory,
	createServiceCategory,
	updateServiceCategory,
	deleteServiceCategory,

	// Company Services
	getCompanyServices,
	createCompanyService,
	getCompanyService,
	updateCompanyService,
	deleteCompanyService,
	getCompanyServiceStats,

	// General Services
	getServices,
	getService,
	updateService,
	deleteService,
	getPopularServices,
};
