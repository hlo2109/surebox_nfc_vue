import apiClient, { handleApiError } from './config';

/**
 * Users API Module
 * Handles all user management API calls (admin only)
 */

/**
 * Get a paginated, searchable list of all users
 * @param {object} params - Query parameters
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Items per page, max 100 (default: 20)
 * @param {string} params.search - Filter by name or email (partial match, optional)
 * @returns {Promise<object>} Response with users array and pagination
 */
export const getAllUsers = async (params = {}) => {
	try {
		const response = await apiClient.get('/admin/users', { params });
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Get full profile for a specific user including roles, permissions and company memberships
 * @param {string} userId - User UUID
 * @returns {Promise<object>} Response with user detail data
 */
export const getUser = async (userId) => {
	try {
		const response = await apiClient.get(`/admin/users/${userId}`);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Update a user's profile fields
 * @param {string} userId - User UUID
 * @param {object} userData - Fields to update
 * @param {string} userData.name - Full name (optional)
 * @param {string} userData.email - Email address (optional)
 * @param {string} userData.phone - Phone number (optional)
 * @returns {Promise<object>} Response with updated user data
 */
export const updateUser = async (userId, userData) => {
	try {
		const response = await apiClient.put(`/admin/users/${userId}`, userData);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Permanently delete a user account and remove all associated role assignments
 * @param {string} userId - User UUID
 * @returns {Promise<object>} Response
 */
export const deleteUser = async (userId) => {
	try {
		const response = await apiClient.delete(`/admin/users/${userId}`);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Assign a system role to a user
 * Note: The user's JWT must be refreshed for the change to take effect on subsequent requests.
 * @param {string} userId - User UUID
 * @param {string} roleId - Role UUID
 * @returns {Promise<object>} Response with updated user detail data
 */
export const assignRoleToUser = async (userId, roleId) => {
	try {
		const response = await apiClient.post(`/admin/users/${userId}/roles/${roleId}`);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Remove a system role from a user
 * Note: The user's JWT must be refreshed for the change to take effect.
 * @param {string} userId - User UUID
 * @param {string} roleId - Role UUID
 * @returns {Promise<object>} Response with updated user detail data
 */
export const removeRoleFromUser = async (userId, roleId) => {
	try {
		const response = await apiClient.delete(`/admin/users/${userId}/roles/${roleId}`);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

export default {
	getAllUsers,
	getUser,
	updateUser,
	deleteUser,
	assignRoleToUser,
	removeRoleFromUser,
};
