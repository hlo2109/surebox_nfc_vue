/**
 * Primary company membership helpers (first company on the user profile).
 * Used by the auth store and router guards so role logic stays in one place.
 */

/**
 * @param {object|null|undefined} user
 * @returns {boolean}
 */
export function userHasCompanyMembership(user) {
	if (!user) return false;
	return (
		(user.companies && user.companies.length > 0) ||
		!!user.company_id ||
		!!user.companyId
	);
}

/**
 * Role string inside the user's primary company (JWT /auth/me shape).
 * @param {object|null|undefined} user
 * @returns {string|null}
 */
export function getPrimaryCompanyRole(user) {
	if (!user) return null;
	const companies = user.companies || [];
	if (companies.length === 0) return null;
	const c = companies[0];
	return (
		c.role_in_company ||
		(typeof c.role === 'string' ? c.role : c.role?.name) ||
		null
	);
}

/**
 * Company creator / backoffice admin (SureBox uses role_in_company === 'admin').
 * @param {object|null|undefined} user
 * @returns {boolean}
 */
export function isPrimaryCompanyAdmin(user) {
	return getPrimaryCompanyRole(user) === 'admin';
}

/**
 * True if the user may use company backoffice (/my/company, members, services, …).
 * Matches API `requireCompanyAdmin`: company_user role `admin` or `manager`, or
 * system role `company_admin` (owner registering with a company).
 * @param {object|null|undefined} user
 * @returns {boolean}
 */
export function canManageCompanyWorkspace(user) {
	if (!userHasCompanyMembership(user)) return false;
	const inCompany = getPrimaryCompanyRole(user);
	if (inCompany === 'admin' || inCompany === 'manager') return true;
	const roles = Array.isArray(user?.roles) ? user.roles : [];
	const names = roles
		.map((r) => (typeof r === 'string' ? r : r?.name))
		.filter(Boolean);
	return names.includes('company_admin');
}

/**
 * Company member with role `employee` in the primary company (field / assignments UI).
 * @param {object|null|undefined} user
 * @returns {boolean}
 */
export function isPrimaryCompanyFieldStaff(user) {
	if (!userHasCompanyMembership(user)) return false;
	return getPrimaryCompanyRole(user) === 'employee';
}
