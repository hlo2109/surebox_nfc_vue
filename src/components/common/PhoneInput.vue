<template>
	<div class="space-y-2">
		<label
			v-if="label"
			:for="inputId"
			class="block text-sm font-medium text-gray-700"
		>
			{{ label }}
			<span v-if="required" class="text-red-500">*</span>
		</label>

		<div class="relative">
			<!-- Country Selector -->
			<div class="absolute inset-y-0 left-0 flex items-center">
				<button
					type="button"
					:disabled="disabled"
					@click="toggleCountryDropdown"
					class="flex items-center gap-2 pl-3 pr-2 h-full border-r border-gray-300 hover:bg-gray-50 transition-colors rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#0D65AE] focus:z-10"
					:class="disabled && 'opacity-60 cursor-not-allowed'"
				>
					<span class="text-2xl">{{ selectedCountry.flag }}</span>
					<span class="text-sm font-medium text-gray-700">{{
						selectedCountry.dialCode
					}}</span>
					<svg
						class="w-4 h-4 text-gray-500 transition-transform"
						:class="showCountryDropdown && 'rotate-180'"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M19 9l-7 7-7-7"
						></path>
					</svg>
				</button>

				<!-- Country Dropdown -->
				<div
					v-if="showCountryDropdown"
					class="absolute top-full left-0 mt-1 w-80 max-h-80 overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-xl z-50"
					@click.stop
				>
					<!-- Search Box -->
					<div
						class="sticky top-0 bg-white border-b border-gray-200 p-2"
					>
						<input
							ref="countrySearchRef"
							v-model="countrySearch"
							type="text"
							placeholder="Search countries..."
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0D65AE] focus:border-transparent text-sm"
						/>
					</div>

					<!-- Country List -->
					<div class="py-1">
						<button
							v-for="country in filteredCountries"
							:key="country.code"
							type="button"
							@click="selectCountry(country)"
							class="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-colors text-left"
							:class="
								selectedCountry.code === country.code &&
								'bg-blue-50'
							"
						>
							<span class="text-2xl">{{ country.flag }}</span>
							<div class="flex-1 min-w-0">
								<div class="text-sm font-medium text-gray-900">
									{{ country.name }}
								</div>
							</div>
							<span
								class="text-sm font-medium text-gray-500 flex-shrink-0"
								>{{ country.dialCode }}</span
							>
						</button>

						<div
							v-if="filteredCountries.length === 0"
							class="px-4 py-8 text-center text-sm text-gray-500"
						>
							No countries found
						</div>
					</div>
				</div>
			</div>

			<!-- Input Field -->
			<input
				:id="inputId"
				ref="inputRef"
				v-model="displayValue"
				type="tel"
				:placeholder="computedPlaceholder"
				:disabled="disabled"
				:required="required"
				@input="handleInput"
				@blur="handleBlur"
				@focus="handleFocus"
				@keydown="handleKeydown"
				:class="[
					'w-full pr-12 py-3 border rounded-lg transition-all duration-200',
					'text-gray-900 placeholder-gray-400',
					'focus:outline-none focus:ring-2',
					paddingLeftClass,
					isFocused
						? 'border-[#0D65AE] ring-2 ring-[#0D65AE]/20'
						: isValid === false && modelValue
							? 'border-red-300 focus:border-red-500 focus:ring-red-200'
							: 'border-gray-300 hover:border-gray-400 focus:border-[#0D65AE] focus:ring-[#0D65AE]/20',
					disabled && 'bg-gray-50 cursor-not-allowed opacity-60',
				]"
			/>

			<!-- Validation Icon -->
			<div
				class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
			>
				<!-- Valid Icon -->
				<svg
					v-if="isValid && modelValue"
					class="w-5 h-5 text-green-500"
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

				<!-- Invalid Icon -->
				<svg
					v-else-if="isValid === false && modelValue && !isFocused"
					class="w-5 h-5 text-red-500"
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
			</div>
		</div>

		<!-- Helper Text / Error Message -->
		<div class="min-h-[20px]">
			<!-- Error Message -->
			<p
				v-if="isValid === false && modelValue && !isFocused"
				class="text-sm text-red-600 flex items-center gap-1.5 animate-fade-in"
			>
				<svg
					class="w-4 h-4 flex-shrink-0"
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
				{{ computedErrorMessage }}
			</p>

			<!-- Success Message -->
			<p
				v-else-if="isValid && modelValue && showSuccessMessage"
				class="text-sm text-green-600 flex items-center gap-1.5 animate-fade-in"
			>
				<svg
					class="w-4 h-4 flex-shrink-0"
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
				Valid {{ selectedCountry.name }} number
			</p>

			<!-- Helper Text -->
			<p
				v-else-if="computedHelperText"
				class="text-sm text-gray-500 flex items-center gap-1.5"
			>
				<svg
					class="w-4 h-4 flex-shrink-0"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					></path>
				</svg>
				{{ computedHelperText }}
			</p>
		</div>

		<!-- Format Examples (Optional) -->
		<div
			v-if="showExamples && isFocused && currentExamples.length > 0"
			class="p-3 bg-blue-50 border border-blue-200 rounded-lg space-y-1 animate-fade-in"
		>
			<p class="text-xs font-medium text-blue-900 mb-2">
				Example formats for {{ selectedCountry.name }}:
			</p>
			<div class="space-y-1">
				<div
					v-for="example in currentExamples"
					:key="example"
					class="flex items-center gap-2 text-xs text-blue-700"
				>
					<svg
						class="w-3 h-3 text-blue-500"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 5l7 7-7 7"
						></path>
					</svg>
					<span class="font-mono">{{ example }}</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import {
	ref,
	computed,
	watch,
	onMounted,
	onBeforeUnmount,
	nextTick,
} from "vue";
import {
	parsePhoneNumber,
	isValidPhoneNumber,
	getExampleNumber,
} from "libphonenumber-js";
import examples from "libphonenumber-js/mobile/examples";

