<template>
	<div class="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
		<div class="max-w-4xl mx-auto">
			<!-- Header -->
			<div class="mb-8">
				<div class="flex items-center gap-3 mb-2">
					<router-link
						to="/"
						class="text-gray-600 hover:text-gray-900"
					>
						<svg
							class="w-6 h-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M10 19l-7-7m0 0l7-7m-7 7h18"
							></path>
						</svg>
					</router-link>
					<h1 class="text-3xl font-bold text-gray-900">
						NFC Testing Lab
					</h1>
				</div>
				<p class="text-gray-600">
					Test and debug NFC reading functionality
				</p>
			</div>

			<!-- Device Info Card -->
			<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
				<h2 class="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
					<svg
						class="w-6 h-6 text-blue-600"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
						></path>
					</svg>
					Device Information
				</h2>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div class="space-y-3">
						<div class="flex justify-between items-center">
							<span class="text-sm text-gray-600">Device Type:</span>
							<span class="font-medium text-gray-900">
								{{ deviceInfo.deviceType }}
							</span>
						</div>
						<div class="flex justify-between items-center">
							<span class="text-sm text-gray-600">Is Mobile:</span>
							<span
								:class="[
									'px-2 py-1 text-xs font-medium rounded',
									deviceInfo.isMobile
										? 'bg-green-100 text-green-800'
										: 'bg-red-100 text-red-800',
								]"
							>
								{{ deviceInfo.isMobile ? "Yes" : "No" }}
							</span>
						</div>
						<div class="flex justify-between items-center">
							<span class="text-sm text-gray-600">Is Desktop:</span>
							<span
								:class="[
									'px-2 py-1 text-xs font-medium rounded',
									deviceInfo.isDesktop
										? 'bg-blue-100 text-blue-800'
										: 'bg-gray-100 text-gray-800',
								]"
							>
								{{ deviceInfo.isDesktop ? "Yes" : "No" }}
							</span>
						</div>
					</div>

					<div class="space-y-3">
						<div class="flex justify-between items-center">
							<span class="text-sm text-gray-600">NFC Supported:</span>
							<span
								:class="[
									'px-2 py-1 text-xs font-medium rounded',
									deviceInfo.nfcSupported
										? 'bg-green-100 text-green-800'
										: 'bg-red-100 text-red-800',
								]"
							>
								{{ deviceInfo.nfcSupported ? "Yes" : "No" }}
							</span>
						</div>
						<div class="flex justify-between items-center">
							<span class="text-sm text-gray-600">Can Use NFC:</span>
							<span
								:class="[
									'px-2 py-1 text-xs font-medium rounded',
									deviceInfo.canUseNFC
										? 'bg-green-100 text-green-800'
										: 'bg-red-100 text-red-800',
								]"
							>
								{{ deviceInfo.canUseNFC ? "Yes" : "No" }}
							</span>
						</div>
						<div class="flex justify-between items-center">
							<span class="text-sm text-gray-600">Browser:</span>
							<span class="font-medium text-gray-900 capitalize">
								{{ deviceInfo.browser || "Unknown" }}
							</span>
						</div>
					</div>
				</div>

				<div class="mt-4 pt-4 border-t border-gray-200">
					<div class="text-sm text-gray-600 mb-1">User Agent:</div>
					<div class="text-xs text-gray-500 break-all font-mono bg-gray-50 p-2 rounded">
						{{ deviceInfo.userAgent }}
					</div>
				</div>
			</div>

			<!-- NFC Status Card -->
			<div
				:class="[
					'rounded-xl shadow-sm border p-6 mb-6',
					canUseNFC
						? 'bg-green-50 border-green-200'
						: 'bg-yellow-50 border-yellow-200',
				]"
			>
				<div class="flex items-start gap-4">
					<div
						:class="[
							'p-3 rounded-full',
							canUseNFC ? 'bg-green-100' : 'bg-yellow-100',
						]"
					>
						<svg
							:class="[
								'w-6 h-6',
								canUseNFC ? 'text-green-600' : 'text-yellow-600',
							]"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								v-if="canUseNFC"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
							></path>
							<path
								v-else
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
							></path>
						</svg>
					</div>
					<div class="flex-1">
						<h3
							:class="[
								'text-lg font-semibold mb-1',
								canUseNFC ? 'text-green-900' : 'text-yellow-900',
							]"
						>
							{{ canUseNFC ? "NFC Available" : "NFC Not Available" }}
						</h3>
						<p
							:class="[
								'text-sm',
								canUseNFC ? 'text-green-700' : 'text-yellow-700',
							]"
						>
							{{ nfcStatusMessage }}
						</p>
						<button
							v-if="!canUseNFC"
							@click="showNFCInfo"
							class="mt-3 text-sm font-medium text-yellow-800 hover:text-yellow-900 underline"
						>
							View Compatibility Info
						</button>
					</div>
				</div>
			</div>

			<!-- NFC Reading Test Card -->
			<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
				<h2 class="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
					<svg
						class="w-6 h-6 text-purple-600"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
						></path>
					</svg>
					NFC Reading Test
				</h2>

				<div class="space-y-4">
					<!-- Scan Button -->
					<div class="flex gap-3">
						<button
							@click="startNFCScan"
							:disabled="isReading || !canUseNFC"
							:class="[
								'flex-1 py-3 px-6 rounded-lg font-medium transition-all flex items-center justify-center gap-2',
								isReading
									? 'bg-gray-200 text-gray-500 cursor-wait'
									: canUseNFC
										? 'bg-[#0D65AE] text-white hover:bg-[#0D65AE]/90'
										: 'bg-gray-200 text-gray-500 cursor-not-allowed',
							]"
						>
							<svg
								v-if="!isReading"
								class="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
								></path>
							</svg>
							<svg
								v-else
								class="w-5 h-5 animate-spin"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle
									class="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									stroke-width="4"
								></circle>
								<path
									class="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								></path>
							</svg>
							{{ isReading ? "Scanning... Hold tag near device" : "Start NFC Scan" }}
						</button>

						<button
							@click="clearResults"
							class="py-3 px-6 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all"
						>
							Clear
						</button>
					</div>

					<!-- Last Scanned Code -->
					<div
						v-if="lastReadCode"
						class="p-4 bg-green-50 border border-green-200 rounded-lg"
					>
						<div class="flex items-center gap-2 mb-2">
							<svg
								class="w-5 h-5 text-green-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
								></path>
							</svg>
							<span class="font-medium text-green-900">Last Scanned Code:</span>
						</div>
						<div class="font-mono text-lg text-green-900 bg-white p-3 rounded border border-green-300">
							{{ lastReadCode }}
						</div>
					</div>

					<!-- Error Display -->
					<div
						v-if="error"
						class="p-4 bg-red-50 border border-red-200 rounded-lg"
					>
						<div class="flex items-center gap-2 mb-2">
							<svg
								class="w-5 h-5 text-red-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								></path>
							</svg>
							<span class="font-medium text-red-900">Error:</span>
						</div>
						<div class="text-sm text-red-800">{{ error }}</div>
					</div>
				</div>
			</div>

			<!-- Scan History Card -->
			<div
				v-if="scanHistory.length > 0"
				class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6"
			>
				<h2 class="text-xl font-semibold text-gray-900 mb-4 flex items-center justify-between">
					<span class="flex items-center gap-2">
						<svg
							class="w-6 h-6 text-indigo-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
							></path>
						</svg>
						Scan History
					</span>
					<span class="text-sm font-normal text-gray-500">
						{{ scanHistory.length }} scan{{ scanHistory.length === 1 ? "" : "s" }}
					</span>
				</h2>

				<div class="space-y-2 max-h-96 overflow-y-auto">
					<div
						v-for="(scan, index) in scanHistory"
						:key="index"
						class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
					>
						<div class="flex-1">
							<div class="font-mono text-sm text-gray-900">
								{{ scan.code }}
							</div>
							<div class="text-xs text-gray-500 mt-1">
								{{ formatTimestamp(scan.timestamp) }}
							</div>
						</div>
						<span
							:class="[
								'px-2 py-1 text-xs font-medium rounded',
								scan.success
									? 'bg-green-100 text-green-800'
									: 'bg-red-100 text-red-800',
							]"
						>
							{{ scan.success ? "Success" : "Failed" }}
						</span>
					</div>
				</div>
			</div>

			<!-- Browser Compatibility Card -->
			<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
				<h2 class="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
					<svg
						class="w-6 h-6 text-gray-600"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
						></path>
					</svg>
					Browser Compatibility
				</h2>

				<div class="space-y-3">
					<div class="grid grid-cols-2 md:grid-cols-3 gap-3">
						<div
							v-for="(supported, browser) in browserCompatInfo"
							:key="browser"
							:class="[
								'p-3 rounded-lg border-2',
								supported
									? 'bg-green-50 border-green-200'
									: 'bg-gray-50 border-gray-200',
							]"
						>
							<div class="flex items-center justify-between">
								<span class="text-sm font-medium capitalize text-gray-900">
									{{ browser }}
								</span>
								<svg
									v-if="supported"
									class="w-5 h-5 text-green-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M5 13l4 4L19 7"
									></path>
								</svg>
								<svg
									v-else
									class="w-5 h-5 text-gray-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M6 18L18 6M6 6l12 12"
									></path>
								</svg>
							</div>
						</div>
					</div>

					<div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
						<p class="text-sm text-blue-800">
							{{ browserCompatibility.message }}
						</p>
					</div>
				</div>
			</div>

			<!-- Testing Tips Card -->
			<div class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-sm border border-purple-200 p-6">
				<h2 class="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
					<svg
						class="w-6 h-6 text-purple-600"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
						></path>
					</svg>
					Testing Tips
				</h2>

				<div class="space-y-3 text-sm text-gray-700">
					<div class="flex items-start gap-3">
						<svg
							class="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
							></path>
						</svg>
						<p>
							<strong>Mobile Only:</strong> NFC reading requires a physical mobile device with NFC hardware.
							Desktop browsers cannot access NFC.
						</p>
					</div>

					<div class="flex items-start gap-3">
						<svg
							class="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
							></path>
						</svg>
						<p>
							<strong>Chrome Recommended:</strong> Use Chrome, Edge, or Opera on Android 7.0+ for best
							compatibility.
						</p>
					</div>

					<div class="flex items-start gap-3">
						<svg
							class="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
							></path>
						</svg>
						<p>
							<strong>Close Proximity:</strong> Hold your device within 2-5cm of the NFC tag. Remove thick
							phone cases if needed.
						</p>
					</div>

					<div class="flex items-start gap-3">
						<svg
							class="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
							></path>
						</svg>
						<p>
							<strong>HTTPS Required:</strong> Web NFC API only works on HTTPS connections (or localhost
							for development).
						</p>
					</div>

					<div class="flex items-start gap-3">
						<svg
							class="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
							></path>
						</svg>
						<p>
							<strong>Enable NFC:</strong> Make sure NFC is enabled in your device settings before
							testing.
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useNfcReader } from "@/composables/useNfcReader";

