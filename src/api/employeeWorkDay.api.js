import apiClient, { handleApiError } from './config';

/**
 * Fixed-site work day (clock in / out) for employees on a location staff list.
 */

export const getMyWorkDayStatus = async () => {
	try {
		const response = await apiClient.get('/my/employee/work-day/status');
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * @param {object} body
 * @param {string} body.companyLocationUuid
 * @param {number} body.lat
 * @param {number} body.lng
 * @param {string} [body.nfcCode]
 * @param {'day'|'night'|'travel'} [body.scheduleType]
 * @param {boolean} [body.travelIncluded] legacy: only applied when scheduleType is day or night
 */
export const postMyWorkDayClockIn = async (body) => {
	try {
		const response = await apiClient.post('/my/employee/work-day/clock-in', body);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};

/**
 * @param {object} body
 * @param {number} body.lat
 * @param {number} body.lng
 * @param {string} [body.nfcCode]
 */
export const postMyWorkDayClockOut = async (body) => {
	try {
		const response = await apiClient.post('/my/employee/work-day/clock-out', body);
		return response.data;
	} catch (error) {
		throw new Error(handleApiError(error));
	}
};
