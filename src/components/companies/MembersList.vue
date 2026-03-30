<template>
	<div class="members-list">
		<!-- Header -->
		<div class="flex items-center justify-between mb-6">
			<div>
				<h3 class="text-lg font-semibold text-gray-900">
					Team Members
				</h3>
				<p class="text-sm text-gray-600 mt-1">
					{{ membersCount }}
					{{ membersCount === 1 ? "member" : "members" }}
				</p>
			</div>
			<button
				v-if="canAddMembers"
				@click="showAddDialog = true"
				class="px-4 py-2 bg-[#0D65AE] text-white rounded-lg hover:bg-[#0a4f87] transition-colors flex items-center gap-2"
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
						d="M12 6v6m0 0v6m0-6h6m-6 0H6"
					/>
				</svg>
				Add Member
			</button>
		</div>

		<!-- Loading State -->
		<div v-if="loading" class="flex items-center justify-center py-8">
			<div
				class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0D65AE]"
			></div>
		</div>

		<!-- Empty State -->
		<div
			v-else-if="!loading && members.length === 0"
			class="text-center py-8"
		>
			<svg
				class="w-16 h-16 text-gray-400 mx-auto mb-4"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
				/>
			</svg>
			<h3 class="text-lg font-semibold text-gray-900 mb-2">
				No members yet
			</h3>
			<p class="text-gray-600">
				Add your first team member to get started
			</p>
		</div>

		<!-- Members List -->
		<div v-else class="space-y-3">
			<div
				v-for="member in members"
				:key="member.id"
				class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
			>
				<div class="flex items-center justify-between">
					<!-- Member Info -->
					<div class="flex items-center gap-4 flex-1">
						<!-- Avatar -->
						<div class="flex-shrink-0">
							<div
								class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg"
							>
								{{ getInitials(member) }}
							</div>
						</div>

						<!-- Details -->
						<div class="flex-1 min-w-0">
							<div class="flex items-center gap-2">
								<h4
									class="text-base font-medium text-gray-900 truncate"
								>
									{{
										member.user_name ||
										member.name ||
										member.user?.name ||
										"Unknown"
									}}
								</h4>
								<span
									v-if="member.role_in_company || member.role"
									class="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800"
								>
									{{
										formatRole(
											member.role_in_company ||
												member.role,
										)
									}}
								</span>
							</div>

							<div class="mt-1 space-y-1">
								<p
									v-if="
										member.user_email ||
										member.email ||
										member.user?.email
									"
									class="text-sm text-gray-600 flex items-center gap-1"
								>
									<i class="pi pi-envelope text-xs"></i>
									{{
										member.user_email ||
										member.email ||
										member.user?.email
									}}
								</p>
								<p
									v-if="
										member.user_phone ||
										member.phone ||
										member.user?.phone
									"
									class="text-sm text-gray-600 flex items-center gap-1"
								>
									<i class="pi pi-phone text-xs"></i>
									{{
										member.user_phone ||
										member.phone ||
										member.user?.phone
									}}
								</p>
							</div>

							<!-- Member Status -->
							<div class="mt-2">
								<span
									:class="getStatusClass(member.status)"
									class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
								>
									<span
										class="w-1.5 h-1.5 rounded-full mr-1.5"
										:class="
											getStatusDotClass(member.status)
										"
									></span>
									{{ formatStatus(member.status) }}
								</span>
							</div>
						</div>
					</div>

					<!-- Actions -->
					<div
						v-if="canManageMembers"
						class="flex items-center gap-2 ml-4"
					>
						<button
							@click="startEditMember(member)"
							class="p-2 text-gray-600 hover:text-[#0D65AE] hover:bg-gray-100 rounded-lg transition-colors"
							title="Edit member"
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
									d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
								/>
							</svg>
						</button>
						<button
							@click="confirmRemoveMember(member)"
							class="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
							title="Remove member"
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
									d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
								/>
							</svg>
						</button>
					</div>
				</div>

				<!-- Additional Info (if available) -->
				<div
					v-if="member.joined_at || member.created_at"
					class="mt-3 pt-3 border-t border-gray-100"
				>
					<p class="text-xs text-gray-500">
						Joined
						{{ formatDate(member.joined_at || member.created_at) }}
					</p>
				</div>
			</div>
		</div>

		<!-- Pagination (if needed) -->
		<div
			v-if="showPagination && totalPages > 1"
			class="mt-6 flex justify-center"
		>
			<Paginator
				:rows="pageSize"
				:totalRecords="totalRecords"
				:first="(currentPage - 1) * pageSize"
				@page="handlePageChange"
			/>
		</div>

		<!-- Add Member Dialog -->
		<Dialog
			v-model:visible="showAddDialog"
			:modal="true"
			:draggable="false"
			:style="{ width: '90vw', maxWidth: '500px' }"
			:pt="{
				root: { class: 'rounded-xl shadow-2xl' },
				header: { class: 'border-b border-gray-200 px-6 py-4' },
				content: { class: 'px-6 py-4' },
				footer: { class: 'border-t border-gray-200 px-6 py-4' },
			}"
		>
			<template #header>
				<div class="flex items-center gap-3">
					<div
						class="w-10 h-10 rounded-full bg-[#0D65AE] bg-opacity-10 flex items-center justify-center"
					>
						<svg
							class="w-5 h-5 text-[#0D65AE]"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
							/>
						</svg>
					</div>
					<div>
						<h3 class="text-lg font-semibold text-gray-900">
							Add Team Member
						</h3>
						<p class="text-sm text-gray-500">
							Invite a new member to your company
						</p>
					</div>
				</div>
			</template>

			<form @submit.prevent="handleAddMember" class="space-y-5 py-2">
				<div>
					<label
						class="block text-sm font-semibold text-gray-900 mb-2"
					>
						User *
					</label>
					<AutoComplete
						v-model="addForm.userId"
						:suggestions="filteredUsers"
						@complete="searchUsers"
						optionLabel="name"
						placeholder="Search by name, email or ID"
						:loading="loadingUsers"
						class="w-full"
					>
						<template #option="slotProps">
							<div class="autocomplete-user-option">
								<div class="user-avatar">
									<span>
										{{
											slotProps.option.name
												?.charAt(0)
												.toUpperCase() || "?"
										}}
									</span>
								</div>
								<div class="user-info">
									<div class="user-name">
										{{ slotProps.option.name }}
									</div>
									<div class="user-email">
										{{ slotProps.option.email }}
									</div>
								</div>
								<div class="user-id">
									ID: {{ slotProps.option.id }}
								</div>
							</div>
						</template>
						<template #empty>
							<div class="custom-empty-message">
								<div class="empty-text">No users found</div>
							</div>
						</template>
					</AutoComplete>
					<p
						class="text-xs text-gray-500 mt-1.5 flex items-center gap-1"
					>
						<svg
							class="w-3.5 h-3.5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						Search and select a user to add as a member
					</p>
				</div>

				<div>
					<label
						class="block text-sm font-semibold text-gray-900 mb-2"
					>
						Role *
					</label>
					<Select
						v-model="addForm.role"
						:options="roles"
						optionLabel="name"
						placeholder="Select a role"
						:loading="loadingRoles"
						class="w-full"
					>
						<template #option="slotProps">
							<div class="select-role-option">
								<svg
									class="role-icon"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
									/>
								</svg>
								<span class="role-name">{{
									slotProps.option.name
								}}</span>
							</div>
						</template>
						<template #empty>
							<div class="custom-empty-message">
								<div class="empty-text">No roles available</div>
							</div>
						</template>
					</Select>
					<p
						class="text-xs text-gray-500 mt-1.5 flex items-center gap-1"
					>
						<svg
							class="w-3.5 h-3.5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						Select the role for this member
					</p>
				</div>

				<div class="flex justify-end gap-3 pt-2">
					<button
						type="button"
						@click="showAddDialog = false"
						:disabled="adding"
						class="px-4 py-2.5 text-sm font-medium border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
					>
						Cancel
					</button>
					<button
						type="submit"
						:disabled="adding"
						class="px-4 py-2.5 text-sm font-medium bg-[#0D65AE] text-white rounded-lg hover:bg-[#0a4f87] focus:ring-2 focus:ring-[#0D65AE] focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
					>
						<svg
							v-if="adding"
							class="animate-spin w-4 h-4"
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
						{{ adding ? "Adding..." : "Add Member" }}
					</button>
				</div>
			</form>
		</Dialog>

		<!-- Edit Member Dialog -->
		<Dialog
			v-model:visible="showEditDialog"
			:modal="true"
			:draggable="false"
			:style="{ width: '90vw', maxWidth: '500px' }"
			:pt="{
				root: { class: 'rounded-xl shadow-2xl' },
				header: { class: 'border-b border-gray-200 px-6 py-4' },
				content: { class: 'px-6 py-4' },
				footer: { class: 'border-t border-gray-200 px-6 py-4' },
			}"
		>
			<template #header>
				<div class="flex items-center gap-3">
					<div
						class="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center"
					>
						<svg
							class="w-5 h-5 text-blue-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
							/>
						</svg>
					</div>
					<div>
						<h3 class="text-lg font-semibold text-gray-900">
							Edit Team Member
						</h3>
						<p class="text-sm text-gray-500">
							Update member information
						</p>
					</div>
				</div>
			</template>

			<form @submit.prevent="handleEditMember" class="space-y-5 py-2">
				<div>
					<label
						class="block text-sm font-semibold text-gray-900 mb-2"
					>
						Role *
					</label>
					<Select
						v-model="editForm.role"
						:options="roles"
						optionLabel="name"
						placeholder="Select a role"
						:loading="loadingRoles"
						class="w-full"
					>
						<template #option="slotProps">
							<div class="select-role-option">
								<svg
									class="role-icon"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
									/>
								</svg>
								<span class="role-name">{{
									slotProps.option.name
								}}</span>
							</div>
						</template>
						<template #empty>
							<div class="custom-empty-message">
								<div class="empty-text">No roles available</div>
							</div>
						</template>
					</Select>
					<p
						class="text-xs text-gray-500 mt-1.5 flex items-center gap-1"
					>
						<svg
							class="w-3.5 h-3.5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						Update the role for this member
					</p>
				</div>

				<div class="flex justify-end gap-3 pt-2">
					<button
						type="button"
						@click="showEditDialog = false"
						:disabled="editing"
						class="px-4 py-2.5 text-sm font-medium border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
					>
						Cancel
					</button>
					<button
						type="submit"
						:disabled="editing"
						class="px-4 py-2.5 text-sm font-medium bg-[#0D65AE] text-white rounded-lg hover:bg-[#0a4f87] focus:ring-2 focus:ring-[#0D65AE] focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
					>
						<svg
							v-if="editing"
							class="animate-spin w-4 h-4"
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
						{{ editing ? "Saving..." : "Save Changes" }}
					</button>
				</div>
			</form>
		</Dialog>

		<!-- Remove Member Confirmation Dialog -->
		<Dialog
			v-model:visible="showRemoveDialog"
			:modal="true"
			:draggable="false"
			:style="{ width: '90vw', maxWidth: '480px' }"
			:pt="{
				root: { class: 'rounded-xl shadow-2xl' },
				header: { class: 'border-b border-gray-200 px-6 py-4' },
				content: { class: 'px-6 py-5' },
				footer: { class: 'border-t border-gray-200 px-6 py-4' },
			}"
		>
			<template #header>
				<div class="flex items-center gap-3">
					<div
						class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center"
					>
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
								d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
							/>
						</svg>
					</div>
					<div>
						<h3 class="text-lg font-semibold text-gray-900">
							Remove Team Member
						</h3>
						<p class="text-sm text-gray-500">
							This action cannot be undone
						</p>
					</div>
				</div>
			</template>

			<div class="py-2">
				<div class="bg-red-50 border border-red-100 rounded-lg p-4">
					<p class="text-sm text-gray-700 leading-relaxed">
						Are you sure you want to remove
						<strong class="text-gray-900 font-semibold">{{
							memberToRemove?.user_name ||
							memberToRemove?.name ||
							memberToRemove?.user?.name ||
							"this member"
						}}</strong>
						from the company?
					</p>
					<p class="text-sm text-red-600 mt-2 flex items-start gap-2">
						<svg
							class="w-4 h-4 mt-0.5 flex-shrink-0"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
							/>
						</svg>
						<span
							>This will permanently remove their access and
							cannot be undone.</span
						>
					</p>
				</div>

				<div class="flex justify-end gap-3 pt-5">
					<button
						type="button"
						@click="showRemoveDialog = false"
						:disabled="removing"
						class="px-4 py-2.5 text-sm font-medium border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
					>
						Cancel
					</button>
					<button
						@click="handleRemoveMember"
						:disabled="removing"
						class="px-4 py-2.5 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
					>
						<svg
							v-if="removing"
							class="animate-spin w-4 h-4"
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
						{{ removing ? "Removing..." : "Remove Member" }}
					</button>
				</div>
			</div>
		</Dialog>
	</div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import Dialog from "primevue/dialog";
