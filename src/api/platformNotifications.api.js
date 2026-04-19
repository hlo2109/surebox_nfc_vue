import apiClient, { handleApiError } from './config';
import { ApiPlatformNotifications } from '@/constants/apiRoutes';

/**
 * @param {object} [opts]
 * @param {number} [opts.after] - DB id: solo filas con id mayor (polling incremental).
 * @param {number} [opts.limit]
 * @returns {Promise<{ items: object[], unreadCount: number }>}
 */
export const fetchPlatformNotifications = async (opts = {}) => {
	try {
		const params = {};
		if (opts.after != null && opts.after > 0) {
			params.after = opts.after;
		}
		if (opts.limit) {
			params.limit = opts.limit;
		}
		const response = await apiClient.get(ApiPlatformNotifications.LIST, {
			params,
		});
		const d = response.data?.data;
		return {
			items: Array.isArray(d?.items) ? d.items : [],
			unreadCount: Number(d?.unreadCount) || 0,
		};
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

export const fetchPlatformUnreadCount = async () => {
	try {
		const response = await apiClient.get(
			ApiPlatformNotifications.UNREAD_COUNT,
		);
		const d = response.data?.data;
		return { unreadCount: Number(d?.unreadCount) || 0 };
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * @param {number} notificationId - Marca como leídas hasta este id inclusive.
 */
export const markPlatformNotificationsRead = async (notificationId) => {
	try {
		const response = await apiClient.post(
			ApiPlatformNotifications.MARK_READ,
			{ notificationId },
		);
		const d = response.data?.data;
		return { unreadCount: Number(d?.unreadCount) || 0 };
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};
