/**
 * Public web origin for absolute asset URLs and external links.
 * Set VITE_PUBLIC_APP_URL in .env to match production (e.g. https://app.tudominio.com).
 * In development, falls back to window.location.origin when unset.
 */
export function getPublicAppOrigin() {
	const fromEnv = import.meta.env.VITE_PUBLIC_APP_URL?.trim();
	if (fromEnv) {
		return fromEnv.replace(/\/+$/, '');
	}
	if (typeof window !== 'undefined' && window.location?.origin) {
		return window.location.origin;
	}
	return '';
}

/**
 * Absolute URL to a path under the public app (leading slash on path recommended).
 * @param {string} path - e.g. '/logo-surebox.svg'
 */
export function publicAssetUrl(path) {
	const origin = getPublicAppOrigin();
	const p = path.startsWith('/') ? path : `/${path}`;
	return `${origin}${p}`;
}

export function usePublicAppUrl() {
	return {
		origin: getPublicAppOrigin(),
		publicAssetUrl,
	};
}