import Paginator from "primevue/paginator";
import AutoComplete from "primevue/autocomplete";
import Select from "primevue/select";
import { useCompanies, useToast } from "@/composables";
import { formatDate } from "@/utils/formatters";
import * as usersApi from "@/api/users.api";
import * as rolesApi from "@/api/roles.api";

const { addCompanyMember, updateCompanyMember, removeCompanyMember } =
	useCompanies();
const { showToast } = useToast();

const props = defineProps({
	companyId: {
		type: Number,
		required: true,
	},
	members: {
		type: Array,
		default: () => [],
	},
	loading: {
		type: Boolean,
		default: false,
	},
	canAddMembers: {
		type: Boolean,
		default: true,
	},
	canManageMembers: {
		type: Boolean,
		default: true,
	},
	showPagination: {
		type: Boolean,
		default: false,
	},
	currentPage: {
		type: Number,
		default: 1,
	},
	pageSize: {
		type: Number,
		default: 20,
	},
	totalRecords: {
		type: Number,
		default: 0,
	},
});

const emit = defineEmits(["refresh", "page-change"]);

// Dialog states
const showAddDialog = ref(false);
const showEditDialog = ref(false);
const showRemoveDialog = ref(false);
const adding = ref(false);
const editing = ref(false);
const removing = ref(false);

