/**
 * Formatters Utility
 * Common formatting functions for dates, currency, text, etc.
 */

/**
 * Format date to locale string
 * @param {string|Date} date - Date to format
 * @param {string} locale - Locale code (default: 'en-US')
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, locale = 'en-US', options = {}) => {
	if (!date) return '';

	const dateObj = new Date(date);
	if (isNaN(dateObj.getTime())) return '';

	const defaultOptions = {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		...options,
	};

	return new Intl.DateTimeFormat(locale, defaultOptions).format(dateObj);
};

/**
 * Format date to short format (MM/DD/YYYY)
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDateShort = (date) => {
	if (!date) return '';

	const dateObj = new Date(date);
	if (isNaN(dateObj.getTime())) return '';

	const month = String(dateObj.getMonth() + 1).padStart(2, '0');
	const day = String(dateObj.getDate()).padStart(2, '0');
	const year = dateObj.getFullYear();

	return `${month}/${day}/${year}`;
};

/**
 * Format date to ISO string (YYYY-MM-DD)
 * @param {string|Date} date - Date to format
 * @returns {string} ISO date string
 */
export const formatDateISO = (date) => {
	if (!date) return '';

	const dateObj = new Date(date);
	if (isNaN(dateObj.getTime())) return '';

	return dateObj.toISOString().split('T')[0];
};

/**
 * Format datetime to locale string
 * @param {string|Date} datetime - Datetime to format
 * @param {string} locale - Locale code (default: 'en-US')
 * @returns {string} Formatted datetime string
 */
export const formatDateTime = (datetime, locale = 'en-US') => {
	if (!datetime) return '';

	const dateObj = new Date(datetime);
	if (isNaN(dateObj.getTime())) return '';

	const options = {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	};

	return new Intl.DateTimeFormat(locale, options).format(dateObj);
};

/**
 * Format time only
 * @param {string|Date} datetime - Datetime to format
 * @param {string} locale - Locale code (default: 'en-US')
 * @returns {string} Formatted time string
 */
export const formatTime = (datetime, locale = 'en-US') => {
	if (!datetime) return '';

	const dateObj = new Date(datetime);
	if (isNaN(dateObj.getTime())) return '';

	const options = {
		hour: '2-digit',
		minute: '2-digit',
	};

	return new Intl.DateTimeFormat(locale, options).format(dateObj);
};

/**
 * Format relative time (e.g., "2 hours ago")
 * @param {string|Date} date - Date to format
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (date) => {
	if (!date) return '';

	const dateObj = new Date(date);
	if (isNaN(dateObj.getTime())) return '';

	const now = new Date();
	const diffInSeconds = Math.floor((now - dateObj) / 1000);

	if (diffInSeconds < 60) {
		return 'just now';
	}

	const diffInMinutes = Math.floor(diffInSeconds / 60);
	if (diffInMinutes < 60) {
		return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
	}

	const diffInHours = Math.floor(diffInMinutes / 60);
	if (diffInHours < 24) {
		return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
	}

	const diffInDays = Math.floor(diffInHours / 24);
	if (diffInDays < 7) {
		return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
	}

	const diffInWeeks = Math.floor(diffInDays / 7);
	if (diffInWeeks < 4) {
		return `${diffInWeeks} ${diffInWeeks === 1 ? 'week' : 'weeks'} ago`;
	}

	const diffInMonths = Math.floor(diffInDays / 30);
	if (diffInMonths < 12) {
		return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
	}

	const diffInYears = Math.floor(diffInDays / 365);
	return `${diffInYears} ${diffInYears === 1 ? 'year' : 'years'} ago`;
};

/**
 * Format currency
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: 'USD')
 * @param {string} locale - Locale code (default: 'en-US')
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'USD', locale = 'en-US') => {
	if (amount === null || amount === undefined || isNaN(amount)) return '';

	const options = {
		style: 'currency',
		currency: currency,
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	};

	return new Intl.NumberFormat(locale, options).format(amount);
};

/**
 * Format number with thousand separators
 * @param {number} number - Number to format
 * @param {string} locale - Locale code (default: 'en-US')
 * @returns {string} Formatted number string
 */
export const formatNumber = (number, locale = 'en-US') => {
	if (number === null || number === undefined || isNaN(number)) return '';

	return new Intl.NumberFormat(locale).format(number);
};

