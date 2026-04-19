<template>
	<div class="space-y-2">
		<label v-if="label" :class="labelClass">
			{{ label }}
			<span v-if="required" class="text-red-500 ml-0.5">*</span>
		</label>
		<AddressAutocomplete
			:model-value="modelValue"
			:placeholder="placeholder"
			:disabled="disabled"
			:required="required"
			:near="near"
			:limit="limit"
			@update:model-value="$emit('update:modelValue', $event)"
			@select="$emit('select', $event)"
		/>
	</div>
</template>

<script setup>
import AddressAutocomplete from "@/components/common/AddressAutocomplete.vue";

defineProps({
	modelValue: { type: String, default: "" },
	/** Visible label; omit for unlabeled usage (parent supplies label). */
	label: { type: String, default: "" },
	labelClass: {
		type: String,
		default:
			"block text-sm font-semibold text-gray-900 mb-2",
	},
	placeholder: { type: String, default: "Search for an address…" },
	disabled: { type: Boolean, default: false },
	required: { type: Boolean, default: false },
	near: { type: String, default: null },
	limit: { type: Number, default: 5 },
});

defineEmits(["update:modelValue", "select"]);
</script>