// Comprehensive country list (200+ countries)
const countries = [
	{ code: "AF", name: "Afghanistan", dialCode: "+93", flag: "🇦🇫" },
	{ code: "AL", name: "Albania", dialCode: "+355", flag: "🇦🇱" },
	{ code: "DZ", name: "Algeria", dialCode: "+213", flag: "🇩🇿" },
	{ code: "AS", name: "American Samoa", dialCode: "+1684", flag: "🇦🇸" },
	{ code: "AD", name: "Andorra", dialCode: "+376", flag: "🇦🇩" },
	{ code: "AO", name: "Angola", dialCode: "+244", flag: "🇦🇴" },
	{ code: "AI", name: "Anguilla", dialCode: "+1264", flag: "🇦🇮" },
	{ code: "AG", name: "Antigua and Barbuda", dialCode: "+1268", flag: "🇦🇬" },
	{ code: "AR", name: "Argentina", dialCode: "+54", flag: "🇦🇷" },
	{ code: "AM", name: "Armenia", dialCode: "+374", flag: "🇦🇲" },
	{ code: "AW", name: "Aruba", dialCode: "+297", flag: "🇦🇼" },
	{ code: "AU", name: "Australia", dialCode: "+61", flag: "🇦🇺" },
	{ code: "AT", name: "Austria", dialCode: "+43", flag: "🇦🇹" },
	{ code: "AZ", name: "Azerbaijan", dialCode: "+994", flag: "🇦🇿" },
	{ code: "BS", name: "Bahamas", dialCode: "+1242", flag: "🇧🇸" },
	{ code: "BH", name: "Bahrain", dialCode: "+973", flag: "🇧🇭" },
	{ code: "BD", name: "Bangladesh", dialCode: "+880", flag: "🇧🇩" },
	{ code: "BB", name: "Barbados", dialCode: "+1246", flag: "🇧🇧" },
	{ code: "BY", name: "Belarus", dialCode: "+375", flag: "🇧🇾" },
	{ code: "BE", name: "Belgium", dialCode: "+32", flag: "🇧🇪" },
	{ code: "BZ", name: "Belize", dialCode: "+501", flag: "🇧🇿" },
	{ code: "BJ", name: "Benin", dialCode: "+229", flag: "🇧🇯" },
	{ code: "BM", name: "Bermuda", dialCode: "+1441", flag: "🇧🇲" },
	{ code: "BT", name: "Bhutan", dialCode: "+975", flag: "🇧🇹" },
	{ code: "BO", name: "Bolivia", dialCode: "+591", flag: "🇧🇴" },
	{
		code: "BA",
		name: "Bosnia and Herzegovina",
		dialCode: "+387",
		flag: "🇧🇦",
	},
	{ code: "BW", name: "Botswana", dialCode: "+267", flag: "🇧🇼" },
	{ code: "BR", name: "Brazil", dialCode: "+55", flag: "🇧🇷" },
	{ code: "BN", name: "Brunei", dialCode: "+673", flag: "🇧🇳" },
	{ code: "BG", name: "Bulgaria", dialCode: "+359", flag: "🇧🇬" },
	{ code: "BF", name: "Burkina Faso", dialCode: "+226", flag: "🇧🇫" },
	{ code: "BI", name: "Burundi", dialCode: "+257", flag: "🇧🇮" },
	{ code: "KH", name: "Cambodia", dialCode: "+855", flag: "🇰🇭" },
	{ code: "CM", name: "Cameroon", dialCode: "+237", flag: "🇨🇲" },
	{ code: "CA", name: "Canada", dialCode: "+1", flag: "🇨🇦" },
	{ code: "CV", name: "Cape Verde", dialCode: "+238", flag: "🇨🇻" },
	{ code: "KY", name: "Cayman Islands", dialCode: "+1345", flag: "🇰🇾" },
	{
		code: "CF",
		name: "Central African Republic",
		dialCode: "+236",
		flag: "🇨🇫",
	},
	{ code: "TD", name: "Chad", dialCode: "+235", flag: "🇹🇩" },
	{ code: "CL", name: "Chile", dialCode: "+56", flag: "🇨🇱" },
	{ code: "CN", name: "China", dialCode: "+86", flag: "🇨🇳" },
	{ code: "CO", name: "Colombia", dialCode: "+57", flag: "🇨🇴" },
	{ code: "KM", name: "Comoros", dialCode: "+269", flag: "🇰🇲" },
	{ code: "CG", name: "Congo", dialCode: "+242", flag: "🇨🇬" },
	{ code: "CD", name: "Congo (DRC)", dialCode: "+243", flag: "🇨🇩" },
	{ code: "CK", name: "Cook Islands", dialCode: "+682", flag: "🇨🇰" },
	{ code: "CR", name: "Costa Rica", dialCode: "+506", flag: "🇨🇷" },
	{ code: "CI", name: "Côte d'Ivoire", dialCode: "+225", flag: "🇨🇮" },
	{ code: "HR", name: "Croatia", dialCode: "+385", flag: "🇭🇷" },
	{ code: "CU", name: "Cuba", dialCode: "+53", flag: "🇨🇺" },
	{ code: "CY", name: "Cyprus", dialCode: "+357", flag: "🇨🇾" },
	{ code: "CZ", name: "Czech Republic", dialCode: "+420", flag: "🇨🇿" },
	{ code: "DK", name: "Denmark", dialCode: "+45", flag: "🇩🇰" },
	{ code: "DJ", name: "Djibouti", dialCode: "+253", flag: "🇩🇯" },
	{ code: "DM", name: "Dominica", dialCode: "+1767", flag: "🇩🇲" },
	{ code: "DO", name: "Dominican Republic", dialCode: "+1", flag: "🇩🇴" },
	{ code: "EC", name: "Ecuador", dialCode: "+593", flag: "🇪🇨" },
	{ code: "EG", name: "Egypt", dialCode: "+20", flag: "🇪🇬" },
	{ code: "SV", name: "El Salvador", dialCode: "+503", flag: "🇸🇻" },
	{ code: "GQ", name: "Equatorial Guinea", dialCode: "+240", flag: "🇬🇶" },
	{ code: "ER", name: "Eritrea", dialCode: "+291", flag: "🇪🇷" },
	{ code: "EE", name: "Estonia", dialCode: "+372", flag: "🇪🇪" },
	{ code: "ET", name: "Ethiopia", dialCode: "+251", flag: "🇪🇹" },
	{ code: "FJ", name: "Fiji", dialCode: "+679", flag: "🇫🇯" },
	{ code: "FI", name: "Finland", dialCode: "+358", flag: "🇫🇮" },
	{ code: "FR", name: "France", dialCode: "+33", flag: "🇫🇷" },
	{ code: "GA", name: "Gabon", dialCode: "+241", flag: "🇬🇦" },
	{ code: "GM", name: "Gambia", dialCode: "+220", flag: "🇬🇲" },
	{ code: "GE", name: "Georgia", dialCode: "+995", flag: "🇬🇪" },
	{ code: "DE", name: "Germany", dialCode: "+49", flag: "🇩🇪" },
	{ code: "GH", name: "Ghana", dialCode: "+233", flag: "🇬🇭" },
	{ code: "GI", name: "Gibraltar", dialCode: "+350", flag: "🇬🇮" },
	{ code: "GR", name: "Greece", dialCode: "+30", flag: "🇬🇷" },
	{ code: "GL", name: "Greenland", dialCode: "+299", flag: "🇬🇱" },
	{ code: "GD", name: "Grenada", dialCode: "+1473", flag: "🇬🇩" },
	{ code: "GU", name: "Guam", dialCode: "+1671", flag: "🇬🇺" },
	{ code: "GT", name: "Guatemala", dialCode: "+502", flag: "🇬🇹" },
	{ code: "GN", name: "Guinea", dialCode: "+224", flag: "🇬🇳" },
	{ code: "GW", name: "Guinea-Bissau", dialCode: "+245", flag: "🇬🇼" },
	{ code: "GY", name: "Guyana", dialCode: "+592", flag: "🇬🇾" },
	{ code: "HT", name: "Haiti", dialCode: "+509", flag: "🇭🇹" },
	{ code: "HN", name: "Honduras", dialCode: "+504", flag: "🇭🇳" },
	{ code: "HK", name: "Hong Kong", dialCode: "+852", flag: "🇭🇰" },
	{ code: "HU", name: "Hungary", dialCode: "+36", flag: "🇭🇺" },
	{ code: "IS", name: "Iceland", dialCode: "+354", flag: "🇮🇸" },
	{ code: "IN", name: "India", dialCode: "+91", flag: "🇮🇳" },
	{ code: "ID", name: "Indonesia", dialCode: "+62", flag: "🇮🇩" },
	{ code: "IR", name: "Iran", dialCode: "+98", flag: "🇮🇷" },
	{ code: "IQ", name: "Iraq", dialCode: "+964", flag: "🇮🇶" },
	{ code: "IE", name: "Ireland", dialCode: "+353", flag: "🇮🇪" },
	{ code: "IL", name: "Israel", dialCode: "+972", flag: "🇮🇱" },
	{ code: "IT", name: "Italy", dialCode: "+39", flag: "🇮🇹" },
	{ code: "JM", name: "Jamaica", dialCode: "+1876", flag: "🇯🇲" },
	{ code: "JP", name: "Japan", dialCode: "+81", flag: "🇯🇵" },
	{ code: "JO", name: "Jordan", dialCode: "+962", flag: "🇯🇴" },
	{ code: "KZ", name: "Kazakhstan", dialCode: "+7", flag: "🇰🇿" },
	{ code: "KE", name: "Kenya", dialCode: "+254", flag: "🇰🇪" },
	{ code: "KI", name: "Kiribati", dialCode: "+686", flag: "🇰🇮" },
	{ code: "KW", name: "Kuwait", dialCode: "+965", flag: "🇰🇼" },
	{ code: "KG", name: "Kyrgyzstan", dialCode: "+996", flag: "🇰🇬" },
	{ code: "LA", name: "Laos", dialCode: "+856", flag: "🇱🇦" },
	{ code: "LV", name: "Latvia", dialCode: "+371", flag: "🇱🇻" },
	{ code: "LB", name: "Lebanon", dialCode: "+961", flag: "🇱🇧" },
	{ code: "LS", name: "Lesotho", dialCode: "+266", flag: "🇱🇸" },
	{ code: "LR", name: "Liberia", dialCode: "+231", flag: "🇱🇷" },
	{ code: "LY", name: "Libya", dialCode: "+218", flag: "🇱🇾" },
	{ code: "LI", name: "Liechtenstein", dialCode: "+423", flag: "🇱🇮" },
	{ code: "LT", name: "Lithuania", dialCode: "+370", flag: "🇱🇹" },
	{ code: "LU", name: "Luxembourg", dialCode: "+352", flag: "🇱🇺" },
	{ code: "MO", name: "Macau", dialCode: "+853", flag: "🇲🇴" },
	{ code: "MK", name: "Macedonia", dialCode: "+389", flag: "🇲🇰" },
	{ code: "MG", name: "Madagascar", dialCode: "+261", flag: "🇲🇬" },
	{ code: "MW", name: "Malawi", dialCode: "+265", flag: "🇲🇼" },
	{ code: "MY", name: "Malaysia", dialCode: "+60", flag: "🇲🇾" },
	{ code: "MV", name: "Maldives", dialCode: "+960", flag: "🇲🇻" },
	{ code: "ML", name: "Mali", dialCode: "+223", flag: "🇲🇱" },
	{ code: "MT", name: "Malta", dialCode: "+356", flag: "🇲🇹" },
	{ code: "MH", name: "Marshall Islands", dialCode: "+692", flag: "🇲🇭" },
	{ code: "MR", name: "Mauritania", dialCode: "+222", flag: "🇲🇷" },
	{ code: "MU", name: "Mauritius", dialCode: "+230", flag: "🇲🇺" },
	{ code: "MX", name: "Mexico", dialCode: "+52", flag: "🇲🇽" },
	{ code: "FM", name: "Micronesia", dialCode: "+691", flag: "🇫🇲" },
	{ code: "MD", name: "Moldova", dialCode: "+373", flag: "🇲🇩" },
	{ code: "MC", name: "Monaco", dialCode: "+377", flag: "🇲🇨" },
	{ code: "MN", name: "Mongolia", dialCode: "+976", flag: "🇲🇳" },
	{ code: "ME", name: "Montenegro", dialCode: "+382", flag: "🇲🇪" },
	{ code: "MS", name: "Montserrat", dialCode: "+1664", flag: "🇲🇸" },
	{ code: "MA", name: "Morocco", dialCode: "+212", flag: "🇲🇦" },
	{ code: "MZ", name: "Mozambique", dialCode: "+258", flag: "🇲🇿" },
	{ code: "MM", name: "Myanmar", dialCode: "+95", flag: "🇲🇲" },
	{ code: "NA", name: "Namibia", dialCode: "+264", flag: "🇳🇦" },
	{ code: "NR", name: "Nauru", dialCode: "+674", flag: "🇳🇷" },
	{ code: "NP", name: "Nepal", dialCode: "+977", flag: "🇳🇵" },
	{ code: "NL", name: "Netherlands", dialCode: "+31", flag: "🇳🇱" },
	{ code: "NZ", name: "New Zealand", dialCode: "+64", flag: "🇳🇿" },
	{ code: "NI", name: "Nicaragua", dialCode: "+505", flag: "🇳🇮" },
	{ code: "NE", name: "Niger", dialCode: "+227", flag: "🇳🇪" },
	{ code: "NG", name: "Nigeria", dialCode: "+234", flag: "🇳🇬" },
	{ code: "KP", name: "North Korea", dialCode: "+850", flag: "🇰🇵" },
	{ code: "NO", name: "Norway", dialCode: "+47", flag: "🇳🇴" },
	{ code: "OM", name: "Oman", dialCode: "+968", flag: "🇴🇲" },
	{ code: "PK", name: "Pakistan", dialCode: "+92", flag: "🇵🇰" },
	{ code: "PW", name: "Palau", dialCode: "+680", flag: "🇵🇼" },
	{ code: "PS", name: "Palestine", dialCode: "+970", flag: "🇵🇸" },
	{ code: "PA", name: "Panama", dialCode: "+507", flag: "🇵🇦" },
	{ code: "PG", name: "Papua New Guinea", dialCode: "+675", flag: "🇵🇬" },
	{ code: "PY", name: "Paraguay", dialCode: "+595", flag: "🇵🇾" },
	{ code: "PE", name: "Peru", dialCode: "+51", flag: "🇵🇪" },
	{ code: "PH", name: "Philippines", dialCode: "+63", flag: "🇵🇭" },
	{ code: "PL", name: "Poland", dialCode: "+48", flag: "🇵🇱" },
	{ code: "PT", name: "Portugal", dialCode: "+351", flag: "🇵🇹" },
	{ code: "PR", name: "Puerto Rico", dialCode: "+1", flag: "🇵🇷" },
	{ code: "QA", name: "Qatar", dialCode: "+974", flag: "🇶🇦" },
	{ code: "RO", name: "Romania", dialCode: "+40", flag: "🇷🇴" },
	{ code: "RU", name: "Russia", dialCode: "+7", flag: "🇷🇺" },
	{ code: "RW", name: "Rwanda", dialCode: "+250", flag: "🇷🇼" },
	{ code: "WS", name: "Samoa", dialCode: "+685", flag: "🇼🇸" },
	{ code: "SM", name: "San Marino", dialCode: "+378", flag: "🇸🇲" },
	{ code: "ST", name: "São Tomé and Príncipe", dialCode: "+239", flag: "🇸🇹" },
	{ code: "SA", name: "Saudi Arabia", dialCode: "+966", flag: "🇸🇦" },
	{ code: "SN", name: "Senegal", dialCode: "+221", flag: "🇸🇳" },
	{ code: "RS", name: "Serbia", dialCode: "+381", flag: "🇷🇸" },
	{ code: "SC", name: "Seychelles", dialCode: "+248", flag: "🇸🇨" },
	{ code: "SL", name: "Sierra Leone", dialCode: "+232", flag: "🇸🇱" },
	{ code: "SG", name: "Singapore", dialCode: "+65", flag: "🇸🇬" },
	{ code: "SK", name: "Slovakia", dialCode: "+421", flag: "🇸🇰" },
	{ code: "SI", name: "Slovenia", dialCode: "+386", flag: "🇸🇮" },
	{ code: "SB", name: "Solomon Islands", dialCode: "+677", flag: "🇸🇧" },
	{ code: "SO", name: "Somalia", dialCode: "+252", flag: "🇸🇴" },
	{ code: "ZA", name: "South Africa", dialCode: "+27", flag: "🇿🇦" },
	{ code: "KR", name: "South Korea", dialCode: "+82", flag: "🇰🇷" },
	{ code: "SS", name: "South Sudan", dialCode: "+211", flag: "🇸🇸" },
	{ code: "ES", name: "Spain", dialCode: "+34", flag: "🇪🇸" },
	{ code: "LK", name: "Sri Lanka", dialCode: "+94", flag: "🇱🇰" },
	{ code: "KN", name: "St Kitts and Nevis", dialCode: "+1869", flag: "🇰🇳" },
	{ code: "LC", name: "St Lucia", dialCode: "+1758", flag: "🇱🇨" },
	{
		code: "VC",
		name: "St Vincent and Grenadines",
		dialCode: "+1784",
		flag: "🇻🇨",
	},
	{ code: "SD", name: "Sudan", dialCode: "+249", flag: "🇸🇩" },
	{ code: "SR", name: "Suriname", dialCode: "+597", flag: "🇸🇷" },
	{ code: "SZ", name: "Swaziland", dialCode: "+268", flag: "🇸🇿" },
	{ code: "SE", name: "Sweden", dialCode: "+46", flag: "🇸🇪" },
	{ code: "CH", name: "Switzerland", dialCode: "+41", flag: "🇨🇭" },
	{ code: "SY", name: "Syria", dialCode: "+963", flag: "🇸🇾" },
	{ code: "TW", name: "Taiwan", dialCode: "+886", flag: "🇹🇼" },
	{ code: "TJ", name: "Tajikistan", dialCode: "+992", flag: "🇹🇯" },
	{ code: "TZ", name: "Tanzania", dialCode: "+255", flag: "🇹🇿" },
	{ code: "TH", name: "Thailand", dialCode: "+66", flag: "🇹🇭" },
	{ code: "TL", name: "Timor-Leste", dialCode: "+670", flag: "🇹🇱" },
	{ code: "TG", name: "Togo", dialCode: "+228", flag: "🇹🇬" },
	{ code: "TO", name: "Tonga", dialCode: "+676", flag: "🇹🇴" },
	{ code: "TT", name: "Trinidad and Tobago", dialCode: "+1868", flag: "🇹🇹" },
	{ code: "TN", name: "Tunisia", dialCode: "+216", flag: "🇹🇳" },
	{ code: "TR", name: "Turkey", dialCode: "+90", flag: "🇹🇷" },
	{ code: "TM", name: "Turkmenistan", dialCode: "+993", flag: "🇹🇲" },
	{ code: "TV", name: "Tuvalu", dialCode: "+688", flag: "🇹🇻" },
	{ code: "UG", name: "Uganda", dialCode: "+256", flag: "🇺🇬" },
	{ code: "UA", name: "Ukraine", dialCode: "+380", flag: "🇺🇦" },
	{ code: "AE", name: "United Arab Emirates", dialCode: "+971", flag: "🇦🇪" },
	{ code: "GB", name: "United Kingdom", dialCode: "+44", flag: "🇬🇧" },
	{ code: "US", name: "United States", dialCode: "+1", flag: "🇺🇸" },
	{ code: "UY", name: "Uruguay", dialCode: "+598", flag: "🇺🇾" },
	{ code: "UZ", name: "Uzbekistan", dialCode: "+998", flag: "🇺🇿" },
	{ code: "VU", name: "Vanuatu", dialCode: "+678", flag: "🇻🇺" },
	{ code: "VA", name: "Vatican City", dialCode: "+379", flag: "🇻🇦" },
	{ code: "VE", name: "Venezuela", dialCode: "+58", flag: "🇻🇪" },
	{ code: "VN", name: "Vietnam", dialCode: "+84", flag: "🇻🇳" },
	{ code: "YE", name: "Yemen", dialCode: "+967", flag: "🇾🇪" },
	{ code: "ZM", name: "Zambia", dialCode: "+260", flag: "🇿🇲" },
	{ code: "ZW", name: "Zimbabwe", dialCode: "+263", flag: "🇿🇼" },
];

