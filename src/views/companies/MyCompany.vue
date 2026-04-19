<template>
	<div class="bg-slate-50 min-h-screen pb-10">
		<div
			v-if="loading"
			class="flex items-center justify-center min-h-[40vh] px-4"
		>
			<div class="text-center">
				<div
					class="animate-spin rounded-full h-12 w-12 border-2 border-slate-200 border-t-[#0D65AE] mx-auto"
				/>
				<p class="text-slate-600 mt-4 text-sm">Loading your company…</p>
			</div>
		</div>

		<div
			v-else-if="!company"
			class="max-w-lg mx-auto mt-16 px-4 text-center bg-white rounded-2xl border border-slate-200 shadow-sm py-14"
		>
			<h2 class="text-xl font-semibold text-slate-900 mb-2">No company on file</h2>
			<p class="text-slate-600 text-sm">You are not linked to a company in Surebox yet.</p>
		</div>

		<div v-else class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
			<div
				class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
			>
				<div>
					<h1 class="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
						My company
					</h1>
					<p class="text-sm text-slate-600 mt-1">
						Profile, story, logo, location-based address, and whether your services appear in the public
						catalogue.
					</p>
				</div>
				<button
					v-if="!isEditing && canEditCompany"
					type="button"
					class="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-[#0D65AE] rounded-xl hover:bg-[#0a4f87] focus:outline-none focus:ring-2 focus:ring-[#0D65AE] focus:ring-offset-2 shadow-sm shrink-0"
					@click="startEditing"
				>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
						/>
					</svg>
					Edit profile
				</button>
			</div>

			<div
				class="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-br from-slate-900 via-slate-800 to-[#0a4f87] text-white shadow-lg mb-6"
			>
				<div class="absolute inset-0 opacity-[0.06] pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.12),transparent_50%)]" />
				<div class="relative px-5 py-8 sm:px-8 sm:py-10 flex flex-col sm:flex-row gap-6 sm:gap-8 items-start">
					<div
						class="shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white/10 ring-2 ring-white/25 overflow-hidden flex items-center justify-center backdrop-blur-sm"
					>
						<img
							v-if="displayLogo"
							:src="displayLogo"
							alt=""
							class="w-full h-full object-cover"
							@error="logoErrored = true"
						/>
						<span
							v-else
							class="text-3xl sm:text-4xl font-bold text-white/90 select-none"
						>
							{{ companyInitial }}
						</span>
					</div>
					<div class="min-w-0 flex-1">
						<div
							v-if="!isEditing"
							class="flex flex-wrap items-center gap-2 mb-2"
						>
							<span
								v-if="isCompanyPublicCatalog"
								class="text-[10px] sm:text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/25 text-emerald-100 ring-1 ring-emerald-400/30"
							>
								Public catalogue
							</span>
							<span
								v-else
								class="text-[10px] sm:text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500/25 text-amber-100 ring-1 ring-amber-400/30"
							>
								Private catalogue
							</span>
						</div>
						<p
							v-if="profileLocation && !isEditing"
							class="text-xs font-medium uppercase tracking-wider text-emerald-300/90 mb-2"
						>
							{{ profileLocationBadge }} · {{ profileLocation.name || "Location" }}
						</p>
						<h2 class="text-2xl sm:text-3xl font-bold leading-tight break-words">
							{{ company.name || "Company" }}
						</h2>
						<p
							v-if="!isEditing && company.description"
							class="mt-3 text-sm sm:text-base text-slate-200/90 line-clamp-3 sm:line-clamp-4"
						>
							{{ company.description }}
						</p>
						<div
							class="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-200/95"
						>
							<span v-if="company.email" class="inline-flex items-center gap-1.5">
								<svg class="w-4 h-4 shrink-0 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
									/>
								</svg>
								{{ company.email }}
							</span>
							<span v-if="company.phone" class="inline-flex items-center gap-1.5">
								<svg class="w-4 h-4 shrink-0 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
									/>
								</svg>
								{{ company.phone }}
							</span>
						</div>
					</div>
				</div>
			</div>

			<div
				class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
			>
				<div
					class="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-slate-100 bg-slate-50/80"
				>
					<h3 class="text-sm font-semibold text-slate-800 uppercase tracking-wide">
						{{ isEditing ? "Edit details" : "Company profile" }}
					</h3>
					<div v-if="isEditing" class="flex items-center gap-2">
						<button
							type="button"
							class="px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
							@click="cancelEditing"
						>
							Cancel
						</button>
						<button
							type="button"
							:disabled="saving"
							class="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-[#0D65AE] rounded-lg hover:bg-[#0a4f87] disabled:opacity-60"
							@click="saveCompanyInfo"
						>
							<span
								v-if="saving"
								class="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
							/>
							{{ saving ? "Saving…" : "Save" }}
						</button>
					</div>
				</div>

				<form v-if="isEditing" class="p-5 sm:p-6 space-y-6" @submit.prevent="saveCompanyInfo">
					<div
						class="rounded-xl border border-slate-200 bg-slate-50/80 p-4 space-y-3"
					>
						<label class="flex items-start gap-3 cursor-pointer select-none">
							<input
								v-model="editForm.isPublic"
								type="checkbox"
								class="mt-1 h-4 w-4 rounded border-slate-300 text-[#0D65AE] focus:ring-[#0D65AE]"
							/>
							<span>
								<span class="block text-sm font-medium text-slate-900">
									List our services in the public catalogue
								</span>
								<span class="block text-xs text-slate-600 mt-1 leading-relaxed">
									When enabled, signed-in users can discover your services in the global browse
									list. When disabled, services stay hidden there; your team and platform admins
									can still manage them, and members can open a service from a direct link.
								</span>
							</span>
						</label>
					</div>

					<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
						<div class="sm:col-span-2">
							<label class="block text-sm font-medium text-slate-700 mb-1">Company name</label>
							<input
								v-model="editForm.name"
								type="text"
								class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0D65AE] focus:border-transparent"
								placeholder="Company name"
							/>
						</div>
						<div class="sm:col-span-2">
							<label class="block text-sm font-medium text-slate-700 mb-1">Story or summary</label>
							<textarea
								v-model="editForm.description"
								rows="5"
								class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0D65AE] focus:border-transparent resize-y min-h-[120px]"
								placeholder="Who you are, what you offer, and why customers should trust you."
							/>
						</div>
						<div class="sm:col-span-2">
							<label class="block text-sm font-medium text-slate-700 mb-1">Logo</label>
							<div class="flex flex-col sm:flex-row gap-3 sm:items-start">
								<div
									class="shrink-0 w-20 h-20 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center"
								>
									<img
										v-if="editForm.logo && !logoUploadPreviewErrored"
										:src="editForm.logo"
										alt=""
										class="w-full h-full object-cover"
										@error="logoUploadPreviewErrored = true"
									/>
									<span
										v-else
										class="text-xs text-slate-400 text-center px-1"
									>
										Preview
									</span>
								</div>
								<div class="flex-1 min-w-0 space-y-2">
									<input
										ref="logoFileInputRef"
										type="file"
										class="sr-only"
										accept="image/jpeg,image/png,image/webp,image/gif"
										@change="onLogoFileSelected"
									/>
									<div class="flex flex-wrap gap-2">
										<button
											type="button"
											:disabled="uploadingLogo || saving"
											class="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-800 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-60"
											@click="triggerLogoFilePick"
										>
											<span
												v-if="uploadingLogo"
												class="inline-block w-4 h-4 border-2 border-slate-300 border-t-[#0D65AE] rounded-full animate-spin"
											/>
											<svg
												v-else
												class="w-4 h-4 text-slate-600"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
												/>
											</svg>
											{{ uploadingLogo ? "Uploading…" : "Upload from computer" }}
										</button>
									</div>
									<div>
										<label class="block text-xs font-medium text-slate-500 mb-1">
											Or paste an image URL
										</label>
										<input
											v-model="editForm.logo"
											type="url"
											class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0D65AE] focus:border-transparent"
											placeholder="https://…"
										/>
									</div>
									<p class="text-xs text-slate-500">
										JPEG, PNG, WebP, or GIF, up to 8 MB. Uses the same secure image storage as
										the rest of the app.
									</p>
								</div>
							</div>
						</div>
						<div>
							<label class="block text-sm font-medium text-slate-700 mb-1">Email</label>
							<input
								v-model="editForm.email"
								type="email"
								class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0D65AE] focus:border-transparent"
							/>
						</div>
						<div>
							<label class="block text-sm font-medium text-slate-700 mb-1">Phone</label>
							<input
								v-model="editForm.phone"
								type="text"
								class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0D65AE] focus:border-transparent"
							/>
						</div>
					</div>

					<div
						class="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-3"
					>
						<label class="block text-sm font-medium text-slate-800">Headquarters on profile</label>
						<p class="text-xs text-slate-600 leading-relaxed">
							The profile address comes from your
							<router-link
								to="/my-company/locations"
								class="text-[#0D65AE] font-medium hover:underline"
							>
								Locations
							</router-link>
							. Mark one as headquarters to pin it here, or the first location is shown until you do.
						</p>
						<select
							v-model="editForm.primaryLocationUuid"
							class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#0D65AE]"
						>
							<option value="">No headquarters flag (first location used for display)</option>
							<option
								v-for="loc in locationOptions"
								:key="loc.uuid"
								:value="loc.uuid"
							>
								{{ locationSelectLabel(loc) }}
							</option>
						</select>
					</div>
				</form>

				<div v-else class="p-5 sm:p-6 space-y-8">
					<section v-if="company.description">
						<h4
							class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2"
						>
							Story or summary
						</h4>
						<p class="text-slate-800 text-sm sm:text-base whitespace-pre-wrap leading-relaxed">
							{{ company.description }}
						</p>
					</section>
					<section v-else class="text-sm text-slate-500 italic">
						No story yet. Edit the profile to add text that builds trust with customers.
					</section>

					<section>
						<h4
							class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3"
						>
							Address on profile
						</h4>
						<div
							v-if="profileLocation"
							class="rounded-xl border border-emerald-100 bg-emerald-50/40 px-4 py-3 text-sm text-slate-800"
						>
							<p class="font-medium text-emerald-900/90 mb-1">
								{{ profileLocationTitle }}
							</p>
							<p class="leading-relaxed">{{ profileAddressText }}</p>
							<p
								v-if="profileLocation && !profileLocation.isPrimary && locationOptions.length > 1"
								class="text-xs text-slate-600 mt-2"
							>
								Set a headquarters above to choose which site appears first.
							</p>
						</div>
						<div
							v-else
							class="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
						>
							<p class="mb-2">No locations yet. Add one under</p>
							<router-link
								to="/my-company/locations"
								class="text-[#0D65AE] font-medium hover:underline"
							>
								Locations
							</router-link>
							<span>— the profile will use that address automatically.</span>
						</div>
					</section>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useCompanies, useToast, usePermissions } from "@/composables";
