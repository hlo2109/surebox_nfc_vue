/**
 * Permissions Utility
 * Defines roles, permissions, and access control logic
 */

// Role definitions
export const ROLES = {
	OWNER: 'owner',
	ADMIN: 'admin',
	MANAGER: 'manager',
	MEMBER: 'member',
	EMPLOYEE: 'employee',
	CUSTOMER: 'customer',
	SUPER_ADMIN: 'super_admin',
};

// Permission definitions
export const PERMISSIONS = {
	// Company permissions
	COMPANY_CREATE: 'company.create',
	COMPANY_VIEW: 'company.view',
	COMPANY_EDIT: 'company.edit',
	COMPANY_DELETE: 'company.delete',
	COMPANY_MANAGE_MEMBERS: 'company.manage_members',
	COMPANY_MANAGE_LOCATIONS: 'company.manage_locations',
	COMPANY_MANAGE_CATEGORIES: 'company.manage_categories',
	COMPANY_VIEW_MEMBERS: 'company.view_members',

	// Service permissions
	SERVICE_CREATE: 'service.create',
	SERVICE_VIEW: 'service.view',
	SERVICE_EDIT: 'service.edit',
	SERVICE_DELETE: 'service.delete',
	SERVICE_MANAGE: 'service.manage',

	// Service Request permissions
	REQUEST_CREATE: 'request.create',
	REQUEST_VIEW: 'request.view',
	REQUEST_VIEW_OWN: 'request.view_own',
	REQUEST_VIEW_ALL: 'request.view_all',
	REQUEST_EDIT: 'request.edit',
	REQUEST_EDIT_OWN: 'request.edit_own',
	REQUEST_DELETE: 'request.delete',
	REQUEST_ASSIGN: 'request.assign',
	REQUEST_UPDATE_STATUS: 'request.update_status',

	// Quote permissions
	QUOTE_CREATE: 'quote.create',
	QUOTE_VIEW: 'quote.view',
	QUOTE_ACCEPT: 'quote.accept',
	QUOTE_REJECT: 'quote.reject',

	// Assignment permissions
	ASSIGNMENT_CREATE: 'assignment.create',
	ASSIGNMENT_VIEW: 'assignment.view',
	ASSIGNMENT_UPDATE: 'assignment.update',
	ASSIGNMENT_COMPLETE: 'assignment.complete',

	// GPS Tracking permissions
	TRACKING_START: 'tracking.start',
	TRACKING_STOP: 'tracking.stop',
	TRACKING_VIEW: 'tracking.view',

	// NFC permissions
	NFC_CREATE: 'nfc.create',
	NFC_VIEW: 'nfc.view',
	NFC_EDIT: 'nfc.edit',
	NFC_DELETE: 'nfc.delete',

	// Admin permissions
	ADMIN_ACCESS: 'admin.access',
	ADMIN_USERS: 'admin.users',
	ADMIN_COMPANIES: 'admin.companies',
};

