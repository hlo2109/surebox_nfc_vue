import { useToast as usePrimeToast } from 'primevue/usetoast';

/**
 * Toast Composable
 * Wrapper around PrimeVue toast for consistent notifications
 */
export const useToast = () => {
	const toast = usePrimeToast();

	/**
	 * Show success toast
	 * @param {string} message - Success message
	 * @param {string} summary - Toast title (optional)
	 * @param {number} life - Toast duration in ms (default: 3000)
	 */
	const showSuccess = (message, summary = 'Success', life = 3000) => {
		toast.add({
			severity: 'success',
			summary,
			detail: message,
			life,
		});
	};

	/**
	 * Show error toast
	 * @param {string} message - Error message
	 * @param {string} summary - Toast title (optional)
	 * @param {number} life - Toast duration in ms (default: 5000)
	 */
	const showError = (message, summary = 'Error', life = 5000) => {
		toast.add({
			severity: 'error',
			summary,
			detail: message,
			life,
		});
	};

	/**
	 * Show warning toast
	 * @param {string} message - Warning message
	 * @param {string} summary - Toast title (optional)
	 * @param {number} life - Toast duration in ms (default: 4000)
	 */
	const showWarning = (message, summary = 'Warning', life = 4000) => {
		toast.add({
			severity: 'warn',
			summary,
			detail: message,
			life,
		});
	};

	/**
	 * Show info toast
	 * @param {string} message - Info message
	 * @param {string} summary - Toast title (optional)
	 * @param {number} life - Toast duration in ms (default: 3000)
	 */
	const showInfo = (message, summary = 'Info', life = 3000) => {
		toast.add({
			severity: 'info',
			summary,
			detail: message,
			life,
		});
	};

	/**
	 * Show custom toast
	 * @param {object} options - Toast options
	 */
	const show = (options) => {
		toast.add(options);
	};

	/**
	 * Show toast with custom severity
	 * @param {string} severity - Toast severity ('success', 'error', 'warn', 'info')
	 * @param {string} summary - Toast title
	 * @param {string} detail - Toast message
	 * @param {number} life - Toast duration in ms (optional)
	 */
	const showToast = (severity, summary, detail, life) => {
		const defaultLife = {
			success: 3000,
			error: 5000,
			warn: 4000,
			info: 3000,
		};

		toast.add({
			severity,
			summary,
			detail,
			life: life || defaultLife[severity] || 3000,
		});
	};

	/**
	 * Remove all toasts
	 */
	const clear = () => {
		toast.removeAllGroups();
	};

	return {
		showSuccess,
		showError,
		showWarning,
		showInfo,
		show,
		showToast,
		clear,
	};
};

export default useToast;
