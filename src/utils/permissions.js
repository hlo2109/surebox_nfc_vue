/**
 * Permissions Utility
 * Defines roles, permissions, and access control logic.
 *
 * IMPORTANT: The values of PERMISSIONS constants must match
 * the permission names returned by the API (snake_case).
 * Example API response:
 *   { "permissions": [{ "id": 1, "name": "create_company" }, ...] }
 *
 * hasPermission() checks user.permissions[] from the API first.
 * If the user object has no permissions array it falls back to the
 * static ROLE_PERMISSIONS map so older cached sessions still work.
 */

// ─── Role definitions ──────────────────────────────────────────────────────────
export const ROLES = {
	OWNER: 'owner',
	ADMIN: 'admin',
	MANAGER: 'manager',
	MEMBER: 'member',
	EMPLOYEE: 'employee',
	CUSTOMER: 'customer',
	SUPER_ADMIN: 'super_admin',
};

// ─── Permission definitions ────────────────────────────────────────────────────
// Values MUST match the exact permission names the API returns.
export const PERMISSIONS = {
	// Company permissions
	COMPANY_CREATE: 'create_company',
	COMPANY_VIEW: 'view_company',
	COMPANY_EDIT: 'edit_company',
	COMPANY_DELETE: 'delete_company',
	COMPANY_MANAGE_MEMBERS: 'manage_company_members',
	COMPANY_MANAGE_LOCATIONS: 'manage_company_locations',
	COMPANY_MANAGE_CATEGORIES: 'manage_company_services',
	COMPANY_VIEW_MEMBERS: 'view_members',


	SERVICE_CREATE: 'create_service',
	SERVICE_VIEW: 'view_services',
	SERVICE_EDIT: 'edit_service',
	SERVICE_DELETE: 'delete_service',
	SERVICE_MANAGE: 'manage_services',

	// Service Request permissions
	REQUEST_CREATE: 'create_service_request',
	REQUEST_VIEW: 'view_requests',
	REQUEST_VIEW_OWN: 'view_own_requests',
	REQUEST_VIEW_ALL: 'view_all_requests',
	REQUEST_EDIT: 'edit_request',
	REQUEST_EDIT_OWN: 'edit_own_request',
	REQUEST_DELETE: 'delete_request',
	REQUEST_ASSIGN: 'assign_request',
	REQUEST_UPDATE_STATUS: 'update_request_status',

	// Quote permissions
	QUOTE_CREATE: 'create_quote',
	QUOTE_VIEW: 'view_quotes',
	QUOTE_ACCEPT: 'accept_quote',
	QUOTE_REJECT: 'reject_quote',

	// Assignment permissions
	ASSIGNMENT_CREATE: 'create_assignment',
	ASSIGNMENT_VIEW: 'view_assignments',
	ASSIGNMENT_UPDATE: 'update_assignment',
	ASSIGNMENT_COMPLETE: 'complete_assignment',

	// GPS Tracking permissions
	TRACKING_START: 'start_tracking',
	TRACKING_STOP: 'stop_tracking',
	TRACKING_VIEW: 'view_tracking',

	// NFC / Box permissions
	// NFC_MANAGE covers all NFC operations when the API grants a single "manage" permission.
	// The granular ones (NFC_VIEW, NFC_CREATE, etc.) are used when the API is more specific.
	NFC_MANAGE: 'manage_nfc',
	NFC_VIEW: 'view_nfc',
	NFC_CREATE: 'create_nfc',
	NFC_EDIT: 'edit_nfc',
	NFC_DELETE: 'delete_nfc',

	// Admin / role management permissions
	ADMIN_ACCESS: 'admin_access',
	ADMIN_USERS: 'view_users',
	ADMIN_ASSIGN_ROLES: 'assign_roles',
	ADMIN_COMPANIES: 'manage_companies',
};

// ─── Role-based permission mapping (fallback only) ─────────────────────────────
// This is used ONLY when the user object has no permissions[] from the API.
// Keep these in sync with your backend roles as a safety net.
/**
 * API role names from surebox_api_sass seed (company_admin, etc.) that are not
 * in ROLES above — used only for ROLE_PERMISSIONS fallback.
 */
