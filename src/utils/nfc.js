/**
 * NFC Utility Module
 * Handles NFC reading with Web NFC API and device detection
 */

/**
 * Check if the device supports NFC
 * @returns {boolean} True if NFC is supported
 */
export const isNFCSupported = () => {
	// Check if running on a compatible device
	if (typeof window === 'undefined') {
		return false;
	}

	// Check if Web NFC API is available
	if ('NDEFReader' in window) {
		return true;
	}

	return false;
};

/**
 * Check if the device is mobile
 * @returns {boolean} True if mobile device
 */
export const isMobileDevice = () => {
	if (typeof window === 'undefined') {
		return false;
	}

	// Check user agent
	const userAgent = navigator.userAgent || navigator.vendor || window.opera;

	// Check for mobile patterns
	const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;

	// Check touch capability
	const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

	// Check screen size
	const isSmallScreen = window.innerWidth <= 768;

	return mobileRegex.test(userAgent.toLowerCase()) || (hasTouch && isSmallScreen);
};

/**
 * Check if currently on desktop/PC
 * @returns {boolean} True if desktop device
 */
export const isDesktopDevice = () => {
	return !isMobileDevice();
};

/**
 * Get device type string
 * @returns {string} 'mobile', 'tablet', or 'desktop'
 */
export const getDeviceType = () => {
	if (typeof window === 'undefined') {
		return 'unknown';
	}

	const userAgent = navigator.userAgent.toLowerCase();
	const width = window.innerWidth;

	if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(userAgent)) {
		return 'tablet';
	}

	if (/mobile|iphone|ipod|blackberry|opera mini|iemobile|webos/i.test(userAgent)) {
		return 'mobile';
	}

	if (width < 768) {
		return 'mobile';
	}

	if (width < 1024) {
		return 'tablet';
	}

	return 'desktop';
};

/**
 * Check if NFC is available and can be used
 * @returns {object} Status object with availability info
 */
export const checkNFCAvailability = () => {
	const deviceType = getDeviceType();
	const isSupported = isNFCSupported();
	const isMobile = isMobileDevice();

	return {
		supported: isSupported,
		available: isSupported && isMobile,
		deviceType,
		reason: !isSupported
			? 'NFC API not supported by this browser'
			: !isMobile
				? 'NFC reading is only available on mobile devices'
				: 'NFC is available',
	};
};

/**
 * Request NFC permission
 * @returns {Promise<boolean>} True if permission granted
 */
export const requestNFCPermission = async () => {
	if (!isNFCSupported()) {
		throw new Error('NFC is not supported on this device/browser');
	}

	try {
		// Web NFC API doesn't require explicit permission request
		// Permission is requested when scan() is called
		// But we can check if it's likely to work
		return true;
	} catch (error) {
		console.error('Error requesting NFC permission:', error);
		return false;
	}
};

/**
 * Read NFC tag
 * @param {object} options - Reading options
 * @param {number} options.timeout - Timeout in milliseconds (default: 10000)
 * @param {function} options.onReading - Callback when reading starts
 * @param {function} options.onError - Callback when error occurs
 * @returns {Promise<string>} NFC tag data (code)
 */
export const readNFCTag = async (options = {}) => {
	const {
		timeout = 10000,
		onReading = null,
		onError = null,
	} = options;

	// Check availability
	const availability = checkNFCAvailability();
	if (!availability.available) {
		const error = new Error(availability.reason);
		error.code = 'NOT_AVAILABLE';
		throw error;
	}

	return new Promise((resolve, reject) => {
		let timeoutId;
		let abortController;

		try {
			const ndef = new NDEFReader();
			abortController = new AbortController();

			// Set timeout
			timeoutId = setTimeout(() => {
				abortController.abort();
				const error = new Error('NFC reading timeout - no tag detected');
				error.code = 'TIMEOUT';
				if (onError) onError(error);
				reject(error);
			}, timeout);

			// Start scanning
			ndef.scan({ signal: abortController.signal })
				.then(() => {
					if (onReading) onReading();
					console.log('NFC scan started - waiting for tag...');
				})
				.catch(error => {
					clearTimeout(timeoutId);
					console.error('NFC scan error:', error);

					const nfcError = new Error(getNFCErrorMessage(error));
					nfcError.code = 'SCAN_ERROR';
					nfcError.originalError = error;

					if (onError) onError(nfcError);
					reject(nfcError);
				});

			// Handle reading event
			ndef.addEventListener('reading', ({ message, serialNumber }) => {
				clearTimeout(timeoutId);
				abortController.abort();

				console.log('NFC tag detected:', { serialNumber, message });

				try {
					// Extract data from NFC tag
					const tagData = parseNFCMessage(message, serialNumber);
					resolve(tagData);
				} catch (error) {
					console.error('Error parsing NFC data:', error);
					const parseError = new Error('Failed to parse NFC tag data');
					parseError.code = 'PARSE_ERROR';
					parseError.originalError = error;
					if (onError) onError(parseError);
					reject(parseError);
				}
			}, { once: true });

			// Handle errors
			ndef.addEventListener('readingerror', (event) => {
				clearTimeout(timeoutId);
				abortController.abort();

				console.error('NFC reading error:', event);
				const error = new Error('Error reading NFC tag');
				error.code = 'READ_ERROR';
				error.originalError = event;

				if (onError) onError(error);
				reject(error);
			}, { once: true });

		} catch (error) {
			if (timeoutId) clearTimeout(timeoutId);
			if (abortController) abortController.abort();

			console.error('NFC initialization error:', error);
			const initError = new Error('Failed to initialize NFC reader');
			initError.code = 'INIT_ERROR';
			initError.originalError = error;

			if (onError) onError(initError);
			reject(initError);
		}
	});
};