// Form data
const addForm = ref({
	userId: null,
	role: null,
});

// Data for dropdowns
const users = ref([]);
const roles = ref([]);
const filteredUsers = ref([]);
const loadingUsers = ref(false);
const loadingRoles = ref(false);

const editForm = ref({
	role: null,
});

const memberToEdit = ref(null);
const memberToRemove = ref(null);

// Computed
const membersCount = computed(() => {
	return props.totalRecords || props.members.length;
});

const totalPages = computed(() => {
	return Math.ceil(props.totalRecords / props.pageSize);
});

// Lifecycle
onMounted(async () => {
	await loadRoles();
	await loadUsers();
});

// Methods
const loadUsers = async () => {
	loadingUsers.value = true;
	try {
		const response = await usersApi.getAllUsers();
		users.value = response.data || response || [];
	} catch (error) {
		showToast("error", "Error", "Failed to load users");
		console.error("Error loading users:", error);
	} finally {
		loadingUsers.value = false;
	}
};

const loadRoles = async () => {
	loadingRoles.value = true;
	try {
		const response = await rolesApi.getCompanyRoles();
		roles.value = response.data || response || [];
	} catch (error) {
		showToast("error", "Error", "Failed to load roles");
		console.error("Error loading roles:", error);
	} finally {
		loadingRoles.value = false;
	}
};

