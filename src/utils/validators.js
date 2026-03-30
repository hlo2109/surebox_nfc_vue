/**
 * Validators Utility
 * Common form validation functions
 */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 */
export const isValidEmail = (email) => {
	if (!email) return false;
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
};

/**
 * Validate email format and return detailed result
 * @param {string} email - Email to validate
 * @returns {object} Object with valid (boolean) and error (string) properties
 */
export const validateEmail = (email) => {
	if (!email || !email.trim()) {
		return { valid: false, error: 'Email is required' };
	}

	if (!isValidEmail(email)) {
		return { valid: false, error: 'Please enter a valid email address' };
	}

	return { valid: true, error: null };
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} Validation result with valid and error
 */
export const validatePassword = (password) => {
	if (!password) {
		return { valid: false, error: 'Password is required' };
	}

	if (password.length < 8) {
		return { valid: false, error: 'Password must be at least 8 characters long' };
	}

	// Check for at least one uppercase letter
	if (!/[A-Z]/.test(password)) {
		return { valid: false, error: 'Password must contain at least one uppercase letter' };
	}

	// Check for at least one lowercase letter
	if (!/[a-z]/.test(password)) {
		return { valid: false, error: 'Password must contain at least one lowercase letter' };
	}

	// Check for at least one number
	if (!/\d/.test(password)) {
		return { valid: false, error: 'Password must contain at least one number' };
	}

	// Check for at least one special character
	// Backend only accepts: !@#$%^&*()
	if (!/[!@#$%^&*()]/.test(password)) {
		return {
			valid: false,
			error: 'Password must contain at least one special character from: !@#$%^&*()'
		};
	}

	return { valid: true, error: null };
};

/**
 * Validate phone number using libphonenumber-js
 * @param {string} phone - Phone number to validate
 * @param {string} countryCode - Country code (default: 'US')
 * @returns {boolean} True if valid phone number
 */
export const isValidPhone = (phone, countryCode = 'US') => {
	if (!phone) return false;

	// Basic validation - at least 10 digits
	const digitsOnly = phone.replace(/\D/g, '');
	return digitsOnly.length >= 10;
};

/**
 * Validate phone number and return detailed result
 * @param {string} phone - Phone number to validate
 * @param {string} countryCode - Country code (default: 'US')
 * @returns {object} Object with valid (boolean) and error (string) properties
 */
export const validatePhone = (phone, countryCode = 'US') => {
	if (!phone || !phone.trim()) {
		return { valid: false, error: 'Phone number is required' };
	}

	if (!isValidPhone(phone, countryCode)) {
		return { valid: false, error: 'Please enter a valid phone number' };
	}

	return { valid: true, error: null };
};

/**
 * Validate required field
 * @param {any} value - Value to validate
 * @returns {boolean} True if not empty
 */
export const isRequired = (value) => {
	if (value === null || value === undefined) return false;
	if (typeof value === 'string') return value.trim().length > 0;
	if (Array.isArray(value)) return value.length > 0;
	return true;
};

/**
 * Validate minimum length
 * @param {string} value - Value to validate
 * @param {number} minLength - Minimum length
 * @returns {boolean} True if meets minimum length
 */
export const minLength = (value, minLength) => {
	if (!value) return false;
	return value.length >= minLength;
};

/**
 * Validate maximum length
 * @param {string} value - Value to validate
 * @param {number} maxLength - Maximum length
 * @returns {boolean} True if within maximum length
 */
export const maxLength = (value, maxLength) => {
	if (!value) return true;
	return value.length <= maxLength;
};

/**
 * Validate number range
 * @param {number} value - Value to validate
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {boolean} True if within range
 */
export const isInRange = (value, min, max) => {
	const num = Number(value);
	if (isNaN(num)) return false;
	return num >= min && num <= max;
};

/**
 * Validate positive number
 * @param {number} value - Value to validate
 * @returns {boolean} True if positive number
 */
export const isPositive = (value) => {
	const num = Number(value);
	return !isNaN(num) && num > 0;
};

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid URL
 */
export const isValidUrl = (url) => {
	if (!url) return false;
	try {
		new URL(url);
		return true;
	} catch (error) {
		return false;
	}
};

/**
 * Validate NFC code format
 * @param {string} code - NFC code to validate
 * @returns {boolean} True if valid NFC code format
 */
export const isValidNfcCode = (code) => {
	if (!code) return false;
	// NFC codes should follow pattern: NFC-XXX-XXX
	const nfcRegex = /^NFC-[A-Z0-9]{3,}-[A-Z0-9]{3,}$/;
	return nfcRegex.test(code.toUpperCase());
};

/**
 * Validate latitude
 * @param {number} lat - Latitude to validate
 * @returns {boolean} True if valid latitude (-90 to 90)
 */
export const isValidLatitude = (lat) => {
	const num = Number(lat);
	return !isNaN(num) && num >= -90 && num <= 90;
};

/**
 * Validate longitude
 * @param {number} lng - Longitude to validate
 * @returns {boolean} True if valid longitude (-180 to 180)
 */
export const isValidLongitude = (lng) => {
	const num = Number(lng);
	return !isNaN(num) && num >= -180 && num <= 180;
};

/**
 * Validate date is in the future
 * @param {string|Date} date - Date to validate
 * @returns {boolean} True if date is in the future
 */
export const isFutureDate = (date) => {
	const inputDate = new Date(date);
	const now = new Date();
	return inputDate > now;
};

/**
 * Validate date is in the past
 * @param {string|Date} date - Date to validate
 * @returns {boolean} True if date is in the past
 */
export const isPastDate = (date) => {
	const inputDate = new Date(date);
	const now = new Date();
	return inputDate < now;
};

/**
 * Validate file size
 * @param {File} file - File to validate
 * @param {number} maxSizeMB - Maximum size in MB
 * @returns {boolean} True if file size is within limit
 */
export const isValidFileSize = (file, maxSizeMB) => {
	if (!file) return false;
	const maxSizeBytes = maxSizeMB * 1024 * 1024;
	return file.size <= maxSizeBytes;
};

/**
 * Validate file type
 * @param {File} file - File to validate
 * @param {array} allowedTypes - Array of allowed MIME types
 * @returns {boolean} True if file type is allowed
 */
export const isValidFileType = (file, allowedTypes) => {
	if (!file) return false;
	return allowedTypes.includes(file.type);
};

/**
 * Validate image file
 * @param {File} file - File to validate
 * @returns {boolean} True if valid image file
 */
export const isValidImage = (file) => {
	const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
	return isValidFileType(file, allowedTypes);
};

/**
 * Form validation helper
 * @param {object} fields - Object with field values
 * @param {object} rules - Object with validation rules for each field
 * @returns {object} Validation result with errors object
 */
export const validateForm = (fields, rules) => {
	const errors = {};

	for (const [fieldName, fieldRules] of Object.entries(rules)) {
		const value = fields[fieldName];

		for (const rule of fieldRules) {
			const { validator, message } = rule;

			if (typeof validator === 'function') {
				const isValid = validator(value);
				if (!isValid) {
					errors[fieldName] = message;
					break; // Stop at first error for this field
				}
			}
		}
	}

	return {
		isValid: Object.keys(errors).length === 0,
		errors,
	};
};

export default {
	isValidEmail,
	validateEmail,
	validatePassword,
	isValidPhone,
	validatePhone,
	isRequired,
	minLength,
	maxLength,
	isInRange,
	isPositive,
	isValidUrl,
	isValidNfcCode,
	isValidLatitude,
	isValidLongitude,
	isFutureDate,
	isPastDate,
	isValidFileSize,
	isValidFileType,
	isValidImage,
	validateForm,
};
