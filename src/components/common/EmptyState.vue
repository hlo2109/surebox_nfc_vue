<template>
	<div class="empty-state" :class="containerClass">
		<div class="empty-state-content">
			<!-- Icon or Image -->
			<div v-if="icon || image" class="empty-state-visual">
				<img
					v-if="image"
					:src="image"
					:alt="title"
					class="empty-state-image"
				/>
				<div v-else-if="icon" class="empty-state-icon" :class="iconColorClass">
					<i :class="icon" class="icon"></i>
				</div>
			</div>

			<!-- Default icon if none provided -->
			<div v-else class="empty-state-icon" :class="iconColorClass">
				<svg
					class="w-16 h-16"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
					></path>
				</svg>
			</div>

			<!-- Title -->
			<h3 class="empty-state-title">
				{{ title }}
			</h3>

			<!-- Description -->
			<p v-if="description" class="empty-state-description">
				{{ description }}
			</p>

			<!-- Actions -->
			<div v-if="$slots.actions || actionText" class="empty-state-actions">
				<slot name="actions">
					<button
						v-if="actionText"
						@click="handleAction"
						class="empty-state-button"
						:class="buttonClass"
					>
						<i v-if="actionIcon" :class="actionIcon" class="mr-2"></i>
						{{ actionText }}
					</button>
				</slot>
			</div>

			<!-- Secondary actions slot -->
			<div v-if="$slots.secondary" class="empty-state-secondary">
				<slot name="secondary"></slot>
			</div>
		</div>
	</div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
	/**
	 * Main title text
	 */
	title: {
		type: String,
		required: true,
	},
	/**
	 * Description text
	 */
	description: {
		type: String,
		default: "",
	},
	/**
	 * Icon class (e.g., 'pi pi-inbox', 'fa fa-box')
	 */
	icon: {
		type: String,
		default: "",
	},
	/**
	 * Image URL to display instead of icon
	 */
	image: {
		type: String,
		default: "",
	},
	/**
	 * Primary action button text
	 */
	actionText: {
		type: String,
		default: "",
	},
	/**
	 * Icon for the action button
	 */
	actionIcon: {
		type: String,
		default: "",
	},
	/**
	 * Size variant
	 * @type {'sm' | 'md' | 'lg'}
	 */
	size: {
		type: String,
		default: "md",
		validator: (value) => ["sm", "md", "lg"].includes(value),
	},
	/**
	 * Color variant for icon
	 * @type {'primary' | 'secondary' | 'gray' | 'red' | 'green'}
	 */
	variant: {
		type: String,
		default: "gray",
		validator: (value) =>
			["primary", "secondary", "gray", "red", "green"].includes(value),
	},
	/**
	 * Center vertically in container
	 */
	centered: {
		type: Boolean,
		default: true,
	},
});

const emit = defineEmits(["action"]);

const containerClass = computed(() => ({
	[`empty-state-${props.size}`]: true,
	"empty-state-centered": props.centered,
}));

const iconColorClass = computed(() => {
	const colors = {
		primary: "text-[#0D65AE] bg-[#0D65AE]/10 border-[#0D65AE]/20",
		secondary: "text-indigo-600 bg-indigo-50 border-indigo-200",
		gray: "text-gray-400 bg-gray-50 border-gray-200",
		red: "text-red-600 bg-red-50 border-red-200",
		green: "text-green-600 bg-green-50 border-green-200",
	};
	return colors[props.variant] || colors.gray;
});

const buttonClass = computed(() => {
	const variants = {
		primary:
			"bg-[#0D65AE] text-white hover:bg-[#0D65AE]/90 border-[#0D65AE]",
		secondary:
			"bg-indigo-600 text-white hover:bg-indigo-700 border-indigo-600",
		gray: "bg-gray-600 text-white hover:bg-gray-700 border-gray-600",
		red: "bg-red-600 text-white hover:bg-red-700 border-red-600",
		green: "bg-green-600 text-white hover:bg-green-700 border-green-600",
	};
	return variants[props.variant] || variants.primary;
});

function handleAction() {
	emit("action");
}
</script>

<style scoped>
.empty-state {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 2rem 1rem;
}

.empty-state-centered {
	min-height: 400px;
}

.empty-state-content {
	max-width: 28rem;
	text-align: center;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1rem;
}

/* Visual (icon or image) */
.empty-state-visual {
	margin-bottom: 0.5rem;
}

.empty-state-icon {
	width: 6rem;
	height: 6rem;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	border: 2px solid;
	margin: 0 auto;
}

.empty-state-icon .icon {
	font-size: 2.5rem;
}

.empty-state-image {
	max-width: 16rem;
	height: auto;
	opacity: 0.8;
}

/* Text */
.empty-state-title {
	font-size: 1.25rem;
	font-weight: 600;
	color: #111827;
	margin: 0;
}

.empty-state-description {
	font-size: 0.875rem;
	color: #6b7280;
	margin: 0;
	line-height: 1.5;
}

/* Actions */
.empty-state-actions {
	margin-top: 0.5rem;
}

.empty-state-secondary {
	margin-top: 0.5rem;
	color: #6b7280;
	font-size: 0.875rem;
}

.empty-state-button {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
	padding: 0.625rem 1.5rem;
	font-weight: 500;
	border-radius: 0.5rem;
	border: 1px solid;
	transition: all 0.2s;
	cursor: pointer;
	font-size: 0.875rem;
}

.empty-state-button:hover {
	transform: translateY(-1px);
	box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.empty-state-button:active {
	transform: translateY(0);
}

/* Size variants */
.empty-state-sm .empty-state-icon {
	width: 4rem;
	height: 4rem;
}

.empty-state-sm .empty-state-icon .icon {
	font-size: 1.75rem;
}

.empty-state-sm .empty-state-icon svg {
	width: 2.5rem;
	height: 2.5rem;
}

.empty-state-sm .empty-state-title {
	font-size: 1rem;
}

.empty-state-sm .empty-state-description {
	font-size: 0.8125rem;
}

.empty-state-lg .empty-state-icon {
	width: 8rem;
	height: 8rem;
}

.empty-state-lg .empty-state-icon .icon {
	font-size: 3.5rem;
}

.empty-state-lg .empty-state-icon svg {
	width: 5rem;
	height: 5rem;
}

.empty-state-lg .empty-state-title {
	font-size: 1.5rem;
}

.empty-state-lg .empty-state-description {
	font-size: 1rem;
}
</style>
