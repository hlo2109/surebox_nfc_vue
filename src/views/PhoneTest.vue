<template>
	<div class="min-h-screen bg-gray-50 py-12 px-4">
		<div class="max-w-4xl mx-auto">
			<div class="bg-white rounded-lg shadow-lg p-8">
				<h1 class="text-3xl font-bold text-gray-900 mb-8">
					Phone Input Test & Debug
				</h1>

				<!-- Phone Input Component -->
				<div class="mb-8">
					<PhoneInput
						v-model="phoneNumber"
						label="Test Phone Number"
						:required="true"
						:show-examples="true"
						:show-success-message="true"
						@country-change="handleCountryChange"
						@valid="handleValid"
						@invalid="handleInvalid"
					/>
				</div>

				<!-- Debug Information -->
				<div class="space-y-6">
					<!-- Current Values -->
					<div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
						<h2 class="text-lg font-semibold text-blue-900 mb-3">
							Current Values
						</h2>
						<div class="space-y-2 text-sm">
							<div class="flex justify-between">
								<span class="font-medium text-blue-700"
									>Model Value:</span
								>
								<span class="font-mono text-blue-900">{{
									phoneNumber || "(empty)"
								}}</span>
							</div>
							<div class="flex justify-between">
								<span class="font-medium text-blue-700"
									>Selected Country:</span
								>
								<span class="text-blue-900"
									>{{ selectedCountry.name }} ({{
										selectedCountry.code
									}})</span
								>
							</div>
							<div class="flex justify-between">
								<span class="font-medium text-blue-700"
									>Dial Code:</span
								>
								<span class="text-blue-900">{{
									selectedCountry.dialCode
								}}</span>
							</div>
							<div class="flex justify-between">
								<span class="font-medium text-blue-700"
									>Validation Status:</span
								>
								<span
									:class="
										validationStatus === 'valid'
											? 'text-green-600'
											: validationStatus === 'invalid'
												? 'text-red-600'
												: 'text-gray-600'
									"
									class="font-semibold"
								>
									{{ validationStatus }}
								</span>
							</div>
						</div>
					</div>

					<!-- Manual Validation Test -->
					<div
						class="bg-purple-50 border border-purple-200 rounded-lg p-4"
					>
						<h2 class="text-lg font-semibold text-purple-900 mb-3">
							Manual Validation Test
						</h2>
						<button
							@click="testValidation"
							class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors mb-3"
						>
							Run Validation Test
						</button>
						<div
							v-if="manualTestResult"
							class="space-y-2 text-sm bg-white rounded p-3"
						>
							<div class="flex justify-between">
								<span class="font-medium text-purple-700"
									>Is Valid (simple):</span
								>
								<span
									:class="
										manualTestResult.isValidSimple
											? 'text-green-600'
											: 'text-red-600'
									"
									class="font-semibold"
								>
									{{ manualTestResult.isValidSimple }}
								</span>
							</div>
							<div class="flex justify-between">
								<span class="font-medium text-purple-700"
									>Parsed Number:</span
								>
								<span class="font-mono text-purple-900">{{
									manualTestResult.parsedNumber ||
									"(failed to parse)"
								}}</span>
							</div>
							<div class="flex justify-between">
								<span class="font-medium text-purple-700"
									>Is Valid (parsed):</span
								>
								<span
									:class="
										manualTestResult.isValidParsed
											? 'text-green-600'
											: 'text-red-600'
									"
									class="font-semibold"
								>
									{{ manualTestResult.isValidParsed }}
								</span>
							</div>
							<div class="flex justify-between">
								<span class="font-medium text-purple-700"
									>Country:</span
								>
								<span class="text-purple-900">{{
									manualTestResult.country || "N/A"
								}}</span>
							</div>
							<div class="flex justify-between">
								<span class="font-medium text-purple-700"
									>Type:</span
								>
								<span class="text-purple-900">{{
									manualTestResult.type || "N/A"
								}}</span>
							</div>
							<div class="flex justify-between">
								<span class="font-medium text-purple-700"
									>National Format:</span
								>
								<span class="font-mono text-purple-900">{{
									manualTestResult.national || "N/A"
								}}</span>
							</div>
							<div class="flex justify-between">
								<span class="font-medium text-purple-700"
									>International Format:</span
								>
								<span class="font-mono text-purple-900">{{
									manualTestResult.international || "N/A"
								}}</span>
							</div>
							<div
								v-if="manualTestResult.error"
								class="text-red-600 text-xs mt-2"
							>
								<strong>Error:</strong>
								{{ manualTestResult.error }}
							</div>
						</div>
					</div>

					<!-- Preset Test Numbers -->
					<div
						class="bg-green-50 border border-green-200 rounded-lg p-4"
					>
						<h2 class="text-lg font-semibold text-green-900 mb-3">
							Test with Preset Numbers
						</h2>
						<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
							<button
								v-for="preset in presetNumbers"
								:key="preset.number"
								@click="phoneNumber = preset.number"
								class="text-left p-3 bg-white border border-green-300 rounded-lg hover:bg-green-100 transition-colors"
							>
								<div
									class="text-sm font-semibold text-green-900"
								>
									{{ preset.country }}
								</div>
								<div class="text-xs text-green-700 font-mono">
									{{ preset.number }}
								</div>
							</button>
						</div>
					</div>

					<!-- Event Log -->
					<div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
						<div class="flex justify-between items-center mb-3">
							<h2 class="text-lg font-semibold text-gray-900">
								Event Log
							</h2>
							<button
								@click="eventLog = []"
								class="text-sm text-gray-600 hover:text-gray-900"
							>
								Clear
							</button>
						</div>
						<div
							v-if="eventLog.length === 0"
							class="text-sm text-gray-500 italic"
						>
							No events yet...
						</div>
						<div v-else class="space-y-1 max-h-64 overflow-y-auto">
							<div
								v-for="(event, index) in eventLog"
								:key="index"
								class="text-xs bg-white rounded p-2 border border-gray-200"
							>
								<span
									class="font-semibold"
									:class="{
										'text-green-600': event.type === 'valid',
										'text-red-600': event.type === 'invalid',
										'text-blue-600':
											event.type === 'country-change',
									}"
								>
									[{{ event.type.toUpperCase() }}]
								</span>
								<span class="text-gray-600 ml-2">{{
									event.timestamp
								}}</span>
								<div class="mt-1 text-gray-700">
									{{ event.message }}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref } from "vue";
