import * as employeeWorkDayApi from '@/api/employeeWorkDay.api';
import { useToast } from './useToast';

/**
 * Fixed-site work day: status, clock-in, clock-out (NFC + GPS).
 */
export const useEmployeeWorkDay = () => {
	const toast = useToast();

	const fetchWorkDayStatus = async () => {
		try {
			const response = await employeeWorkDayApi.getMyWorkDayStatus();
			if (response.success === false) {
				throw new Error(response.message || 'Failed to load work day status');
			}
			return { success: true, data: response.data };
		} catch (error) {
			const msg = error.message || 'Failed to load work day status.';
			return { success: false, error: msg };
		}
	};

	const clockInWorkDay = async (payload) => {
		try {
			const response = await employeeWorkDayApi.postMyWorkDayClockIn(payload);
			if (response.success === false) {
				throw new Error(response.message || 'Clock-in failed');
			}
			toast.showSuccess(response.message || 'Work day started');
			return { success: true, data: response.data };
		} catch (error) {
			const msg = error.message || 'Clock-in failed.';
			toast.showError(msg);
			return { success: false, error: msg };
		}
	};

	const clockOutWorkDay = async (payload) => {
		try {
			const response = await employeeWorkDayApi.postMyWorkDayClockOut(payload);
			if (response.success === false) {
				throw new Error(response.message || 'Clock-out failed');
			}
			toast.showSuccess(response.message || 'Work day ended');
			return { success: true, data: response.data };
		} catch (error) {
			const msg = error.message || 'Clock-out failed.';
			toast.showError(msg);
			return { success: false, error: msg };
		}
	};

	return {
		fetchWorkDayStatus,
		clockInWorkDay,
		clockOutWorkDay,
	};
};

export default useEmployeeWorkDay;
