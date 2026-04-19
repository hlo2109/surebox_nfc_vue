<script setup>
import { ref, computed, watch, onMounted } from "vue";
import Dialog from "primevue/dialog";
import { useAuthStore } from "@/stores/auth.store";
import { useEmployeeWorkDay } from "@/composables/useEmployeeWorkDay";

const authStore = useAuthStore();
const { fetchWorkDayStatus, clockInWorkDay, clockOutWorkDay } =
	useEmployeeWorkDay();

const workDayStatus = ref(null);
const workDayModalOpen = ref(false);
const workDayScheduleType = ref("day");
const workDaySelectedLocationUuid = ref("");
const workDayNfcScanning = ref(false);
const workDayNfcVerified = ref(false);
const workDayNfcVerifiedCode = ref("");
const workDayNfcError = ref("");
const workDayGpsError = ref("");
const workDaySubmitting = ref(false);
const workDayNfcSupported =
	typeof window !== "undefined" && "NDEFReader" in window;

const workDayBannerVisible = computed(
	() => !!(workDayStatus.value && workDayStatus.value.hasFixedSite),
);

const workDayFixedLocations = computed(
	() => workDayStatus.value?.fixedLocations || [],
);

const workDayActiveSession = computed(
	() => workDayStatus.value?.activeSession || null,
);

const workDaySelectedLocation = computed(() => {
	const list = workDayFixedLocations.value;
	const u = workDaySelectedLocationUuid.value;
	return list.find((l) => l.locationUuid === u) || list[0] || null;
});

const workDayNfcRequired = computed(() => {
	if (workDayActiveSession.value) {
		const s = workDayActiveSession.value;
		return !!(s.siteNfcConfigured || s.requiresNfcClockOut);
	}
	const loc = workDaySelectedLocation.value;
	if (!loc) return false;
	return !!(loc.siteNfcConfigured || loc.requiresNfcClockIn);
});

const workDaySubmitDisabled = computed(() => {
	if (workDaySubmitting.value) return true;
	if (workDayNfcRequired.value) {
		if (!workDayNfcSupported) return true;
		if (!workDayNfcVerified.value) return true;
	}
	return false;
});

const workDayModalTitle = computed(() =>
	workDayActiveSession.value ? "End work day" : "Start work day",
);

function resetWorkDayNfc() {
	workDayNfcScanning.value = false;
	workDayNfcVerified.value = false;
	workDayNfcVerifiedCode.value = "";
	workDayNfcError.value = "";
}

function openWorkDayModal() {
	resetWorkDayNfc();
	workDayGpsError.value = "";
	const list = workDayFixedLocations.value;
	if (!workDayActiveSession.value && list.length) {
		const cur = workDaySelectedLocationUuid.value;
		const stillValid = list.some((l) => l.locationUuid === cur);
		if (!stillValid) {
			workDaySelectedLocationUuid.value = list[0].locationUuid;
		}
	}
	workDayModalOpen.value = true;
}

watch(workDayModalOpen, (open) => {
	if (!open) {
		resetWorkDayNfc();
	}
});

watch(workDaySelectedLocationUuid, () => {
	if (workDayModalOpen.value && !workDayActiveSession.value) {
		resetWorkDayNfc();
	}
});

function getCurrentPosition() {
	return new Promise((resolve, reject) => {
		if (!navigator.geolocation) {
			reject(new Error("Geolocation is not available"));
			return;
		}
		navigator.geolocation.getCurrentPosition(
			(pos) =>
				resolve({
					latitude: pos.coords.latitude,
					longitude: pos.coords.longitude,
				}),
			(err) => reject(err),
			{ enableHighAccuracy: true, timeout: 12000, maximumAge: 0 },
		);
	});
}

async function handleWorkDayNfcScan() {
	workDayNfcError.value = "";
	workDayNfcScanning.value = true;
	try {
		const ndef = new window.NDEFReader();
		await ndef.scan();
		ndef.addEventListener("reading", ({ message }) => {
			workDayNfcScanning.value = false;
			let code = "";
			for (const record of message.records) {
				if (record.recordType === "text") {
					const decoder = new TextDecoder(record.encoding || "utf-8");
					code = decoder.decode(record.data);
					break;
				}
			}
			if (!code) {
				workDayNfcError.value = "Could not read text from the NFC tag.";
				return;
			}
			workDayNfcVerified.value = true;
			workDayNfcVerifiedCode.value = String(code).trim();
			workDayNfcError.value = "";
		});
		ndef.addEventListener("readingerror", () => {
			workDayNfcScanning.value = false;
			workDayNfcError.value = "NFC read error. Try again.";
		});
	} catch (err) {
		workDayNfcScanning.value = false;
		workDayNfcError.value =
			err?.message || "Could not start the NFC reader.";
	}
}