// Role-based permission mapping
export const ROLE_PERMISSIONS = {
	[ROLES.SUPER_ADMIN]: ['*'], // All permissions

	[ROLES.OWNER]: [
		// Company permissions (owner of specific company)
		PERMISSIONS.COMPANY_VIEW,
		PERMISSIONS.COMPANY_EDIT,
		PERMISSIONS.COMPANY_DELETE,
		PERMISSIONS.COMPANY_MANAGE_MEMBERS,
		PERMISSIONS.COMPANY_MANAGE_LOCATIONS,
		PERMISSIONS.COMPANY_MANAGE_CATEGORIES,
		PERMISSIONS.COMPANY_VIEW_MEMBERS,

		// Service permissions (for owned company)
		PERMISSIONS.SERVICE_CREATE,
		PERMISSIONS.SERVICE_VIEW,
		PERMISSIONS.SERVICE_EDIT,
		PERMISSIONS.SERVICE_DELETE,
		PERMISSIONS.SERVICE_MANAGE,

		// Request permissions (company's requests)
		PERMISSIONS.REQUEST_VIEW_ALL,
		PERMISSIONS.REQUEST_EDIT,
		PERMISSIONS.REQUEST_ASSIGN,
		PERMISSIONS.REQUEST_UPDATE_STATUS,

		// Quote permissions
		PERMISSIONS.QUOTE_CREATE,
		PERMISSIONS.QUOTE_VIEW,

		// Assignment permissions
		PERMISSIONS.ASSIGNMENT_CREATE,
		PERMISSIONS.ASSIGNMENT_VIEW,
		PERMISSIONS.ASSIGNMENT_UPDATE,

		// Tracking permissions
		PERMISSIONS.TRACKING_VIEW,

		// NFC permissions
		PERMISSIONS.NFC_CREATE,
		PERMISSIONS.NFC_VIEW,
		PERMISSIONS.NFC_EDIT,
		PERMISSIONS.NFC_DELETE,
	],

	[ROLES.ADMIN]: [
		// Company permissions
		PERMISSIONS.COMPANY_VIEW,
		PERMISSIONS.COMPANY_EDIT,
		PERMISSIONS.COMPANY_MANAGE_MEMBERS,
		PERMISSIONS.COMPANY_MANAGE_LOCATIONS,
		PERMISSIONS.COMPANY_MANAGE_CATEGORIES,
		PERMISSIONS.COMPANY_VIEW_MEMBERS,

		// Service permissions
		PERMISSIONS.SERVICE_CREATE,
		PERMISSIONS.SERVICE_VIEW,
		PERMISSIONS.SERVICE_EDIT,
		PERMISSIONS.SERVICE_DELETE,
		PERMISSIONS.SERVICE_MANAGE,

		// Request permissions
		PERMISSIONS.REQUEST_VIEW_ALL,
		PERMISSIONS.REQUEST_EDIT,
		PERMISSIONS.REQUEST_ASSIGN,
		PERMISSIONS.REQUEST_UPDATE_STATUS,

		// Quote permissions
		PERMISSIONS.QUOTE_CREATE,
		PERMISSIONS.QUOTE_VIEW,

		// Assignment permissions
		PERMISSIONS.ASSIGNMENT_CREATE,
		PERMISSIONS.ASSIGNMENT_VIEW,
		PERMISSIONS.ASSIGNMENT_UPDATE,

		// Tracking permissions
		PERMISSIONS.TRACKING_VIEW,

		// NFC permissions
		PERMISSIONS.NFC_CREATE,
		PERMISSIONS.NFC_VIEW,
		PERMISSIONS.NFC_EDIT,
		PERMISSIONS.NFC_DELETE,
	],

	[ROLES.MANAGER]: [
		// Company permissions (limited)
		PERMISSIONS.COMPANY_VIEW,
		PERMISSIONS.COMPANY_VIEW_MEMBERS,

		// Service permissions
		PERMISSIONS.SERVICE_VIEW,
		PERMISSIONS.SERVICE_EDIT,
		PERMISSIONS.SERVICE_MANAGE,

		// Request permissions
		PERMISSIONS.REQUEST_VIEW_ALL,
		PERMISSIONS.REQUEST_ASSIGN,
		PERMISSIONS.REQUEST_UPDATE_STATUS,

		// Quote permissions
		PERMISSIONS.QUOTE_CREATE,
		PERMISSIONS.QUOTE_VIEW,

		// Assignment permissions
		PERMISSIONS.ASSIGNMENT_CREATE,
		PERMISSIONS.ASSIGNMENT_VIEW,
		PERMISSIONS.ASSIGNMENT_UPDATE,

		// Tracking permissions
		PERMISSIONS.TRACKING_VIEW,

		// NFC permissions
		PERMISSIONS.NFC_VIEW,
		PERMISSIONS.NFC_CREATE,
	],

	[ROLES.MEMBER]: [
		// Company permissions
		PERMISSIONS.COMPANY_VIEW,

		// Service permissions
		PERMISSIONS.SERVICE_VIEW,

		// Request permissions (own assignments only)
		PERMISSIONS.REQUEST_VIEW,
		PERMISSIONS.REQUEST_UPDATE_STATUS,

		// Assignment permissions (own only)
		PERMISSIONS.ASSIGNMENT_VIEW,
		PERMISSIONS.ASSIGNMENT_UPDATE,
		PERMISSIONS.ASSIGNMENT_COMPLETE,

		// Tracking permissions
		PERMISSIONS.TRACKING_START,
		PERMISSIONS.TRACKING_STOP,

		// NFC permissions
		PERMISSIONS.NFC_VIEW,
	],

	[ROLES.EMPLOYEE]: [
		// Same as MEMBER
		PERMISSIONS.COMPANY_VIEW,
		PERMISSIONS.SERVICE_VIEW,
		PERMISSIONS.REQUEST_VIEW,
		PERMISSIONS.REQUEST_UPDATE_STATUS,
		PERMISSIONS.ASSIGNMENT_VIEW,
		PERMISSIONS.ASSIGNMENT_UPDATE,
		PERMISSIONS.ASSIGNMENT_COMPLETE,
		PERMISSIONS.TRACKING_START,
		PERMISSIONS.TRACKING_STOP,
		PERMISSIONS.NFC_VIEW,
	],

	[ROLES.CUSTOMER]: [
		// Service permissions
		PERMISSIONS.SERVICE_VIEW,

		// Request permissions (own only)
		PERMISSIONS.REQUEST_CREATE,
		PERMISSIONS.REQUEST_VIEW_OWN,
		PERMISSIONS.REQUEST_EDIT_OWN,

		// Quote permissions
		PERMISSIONS.QUOTE_VIEW,
		PERMISSIONS.QUOTE_ACCEPT,
		PERMISSIONS.QUOTE_REJECT,

		// Assignment permissions
		PERMISSIONS.ASSIGNMENT_VIEW,

		// Tracking permissions
		PERMISSIONS.TRACKING_VIEW,

		// NFC permissions
		PERMISSIONS.NFC_CREATE,
		PERMISSIONS.NFC_VIEW,
		PERMISSIONS.NFC_EDIT,
		PERMISSIONS.NFC_DELETE,
	],
};

