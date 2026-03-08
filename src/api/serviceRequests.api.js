import apiClient, { handleApiError } from './config';

/**
 * Service Requests API Module
 * Handles all service request-related API calls
 */

/**
 * Get all service requests (paginated)
 * @param {object} params - Query parameters
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Items per page (default: 10)
 * @returns {Promise<object>} Response with service requests array and pagination
 */
export const getServiceRequests = async (params = {}) => {
	try {
		const response = await apiClient.get('/service-requests', { params });
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Get a specific service request by ID
 * @param {number} requestId - Service request ID
 * @returns {Promise<object>} Response with service request data
 */
export const getServiceRequest = async (requestId) => {
	try {
		const response = await apiClient.get(`/service-requests/${requestId}`);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Create a new service request
 * @param {object} requestData - Service request data
 * @param {string} requestData.serviceId - Service ID (required)
 * @param {string} requestData.location - Location (required)
 * @param {string} requestData.description - Description (optional)
 * @param {string} requestData.preferredDate - Preferred date (ISO format) (optional)
 * @param {number} requestData.budget - Budget (optional)
 * @returns {Promise<object>} Response with created service request
 */
export const createServiceRequest = async (requestData) => {
	try {
		const response = await apiClient.post('/service-requests', requestData);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Update service request status
 * @param {number} requestId - Service request ID
 * @param {string} status - New status: 'pending', 'accepted', 'rejected', 'completed', 'cancelled'
 * @returns {Promise<object>} Response
 */
export const updateServiceRequestStatus = async (requestId, status) => {
	try {
		const response = await apiClient.put(`/service-requests/${requestId}/status`, { status });
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Create a quote for a service request
 * @param {number} requestId - Service request ID
 * @param {object} quoteData - Quote data
 * @param {number} quoteData.amount - Quote amount (required)
 * @param {number} quoteData.estimatedDays - Estimated days (required)
 * @param {string} quoteData.notes - Additional notes (optional)
 * @returns {Promise<object>} Response with created quote
 */
export const createQuote = async (requestId, quoteData) => {
	try {
		const response = await apiClient.post(`/service-requests/${requestId}/quotes`, quoteData);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Update quote status
 * @param {number} quoteId - Quote ID
 * @param {string} status - New status: 'pending', 'accepted', 'rejected'
 * @returns {Promise<object>} Response
 */
export const updateQuoteStatus = async (quoteId, status) => {
	try {
		const response = await apiClient.put(`/service-requests/quotes/${quoteId}/status`, { status });
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Assign an employee to a service request
 * @param {number} requestId - Service request ID
 * @param {object} assignmentData - Assignment data
 * @param {string} assignmentData.employeeId - Employee ID (required)
 * @param {string} assignmentData.assignedDate - Assigned date (ISO format) (optional)
 * @returns {Promise<object>} Response with created assignment
 */
export const assignEmployee = async (requestId, assignmentData) => {
	try {
		const response = await apiClient.post(`/service-requests/${requestId}/assign`, assignmentData);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Update assignment status
 * @param {number} assignmentId - Assignment ID
 * @param {string} status - New status: 'pending', 'in_progress', 'completed', 'cancelled'
 * @returns {Promise<object>} Response
 */
export const updateAssignmentStatus = async (assignmentId, status) => {
	try {
		const response = await apiClient.put(`/service-requests/assignments/${assignmentId}/status`, { status });
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Record GPS tracking for an assignment
 * @param {number} assignmentId - Assignment ID
 * @param {object} trackingData - Tracking data
 * @param {number} trackingData.latitude - Latitude (required)
 * @param {number} trackingData.longitude - Longitude (required)
 * @param {number} trackingData.accuracy - GPS accuracy (optional)
 * @param {string} trackingData.timestamp - Timestamp (ISO format) (optional)
 * @returns {Promise<object>} Response
 */
export const recordTracking = async (assignmentId, trackingData) => {
	try {
		const response = await apiClient.post(`/service-requests/assignments/${assignmentId}/tracking`, trackingData);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

export default {
	getServiceRequests,
	getServiceRequest,
	createServiceRequest,
	updateServiceRequestStatus,
	createQuote,
	updateQuoteStatus,
	assignEmployee,
	updateAssignmentStatus,
	recordTracking,
};