const searchUsers = (event) => {
	const query = event.query.toLowerCase();
	if (!query) {
		filteredUsers.value = users.value;
	} else {
		filteredUsers.value = users.value.filter(
			(user) =>
				user.name?.toLowerCase().includes(query) ||
				user.email?.toLowerCase().includes(query) ||
				user.id?.toString().includes(query),
		);
	}
};

const getInitials = (member) => {
	const name =
		member.user_name ||
		member.name ||
		member.user?.name ||
		member.user_email ||
		member.email ||
		"U";
	const parts = name.split(" ");

	if (parts.length >= 2) {
		return (parts[0][0] + parts[1][0]).toUpperCase();
	}

	return name.substring(0, 2).toUpperCase();
};

const formatRole = (role) => {
	if (!role) return "Member";

	// Convert snake_case or camelCase to Title Case
	return role
		.replace(/_/g, " ")
		.replace(/([A-Z])/g, " $1")
		.trim()
		.split(" ")
		.map(
			(word) =>
				word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
		)
		.join(" ");
};

const formatStatus = (status) => {
	if (!status) return "Active";
	return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
};

const getStatusClass = (status) => {
	const normalizedStatus = (status || "active").toLowerCase();

	switch (normalizedStatus) {
		case "active":
			return "bg-green-100 text-green-800";
		case "inactive":
			return "bg-gray-100 text-gray-800";
		case "pending":
			return "bg-yellow-100 text-yellow-800";
		case "suspended":
			return "bg-red-100 text-red-800";
		default:
			return "bg-gray-100 text-gray-800";
	}
};