const props = defineProps({
	modelValue: {
		type: String,
		default: "",
	},
	defaultCountry: {
		type: String,
		default: "AU",
	},
	label: {
		type: String,
		default: "Phone Number",
	},
	placeholder: {
		type: String,
		default: "",
	},
	helperText: {
		type: String,
		default: "",
	},
	errorMessage: {
		type: String,
		default: "",
	},
	required: {
		type: Boolean,
		default: false,
	},
	disabled: {
		type: Boolean,
		default: false,
	},
	showExamples: {
		type: Boolean,
		default: true,
	},
	showSuccessMessage: {
		type: Boolean,
		default: true,
	},
	autoFormat: {
		type: Boolean,
		default: true,
	},
});

const emit = defineEmits([
	"update:modelValue",
	"valid",
	"invalid",
	"blur",
	"focus",
	"country-change",
]);

// Refs
const inputRef = ref(null);
const countrySearchRef = ref(null);
const displayValue = ref("");
const isFocused = ref(false);
const showCountryDropdown = ref(false);
const countrySearch = ref("");
const inputId = `phone-input-${Math.random().toString(36).substr(2, 9)}`;

// Find default country
const selectedCountry = ref(
	countries.find((c) => c.code === props.defaultCountry) || countries[0],
);

watch(
	() => props.defaultCountry,
	(code) => {
		if (!code) return;
		const next = countries.find((c) => c.code === code);
		if (next) selectedCountry.value = next;
	},
);

