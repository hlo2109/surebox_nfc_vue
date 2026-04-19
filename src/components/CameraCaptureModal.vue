<template>
	<Teleport to="body">
		<div
			v-if="modelValue"
			class="fixed inset-0 z-[10000] flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-[1px]"
			role="dialog"
			aria-modal="true"
			aria-labelledby="camera-modal-title"
			@click.self="onCancel"
		>
			<div
				class="relative z-[10001] bg-white rounded-xl border border-gray-200 shadow-xl w-full max-w-lg max-h-[95dvh] flex flex-col overflow-hidden"
				@click.stop
			>
				<div
					class="flex items-center justify-between gap-3 px-4 py-3 border-b border-gray-200 shrink-0"
				>
					<div>
						<h2
							id="camera-modal-title"
							class="text-base sm:text-lg font-bold text-gray-900"
						>
							Take photos
						</h2>
						<p class="text-xs text-gray-500 mt-0.5">
							Camera only — no gallery. You can capture several shots,
							then add them to your box.
						</p>
					</div>
					<button
						type="button"
						class="p-2 rounded-lg text-gray-500 hover:bg-gray-100 border border-transparent hover:border-gray-200"
						aria-label="Close"
						@click="onCancel"
					>
						<svg
							class="w-5 h-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>

				<div class="flex-1 overflow-y-auto p-4 space-y-4">
					<div
						v-if="cameraError"
						class="rounded-lg border border-red-200 bg-red-50 text-red-800 text-sm p-3"
					>
						{{ cameraError }}
					</div>

					<div
						v-else-if="!streamReady"
						class="flex flex-col items-center justify-center py-12 text-gray-500 text-sm"
					>
						<div
							class="animate-spin rounded-full h-10 w-10 border-2 border-[#0D65AE] border-t-transparent mb-3"
						/>
						<p>Starting camera…</p>
					</div>

					<template v-else>
						<div
							class="relative rounded-lg overflow-hidden bg-black border border-gray-200 min-h-[200px] max-h-[55dvh] flex items-center justify-center"
						>
							<video
								ref="videoRef"
								class="w-full h-full max-h-[55dvh] object-contain bg-black"
								autoplay
								playsinline
								webkit-playsinline
								muted
								@loadedmetadata="onVideoStreamReady"
								@canplay="onVideoStreamReady"
							/>
						</div>

						<div class="flex flex-wrap gap-2 justify-center">
							<button
								type="button"
								class="inline-flex items-center gap-2 px-4 py-2.5 text-white bg-[#0D65AE] rounded-lg hover:bg-[#0D65AE]/90 border border-[#0D65AE] text-sm font-medium disabled:opacity-50"
								:disabled="
									captures.length >= maxPhotos ||
									!videoMetaReady ||
									!canCapture
								"
								@click="captureFrame"
							>
								<svg
									class="w-5 h-5"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<circle cx="10" cy="10" r="8" />
								</svg>
								Capture
							</button>
						</div>

						<div v-if="captures.length" class="space-y-2">
							<p class="text-xs font-medium text-gray-600">
								Shots in this session ({{ captures.length }} /
								{{ maxPhotos }})
							</p>
							<div class="flex flex-wrap gap-2">
								<div
									v-for="(c, i) in captures"
									:key="c.key"
									class="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 shrink-0"
								>
									<img
										:src="c.dataUrl"
										alt=""
										class="w-full h-full object-cover"
									/>
									<button
										type="button"
										class="absolute inset-0 bg-black/40 text-white text-xs font-medium opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"
										@click="removeCapture(i)"
									>
										Remove
									</button>
								</div>
							</div>
						</div>
					</template>
				</div>

				<div
					class="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 px-4 py-3 border-t border-gray-200 bg-gray-50 shrink-0"
				>
					<button
						type="button"
						class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
						@click="onCancel"
					>
						Cancel
					</button>
					<button
						type="button"
						class="px-4 py-2 text-sm font-medium text-white bg-[#0D65AE] rounded-lg hover:bg-[#0D65AE]/90 border border-[#0D65AE] disabled:opacity-50"
						:disabled="!captures.length"
						@click="onConfirm"
					>
						{{
							captures.length === 0
								? "Add photos"
								: captures.length === 1
									? "Add 1 photo"
									: `Add ${captures.length} photos`
						}}
					</button>
				</div>
			</div>
		</div>
	</Teleport>
</template>

<script setup>
import {
	ref,
	watch,
	computed,
	onUnmounted,
	nextTick,
} from "vue";

