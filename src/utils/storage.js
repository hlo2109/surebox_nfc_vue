/**
 * Storage utility for managing localStorage and sessionStorage
 */

const STORAGE_KEYS = {
	ACCESS_TOKEN: 'accessToken',
	REFRESH_TOKEN: 'refreshToken',
	USER: 'user',
};

/**
 * Set item in localStorage
 * @param {string} key - Storage key
 * @param {any} value - Value to store (will be JSON stringified)
 */
export const setItem = (key, value) => {
	try {
		const stringValue = JSON.stringify(value);
		localStorage.setItem(key, stringValue);
	} catch (error) {
		console.error(`Error setting item ${key} in localStorage:`, error);
	}
};

/**
 * Get item from localStorage
 * @param {string} key - Storage key
 * @returns {any} Parsed value or null
 */
export const getItem = (key) => {
	try {
		const item = localStorage.getItem(key);
		return item ? JSON.parse(item) : null;
	} catch (error) {
		console.error(`Error getting item ${key} from localStorage:`, error);
		return null;
	}
};

/**
 * Remove item from localStorage
 * @param {string} key - Storage key
 */
export const removeItem = (key) => {
	try {
		localStorage.removeItem(key);
	} catch (error) {
		console.error(`Error removing item ${key} from localStorage:`, error);
	}
};

/**
 * Clear all items from localStorage
 */
export const clear = () => {
	try {
		localStorage.clear();
	} catch (error) {
		console.error('Error clearing localStorage:', error);
	}
};

/**
 * Set access token
 * @param {string} token - JWT access token
 */
export const setAccessToken = (token) => {
	setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
};

/**
 * Get access token
 * @returns {string|null} Access token or null
 */
export const getAccessToken = () => {
	return getItem(STORAGE_KEYS.ACCESS_TOKEN);
};

/**
 * Set refresh token
 * @param {string} token - JWT refresh token
 */
export const setRefreshToken = (token) => {
	setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
};

/**
 * Get refresh token
 * @returns {string|null} Refresh token or null
 */
export const getRefreshToken = () => {
	return getItem(STORAGE_KEYS.REFRESH_TOKEN);
};

/**
 * Set user data
 * @param {object} user - User object
 */
export const setUser = (user) => {
	setItem(STORAGE_KEYS.USER, user);
};

/**
 * Get user data
 * @returns {object|null} User object or null
 */
export const getUser = () => {
	return getItem(STORAGE_KEYS.USER);
};

/**
 * Remove all auth tokens and user data
 */
export const clearAuth = () => {
	removeItem(STORAGE_KEYS.ACCESS_TOKEN);
	removeItem(STORAGE_KEYS.REFRESH_TOKEN);
	removeItem(STORAGE_KEYS.USER);
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if access token exists
 */
export const isAuthenticated = () => {
	return !!getAccessToken();
};

export default {
	setItem,
	getItem,
	removeItem,
	clear,
	setAccessToken,
	getAccessToken,
	setRefreshToken,
	getRefreshToken,
	setUser,
	getUser,
	clearAuth,
	isAuthenticated,
	STORAGE_KEYS,
};