// Computed
const filteredCountries = computed(() => {
	const search = countrySearch.value.toLowerCase().trim();
	if (!search) return countries;

	return countries.filter(
		(country) =>
			country.name.toLowerCase().includes(search) ||
			country.dialCode.includes(search) ||
			country.code.toLowerCase().includes(search),
	);
});

const paddingLeftClass = computed(() => {
	const dialCodeLength = selectedCountry.value.dialCode.length;
	if (dialCodeLength <= 3) return "pl-28"; // +61
	if (dialCodeLength <= 4) return "pl-32"; // +123
	if (dialCodeLength <= 5) return "pl-36"; // +1234
	return "pl-40"; // +12345
});

const computedPlaceholder = computed(() => {
	if (props.placeholder) return props.placeholder;

	// Try to get example number
	try {
		const example = getExampleNumber(selectedCountry.value.code, examples);
		if (example) {
			return example.formatNational();
		}
	} catch (e) {
		// Fallback to generic
	}

	return "Enter phone number";
});

const computedHelperText = computed(() => {
	if (props.helperText) return props.helperText;
	return `Enter ${selectedCountry.value.name} phone number`;
});

const computedErrorMessage = computed(() => {
	if (props.errorMessage) return props.errorMessage;
	return `Please enter a valid ${selectedCountry.value.name} phone number`;
});

