import { reactive, computed } from 'vue';

/**
 * Companies Store
 * Manages companies state using Vue 3 Composition API
 */

// Reactive state
const state = reactive({
	companies: [],
	currentCompany: null,
	currentCompanyMembers: [],
	currentCompanyLocations: [],
	currentCompanyCategories: [],
	isLoading: false,
	error: null,
});

// Computed properties
const companiesCount = computed(() => state.companies.length);

const activeCompanies = computed(() =>
	state.companies.filter(company => company.status === 'active')
);

const inactiveCompanies = computed(() =>
	state.companies.filter(company => company.status === 'inactive')
);

const hasCompanies = computed(() => state.companies.length > 0);

const currentCompanyMembersCount = computed(() => state.currentCompanyMembers.length);

const currentCompanyLocationsCount = computed(() => state.currentCompanyLocations.length);

// Actions
const setCompanies = (companies) => {
	state.companies = companies;
};

const addCompany = (company) => {
	state.companies.push(company);
};

const updateCompany = (updatedCompany) => {
	const index = state.companies.findIndex(
		company =>
			(updatedCompany.id != null && company.id === updatedCompany.id) ||
			(updatedCompany.uuid != null && company.uuid === updatedCompany.uuid),
	);
	if (index !== -1) {
		state.companies[index] = updatedCompany;
	}
	const sameCurrent =
		state.currentCompany &&
		((updatedCompany.id != null && state.currentCompany.id === updatedCompany.id) ||
			(updatedCompany.uuid != null &&
				state.currentCompany.uuid === updatedCompany.uuid));
	if (sameCurrent) {
		state.currentCompany = updatedCompany;
	}
};

const removeCompany = (companyId) => {
	state.companies = state.companies.filter(company => company.id !== companyId);
	// Clear current company if it's the same one
	if (state.currentCompany?.id === companyId) {
		state.currentCompany = null;
		state.currentCompanyMembers = [];
		state.currentCompanyLocations = [];
		state.currentCompanyCategories = [];
	}
};

const setCurrentCompany = (company) => {
	state.currentCompany = company;
};

const clearCurrentCompany = () => {
	state.currentCompany = null;
	state.currentCompanyMembers = [];
	state.currentCompanyLocations = [];
	state.currentCompanyCategories = [];
};

// Members management
const setCurrentCompanyMembers = (members) => {
	state.currentCompanyMembers = members;
};

const addCurrentCompanyMember = (member) => {
	state.currentCompanyMembers.push(member);
};

const updateCurrentCompanyMember = (updatedMember) => {
	const index = state.currentCompanyMembers.findIndex(member => member.id === updatedMember.id);
	if (index !== -1) {
		state.currentCompanyMembers[index] = updatedMember;
	}
};

const removeCurrentCompanyMember = (memberId) => {
	state.currentCompanyMembers = state.currentCompanyMembers.filter(member => member.id !== memberId);
};

// Locations management
const setCurrentCompanyLocations = (locations) => {
	state.currentCompanyLocations = locations;
};

const addCurrentCompanyLocation = (location) => {
	state.currentCompanyLocations.push(location);
};

const updateCurrentCompanyLocation = (updatedLocation) => {
	const index = state.currentCompanyLocations.findIndex(
		(location) =>
			location.id === updatedLocation.id ||
			location.uuid === updatedLocation.uuid ||
			(updatedLocation.id != null && location.uuid === updatedLocation.id) ||
			(updatedLocation.uuid != null && location.id === updatedLocation.uuid),
	);
	if (index !== -1) {
		state.currentCompanyLocations[index] = updatedLocation;
	}
};

const removeCurrentCompanyLocation = (locationId) => {
	state.currentCompanyLocations = state.currentCompanyLocations.filter(
		(location) => location.id !== locationId && location.uuid !== locationId,
	);
};

// Categories management
const setCurrentCompanyCategories = (categories) => {
	state.currentCompanyCategories = categories;
};

const addCurrentCompanyCategory = (category) => {
	state.currentCompanyCategories.push(category);
};

const updateCurrentCompanyCategory = (updatedCategory) => {
	const index = state.currentCompanyCategories.findIndex(category => category.id === updatedCategory.id);
	if (index !== -1) {
		state.currentCompanyCategories[index] = updatedCategory;
	}
};

const removeCurrentCompanyCategory = (categoryId) => {
	state.currentCompanyCategories = state.currentCompanyCategories.filter(category => category.id !== categoryId);
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

const getCompanyById = (id) => {
	return state.companies.find(company => company.id === id);
};

const reset = () => {
	state.companies = [];
	state.currentCompany = null;
	state.currentCompanyMembers = [];
	state.currentCompanyLocations = [];
	state.currentCompanyCategories = [];
	state.isLoading = false;
	state.error = null;
};

// Export store
export const useCompaniesStore = () => {
	return {
		// State
		state,

		// Computed
		companiesCount,
		activeCompanies,
		inactiveCompanies,
		hasCompanies,
		currentCompanyMembersCount,
		currentCompanyLocationsCount,

		// Actions
		setCompanies,
		addCompany,
		updateCompany,
		removeCompany,
		setCurrentCompany,
		clearCurrentCompany,

		// Members
		setCurrentCompanyMembers,
		addCurrentCompanyMember,
		updateCurrentCompanyMember,
		removeCurrentCompanyMember,

		// Locations
		setCurrentCompanyLocations,
		addCurrentCompanyLocation,
		updateCurrentCompanyLocation,
		removeCurrentCompanyLocation,

		// Categories
		setCurrentCompanyCategories,
		addCurrentCompanyCategory,
		updateCurrentCompanyCategory,
		removeCurrentCompanyCategory,

		// Utilities
		setLoading,
		setError,
		clearError,
		getCompanyById,
		reset,
	};
};

export default useCompaniesStore;