import { uploadImageToCloudinary } from "@/composables/useCloudinaryUpload";

const router = useRouter();
const { showToast } = useToast();
const { fetchMyCompany, updateMyCompany } = useCompanies();
const { canEditCompany } = usePermissions();

const LOGO_MAX_BYTES = 8 * 1024 * 1024;
const LOGO_ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

function readCompanyCatalogPublic(c) {
	if (!c) {
		return true;
	}
	if (typeof c.isPublic === "boolean") {
		return c.isPublic;
	}
	if (typeof c.is_public === "boolean") {
		return c.is_public;
	}
	return true;
}

const company = ref(null);
const loading = ref(false);
const saving = ref(false);
const isEditing = ref(false);
const logoErrored = ref(false);
const uploadingLogo = ref(false);
const logoUploadPreviewErrored = ref(false);
const logoFileInputRef = ref(null);

const editForm = ref({
	name: "",
	description: "",
	logo: "",
	email: "",
	phone: "",
	primaryLocationUuid: "",
	isPublic: true,
});

const primaryLocation = computed(
	() => company.value?.locations?.find((l) => l.isPrimary) ?? null,
);

const locationOptions = computed(() => company.value?.locations ?? []);

/** Shown on profile: headquarters, else first location in the list. */
const profileLocation = computed(() => {
	const locs = locationOptions.value;
	if (!locs.length) {
		return null;
	}
	const flagged = locs.find((l) => l.isPrimary);
	return flagged ?? locs[0];
});

