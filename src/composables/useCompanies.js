import { useCompaniesStore } from '@/stores/companies.store';
import { useAuthStore } from '@/stores/auth.store';
import * as companiesApi from '@/api/companies.api';
import { useToast } from './useToast';

/**
 * Companies Composable
 * Handles all company-related operations
 */
export const useCompanies = () => {
	const companiesStore = useCompaniesStore();
	const toast = useToast();

	/**
	 * Fetch all companies (paginated)
	 * @param {object} params - Query parameters
	 * @param {number} params.page - Page number
	 * @param {number} params.limit - Items per page
	 * @returns {Promise<object>} Result with companies
	 */
	const fetchCompanies = async (params = {}) => {
		try {
			companiesStore.setLoading(true);
			companiesStore.clearError();

			const response = await companiesApi.getCompanies(params);

			if (response.success !== false) {
				const companies = response.data || response;
				companiesStore.setCompanies(companies);
				return { success: true, data: companies, pagination: response.pagination };
			} else {
				throw new Error(response.message || 'Failed to fetch companies');
			}
		} catch (error) {
			const errorMessage = error.message || 'Failed to fetch companies.';
			companiesStore.setError(errorMessage);
			toast.showError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			companiesStore.setLoading(false);
		}
	};

	/**
	 * Fetch the current user's company
	 * @returns {Promise<object>} Result with company data
	 */
	const fetchMyCompany = async () => {
		try {
			companiesStore.setLoading(true);
			companiesStore.clearError();

			const response = await companiesApi.getMyCompany();

			if (response.success !== false) {
				const company = response.data || response;
				companiesStore.setCurrentCompany(company);
				return { success: true, data: company };
			} else {
				throw new Error(response.message || 'Failed to fetch your company');
			}
		} catch (error) {
			const errorMessage = error.message || 'Failed to fetch your company.';
			companiesStore.setError(errorMessage);
			toast.showError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			companiesStore.setLoading(false);
		}
	};

	/**
	 * Fetch a specific company by ID
	 * @param {number} companyId - Company ID
	 * @returns {Promise<object>} Result with company data
	 */
	const fetchCompany = async (companyId) => {
		try {
			companiesStore.setLoading(true);
			companiesStore.clearError();

			const response = await companiesApi.getCompany(companyId);

			if (response.success !== false) {
				const company = response.data || response;
				companiesStore.setCurrentCompany(company);
				return { success: true, data: company };
			} else {
				throw new Error(response.message || 'Failed to fetch company');
			}
		} catch (error) {
			const errorMessage = error.message || 'Failed to fetch company.';
			companiesStore.setError(errorMessage);
			toast.showError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			companiesStore.setLoading(false);
		}
	};

	/**
	 * Create a new company
	 * @param {object} companyData - Company data
	 * @param {string} companyData.name - Company name (required)
	 * @param {string} companyData.email - Company email (required)
	 * @param {string} companyData.phone - Company phone (required)
	 * @param {string} companyData.address - Address (optional)
	 * @param {string} companyData.city - City (optional)
	 * @param {string} companyData.country - Country (optional)
	 * @returns {Promise<object>} Result with created company
	 */
	const createCompany = async (companyData) => {
		try {
			companiesStore.setLoading(true);
			companiesStore.clearError();

			const response = await companiesApi.createCompany(companyData);

			if (response.success !== false) {
				const newCompany = response.data || response;
				companiesStore.addCompany(newCompany);
				toast.showSuccess('Company created successfully!');
				return { success: true, data: newCompany };
			} else {
				throw new Error(response.message || 'Failed to create company');
			}
		} catch (error) {
			const errorMessage = error.message || 'Failed to create company.';
			companiesStore.setError(errorMessage);
			toast.showError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			companiesStore.setLoading(false);
		}
	};

	/**
	 * Update an existing company
	 * @param {number} companyId - Company ID
	 * @param {object} companyData - Updated company data
	 * @returns {Promise<object>} Result with updated company
	 */
	const updateCompany = async (companyId, companyData) => {
		try {
			companiesStore.setLoading(true);
			companiesStore.clearError();

			const response = await companiesApi.updateCompany(companyId, companyData);

			if (response.success !== false) {
				const updatedCompany = response.data || response;
				companiesStore.updateCompany(updatedCompany);
				toast.showSuccess('Company updated successfully!');
				return { success: true, data: updatedCompany };
			} else {
				throw new Error(response.message || 'Failed to update company');
			}
		} catch (error) {
			const errorMessage = error.message || 'Failed to update company.';
			companiesStore.setError(errorMessage);
			toast.showError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			companiesStore.setLoading(false);
		}
	};

	/**
	 * Delete a company
	 * @param {number} companyId - Company ID
	 * @returns {Promise<object>} Result
	 */
	const deleteCompany = async (companyId) => {
		try {
			companiesStore.setLoading(true);
			companiesStore.clearError();

			const response = await companiesApi.deleteCompany(companyId);

			if (response.success !== false) {
				companiesStore.removeCompany(companyId);
				toast.showSuccess('Company deleted successfully!');
				return { success: true };
			} else {
				throw new Error(response.message || 'Failed to delete company');
			}
		} catch (error) {
			const errorMessage = error.message || 'Failed to delete company.';
			companiesStore.setError(errorMessage);
			toast.showError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			companiesStore.setLoading(false);
		}
	};

	// ==================== MEMBERS ====================

	/**
	 * Fetch company members
	 * @param {number} companyId - Company ID
	 * @param {object} params - Query parameters
	 * @returns {Promise<object>} Result with members
	 */
	const fetchCompanyMembers = async (companyId, params = {}) => {
		try {
			companiesStore.setLoading(true);
			companiesStore.clearError();

			const response = await companiesApi.getCompanyMembers(companyId, params);

			if (response.success !== false) {
				const members = response.data || response;
				companiesStore.setCurrentCompanyMembers(members);
				return { success: true, data: members, pagination: response.pagination };
			} else {
				throw new Error(response.message || 'Failed to fetch members');
			}
		} catch (error) {
			const errorMessage = error.message || 'Failed to fetch company members.';
			companiesStore.setError(errorMessage);
			toast.showError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			companiesStore.setLoading(false);
		}
	};

	/**
	 * Add a member to a company
	 * @param {number} companyId - Company ID
	 * @param {object} memberData - Member data
	 * @param {string} memberData.userId - User ID
	 * @param {string} memberData.role - Role (optional)
	 * @returns {Promise<object>} Result
	 */
	const addCompanyMember = async (companyId, memberData) => {
		try {
			companiesStore.setLoading(true);
			companiesStore.clearError();

			const response = await companiesApi.addCompanyMember(companyId, memberData);

			if (response.success !== false) {
				const newMember = response.data || response;
				companiesStore.addCurrentCompanyMember(newMember);
				toast.showSuccess('Member added successfully!');
				return { success: true, data: newMember };
			} else {
				throw new Error(response.message || 'Failed to add member');
			}
		} catch (error) {
			const errorMessage = error.message || 'Failed to add member.';
			companiesStore.setError(errorMessage);
			toast.showError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			companiesStore.setLoading(false);
		}
	};

	/**
	 * Update a company member
	 * @param {number} companyId - Company ID
	 * @param {number} userId - User ID
	 * @param {object} memberData - Updated member data
	 * @returns {Promise<object>} Result
	 */
	const updateCompanyMember = async (companyId, userId, memberData) => {
		try {
			companiesStore.setLoading(true);
			companiesStore.clearError();

			const response = await companiesApi.updateCompanyMember(companyId, userId, memberData);

			if (response.success !== false) {
				const updatedMember = response.data || response;
				companiesStore.updateCurrentCompanyMember(updatedMember);
				toast.showSuccess('Member updated successfully!');
				return { success: true, data: updatedMember };
			} else {
				throw new Error(response.message || 'Failed to update member');
			}
		} catch (error) {
			const errorMessage = error.message || 'Failed to update member.';
			companiesStore.setError(errorMessage);
			toast.showError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			companiesStore.setLoading(false);
		}
	};

	/**
	 * Remove a member from a company
	 * @param {number} companyId - Company ID
	 * @param {number} userId - User ID
	 * @returns {Promise<object>} Result
	 */
	const removeCompanyMember = async (companyId, userId) => {
		try {
			companiesStore.setLoading(true);
			companiesStore.clearError();

			const response = await companiesApi.removeCompanyMember(companyId, userId);

			if (response.success !== false) {
				companiesStore.removeCurrentCompanyMember(userId);
				toast.showSuccess('Member removed successfully!');
				return { success: true };
			} else {
				throw new Error(response.message || 'Failed to remove member');
			}
		} catch (error) {
			const errorMessage = error.message || 'Failed to remove member.';
			companiesStore.setError(errorMessage);
			toast.showError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			companiesStore.setLoading(false);
		}
	};

	// ==================== LOCATIONS ====================

	/**
	 * Fetch company locations
	 * @param {number} companyId - Company ID
	 * @returns {Promise<object>} Result with locations
	 */
	const fetchCompanyLocations = async (companyId) => {
		try {
			companiesStore.setLoading(true);
			companiesStore.clearError();

			const response = await companiesApi.getCompanyLocations(companyId);

			if (response.success !== false) {
				const locations = response.data || response;
				companiesStore.setCurrentCompanyLocations(locations);
				return { success: true, data: locations };
			} else {
				throw new Error(response.message || 'Failed to fetch locations');
			}
		} catch (error) {
			const errorMessage = error.message || 'Failed to fetch company locations.';
			companiesStore.setError(errorMessage);
			toast.showError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			companiesStore.setLoading(false);
		}
	};

	/**
	 * Add a location to a company
	 * @param {number} companyId - Company ID
	 * @param {object} locationData - Location data
	 * @returns {Promise<object>} Result with created location
	 */
	const addCompanyLocation = async (companyId, locationData) => {
		try {
			companiesStore.setLoading(true);
			companiesStore.clearError();

			const response = await companiesApi.addCompanyLocation(companyId, locationData);

			if (response.success !== false) {
				const newLocation = response.data || response;
				companiesStore.addCurrentCompanyLocation(newLocation);
				toast.showSuccess('Location added successfully!');
				return { success: true, data: newLocation };
			} else {
				throw new Error(response.message || 'Failed to add location');
			}
		} catch (error) {
			const errorMessage = error.message || 'Failed to add location.';
			companiesStore.setError(errorMessage);
			toast.showError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			companiesStore.setLoading(false);
		}
	};

	/**
	 * Update a company location
	 * @param {number} companyId - Company ID
	 * @param {number} locationId - Location ID
	 * @param {object} locationData - Updated location data
	 * @returns {Promise<object>} Result with updated location
	 */


	/**
	 * Delete a company location
	 * @param {number} companyId - Company ID
	 * @param {number} locationId - Location ID
	 * @returns {Promise<object>} Result
	 */
	const deleteCompanyLocation = async (companyId, locationId) => {
		try {
			companiesStore.setLoading(true);
			companiesStore.clearError();

			const response = await companiesApi.deleteCompanyLocation(companyId, locationId);

			if (response.success !== false) {
				companiesStore.removeCurrentCompanyLocation(locationId);
				toast.showSuccess('Location deleted successfully!');
				return { success: true };
			} else {
				throw new Error(response.message || 'Failed to delete location');
			}
		} catch (error) {
			const errorMessage = error.message || 'Failed to delete location.';
			companiesStore.setError(errorMessage);
			toast.showError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			companiesStore.setLoading(false);
		}
	};

	// ==================== CATEGORIES ====================

	/**
	 * Fetch company categories
	 * @param {number} companyId - Company ID
	 * @returns {Promise<object>} Result with categories
	 */
	const fetchCompanyCategories = async (companyId) => {
		try {
			companiesStore.setLoading(true);
			companiesStore.clearError();

			const response = await companiesApi.getCompanyCategories(companyId);

			if (response.success !== false) {
				const categories = response.data || response;
				companiesStore.setCurrentCompanyCategories(categories);
				return { success: true, data: categories };
			} else {
				throw new Error(response.message || 'Failed to fetch categories');
			}
		} catch (error) {
			const errorMessage = error.message || 'Failed to fetch company categories.';
			companiesStore.setError(errorMessage);
			toast.showError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			companiesStore.setLoading(false);
		}
	};

	/**
	 * Create a company category
	 * @param {number} companyId - Company ID
	 * @param {object} categoryData - Category data
	 * @returns {Promise<object>} Result with created category
	 */
	const createCompanyCategory = async (companyId, categoryData) => {
		try {
			companiesStore.setLoading(true);
			companiesStore.clearError();

			const response = await companiesApi.createCompanyCategory(companyId, categoryData);

			if (response.success !== false) {
				const raw = response.data || response;
				const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
				list.forEach((c) => companiesStore.addCurrentCompanyCategory(c));
				toast.showSuccess(
					list.length === 1
						? 'Category added successfully!'
						: `${list.length} categories added successfully!`,
				);
				return { success: true, data: list };
			} else {
				throw new Error(response.message || 'Failed to create category');
			}
		} catch (error) {
			const errorMessage = error.message || 'Failed to create category.';
			companiesStore.setError(errorMessage);
			toast.showError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			companiesStore.setLoading(false);
		}
	};

	/**
	 * Update a company category
	 * @param {number} companyId - Company ID
	 * @param {number} categoryId - Category ID
	 * @param {object} categoryData - Updated category data
	 * @returns {Promise<object>} Result with updated category
	 */
	const updateCompanyCategory = async (companyId, categoryId, categoryData) => {
		try {
			companiesStore.setLoading(true);
			companiesStore.clearError();

			const response = await companiesApi.updateCompanyCategory(companyId, categoryId, categoryData);

			if (response.success !== false) {
				const updatedCategory = response.data || response;
				companiesStore.updateCurrentCompanyCategory(updatedCategory);
				toast.showSuccess('Category updated successfully!');
				return { success: true, data: updatedCategory };
			} else {
				throw new Error(response.message || 'Failed to update category');
			}
		} catch (error) {
			const errorMessage = error.message || 'Failed to update category.';
			companiesStore.setError(errorMessage);
			toast.showError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			companiesStore.setLoading(false);
		}
	};

	/**
	 * Delete a company category
	 * @param {number} companyId - Company ID
	 * @param {number} categoryId - Category ID
	 * @returns {Promise<object>} Result
	 */
	const deleteCompanyCategory = async (companyId, categoryId) => {
		try {
			companiesStore.setLoading(true);
			companiesStore.clearError();

			const response = await companiesApi.deleteCompanyCategory(companyId, categoryId);

			if (response.success !== false) {
				companiesStore.removeCurrentCompanyCategory(categoryId);
				toast.showSuccess('Category deleted successfully!');
				return { success: true };
			} else {
				throw new Error(response.message || 'Failed to delete category');
			}
		} catch (error) {
			const errorMessage = error.message || 'Failed to delete category.';
			companiesStore.setError(errorMessage);
			toast.showError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			companiesStore.setLoading(false);
		}
	};

	// ==================== MY COMPANY ====================

	const updateMyCompany = async (companyData) => {
		try {
			companiesStore.setLoading(true);
			companiesStore.clearError();
			const response = await companiesApi.updateMyCompany(companyData);
			if (response.success !== false) {
				const updatedCompany = response.data ?? response;
				companiesStore.updateCompany(updatedCompany);
				return { success: true, data: updatedCompany };
			} else {
				throw new Error(response.message || 'Failed to update company');
			}
		} catch (error) {
			const errorMessage = error.message || 'Failed to update company.';
			companiesStore.setError(errorMessage);
			toast.showError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			companiesStore.setLoading(false);
		}
	};

	const fetchMyCompanyMembers = async (params = {}) => {
		try {
			companiesStore.setLoading(true);
			companiesStore.clearError();
			const response = await companiesApi.getMyCompanyMembers(params);
			if (response.success !== false) {
				const members = response.data || response;
				companiesStore.setCurrentCompanyMembers(members);
				return { success: true, data: members, pagination: response.pagination };
			} else {
				throw new Error(response.message || 'Failed to fetch members');
			}
		} catch (error) {
			const errorMessage = error.message || 'Failed to fetch company members.';
			companiesStore.setError(errorMessage);
			toast.showError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			companiesStore.setLoading(false);
		}
	};

	const addMyCompanyMember = async (memberData) => {
		try {
			companiesStore.setLoading(true);
			companiesStore.clearError();
			console.log('memberData;', memberData);
			const response = await companiesApi.addMyCompanyMember(memberData);
			if (response.success !== false) {
				const newMember = response.data || response;
				companiesStore.addCurrentCompanyMember(newMember);
				toast.showSuccess('Member added successfully!');
				return { success: true, data: newMember };
			} else {
				throw new Error(response.message || 'Failed to add member');
			}
		} catch (error) {
			const errorMessage = error.message || 'Failed to add member.';
			companiesStore.setError(errorMessage);
			toast.showError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			companiesStore.setLoading(false);
		}
	};

	const updateMyCompanyMember = async (userId, memberData) => {
		try {
			companiesStore.setLoading(true);
			companiesStore.clearError();
			const response = await companiesApi.updateMyCompanyMember(userId, memberData);
			if (response.success !== false) {
				const updatedMember = response.data || response;
				companiesStore.updateCurrentCompanyMember(updatedMember);
				toast.showSuccess('Member updated successfully!');
				return { success: true, data: updatedMember };
			} else {
				throw new Error(response.message || 'Failed to update member');
			}
		} catch (error) {
			const errorMessage = error.message || 'Failed to update member.';
			companiesStore.setError(errorMessage);
			toast.showError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			companiesStore.setLoading(false);
		}
	};

	const removeMyCompanyMember = async (userId) => {
		try {
			companiesStore.setLoading(true);
			companiesStore.clearError();
			const response = await companiesApi.removeMyCompanyMember(userId);
			if (response.success !== false) {
				companiesStore.removeCurrentCompanyMember(userId);
				toast.showSuccess('Member removed successfully!');
				return { success: true };
			} else {
				throw new Error(response.message || 'Failed to remove member');
			}
		} catch (error) {
			const errorMessage = error.message || 'Failed to remove member.';
			companiesStore.setError(errorMessage);
			toast.showError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			companiesStore.setLoading(false);
		}
	};

	const fetchMyCompanyInvitations = async () => {
		try {
			companiesStore.setLoading(true);
			companiesStore.clearError();
			const response = await companiesApi.getMyCompanyInvitations();
			if (response.success !== false) {
				const invitations = response.data || response;
				return { success: true, data: invitations };
			} else {
				throw new Error(response.message || 'Failed to fetch invitations');
			}
		} catch (error) {
			const errorMessage = error.message || 'Failed to fetch company invitations.';
			companiesStore.setError(errorMessage);
			toast.showError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			companiesStore.setLoading(false);
		}
	};

	const cancelMyCompanyInvitation = async (invitationId) => {
		try {
			companiesStore.setLoading(true);
			companiesStore.clearError();
			const response = await companiesApi.cancelMyCompanyInvitation(invitationId);
			if (response.success !== false) {
				toast.showSuccess('Invitation cancelled successfully!');
				return { success: true };
			} else {
				throw new Error(response.message || 'Failed to cancel invitation');
			}
		} catch (error) {
			const errorMessage = error.message || 'Failed to cancel invitation.';
			companiesStore.setError(errorMessage);
			toast.showError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			companiesStore.setLoading(false);
		}
	};

	const resendMyCompanyInvitation = async (invitationId) => {
		try {
			companiesStore.setLoading(true);
			companiesStore.clearError();
			const response = await companiesApi.resendMyCompanyInvitation(invitationId);
			if (response.success !== false) {
				toast.showSuccess(response.message || 'Invitation email sent again.');
				return { success: true };
			} else {
				throw new Error(response.message || 'Failed to resend invitation');
			}
		} catch (error) {
			const errorMessage = error.message || 'Failed to resend invitation.';
			companiesStore.setError(errorMessage);
			toast.showError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			companiesStore.setLoading(false);
		}
	};

	const fetchMyCompanyLocations = async () => {
		try {
			companiesStore.setLoading(true);
			companiesStore.clearError();
			const response = await companiesApi.getMyCompanyLocations();
			if (response.success !== false) {
				const locations = response.data || response;
				companiesStore.setCurrentCompanyLocations(locations);
				return { success: true, data: locations };
			} else {
				throw new Error(response.message || 'Failed to fetch locations');
			}
		} catch (error) {
			const errorMessage = error.message || 'Failed to fetch company locations.';
			companiesStore.setError(errorMessage);
			toast.showError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			companiesStore.setLoading(false);
		}
	};

	const addMyCompanyLocation = async (locationData) => {
		try {
			companiesStore.setLoading(true);
			companiesStore.clearError();
			const response = await companiesApi.addMyCompanyLocation(locationData);
			if (response.success !== false) {
				const newLocation = response.data || response;
				companiesStore.addCurrentCompanyLocation(newLocation);
				toast.showSuccess('Location added successfully!');
				return { success: true, data: newLocation };
			} else {
				throw new Error(response.message || 'Failed to add location');
			}
		} catch (error) {
			const errorMessage = error.message || 'Failed to add location.';
			companiesStore.setError(errorMessage);
			toast.showError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			companiesStore.setLoading(false);
		}
	};

	const updateMyCompanyLocation = async (locationId, locationData) => {
		try {
			companiesStore.setLoading(true);
			companiesStore.clearError();
			const response = await companiesApi.updateMyCompanyLocation(locationId, locationData);
			if (response.success !== false) {
				const updated = response.data || response;
				companiesStore.updateCurrentCompanyLocation(updated);
				toast.showSuccess('Location updated successfully!');
				return { success: true, data: updated };
			}
			throw new Error(response.message || 'Failed to update location');
		} catch (error) {
			const errorMessage = error.message || 'Failed to update location.';
			companiesStore.setError(errorMessage);
			toast.showError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			companiesStore.setLoading(false);
		}
	};

	const fetchMyCompanyServiceRequests = async (params = {}) => {
		try {
			companiesStore.setLoading(true);
			companiesStore.clearError();
			const response = await companiesApi.getMyCompanyServiceRequests(params);
			if (response.success !== false) {
				const requests = response.data || response;
				return { success: true, data: requests, pagination: response.pagination };
			} else {
				throw new Error(response.message || 'Failed to fetch company service requests');
			}
		} catch (error) {
			const errorMessage = error.message || 'Failed to fetch company service requests.';
			companiesStore.setError(errorMessage);
			toast.showError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			companiesStore.setLoading(false);
		}
	};

	const deleteMyCompanyLocation = async (locationId) => {
		try {
			companiesStore.setLoading(true);
			companiesStore.clearError();
			const response = await companiesApi.deleteMyCompanyLocation(locationId);
			if (response.success !== false) {
				companiesStore.removeCurrentCompanyLocation(locationId);
				toast.showSuccess('Location deleted successfully!');
				return { success: true };
			} else {
				throw new Error(response.message || 'Failed to delete location');
			}
		} catch (error) {
			const errorMessage = error.message || 'Failed to delete location.';
			companiesStore.setError(errorMessage);
			toast.showError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			companiesStore.setLoading(false);
		}
	};

	const fetchMyLocationFixedStaff = async (locationUuid) => {
		try {
			const response = await companiesApi.getMyCompanyLocationFixedStaff(locationUuid);
			if (response.success !== false) {
				return { success: true, data: response.data || response };
			}
			throw new Error(response.message || 'Failed to load fixed staff');
		} catch (error) {
			const errorMessage = error.message || 'Failed to load fixed staff.';
			toast.showError(errorMessage);
			return { success: false, error: errorMessage };
		}
	};

	const replaceMyLocationFixedStaff = async (locationUuid, userUuids) => {
		try {
			const response = await companiesApi.replaceMyCompanyLocationFixedStaff(
				locationUuid,
				userUuids,
			);
			if (response.success !== false) {
				toast.showSuccess(response.message || 'Fixed-site staff updated');
				return { success: true, data: response.data || response };
			}
			throw new Error(response.message || 'Failed to update fixed staff');
		} catch (error) {
			const errorMessage = error.message || 'Failed to update fixed staff.';
			toast.showError(errorMessage);
			return { success: false, error: errorMessage };
		}
	};

	// ==================== UTILITIES ====================

	/**
	 * Get company by ID from store
	 * @param {number} id - Company ID
	 * @returns {object|null} Company or null
	 */
	const getCompanyById = (id) => {
		return companiesStore.getCompanyById(id);
	};

	/**
	 * Set current company
	 * @param {object} company - Company object
	 */
	const setCurrentCompany = (company) => {
		companiesStore.setCurrentCompany(company);
	};

	/**
	 * Clear current company
	 */
	const clearCurrentCompany = () => {
		companiesStore.clearCurrentCompany();
	};

	return {
		// State
		state: companiesStore.state,
		companiesCount: companiesStore.companiesCount,
		activeCompanies: companiesStore.activeCompanies,
		inactiveCompanies: companiesStore.inactiveCompanies,
		hasCompanies: companiesStore.hasCompanies,
		currentCompanyMembersCount: companiesStore.currentCompanyMembersCount,
		currentCompanyLocationsCount: companiesStore.currentCompanyLocationsCount,

		// Company Actions
		fetchCompanies,
		fetchMyCompany,
		fetchCompany,
		createCompany,
		updateCompany,
		deleteCompany,
		getCompanyById,
		setCurrentCompany,
		clearCurrentCompany,

		// Members Actions
		fetchCompanyMembers,
		addCompanyMember,
		updateCompanyMember,
		removeCompanyMember,

		// Locations Actions
		fetchCompanyLocations,
		addCompanyLocation,
		deleteCompanyLocation,

		// Categories Actions
		fetchCompanyCategories,
		createCompanyCategory,
		updateCompanyCategory,
		deleteCompanyCategory,

		// My Company Actions
		updateMyCompany,
		fetchMyCompanyMembers,
		addMyCompanyMember,
		updateMyCompanyMember,
		removeMyCompanyMember,
		fetchMyCompanyInvitations,
		cancelMyCompanyInvitation,
		resendMyCompanyInvitation,
		fetchMyCompanyLocations,
		addMyCompanyLocation,
		updateMyCompanyLocation,
		deleteMyCompanyLocation,
		fetchMyLocationFixedStaff,
		replaceMyLocationFixedStaff,
		fetchMyCompanyServiceRequests,
	};
};

export default useCompanies;