async function submitWorkDayAction() {
	workDayGpsError.value = "";
	workDaySubmitting.value = true;
	let coords;
	try {
		coords = await getCurrentPosition();
	} catch {
		workDayGpsError.value =
			"Location permission is required to clock in or out.";
		workDaySubmitting.value = false;
		return;
	}

	const lat = coords.latitude;
	const lng = coords.longitude;
	const nfcPayload =
		workDayNfcRequired.value && workDayNfcVerifiedCode.value
			? String(workDayNfcVerifiedCode.value).trim()
			: undefined;

	if (workDayNfcRequired.value && !nfcPayload) {
		workDayGpsError.value = "";
		workDayNfcError.value = "Scan the NFC tag before submitting.";
		workDaySubmitting.value = false;
		return;
	}

	if (workDayActiveSession.value) {
		const body = { lat, lng };
		if (nfcPayload) body.nfcCode = nfcPayload;
		const result = await clockOutWorkDay(body);
		if (result.success) {
			workDayModalOpen.value = false;
			await loadWorkDayStatus();
		}
	} else {
		const locUuid =
			workDaySelectedLocationUuid.value ||
			workDaySelectedLocation.value?.locationUuid;
		if (!locUuid) {
			workDayGpsError.value = "No branch selected.";
			workDaySubmitting.value = false;
			return;
		}
		const body = {
			companyLocationUuid: locUuid,
			lat,
			lng,
			scheduleType: workDayScheduleType.value,
			travelIncluded: false,
		};
		if (nfcPayload) body.nfcCode = nfcPayload;
		const result = await clockInWorkDay(body);
		if (result.success) {
			workDayModalOpen.value = false;
			await loadWorkDayStatus();
		}
	}
	workDaySubmitting.value = false;
}

async function loadWorkDayStatus() {
	if (!authStore.state.user?.id) {
		workDayStatus.value = null;
		return;
	}
	const result = await fetchWorkDayStatus();
	if (result.success) {
		workDayStatus.value = result.data;
		const list = result.data?.fixedLocations || [];
		if (list.length) {
			const cur = workDaySelectedLocationUuid.value;
			if (!list.some((l) => l.locationUuid === cur)) {
				workDaySelectedLocationUuid.value = list[0].locationUuid;
			}
		}
	} else {
		workDayStatus.value = null;
	}
}

watch(
	() => authStore.state.user?.id,
	(id) => {
		if (id) loadWorkDayStatus();
		else workDayStatus.value = null;
	},
	{ immediate: true },
);

onMounted(() => {
	if (authStore.state.user?.id) loadWorkDayStatus();
});
</script>

