import { useServicesStore } from '@/stores/services.store';
import * as serviceRequestsApi from '@/api/serviceRequests.api';
import { useToast } from './useToast';

/**
 * Service Requests Composable
 * Handles all service request-related operations
 */
export const useServiceRequests = () => {
	const servicesStore = useServicesStore();
	const toast = useToast();

	// ==================== SERVICE REQUESTS ====================

	/**
	 * Fetch all service requests (paginated)
	 * @param {object} params - Query parameters
	 * @param {number} params.page - Page number
	 * @param {number} params.limit - Items per page
	 * @returns {Promise<object>} Result with service requests
	 */
	const fetchServiceRequests = async (params = {}) => {
		try {
			servicesStore.setLoading(true);
			servicesStore.clearError();

			const response = await serviceRequestsApi.getServiceRequests(params);

			if (response.success !== false) {
				const requests = response.data || response;
				servicesStore.setServiceRequests(requests);
				return { success: true, data: requests, pagination: response.pagination };
			} else {
				throw new Error(response.message || 'Failed to fetch service requests');
			}
		} catch (error) {
			const errorMessage = error.message || 'Failed to fetch service requests.';
			servicesStore.setError(errorMessage);
			toast.showError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			servicesStore.setLoading(false);
		}
	};

	/**
	 * Fetch a specific service request by ID
	 * @param {number} requestId - Service request ID
	 * @returns {Promise<object>} Result with service request data
	 */
	const fetchServiceRequest = async (requestId) => {
		try {
			servicesStore.setLoading(true);
			servicesStore.clearError();

			const response = await serviceRequestsApi.getServiceRequest(requestId);

			if (response.success !== false) {
				const request = response.data || response;
				servicesStore.setCurrentServiceRequest(request);
				return { success: true, data: request };
			} else {
				throw new Error(response.message || 'Failed to fetch service request');
			}
		} catch (error) {
			const errorMessage = error.message || 'Failed to fetch service request.';
			servicesStore.setError(errorMessage);
			toast.showError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			servicesStore.setLoading(false);
		}
	};

	/**
	 * Create a new service request
	 * @param {object} requestData - Service request data
	 * @param {string} requestData.serviceId - Service ID (required)
	 * @param {string} requestData.location - Location (required)
	 * @param {string} requestData.description - Description (optional)
	 * @param {string} requestData.preferredDate - Preferred date ISO format (optional)
	 * @param {number} requestData.budget - Budget (optional)
	 * @returns {Promise<object>} Result with created service request
	 */
	const createServiceRequest = async (requestData) => {
		try {
			servicesStore.setLoading(true);
			servicesStore.clearError();

			const response = await serviceRequestsApi.createServiceRequest(requestData);

			if (response.success !== false) {
				const newRequest = response.data || response;
				servicesStore.addServiceRequest(newRequest);
				toast.showSuccess('Service request created successfully!');
				return { success: true, data: newRequest };
			} else {
				throw new Error(response.message || 'Failed to create service request');
			}
		} catch (error) {
			const errorMessage = error.message || 'Failed to create service request.';
			servicesStore.setError(errorMessage);
			toast.showError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			servicesStore.setLoading(false);
		}
	};

	/**
	 * Update service request status
	 * @param {number} requestId - Service request ID
	 * @param {string} status - New status: 'pending', 'accepted', 'rejected', 'completed', 'cancelled'
	 * @returns {Promise<object>} Result with updated request
	 */
	const updateServiceRequestStatus = async (requestId, status) => {
		try {
			servicesStore.setLoading(true);
			servicesStore.clearError();

			const response = await serviceRequestsApi.updateServiceRequestStatus(requestId, status);

			if (response.success !== false) {
				const updatedRequest = response.data || response;
				servicesStore.updateServiceRequest(updatedRequest);
				toast.showSuccess(`Request status updated to ${status}!`);
				return { success: true, data: updatedRequest };
			} else {
				throw new Error(response.message || 'Failed to update request status');
			}
		} catch (error) {
			const errorMessage = error.message || 'Failed to update request status.';
			servicesStore.setError(errorMessage);
			toast.showError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			servicesStore.setLoading(false);
		}
	};

	// ==================== QUOTES ====================

	/**
	 * Create a quote for a service request
	 * @param {number} requestId - Service request ID
	 * @param {object} quoteData - Quote data
	 * @param {number} quoteData.amount - Quote amount (required)
	 * @param {number} quoteData.estimatedDays - Estimated days (required)
	 * @param {string} quoteData.notes - Additional notes (optional)
	 * @returns {Promise<object>} Result with created quote
	 */
	const createQuote = async (requestId, quoteData) => {
		try {
			servicesStore.setLoading(true);
			servicesStore.clearError();

			const response = await serviceRequestsApi.createQuote(requestId, quoteData);

			if (response.success !== false) {
				const quote = response.data || response;
				toast.showSuccess('Quote created successfully!');
				return { success: true, data: quote };
			} else {
				throw new Error(response.message || 'Failed to create quote');
			}
		} catch (error) {
			const errorMessage = error.message || 'Failed to create quote.';
			servicesStore.setError(errorMessage);
			toast.showError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			servicesStore.setLoading(false);
		}
	};

	/**
	 * Update quote status
	 * @param {number} quoteId - Quote ID
	 * @param {string} status - New status: 'pending', 'accepted', 'rejected'
	 * @returns {Promise<object>} Result
	 */
	const updateQuoteStatus = async (quoteId, status) => {
		try {
			servicesStore.setLoading(true);
			servicesStore.clearError();

			const response = await serviceRequestsApi.updateQuoteStatus(quoteId, status);

			if (response.success !== false) {
				toast.showSuccess(`Quote ${status}!`);
				return { success: true, data: response.data || response };
			} else {
				throw new Error(response.message || 'Failed to update quote status');
			}
		} catch (error) {
			const errorMessage = error.message || 'Failed to update quote status.';
			servicesStore.setError(errorMessage);
			toast.showError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			servicesStore.setLoading(false);
		}
	};

	// ==================== ASSIGNMENTS ====================

	/**
	 * Assign an employee to a service request
	 * @param {number} requestId - Service request ID
	 * @param {object} assignmentData - Assignment data
	 * @param {string} assignmentData.employeeId - Employee ID (required)
	 * @param {string} assignmentData.assignedDate - Assigned date ISO format (optional)
	 * @returns {Promise<object>} Result with created assignment
	 */
	const assignEmployee = async (requestId, assignmentData) => {
		try {
			servicesStore.setLoading(true);
			servicesStore.clearError();

			const response = await serviceRequestsApi.assignEmployee(requestId, assignmentData);

			if (response.success !== false) {
				const assignment = response.data || response;
				toast.showSuccess('Employee assigned successfully!');
				return { success: true, data: assignment };
			} else {
				throw new Error(response.message || 'Failed to assign employee');
			}
		} catch (error) {
			const errorMessage = error.message || 'Failed to assign employee.';
			servicesStore.setError(errorMessage);
			toast.showError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			servicesStore.setLoading(false);
		}
	};

	/**
	 * Update assignment status
	 * @param {number} assignmentId - Assignment ID
	 * @param {string} status - New status: 'pending', 'in_progress', 'completed', 'cancelled'
	 * @returns {Promise<object>} Result
	 */
	const updateAssignmentStatus = async (assignmentId, status) => {
		try {
			servicesStore.setLoading(true);
			servicesStore.clearError();

			const response = await serviceRequestsApi.updateAssignmentStatus(assignmentId, status);

			if (response.success !== false) {
				toast.showSuccess(`Assignment status updated to ${status.replace('_', ' ')}!`);
				return { success: true, data: response.data || response };
			} else {
				throw new Error(response.message || 'Failed to update assignment status');
			}
		} catch (error) {
			const errorMessage = error.message || 'Failed to update assignment status.';
			servicesStore.setError(errorMessage);
			toast.showError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			servicesStore.setLoading(false);
		}
	};

	// ==================== TRACKING ====================

	/**
	 * Record GPS tracking for an assignment
	 * @param {number} assignmentId - Assignment ID
	 * @param {object} trackingData - Tracking data
	 * @param {number} trackingData.latitude - Latitude (required)
	 * @param {number} trackingData.longitude - Longitude (required)
	 * @param {number} trackingData.accuracy - GPS accuracy (optional)
	 * @param {string} trackingData.timestamp - Timestamp ISO format (optional)
	 * @returns {Promise<object>} Result
	 */
	const recordTracking = async (assignmentId, trackingData) => {
		try {
			servicesStore.setLoading(true);
			servicesStore.clearError();

			const response = await serviceRequestsApi.recordTracking(assignmentId, trackingData);

			if (response.success !== false) {
				return { success: true, data: response.data || response };
			} else {
				throw new Error(response.message || 'Failed to record tracking');
			}
		} catch (error) {
			const errorMessage = error.message || 'Failed to record tracking.';
			servicesStore.setError(errorMessage);
			// Don't show toast for tracking errors to avoid spam
			console.error(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			servicesStore.setLoading(false);
		}
	};

	/**
	 * Start GPS tracking for an assignment (continuous)
	 * @param {number} assignmentId - Assignment ID
	 * @param {number} interval - Tracking interval in milliseconds (default: 30000 - 30 seconds)
	 * @returns {object} Tracking control object with stop() method
	 */
	const startTracking = (assignmentId, interval = 30000) => {
		let trackingInterval = null;

		const getCurrentPosition = () => {
			return new Promise((resolve, reject) => {
				if (!navigator.geolocation) {
					reject(new Error('Geolocation is not supported by this browser'));
					return;
				}

				navigator.geolocation.getCurrentPosition(
					(position) => {
						resolve({
							latitude: position.coords.latitude,
							longitude: position.coords.longitude,
							accuracy: position.coords.accuracy,
							timestamp: new Date().toISOString(),
						});
					},
					(error) => {
						reject(error);
					},
					{
						enableHighAccuracy: true,
						timeout: 10000,
						maximumAge: 0,
					}
				);
			});
		};

		const track = async () => {
			try {
				const position = await getCurrentPosition();
				await recordTracking(assignmentId, position);
			} catch (error) {
				console.error('Tracking error:', error);
			}
		};

		// Start tracking immediately
		track();

		// Then track at intervals
		trackingInterval = setInterval(track, interval);

		// Return control object
		return {
			stop: () => {
				if (trackingInterval) {
					clearInterval(trackingInterval);
					trackingInterval = null;
					toast.showInfo('GPS tracking stopped');
				}
			},
			isActive: () => trackingInterval !== null,
		};
	};

	// ==================== UTILITIES ====================

	/**
	 * Get service request by ID from store
	 * @param {number} id - Service request ID
	 * @returns {object|null} Service request or null
	 */
	const getServiceRequestById = (id) => {
		return servicesStore.getServiceRequestById(id);
	};

	/**
	 * Get service requests by status
	 * @param {string} status - Status filter
	 * @returns {array} Service requests array
	 */
	const getServiceRequestsByStatus = (status) => {
		return servicesStore.getServiceRequestsByStatus(status);
	};

	/**
	 * Set current service request
	 * @param {object} request - Service request object
	 */
	const setCurrentServiceRequest = (request) => {
		servicesStore.setCurrentServiceRequest(request);
	};

	/**
	 * Clear current service request
	 */
	const clearCurrentServiceRequest = () => {
		servicesStore.clearCurrentServiceRequest();
	};

	return {
		// State
		state: servicesStore.state,
		serviceRequestsCount: servicesStore.serviceRequestsCount,
		hasServiceRequests: servicesStore.hasServiceRequests,
		pendingRequests: servicesStore.pendingRequests,
		quotedRequests: servicesStore.quotedRequests,
		acceptedRequests: servicesStore.acceptedRequests,
		inProgressRequests: servicesStore.inProgressRequests,
		completedRequests: servicesStore.completedRequests,
		cancelledRequests: servicesStore.cancelledRequests,

		// Service Requests Actions
		fetchServiceRequests,
		fetchServiceRequest,
		createServiceRequest,
		updateServiceRequestStatus,
		getServiceRequestById,
		getServiceRequestsByStatus,
		setCurrentServiceRequest,
		clearCurrentServiceRequest,

		// Quotes Actions
		createQuote,
		updateQuoteStatus,

		// Assignments Actions
		assignEmployee,
		updateAssignmentStatus,

		// Tracking Actions
		recordTracking,
		startTracking,
	};
};

export default useServiceRequests;
