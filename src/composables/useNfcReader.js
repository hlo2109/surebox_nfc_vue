import { ref, computed } from 'vue';
import {
	isNFCSupported,
	isMobileDevice,
	isDesktopDevice,
	getDeviceType,
	checkNFCAvailability,
	readNFCTag,
	getBrowserCompatibility,
} from '@/utils/nfc';
import { useToast } from './useToast';

/**
 * NFC Reader Composable
 * Handles NFC tag reading with device detection and state management
 */
export const useNfcReader = () => {
	const { showToast } = useToast();

	// State
	const isReading = ref(false);
	const lastReadCode = ref(null);
	const error = ref(null);

	// Device detection
	const deviceType = ref(getDeviceType());
	const isMobile = ref(isMobileDevice());
	const isDesktop = ref(isDesktopDevice());
	const nfcSupported = ref(isNFCSupported());

	// Computed
	const canUseNFC = computed(() => {
		const availability = checkNFCAvailability();
		return availability.available;
	});

	const nfcStatusMessage = computed(() => {
		const availability = checkNFCAvailability();
		return availability.reason;
	});

	const browserCompatibility = computed(() => {
		return getBrowserCompatibility();
	});

	/**
	 * Read NFC tag and return the code
	 * @param {object} options - Reading options
	 * @param {number} options.timeout - Timeout in milliseconds (default: 15000)
	 * @param {function} options.onSuccess - Success callback
	 * @param {function} options.onError - Error callback
	 * @returns {Promise<string|null>} NFC code or null
	 */
	const readNFC = async (options = {}) => {
		const {
			timeout = 15000,
			onSuccess = null,
			onError = null,
		} = options;

		// Check if NFC is available
		if (!canUseNFC.value) {
			const errorMsg = nfcStatusMessage.value;
			error.value = errorMsg;

			if (isDesktop.value) {
				showToast(
					'info',
					'NFC Not Available',
					'NFC reading is only available on mobile devices. Please use a mobile device or enter the code manually.',
				);
			} else if (!nfcSupported.value) {
				const compatibility = browserCompatibility.value;
				showToast(
					'warn',
					'NFC Not Supported',
					compatibility.message,
				);
			}

			if (onError) onError(errorMsg);
			return null;
		}

		// Start reading
		isReading.value = true;
		error.value = null;

		try {
			showToast(
				'info',
				'Ready to Scan',
				'Hold your device near the NFC tag to read it...',
			);

			const code = await readNFCTag({
				timeout,
				onReading: () => {
					console.log('NFC reading started...');
				},
				onError: (err) => {
					console.error('NFC reading error:', err);
				},
			});

			// Success
			lastReadCode.value = code;
			isReading.value = false;

			showToast(
				'success',
				'NFC Tag Read',
				`Successfully read NFC code: ${code}`,
			);

			if (onSuccess) onSuccess(code);
			return code;

		} catch (err) {
			console.error('NFC read error:', err);
			isReading.value = false;

			// Handle specific error codes
			let errorTitle = 'NFC Read Failed';
			let errorMessage = err.message || 'Failed to read NFC tag';

			switch (err.code) {
				case 'NOT_AVAILABLE':
					errorTitle = 'NFC Not Available';
					errorMessage = isDesktop.value
						? 'NFC is only available on mobile devices'
						: 'NFC is not available on this device';
					break;

				case 'TIMEOUT':
					errorTitle = 'Reading Timeout';
					errorMessage = 'No NFC tag detected. Please try again and hold your device close to the tag.';
					break;

				case 'SCAN_ERROR':
					errorTitle = 'Scan Error';
					errorMessage = err.message.includes('permission')
						? 'NFC permission denied. Please allow NFC access in your browser settings.'
						: 'Failed to start NFC scan. Please try again.';
					break;

				case 'READ_ERROR':
					errorTitle = 'Read Error';
					errorMessage = 'Failed to read the NFC tag. Please try again or check if the tag is valid.';
					break;

				case 'PARSE_ERROR':
					errorTitle = 'Invalid Tag';
					errorMessage = 'The NFC tag data could not be read. Please check if it\'s a valid box tag.';
					break;

				case 'INIT_ERROR':
					errorTitle = 'NFC Initialization Failed';
					errorMessage = 'Could not initialize NFC reader. Please check your device settings.';
					break;

				default:
					errorMessage = err.message || 'An unknown error occurred while reading NFC tag';
			}

			error.value = errorMessage;

			showToast('error', errorTitle, errorMessage);

			if (onError) onError(err);
			return null;
		}
	};

	/**
	 * Clear error state
	 */
	const clearError = () => {
		error.value = null;
	};

	/**
	 * Clear last read code
	 */
	const clearLastCode = () => {
		lastReadCode.value = null;
	};

	/**
	 * Reset all state
	 */
	const reset = () => {
		isReading.value = false;
		lastReadCode.value = null;
		error.value = null;
	};

	/**
	 * Show NFC availability info
	 */
	const showNFCInfo = () => {
		const availability = checkNFCAvailability();
		const compatibility = browserCompatibility.value;

		let title = 'NFC Information';
		let message = '';
		let severity = 'info';

		if (availability.available) {
			title = 'NFC Available';
			message = `Your device supports NFC reading. Tap the NFC button to scan a tag.`;
			severity = 'success';
		} else if (isDesktop.value) {
			title = 'Desktop Device Detected';
			message = 'NFC reading is only available on mobile devices. Please use your phone or tablet, or enter the box code manually.';
			severity = 'info';
		} else if (!nfcSupported.value) {
			title = 'NFC Not Supported';
			message = compatibility.message;
			severity = 'warn';
		} else {
			title = 'NFC Not Available';
			message = availability.reason;
			severity = 'warn';
		}

		showToast(severity, title, message);
	};

	/**
	 * Get device info string for debugging
	 */
	const getDeviceInfo = () => {
		const compatibility = browserCompatibility.value;
		return {
			deviceType: deviceType.value,
			isMobile: isMobile.value,
			isDesktop: isDesktop.value,
			nfcSupported: nfcSupported.value,
			canUseNFC: canUseNFC.value,
			browser: Object.keys(compatibility).find(key => compatibility[key] === true && key !== 'nfcSupported' && key !== 'nfcRecommended'),
			userAgent: navigator.userAgent,
		};
	};

	return {
		// State
		isReading,
		lastReadCode,
		error,

		// Device info
		deviceType,
		isMobile,
		isDesktop,
		nfcSupported,

		// Computed
		canUseNFC,
		nfcStatusMessage,
		browserCompatibility,

		// Actions
		readNFC,
		clearError,
		clearLastCode,
		reset,
		showNFCInfo,
		getDeviceInfo,
	};
};

export default useNfcReader;