const currentExamples = computed(() => {
	try {
		const example = getExampleNumber(selectedCountry.value.code, examples);
		if (example) {
			const national = example.formatNational();
			const international = example.formatInternational();
			return [national, international];
		}
	} catch (e) {
		// No examples available
	}
	return [];
});

const isValid = computed(() => {
	if (!props.modelValue || props.modelValue.trim() === "") {
		return null; // No validation state for empty
	}

	try {
		// First, try to detect country from the number itself if it has a dial code
		let detectedCountry = null;
		if (props.modelValue.startsWith("+")) {
			try {
				const parsed = parsePhoneNumber(props.modelValue);
				if (parsed && parsed.country) {
					detectedCountry = parsed.country;
					// Auto-switch to detected country if different
					const matchedCountry = countries.find(
						(c) => c.code === detectedCountry,
					);
					if (
						matchedCountry &&
						matchedCountry.code !== selectedCountry.value.code
					) {
						selectedCountry.value = matchedCountry;
					}
				}
			} catch (e) {
				// Continue with selected country
			}
		}

		// Validate with detected or selected country
		const countryToUse = detectedCountry || selectedCountry.value.code;
		const valid = isValidPhoneNumber(props.modelValue, countryToUse);
		return valid;
	} catch (error) {
		return false;
	}
});

