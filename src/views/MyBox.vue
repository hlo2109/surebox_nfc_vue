<template>
	<div class="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
		<!-- Header Section -->
		<div class="max-w-7xl mx-auto">
			<div
				class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
			>
				<div>
					<h1
						class="text-3xl sm:text-4xl font-bold text-gray-900 mb-2"
					>
						My Boxes
					</h1>
					<p class="text-gray-600 flex items-center gap-2">
						<svg
							class="w-4 h-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
							></path>
						</svg>
						Manage your registered boxes
					</p>
				</div>
				<div class="flex items-center gap-3">
					<div
						class="px-4 py-2 bg-white border border-gray-200 rounded-lg"
					>
						<span class="text-sm font-medium text-gray-900">{{
							nfcCodes.length
						}}</span>
						<span class="text-sm text-gray-500 ml-1">{{
							nfcCodes.length === 1 ? "box" : "boxes"
						}}</span>
					</div>
					<router-link
						v-if="canCreateNfc"
						to="/create-box"
						class="inline-flex items-center gap-2 px-4 py-2 bg-[#0D65AE] text-white font-medium rounded-lg hover:bg-[#0D65AE]/90 transition-all border border-[#0D65AE]"
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
								d="M12 4v16m8-8H4"
							></path>
						</svg>
						<span class="hidden sm:inline">Add Box</span>
					</router-link>
				</div>
			</div>

			<!-- Loading State -->
			<div v-if="loading" class="flex items-center justify-center py-12">
				<div
					class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0D65AE]"
				></div>
			</div>

			<!-- Boxes Grid -->
			<div
				v-else-if="nfcCodes.length"
				class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
			>
				<!-- Box Cards -->
				<div
					v-for="box in nfcCodes"
					:key="box.id"
					class="bg-white rounded-xl border border-gray-200 hover:border-[#0D65AE] transition-all duration-300 overflow-hidden group"
				>
					<div class="p-6">
						<!-- Box ID Badge -->
						<div class="flex items-center justify-between mb-4">
							<div class="flex items-center gap-2">
								<div
									class="bg-[#0D65AE]/10 p-2 rounded-lg border border-[#0D65AE]/20"
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
											d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
										></path>
									</svg>
								</div>
								<div>
									<p class="text-xs text-gray-500">Box ID</p>
									<p
										class="text-sm font-semibold text-gray-900"
									>
										{{ box.code || "N/A" }}
									</p>
								</div>
							</div>
							<span
								class="px-2 py-1 text-xs font-medium rounded-md"
								:class="
									box.status === 'active'
										? 'text-green-700 bg-green-50 border border-green-200'
										: 'text-gray-700 bg-gray-50 border border-gray-200'
								"
							>
								{{ box.status || "Active" }}
							</span>
						</div>

						<!-- Box Details -->
						<div class="space-y-3 mb-4">
							<div
								v-if="box.name"
								class="flex items-center gap-3 text-gray-700"
							>
								<svg
									class="w-4 h-4 text-gray-400 flex-shrink-0"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
									></path>
								</svg>
								<div class="flex-1 min-w-0">
									<span class="text-xs text-gray-500 block"
										>Name</span
									>
									<span
										class="text-sm font-medium text-gray-900 block truncate"
										>{{ box.name }}</span
									>
								</div>
							</div>

							<div
								v-if="box.location"
								class="flex items-start gap-3 text-gray-700"
							>
								<svg
									class="w-4 h-4 text-gray-400 flex-shrink-0 mt-1"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
									></path>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
									></path>
								</svg>
								<div class="flex-1 min-w-0">
									<span class="text-xs text-gray-500 block"
										>Location</span
									>
									<span
										class="text-sm font-medium text-gray-900 block line-clamp-2"
										>{{ box.location }}</span
									>
								</div>
							</div>

							<div
								v-if="box.description"
								class="flex items-start gap-3 text-gray-700"
							>
								<svg
									class="w-4 h-4 text-gray-400 flex-shrink-0 mt-1"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
									></path>
								</svg>
								<div class="flex-1 min-w-0">
									<span class="text-xs text-gray-500 block"
										>Description</span
									>
									<span
										class="text-sm font-medium text-gray-900 block line-clamp-2"
										>{{ box.description }}</span
									>
								</div>
							</div>

							<div
								v-if="box.created_at"
								class="flex items-center gap-3 text-gray-700"
							>
								<svg
									class="w-4 h-4 text-gray-400 flex-shrink-0"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
									></path>
								</svg>
								<div class="flex-1 min-w-0">
									<span class="text-xs text-gray-500 block"
										>Created</span
									>
									<span
										class="text-sm font-medium text-gray-900 block truncate"
										>{{ formatDate(box.created_at) }}</span
									>
								</div>
							</div>
						</div>
					</div>

					<!-- Footer Actions -->
					<div class="px-6 py-3 bg-gray-50 border-t border-gray-200">
						<div class="flex gap-2">
							<router-link
								v-if="canEditNfc"
								:to="`/edit-box/${box.id}`"
								class="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white bg-[#0D65AE] rounded-lg hover:bg-[#0D65AE]/90 transition-all border border-[#0D65AE]"
							>
								<svg
									class="w-4 h-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
									></path>
								</svg>
								Edit
							</router-link>
							<div class="relative">
								<button
									@click="toggleDropdown(box.id)"
									class="px-3 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg hover:bg-gray-100 transition-all border border-gray-300"
								>
									<svg
										class="w-4 h-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
										></path>
									</svg>
								</button>
								<!-- Dropdown Menu -->
								<div
									v-if="activeDropdown === box.id"
									class="absolute right-0 bottom-full mb-2 w-48 bg-white border border-gray-200 rounded-lg overflow-hidden z-10 shadow-lg"
								>
									<button
										@click="viewBoxDetails(box)"
										class="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
									>
										<svg
											class="w-4 h-4"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
											></path>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
											></path>
										</svg>
										View Details
									</button>
									<button
										@click="copyBoxId(box)"
										class="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
									>
										<svg
											class="w-4 h-4"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
											></path>
										</svg>
										Copy Box ID
									</button>
									<div class="border-t border-gray-200"></div>
									<button
										v-if="canDeleteNfc"
										@click="confirmDelete(box)"
										:disabled="deleting === box.id"
										class="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left disabled:opacity-50"
									>
										<svg
											v-if="deleting !== box.id"
											class="w-4 h-4"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
											></path>
										</svg>
										<i
											v-else
											class="pi pi-spin pi-spinner"
										></i>
										{{
											deleting === box.id
												? "Deleting..."
												: "Delete Box"
										}}
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Add New Box Card -->
				<router-link
					v-if="canCreateNfc"
					to="/create-box"
					class="bg-white rounded-xl border-2 border-dashed border-gray-300 hover:border-[#0D65AE] transition-all duration-300 cursor-pointer group"
				>
					<div
						class="flex flex-col items-center justify-center p-12 text-center h-full min-h-[280px]"
					>
						<div
							class="w-16 h-16 bg-[#0D65AE]/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-[#0D65AE]/20 transition-all border border-[#0D65AE]/20 group-hover:border-[#0D65AE]/40"
						>
							<svg
								class="w-8 h-8 text-[#0D65AE]"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 4v16m8-8H4"
								></path>
							</svg>
						</div>
						<h3 class="text-lg font-semibold text-gray-900 mb-2">
							Add New Box
						</h3>
						<p class="text-sm text-gray-500">
							Register a new box to your account
						</p>
					</div>
				</router-link>
			</div>

			<!-- Empty State -->
			<div v-else class="text-center py-16">
				<div class="max-w-md mx-auto">
					<div
						class="w-24 h-24 bg-gray-50 border-2 border-gray-200 rounded-full flex items-center justify-center mx-auto mb-6"
					>
						<svg
							class="w-12 h-12 text-gray-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
							></path>
						</svg>
					</div>
					<h3 class="text-xl font-semibold text-gray-900 mb-2">
						No boxes registered
					</h3>
					<p class="text-gray-500 mb-6">
						Get started by adding your first box
					</p>
					<router-link
						v-if="canCreateNfc"
						to="/create-box"
						class="inline-flex items-center gap-2 px-6 py-3 text-base font-medium text-white bg-[#0D65AE] rounded-lg hover:bg-[#0D65AE]/90 transition-all border border-[#0D65AE]"
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
								d="M12 4v16m8-8H4"
							></path>
						</svg>
						Add Your First Box
					</router-link>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { useNfc, useToast, usePermissions } from "@/composables";