/**
 * Check if a user has a specific permission
 * @param {Object} user - User object with roles
 * @param {string} permission - Permission to check
 * @param {Object} context - Additional context (e.g., companyId, resourceOwnerId)
 * @returns {boolean}
 */
export const hasPermission = (user, permission, context = {}) => {
	if (!user) return false;

	// Get user roles (handle both array and object structure)
	const userRoles = Array.isArray(user.roles)
		? user.roles
		: user.role
			? [user.role]
			: [];

	// Check if user has super admin role
	if (userRoles.some((role) => {
		const roleName = typeof role === 'string' ? role : role.name;
		return roleName === ROLES.SUPER_ADMIN;
	})) {
		return true; // Super admin has all permissions
	}

	// Check each role's permissions
	for (const role of userRoles) {
		const roleName = typeof role === 'string' ? role : role.name;
		const rolePermissions = ROLE_PERMISSIONS[roleName] || [];

		// Check for wildcard permission
		if (rolePermissions.includes('*')) {
			return true;
		}

		// Check for specific permission
		if (rolePermissions.includes(permission)) {
			// Additional context-based checks
			if (context.requireOwnership) {
				return user.id === context.resourceOwnerId;
			}
			return true;
		}
	}

	return false;
};

/**
 * Check if user has any of the specified permissions
 * @param {Object} user - User object
 * @param {Array<string>} permissions - Array of permissions
 * @param {Object} context - Additional context
 * @returns {boolean}
 */
export const hasAnyPermission = (user, permissions, context = {}) => {
	return permissions.some((permission) => hasPermission(user, permission, context));
};

/**
 * Check if user has all of the specified permissions
 * @param {Object} user - User object
 * @param {Array<string>} permissions - Array of permissions
 * @param {Object} context - Additional context
 * @returns {boolean}
 */
export const hasAllPermissions = (user, permissions, context = {}) => {
	return permissions.every((permission) => hasPermission(user, permission, context));
};

/**
 * Check if user has a specific role
 * @param {Object} user - User object
 * @param {string} roleName - Role name to check
 * @returns {boolean}
 */
export const hasRole = (user, roleName) => {
	if (!user) return false;

	const userRoles = Array.isArray(user.roles)
		? user.roles
		: user.role
			? [user.role]
			: [];

	return userRoles.some((role) => {
		const name = typeof role === 'string' ? role : role.name;
		return name === roleName;
	});
};

/**
 * Check if user has any of the specified roles
 * @param {Object} user - User object
 * @param {Array<string>} roleNames - Array of role names
 * @returns {boolean}
 */
export const hasAnyRole = (user, roleNames) => {
	return roleNames.some((roleName) => hasRole(user, roleName));
};

/**
 * Check if user is company owner
 * @param {Object} user - User object
 * @param {number} companyId - Company ID
 * @returns {boolean}
 */
export const isCompanyOwner = (user, companyId) => {
	if (!user || !companyId) return false;

	const companies = user.companies || [];
	const company = companies.find((c) => c.id === companyId || c.company_id === companyId);

	if (!company) return false;

	// Check if user's role in this company is owner
	const memberRole = typeof company.role === 'string' ? company.role : company.role?.name;
	return memberRole === ROLES.OWNER;
};

/**
 * Check if user is company admin
 * @param {Object} user - User object
 * @param {number} companyId - Company ID
 * @returns {boolean}
 */
export const isCompanyAdmin = (user, companyId) => {
	if (!user || !companyId) return false;

	const companies = user.companies || [];
	const company = companies.find((c) => c.id === companyId || c.company_id === companyId);

	if (!company) return false;

	const memberRole = typeof company.role === 'string' ? company.role : company.role?.name;
	return memberRole === ROLES.ADMIN;
};

/**
 * Check if user can manage company (owner or admin)
 * @param {Object} user - User object
 * @param {number} companyId - Company ID
 * @returns {boolean}
 */
export const canManageCompany = (user, companyId) => {
	return isCompanyOwner(user, companyId) || isCompanyAdmin(user, companyId);
};

/**
 * Get user's role in a specific company
 * @param {Object} user - User object
 * @param {number} companyId - Company ID
 * @returns {string|null}
 */
export const getUserCompanyRole = (user, companyId) => {
	if (!user || !companyId) return null;

	const companies = user.companies || [];
	const company = companies.find((c) => c.id === companyId || c.company_id === companyId);

	if (!company) return null;

	return typeof company.role === 'string' ? company.role : company.role?.name;
};

/**
 * Format permission name for display
 * @param {string} permission - Permission constant
 * @returns {string}
 */
export const formatPermission = (permission) => {
	return permission
		.replace('_', ' ')
		.split('.')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' - ');
};

/**
 * Format role name for display
 * @param {string} role - Role constant
 * @returns {string}
 */
export const formatRole = (role) => {
	return role.charAt(0).toUpperCase() + role.slice(1).replace('_', ' ');
};

export default {
	ROLES,
	PERMISSIONS,
	ROLE_PERMISSIONS,
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
};
