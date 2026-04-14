import apiClient, { handleApiError } from './config';

/**
 * Services API Module
 * Handles all service-related API calls including services, categories, and company services.
 *
 * Route map (from API spec v2.0.0):
 *
 *   Public catalogue (any authenticated user):
 *   GET    /services                                                   – browse all services (paginated, filterable)
 *   GET    /services/categories                                        – list global + company categories
 *   POST   /services/categories                                        – create global category (manage_services)
 *   GET    /services/{serviceId}                                       – get service details
 *   PUT    /services/{serviceId}                                       – update service (company member or manage_services)
 *   DELETE /services/{serviceId}                                       – delete service (manage_services or company member)
 *
 *   Admin – scoped to a specific company:
 *   GET    /admin/companies/{companyId}/services                       – list company services
 *   POST   /admin/companies/{companyId}/services                       – create company service
 *   GET    /admin/companies/{companyId}/categories                     – list company categories
 *   POST   /admin/companies/{companyId}/categories                     – create company category
 *   GET    /admin/companies/{companyId}/categories/{categoryId}        – get company category
 *   PUT    /admin/companies/{companyId}/categories/{categoryId}        – update company category
 *   DELETE /admin/companies/{companyId}/categories/{categoryId}        – delete company category
 *
 *   My Company – resolved from JWT:
 *   GET    /my/company/services                                        – list own company services
 *   POST   /my/company/services                                        – create service for own company
 *   PUT    /my/company/services/{serviceId}                            – update service in own company
 *   DELETE /my/company/services/{serviceId}                            – delete service from own company
 *   GET    /my/company/categories                                      – list own company categories
 *   POST   /my/company/categories                                      – create own company category
 *   GET    /my/company/categories/{categoryId}                         – get own company category
 *   PUT    /my/company/categories/{categoryId}                         – update own company category
 *   DELETE /my/company/categories/{categoryId}                         – delete own company category
 */

// ==================== PUBLIC CATALOGUE ====================

/**
 * Browse all services across all companies (customer-facing catalogue).
 * Any authenticated user can call this endpoint.
 * @param {object} [params] - Query parameters
 * @param {number} [params.page] - Page number (default 1)
 * @param {number} [params.limit] - Items per page (default 20)
 * @param {string} [params.companyId] - Filter by company UUID
 * @param {number} [params.categoryId] - Filter by service category ID
 * @param {string} [params.search] - Search by service name
 * @param {string} [params.priceType] - 'fixed' | 'hourly' | 'per_unit'
 * @param {number} [params.cityId] - Filter by city ID
 * @returns {Promise<object>} Paginated response with services array
 */