const getStatusDotClass = (status) => {
	const normalizedStatus = (status || "active").toLowerCase();

	switch (normalizedStatus) {
		case "active":
			return "bg-green-600";
		case "inactive":
			return "bg-gray-600";
		case "pending":
			return "bg-yellow-600";
		case "suspended":
			return "bg-red-600";
		default:
			return "bg-gray-600";
	}
};

// Event handlers
const handleAddMember = async () => {
	if (!addForm.value.userId) {
		showToast("error", "Validation Error", "Please select a user");
		return;
	}

	if (!addForm.value.role) {
		showToast("error", "Validation Error", "Please select a role");
		return;
	}

	adding.value = true;

	// Extract the user ID from the user object
	const userId =
		typeof addForm.value.userId === "object"
			? addForm.value.userId.id
			: addForm.value.userId;

	// Extract the role name from the role object
	const roleName =
		typeof addForm.value.role === "object"
			? addForm.value.role.name
			: addForm.value.role;

	const result = await addCompanyMember(props.companyId, {
		userId: userId,
		role: roleName,
	});

	if (result.success) {
		showAddDialog.value = false;
		emit("refresh");
		addForm.value = { userId: null, role: null };
	}

	adding.value = false;
};

const startEditMember = (member) => {
	memberToEdit.value = member;
	// Find the role object that matches the member's current role
	const currentRoleName = member.role_in_company || member.role || "";
	const matchingRole = roles.value.find((r) => r.name === currentRoleName);
	editForm.value = {
		role: matchingRole || null,
	};
	showEditDialog.value = true;
};

const handleEditMember = async () => {
	if (!memberToEdit.value) return;

	if (!editForm.value.role) {
		showToast("error", "Validation Error", "Please select a role");
		return;
	}

	editing.value = true;
	const userId =
		memberToEdit.value.user_id ||
		memberToEdit.value.userId ||
		memberToEdit.value.id;

	// Extract the role name from the role object
	const roleName =
		typeof editForm.value.role === "object"
			? editForm.value.role.name
			: editForm.value.role;

	const result = await updateCompanyMember(props.companyId, userId, {
		role: roleName,
	});

	if (result.success) {
		showEditDialog.value = false;
		memberToEdit.value = null;
		editForm.value = { role: null };
		emit("refresh");
	}
	editing.value = false;
};

const confirmRemoveMember = (member) => {
	memberToRemove.value = member;
	showRemoveDialog.value = true;
};

const handleRemoveMember = async () => {
	if (!memberToRemove.value) return;

	removing.value = true;
	const userId =
		memberToRemove.value.user_id ||
		memberToRemove.value.userId ||
		memberToRemove.value.id;
	const result = await removeCompanyMember(props.companyId, userId);

	if (result.success) {
		showRemoveDialog.value = false;
		memberToRemove.value = null;
		emit("refresh");
	}
	removing.value = false;
};

const handlePageChange = (event) => {
	const newPage = Math.floor(event.first / props.pageSize) + 1;
	emit("page-change", newPage);
};
</script>

<style scoped>
/* PrimeVue AutoComplete Custom Styles */
:deep(.p-autocomplete) {
	width: 100%;
	position: relative;
}

:deep(.p-autocomplete-input) {
	width: 100%;
	padding: 0.625rem 1rem;
	border: 1px solid #e5e7eb;
	border-radius: 0.5rem;
	font-size: 0.875rem;
	background: white;
	color: #111827;
	transition: all 0.15s ease-in-out;
	line-height: 1.25rem;
}

:deep(.p-autocomplete-input::placeholder) {
	color: #9ca3af;
}

:deep(.p-autocomplete-input:hover) {
	border-color: #d1d5db;
}

