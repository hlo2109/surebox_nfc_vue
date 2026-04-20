import apiClient, { handleApiError } from './config';

/** Company admin: all package deliveries for JWT company. */
export const getCompanyPackageDeliveries = async () => {
	try {
		const response = await apiClient.get('/packages');
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/** Company admin: live tracking for one delivery (UUID). */
export const getCompanyPackageDeliveryDetail = async (deliveryUuid) => {
	try {
		const response = await apiClient.get(`/packages/${deliveryUuid}`);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/** Company admin: create a standalone route (no service request). */
export const createCompanyPackageDelivery = async (body) => {
	try {
		const response = await apiClient.post('/packages', body);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/** Company admin: bulk import (max 1000, dedupe by externalRouteRef). */
export const bulkImportCompanyPackages = async (packages) => {
	try {
		const response = await apiClient.post('/my/company/packages/bulk', {
			packages,
		});
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

export const createCompanyPackageImportToken = async (label = '') => {
	try {
		const response = await apiClient.post('/my/company/packages/import-tokens', {
			label,
		});
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

export const listCompanyPackageImportTokens = async () => {
	try {
		const response = await apiClient.get('/my/company/packages/import-tokens');
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

export const revokeCompanyPackageImportToken = async (tokenUuid) => {
	try {
		const response = await apiClient.delete(
			`/my/company/packages/import-tokens/${tokenUuid}`,
		);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/** Courier: assigned deliveries. */
export const getMyAssignedPackages = async () => {
	try {
		const response = await apiClient.get('/my/packages');
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/** Customer: packages linked to their service requests. */
export const getMyCustomerPackageDeliveries = async () => {
	try {
		const response = await apiClient.get('/my/customer/package-deliveries');
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

export const getMyCustomerPackageDeliveryDetail = async (deliveryUuid) => {
	try {
		const response = await apiClient.get(
			`/my/customer/package-deliveries/${deliveryUuid}`,
		);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};
