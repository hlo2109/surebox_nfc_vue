import apiClient, { handleApiError } from './config';
import { ApiAuth } from '@/constants/apiRoutes';

/**
 * Authentication API — register, login, tokens, profile, invitations.
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
		const response = await apiClient.post(ApiAuth.REGISTER, userData);
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
		console.log('Login attempt for:', credentials);
		const response = await apiClient.post(ApiAuth.LOGIN, credentials);
		if (import.meta.env.DEV) {
			console.log('Login successful');
		}
		return response.data;
	} catch (error) {
		console.log('error;', error);
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
		const response = await apiClient.post(ApiAuth.REFRESH, { refreshToken });
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
		const response = await apiClient.post(ApiAuth.CHANGE_PASSWORD, passwordData);
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
		const response = await apiClient.post(ApiAuth.LOGOUT);
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
		const response = await apiClient.get(ApiAuth.ME);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Get invitation details by token
 * @param {string} token - Invitation token from email link
 * @returns {Promise<object>} Response with invitation data
 */
export const getInvitation = async (token) => {
	try {
		const response = await apiClient.get(ApiAuth.INVITATION(token));
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * Accept a company invitation
 * @param {string} token - Invitation token from email link
 * @param {object} data - Acceptance data (required only for new accounts)
 * @param {string} data.name - Full name (required if email not yet registered)
 * @param {string} data.password - Password (required if email not yet registered)
 * @param {string} data.phone - Phone number (optional)
 * @returns {Promise<object>} Response with acceptance confirmation
 */
export const acceptInvitation = async (token, data = {}) => {
	try {
		const response = await apiClient.post(ApiAuth.ACCEPT_INVITATION(token), data);
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
	getInvitation,
	acceptInvitation,
};
