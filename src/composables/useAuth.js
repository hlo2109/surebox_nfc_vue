import { useAuthStore } from '@/stores/auth.store';
import * as authApi from '@/api/auth.api';
import { useToast } from './useToast';
import { useRouter } from 'vue-router';

/**
 * Authentication Composable
 * Handles all authentication operations
 */
export const useAuth = () => {
	const authStore = useAuthStore();
	const toast = useToast();
	const router = useRouter();

	/**
	 * Register a new user
	 * @param {object} userData - User registration data
	 * @param {string} userData.name - Full name
	 * @param {string} userData.email - Email
	 * @param {string} userData.password - Password
	 * @param {string} userData.phone - Phone number (optional)
	 * @param {object} userData.company - Company data (optional)
	 * @returns {Promise<object>} Registration result
	 */
	const register = async (userData) => {
		try {
			authStore.setLoading(true);
			authStore.clearError();

			const response = await authApi.register(userData);

			if (response.success) {
				toast.showSuccess('Registration successful! Please login with your credentials.');
				return { success: true, data: response.data };
			} else {
				throw new Error(response.message || 'Registration failed');
			}
		} catch (error) {
			const errorMessage = error.message || 'Registration failed. Please try again.';
			authStore.setError(errorMessage);
			toast.showError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			authStore.setLoading(false);
		}
	};

	/**
	 * Login user
	 * @param {object} credentials - Login credentials
	 * @param {string} credentials.email - Email
	 * @param {string} credentials.password - Password
	 * @returns {Promise<object>} Login result
	 */
	const login = async (credentials) => {
		try {
			authStore.setLoading(true);
			authStore.clearError();

			const response = await authApi.login(credentials);

			console.log('Login response:', response);

			// Handle different response structures
			let authData;

			if (response.success && response.data) {
				// Response has success wrapper
				authData = response.data;
			} else if (response.accessToken || response.token) {
				// Response is direct auth data
				authData = response;
			} else {
				console.error('Unexpected response structure:', response);
				throw new Error('Invalid response from server');
			}

			// Extract tokens (handle both accessToken and token)
			const accessToken = authData.accessToken || authData.token;
			const refreshToken = authData.refreshToken || authData.refresh_token;
			const user = authData.user || authData.userData || authData;

			if (!accessToken) {
				throw new Error('No access token received from server');
			}

			// Store auth data (tokens + basic user info from login response)
			authStore.setAuthData({
				accessToken: accessToken,
				refreshToken: refreshToken,
				user: user,
			});

			// Immediately fetch the full user profile so that the roles &
			// permissions[] array from the API are stored before any page renders.
			await getCurrentUser().catch(() => {
				// Non-fatal: login still succeeds with whatever the login
				// response contained. Permissions will be fetched on next mount.
			});

			const userName = authStore.state.user?.name || user.name || user.username || user.email || 'User';
			toast.showSuccess(`Welcome back, ${userName}!`);
			return { success: true, data: authData };
		} catch (error) {
			console.error('Login error:', error);
			const errorMessage = error.message || 'Login failed. Please check your credentials.';
			authStore.setError(errorMessage);
			toast.showError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			authStore.setLoading(false);
		}
	};

	/**
	 * Logout user
	 * @returns {Promise<void>}
	 */
	const logout = async () => {
		try {
			authStore.setLoading(true);

			// Call API to invalidate session
			await authApi.logout();

			// Clear local state
			authStore.logout();

			toast.showInfo('You have been logged out successfully.');

			// Redirect to login
			router.push('/login');
		} catch (error) {
			// Even if API call fails, clear local state
			authStore.logout();
			router.push('/login');
		} finally {
			authStore.setLoading(false);
		}
	};

	/**
	 * Get current user information
	 * @returns {Promise<object>} User data
	 */
	const getCurrentUser = async () => {
		try {
			authStore.setLoading(true);
			authStore.clearError();

			const response = await authApi.getCurrentUser();

			if (response.success && response.data) {
				authStore.setUserData(response.data);
				return { success: true, data: response.data };
			} else {
				throw new Error(response.message || 'Failed to get user data');
			}
		} catch (error) {
			const errorMessage = error.message || 'Failed to fetch user information.';
			authStore.setError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			authStore.setLoading(false);
		}
	};

	/**
	 * Change user password
	 * @param {object} passwordData - Password change data
	 * @param {string} passwordData.currentPassword - Current password
	 * @param {string} passwordData.newPassword - New password
	 * @returns {Promise<object>} Result
	 */
	const changePassword = async (passwordData) => {
		try {
			authStore.setLoading(true);
			authStore.clearError();

			const response = await authApi.changePassword(passwordData);

			if (response.success) {
				toast.showSuccess('Password changed successfully!');
				return { success: true };
			} else {
				throw new Error(response.message || 'Password change failed');
			}
		} catch (error) {
			const errorMessage = error.message || 'Failed to change password.';
			authStore.setError(errorMessage);
			toast.showError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			authStore.setLoading(false);
		}
	};

	/**
	 * Check if user is authenticated
	 * @returns {boolean}
	 */
	const isAuthenticated = () => {
		return authStore.isAuthenticated.value;
	};

	/**
	 * Check if user has a specific role
	 * @param {string} roleName - Role name to check
	 * @returns {boolean}
	 */
	const hasRole = (roleName) => {
		return authStore.hasRole(roleName);
	};

	/**
	 * Check if user is admin
	 * @returns {boolean}
	 */
	const isAdmin = () => {
		return authStore.isAdmin.value;
	};

	/**
	 * Get current user
	 * @returns {object|null}
	 */
	const getUser = () => {
		return authStore.state.user;
	};

	/**
	 * Refresh authentication (refetch user data)
	 * @returns {Promise<void>}
	 */
	const refreshAuth = async () => {
		if (isAuthenticated()) {
			await getCurrentUser();
		}
	};

	return {
		// State
		state: authStore.state,
		isAuthenticated,
		isAdmin,

		// Actions
		register,
		login,
		logout,
		getCurrentUser,
		changePassword,
		hasRole,
		getUser,
		refreshAuth,
	};
};

export default useAuth;