import { formatDate } from "@/utils/formatters";

const router = useRouter();
const { fetchNfcCodes, deleteNfcCode, loading, nfcCodes } = useNfc();
const { showToast } = useToast();
const { canViewNfc, canCreateNfc, canEditNfc, canDeleteNfc } = usePermissions();

const activeDropdown = ref(null);
const deleting = ref(null);

function toggleDropdown(boxId) {
	activeDropdown.value = activeDropdown.value === boxId ? null : boxId;
}

function closeDropdowns() {
	activeDropdown.value = null;
}

function viewBoxDetails(box) {
	closeDropdowns();
	const details = [
		`Box ID: ${box.code || "N/A"}`,
		box.name ? `Name: ${box.name}` : null,
		box.location ? `Location: ${box.location}` : null,
		box.description ? `Description: ${box.description}` : null,
		box.created_at ? `Created: ${formatDate(box.created_at)}` : null,
		box.status ? `Status: ${box.status}` : null,
	]
		.filter(Boolean)
		.join("\n");

	alert(`Box Details:\n\n${details}`);
}

function copyBoxId(box) {
	closeDropdowns();
	const boxId = box.code || box.id;
	navigator.clipboard
		.writeText(boxId)
		.then(() => {
			showToast("success", "Copied!", "Box ID copied to clipboard");
		})
		.catch(() => {
			showToast("error", "Copy Failed", "Failed to copy Box ID");
		});
}

async function confirmDelete(box) {
	closeDropdowns();
	if (
		!confirm(
			`Are you sure you want to delete box ${box.code || box.name || "this box"}?\n\nThis action cannot be undone.`,
		)
	) {
		return;
	}

	deleting.value = box.id;
	const success = await deleteNfcCode(box.id);
	deleting.value = null;

	if (success) {
		showToast(
			"success",
			"Box Deleted",
			"Box has been deleted successfully",
		);
	}
}

function handleClickOutside(event) {
	if (!event.target.closest(".relative")) {
		closeDropdowns();
	}
}

onMounted(() => {
	// Check permissions before loading data
	if (!canViewNfc.value) {
		router.push({
			path: "/unauthorized",
			query: {
				message: "You do not have permission to view NFC boxes.",
			},
		});
		return;
	}

	fetchNfcCodes();
	document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
	document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.line-clamp-2 {
	display: -webkit-box;
	-webkit-line-clamp: 2;
	line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
}
</style>
