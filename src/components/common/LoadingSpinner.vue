<template>
	<div class="loading-spinner-container" :class="containerClass">
		<div
			class="loading-spinner"
			:class="[sizeClass, colorClass]"
			role="status"
			aria-live="polite"
		>
			<svg
				class="spinner-svg"
				viewBox="0 0 50 50"
				xmlns="http://www.w3.org/2000/svg"
			>
				<circle
					class="spinner-path"
					cx="25"
					cy="25"
					r="20"
					fill="none"
					stroke-width="4"
				/>
			</svg>
		</div>
		<p v-if="message" class="loading-message" :class="messageSizeClass">
			{{ message }}
		</p>
	</div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
	/**
	 * Size of the spinner
	 * @type {'sm' | 'md' | 'lg' | 'xl'}
	 */
	size: {
		type: String,
		default: "md",
		validator: (value) => ["sm", "md", "lg", "xl"].includes(value),
	},
	/**
	 * Color variant of the spinner
	 * @type {'primary' | 'secondary' | 'white' | 'gray'}
	 */
	variant: {
		type: String,
		default: "primary",
		validator: (value) =>
			["primary", "secondary", "white", "gray"].includes(value),
	},
	/**
	 * Optional loading message to display below spinner
	 */
	message: {
		type: String,
		default: "",
	},
	/**
	 * Center the spinner in its container
	 */
	center: {
		type: Boolean,
		default: false,
	},
	/**
	 * Make the spinner fullscreen with overlay
	 */
	fullscreen: {
		type: Boolean,
		default: false,
	},
	/**
	 * Show overlay background (only works with fullscreen)
	 */
	overlay: {
		type: Boolean,
		default: false,
	},
});

const sizeClass = computed(() => {
	const sizes = {
		sm: "spinner-sm",
		md: "spinner-md",
		lg: "spinner-lg",
		xl: "spinner-xl",
	};
	return sizes[props.size] || sizes.md;
});

const messageSizeClass = computed(() => {
	const sizes = {
		sm: "text-xs",
		md: "text-sm",
		lg: "text-base",
		xl: "text-lg",
	};
	return sizes[props.size] || sizes.md;
});

const colorClass = computed(() => {
	const colors = {
		primary: "spinner-primary",
		secondary: "spinner-secondary",
		white: "spinner-white",
		gray: "spinner-gray",
	};
	return colors[props.variant] || colors.primary;
});

const containerClass = computed(() => {
	return {
		"spinner-center": props.center,
		"spinner-fullscreen": props.fullscreen,
		"spinner-overlay": props.fullscreen && props.overlay,
	};
});
</script>

<style scoped>
.loading-spinner-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.75rem;
}

.spinner-center {
	justify-content: center;
	min-height: 200px;
}

.spinner-fullscreen {
	position: fixed;
	inset: 0;
	z-index: 9999;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.spinner-overlay {
	background-color: rgba(0, 0, 0, 0.5);
	backdrop-filter: blur(2px);
}

.loading-spinner {
	display: inline-block;
	animation: rotate 1s linear infinite;
}

.spinner-svg {
	display: block;
}

.spinner-path {
	stroke-linecap: round;
	animation: dash 1.5s ease-in-out infinite;
}

/* Size variants */
.spinner-sm {
	width: 1.5rem;
	height: 1.5rem;
}

.spinner-md {
	width: 2.5rem;
	height: 2.5rem;
}

.spinner-lg {
	width: 3.5rem;
	height: 3.5rem;
}

.spinner-xl {
	width: 5rem;
	height: 5rem;
}

/* Color variants */
.spinner-primary .spinner-path {
	stroke: #0d65ae;
}

.spinner-secondary .spinner-path {
	stroke: #6366f1;
}

.spinner-white .spinner-path {
	stroke: #ffffff;
}

.spinner-gray .spinner-path {
	stroke: #6b7280;
}

.loading-message {
	margin: 0;
	font-weight: 500;
	color: #374151;
}

.spinner-fullscreen .loading-message {
	color: #ffffff;
}

/* Animations */
@keyframes rotate {
	100% {
		transform: rotate(360deg);
	}
}

@keyframes dash {
	0% {
		stroke-dasharray: 1, 150;
		stroke-dashoffset: 0;
	}
	50% {
		stroke-dasharray: 90, 150;
		stroke-dashoffset: -35;
	}
	100% {
		stroke-dasharray: 90, 150;
		stroke-dashoffset: -124;
	}
}
</style>
