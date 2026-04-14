<template>
	<div>
		<!-- Header -->
		<div class="flex items-center justify-between mb-6">
			<div>
				<h3 class="text-lg font-semibold text-gray-900">Pending Invitations</h3>
				<p class="text-sm text-gray-500 mt-0.5">
					{{ invitations.length }} pending invitation{{ invitations.length !== 1 ? 's' : '' }}
				</p>
			</div>
		</div>

		<!-- Loading -->
		<div v-if="loading" class="flex justify-center py-8">
			<div class="flex items-center gap-3 text-gray-500">
				<svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
					<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
				</svg>
				<span class="text-sm font-medium">Loading invitations...</span>
			</div>
		</div>

		<!-- Empty State -->
		<div
			v-else-if="!invitations.length"
			class="flex flex-col items-center justify-center py-12 text-center"
		>
			<div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
				<svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
						d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
				</svg>
			</div>
			<h4 class="text-base font-semibold text-gray-900 mb-1">No pending invitations</h4>
			<p class="text-sm text-gray-500 max-w-sm">
				All invitations have been accepted or there are no pending invitations at this time.
			</p>
		</div>

		<!-- Invitations List -->
		<div v-else class="space-y-3">
			<div
				v-for="invitation in invitations"
				:key="invitation.id"
				class="flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-white hover:border-gray-300 transition-colors"
			>
				<div class="flex items-center gap-4">
					<!-- Avatar -->
					<div class="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
						<svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
								d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
						</svg>
					</div>

					<!-- Info -->
					<div>
						<p class="text-sm font-semibold text-gray-900">
							{{ invitation.email || invitation.user?.email || 'Unknown' }}
						</p>
						<div class="flex items-center gap-3 mt-0.5">
							<span class="text-xs text-gray-500">
								Role: <span class="font-medium text-gray-700 capitalize">{{ invitation.role_in_company || invitation.role || 'employee' }}</span>
							</span>
							<span v-if="invitation.created_at" class="text-xs text-gray-400">
								· Sent {{ formatDate(invitation.created_at) }}
							</span>
						</div>
					</div>
				</div>

				<!-- Status + Action -->
				<div class="flex items-center gap-3">
					<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
						<span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
						Pending
					</span>
					<button
						v-if="canManage"
						@click="openCancelDialog(invitation)"
						class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
					>
						<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
						</svg>
						Cancel
					</button>
				</div>
			</div>
		</div>

		<!-- Cancel Confirmation Dialog -->
		<Dialog
			v-model:visible="showCancelDialog"
			:style="{ width: '420px', maxWidth: '95vw' }"
			:modal="true"
			:closable="true"
			:pt="{
				root: { class: 'rounded-2xl shadow-xl border border-gray-200 overflow-hidden' },
				header: { class: 'px-6 pt-6 pb-0 bg-white' },
				content: { class: 'px-6 pb-0 bg-white' },
				footer: { class: 'px-6 pb-6 bg-white' },
			}"
		>
			<template #header>
				<div class="flex items-center gap-4">
					<div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
						<svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
								d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
						</svg>
					</div>
					<div>
						<h3 class="text-lg font-semibold text-gray-900">Cancel Invitation</h3>
						<p class="text-sm text-gray-500">This action cannot be undone</p>
					</div>
				</div>
			</template>

			<div class="py-4">
				<p class="text-sm text-gray-700">
					Are you sure you want to cancel the invitation sent to
					<strong class="text-gray-900">{{ invitationToCancel?.email || invitationToCancel?.user?.email }}</strong>?
				</p>
				<p class="mt-2 flex items-center gap-2 text-xs text-gray-500">
					<svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
							d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
					They will no longer be able to join using this invitation.
				</p>
			</div>

			<div class="flex justify-end gap-3 pt-2 pb-1">
				<button
					@click="showCancelDialog = false"
					class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
				>
					Keep Invitation
				</button>
				<button
					@click="handleCancelInvitation"
					:disabled="cancelling"
					class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
				>
					<svg v-if="cancelling" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
						<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
					</svg>
					<span>{{ cancelling ? 'Cancelling...' : 'Cancel Invitation' }}</span>
				</button>
			</div>
		</Dialog>
	</div>
</template>

<script setup>
import { ref } from 'vue';
import Dialog from 'primevue/dialog';
import { cancelMyCompanyInvitation } from '@/api/companies.api';
import { useToast } from '@/composables/useToast';

const props = defineProps({
	invitations: {
		type: Array,
		default: () => [],
	},
	loading: {
		type: Boolean,
		default: false,
	},
	canManage: {
		type: Boolean,
		default: false,
	},
});

const emit = defineEmits(['refresh']);

const toast = useToast();

const showCancelDialog = ref(false);
const invitationToCancel = ref(null);
const cancelling = ref(false);

function openCancelDialog(invitation) {
	invitationToCancel.value = invitation;
	showCancelDialog.value = true;
}

async function handleCancelInvitation() {
	if (!invitationToCancel.value) return;
	cancelling.value = true;
	try {
		const response = await cancelMyCompanyInvitation(invitationToCancel.value.id);
		if (response.success !== false) {
			toast.showSuccess('Invitation cancelled successfully!');
			showCancelDialog.value = false;
			invitationToCancel.value = null;
			emit('refresh');
		} else {
			toast.showError(response.message || 'Failed to cancel invitation.');
		}
	} catch (err) {
		toast.showError(err?.message || 'Failed to cancel invitation.');
	} finally {
		cancelling.value = false;
	}
}

function formatDate(dateStr) {
	if (!dateStr) return '';
	const d = new Date(dateStr);
	return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}
</script>
