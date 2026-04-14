import axios from 'axios';
import { getAccessToken, getRefreshToken, setAccessToken, clearAuth } from '@/utils/storage';

const BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

const apiClient = axios.create({
	baseURL: BASE_URL,
	headers: {
		'Content-Type': 'application/json',
	},
	timeout: 30000, // 30 seconds
	transformResponse: [
		(data) => {
			// If data is already an object, return it
			if (typeof data === 'object' && data !== null) {
				return data;
			}

			// If data is a string, try to parse it
			if (typeof data === 'string') {
				try {
					return JSON.parse(data);
				} catch (e) {
					// console.error('Failed to parse response as JSON:', data);
					// console.error('Parse error:', e.message);
					// Return the raw string wrapped in an object
					return { rawResponse: data, parseError: true };
				}
			}

			// Return as-is for other types
			return data;
		}
	]
});

// Flag to prevent multiple refresh token requests
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
	failedQueue.forEach((prom) => {
		if (error) {
			prom.reject(error);
		} else {
			prom.resolve(token);
		}
	});

	failedQueue = [];
};

// Request interceptor - Add auth token to all requests
apiClient.interceptors.request.use(
	(config) => {
		const token = getAccessToken();
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Response interceptor - Handle token refresh
apiClient.interceptors.response.use(
	(response) => {
		return response;
	},
	async (error) => {
		// Log error details for debugging (development only)
		if (import.meta.env.DEV) {
			console.error('API Error:', {
				url: error.config?.url,
				status: error.response?.status,
				message: error.message
			});
		}

		const originalRequest = error.config;

		// Skip token refresh for auth endpoints
		const authEndpoints = ['/auth/login', '/auth/register', '/auth/refresh'];
		const isAuthEndpoint = authEndpoints.some(endpoint =>
			originalRequest?.url?.includes(endpoint)
		);

		// If error is 401 and we haven't tried to refresh yet
		if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
			if (isRefreshing) {
				// If already refreshing, queue this request
				return new Promise((resolve, reject) => {
					failedQueue.push({ resolve, reject });
				})
					.then((token) => {
						originalRequest.headers.Authorization = `Bearer ${token}`;
						return apiClient(originalRequest);
					})
					.catch((err) => {
						return Promise.reject(err);
					});
			}

			originalRequest._retry = true;
			isRefreshing = true;

			const refreshToken = getRefreshToken();

			if (!refreshToken) {
				// No refresh token, clear auth and redirect to login
				clearAuth();
				window.location.href = '/login';
				return Promise.reject(error);
			}

			try {
				// Try to refresh the token
				const response = await axios.post(`${BASE_URL}/auth/refresh`, {
					refreshToken: refreshToken,
				});

				const newAccessToken = response.data?.data?.accessToken;

				if (newAccessToken) {
					setAccessToken(newAccessToken);
					apiClient.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
					originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
					processQueue(null, newAccessToken);
					return apiClient(originalRequest);
				} else {
					throw new Error('No access token in refresh response');
				}
			} catch (refreshError) {
				// Refresh failed, clear auth and redirect to login
				processQueue(refreshError, null);
				clearAuth();
				window.location.href = '/login';
				return Promise.reject(refreshError);
			} finally {
				isRefreshing = false;
			}
		}

		return Promise.reject(error);
	}
);

/**
 * Handle API errors and return user-friendly messages
 * @param {Error} error - Axios error object
 * @returns {string} User-friendly error message
 */
export const handleApiError = (error) => {
	if (error.response) {
		// Server responded with error status
		const message = error.response.data?.message || error.response.data?.error;
		const statusCode = error.response.status;

		switch (statusCode) {
			case 400:
				return message || 'Invalid request. Please check your input.';
			case 401:
				return 'Unauthorized. Please login again.';
			case 403:
				return 'You do not have permission to perform this action.';
			case 404:
				return message || 'Resource not found.';
			case 409:
				return message || 'Conflict. Resource already exists.';
			case 422:
				return message || 'Validation error. Please check your input.';
			case 500:
				return 'Server error. Please try again later.';
			default:
				return message || `Error: ${statusCode}`;
		}
	} else if (error.request) {
		// Request made but no response
		return 'Network error. Please check your connection.';
	} else {
		// Something else happened
		return error.message || 'An unexpected error occurred.';
	}
};

export default apiClient;
