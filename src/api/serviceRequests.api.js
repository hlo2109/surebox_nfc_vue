import apiClient, { handleApiError } from './config';

/**
 * Service Requests API Module
 * Handles customer-facing service request API calls
 * Audience: authenticated customers (own requests only)
 */

/**
 * Get all my service requests (paginated)
 * @param {object} params - Query parameters
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Items per page (default: 10)
 * @param {string} params.status - Filter by status: 'pending' | 'quoted' | 'accepted' | 'in_progress' | 'completed' | 'cancelled'
 * @returns {Promise<object>} Paginated list of service requests
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
 * @param {string} requestId - Service request UUID
 * @returns {Promise<object>} Service request details including quotes and assignment status
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
 * @param {string} requestData.serviceId - Service UUID (required)
 * @param {string} requestData.companyId - Company UUID (required)
 * @param {string} [requestData.locationId] - UUID of a saved NFC location (optional)
 * @param {string} [requestData.preferredDate] - Preferred date (ISO date-time format) (optional)
 * @param {string} [requestData.notes] - Additional notes (optional)
 * @returns {Promise<object>} Created service request
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
 * Cancel a service request
 * Only allowed when status is 'pending' or 'quoted'
 * @param {string} requestId - Service request UUID
 * @returns {Promise<object>} Response
 */
export const cancelServiceRequest = async (requestId) => {
	try {
		const response = await apiClient.put(`/service-requests/${requestId}/cancel`);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Respond to a company quote (accept or reject)
 * Accepting a quote advances the request status to 'accepted'
 * @param {string} requestId - Service request UUID
 * @param {string} quoteId - Quote UUID
 * @param {'accept' | 'reject'} action - The response action
 * @returns {Promise<object>} Response
 */
export const respondToQuote = async (requestId, quoteId, action) => {
	try {
		const response = await apiClient.put(
			`/service-requests/${requestId}/quotes/${quoteId}/respond`,
			{ action },
		);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Rate a completed service request
 * Can only be done once per completed request
 * @param {string} requestId - Service request UUID
 * @param {object} ratingData - Rating data
 * @param {number} ratingData.rating - Star rating from 1 to 5 (required)
 * @param {string} [ratingData.review] - Optional written review
 * @returns {Promise<object>} Response
 */
export const rateServiceRequest = async (requestId, ratingData) => {
	try {
		const response = await apiClient.post(`/service-requests/${requestId}/rate`, ratingData);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

// ==================== EMPLOYEE ASSIGNMENT ENDPOINTS ====================

/**
 * Get all my employee assignments (paginated)
 * @param {object} [params] - Query parameters
 * @param {number} [params.page] - Page number (default: 1)
 * @param {number} [params.limit] - Items per page (default: 10)
 * @param {string} [params.status] - Filter by status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled'
 * @returns {Promise<object>} Paginated list of employee assignments
 */
export const getMyAssignments = async (params = {}) => {
	try {
		const response = await apiClient.get('/my/employee/assignments', { params });
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Get a specific employee assignment by ID
 * @param {string} assignmentId - Assignment UUID
 * @returns {Promise<object>} Assignment details
 */
export const getMyAssignment = async (assignmentId) => {
	try {
		const response = await apiClient.get(`/my/employee/assignments/${assignmentId}`);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Accept an employee assignment
 * @param {string} assignmentId - Assignment UUID
 * @returns {Promise<object>} Updated assignment
 */
export const acceptAssignment = async (assignmentId) => {
	try {
		const response = await apiClient.put(`/my/employee/assignments/${assignmentId}/accept`);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Reject an employee assignment with a reason
 * @param {string} assignmentId - Assignment UUID
 * @param {string} reason - Rejection reason
 * @returns {Promise<object>} Updated assignment
 */
export const rejectAssignment = async (assignmentId, reason) => {
	try {
		const response = await apiClient.put(`/my/employee/assignments/${assignmentId}/reject`, { reason });
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Verify NFC code for an assignment
 * @param {string} assignmentId - Assignment UUID
 * @param {object} nfcData - NFC verification data
 * @param {string} nfcData.nfcCode - NFC code to verify
 * @param {number} nfcData.latitude - Current latitude
 * @param {number} nfcData.longitude - Current longitude
 * @returns {Promise<object>} Verification result
 */
export const verifyAssignmentNfc = async (assignmentId, nfcData) => {
	try {
		const response = await apiClient.post(`/my/employee/assignments/${assignmentId}/verify-nfc`, nfcData);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Start an assignment (begin service execution)
 * @param {string} assignmentId - Assignment UUID
 * @param {object} startData - Start data
 * @param {number} startData.latitude - Current latitude
 * @param {number} startData.longitude - Current longitude
 * @param {string} [startData.nfcCode] - Optional NFC code for on-start verification
 * @returns {Promise<object>} Updated assignment
 */
export const startAssignment = async (assignmentId, startData) => {
	try {
		const response = await apiClient.put(`/my/employee/assignments/${assignmentId}/start`, startData);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Complete an assignment (finish service execution)
 * @param {string} assignmentId - Assignment UUID
 * @param {object} completeData - Completion data
 * @param {number} completeData.latitude - Current latitude
 * @param {number} completeData.longitude - Current longitude
 * @param {string} [completeData.notes] - Optional completion notes
 * @returns {Promise<object>} Updated assignment
 */
export const completeAssignment = async (assignmentId, completeData) => {
	try {
		const response = await apiClient.put(`/my/employee/assignments/${assignmentId}/complete`, completeData);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Record a GPS tracking point for an assignment
 * @param {string} assignmentId - Assignment UUID
 * @param {object} trackingData - Tracking data
 * @param {number} trackingData.latitude - Current latitude
 * @param {number} trackingData.longitude - Current longitude
 * @param {number} [trackingData.accuracy] - GPS accuracy in metres
 * @param {string} [trackingData.timestamp] - ISO timestamp (defaults to server time if omitted)
 * @param {string} [trackingData.eventType] - Event type: 'location_update' | 'check_in' | 'check_out'
 * @returns {Promise<object>} Created tracking record
 */
export const recordAssignmentTracking = async (assignmentId, trackingData) => {
	try {
		const response = await apiClient.post(`/my/employee/assignments/${assignmentId}/tracking`, trackingData);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

export default {
	getServiceRequests,
	getServiceRequest,
	createServiceRequest,
	cancelServiceRequest,
	respondToQuote,
	rateServiceRequest,
	getMyAssignments,
	getMyAssignment,
	acceptAssignment,
	rejectAssignment,
	verifyAssignmentNfc,
	startAssignment,
	completeAssignment,
	recordAssignmentTracking,
};
