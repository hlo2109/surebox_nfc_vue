/**
 * Client-side image upload to Cloudinary (unsigned preset).
 * Same stack as CreateBox / EditBox NFC gallery.
 */

const DEFAULT_UPLOAD_URL =
	"https://api.cloudinary.com/v1_1/dtcwghtqp/image/upload";
const DEFAULT_UPLOAD_PRESET = "ml_default";

/**
 * @param {File|Blob} file
 * @param {{ folder?: string }} [options]
 * @returns {Promise<string|null>} secure_url or null on failure
 */
export async function uploadImageToCloudinary(file, options = {}) {
	// Same root folder as NFC box photos (unsigned preset is usually scoped to surebox/)
	const folder = options.folder ?? "surebox/";
	const uploadUrl =
		import.meta.env.VITE_CLOUDINARY_UPLOAD_URL || DEFAULT_UPLOAD_URL;
	const preset =
		import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || DEFAULT_UPLOAD_PRESET;

	const formData = new FormData();
	formData.append("file", file);
	formData.append("folder", folder);
	formData.append("upload_preset", preset);

	const response = await fetch(uploadUrl, {
		method: "POST",
		body: formData,
	});

	if (!response.ok) {
		const text = await response.text().catch(() => "");
		throw new Error(text || `Upload failed (${response.status})`);
	}

	const data = await response.json();
	return data.secure_url || null;
}

export function useCloudinaryUpload() {
	return { uploadImageToCloudinary };
}
