import apiClient, { handleApiError } from './config';

/**
 * Companies API Module
 * Organized into two sections:
 *  - Admin routes  → /admin/companies/*  (require `admin` permission)
 *  - My Company    → /my/company/*       (company member, ID resolved from JWT)
 */

// ─────────────────────────────────────────────
// ADMIN – Companies
// ─────────────────────────────────────────────

/**
 * List all companies (paginated, searchable)
 * @param {object} params
 * @param {number} [params.page=1]
 * @param {number} [params.limit=20]
 * @param {string} [params.search]
 * @returns {Promise<object>} { success, data: Company[], pagination }
 */
export const getCompanies = async (params = {}) => {
	try {
		const response = await apiClient.get('/admin/companies', { params });
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Get full details for a single company
 * @param {string} companyId - Company UUID
 * @returns {Promise<object>} { success, data: CompanyDetail }
 */
export const getCompany = async (companyId) => {
	try {
		const response = await apiClient.get(`/admin/companies/${companyId}`);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Create a new company
 * @param {object} companyData
 * @param {string} companyData.name - Required
 * @param {string} [companyData.email]
 * @param {string} [companyData.phone]
 * @param {string} [companyData.address]
 * @param {string} [companyData.city]
 * @param {string} [companyData.country]
 * @param {string} [companyData.description]
 * @param {string} [companyData.logo]
 * @returns {Promise<object>} { success, data: Company }
 */
export const createCompany = async (companyData) => {
	try {
		const response = await apiClient.post('/admin/companies', companyData);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Update a company
 * @param {string} companyId - Company UUID
 * @param {object} companyData - Fields to update
 * @returns {Promise<object>}
 */
export const updateCompany = async (companyId, companyData) => {
	try {
		const response = await apiClient.put(`/admin/companies/${companyId}`, companyData);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Permanently delete a company and all related data
 * @param {string} companyId - Company UUID
 * @returns {Promise<object>}
 */
export const deleteCompany = async (companyId) => {
	try {
		const response = await apiClient.delete(`/admin/companies/${companyId}`);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

// ─────────────────────────────────────────────
// ADMIN – Company Members
// ─────────────────────────────────────────────

/**
 * List members of a company (paginated)
 * @param {string} companyId - Company UUID
 * @param {object} [params]
 * @param {number} [params.page=1]
 * @param {number} [params.limit=20]
 * @param {string} [params.status] - 'active' | 'inactive'
 * @returns {Promise<object>} { success, data: CompanyMember[], pagination }
 */
export const getCompanyMembers = async (companyId, params = {}) => {
	try {
		const response = await apiClient.get(`/admin/companies/${companyId}/members`, { params });
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Add or invite a member to a company.
 *
 * INVITATION MODE – supply only `email` (+ optional `roleInCompany`).
 *   • Existing user  → added directly.
 *   • Unknown email  → invitation email sent.
 *
 * FULL INFO MODE – supply `email` AND `name`.
 *   • Existing user  → added directly.
 *   • Unknown email  → new account created, welcome email sent.
 *
 * @param {string} companyId - Company UUID
 * @param {object} memberData
 * @param {string}  memberData.email          - Required
 * @param {string}  [memberData.name]         - Activates FULL INFO MODE
 * @param {string}  [memberData.phone]
 * @param {string}  [memberData.roleInCompany] - 'admin' | 'employee' (default: 'employee')
 * @param {number}  [memberData.hourlyRate]
 * @param {number}  [memberData.monthlyRate]
 * @returns {Promise<object>}
 */
export const addCompanyMember = async (companyId, memberData) => {
	try {
		const response = await apiClient.post(`/admin/companies/${companyId}/members`, memberData);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Update a company member's role, rates or status
 * @param {string} companyId - Company UUID
 * @param {string} userId    - User UUID
 * @param {object} memberData
 * @param {string}  [memberData.roleInCompany] - 'admin' | 'employee'
 * @param {number}  [memberData.hourlyRate]
 * @param {number}  [memberData.monthlyRate]
 * @param {string}  [memberData.status]        - 'active' | 'inactive'
 * @returns {Promise<object>}
 */
export const updateCompanyMember = async (companyId, userId, memberData) => {
	try {
		const response = await apiClient.put(`/admin/companies/${companyId}/members/${userId}`, memberData);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Remove a member from a company
 * @param {string} companyId - Company UUID
 * @param {string} userId    - User UUID
 * @returns {Promise<object>}
 */
export const removeCompanyMember = async (companyId, userId) => {
	try {
		const response = await apiClient.delete(`/admin/companies/${companyId}/members/${userId}`);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

// ─────────────────────────────────────────────
// ADMIN – Company Invitations
// ─────────────────────────────────────────────

/**
 * List pending invitations for a company
 * @param {string} companyId - Company UUID
 * @returns {Promise<object>} { success, data: Invitation[] }
 */
export const getCompanyInvitations = async (companyId) => {
	try {
		const response = await apiClient.get(`/admin/companies/${companyId}/invitations`);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Cancel a pending invitation
 * @param {string} companyId    - Company UUID
 * @param {number} invitationId - Invitation ID
 * @returns {Promise<object>}
 */
export const cancelCompanyInvitation = async (companyId, invitationId) => {
	try {
		const response = await apiClient.delete(`/admin/companies/${companyId}/invitations/${invitationId}`);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

// ─────────────────────────────────────────────
// ADMIN – Company Locations
// ─────────────────────────────────────────────

/**
 * List all locations for a company
 * @param {string} companyId - Company UUID
 * @returns {Promise<object>} { success, data: Location[] }
 */
export const getCompanyLocations = async (companyId) => {
	try {
		const response = await apiClient.get(`/admin/companies/${companyId}/locations`);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Add a location to a company
 * @param {string} companyId - Company UUID
 * @param {object} locationData
 * @param {string}  locationData.name    - Required
 * @param {string}  locationData.address - Required
 * @param {number}  [locationData.cityId]
 * @param {string}  [locationData.phone]
 * @param {number}  [locationData.lat]
 * @param {number}  [locationData.lng]
 * @returns {Promise<object>}
 */
export const addCompanyLocation = async (companyId, locationData) => {
	try {
		const response = await apiClient.post(`/admin/companies/${companyId}/locations`, locationData);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Delete a location from a company
 * @param {string} companyId  - Company UUID
 * @param {string} locationId - Location UUID
 * @returns {Promise<object>}
 */
export const deleteCompanyLocation = async (companyId, locationId) => {
	try {
		const response = await apiClient.delete(`/admin/companies/${companyId}/locations/${locationId}`);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

// ─────────────────────────────────────────────
// ADMIN – Company Categories
// ─────────────────────────────────────────────

/**
 * List service categories for a company
 * @param {string} companyId - Company UUID
 * @returns {Promise<object>} { success, data: ServiceCategory[] }
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
 * Get a specific category of a company
 * @param {string} companyId  - Company UUID
 * @param {string} categoryId - Category UUID
 * @returns {Promise<object>}
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
 * Create a service category for a company
 * @param {string} companyId - Company UUID
 * @param {object} categoryData
 * @param {string}  categoryData.name        - Required
 * @param {string}  [categoryData.description]
 * @returns {Promise<object>}
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
 * Update a company service category
 * @param {string} companyId  - Company UUID
 * @param {string} categoryId - Category UUID
 * @param {object} categoryData
 * @param {string}  categoryData.name        - Required
 * @param {string}  [categoryData.description]
 * @returns {Promise<object>}
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
 * Delete a company service category
 * @param {string} companyId  - Company UUID
 * @param {string} categoryId - Category UUID
 * @returns {Promise<object>}
 */
export const deleteCompanyCategory = async (companyId, categoryId) => {
	try {
		const response = await apiClient.delete(`/admin/companies/${companyId}/categories/${categoryId}`);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

// ─────────────────────────────────────────────
// ADMIN – Company Services
// ─────────────────────────────────────────────

/**
 * List services for a company (paginated)
 * @param {string} companyId - Company UUID
 * @param {object} [params]
 * @param {number} [params.page=1]
 * @param {number} [params.limit=20]
 * @param {number} [params.categoryId]
 * @param {string} [params.priceType] - 'fixed' | 'hourly' | 'per_unit'
 * @returns {Promise<object>}
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
 * Create a service for a company
 * @param {string} companyId - Company UUID
 * @param {object} serviceData
 * @param {string}  serviceData.name       - Required
 * @param {number}  serviceData.categoryId - Required
 * @param {number}  serviceData.basePrice  - Required
 * @param {string}  serviceData.priceType  - Required: 'fixed' | 'hourly' | 'per_unit'
 * @param {string}  [serviceData.description]
 * @param {number}  [serviceData.duration] - Minutes
 * @returns {Promise<object>}
 */
export const createCompanyService = async (companyId, serviceData) => {
	try {
		const response = await apiClient.post(`/admin/companies/${companyId}/services`, serviceData);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

// ─────────────────────────────────────────────
// ADMIN – Company Service Requests
// ─────────────────────────────────────────────

/**
 * List service requests for a company (paginated)
 * @param {string} companyId - Company UUID
 * @param {object} [params]
 * @param {number} [params.page=1]
 * @param {number} [params.limit=20]
 * @param {string} [params.status]
 * @returns {Promise<object>}
 */
export const getCompanyServiceRequests = async (companyId, params = {}) => {
	try {
		const response = await apiClient.get(`/admin/companies/${companyId}/service-requests`, { params });
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Assign an employee to a company service request
 * @param {string} companyId  - Company UUID
 * @param {string} requestId  - Service request UUID
 * @param {number} employeeId - Employee user ID
 * @returns {Promise<object>}
 */
export const assignEmployeeToCompanyRequest = async (companyId, requestId, employeeId) => {
	try {
		const response = await apiClient.post(
			`/admin/companies/${companyId}/service-requests/${requestId}/assign`,
			{ employeeId }
		);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Create a quote for a company service request
 * @param {string} companyId  - Company UUID
 * @param {string} requestId  - Service request UUID
 * @param {object} quoteData
 * @param {number}  quoteData.totalPrice - Required
 * @param {object}  [quoteData.details]
 * @returns {Promise<object>}
 */
export const createCompanyQuote = async (companyId, requestId, quoteData) => {
	try {
		const response = await apiClient.post(
			`/admin/companies/${companyId}/service-requests/${requestId}/quotes`,
			quoteData
		);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Update a quote status for a company service request
 * @param {string} companyId - Company UUID
 * @param {string} quoteId   - Quote UUID
 * @param {string} status    - 'pending' | 'accepted' | 'rejected'
 * @returns {Promise<object>}
 */
export const updateCompanyQuoteStatus = async (companyId, quoteId, status) => {
	try {
		const response = await apiClient.put(
			`/admin/companies/${companyId}/service-requests/quotes/${quoteId}/status`,
			{ status }
		);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

// ─────────────────────────────────────────────
// MY COMPANY – Profile
// ─────────────────────────────────────────────

/**
 * Get the authenticated user's company details
 * (company ID resolved automatically from JWT)
 * @returns {Promise<object>} { success, data: CompanyDetail }
 */
export const getMyCompany = async () => {
	try {
		const response = await apiClient.get('/my/company');
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Update the authenticated user's company profile
 * Requires `manage_company` permission.
 * @param {object} companyData - Fields to update
 * @returns {Promise<object>}
 */
export const updateMyCompany = async (companyData) => {
	try {
		const response = await apiClient.put('/my/company', companyData);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

// ─────────────────────────────────────────────
// MY COMPANY – Members
// ─────────────────────────────────────────────

/**
 * List members of the authenticated user's company (paginated)
 * @param {object} [params]
 * @param {number} [params.page=1]
 * @param {number} [params.limit=20]
 * @param {string} [params.status] - 'active' | 'inactive'
 * @returns {Promise<object>}
 */
export const getMyCompanyMembers = async (params = {}) => {
	try {
		const response = await apiClient.get('/my/company/members', { params });
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Add or invite a member to the authenticated user's company.
 * Same dual-mode logic as addCompanyMember (admin version).
 * Requires `manage_company` permission.
 * @param {object} memberData
 * @param {string}  memberData.email
 * @param {string}  [memberData.name]
 * @param {string}  [memberData.phone]
 * @param {string}  [memberData.roleInCompany]
 * @param {number}  [memberData.hourlyRate]
 * @param {number}  [memberData.monthlyRate]
 * @returns {Promise<object>}
 */
export const addMyCompanyMember = async (memberData) => {
	try {
		const response = await apiClient.post('/my/company/members', memberData);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Update a member in the authenticated user's company
 * Requires `manage_company` permission.
 * @param {string} userId    - User UUID
 * @param {object} memberData
 * @returns {Promise<object>}
 */
export const updateMyCompanyMember = async (userId, memberData) => {
	try {
		const response = await apiClient.put(`/my/company/members/${userId}`, memberData);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Remove a member from the authenticated user's company
 * Requires `manage_company` permission.
 * @param {string} userId - User UUID
 * @returns {Promise<object>}
 */
export const removeMyCompanyMember = async (userId) => {
	try {
		const response = await apiClient.delete(`/my/company/members/${userId}`);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

// ─────────────────────────────────────────────
// MY COMPANY – Invitations
// ─────────────────────────────────────────────

/**
 * List pending invitations for the authenticated user's company
 * @returns {Promise<object>} { success, data: Invitation[] }
 */
export const getMyCompanyInvitations = async () => {
	try {
		const response = await apiClient.get('/my/company/invitations');
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Cancel a pending invitation for the authenticated user's company
 * Requires `manage_company` permission.
 * @param {number} invitationId - Invitation ID
 * @returns {Promise<object>}
 */
export const cancelMyCompanyInvitation = async (invitationId) => {
	try {
		const response = await apiClient.delete(`/my/company/invitations/${invitationId}`);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

// ─────────────────────────────────────────────
// MY COMPANY – Locations
// ─────────────────────────────────────────────

/**
 * List locations for the authenticated user's company
 * @returns {Promise<object>} { success, data: Location[] }
 */
export const getMyCompanyLocations = async () => {
	try {
		const response = await apiClient.get('/my/company/locations');
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Add a location to the authenticated user's company
 * Requires `manage_company` permission.
 * @param {object} locationData
 * @param {string}  locationData.name    - Required
 * @param {string}  locationData.address - Required
 * @param {number}  [locationData.cityId]
 * @param {string}  [locationData.phone]
 * @param {number}  [locationData.lat]
 * @param {number}  [locationData.lng]
 * @returns {Promise<object>}
 */
export const addMyCompanyLocation = async (locationData) => {
	try {
		const response = await apiClient.post('/my/company/locations', locationData);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Delete a location from the authenticated user's company
 * Requires `manage_company` permission.
 * @param {number} locationId - Location ID
 * @returns {Promise<object>}
 */
export const deleteMyCompanyLocation = async (locationId) => {
	try {
		const response = await apiClient.delete(`/my/company/locations/${locationId}`);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Update a location in the authenticated user's company
 * Requires company admin role.
 * @param {number} locationId - Location ID
 * @param {object} locationData
 * @returns {Promise<object>}
 */
export const updateMyCompanyLocation = async (locationId, locationData) => {
	try {
		const response = await apiClient.put(`/my/company/locations/${locationId}`, locationData);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

// ─────────────────────────────────────────────
// MY COMPANY – Categories
// ─────────────────────────────────────────────

/**
 * List service categories for the authenticated user's company
 * @returns {Promise<object>}
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
 * Get a specific category from the authenticated user's company
 * @param {string} categoryId - Category UUID
 * @returns {Promise<object>}
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
 * Create a service category for the authenticated user's company
 * Requires `manage_services` permission.
 * @param {object} categoryData
 * @param {string}  categoryData.name - Required
 * @param {string}  [categoryData.description]
 * @returns {Promise<object>}
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
 * Update a service category in the authenticated user's company
 * Requires `manage_services` permission.
 * @param {string} categoryId - Category UUID
 * @param {object} categoryData
 * @param {string}  categoryData.name - Required
 * @param {string}  [categoryData.description]
 * @returns {Promise<object>}
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
 * Delete a service category from the authenticated user's company
 * Requires `manage_services` permission.
 * @param {string} categoryId - Category UUID
 * @returns {Promise<object>}
 */
export const deleteMyCompanyCategory = async (categoryId) => {
	try {
		const response = await apiClient.delete(`/my/company/categories/${categoryId}`);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

// ─────────────────────────────────────────────
// MY COMPANY – Services
// ─────────────────────────────────────────────

/**
 * List services offered by the authenticated user's company (paginated)
 * @param {object} [params]
 * @param {number} [params.page=1]
 * @param {number} [params.limit=20]
 * @param {number} [params.categoryId]
 * @param {string} [params.priceType] - 'fixed' | 'hourly' | 'per_unit'
 * @returns {Promise<object>}
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
 * Create a service for the authenticated user's company
 * Requires `manage_services` permission.
 * @param {object} serviceData
 * @param {string}  serviceData.name       - Required
 * @param {number}  serviceData.categoryId - Required
 * @param {number}  serviceData.basePrice  - Required
 * @param {string}  serviceData.priceType  - Required: 'fixed' | 'hourly' | 'per_unit'
 * @param {string}  [serviceData.description]
 * @param {number}  [serviceData.duration] - Minutes
 * @returns {Promise<object>}
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
 * Update a service in the authenticated user's company
 * Requires company admin role.
 * @param {string} serviceId - Service UUID
 * @param {object} serviceData
 * @returns {Promise<object>}
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
 * Delete a service from the authenticated user's company
 * Requires company admin role.
 * @param {string} serviceId - Service UUID
 * @returns {Promise<object>}
 */
export const deleteMyCompanyService = async (serviceId) => {
	try {
		const response = await apiClient.delete(`/my/company/services/${serviceId}`);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

// ─────────────────────────────────────────────
// MY COMPANY – Service Requests
// ─────────────────────────────────────────────

/**
 * List service requests for the authenticated user's company (paginated)
 * @param {object} [params]
 * @param {number} [params.page=1]
 * @param {number} [params.limit=20]
 * @param {string} [params.status]
 * @returns {Promise<object>}
 */
export const getMyCompanyServiceRequests = async (params = {}) => {
	try {
		const response = await apiClient.get('/my/company/service-requests', { params });
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Update service request status (my company)
 * Requires company admin role.
 * @param {string} requestId - Service request UUID
 * @param {string} status - 'pending' | 'accepted' | 'rejected' | 'in_progress' | 'completed'
 * @returns {Promise<object>}
 */
export const updateMyCompanyServiceRequestStatus = async (requestId, status) => {
	try {
		const response = await apiClient.put(`/my/company/service-requests/${requestId}/status`, { status });
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Assign an employee to a service request (my company)
 * Requires `manage_company_services` permission.
 * @param {string} requestId  - Service request UUID
 * @param {number} employeeId - Employee user ID
 * @returns {Promise<object>}
 */
export const assignEmployeeMyCompany = async (requestId, employeeId) => {
	try {
		const response = await apiClient.post(
			`/my/company/service-requests/${requestId}/assign`,
			{ employeeId }
		);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Create a quote for a service request (my company)
 * Requires `manage_company_services` permission.
 * @param {string} requestId - Service request UUID
 * @param {object} quoteData
 * @param {number}  quoteData.totalPrice - Required
 * @param {object}  [quoteData.details]
 * @returns {Promise<object>}
 */
export const createMyCompanyQuote = async (requestId, quoteData) => {
	try {
		const response = await apiClient.post(
			`/my/company/service-requests/${requestId}/quote`,
			quoteData
		);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Update a quote status for a service request (my company)
 * Requires `manage_company_services` permission.
 * @param {number} quoteId - Quote ID
 * @param {string} status  - 'pending' | 'accepted' | 'rejected'
 * @returns {Promise<object>}
 */
export const updateMyCompanyQuoteStatus = async (quoteId, status) => {
	try {
		const response = await apiClient.put(
			`/my/company/service-requests/quotes/${quoteId}/status`,
			{ status }
		);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

export default {
	// Admin – Companies
	getCompanies,
	getCompany,
	createCompany,
	updateCompany,
	deleteCompany,

	// Admin – Members
	getCompanyMembers,
	addCompanyMember,
	updateCompanyMember,
	removeCompanyMember,

	// Admin – Invitations
	getCompanyInvitations,
	cancelCompanyInvitation,

	// Admin – Locations
	getCompanyLocations,
	addCompanyLocation,
	deleteCompanyLocation,

	// Admin – Categories
	getCompanyCategories,
	getCompanyCategory,
	createCompanyCategory,
	updateCompanyCategory,
	deleteCompanyCategory,

	// Admin – Services
	getCompanyServices,
	createCompanyService,

	// Admin – Service Requests
	getCompanyServiceRequests,
	assignEmployeeToCompanyRequest,
	createCompanyQuote,
	updateCompanyQuoteStatus,

	// My Company – Profile
	getMyCompany,
	updateMyCompany,

	// My Company – Members
	getMyCompanyMembers,
	addMyCompanyMember,
	updateMyCompanyMember,
	removeMyCompanyMember,

	// My Company – Invitations
	getMyCompanyInvitations,
	cancelMyCompanyInvitation,

	// My Company – Locations
	getMyCompanyLocations,
	addMyCompanyLocation,
	deleteMyCompanyLocation,
	updateMyCompanyLocation,

	// My Company – Categories
	getMyCompanyCategories,
	getMyCompanyCategory,
	createMyCompanyCategory,
	updateMyCompanyCategory,
	deleteMyCompanyCategory,

	// My Company – Services
	getMyCompanyServices,
	createMyCompanyService,
	updateMyCompanyService,
	deleteMyCompanyService,

	// My Company – Service Requests
	getMyCompanyServiceRequests,
	updateMyCompanyServiceRequestStatus,
	assignEmployeeMyCompany,
	createMyCompanyQuote,
	updateMyCompanyQuoteStatus,
};