import PhoneInput from "../components/PhoneInput.vue";
import { parsePhoneNumber, isValidPhoneNumber } from "libphonenumber-js";

const phoneNumber = ref("");
const validationStatus = ref("none");
const manualTestResult = ref(null);
const eventLog = ref([]);

const selectedCountry = ref({
	code: "AU",
	name: "Australia",
	dialCode: "+61",
	flag: "🇦🇺",
});

// Preset test numbers for various countries
const presetNumbers = [
	{ country: "Australia", number: "+61412345678" },
	{ country: "Australia (National)", number: "0412345678" },
	{ country: "USA", number: "+15551234567" },
	{ country: "USA (National)", number: "(555) 123-4567" },
	{ country: "UK", number: "+447911123456" },
	{ country: "UK (National)", number: "07911 123456" },
	{ country: "Germany", number: "+4915112345678" },
	{ country: "France", number: "+33612345678" },
	{ country: "Japan", number: "+819012345678" },
	{ country: "China", number: "+8613812345678" },
	{ country: "India", number: "+919876543210" },
	{ country: "Brazil", number: "+5511987654321" },
];

function handleCountryChange(country) {
	selectedCountry.value = country;
	addLog("country-change", `Changed to ${country.name} (${country.code})`);
}

function handleValid() {
	validationStatus.value = "valid";
	addLog("valid", `Phone number is valid`);
}

function handleInvalid() {
	validationStatus.value = "invalid";
	addLog("invalid", `Phone number is invalid`);
}

function testValidation() {
	if (!phoneNumber.value) {
		alert("Please enter a phone number first");
		return;
	}

	try {
		// Test 1: Simple validation
		const isValidSimple = isValidPhoneNumber(
			phoneNumber.value,
			selectedCountry.value.code,
		);

		// Test 2: Parse and validate
		let parsedNumber = null;
		let isValidParsed = false;
		let country = null;
		let type = null;
		let national = null;
		let international = null;
		let error = null;

		try {
			parsedNumber = parsePhoneNumber(
				phoneNumber.value,
				selectedCountry.value.code,
			);

			if (parsedNumber) {
				isValidParsed = parsedNumber.isValid();
				country = parsedNumber.country;
				type = parsedNumber.getType();
				national = parsedNumber.formatNational();
				international = parsedNumber.formatInternational();
			}
		} catch (e) {
			error = e.message;
		}

		manualTestResult.value = {
			isValidSimple,
			parsedNumber: parsedNumber
				? parsedNumber.format("E.164")
				: null,
			isValidParsed,
			country,
			type,
			national,
			international,
			error,
		};

		addLog(
			"test",
			`Manual validation: Simple=${isValidSimple}, Parsed=${isValidParsed}`,
		);
	} catch (e) {
		manualTestResult.value = {
			isValidSimple: false,
			parsedNumber: null,
			isValidParsed: false,
			country: null,
			type: null,
			national: null,
			international: null,
			error: e.message,
		};
		addLog("test", `Error during validation: ${e.message}`);
	}
}

function addLog(type, message) {
	const now = new Date();
	const timestamp = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;

	eventLog.value.unshift({
		type,
		message,
		timestamp,
	});

	// Keep only last 50 events
	if (eventLog.value.length > 50) {
		eventLog.value = eventLog.value.slice(0, 50);
	}
}
</script>

<style scoped>
/* Custom scrollbar for event log */
.overflow-y-auto::-webkit-scrollbar {
	width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
	background: #f1f1f1;
	border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
	background: #cbd5e0;
	border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
	background: #a0aec0;
}
</style>
