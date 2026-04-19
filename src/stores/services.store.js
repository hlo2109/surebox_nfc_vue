import { reactive, computed } from 'vue';

/**
 * Services Store
 * Manages services and service requests state using Vue 3 Composition API
 */

// Reactive state
const state = reactive({
	services: [],
	categories: [],
	currentService: null,
	serviceRequests: [],
	currentServiceRequest: null,
	isLoading: false,
	error: null,
});

// Computed properties
const servicesCount = computed(() => state.services.length);

const categoriesCount = computed(() => state.categories.length);

const serviceRequestsCount = computed(() => state.serviceRequests.length);

const activeServices = computed(() =>
	state.services.filter(service => service.status === 'active')
);

const inactiveServices = computed(() =>
	state.services.filter(service => service.status === 'inactive')
);

const hasServices = computed(() => state.services.length > 0);

const hasCategories = computed(() => state.categories.length > 0);

const hasServiceRequests = computed(() => state.serviceRequests.length > 0);

// Service Requests by status
const pendingRequests = computed(() =>
	state.serviceRequests.filter(request => request.status === 'pending')
);

const quotedRequests = computed(() =>
	state.serviceRequests.filter(request => request.status === 'quoted')
);

const acceptedRequests = computed(() =>
	state.serviceRequests.filter(request => request.status === 'accepted')
);

const inProgressRequests = computed(() =>
	state.serviceRequests.filter(request => request.status === 'in_progress')
);

const completedRequests = computed(() =>
	state.serviceRequests.filter(request => request.status === 'completed')
);

const cancelledRequests = computed(() =>
	state.serviceRequests.filter(request => request.status === 'cancelled')
);

// Actions - Services
const setServices = (services) => {
	state.services = services;
};

const addService = (service) => {
	state.services.push(service);
};

const updateService = (updatedService) => {
	const index = state.services.findIndex(service => service.id === updatedService.id);
	if (index !== -1) {
		state.services[index] = updatedService;
	}
	// Update current service if it's the same one
	if (state.currentService?.id === updatedService.id) {
		state.currentService = updatedService;
	}
};

const removeService = (serviceId) => {
	state.services = state.services.filter(service => service.id !== serviceId);
	// Clear current service if it's the same one
	if (state.currentService?.id === serviceId) {
		state.currentService = null;
	}
};

const setCurrentService = (service) => {
	state.currentService = service;
};

const clearCurrentService = () => {
	state.currentService = null;
};

const getServiceById = (id) => {
	return state.services.find(service => service.id === id);
};

// Actions - Categories
const setCategories = (categories) => {
	state.categories = categories;
};

const addCategory = (category) => {
	state.categories.push(category);
};

const updateCategory = (updatedCategory) => {
	const index = state.categories.findIndex(
		(category) =>
			category.id === updatedCategory.id ||
			category.uuid === updatedCategory.uuid,
	);
	if (index !== -1) {
		state.categories[index] = updatedCategory;
	}
};

const removeCategory = (categoryId) => {
	state.categories = state.categories.filter(
		(category) =>
			category.id !== categoryId && category.uuid !== categoryId,
	);
};

const getCategoryById = (id) => {
	return state.categories.find(category => category.id === id);
};

const getServicesByCategory = (categoryId) => {
	return state.services.filter(service => service.categoryId === categoryId);
};

// Actions - Service Requests
const setServiceRequests = (requests) => {
	state.serviceRequests = requests;
};

const addServiceRequest = (request) => {
	state.serviceRequests.push(request);
};

const updateServiceRequest = (updatedRequest) => {
	const index = state.serviceRequests.findIndex(request => request.id === updatedRequest.id);
	if (index !== -1) {
		state.serviceRequests[index] = updatedRequest;
	}
	// Update current service request if it's the same one
	if (state.currentServiceRequest?.id === updatedRequest.id) {
		state.currentServiceRequest = updatedRequest;
	}
};

const removeServiceRequest = (requestId) => {
	state.serviceRequests = state.serviceRequests.filter(request => request.id !== requestId);
	// Clear current service request if it's the same one
	if (state.currentServiceRequest?.id === requestId) {
		state.currentServiceRequest = null;
	}
};

const setCurrentServiceRequest = (request) => {
	state.currentServiceRequest = request;
};

const clearCurrentServiceRequest = () => {
	state.currentServiceRequest = null;
};

const getServiceRequestById = (id) => {
	return state.serviceRequests.find(request => request.id === id);
};

const getServiceRequestsByStatus = (status) => {
	return state.serviceRequests.filter(request => request.status === status);
};

// General actions
const setLoading = (loading) => {
	state.isLoading = loading;
};

const setError = (error) => {
	state.error = error;
};

const clearError = () => {
	state.error = null;
};

const reset = () => {
	state.services = [];
	state.categories = [];
	state.currentService = null;
	state.serviceRequests = [];
	state.currentServiceRequest = null;
	state.isLoading = false;
	state.error = null;
};

// Export store
export const useServicesStore = () => {
	return {
		// State
		state,

		// Computed
		servicesCount,
		categoriesCount,
		serviceRequestsCount,
		activeServices,
		inactiveServices,
		hasServices,
		hasCategories,
		hasServiceRequests,
		pendingRequests,
		quotedRequests,
		acceptedRequests,
		inProgressRequests,
		completedRequests,
		cancelledRequests,

		// Services Actions
		setServices,
		addService,
		updateService,
		removeService,
		setCurrentService,
		clearCurrentService,
		getServiceById,

		// Categories Actions
		setCategories,
		addCategory,
		updateCategory,
		removeCategory,
		getCategoryById,
		getServicesByCategory,

		// Service Requests Actions
		setServiceRequests,
		addServiceRequest,
		updateServiceRequest,
		removeServiceRequest,
		setCurrentServiceRequest,
		clearCurrentServiceRequest,
		getServiceRequestById,
		getServiceRequestsByStatus,

		// Utilities
		setLoading,
		setError,
		clearError,
		reset,
	};
};

export default useServicesStore;
