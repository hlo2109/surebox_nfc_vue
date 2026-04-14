import apiClient, { handleApiError } from './config';

/**
 * Roles & Permissions API Module
 * Handles all role and permission management (admin only)
 */

// ==================== ROLES ====================

/**
 * List all system roles (paginated)
 * @param {object} params - Query parameters
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Items per page (default: 20)
 * @returns {Promise<object>} Response with roles array and pagination
 */
export const getRoles = async (params = {}) => {
	try {
		const response = await apiClient.get('/admin/roles', { params });
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Get a specific role including its assigned permissions
 * @param {number} roleId - Role ID
 * @returns {Promise<object>} Response with role details and permissions
 */
export const getRole = async (roleId) => {
	try {
		const response = await apiClient.get(`/admin/roles/${roleId}`);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Create a new system role
 * @param {object} roleData - Role data
 * @param {string} roleData.name - Role name (required)
 * @param {string} roleData.description - Role description (optional)
 * @returns {Promise<object>} Response with created role
 */
export const createRole = async (roleData) => {
	try {
		const response = await apiClient.post('/admin/roles', roleData);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Update an existing role's name and/or description
 * @param {number} roleId - Role ID
 * @param {object} roleData - Updated role data
 * @param {string} roleData.name - Role name (optional)
 * @param {string} roleData.description - Role description (optional)
 * @returns {Promise<object>} Response with updated role
 */
export const updateRole = async (roleId, roleData) => {
	try {
		const response = await apiClient.put(`/admin/roles/${roleId}`, roleData);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Permanently delete a role (removes it from all users who hold it)
 * @param {number} roleId - Role ID
 * @returns {Promise<object>} Response
 */
export const deleteRole = async (roleId) => {
	try {
		const response = await apiClient.delete(`/admin/roles/${roleId}`);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

// ==================== ROLE ↔ PERMISSION ASSIGNMENT ====================

/**
 * Assign an existing permission to a role
 * @param {number} roleId - Role ID
 * @param {number} permissionId - Permission ID
 * @returns {Promise<object>} Response
 */
export const assignPermissionToRole = async (roleId, permissionId) => {
	try {
		const response = await apiClient.post(`/admin/roles/${roleId}/permissions/${permissionId}`);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Remove a permission from a role
 * @param {number} roleId - Role ID
 * @param {number} permissionId - Permission ID
 * @returns {Promise<object>} Response
 */
export const removePermissionFromRole = async (roleId, permissionId) => {
	try {
		const response = await apiClient.delete(`/admin/roles/${roleId}/permissions/${permissionId}`);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

// ==================== PERMISSIONS ====================

/**
 * List all available permissions in the system
 * @returns {Promise<object>} Response with permissions array
 */
export const getPermissions = async () => {
	try {
		const response = await apiClient.get('/admin/permissions');
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Get a specific permission by ID
 * @param {number} permissionId - Permission ID
 * @returns {Promise<object>} Response with permission details
 */
export const getPermission = async (permissionId) => {
	try {
		const response = await apiClient.get(`/admin/permissions/${permissionId}`);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Create a new atomic permission
 * @param {object} permissionData - Permission data
 * @param {string} permissionData.name - Permission name in snake_case action_resource format (required)
 * @param {string} permissionData.description - Permission description (optional)
 * @returns {Promise<object>} Response with created permission
 */
export const createPermission = async (permissionData) => {
	try {
		const response = await apiClient.post('/admin/permissions', permissionData);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Update an existing permission's name and/or description
 * @param {number} permissionId - Permission ID
 * @param {object} permissionData - Updated permission data
 * @param {string} permissionData.name - Permission name (optional)
 * @param {string} permissionData.description - Permission description (optional)
 * @returns {Promise<object>} Response
 */
export const updatePermission = async (permissionId, permissionData) => {
	try {
		const response = await apiClient.put(`/admin/permissions/${permissionId}`, permissionData);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Permanently delete a permission (removes it from all roles that hold it)
 * @param {number} permissionId - Permission ID
 * @returns {Promise<object>} Response
 */
export const deletePermission = async (permissionId) => {
	try {
		const response = await apiClient.delete(`/admin/permissions/${permissionId}`);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

export default {
	// Roles
	getRoles,
	getRole,
	createRole,
	updateRole,
	deleteRole,

	// Role ↔ Permission assignment
	assignPermissionToRole,
	removePermissionFromRole,

	// Permissions
	getPermissions,
	getPermission,
	createPermission,
	updatePermission,
	deletePermission,
};
