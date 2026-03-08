import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth.store';
import {
	ROLES,
	PERMISSIONS,
	hasPermission,
	hasAnyPermission,
	hasAllPermissions,
	hasRole,
	hasAnyRole,
	isCompanyOwner,
	isCompanyAdmin,
	canManageCompany,
	getUserCompanyRole,
	formatPermission,
	formatRole,
} from '@/utils/permissions';

/**
 * Permissions Composable
 * Provides reactive permission checking for components
 */
export const usePermissions = () => {
	const authStore = useAuthStore();

	// Current user
	const user = computed(() => authStore.state.user);

	// Role checks
	const isSuperAdmin = computed(() => hasRole(user.value, ROLES.SUPER_ADMIN));
	const isOwner = computed(() => hasRole(user.value, ROLES.OWNER));
	const isAdmin = computed(() => hasRole(user.value, ROLES.ADMIN));
	const isManager = computed(() => hasRole(user.value, ROLES.MANAGER));
	const isMember = computed(() => hasRole(user.value, ROLES.MEMBER));
	const isEmployee = computed(() => hasRole(user.value, ROLES.EMPLOYEE));
	const isCustomer = computed(() => hasRole(user.value, ROLES.CUSTOMER));

	// Combined role checks
	const isOwnerOrAdmin = computed(() => isOwner.value || isAdmin.value);
	const isManagerOrAbove = computed(() => isOwner.value || isAdmin.value || isManager.value);
	const isStaff = computed(() => isMember.value || isEmployee.value || isManagerOrAbove.value);

	// Permission check function
	const can = (permission, context = {}) => {
		return hasPermission(user.value, permission, context);
	};

	// Multiple permission checks
	const canAny = (permissions, context = {}) => {
		return hasAnyPermission(user.value, permissions, context);
	};

	const canAll = (permissions, context = {}) => {
		return hasAllPermissions(user.value, permissions, context);
	};

	// Role check function
	const hasRoleName = (roleName) => {
		return hasRole(user.value, roleName);
	};

	const hasAnyRoleName = (roleNames) => {
		return hasAnyRole(user.value, roleNames);
	};

	// Company-specific permissions
	const isOwnerOf = (companyId) => {
		return isCompanyOwner(user.value, companyId);
	};

	const isAdminOf = (companyId) => {
		return isCompanyAdmin(user.value, companyId);
	};

	const canManage = (companyId) => {
		return canManageCompany(user.value, companyId);
	};

	const getCompanyRole = (companyId) => {
		return getUserCompanyRole(user.value, companyId);
	};

	// Company permissions (computed)
	const canCreateCompany = computed(() => can(PERMISSIONS.COMPANY_CREATE));
	const canViewCompany = computed(() => can(PERMISSIONS.COMPANY_VIEW));
	const canEditCompany = computed(() => can(PERMISSIONS.COMPANY_EDIT));
	const canDeleteCompany = computed(() => can(PERMISSIONS.COMPANY_DELETE));
	const canManageMembers = computed(() => can(PERMISSIONS.COMPANY_MANAGE_MEMBERS));
	const canManageLocations = computed(() => can(PERMISSIONS.COMPANY_MANAGE_LOCATIONS));
	const canManageCategories = computed(() => can(PERMISSIONS.COMPANY_MANAGE_CATEGORIES));

	// Service permissions (computed)
	const canCreateService = computed(() => can(PERMISSIONS.SERVICE_CREATE));
	const canViewService = computed(() => can(PERMISSIONS.SERVICE_VIEW));
	const canEditService = computed(() => can(PERMISSIONS.SERVICE_EDIT));
	const canDeleteService = computed(() => can(PERMISSIONS.SERVICE_DELETE));
	const canManageServices = computed(() => can(PERMISSIONS.SERVICE_MANAGE));

	// Request permissions (computed)
	const canCreateRequest = computed(() => can(PERMISSIONS.REQUEST_CREATE));
	const canViewRequest = computed(() => can(PERMISSIONS.REQUEST_VIEW));
	const canViewAllRequests = computed(() => can(PERMISSIONS.REQUEST_VIEW_ALL));
	const canEditRequest = computed(() => can(PERMISSIONS.REQUEST_EDIT));
	const canAssignRequest = computed(() => can(PERMISSIONS.REQUEST_ASSIGN));
	const canUpdateRequestStatus = computed(() => can(PERMISSIONS.REQUEST_UPDATE_STATUS));

	// Quote permissions (computed)
	const canCreateQuote = computed(() => can(PERMISSIONS.QUOTE_CREATE));
	const canViewQuote = computed(() => can(PERMISSIONS.QUOTE_VIEW));
	const canAcceptQuote = computed(() => can(PERMISSIONS.QUOTE_ACCEPT));
	const canRejectQuote = computed(() => can(PERMISSIONS.QUOTE_REJECT));

	// Assignment permissions (computed)
	const canCreateAssignment = computed(() => can(PERMISSIONS.ASSIGNMENT_CREATE));
	const canViewAssignment = computed(() => can(PERMISSIONS.ASSIGNMENT_VIEW));
	const canUpdateAssignment = computed(() => can(PERMISSIONS.ASSIGNMENT_UPDATE));
	const canCompleteAssignment = computed(() => can(PERMISSIONS.ASSIGNMENT_COMPLETE));

	// Tracking permissions (computed)
	const canStartTracking = computed(() => can(PERMISSIONS.TRACKING_START));
	const canStopTracking = computed(() => can(PERMISSIONS.TRACKING_STOP));
	const canViewTracking = computed(() => can(PERMISSIONS.TRACKING_VIEW));

	// NFC permissions (computed)
	const canCreateNfc = computed(() => can(PERMISSIONS.NFC_CREATE));
	const canViewNfc = computed(() => can(PERMISSIONS.NFC_VIEW));
	const canEditNfc = computed(() => can(PERMISSIONS.NFC_EDIT));
	const canDeleteNfc = computed(() => can(PERMISSIONS.NFC_DELETE));

	// Admin permissions (computed)
	const canAccessAdmin = computed(() => can(PERMISSIONS.ADMIN_ACCESS));
	const canManageUsers = computed(() => can(PERMISSIONS.ADMIN_USERS));
	const canManageAllCompanies = computed(() => can(PERMISSIONS.ADMIN_COMPANIES));

	// Helper to check ownership of a resource
	const isOwnerOfResource = (resourceOwnerId) => {
		return user.value?.id === resourceOwnerId;
	};

	// Helper to check if user can edit their own resource
	const canEditOwn = (permission, resourceOwnerId) => {
		if (isOwnerOfResource(resourceOwnerId)) {
			return can(permission + '_own') || can(permission);
		}
		return can(permission);
	};

	return {
		// User
		user,

		// Role checks
		isSuperAdmin,
		isOwner,
		isAdmin,
		isManager,
		isMember,
		isEmployee,
		isCustomer,
		isOwnerOrAdmin,
		isManagerOrAbove,
		isStaff,

		// Permission functions
		can,
		canAny,
		canAll,
		hasRole: hasRoleName,
		hasAnyRole: hasAnyRoleName,

		// Company-specific
		isOwnerOf,
		isAdminOf,
		canManage,
		getCompanyRole,

		// Company permissions
		canCreateCompany,
		canViewCompany,
		canEditCompany,
		canDeleteCompany,
		canManageMembers,
		canManageLocations,
		canManageCategories,

		// Service permissions
		canCreateService,
		canViewService,
		canEditService,
		canDeleteService,
		canManageServices,

		// Request permissions
		canCreateRequest,
		canViewRequest,
		canViewAllRequests,
		canEditRequest,
		canAssignRequest,
		canUpdateRequestStatus,

		// Quote permissions
		canCreateQuote,
		canViewQuote,
		canAcceptQuote,
		canRejectQuote,

		// Assignment permissions
		canCreateAssignment,
		canViewAssignment,
		canUpdateAssignment,
		canCompleteAssignment,

		// Tracking permissions
		canStartTracking,
		canStopTracking,
		canViewTracking,

		// NFC permissions
		canCreateNfc,
		canViewNfc,
		canEditNfc,
		canDeleteNfc,

		// Admin permissions
		canAccessAdmin,
		canManageUsers,
		canManageAllCompanies,

		// Helpers
		isOwnerOfResource,
		canEditOwn,

		// Utilities
		formatPermission,
		formatRole,

		// Constants
		ROLES,
		PERMISSIONS,
	};
};

export default usePermissions;