const props = defineProps({
	modelValue: { type: Boolean, default: false },
	/** Max shots per modal session */
	maxPhotos: { type: Number, default: 12 },
});

const emit = defineEmits(["update:modelValue", "confirm"]);

const videoRef = ref(null);
const stream = ref(null);
const streamReady = ref(false);
const videoMetaReady = ref(false);
const cameraError = ref("");
const captures = ref([]);
let captureKey = 0;

const canCapture = computed(() => {
	const v = videoRef.value;
	return !!(v && v.videoWidth > 0 && v.videoHeight > 0);
});

function onVideoStreamReady() {
	const v = videoRef.value;
	videoMetaReady.value = !!(v && v.videoWidth > 0 && v.videoHeight > 0);
}

function stopTracks() {
	videoMetaReady.value = false;
	if (stream.value) {
		stream.value.getTracks().forEach((t) => t.stop());
		stream.value = null;
	}
	if (videoRef.value) {
		videoRef.value.srcObject = null;
	}
	streamReady.value = false;
}

async function requestVideoStream() {
	const tryConstraints = [
		{ video: { facingMode: { ideal: "environment" } }, audio: false },
		{ video: { facingMode: "environment" }, audio: false },
		{ video: { facingMode: "user" }, audio: false },
		{ video: true, audio: false },
	];
	for (const constraints of tryConstraints) {
		try {
			return await navigator.mediaDevices.getUserMedia(constraints);
		} catch {
			// try next
		}
	}
	throw new Error("Could not access the camera.");
}

async function openCamera() {
	cameraError.value = "";
	videoMetaReady.value = false;
	captures.value = [];
	stopTracks();
	if (!navigator.mediaDevices?.getUserMedia) {
		cameraError.value =
			"Your browser does not support camera capture here.";
		return;
	}
	try {
		stream.value = await requestVideoStream();
		// Mount <video> first (it lives in v-else); then bind stream — ref was null before.
		streamReady.value = true;
		await nextTick();
		let el = videoRef.value;
		for (let i = 0; i < 12 && !el; i += 1) {
			await nextTick();
			el = videoRef.value;
		}
		if (!el) {
			stopTracks();
			cameraError.value =
				"Could not show the camera preview. Close the modal and try again.";
			return;
		}
		el.muted = true;
		el.setAttribute("playsinline", "");
		el.setAttribute("webkit-playsinline", "");
		el.srcObject = stream.value;
		await el.play().catch(() => {});
		await new Promise((r) => {
			requestAnimationFrame(r);
		});
		await el.play().catch(() => {});
	} catch (e) {
		stopTracks();
		cameraError.value =
			e?.message ||
			"Could not open the camera. Check permissions and try again.";
	}
}

function captureFrame() {
	const v = videoRef.value;
	if (!v || !v.videoWidth || !v.videoHeight) return;
	if (captures.value.length >= props.maxPhotos) return;

	const canvas = document.createElement("canvas");
	canvas.width = v.videoWidth;
	canvas.height = v.videoHeight;
	const ctx = canvas.getContext("2d");
	ctx.drawImage(v, 0, 0, canvas.width, canvas.height);
	const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
	captureKey += 1;
	captures.value = [
		...captures.value,
		{ key: captureKey, dataUrl },
	];
}

function removeCapture(index) {
	captures.value = captures.value.filter((_, i) => i !== index);
}

function onCancel() {
	stopTracks();
	captures.value = [];
	cameraError.value = "";
	emit("update:modelValue", false);
	document.body.style.overflow = "";
}

function onConfirm() {
	if (!captures.value.length) return;
	const urls = captures.value.map((c) => c.dataUrl);
	stopTracks();
	captures.value = [];
	cameraError.value = "";
	emit("confirm", urls);
	emit("update:modelValue", false);
	document.body.style.overflow = "";
}

function onKeydown(e) {
	if (e.key === "Escape" && props.modelValue) {
		onCancel();
	}
}

watch(
	() => props.modelValue,
	async (open) => {
		if (open) {
			document.body.style.overflow = "hidden";
			document.addEventListener("keydown", onKeydown);
			await nextTick();
			await openCamera();
		} else {
			document.removeEventListener("keydown", onKeydown);
			stopTracks();
			captures.value = [];
			cameraError.value = "";
			document.body.style.overflow = "";
		}
	},
);

onUnmounted(() => {
	document.removeEventListener("keydown", onKeydown);
	stopTracks();
	document.body.style.overflow = "";
});
</script>