:deep(.p-autocomplete-input:focus) {
	border-color: #0d65ae;
	outline: none;
	box-shadow: 0 0 0 3px rgba(13, 101, 174, 0.1);
}

:deep(.p-autocomplete-loader) {
	position: absolute;
	right: 1rem;
	top: 50%;
	transform: translateY(-50%);
	color: #0d65ae;
	animation: spin 1s linear infinite;
}

:deep(.p-autocomplete-panel) {
	background: white;
	border: 1px solid #e5e7eb;
	border-radius: 0.75rem;
	box-shadow:
		0 20px 25px -5px rgba(0, 0, 0, 0.1),
		0 10px 10px -5px rgba(0, 0, 0, 0.04);
	margin-top: 0.5rem;
	overflow: hidden;
}

:deep(.p-autocomplete-list-container) {
	max-height: 320px;
	overflow-y: auto;
}

:deep(.p-autocomplete-list) {
	padding: 0.5rem;
	list-style: none;
	margin: 0;
}

:deep(.p-autocomplete-item) {
	padding: 0;
	cursor: pointer;
	transition: all 0.2s ease-in-out;
	border-radius: 0.5rem;
	margin: 0.25rem 0;
	overflow: hidden;
}

:deep(.p-autocomplete-item:hover) {
	background-color: #f9fafb;
	transform: translateX(2px);
}

:deep(.p-autocomplete-item.p-focus) {
	background-color: #f3f4f6;
	outline: none;
}

:deep(.p-autocomplete-item.p-autocomplete-item-selected) {
	background-color: #eff6ff;
	border-left: 3px solid #0d65ae;
}

:deep(.p-autocomplete-item.p-autocomplete-item-selected:hover) {
	background-color: #dbeafe;
}

/* Custom Empty Message Styling */
.custom-empty-message {
	padding: 1.25rem 1rem;
	display: flex;
	align-items: center;
	justify-content: center;
	text-align: center;
}

.empty-text {
	color: #9ca3af;
	font-size: 0.8125rem;
	font-weight: 500;
	line-height: 1.5;
}

/* Custom AutoComplete User Option Styling */
.autocomplete-user-option {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	padding: 0.75rem 1rem;
}

