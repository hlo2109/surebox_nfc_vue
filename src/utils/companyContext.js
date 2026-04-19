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
 * Member of a company who is not the company admin — field staff (assignments, NFC on site).
 * @param {object|null|undefined} user
 * @returns {boolean}
 */
export function isPrimaryCompanyFieldStaff(user) {
	if (!userHasCompanyMembership(user)) return false;
	return !isPrimaryCompanyAdmin(user);
}
