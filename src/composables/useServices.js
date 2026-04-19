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
	const fetchServiceCategory = async (companyId, categoryId) => {
		try {
			servicesStore.setLoading(true);
			servicesStore.clearError();

			const response = await servicesApi.getCompanyCategory(companyId, categoryId);

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
	 * Create a new category for a specific company
	 * @param {number} companyId - Company ID
	 * @param {object} categoryData - Category data
	 * @returns {Promise<object>} Result with created category
	 */
	const createCompanyCategory = async (companyId, categoryData) => {
		try {
			servicesStore.setLoading(true);
			servicesStore.clearError();

			const response = await servicesApi.createCompanyCategory(companyId, categoryData);

			if (response.success !== false) {
				const raw = response.data || response;
				const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
				list.forEach((c) => servicesStore.addCategory(c));
				toast.showSuccess(
					list.length === 1
						? 'Category added to your company.'
						: `${list.length} categories added to your company.`,
				);
				return { success: true, data: list };
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
	 * Update a company category
	 * @param {number} companyId - Company ID
	 * @param {number} categoryId - Category ID
	 * @param {object} categoryData - Updated category data
	 * @returns {Promise<object>} Result with updated category
	 */
	const updateServiceCategory = async (companyId, categoryId, categoryData) => {
		try {
			servicesStore.setLoading(true);
			servicesStore.clearError();

			const response = await servicesApi.updateCompanyCategory(companyId, categoryId, categoryData);

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
	const deleteServiceCategory = async (companyId, categoryId) => {
		try {
			servicesStore.setLoading(true);
			servicesStore.clearError();

			const response = await servicesApi.deleteCompanyCategory(companyId, categoryId);

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
			servicesStore.setLoading(true);
			servicesStore.clearError();

			const response = await servicesApi.getMyCompanyServices(params);

			if (response.success !== false) {
				const services = response.data || response;
				servicesStore.setServices(services);
				return { success: true, data: services, pagination: response.pagination };
			} else {
				throw new Error(response.message || 'Failed to fetch your company services');
			}
		} catch (error) {
			const errorMessage = error.message || 'Failed to fetch your company services.';
			servicesStore.setError(errorMessage);
			toast.showError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			servicesStore.setLoading(false);
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
	const fetchCompanyService = async (serviceId) => {
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
	 * Update a company service
	 * @param {number} companyId - Company ID
	 * @param {number} serviceId - Service ID
	 * @param {object} serviceData - Updated service data
	 * @returns {Promise<object>} Result with updated service
	 */
	const updateCompanyService = async (serviceId, serviceData) => {
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
	 * Delete a company service
	 * @param {number} companyId - Company ID
	 * @param {number} serviceId - Service ID
	 * @returns {Promise<object>} Result
	 */
	const deleteCompanyService = async (serviceId) => {
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
	 * Get company service statistics
	 * @param {number} companyId - Company ID
	 * @returns {Promise<object>} Result with statistics
	 */
	const fetchCompanyServiceStats = async (companyId) => {
		try {
			servicesStore.setLoading(true);
			servicesStore.clearError();

			throw new Error('Service statistics endpoint has been removed from the API');

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
	/**
	 * Browse all services across all companies (customer-facing catalogue).
	 * Maps to GET /services.
	 * @param {object} [params] - Query parameters
	 * @param {number} [params.page] - Page number (default 1)
	 * @param {number} [params.limit] - Items per page (default 20)
	 * @param {string} [params.companyId] - Filter by company UUID
	 * @param {number} [params.categoryId] - Filter by service category ID
	 * @param {string} [params.search] - Search by service name
	 * @param {string} [params.priceType] - 'fixed' | 'hourly' | 'per_unit'
	 * @param {number} [params.cityId] - Filter by city ID
	 * @returns {Promise<{success: boolean, data?: array, pagination?: object, error?: string}>}
	 */
	const fetchServices = async (params = {}) => {
		try {
			servicesStore.setLoading(true);
			servicesStore.clearError();

			const response = await servicesApi.browseServices(params);

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

	// ==================== MY COMPANY – CATEGORIES ====================

	/**
	 * Fetch service categories for the authenticated user's company
	 * @param {object} params - Query parameters
	 * @returns {Promise<object>} Result with categories
	 */
	const fetchMyCompanyCategories = async (params = {}) => {
		try {
			servicesStore.setLoading(true);
			servicesStore.clearError();

			const response = await servicesApi.getMyCompanyCategories(params);

			if (response.success !== false) {
				const categories = response.data || response;
				servicesStore.setCategories(categories);
				return { success: true, data: categories };
			} else {
				throw new Error(response.message || 'Failed to fetch categories');
			}
		} catch (error) {
			const errorMessage = error.message || 'Failed to fetch company categories.';
			servicesStore.setError(errorMessage);
			toast.showError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			servicesStore.setLoading(false);
		}
	};

	/**
	 * Adopt platform master categories (subcategory UUIDs) into the user's company.
	 * @param {{ masterCategoryUuids: string[] }} body
	 * @returns {Promise<object>} Result with adopted categories array
	 */
	const createMyCompanyCategory = async (categoryData) => {
		try {
			servicesStore.setLoading(true);
			servicesStore.clearError();

			const response = await servicesApi.createMyCompanyCategory(categoryData);

			if (response.success !== false) {
				const raw = response.data || response;
				const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
				list.forEach((c) => servicesStore.addCategory(c));
				toast.showSuccess(
					list.length === 1
						? 'Category added to your company.'
						: `${list.length} categories added to your company.`,
				);
				return { success: true, data: list };
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
	 * Update a service category in the authenticated user's company
	 * @param {string} categoryId - Category UUID
	 * @param {object} categoryData
	 * @returns {Promise<object>} Result with updated category
	 */
	const updateMyCompanyCategory = async (categoryId, categoryData) => {
		try {
			servicesStore.setLoading(true);
			servicesStore.clearError();

			const response = await servicesApi.updateMyCompanyCategory(categoryId, categoryData);

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
	 * Delete a service category from the authenticated user's company
	 * @param {string} categoryId - Category UUID
	 * @returns {Promise<object>} Result
	 */
	const deleteMyCompanyCategory = async (categoryId) => {
		try {
			servicesStore.setLoading(true);
			servicesStore.clearError();

			const response = await servicesApi.deleteMyCompanyCategory(categoryId);

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

	// ==================== MY COMPANY – SERVICES ====================

	/**
	 * Create a service for the authenticated user's company
	 * @param {object} serviceData
	 * @returns {Promise<object>} Result with created service
	 */
	const createMyCompanyService = async (serviceData) => {
		try {
			servicesStore.setLoading(true);
			servicesStore.clearError();

			const response = await servicesApi.createMyCompanyService(serviceData);

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
	 * Fetch popular services
	 * @param {object} params - Query parameters
	 * @returns {Promise<object>} Result with popular services
	 */
	const fetchPopularServices = async (params = {}) => {
		try {
			servicesStore.setLoading(true);
			servicesStore.clearError();

			throw new Error('Popular services endpoint has been removed from the API');

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
		createCompanyCategory,
		updateServiceCategory,
		deleteServiceCategory,
		fetchMyCompanyCategories,
		createMyCompanyCategory,
		updateMyCompanyCategory,
		deleteMyCompanyCategory,
		getCategoryById,

		// Company Services Actions
		fetchCompanyServices,
		fetchMyCompanyServices,
		createCompanyService,
		createMyCompanyService,
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
