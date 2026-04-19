/**
 * SureBox REST surface (paths relative to axios baseURL, usually /api/v1).
 * Single reference for modules and onboarding; callers still use api/*.js wrappers.
 *
 * Auth: /auth/*
 * Geography: /countries, /departments, /cities
 * Catalogue: /services, /services/categories, /services/:serviceId
 * Customer requests: /service-requests, /service-requests/:id, cancel, quotes, rate
 * My company (JWT): /my/company, members, invitations, locations, categories, services, service-requests
 * My employee: /my/employee/assignments (+ accept, reject, start, complete, tracking, verify-nfc)
 * NFC: /nfc, /nfc/:nfcId
 * Packages (when used): /packages, /my/packages
 */

export const ApiAuth = {
	LOGIN: '/auth/login',
	REGISTER: '/auth/register',
	REFRESH: '/auth/refresh',
	LOGOUT: '/auth/logout',
	ME: '/auth/me',
	CHANGE_PASSWORD: '/auth/change-password',
	INVITATION: (token) => `/auth/invitations/${token}`,
	ACCEPT_INVITATION: (token) => `/auth/invitations/${token}/accept`,
};

export const ApiNfc = {
	LIST: '/nfc',
	BY_ID: (nfcId) => `/nfc/${nfcId}`,
};

export const ApiServiceRequests = {
	LIST: '/service-requests',
	BY_ID: (requestId) => `/service-requests/${requestId}`,
	CANCEL: (requestId) => `/service-requests/${requestId}/cancel`,
	QUOTE_RESPOND: (requestId, quoteId) =>
		`/service-requests/${requestId}/quotes/${quoteId}/respond`,
	RATE: (requestId) => `/service-requests/${requestId}/rate`,
};

export const ApiMyEmployee = {
	ASSIGNMENTS: '/my/employee/assignments',
	ASSIGNMENT: (id) => `/my/employee/assignments/${id}`,
	ACCEPT: (id) => `/my/employee/assignments/${id}/accept`,
	REJECT: (id) => `/my/employee/assignments/${id}/reject`,
	START: (id) => `/my/employee/assignments/${id}/start`,
	COMPLETE: (id) => `/my/employee/assignments/${id}/complete`,
	TRACKING: (id) => `/my/employee/assignments/${id}/tracking`,
	VERIFY_NFC: (id) => `/my/employee/assignments/${id}/verify-nfc`,
};

export const ApiMyCompany = {
	PROFILE: '/my/company',
	SERVICE_REQUESTS: '/my/company/service-requests',
	SERVICE_REQUEST_STATUS: (requestId) => `/my/company/service-requests/${requestId}/status`,
	SERVICE_REQUEST_ASSIGN: (requestId) => `/my/company/service-requests/${requestId}/assign`,
	SERVICE_REQUEST_QUOTE: (requestId) => `/my/company/service-requests/${requestId}/quote`,
};

/** Feed global en plataforma (polling); mismo contenido para usuarios autenticados. */
export const ApiPlatformNotifications = {
	LIST: '/my/notifications',
	UNREAD_COUNT: '/my/notifications/unread-count',
	MARK_READ: '/my/notifications/mark-read',
};