.user-avatar {
	width: 2.5rem;
	height: 2.5rem;
	border-radius: 9999px;
	background: linear-gradient(135deg, #0d65ae 0%, #0a4f87 100%);
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	box-shadow: 0 2px 4px rgba(13, 101, 174, 0.2);
}

.user-avatar span {
	color: white;
	font-size: 0.875rem;
	font-weight: 600;
	letter-spacing: 0.025em;
}

.user-info {
	flex: 1;
	min-width: 0;
	display: flex;
	flex-direction: column;
	gap: 0.125rem;
}

.user-name {
	font-size: 0.875rem;
	font-weight: 500;
	color: #111827;
	line-height: 1.25rem;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.user-email {
	font-size: 0.75rem;
	color: #6b7280;
	line-height: 1rem;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.user-id {
	font-size: 0.75rem;
	color: #9ca3af;
	font-weight: 500;
	background: #f3f4f6;
	padding: 0.25rem 0.5rem;
	border-radius: 0.375rem;
	flex-shrink: 0;
}

:deep(.p-autocomplete-item:hover) .user-avatar {
	box-shadow: 0 4px 6px rgba(13, 101, 174, 0.3);
	transform: scale(1.05);
}

:deep(.p-autocomplete-item.p-autocomplete-item-selected) .user-name {
	color: #0d65ae;
	font-weight: 600;
}

/* PrimeVue Select Custom Styles */
:deep(.p-select) {
	width: 100%;
	display: flex;
	position: relative;
}

:deep(.p-select-dropdown) {
	background: white;
	border: 1px solid #e5e7eb;
	border-left: none;
	border-radius: 0 0.5rem 0.5rem 0;
	width: 2.5rem;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #6b7280;
	transition: all 0.15s ease-in-out;
	position: absolute;
	right: 0;
	top: 0;
	bottom: 0;
	pointer-events: none;
}

:deep(.p-select-dropdown .p-icon) {
	width: 1rem;
	height: 1rem;
}

:deep(.p-select:not(.p-disabled):hover .p-select-dropdown) {
	color: #374151;
}

:deep(.p-select.p-focus .p-select-dropdown) {
	border-color: #0d65ae;
	color: #0d65ae;
}

:deep(.p-select-label) {
	width: 100%;
	padding: 0.625rem 2.75rem 0.625rem 1rem;
	border: 1px solid #e5e7eb;
	border-radius: 0.5rem;
	font-size: 0.875rem;
	background: white;
	color: #111827;
	transition: all 0.15s ease-in-out;
	cursor: pointer;
	line-height: 1.25rem;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

:deep(.p-select-label.p-placeholder) {
	color: #9ca3af;
}

:deep(.p-select:not(.p-disabled):hover .p-select-label) {
	border-color: #d1d5db;
}

:deep(.p-select:not(.p-disabled).p-focus .p-select-label) {
	border-color: #0d65ae;
	outline: none;
	box-shadow: 0 0 0 3px rgba(13, 101, 174, 0.1);
}

:deep(.p-select-overlay) {
	background: white;
	border: 1px solid #e5e7eb;
	border-radius: 0.75rem;
	box-shadow:
		0 20px 25px -5px rgba(0, 0, 0, 0.1),
		0 10px 10px -5px rgba(0, 0, 0, 0.04);
	margin-top: 0.5rem;
	overflow: hidden;
}

:deep(.p-select-list-container) {
	max-height: 280px;
	overflow-y: auto;
}

:deep(.p-select-list) {
	padding: 0.5rem;
	list-style: none;
	margin: 0;
}

:deep(.p-select-option) {
	padding: 0;
	cursor: pointer;
	transition: all 0.2s ease-in-out;
	border-radius: 0.5rem;
	margin: 0.25rem 0;
	overflow: hidden;
}

:deep(.p-select-option:hover) {
	background-color: #f9fafb;
	transform: translateX(2px);
}

:deep(.p-select-option.p-focus) {
	background-color: #f3f4f6;
	outline: none;
}

:deep(.p-select-option.p-select-option-selected) {
	background-color: #eff6ff;
	border-left: 3px solid #0d65ae;
}

:deep(.p-select-option.p-select-option-selected:hover) {
	background-color: #dbeafe;
}

/* Custom Select Role Option Styling */
.select-role-option {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	padding: 0.875rem 1rem;
}

.role-icon {
	width: 1.25rem;
	height: 1.25rem;
	color: #0d65ae;
	flex-shrink: 0;
	stroke-width: 2;
}

.role-name {
	font-size: 0.875rem;
	font-weight: 500;
	color: #374151;
	line-height: 1.25rem;
}

:deep(.p-select-option:hover) .role-icon {
	transform: scale(1.1);
}

:deep(.p-select-option.p-select-option-selected) .role-name {
	color: #0d65ae;
	font-weight: 600;
}

:deep(.p-select-option.p-select-option-selected) .role-icon {
	color: #0d65ae;
	filter: drop-shadow(0 0 2px rgba(13, 101, 174, 0.3));
}

:deep(.p-select-loading-icon) {
	color: #0d65ae;
	animation: spin 1s linear infinite;
}

@keyframes spin {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
}

/* Custom Scrollbar Styling for Dropdowns */
:deep(.p-autocomplete-list-container::-webkit-scrollbar),
:deep(.p-select-list-container::-webkit-scrollbar) {
	width: 8px;
}

:deep(.p-autocomplete-list-container::-webkit-scrollbar-track),
:deep(.p-select-list-container::-webkit-scrollbar-track) {
	background: #f9fafb;
	border-radius: 0.5rem;
}

:deep(.p-autocomplete-list-container::-webkit-scrollbar-thumb),
:deep(.p-select-list-container::-webkit-scrollbar-thumb) {
	background: #d1d5db;
	border-radius: 0.5rem;
	border: 2px solid #f9fafb;
}

:deep(.p-autocomplete-list-container::-webkit-scrollbar-thumb:hover),
:deep(.p-select-list-container::-webkit-scrollbar-thumb:hover) {
	background: #9ca3af;
}

/* Firefox Scrollbar */
:deep(.p-autocomplete-list-container),
:deep(.p-select-list-container) {
	scrollbar-width: thin;
	scrollbar-color: #d1d5db #f9fafb;
}
</style>