export const ROLE_PERMISSIONS = {
	[ROLES.SUPER_ADMIN]: ['*'],

	// Platform / company API roles (seed_rbac_and_demo_data.js)
	company_admin: [
		PERMISSIONS.COMPANY_CREATE,
		PERMISSIONS.COMPANY_VIEW,
		PERMISSIONS.COMPANY_EDIT,
		PERMISSIONS.COMPANY_DELETE,
		PERMISSIONS.COMPANY_MANAGE_MEMBERS,
		PERMISSIONS.COMPANY_MANAGE_LOCATIONS,
		PERMISSIONS.COMPANY_MANAGE_CATEGORIES,
		PERMISSIONS.COMPANY_VIEW_MEMBERS,
		PERMISSIONS.SERVICE_CREATE,
		PERMISSIONS.SERVICE_VIEW,
		PERMISSIONS.SERVICE_EDIT,
		PERMISSIONS.SERVICE_DELETE,
		PERMISSIONS.SERVICE_MANAGE,
		PERMISSIONS.REQUEST_VIEW_ALL,
		PERMISSIONS.REQUEST_EDIT,
		PERMISSIONS.REQUEST_ASSIGN,
		PERMISSIONS.REQUEST_UPDATE_STATUS,
		PERMISSIONS.QUOTE_CREATE,
		PERMISSIONS.QUOTE_VIEW,
		PERMISSIONS.ASSIGNMENT_CREATE,
		PERMISSIONS.ASSIGNMENT_VIEW,
		PERMISSIONS.ASSIGNMENT_UPDATE,
		PERMISSIONS.TRACKING_VIEW,
		PERMISSIONS.NFC_MANAGE,
		PERMISSIONS.NFC_VIEW,
		PERMISSIONS.NFC_CREATE,
		PERMISSIONS.NFC_EDIT,
		PERMISSIONS.NFC_DELETE,
	],

	[ROLES.OWNER]: [
		PERMISSIONS.COMPANY_VIEW,
		PERMISSIONS.COMPANY_EDIT,
		PERMISSIONS.COMPANY_DELETE,
		PERMISSIONS.COMPANY_MANAGE_MEMBERS,
		PERMISSIONS.COMPANY_MANAGE_LOCATIONS,
		PERMISSIONS.COMPANY_MANAGE_CATEGORIES,
		PERMISSIONS.COMPANY_VIEW_MEMBERS,
		PERMISSIONS.SERVICE_CREATE,
		PERMISSIONS.SERVICE_VIEW,
		PERMISSIONS.SERVICE_EDIT,
		PERMISSIONS.SERVICE_DELETE,
		PERMISSIONS.SERVICE_MANAGE,
		PERMISSIONS.REQUEST_VIEW_ALL,
		PERMISSIONS.REQUEST_EDIT,
		PERMISSIONS.REQUEST_ASSIGN,
		PERMISSIONS.REQUEST_UPDATE_STATUS,
		PERMISSIONS.QUOTE_CREATE,
		PERMISSIONS.QUOTE_VIEW,
		PERMISSIONS.ASSIGNMENT_CREATE,
		PERMISSIONS.ASSIGNMENT_VIEW,
		PERMISSIONS.ASSIGNMENT_UPDATE,
		PERMISSIONS.TRACKING_VIEW,
		PERMISSIONS.NFC_MANAGE,
		PERMISSIONS.NFC_VIEW,
		PERMISSIONS.NFC_CREATE,
		PERMISSIONS.NFC_EDIT,
		PERMISSIONS.NFC_DELETE,
	],

	[ROLES.ADMIN]: [
		PERMISSIONS.COMPANY_VIEW,
		PERMISSIONS.COMPANY_EDIT,
		PERMISSIONS.COMPANY_MANAGE_MEMBERS,
		PERMISSIONS.COMPANY_MANAGE_LOCATIONS,
		PERMISSIONS.COMPANY_MANAGE_CATEGORIES,
		PERMISSIONS.COMPANY_VIEW_MEMBERS,
		PERMISSIONS.SERVICE_CREATE,
		PERMISSIONS.SERVICE_VIEW,
		PERMISSIONS.SERVICE_EDIT,
		PERMISSIONS.SERVICE_DELETE,
		PERMISSIONS.SERVICE_MANAGE,
		PERMISSIONS.REQUEST_VIEW_ALL,
		PERMISSIONS.REQUEST_EDIT,
		PERMISSIONS.REQUEST_ASSIGN,
		PERMISSIONS.REQUEST_UPDATE_STATUS,
		PERMISSIONS.QUOTE_CREATE,
		PERMISSIONS.QUOTE_VIEW,
		PERMISSIONS.ASSIGNMENT_CREATE,
		PERMISSIONS.ASSIGNMENT_VIEW,
		PERMISSIONS.ASSIGNMENT_UPDATE,
		PERMISSIONS.TRACKING_VIEW,
		PERMISSIONS.NFC_MANAGE,
		PERMISSIONS.NFC_VIEW,
		PERMISSIONS.NFC_CREATE,
		PERMISSIONS.NFC_EDIT,
		PERMISSIONS.NFC_DELETE,
	],

	[ROLES.MANAGER]: [
		PERMISSIONS.COMPANY_VIEW,
		PERMISSIONS.COMPANY_VIEW_MEMBERS,
		PERMISSIONS.SERVICE_VIEW,
		PERMISSIONS.SERVICE_EDIT,
		PERMISSIONS.SERVICE_MANAGE,
		PERMISSIONS.REQUEST_VIEW_ALL,
		PERMISSIONS.REQUEST_ASSIGN,
		PERMISSIONS.REQUEST_UPDATE_STATUS,
		PERMISSIONS.QUOTE_CREATE,
		PERMISSIONS.QUOTE_VIEW,
		PERMISSIONS.ASSIGNMENT_CREATE,
		PERMISSIONS.ASSIGNMENT_VIEW,
		PERMISSIONS.ASSIGNMENT_UPDATE,
		PERMISSIONS.TRACKING_VIEW,
		PERMISSIONS.NFC_MANAGE,
		PERMISSIONS.NFC_VIEW,
		PERMISSIONS.NFC_CREATE,
	],

	[ROLES.MEMBER]: [
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

	[ROLES.EMPLOYEE]: [
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
		PERMISSIONS.SERVICE_VIEW,
		PERMISSIONS.REQUEST_CREATE,
		PERMISSIONS.REQUEST_VIEW_OWN,
		PERMISSIONS.REQUEST_EDIT_OWN,
		PERMISSIONS.QUOTE_VIEW,
		PERMISSIONS.QUOTE_ACCEPT,
		PERMISSIONS.QUOTE_REJECT,
		PERMISSIONS.ASSIGNMENT_VIEW,
		PERMISSIONS.TRACKING_VIEW,
		PERMISSIONS.NFC_MANAGE,
		PERMISSIONS.NFC_VIEW,
		PERMISSIONS.NFC_CREATE,
		PERMISSIONS.NFC_EDIT,
		PERMISSIONS.NFC_DELETE,
	],
};

/** Roles that always manage their own NFC tags (aligned with API seed roles). */
const ROLES_WITH_OWN_NFC_ACCESS = new Set([
	ROLES.CUSTOMER,
	ROLES.EMPLOYEE,
	ROLES.MEMBER,
	ROLES.MANAGER,
	ROLES.OWNER,
	ROLES.ADMIN,
	'company_admin',
	'admin',
]);

// ─── Core permission checker ───────────────────────────────────────────────────

/**
 * Check if a user has a specific permission.
 *
 * Flow:
 *   1. Super-admin role → always granted.
 *   2. user.permissions[] present (API-driven) → direct name match, plus
 *      `manage_*` wildcard; NFC keys also allowed for customer/employee/company
 *      roles when the API list omits explicit *_nfc rows (see ROLES_WITH_OWN_NFC_ACCESS).
 *   3. No permissions[] (old cached session) → role-based ROLE_PERMISSIONS map.
 *
 * @param {Object}  user       - User object from the store (has roles[] and/or permissions[])
 * @param {string}  permission - A PERMISSIONS constant value, e.g. 'view_nfc'
 * @param {Object}  context    - Optional: { requireOwnership, resourceOwnerId }
 * @returns {boolean}
 */
export const hasPermission = (user, permission, context = {}) => {
	if (!user) return false;

	const getRoleName = (role) => (typeof role === 'string' ? role : role?.name);

	const userRoles = Array.isArray(user.roles)
		? user.roles
		: user.role
			? [user.role]
			: [];

	// 1. Super-admin bypasses everything
	if (userRoles.some((r) => getRoleName(r) === ROLES.SUPER_ADMIN)) {
		return true;
	}

	// 2. API-driven check – user.permissions[] returned by the server
	if (Array.isArray(user.permissions) && user.permissions.length > 0) {
		// Derive the broad "manage_X" equivalent for any granular permission.
		// e.g. 'view_nfc' → 'manage_nfc'
		// This means a user who has manage_nfc automatically satisfies
		// view_nfc, create_nfc, edit_nfc, and delete_nfc checks.
		const manageEquivalent = permission.replace(
			/^(view|create|edit|delete|update)_/,
			'manage_',
		);
		const hasManageWildcard = manageEquivalent !== permission;

		const granted = user.permissions.some((p) => {
			const pName = typeof p === 'string' ? p : p?.name;
			return pName === permission || (hasManageWildcard && pName === manageEquivalent);
		});

		if (granted) {
			if (context.requireOwnership) {
				return user.id === context.resourceOwnerId;
			}
			return true;
		}

		// Own NFC tags: list/create/edit API routes are scoped to the current user.
		// Older DB seeds omitted explicit *_nfc rows while still assigning customer /
		// employee / company_admin — grant NFC UI checks from role so the router
		// matches product policy without requiring a DB migration for every env.
		const nfcKeys = new Set([
			PERMISSIONS.NFC_VIEW,
			PERMISSIONS.NFC_CREATE,
			PERMISSIONS.NFC_EDIT,
			PERMISSIONS.NFC_DELETE,
			PERMISSIONS.NFC_MANAGE,
		]);
		if (
			nfcKeys.has(permission) &&
			userRoles.some((r) => ROLES_WITH_OWN_NFC_ACCESS.has(getRoleName(r)))
		) {
			return true;
		}

		// Permission array exists but this permission is not in it → deny
		return false;
	}

	// 3. Role-based fallback (no permissions array available)
	for (const role of userRoles) {
		const roleName = getRoleName(role);
		const rolePermissions = ROLE_PERMISSIONS[roleName] || [];

		if (rolePermissions.includes('*')) {
			return true;
		}

		if (rolePermissions.includes(permission)) {
			if (context.requireOwnership) {
				return user.id === context.resourceOwnerId;
			}
			return true;
		}
	}

	return false;
};

/**
 * Check if user has any of the given permissions.
 * @param {Object}   user        - User object
 * @param {string[]} permissions - Array of PERMISSIONS constants
 * @param {Object}   context     - Optional context
 * @returns {boolean}
 */
export const hasAnyPermission = (user, permissions, context = {}) => {
	return permissions.some((permission) => hasPermission(user, permission, context));
};

/**
 * Check if user has all of the given permissions.
 * @param {Object}   user        - User object
 * @param {string[]} permissions - Array of PERMISSIONS constants
 * @param {Object}   context     - Optional context
 * @returns {boolean}
 */
export const hasAllPermissions = (user, permissions, context = {}) => {
	return permissions.every((permission) => hasPermission(user, permission, context));
};

/**
 * Check if user has a specific role by name.
 * @param {Object} user     - User object
 * @param {string} roleName - Role name (use ROLES constant)
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
		const name = typeof role === 'string' ? role : role?.name;
		return name === roleName;
	});
};

/**
 * Check if user has any of the given roles.
 * @param {Object}   user      - User object
 * @param {string[]} roleNames - Array of role names
 * @returns {boolean}
 */
export const hasAnyRole = (user, roleNames) => {
	return roleNames.some((roleName) => hasRole(user, roleName));
};

/**
 * Check if user is the owner of a specific company.
 * @param {Object} user      - User object
 * @param {number} companyId - Company ID
 * @returns {boolean}
 */
export const isCompanyOwner = (user, companyId) => {
	if (!user || !companyId) return false;

	const companies = user.companies || [];
	const company = companies.find((c) => c.id === companyId || c.company_id === companyId);
	if (!company) return false;

	const memberRole = typeof company.role === 'string' ? company.role : company.role?.name;
	return memberRole === ROLES.OWNER;
};

/**
 * Check if user is an admin of a specific company.
 * @param {Object} user      - User object
 * @param {number} companyId - Company ID
 * @returns {boolean}
 */
export const isCompanyAdmin = (user, companyId) => {
	if (!user || !companyId) return false;

	const companies = user.companies || [];
	const company = companies.find((c) => c.id === companyId || c.company_id === companyId);
	if (!company) return false;

	const memberRole = typeof company.role === 'string' ? company.role : company.role?.name;
	return memberRole === ROLES.ADMIN || company.role_in_company === 'admin';
};

/**
 * Check if user can manage a company (owner or admin of that company).
 * @param {Object} user      - User object
 * @param {number} companyId - Company ID
 * @returns {boolean}
 */
export const canManageCompany = (user, companyId) => {
	return isCompanyOwner(user, companyId) || isCompanyAdmin(user, companyId);
};

/**
 * Get user's role within a specific company.
 * @param {Object} user      - User object
 * @param {number} companyId - Company ID
 * @returns {string|null}
 */
export const getUserCompanyRole = (user, companyId) => {
	if (!user || !companyId) return null;

	const companies = user.companies || [];
	const company = companies.find((c) => c.id === companyId || c.company_id === companyId);
	if (!company) return null;

	return company.role_in_company
		|| (typeof company.role === 'string' ? company.role : company.role?.name)
		|| null;
};

/**
 * Format a permission name for human display.
 * @param {string} permission - Permission constant value
 * @returns {string}
 */
export const formatPermission = (permission) => {
	return permission
		.split('_')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
};

/**
 * Format a role name for human display.
 * @param {string} role - Role constant value
 * @returns {string}
 */
export const formatRole = (role) => {
	return role
		.split('_')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
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
