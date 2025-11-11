<template>
	<div class="flex items-center gap-3">
		<!-- Logo SVG -->
		<div :class="['relative', animated ? 'group' : '']">
			<!-- Glow effect on hover (only if animated) -->
			<div v-if="animated"
				class="absolute inset-0 bg-gradient-to-br from-sky-400 to-blue-600 rounded-lg blur-sm opacity-0 group-hover:opacity-30 transition-opacity duration-300">
			</div>

			<svg :class="[
				'relative transition-transform duration-300',
				animated ? 'group-hover:scale-105' : '',
				sizeClasses
			]" viewBox="0 0 92 122" fill="none" xmlns="http://www.w3.org/2000/svg">
				<defs>
					<linearGradient :id="gradientId" x1="0%" y1="0%" x2="100%" y2="100%">
						<stop offset="0%" :style="`stop-color:${gradientStart};stop-opacity:1`" />
						<stop offset="100%" :style="`stop-color:${gradientEnd};stop-opacity:1`" />
					</linearGradient>
				</defs>
				<path
					d="M61.3333 0H92V30.5H61.3333V0ZM30.6667 0H61.3333V30.5H30.6667V0ZM0 30.5H30.6667V61H0V30.5ZM61.3333 61H92V91.5H61.3333V61ZM61.3333 91.5H92V122H61.3333V91.5ZM0 91.5H30.6667V122H0V91.5ZM0 0H30.6667V30.5H0V0ZM30.6667 91.5H61.3333V122H30.6667V91.5Z"
					:fill="`url(#${gradientId})`" class="transition-all duration-300" />
			</svg>
		</div>

		<!-- Brand Name (optional) -->
		<div v-if="showText" class="flex flex-col">
			<span :class="[
				'font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent',
				textSizeClass
			]">
				SureBox
			</span>
			<p v-if="showTagline" class="text-xs text-gray-500 font-medium -mt-1">
				{{ tagline }}
			</p>
		</div>
	</div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
	// Size options: 'xs', 'sm', 'md', 'lg', 'xl'
	size: {
		type: String,
		default: 'md',
		validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value)
	},
	// Show brand name text
	showText: {
		type: Boolean,
		default: true
	},
	// Show tagline under brand name
	showTagline: {
		type: Boolean,
		default: false
	},
	// Custom tagline text
	tagline: {
		type: String,
		default: 'Secure Delivery'
	},
	// Enable hover animations
	animated: {
		type: Boolean,
		default: true
	},
	// Gradient colors
	gradientStart: {
		type: String,
		default: '#0ea5e9' // sky-500
	},
	gradientEnd: {
		type: String,
		default: '#2563eb' // blue-600
	}
})

// Generate unique gradient ID
const gradientId = computed(() => `logoGradient-${Math.random().toString(36).substr(2, 9)}`)

// Size classes for the SVG
const sizeClasses = computed(() => {
	const sizes = {
		xs: 'w-6 h-8',
		sm: 'w-8 h-10',
		md: 'w-10 h-12',
		lg: 'w-12 h-16',
		xl: 'w-16 h-20'
	}
	return sizes[props.size] || sizes.md
})

// Text size class
const textSizeClass = computed(() => {
	const textSizes = {
		xs: 'text-sm',
		sm: 'text-base',
		md: 'text-xl',
		lg: 'text-2xl',
		xl: 'text-3xl'
	}
	return textSizes[props.size] || textSizes.md
})
</script>

<style scoped>
.bg-clip-text {
	-webkit-background-clip: text;
	background-clip: text;
}
</style>