export const browseServices = async (params = {}) => {
	try {
		const response = await apiClient.get('/services', { params });
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

// ==================== GLOBAL SERVICE CATEGORIES ====================

/**
 * List service categories.
 * Pass companyId to include company-specific categories; omit for global categories only.
 * @param {object} [params] - Query parameters
 * @param {number} [params.companyId] - Optional company ID to include company-specific categories
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
 * Create a new platform-wide (global) service category.
 * Not scoped to any company. Requires the `manage_services` permission.
 * To create a company-scoped category use createCompanyCategory() or createMyCompanyCategory().
 * @param {object} categoryData - Category data
 * @param {string} categoryData.name - Category name (required)
 * @param {string} [categoryData.description] - Category description
 * @param {string} [categoryData.icon] - Icon identifier (e.g. 'wrench')
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

// ==================== INDIVIDUAL SERVICES ====================

/**
 * Get full details for a single service by ID, regardless of which company it belongs to.
 * @param {number} serviceId - Service ID (integer)
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
 * Update a service.
 * The caller must be a member of the owning company or have `manage_services` permission.
 * @param {number} serviceId - Service ID (integer)
 * @param {object} serviceData - Updated service fields
 * @param {string} [serviceData.name]
 * @param {string} [serviceData.description]
 * @param {number} [serviceData.basePrice]
 * @param {string} [serviceData.priceType] - 'fixed' | 'hourly' | 'per_unit'
 * @param {number} [serviceData.categoryId]
 * @param {number} [serviceData.duration] - Duration in minutes
 * @returns {Promise<object>} Response
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
 * Permanently delete a service.
 * Requires `manage_services` permission or membership in the owning company.
 * @param {number} serviceId - Service ID (integer)
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

// ==================== ADMIN – COMPANY SERVICES ====================

/**
 * List all services for a specific company (admin).
 * @param {string} companyId - Company UUID
 * @param {object} [params] - Query parameters
 * @param {number} [params.page]
 * @param {number} [params.limit]
 * @param {number} [params.categoryId] - Filter by category
 * @param {string} [params.priceType] - 'fixed' | 'hourly' | 'per_unit'
 * @returns {Promise<object>} Paginated response with services array
 */
export const getCompanyServices = async (companyId, params = {}) => {
	try {
		const response = await apiClient.get(`/admin/companies/${companyId}/services`, { params });
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Create a new service for a specific company (admin).
 * @param {string} companyId - Company UUID
 * @param {object} serviceData - Service data
 * @param {string} serviceData.name - Service name (required)
 * @param {number} serviceData.categoryId - Category ID (required)
 * @param {number} serviceData.basePrice - Base price (required)
 * @param {string} serviceData.priceType - 'fixed' | 'hourly' | 'per_unit' (required)
 * @param {string} [serviceData.description]
 * @param {number} [serviceData.duration] - Estimated duration in minutes
 * @returns {Promise<object>} Response with created service
 */
export const createCompanyService = async (companyId, serviceData) => {
	try {
		const response = await apiClient.post(`/admin/companies/${companyId}/services`, serviceData);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

// ==================== ADMIN – COMPANY CATEGORIES ====================

/**
 * List all service categories for a specific company (admin).
 * @param {string} companyId - Company UUID
 * @returns {Promise<object>} Response with categories array
 */
export const getCompanyCategories = async (companyId) => {
	try {
		const response = await apiClient.get(`/admin/companies/${companyId}/categories`);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Get a single service category for a specific company (admin).
 * @param {string} companyId - Company UUID
 * @param {string} categoryId - Category UUID
 * @returns {Promise<object>} Response with category data
 */
export const getCompanyCategory = async (companyId, categoryId) => {
	try {
		const response = await apiClient.get(`/admin/companies/${companyId}/categories/${categoryId}`);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Create a service category scoped to a specific company (admin).
 * @param {string} companyId - Company UUID
 * @param {object} categoryData
 * @param {string} categoryData.name - Category name (required)
 * @param {string} [categoryData.description]
 * @returns {Promise<object>} Response with created category
 */
export const createCompanyCategory = async (companyId, categoryData) => {
	try {
		const response = await apiClient.post(`/admin/companies/${companyId}/categories`, categoryData);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Update a service category for a specific company (admin).
 * @param {string} companyId - Company UUID
 * @param {string} categoryId - Category UUID
 * @param {object} categoryData
 * @param {string} categoryData.name - Category name (required)
 * @param {string} [categoryData.description]
 * @returns {Promise<object>} Response with updated category
 */
export const updateCompanyCategory = async (companyId, categoryId, categoryData) => {
	try {
		const response = await apiClient.put(`/admin/companies/${companyId}/categories/${categoryId}`, categoryData);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Delete a service category from a specific company (admin).
 * @param {string} companyId - Company UUID
 * @param {string} categoryId - Category UUID
 * @returns {Promise<object>} Response
 */
export const deleteCompanyCategory = async (companyId, categoryId) => {
	try {
		const response = await apiClient.delete(`/admin/companies/${companyId}/categories/${categoryId}`);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

// ==================== MY COMPANY – SERVICES ====================

/**
 * List services for the authenticated user's company.
 * @param {object} [params] - Query parameters
 * @param {number} [params.page]
 * @param {number} [params.limit]
 * @param {number} [params.categoryId] - Filter by category
 * @param {string} [params.priceType] - 'fixed' | 'hourly' | 'per_unit'
 * @returns {Promise<object>} Paginated response with services array
 */
export const getMyCompanyServices = async (params = {}) => {
	try {
		const response = await apiClient.get('/my/company/services', { params });
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Create a new service for the authenticated user's company.
 * Requires `manage_services` permission.
 * @param {object} serviceData - Service data
 * @param {string} serviceData.name - Service name (required)
 * @param {number} serviceData.categoryId - Category ID (required)
 * @param {number} serviceData.basePrice - Base price (required)
 * @param {string} serviceData.priceType - 'fixed' | 'hourly' | 'per_unit' (required)
 * @param {string} [serviceData.description]
 * @param {number} [serviceData.duration] - Estimated duration in minutes
 * @returns {Promise<object>} Response with created service
 */
export const createMyCompanyService = async (serviceData) => {
	try {
		const response = await apiClient.post('/my/company/services', serviceData);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Update an existing service in the authenticated user's company.
 * Requires company admin role.
 * @param {string|number} serviceId - Service UUID or ID
 * @param {object} serviceData - Updated service fields
 * @param {string} [serviceData.name]
 * @param {string} [serviceData.description]
 * @param {number} [serviceData.basePrice]
 * @param {string} [serviceData.priceType] - 'fixed' | 'hourly' | 'per_unit'
 * @param {number} [serviceData.categoryId]
 * @param {number} [serviceData.duration] - Estimated duration in minutes
 * @returns {Promise<object>} Response
 */
export const updateMyCompanyService = async (serviceId, serviceData) => {
	try {
		const response = await apiClient.put(`/my/company/services/${serviceId}`, serviceData);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Permanently delete a service from the authenticated user's company.
 * Requires company admin role.
 * @param {string|number} serviceId - Service UUID or ID
 * @returns {Promise<object>} Response
 */
export const deleteMyCompanyService = async (serviceId) => {
	try {
		const response = await apiClient.delete(`/my/company/services/${serviceId}`);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

// ==================== MY COMPANY – CATEGORIES ====================

/**
 * List service categories for the authenticated user's company.
 * @returns {Promise<object>} Response with categories array
 */
export const getMyCompanyCategories = async () => {
	try {
		const response = await apiClient.get('/my/company/categories');
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Get a single service category from the authenticated user's company.
 * @param {string} categoryId - Category UUID
 * @returns {Promise<object>} Response with category data
 */
export const getMyCompanyCategory = async (categoryId) => {
	try {
		const response = await apiClient.get(`/my/company/categories/${categoryId}`);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Create a service category for the authenticated user's company.
 * Requires `manage_services` permission.
 * @param {object} categoryData
 * @param {string} categoryData.name - Category name (required)
 * @param {string} [categoryData.description]
 * @returns {Promise<object>} Response with created category
 */
export const createMyCompanyCategory = async (categoryData) => {
	try {
		const response = await apiClient.post('/my/company/categories', categoryData);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Update a service category in the authenticated user's company.
 * Requires `manage_services` permission.
 * @param {string} categoryId - Category UUID
 * @param {object} categoryData
 * @param {string} categoryData.name - Category name (required)
 * @param {string} [categoryData.description]
 * @returns {Promise<object>} Response with updated category
 */
export const updateMyCompanyCategory = async (categoryId, categoryData) => {
	try {
		const response = await apiClient.put(`/my/company/categories/${categoryId}`, categoryData);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Delete a service category from the authenticated user's company.
 * Requires `manage_services` permission.
 * @param {string} categoryId - Category UUID
 * @returns {Promise<object>} Response
 */
export const deleteMyCompanyCategory = async (categoryId) => {
	try {
		const response = await apiClient.delete(`/my/company/categories/${categoryId}`);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

export default {
	// Public catalogue
	browseServices,

	// Global categories
	getServiceCategories,
	createServiceCategory,

	// Individual services (by ID, cross-company)
	getService,
	updateService,
	deleteService,

	// Admin – company services
	getCompanyServices,
	createCompanyService,

	// Admin – company categories
	getCompanyCategories,
	getCompanyCategory,
	createCompanyCategory,
	updateCompanyCategory,
	deleteCompanyCategory,

	// My Company – services
	getMyCompanyServices,
	createMyCompanyService,
	updateMyCompanyService,
	deleteMyCompanyService,

	// My Company – categories
	getMyCompanyCategories,
	getMyCompanyCategory,
	createMyCompanyCategory,
	updateMyCompanyCategory,
	deleteMyCompanyCategory,
};