/**
 * Format percentage
 * @param {number} value - Value to format (0-1 or 0-100)
 * @param {boolean} isDecimal - Whether value is decimal (0-1) or whole (0-100)
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (value, isDecimal = true) => {
	if (value === null || value === undefined || isNaN(value)) return '';

	const percentage = isDecimal ? value * 100 : value;
	return `${percentage.toFixed(2)}%`;
};

/**
 * Format phone number
 * @param {string} phone - Phone number to format
 * @returns {string} Formatted phone number
 */
export const formatPhone = (phone) => {
	if (!phone) return '';

	// Remove all non-digit characters
	const cleaned = phone.replace(/\D/g, '');

	// Format as (XXX) XXX-XXXX for US numbers
	if (cleaned.length === 10) {
		return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
	}

	// Format as +X (XXX) XXX-XXXX for international
	if (cleaned.length === 11) {
		return `+${cleaned.slice(0, 1)} (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
	}

	// Return original if doesn't match expected length
	return phone;
};

/**
 * Capitalize first letter of string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export const capitalize = (str) => {
	if (!str) return '';
	return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Capitalize first letter of each word
 * @param {string} str - String to capitalize
 * @returns {string} Title case string
 */
export const toTitleCase = (str) => {
	if (!str) return '';
	return str
		.toLowerCase()
		.split(' ')
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
};

/**
 * Truncate string with ellipsis
 * @param {string} str - String to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated string
 */
export const truncate = (str, maxLength = 50) => {
	if (!str) return '';
	if (str.length <= maxLength) return str;
	return str.slice(0, maxLength - 3) + '...';
};

/**
 * Format file size
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes) => {
	if (!bytes || bytes === 0) return '0 Bytes';

	const k = 1024;
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Format coordinates to readable string
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {number} precision - Decimal places (default: 6)
 * @returns {string} Formatted coordinates
 */
export const formatCoordinates = (lat, lng, precision = 6) => {
	if (lat === null || lat === undefined || lng === null || lng === undefined) return '';

	const latFixed = Number(lat).toFixed(precision);
	const lngFixed = Number(lng).toFixed(precision);

	return `${latFixed}, ${lngFixed}`;
};

/**
 * Format status to display text
 * @param {string} status - Status value
 * @returns {string} Formatted status
 */
export const formatStatus = (status) => {
	if (!status) return '';

	// Replace underscores with spaces and capitalize
	return status
		.replace(/_/g, ' ')
		.split(' ')
		.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join(' ');
};

/**
 * Format duration in minutes to readable format
 * @param {number} minutes - Duration in minutes
 * @returns {string} Formatted duration
 */
export const formatDuration = (minutes) => {
	if (!minutes || minutes === 0) return '0 min';

	const hours = Math.floor(minutes / 60);
	const mins = minutes % 60;

	if (hours === 0) {
		return `${mins} min`;
	}

	if (mins === 0) {
		return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
	}

	return `${hours} ${hours === 1 ? 'hour' : 'hours'} ${mins} min`;
};

/**
 * Format NFC code to display format
 * @param {string} code - NFC code
 * @returns {string} Formatted NFC code
 */
export const formatNfcCode = (code) => {
	if (!code) return '';
	return code.toUpperCase();
};

/**
 * Strip HTML tags from string
 * @param {string} html - HTML string
 * @returns {string} Plain text
 */
export const stripHtml = (html) => {
	if (!html) return '';
	const tmp = document.createElement('DIV');
	tmp.innerHTML = html;
	return tmp.textContent || tmp.innerText || '';
};

/**
 * Format array to comma-separated string
 * @param {array} arr - Array to format
 * @param {string} property - Property to extract from objects (optional)
 * @returns {string} Comma-separated string
 */
export const arrayToString = (arr, property = null) => {
	if (!arr || !Array.isArray(arr)) return '';

	if (property) {
		return arr.map(item => item[property]).join(', ');
	}

	return arr.join(', ');
};

export default {
	formatDate,
	formatDateShort,
	formatDateISO,
	formatDateTime,
	formatTime,
	formatRelativeTime,
	formatCurrency,
	formatNumber,
	formatPercentage,
	formatPhone,
	capitalize,
	toTitleCase,
	truncate,
	formatFileSize,
	formatCoordinates,
	formatStatus,
	formatDuration,
	formatNfcCode,
	stripHtml,
	arrayToString,
};