<template>
	<div v-if="workDayBannerVisible" class="flex items-center">
		<button
			type="button"
			class="relative inline-flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-medium rounded-lg transition-colors border border-[#0D65AE]/40 text-[#0D65AE] bg-[#0D65AE]/5 hover:bg-[#0D65AE]/10"
			@click="openWorkDayModal"
		>
			<span
				v-if="workDayActiveSession"
				class="absolute top-1.5 left-1.5 w-2 h-2 rounded-full bg-teal-500 ring-2 ring-white"
				aria-hidden="true"
			/>
			<svg
				class="w-5 h-5 shrink-0"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
			<span class="hidden sm:inline max-w-[9rem] md:max-w-none truncate">{{
				workDayActiveSession ? "End work day" : "Start time"
			}}</span>
		</button>

		<Dialog
			v-model:visible="workDayModalOpen"
			:modal="true"
			:draggable="false"
			:style="{ width: '92vw', maxWidth: '480px' }"
			:header="workDayModalTitle"
			:pt="{
				root: { class: 'rounded-xl shadow-2xl' },
				header: { class: 'border-b border-gray-200 px-5 py-4' },
				content: { class: 'px-5 py-4' },
			}"
		>
			<div class="space-y-4 text-sm text-gray-700">
				<template v-if="!workDayActiveSession">
					<div v-if="workDayFixedLocations.length > 1">
						<label class="block text-xs font-semibold text-gray-600 mb-1"
							>Branch</label
						>
						<select
							v-model="workDaySelectedLocationUuid"
							class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
						>
							<option
								v-for="loc in workDayFixedLocations"
								:key="loc.locationUuid"
								:value="loc.locationUuid"
							>
								{{ loc.companyName }} — {{ loc.locationName }}
							</option>
						</select>
					</div>
					<div>
						<span class="block text-xs font-semibold text-gray-600 mb-2"
							>Schedule</span
						>
						<div
							class="grid grid-cols-3 gap-1.5 rounded-lg border border-gray-200 p-1 bg-gray-50"
							role="group"
							aria-label="Work schedule type"
						>
							<button
								type="button"
								:aria-pressed="workDayScheduleType === 'day'"
								:class="[
									'flex flex-col items-center justify-center gap-1 py-2.5 px-1 rounded-md text-xs font-semibold transition-all min-h-[4.25rem]',
									workDayScheduleType === 'day'
										? 'bg-white text-[#0D65AE] shadow-sm ring-1 ring-[#0D65AE]/25'
										: 'text-gray-500 hover:bg-gray-100/80',
								]"
								@click="workDayScheduleType = 'day'"
							>
								<svg
									class="w-6 h-6 shrink-0"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									aria-hidden="true"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
									/>
								</svg>
								<span>Day</span>
							</button>
							<button
								type="button"
								:aria-pressed="workDayScheduleType === 'night'"
								:class="[
									'flex flex-col items-center justify-center gap-1 py-2.5 px-1 rounded-md text-xs font-semibold transition-all min-h-[4.25rem]',
									workDayScheduleType === 'night'
										? 'bg-white text-[#0D65AE] shadow-sm ring-1 ring-[#0D65AE]/25'
										: 'text-gray-500 hover:bg-gray-100/80',
								]"
								@click="workDayScheduleType = 'night'"
							>
								<svg
									class="w-6 h-6 shrink-0"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									aria-hidden="true"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
									/>
								</svg>
								<span>Night</span>
							</button>
							<button
								type="button"
								:aria-pressed="workDayScheduleType === 'travel'"
								:class="[
									'flex flex-col items-center justify-center gap-1 py-2.5 px-1 rounded-md text-xs font-semibold transition-all min-h-[4.25rem]',
									workDayScheduleType === 'travel'
										? 'bg-white text-[#0D65AE] shadow-sm ring-1 ring-[#0D65AE]/25'
										: 'text-gray-500 hover:bg-gray-100/80',
								]"
								@click="workDayScheduleType = 'travel'"
							>
								<svg
									class="w-6 h-6 shrink-0"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									aria-hidden="true"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M8.25 18.75a1.125 1.125 0 01-1.125-1.125v-9.75m10.5 10.875a1.125 1.125 0 01-1.125-1.125v-9.75M3.375 6.75h17.25c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125H3.375A1.125 1.125 0 012 17.625v-9.75c0-.621.504-1.125 1.125-1.125zM8.25 6.75V4.875c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125V6.75M12 12h.008v.008H12V12z"
									/>
								</svg>
								<span>Travel</span>
							</button>
						</div>
					</div>
				</template>
				<p v-else class="text-gray-600">
					Confirm NFC (if required) and GPS to end your work day at
					<strong>{{ workDayActiveSession.locationName }}</strong
					>.
					<span
						v-if="workDayActiveSession.scheduleType"
						class="block mt-2 text-xs text-gray-500 uppercase tracking-wide"
					>
						Shift:
						{{
							workDayActiveSession.scheduleType === "travel"
								? "Travel"
								: workDayActiveSession.scheduleType === "night"
									? "Night"
									: "Day"
						}}
					</span>
				</p>

				<div
					v-if="workDayNfcRequired"
					class="rounded-lg border border-purple-100 bg-purple-50/60 p-3"
				>
					<p class="text-xs font-semibold text-purple-900 mb-2">NFC</p>
					<div
						v-if="workDayNfcSupported && workDayNfcVerified"
						class="text-xs text-green-700 font-medium"
					>
						Tag captured — ready to submit.
					</div>
					<button
						v-else-if="workDayNfcSupported"
						type="button"
						:disabled="workDayNfcScanning || workDaySubmitting"
						class="w-full py-2.5 px-3 rounded-lg bg-white border border-purple-200 text-purple-900 text-sm font-medium hover:bg-purple-50 disabled:opacity-50"
						@click="handleWorkDayNfcScan"
					>
						{{
							workDayNfcScanning
								? "Hold tag near device…"
								: "Scan NFC tag"
						}}
					</button>
					<p v-else class="text-xs text-amber-800">
						This browser does not support Web NFC. Use Chrome on
						Android, or ask your admin to adjust NFC requirements.
					</p>
					<p v-if="workDayNfcError" class="text-xs text-red-700 mt-2">
						{{ workDayNfcError }}
					</p>
				</div>

				<p v-if="workDayGpsError" class="text-xs text-red-600">
					{{ workDayGpsError }}
				</p>

				<div class="flex justify-end gap-2 pt-1">
					<button
						type="button"
						class="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
						:disabled="workDaySubmitting"
						@click="workDayModalOpen = false"
					>
						Cancel
					</button>
					<button
						type="button"
						class="px-4 py-2 text-sm font-semibold text-white bg-[#0D65AE] rounded-lg hover:bg-[#0a4f87] disabled:opacity-50"
						:disabled="workDaySubmitDisabled"
						@click="submitWorkDayAction"
					>
						{{
							workDaySubmitting
								? "Please wait…"
								: workDayActiveSession
									? "Clock out"
									: "Clock in"
						}}
					</button>
				</div>
			</div>
		</Dialog>
	</div>
</template>
