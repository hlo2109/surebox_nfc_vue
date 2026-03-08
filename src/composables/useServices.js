import { useServicesStore } from '@/stores/services.store';
import { useAuthStore } from '@/stores/auth.store';
import * as servicesApi from '@/api/services.api';
import { useToast } from './useToast';

/**
 * Services Composable
 * Handles all service-related operations including categories and company services
 */
export const useServices = () => {
	const servicesStore = useServicesStore();
	const authStore = useAuthStore();
	const toast = useToast();

	// ==================== CATEGORIES ====================

	/**
	 * Fetch all service categories
	 * @param {object} params - Query parameters
	 * @param {number} params.page - Page number (optional)
	 * @param {number} params.limit - Items per page (optional)
	 * @param {string} params.search - Search query (optional)
	 * @returns {Promise<object>} Result with categories
	 */
	const fetchServiceCategories = async (params = {}) => {
		try {
			servicesStore.setLoading(true);
			servicesStore.clearError();

			const response = await servicesApi.getServiceCategories(params);

			if (response.success !== false) {
				const categories = response.data || response;
				servicesStore.setCategories(categories);
				return { success: true, data: categories };
			} else {
				throw new Error(response.message || 'Failed to fetch categories');
			}
		} catch (error) {
			const errorMessage = error.message || 'Failed to fetch service categories.';
			servicesStore.setError(errorMessage);
			toast.showError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			servicesStore.setLoading(false);
		}
	};

	/**
	 * Fetch a specific category by ID
	 * @param {number} categoryId - Category ID
	 * @returns {Promise<object>} Result with category data
	 */
	const fetchServiceCategory = async (categoryId) => {
		try {
			servicesStore.setLoading(true);
			servicesStore.clearError();

			const response = await servicesApi.getServiceCategory(categoryId);

			if (response.success !== false) {
				const category = response.data || response;
				return { success: true, data: category };
			} else {
				throw new Error(response.message || 'Failed to fetch category');
			}
		} catch (error) {
			const errorMessage = error.message || 'Failed to fetch category.';
			servicesStore.setError(errorMessage);
			toast.showError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			servicesStore.setLoading(false);
		}
	};

	/**
	 * Create a new service category (admin only)
	 * @param {object} categoryData - Category data
	 * @param {string} categoryData.name - Category name (required)
	 * @param {string} categoryData.description - Description (optional)
	 * @param {string} categoryData.icon - Icon (optional)
	 * @returns {Promise<object>} Result with created category
	 */
	const createServiceCategory = async (categoryData) => {
		try {
			servicesStore.setLoading(true);
			servicesStore.clearError();

			const response = await servicesApi.createServiceCategory(categoryData);

			if (response.success !== false) {
				const newCategory = response.data || response;
				servicesStore.addCategory(newCategory);
				toast.showSuccess('Category created successfully!');
				return { success: true, data: newCategory };
			} else {
				throw new Error(response.message || 'Failed to create category');
			}
		} catch (error) {
			const errorMessage = error.message || 'Failed to create category.';
			servicesStore.setError(errorMessage);
			toast.showError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			servicesStore.setLoading(false);
		}
	};

	/**
	 * Update a service category (admin only)
	 * @param {number} categoryId - Category ID
	 * @param {object} categoryData - Updated category data
	 * @returns {Promise<object>} Result with updated category
	 */
	const updateServiceCategory = async (categoryId, categoryData) => {
		try {
			servicesStore.setLoading(true);
			servicesStore.clearError();

			const response = await servicesApi.updateServiceCategory(categoryId, categoryData);

			if (response.success !== false) {
				const updatedCategory = response.data || response;
				servicesStore.updateCategory(updatedCategory);
				toast.showSuccess('Category updated successfully!');
				return { success: true, data: updatedCategory };
			} else {
				throw new Error(response.message || 'Failed to update category');
			}
		} catch (error) {
			const errorMessage = error.message || 'Failed to update category.';
			servicesStore.setError(errorMessage);
			toast.showError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			servicesStore.setLoading(false);
		}
	};

	/**
	 * Delete a service category (admin only)
	 * @param {number} categoryId - Category ID
	 * @returns {Promise<object>} Result
	 */
	const deleteServiceCategory = async (categoryId) => {
		try {
			servicesStore.setLoading(true);
			servicesStore.clearError();

			const response = await servicesApi.deleteServiceCategory(categoryId);

			if (response.success !== false) {
				servicesStore.removeCategory(categoryId);
				toast.showSuccess('Category deleted successfully!');
				return { success: true };
			} else {
				throw new Error(response.message || 'Failed to delete category');
			}
		} catch (error) {
			const errorMessage = error.message || 'Failed to delete category.';
			servicesStore.setError(errorMessage);
			toast.showError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			servicesStore.setLoading(false);
		}
	};

	// ==================== COMPANY SERVICES ====================

	/**
	 * Fetch services for a specific company
	 * @param {number} companyId - Company ID
	 * @param {object} params - Query parameters
	 * @param {number} params.page - Page number
	 * @param {number} params.limit - Items per page
	 * @param {string} params.search - Search query
	 * @param {number} params.categoryId - Filter by category
	 * @param {string} params.status - Filter by status
	 * @returns {Promise<object>} Result with services
	 */
	const fetchCompanyServices = async (companyId, params = {}) => {
		try {
			servicesStore.setLoading(true);
			servicesStore.clearError();

			const response = await servicesApi.getCompanyServices(companyId, params);

			if (response.success !== false) {
				const services = response.data || response;
				servicesStore.setServices(services);
				return { success: true, data: services, pagination: response.pagination };
			} else {
				throw new Error(response.message || 'Failed to fetch services');
			}
		} catch (error) {
			const errorMessage = error.message || 'Failed to fetch company services.';
			servicesStore.setError(errorMessage);
			toast.showError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			servicesStore.setLoading(false);
		}
	};

	/**
	 * Fetch my company's services (uses auth store to get company ID)
	 * @param {object} params - Query parameters
	 * @returns {Promise<object>} Result with services
	 */
	const fetchMyCompanyServices = async (params = {}) => {
		try {
			const companyId = authStore.companyId.value;

			if (!companyId) {
				throw new Error('No company associated with your account');
			}

			return await fetchCompanyServices(companyId, params);
		} catch (error) {
			const errorMessage = error.message || 'Failed to fetch your company services.';
			servicesStore.setError(errorMessage);
			toast.showError(errorMessage);
			return { success: false, error: errorMessage };
		}
	};

	/**
	 * Create a new service for a company
	 * @param {number} companyId - Company ID
	 * @param {object} serviceData - Service data
	 * @param {string} serviceData.name - Service name (required)
	 * @param {number} serviceData.categoryId - Category ID (required)
	 * @param {string} serviceData.description - Description (optional)
	 * @param {number} serviceData.price - Price (required)
	 * @param {number} serviceData.duration - Duration in minutes (optional)
	 * @param {string} serviceData.status - Status (optional)
	 * @returns {Promise<object>} Result with created service
	 */
	const createCompanyService = async (companyId, serviceData) => {
		try {
			servicesStore.setLoading(true);
			servicesStore.clearError();

			const response = await servicesApi.createCompanyService(companyId, serviceData);

			if (response.success !== false) {
				const newService = response.data || response;
				servicesStore.addService(newService);
				toast.showSuccess('Service created successfully!');
				return { success: true, data: newService };
			} else {
				throw new Error(response.message || 'Failed to create service');
			}
		} catch (error) {
			const errorMessage = error.message || 'Failed to create service.';
			servicesStore.setError(errorMessage);
			toast.showError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			servicesStore.setLoading(false);
		}
	};

	/**
	 * Get a specific company service
	 * @param {number} companyId - Company ID
	 * @param {number} serviceId - Service ID
	 * @returns {Promise<object>} Result with service data
	 */
	const fetchCompanyService = async (companyId, serviceId) => {
		try {
			servicesStore.setLoading(true);
			servicesStore.clearError();

			const response = await servicesApi.getCompanyService(companyId, serviceId);

			if (response.success !== false) {
				const service = response.data || response;
				servicesStore.setCurrentService(service);
				return { success: true, data: service };
			} else {
				throw new Error(response.message || 'Failed to fetch service');
			}
		} catch (error) {
			const errorMessage = error.message || 'Failed to fetch service.';
			servicesStore.setError(errorMessage);
			toast.showError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			servicesStore.setLoading(false);
		}
	};

	/**
	 * Update a company service
	 * @param {number} companyId - Company ID
	 * @param {number} serviceId - Service ID
	 * @param {object} serviceData - Updated service data
	 * @returns {Promise<object>} Result with updated service
	 */
	const updateCompanyService = async (companyId, serviceId, serviceData) => {
		try {
			servicesStore.setLoading(true);
			servicesStore.clearError();

			const response = await servicesApi.updateCompanyService(companyId, serviceId, serviceData);

			if (response.success !== false) {
				const updatedService = response.data || response;
				servicesStore.updateService(updatedService);
				toast.showSuccess('Service updated successfully!');
				return { success: true, data: updatedService };
			} else {
				throw new Error(response.message || 'Failed to update service');
			}
		} catch (error) {
			const errorMessage = error.message || 'Failed to update service.';
			servicesStore.setError(errorMessage);
			toast.showError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			servicesStore.setLoading(false);
		}
	};

	/**
	 * Delete a company service
	 * @param {number} companyId - Company ID
	 * @param {number} serviceId - Service ID
	 * @returns {Promise<object>} Result
	 */
	const deleteCompanyService = async (companyId, serviceId) => {
		try {
			servicesStore.setLoading(true);
			servicesStore.clearError();

			const response = await servicesApi.deleteCompanyService(companyId, serviceId);

			if (response.success !== false) {
				servicesStore.removeService(serviceId);
				toast.showSuccess('Service deleted successfully!');
				return { success: true };
			} else {
				throw new Error(response.message || 'Failed to delete service');
			}
		} catch (error) {
			const errorMessage = error.message || 'Failed to delete service.';
			servicesStore.setError(errorMessage);
			toast.showError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			servicesStore.setLoading(false);
		}
	};

	/**
	 * Get company service statistics
	 * @param {number} companyId - Company ID
	 * @returns {Promise<object>} Result with statistics
	 */
	const fetchCompanyServiceStats = async (companyId) => {
		try {
			servicesStore.setLoading(true);
			servicesStore.clearError();

			const response = await servicesApi.getCompanyServiceStats(companyId);

			if (response.success !== false) {
				const stats = response.data || response;
				return { success: true, data: stats };
			} else {
				throw new Error(response.message || 'Failed to fetch statistics');
			}
		} catch (error) {
			const errorMessage = error.message || 'Failed to fetch statistics.';
			servicesStore.setError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			servicesStore.setLoading(false);
		}
	};

	// ==================== GENERAL SERVICES ====================

	/**
	 * Fetch all services (public/admin view)
	 * @param {object} params - Query parameters
	 * @returns {Promise<object>} Result with services
	 */
	const fetchServices = async (params = {}) => {
		try {
			servicesStore.setLoading(true);
			servicesStore.clearError();

			const response = await servicesApi.getServices(params);

			if (response.success !== false) {
				const services = response.data || response;
				servicesStore.setServices(services);
				return { success: true, data: services, pagination: response.pagination };
			} else {
				throw new Error(response.message || 'Failed to fetch services');
			}
		} catch (error) {
			const errorMessage = error.message || 'Failed to fetch services.';
			servicesStore.setError(errorMessage);
			toast.showError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			servicesStore.setLoading(false);
		}
	};

	/**
	 * Fetch a specific service by ID
	 * @param {number} serviceId - Service ID
	 * @returns {Promise<object>} Result with service data
	 */
	const fetchService = async (serviceId) => {
		try {
			servicesStore.setLoading(true);
			servicesStore.clearError();

			const response = await servicesApi.getService(serviceId);

			if (response.success !== false) {
				const service = response.data || response;
				servicesStore.setCurrentService(service);
				return { success: true, data: service };
			} else {
				throw new Error(response.message || 'Failed to fetch service');
			}
		} catch (error) {
			const errorMessage = error.message || 'Failed to fetch service.';
			servicesStore.setError(errorMessage);
			toast.showError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			servicesStore.setLoading(false);
		}
	};

	/**
	 * Update an existing service (generic)
	 * @param {number} serviceId - Service ID
	 * @param {object} serviceData - Updated service data
	 * @returns {Promise<object>} Result with updated service
	 */
	const updateService = async (serviceId, serviceData) => {
		try {
			servicesStore.setLoading(true);
			servicesStore.clearError();

			const response = await servicesApi.updateService(serviceId, serviceData);

			if (response.success !== false) {
				const updatedService = response.data || response;
				servicesStore.updateService(updatedService);
				toast.showSuccess('Service updated successfully!');
				return { success: true, data: updatedService };
			} else {
				throw new Error(response.message || 'Failed to update service');
			}
		} catch (error) {
			const errorMessage = error.message || 'Failed to update service.';
			servicesStore.setError(errorMessage);
			toast.showError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			servicesStore.setLoading(false);
		}
	};

	/**
	 * Delete a service (generic)
	 * @param {number} serviceId - Service ID
	 * @returns {Promise<object>} Result
	 */
	const deleteService = async (serviceId) => {
		try {
			servicesStore.setLoading(true);
			servicesStore.clearError();

			const response = await servicesApi.deleteService(serviceId);

			if (response.success !== false) {
				servicesStore.removeService(serviceId);
				toast.showSuccess('Service deleted successfully!');
				return { success: true };
			} else {
				throw new Error(response.message || 'Failed to delete service');
			}
		} catch (error) {
			const errorMessage = error.message || 'Failed to delete service.';
			servicesStore.setError(errorMessage);
			toast.showError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			servicesStore.setLoading(false);
		}
	};

	/**
	 * Fetch popular services
	 * @param {object} params - Query parameters
	 * @returns {Promise<object>} Result with popular services
	 */
	const fetchPopularServices = async (params = {}) => {
		try {
			servicesStore.setLoading(true);
			servicesStore.clearError();

			const response = await servicesApi.getPopularServices(params);

			if (response.success !== false) {
				const services = response.data || response;
				return { success: true, data: services };
			} else {
				throw new Error(response.message || 'Failed to fetch popular services');
			}
		} catch (error) {
			const errorMessage = error.message || 'Failed to fetch popular services.';
			servicesStore.setError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			servicesStore.setLoading(false);
		}
	};

	// ==================== UTILITIES ====================

	/**
	 * Get service by ID from store
	 * @param {number} id - Service ID
	 * @returns {object|null} Service or null
	 */
	const getServiceById = (id) => {
		return servicesStore.getServiceById(id);
	};

	/**
	 * Get category by ID from store
	 * @param {number} id - Category ID
	 * @returns {object|null} Category or null
	 */
	const getCategoryById = (id) => {
		return servicesStore.getCategoryById(id);
	};

	/**
	 * Get services by category ID
	 * @param {number} categoryId - Category ID
	 * @returns {array} Services array
	 */
	const getServicesByCategory = (categoryId) => {
		return servicesStore.getServicesByCategory(categoryId);
	};

	/**
	 * Set current service
	 * @param {object} service - Service object
	 */
	const setCurrentService = (service) => {
		servicesStore.setCurrentService(service);
	};

	/**
	 * Clear current service
	 */
	const clearCurrentService = () => {
		servicesStore.clearCurrentService();
	};

	/**
	 * Clear all errors
	 */
	const clearError = () => {
		servicesStore.clearError();
	};

	return {
		// State
		state: servicesStore.state,
		servicesCount: servicesStore.servicesCount,
		categoriesCount: servicesStore.categoriesCount,
		activeServices: servicesStore.activeServices,
		inactiveServices: servicesStore.inactiveServices,
		hasServices: servicesStore.hasServices,
		hasCategories: servicesStore.hasCategories,

		// Categories Actions
		fetchServiceCategories,
		fetchServiceCategory,
		createServiceCategory,
		updateServiceCategory,
		deleteServiceCategory,
		getCategoryById,

		// Company Services Actions
		fetchCompanyServices,
		fetchMyCompanyServices,
		createCompanyService,
		fetchCompanyService,
		updateCompanyService,
		deleteCompanyService,
		fetchCompanyServiceStats,

		// General Services Actions
		fetchServices,
		fetchService,
		updateService,
		deleteService,
		fetchPopularServices,

		// Utilities
		getServiceById,
		getServicesByCategory,
		setCurrentService,
		clearCurrentService,
		clearError,
	};
};

export default useServices;
