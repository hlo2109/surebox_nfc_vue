import apiClient, { handleApiError } from './config';

/**
 * Get all users
 * @returns {Promise<object>} Users data
 */
export const getAllUsers = async () => {
	try {
		const response = await apiClient.get('/users');
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

export default {
	getAllUsers,
};
