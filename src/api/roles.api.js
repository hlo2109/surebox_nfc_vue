import apiClient, { handleApiError } from './config';

/**
 * Get roles for a company (admin only)
 * @returns {Promise<object>} Roles data
 */
export const getCompanyRoles = async () => {
	try {
		const response = await apiClient.get('/admin/roles');
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

export default {
	getCompanyRoles,
};