// Watch for external model value changes
watch(
	() => props.modelValue,
	(newValue) => {
		if (!newValue) {
			displayValue.value = "";
			return;
		}

		// Only format if not focused and auto-format is enabled
		if (!isFocused.value && props.autoFormat) {
			try {
				const phoneNumber = parsePhoneNumber(
					newValue,
					selectedCountry.value.code,
				);
				if (phoneNumber && phoneNumber.isValid()) {
					displayValue.value = phoneNumber.formatNational();
				} else {
					displayValue.value = newValue;
				}
			} catch (error) {
				displayValue.value = newValue;
			}
		} else if (!isFocused.value) {
			displayValue.value = newValue;
		}
	},
	{ immediate: true },
);

// Watch validation state and emit events
watch(isValid, (valid) => {
	if (valid === true) {
		emit("valid");
	} else if (valid === false) {
		emit("invalid");
	}
});

// Close dropdown when clicking outside
function handleClickOutside(event) {
	const dropdown = event.target.closest(".relative");
	if (!dropdown && showCountryDropdown.value) {
		showCountryDropdown.value = false;
	}
}

onMounted(() => {
	document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
	document.removeEventListener("click", handleClickOutside);
});

// Methods
function toggleCountryDropdown() {
	if (props.disabled) return;
	showCountryDropdown.value = !showCountryDropdown.value;
	if (showCountryDropdown.value) {
		countrySearch.value = "";
		nextTick(() => {
			countrySearchRef.value?.focus();
		});
	}
}

