import apiClient, { handleApiError } from './config';

/**
 * Authentication API Module
 * Handles all authentication-related API calls
 */

/**
 * Register a new user account
 * @param {object} userData - User registration data
 * @param {string} userData.name - User's full name
 * @param {string} userData.email - User's email
 * @param {string} userData.password - User's password
 * @param {string} userData.phone - User's phone number (optional)
 * @param {object} userData.company - Company data for company registration (optional)
 * @returns {Promise<object>} Response with user data
 */
export const register = async (userData) => {
	try {
		const response = await apiClient.post('/auth/register', userData);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Login user and receive JWT tokens
 * @param {object} credentials - Login credentials
 * @param {string} credentials.email - User's email
 * @param {string} credentials.password - User's password
 * @returns {Promise<object>} Response with tokens and user data
 */
export const login = async (credentials) => {
	try {
		if (import.meta.env.DEV) {
			console.log('Login attempt for:', credentials.email);
		}
		const response = await apiClient.post('/auth/login', credentials);
		if (import.meta.env.DEV) {
			console.log('Login successful');
		}
		return response.data;
	} catch (error) {
		if (import.meta.env.DEV) {
			console.error('Login error:', error.message);
		}
		throw new Error(handleApiError(error));
	}
};

/**
 * Refresh access token using refresh token
 * @param {string} refreshToken - JWT refresh token
 * @returns {Promise<object>} Response with new access token
 */
export const refreshToken = async (refreshToken) => {
	try {
		const response = await apiClient.post('/auth/refresh', { refreshToken });
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Change user password
 * @param {object} passwordData - Password change data
 * @param {string} passwordData.currentPassword - Current password
 * @param {string} passwordData.newPassword - New password
 * @returns {Promise<object>} Response
 */
export const changePassword = async (passwordData) => {
	try {
		const response = await apiClient.post('/auth/change-password', passwordData);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Logout user and invalidate session
 * @returns {Promise<object>} Response
 */
export const logout = async () => {
	try {
		const response = await apiClient.post('/auth/logout');
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Get current authenticated user information
 * @returns {Promise<object>} Response with user data
 */
export const getCurrentUser = async () => {
	try {
		const response = await apiClient.get('/auth/me');
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

export default {
	register,
	login,
	refreshToken,
	changePassword,
	logout,
	getCurrentUser,
};