const profileLocationBadge = computed(() =>
	profileLocation.value?.isPrimary ? "Headquarters" : "Location",
);

const profileLocationTitle = computed(() => {
	const loc = profileLocation.value;
	if (!loc) {
		return "";
	}
	if (loc.isPrimary) {
		return loc.name || "Headquarters";
	}
	return loc.name || "Location";
});

function formatLocationAddressLines(loc) {
	if (!loc) {
		return "—";
	}
	const parts = [
		loc.address,
		[loc.cityName, loc.departmentName].filter(Boolean).join(", "),
		loc.countryName,
	].filter((x) => x && String(x).trim());
	return parts.length ? parts.join("\n") : "—";
}

const profileAddressText = computed(() => formatLocationAddressLines(profileLocation.value));

const isCompanyPublicCatalog = computed(() => readCompanyCatalogPublic(company.value));

const displayLogo = computed(() => {
	if (logoErrored.value) {
		return "";
	}
	const u = (isEditing.value ? editForm.value.logo : company.value?.logo)?.trim();
	return u || "";
});

const companyInitial = computed(() => {
	const n = (company.value?.name || "?").trim();
	return n.charAt(0).toUpperCase();
});

watch(
	() => company.value?.logo,
	() => {
		logoErrored.value = false;
	},
);