function selectCountry(country) {
	selectedCountry.value = country;
	showCountryDropdown.value = false;
	countrySearch.value = "";
	emit("country-change", country);

	// Re-validate current number with new country
	if (props.modelValue) {
		// Just trigger re-validation by updating display
		const formatted = formatPhoneDisplay(props.modelValue);
		displayValue.value = formatted;
	}

	// Focus input
	nextTick(() => {
		inputRef.value?.focus();
	});
}

function formatPhoneDisplay(value) {
	if (!value) return "";

	try {
		// Try parsing without country hint first (in case it has dial code)
		let phoneNumber;
		if (value.startsWith("+")) {
			phoneNumber = parsePhoneNumber(value);
		} else {
			phoneNumber = parsePhoneNumber(value, selectedCountry.value.code);
		}

		if (phoneNumber && phoneNumber.isValid() && props.autoFormat) {
			return phoneNumber.formatNational();
		}
	} catch (error) {
		// If parsing fails, return value as-is
	}

	return value;
}

function normalizePhoneNumber(value) {
	if (!value) return "";

	// Remove all whitespace and formatting characters, but keep + and digits
	let cleaned = value.replace(/[\s\-\(\)\.]/g, "");

	try {
		// Try parsing with country hint if no dial code present
		let phoneNumber;
		if (cleaned.startsWith("+")) {
			// Has dial code - parse without country hint to auto-detect
			phoneNumber = parsePhoneNumber(cleaned);
		} else {
			// No dial code - use selected country
			phoneNumber = parsePhoneNumber(cleaned, selectedCountry.value.code);
		}

		if (phoneNumber) {
			// Return in E.164 format (international standard)
			return phoneNumber.format("E.164");
		}
	} catch (error) {
		// If parsing fails, try to construct it manually
	}

	// Fallback: If number doesn't start with +, prepend the country dial code
	if (!cleaned.startsWith("+")) {
		// Check if dial code (without +) is already there
		const dialCodeWithoutPlus = selectedCountry.value.dialCode.substring(1);
		if (cleaned.startsWith(dialCodeWithoutPlus)) {
			cleaned = "+" + cleaned;
		} else {
			// Remove leading 0 for countries that use it (like Australia)
			if (cleaned.startsWith("0")) {
				cleaned = cleaned.substring(1);
			}
			cleaned = selectedCountry.value.dialCode + cleaned;
		}
	}

	return cleaned;
}