const {
	readNFC,
	isReading,
	lastReadCode,
	error,
	canUseNFC,
	nfcStatusMessage,
	browserCompatibility,
	showNFCInfo,
	getDeviceInfo,
} = useNfcReader();

const scanHistory = ref([]);
const deviceInfo = ref({});
const browserCompatInfo = ref({});

onMounted(() => {
	deviceInfo.value = getDeviceInfo();
	browserCompatInfo.value = {
		chrome: browserCompatibility.value.chrome,
		edge: browserCompatibility.value.edge,
		firefox: browserCompatibility.value.firefox,
		safari: browserCompatibility.value.safari,
		opera: browserCompatibility.value.opera,
	};
});

async function startNFCScan() {
	const code = await readNFC({
		timeout: 20000,
		onSuccess: (scannedCode) => {
			scanHistory.value.unshift({
				code: scannedCode,
				timestamp: new Date(),
				success: true,
			});
		},
		onError: (err) => {
			scanHistory.value.unshift({
				code: err.message || "Unknown error",
				timestamp: new Date(),
				success: false,
			});
		},
	});
}

function clearResults() {
	scanHistory.value = [];
}

function formatTimestamp(date) {
	const now = new Date();
	const diff = now - date;
	const seconds = Math.floor(diff / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);

	if (seconds < 60) {
		return `${seconds} second${seconds === 1 ? "" : "s"} ago`;
	} else if (minutes < 60) {
		return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
	} else if (hours < 24) {
		return `${hours} hour${hours === 1 ? "" : "s"} ago`;
	} else {
		return date.toLocaleString();
	}
}
</script>

<style scoped>
/* Custom scrollbar for scan history */
.max-h-96::-webkit-scrollbar {
	width: 6px;
}

.max-h-96::-webkit-scrollbar-track {
	background: #f1f1f1;
	border-radius: 10px;
}

.max-h-96::-webkit-scrollbar-thumb {
	background: #888;
	border-radius: 10px;
}

.max-h-96::-webkit-scrollbar-thumb:hover {
	background: #555;
}
</style>
