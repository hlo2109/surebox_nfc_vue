import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';
import About from './views/About.vue';
import Login from './views/Login.vue';
import Register from './views/Register.vue';
import ForgotPassword from './views/ForgotPassword.vue';
import ResetPassword from './views/ResetPassword.vue';
import Delivery from './views/deliverys.vue';
import MyBox from './views/MyBox.vue';
import CreateBox from './views/CreateBox.vue';
import EditBox from './views/EditBox.vue';
import MyCompany from './views/companies/MyCompany.vue';
import MyCompanies from './views/companies/MyCompanies.vue';
import CompanyDetail from './views/companies/CompanyDetail.vue';
import CreateCompany from './views/companies/CreateCompany.vue';
import EditCompany from './views/companies/EditCompany.vue';
import ServicesList from './views/services/ServicesList.vue';
import CompanyServices from './views/services/CompanyServices.vue';
import ServiceDetail from './views/services/ServiceDetail.vue';
import MyCompanyServices from './views/services/MyCompanyServices.vue';
import MyRequests from './views/requests/MyRequests.vue';
import CreateRequest from './views/requests/CreateRequest.vue';
import RequestDetail from './views/requests/RequestDetail.vue';
import Profile from './views/Profile.vue';
import Settings from './views/Settings.vue';
import Unauthorized from './views/Unauthorized.vue';
import { useAuthStore } from './stores/auth.store';
import { PERMISSIONS } from './utils/permissions';
import { getAccessToken } from './utils/storage';

const routes = [
	{
		path: '/',
		component: () => import('./layouts/MainLayout.vue'),
		children: [
			{ path: '', component: Home },
			{ path: 'about', component: About },
		],
	},
	{
		path: '/login',
		component: () => import('./layouts/AuthLayout.vue'),
		children: [
			{ path: '/login', component: Login },
		],
	},
	{
		path: '/register',
		component: () => import('./layouts/AuthLayout.vue'),
		children: [
			{ path: '/register', component: Register },
		],
	},
	{
		path: '/forgot-password',
		component: () => import('./layouts/AuthLayout.vue'),
		children: [
			{ path: '/forgot-password', component: ForgotPassword },
		],
	},
	{
		path: '/reset-password',
		component: () => import('./layouts/AuthLayout.vue'),
		children: [
			{ path: '/reset-password', component: ResetPassword },
		],
	},
	{
		path: '/delivery',
		component: () => import('./layouts/MainLayout.vue'),
		children: [
			{ path: '', component: Delivery },
		],
	},
	{
		path: '/mybox',
		component: () => import('./layouts/MainLayout.vue'),
		meta: { requiresPermission: PERMISSIONS.NFC_VIEW },
		children: [
			{ path: '', component: MyBox },
		],
	},
	{
		path: '/create-box',
		component: () => import('./layouts/MainLayout.vue'),
		meta: { requiresPermission: PERMISSIONS.NFC_CREATE },
		children: [
			{ path: '', component: CreateBox },
		],
	},
	{
		path: '/edit-box/:id',
		component: () => import('./layouts/MainLayout.vue'),
		meta: { requiresPermission: PERMISSIONS.NFC_EDIT },
		children: [
			{ path: '', component: EditBox },
		],
	},
	{
		path: '/my-company',
		component: () => import('./layouts/MainLayout.vue'),
		meta: { requiresCompany: true },
		children: [
			{
				path: '',
				name: 'MyCompany',
				component: MyCompany
			},
		],
	},
	{
		path: '/companies',
		component: () => import('./layouts/MainLayout.vue'),
		children: [
			{
				path: '',
				name: 'MyCompanies',
				component: MyCompanies
			},
		],
	},
	{
		path: '/companies/create',
		component: () => import('./layouts/MainLayout.vue'),
		children: [
			{
				path: '',
				name: 'CreateCompany',
				component: CreateCompany
			},
		],
	},
	{
		path: '/companies/:id',
		component: () => import('./layouts/MainLayout.vue'),
		children: [
			{
				path: '',
				name: 'CompanyDetail',
				component: CompanyDetail
			},
		],
	},
	{
		path: '/companies/:id/edit',
		component: () => import('./layouts/MainLayout.vue'),
		children: [
			{
				path: '',
				name: 'EditCompany',
				component: EditCompany
			},
		],
	},
	{
		path: '/services',
		component: () => import('./layouts/MainLayout.vue'),
		children: [
			{
				path: '',
				name: 'ServicesList',
				component: ServicesList
			},
		],
	},
	{
		path: '/services/:id',
		component: () => import('./layouts/MainLayout.vue'),
		children: [
			{
				path: '',
				name: 'ServiceDetail',
				component: ServiceDetail,
				props: true
			},
		],
	},
	{
		path: '/my-services',
		component: () => import('./layouts/MainLayout.vue'),
		meta: { requiresCompany: true },
		children: [
			{
				path: '',
				name: 'MyCompanyServices',
				component: MyCompanyServices
			},
		],
	},
	{
		path: '/companies/:companyId/services',
		component: () => import('./layouts/MainLayout.vue'),
		children: [
			{
				path: '',
				name: 'CompanyServices',
				component: CompanyServices,
				props: true
			},
		],
	},
	{
		path: '/requests',
		component: () => import('./layouts/MainLayout.vue'),
		children: [
			{
				path: '',
				name: 'MyRequests',
				component: MyRequests
			},
		],
	},
	{
		path: '/requests/create',
		component: () => import('./layouts/MainLayout.vue'),
		children: [
			{
				path: '',
				name: 'CreateRequest',
				component: CreateRequest
			},
		],
	},
	{
		path: '/requests/:id',
		component: () => import('./layouts/MainLayout.vue'),
		children: [
			{
				path: '',
				name: 'RequestDetail',
				component: RequestDetail,
				props: true
			},
		],
	},
	{
		path: '/profile',
		component: () => import('./layouts/MainLayout.vue'),
		children: [
			{
				path: '',
				name: 'Profile',
				component: Profile
			},
		],
	},
	{
		path: '/settings',
		component: () => import('./layouts/MainLayout.vue'),
		children: [
			{
				path: '',
				name: 'Settings',
				component: Settings
			},
		],
	},
	{
		path: '/unauthorized',
		component: () => import('./layouts/MainLayout.vue'),
		children: [
			{
				path: '',
				name: 'Unauthorized',
				component: Unauthorized
			},
		],
	},

];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