function handleInput(event) {
	const rawValue = event.target.value;

	// Update display value immediately for responsive typing
	displayValue.value = rawValue;

	// Normalize and emit the cleaned value
	const normalizedValue = normalizePhoneNumber(rawValue);
	emit("update:modelValue", normalizedValue);
}

function handleBlur(event) {
	isFocused.value = false;

	// Format on blur if auto-format is enabled
	if (props.autoFormat && props.modelValue) {
		displayValue.value = formatPhoneDisplay(props.modelValue);
	}

	emit("blur", event);
}

function handleFocus(event) {
	isFocused.value = true;
	emit("focus", event);
}

function handleKeydown(event) {
	// Allow: backspace, delete, tab, escape, enter
	if (
		[46, 8, 9, 27, 13].indexOf(event.keyCode) !== -1 ||
		// Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
		(event.keyCode === 65 && event.ctrlKey === true) ||
		(event.keyCode === 67 && event.ctrlKey === true) ||
		(event.keyCode === 86 && event.ctrlKey === true) ||
		(event.keyCode === 88 && event.ctrlKey === true) ||
		// Allow: home, end, left, right
		(event.keyCode >= 35 && event.keyCode <= 39)
	) {
		return; // Let it happen
	}

	// Allow + only at the start
	if (
		event.key === "+" &&
		(displayValue.value === "" || event.target.selectionStart === 0)
	) {
		return;
	}

	// Allow space, dash, and parentheses for formatting
	if ([" ", "-", "(", ")", "."].includes(event.key)) {
		return;
	}

	// Ensure that it's a number
	if (event.shiftKey || event.key < "0" || event.key > "9") {
		event.preventDefault();
	}
}

// Expose focus method
function focus() {
	inputRef.value?.focus();
}

defineExpose({
	focus,
	isValid,
	selectedCountry,
});
</script>

<style scoped>
@keyframes fade-in {
	from {
		opacity: 0;
		transform: translateY(-4px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.animate-fade-in {
	animation: fade-in 0.2s ease-out;
}

/* Remove number input spinner */
input[type="tel"]::-webkit-inner-spin-button,
input[type="tel"]::-webkit-outer-spin-button {
	-webkit-appearance: none;
	appearance: none;
	margin: 0;
}

input[type="tel"] {
	-moz-appearance: textfield;
	appearance: textfield;
}

/* Scrollbar styling for country dropdown */
.overflow-y-auto::-webkit-scrollbar {
	width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
	background: #f1f1f1;
	border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
	background: #888;
	border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
	background: #555;
}
</style>
