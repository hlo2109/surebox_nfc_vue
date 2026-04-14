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

// Flat list of permission names extracted from the API user object
// e.g. [{ id: 1, name: "create_company" }, ...] → ["create_company", ...]
const userPermissions = computed(() => {
	const perms = state.user?.permissions;
	if (!Array.isArray(perms)) return [];
	return perms.map((p) => (typeof p === 'string' ? p : p?.name)).filter(Boolean);
});

const userCompanies = computed(() => state.user?.companies || []);

const hasCompany = computed(() => {
	const companies = state.user?.companies || [];
	return companies.length > 0 || !!state.user?.company_id || !!state.user?.companyId;
});

const companyId = computed(() => {
	const companies = state.user?.companies || [];
	if (companies.length > 0) {
		return companies[0].company_uuid;
	}

	return null;
});

// The role the current user holds inside their company (e.g. 'admin' | 'employee')
const companyRole = computed(() => {
	const companies = state.user?.companies || [];
	if (companies.length > 0) {
		return companies[0].role_in_company
			|| (typeof companies[0].role === 'string' ? companies[0].role : companies[0].role?.name)
			|| null;
	}
	return null;
});

// True only when the user's company role is 'admin' (i.e. the company owner/creator)
const isCompanyAdmin = computed(() => companyRole.value === 'admin');

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
		userPermissions,
		userCompanies,
		hasCompany,
		companyId,
		companyRole,
		isCompanyAdmin,

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