watch(
	() => editForm.value.logo,
	() => {
		if (isEditing.value) {
			logoErrored.value = false;
			logoUploadPreviewErrored.value = false;
		}
	},
);

function triggerLogoFilePick() {
	logoFileInputRef.value?.click();
}

async function onLogoFileSelected(event) {
	const input = event.target;
	const file = input?.files?.[0];
	if (input) {
		input.value = "";
	}
	if (!file) {
		return;
	}
	if (!LOGO_ALLOWED.has(file.type)) {
		showToast("error", "Invalid format", "Use JPEG, PNG, WebP, or GIF.");
		return;
	}
	if (file.size > LOGO_MAX_BYTES) {
		showToast("error", "File too large", "Logo must be 8 MB or smaller.");
		return;
	}
	uploadingLogo.value = true;
	logoUploadPreviewErrored.value = false;
	try {
		const url = await uploadImageToCloudinary(file);
		if (url) {
			editForm.value.logo = url;
			showToast(
				"success",
				"Upload complete",
				"Logo uploaded. Click Save to apply it to your company profile.",
			);
		} else {
			showToast("error", "Upload failed", "No image URL returned. Try again.");
		}
	} catch (err) {
		showToast(
			"error",
			"Upload error",
			err?.message || "Check your connection and Cloudinary configuration.",
		);
	} finally {
		uploadingLogo.value = false;
	}
}

function locationSelectLabel(loc) {
	const name = (loc.name || "").trim();
	const addr = (loc.address || "").trim();
	if (name && addr) {
		return `${name} — ${addr}`;
	}
	return name || addr || loc.uuid;
}

onMounted(async () => {
	await loadCompany();
});

async function loadCompany() {
	loading.value = true;
	const result = await fetchMyCompany();
	if (result.success) {
		company.value = result.data;
	} else {
		showToast("error", "Error", "Could not load your company.");
		router.push("/");
	}
	loading.value = false;
}

function startEditing() {
	logoErrored.value = false;
	logoUploadPreviewErrored.value = false;
	editForm.value = {
		name: company.value.name || "",
		description: company.value.description || "",
		logo: company.value.logo || "",
		email: company.value.email || "",
		phone: company.value.phone || "",
		primaryLocationUuid: primaryLocation.value?.uuid || "",
		isPublic: readCompanyCatalogPublic(company.value),
	};
	isEditing.value = true;
}

function cancelEditing() {
	isEditing.value = false;
}

async function saveCompanyInfo() {
	saving.value = true;
	const payload = {
		name: editForm.value.name,
		description: editForm.value.description,
		logo: editForm.value.logo,
		email: editForm.value.email,
		phone: editForm.value.phone,
		primaryLocationUuid: editForm.value.primaryLocationUuid || "",
		isPublic: !!editForm.value.isPublic,
	};
	const result = await updateMyCompany(payload);
	if (result.success) {
		if (result.data && result.data.uuid) {
			company.value = result.data;
		} else {
			await loadCompany();
		}
		isEditing.value = false;
		showToast("success", "Saved", "Company profile updated.");
	} else {
		showToast("error", "Error", "Could not save. Check the form and try again.");
	}
	saving.value = false;
}
</script>
