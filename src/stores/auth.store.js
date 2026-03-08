import { reactive, computed } from 'vue';
import {
	setAccessToken,
	setRefreshToken,
	setUser,
	getAccessToken,
	getRefreshToken,
	getUser,
	clearAuth
} from '@/utils/storage';

/**
 * Authentication Store
 * Manages user authentication state using Vue 3 Composition API
 */

// Reactive state
const state = reactive({
	user: getUser() || null,
	accessToken: getAccessToken() || null,
	refreshToken: getRefreshToken() || null,
	isLoading: false,
	error: null,
});

// Computed properties
const isAuthenticated = computed(() => !!state.accessToken && !!state.user);

const userRoles = computed(() => state.user?.roles || []);

const hasRole = (roleName) => {
	return userRoles.value.some(role => role.name === roleName);
};

const isAdmin = computed(() => hasRole('admin') || hasRole('super_admin'));

const userCompanies = computed(() => state.user?.companies || []);

const hasCompany = computed(() => {
	const companies = state.user?.companies || [];
	return companies.length > 0 || !!state.user?.company_id || !!state.user?.companyId;
});

const companyId = computed(() => {
	// First check if user has a direct company_id or companyId
	if (state.user?.company_id) return state.user.company_id;
	if (state.user?.companyId) return state.user.companyId;

	// Otherwise, get the first company from the companies array
	const companies = state.user?.companies || [];
	if (companies.length > 0) {
		return companies[0].company_id || companies[0].id;
	}

	return null;
});

const company_id = computed(() => companyId.value);

// Actions
const setAuthData = (data) => {
	if (data.accessToken) {
		state.accessToken = data.accessToken;
		setAccessToken(data.accessToken);
	}

	if (data.refreshToken) {
		state.refreshToken = data.refreshToken;
		setRefreshToken(data.refreshToken);
	}

	if (data.user) {
		state.user = data.user;
		setUser(data.user);
	}
};

const setUserData = (user) => {
	state.user = user;
	setUser(user);
};

const updateAccessToken = (token) => {
	state.accessToken = token;
	setAccessToken(token);
};

const setLoading = (loading) => {
	state.isLoading = loading;
};

const setError = (error) => {
	state.error = error;
};

const clearError = () => {
	state.error = null;
};

const logout = () => {
	state.user = null;
	state.accessToken = null;
	state.refreshToken = null;
	state.error = null;
	clearAuth();
};

const reset = () => {
	logout();
	state.isLoading = false;
};

// Export store
export const useAuthStore = () => {
	return {
		// State
		state,

		// Computed
		isAuthenticated,
		isAdmin,
		userRoles,
		userCompanies,
		hasCompany,
		companyId,
		company_id,

		// Actions
		setAuthData,
		setUserData,
		updateAccessToken,
		setLoading,
		setError,
		clearError,
		logout,
		reset,
		hasRole,
	};
};

export default useAuthStore;