/**
 * Parse NFC NDEF message
 * @param {NDEFMessage} message - NDEF message from tag
 * @param {string} serialNumber - Tag serial number
 * @returns {string} Parsed tag code
 */
const parseNFCMessage = (message, serialNumber) => {
	// Try to extract text from NDEF records
	for (const record of message.records) {
		console.log('NFC Record:', {
			recordType: record.recordType,
			mediaType: record.mediaType,
			id: record.id,
		});

		// Handle text records
		if (record.recordType === 'text') {
			const textDecoder = new TextDecoder(record.encoding || 'utf-8');
			const text = textDecoder.decode(record.data);
			console.log('NFC Text Record:', text);
			return text.trim();
		}

		// Handle URL records
		if (record.recordType === 'url') {
			const textDecoder = new TextDecoder('utf-8');
			const url = textDecoder.decode(record.data);
			console.log('NFC URL Record:', url);

			// Try to extract code from URL (e.g., https://example.com/box/ABC123)
			const codeMatch = url.match(/\/([A-Za-z0-9\-_]+)\/?$/);
			if (codeMatch) {
				return codeMatch[1];
			}
			return url;
		}

		// Handle absolute URL records
		if (record.recordType === 'absolute-url') {
			const textDecoder = new TextDecoder('utf-8');
			const url = textDecoder.decode(record.data);
			console.log('NFC Absolute URL Record:', url);

			// Extract code from URL
			const codeMatch = url.match(/\/([A-Za-z0-9\-_]+)\/?$/);
			if (codeMatch) {
				return codeMatch[1];
			}
			return url;
		}

		// Handle mime type records
		if (record.recordType === 'mime') {
			const textDecoder = new TextDecoder('utf-8');
			const data = textDecoder.decode(record.data);
			console.log('NFC MIME Record:', data);
			return data.trim();
		}
	}

	// Fallback to serial number if no readable data found
	if (serialNumber) {
		console.log('Using NFC serial number as code:', serialNumber);
		return serialNumber;
	}

	throw new Error('No readable data found in NFC tag');
};

/**
 * Get user-friendly error message
 * @param {Error} error - Original error
 * @returns {string} User-friendly error message
 */
const getNFCErrorMessage = (error) => {
	const errorName = error.name || '';
	const errorMessage = error.message || '';

	if (errorName === 'NotAllowedError') {
		return 'NFC permission denied. Please allow NFC access in your browser settings.';
	}

	if (errorName === 'NotSupportedError') {
		return 'NFC is not supported on this device or browser.';
	}

	if (errorName === 'NotReadableError') {
		return 'NFC hardware is not accessible. Please check your device settings.';
	}

	if (errorName === 'AbortError') {
		return 'NFC reading was cancelled.';
	}

	if (errorMessage.includes('not supported')) {
		return 'NFC is not supported on this device or browser.';
	}

	return errorMessage || 'An error occurred while reading NFC tag.';
};

/**
 * Cancel NFC reading operation
 * Note: The AbortController in readNFCTag handles cancellation
 * This is a utility function for external cancellation if needed
 */
export const cancelNFCReading = () => {
	// In practice, the AbortController in readNFCTag handles this
	// This function is here for API completeness
	console.log('NFC reading cancelled');
};

/**
 * Check browser compatibility
 * @returns {object} Compatibility info
 */
export const getBrowserCompatibility = () => {
	const userAgent = navigator.userAgent.toLowerCase();

	const browsers = {
		chrome: /chrome/.test(userAgent) && !/edg/.test(userAgent),
		edge: /edg/.test(userAgent),
		firefox: /firefox/.test(userAgent),
		safari: /safari/.test(userAgent) && !/chrome/.test(userAgent),
		opera: /opera|opr/.test(userAgent),
	};

	const isChromeBased = browsers.chrome || browsers.edge || browsers.opera;
	const nfcSupported = isNFCSupported();

	return {
		...browsers,
		nfcSupported,
		nfcRecommended: isChromeBased && isMobileDevice(),
		message: !nfcSupported
			? 'Web NFC is currently only supported in Chrome, Edge, and Opera on Android devices.'
			: 'Your browser supports NFC reading.',
	};
};

export default {
	isNFCSupported,
	isMobileDevice,
	isDesktopDevice,
	getDeviceType,
	checkNFCAvailability,
	requestNFCPermission,
	readNFCTag,
	cancelNFCReading,
	getBrowserCompatibility,
};