// Route Guards with RBAC
router.beforeEach((to, from, next) => {
	const publicPages = ['/login', '/register', '/forgot-password', '/reset-password', '/unauthorized'];
	const authRequired = !publicPages.includes(to.path);
	const jwt = getAccessToken();

	// Check authentication
	if (authRequired && !jwt) {
		return next('/login');
	}

	// Check role-based permissions
	if (to.meta.requiresRole) {
		const authStore = useAuthStore();
		const user = authStore.state.user;

		if (!user) {
			return next('/login');
		}

		const userRoles = Array.isArray(user.roles)
			? user.roles.map(r => typeof r === 'string' ? r : r.name)
			: user.role
				? [user.role]
				: [];

		const requiredRoles = Array.isArray(to.meta.requiresRole)
			? to.meta.requiresRole
			: [to.meta.requiresRole];

		const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));

		if (!hasRequiredRole) {
			return next({
				path: '/unauthorized',
				query: {
					message: `You need to be a ${requiredRoles.join(' or ')} to access this page.`
				}
			});
		}
	}

	// Check if route requires company
	if (to.meta.requiresCompany) {
		const authStore = useAuthStore();
		const user = authStore.state.user;

		if (!user) {
			return next('/login');
		}

		// Check if user has a company
		const hasCompany = (user.companies && user.companies.length > 0) ||
			!!user.company_id ||
			!!user.companyId;

		if (!hasCompany) {
			return next({
				path: '/',
				query: {
					message: 'You need to be associated with a company to access this page.'
				}
			});
		}
	}

	// Check permission-based access
	if (to.meta.requiresPermission) {
		const authStore = useAuthStore();
		const user = authStore.state.user;

		if (!user) {
			return next('/login');
		}

		// Import hasPermission dynamically to avoid circular dependency
		import('./utils/permissions').then(({ hasPermission }) => {
			const requiredPermissions = Array.isArray(to.meta.requiresPermission)
				? to.meta.requiresPermission
				: [to.meta.requiresPermission];

			const hasRequiredPermission = requiredPermissions.some(permission =>
				hasPermission(user, permission)
			);

			if (!hasRequiredPermission) {
				return next({
					path: '/unauthorized',
					query: {
						message: 'You do not have the required permissions to access this page.'
					}
				});
			}

			next();
		});
	} else {
		next();
	}
});

export default router;
