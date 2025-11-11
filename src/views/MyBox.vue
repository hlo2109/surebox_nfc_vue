<template>
	<div class="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
		<!-- Header Section -->
		<div class="max-w-7xl mx-auto">
			<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
				<div>
					<h1 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">My Boxes</h1>
					<p class="text-gray-600 flex items-center gap-2">
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
								d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
						</svg>
						Manage your registered boxes
					</p>
				</div>
				<div class="flex items-center gap-3">
					<div class="px-4 py-2 bg-white border border-gray-200 rounded-lg">
						<span class="text-sm font-medium text-gray-900">{{ boxes.length }}</span>
						<span class="text-sm text-gray-500 ml-1">{{ boxes.length === 1 ? 'box' : 'boxes' }}</span>
					</div>
					<router-link to="/create-box"
						class="inline-flex items-center gap-2 px-4 py-2 bg-[#0D65AE] text-white font-medium rounded-lg hover:bg-[#0D65AE]/90 transition-all border border-[#0D65AE]">
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4">
							</path>
						</svg>
						<span class="hidden sm:inline">Add Box</span>
					</router-link>
				</div>
			</div>

			<!-- Error Message -->
			<div v-if="error" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
				<div class="flex items-start gap-3">
					<svg class="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
							clip-rule="evenodd"></path>
					</svg>
					<div class="flex-1">
						<p class="text-sm font-medium text-red-800">{{ error }}</p>
					</div>
				</div>
			</div>

			<!-- Loading State -->
			<div v-if="loading" class="flex items-center justify-center py-12">
				<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0D65AE]"></div>
			</div>

			<!-- Boxes Grid -->
			<div v-else-if="boxes.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				<!-- Box Cards -->
				<div v-for="box in boxes" :key="box.id"
					class="bg-white rounded-xl border border-gray-200 hover:border-[#0D65AE] transition-all duration-300 overflow-hidden group">
					<div class="p-6">
						<!-- Box ID Badge -->
						<div class="flex items-center justify-between mb-4">
							<div class="flex items-center gap-2">
								<div class="bg-[#0D65AE]/10 p-2 rounded-lg border border-[#0D65AE]/20">
									<svg class="w-5 h-5 text-[#0D65AE]" fill="none" stroke="currentColor"
										viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
											d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
									</svg>
								</div>
								<div>
									<p class="text-xs text-gray-500">Box ID</p>
									<p class="text-sm font-semibold text-gray-900">{{ box.codebox_id || 'N/A' }}</p>
								</div>
							</div>
							<span
								class="px-2 py-1 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-md">
								Active
							</span>
						</div>

						<!-- Box Details -->
						<div class="space-y-3 mb-4">
							<div class="flex items-center gap-3 text-gray-700">
								<svg class="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor"
									viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
										d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z">
									</path>
								</svg>
								<div class="flex-1 min-w-0">
									<span class="text-xs text-gray-500 block">Phone</span>
									<span class="text-sm font-medium text-gray-900 block truncate">{{ box.phone
									}}</span>
								</div>
							</div>

							<div class="flex items-start gap-3 text-gray-700">
								<svg class="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor"
									viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
										d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z">
									</path>
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
										d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
								</svg>
								<div class="flex-1 min-w-0">
									<span class="text-xs text-gray-500 block">Address</span>
									<span class="text-sm font-medium text-gray-900 block line-clamp-2">{{ box.address
									}}</span>
								</div>
							</div>
						</div>
					</div>

					<!-- Footer Actions -->
					<div class="px-6 py-3 bg-gray-50 border-t border-gray-200">
						<div class="flex gap-2">
							<router-link :to="`/edit-box/${box.id}`"
								class="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white bg-[#0D65AE] rounded-lg hover:bg-[#0D65AE]/90 transition-all border border-[#0D65AE]">
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
										d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
									</path>
								</svg>
								Edit
							</router-link>
							<div class="relative">
								<button @click="toggleDropdown(box.id)"
									class="px-3 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg hover:bg-gray-100 transition-all border border-gray-300">
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
											d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z">
										</path>
									</svg>
								</button>
								<!-- Dropdown Menu -->
								<div v-if="activeDropdown === box.id"
									class="absolute right-0 bottom-full mb-2 w-48 bg-white border border-gray-200 rounded-lg overflow-hidden z-10">
									<button @click="viewBoxDetails(box)"
										class="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left">
										<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
												d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
												d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z">
											</path>
										</svg>
										View Details
									</button>
									<button @click="copyBoxId(box)"
										class="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left">
										<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
												d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z">
											</path>
										</svg>
										Copy Box ID
									</button>
									<div class="border-t border-gray-200"></div>
									<button @click="deleteBox(box)"
										class="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left">
										<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
												d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
											</path>
										</svg>
										Delete Box
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Add New Box Card -->
				<router-link to="/create-box"
					class="bg-white rounded-xl border-2 border-dashed border-gray-300 hover:border-[#0D65AE] transition-all duration-300 cursor-pointer group">
					<div class="flex flex-col items-center justify-center p-12 text-center h-full min-h-[280px]">
						<div
							class="w-16 h-16 bg-[#0D65AE]/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-[#0D65AE]/20 transition-all border border-[#0D65AE]/20 group-hover:border-[#0D65AE]/40">
							<svg class="w-8 h-8 text-[#0D65AE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M12 4v16m8-8H4">
								</path>
							</svg>
						</div>
						<h3 class="text-lg font-semibold text-gray-900 mb-2">Add New Box</h3>
						<p class="text-sm text-gray-500">Register a new box to your account</p>
					</div>
				</router-link>
			</div>

			<!-- Empty State -->
			<div v-else class="text-center py-16">
				<div class="max-w-md mx-auto">
					<div
						class="w-24 h-24 bg-gray-50 border-2 border-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
						<svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
								d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
						</svg>
					</div>
					<h3 class="text-xl font-semibold text-gray-900 mb-2">No boxes registered</h3>
					<p class="text-gray-500 mb-6">Get started by adding your first box</p>
					<router-link to="/create-box"
						class="inline-flex items-center gap-2 px-6 py-3 text-base font-medium text-white bg-[#0D65AE] rounded-lg hover:bg-[#0D65AE]/90 transition-all border border-[#0D65AE]">
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4">
							</path>
						</svg>
						Add Your First Box
					</router-link>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const boxes = ref([])
const error = ref('')
const loading = ref(false)
const activeDropdown = ref(null)
const API_BASE_URL = import.meta.env.VITE_API_URL

async function fetchBoxes() {
	loading.value = true
	error.value = ''

	try {
		const jwt = localStorage.getItem('jwt')

		if (!jwt) {
			throw new Error('Authentication required')
		}

		const res = await fetch(`${API_BASE_URL}/user-code-box`, {
			headers: {
				'Authorization': `Bearer ${jwt}`,
				'Content-Type': 'application/json'
			}
		})

		if (!res.ok) {
			const errorData = await res.json().catch(() => ({}))
			throw new Error(errorData.message || `Server error: ${res.status}`)
		}

		const data = await res.json()
		boxes.value = Array.isArray(data) ? data : [data]

	} catch (err) {
		console.error('Error fetching boxes:', err)
		error.value = err.message || 'Connection error. Please try again.'
	} finally {
		loading.value = false
	}
}

function toggleDropdown(boxId) {
	activeDropdown.value = activeDropdown.value === boxId ? null : boxId
}

function closeDropdowns() {
	activeDropdown.value = null
}

function viewBoxDetails(box) {
	closeDropdowns()
	alert(`Box Details:\n\nBox ID: ${box.codebox_id || 'N/A'}\nPhone: ${box.phone}\nAddress: ${box.address}`)
}

function copyBoxId(box) {
	closeDropdowns()
	const boxId = box.codebox_id || box.id
	navigator.clipboard.writeText(boxId).then(() => {
		alert('Box ID copied to clipboard!')
	}).catch(() => {
		alert('Failed to copy Box ID')
	})
}

async function deleteBox(box) {
	closeDropdowns()
	if (!confirm(`Are you sure you want to delete box ${box.codebox_id || box.phone}?\n\nThis action cannot be undone.`)) {
		return
	}

	try {
		const jwt = localStorage.getItem('jwt')
		const res = await fetch(`${API_BASE_URL}/user-code-box/${box.id}`, {
			method: 'DELETE',
			headers: {
				'Authorization': `Bearer ${jwt}`,
				'Content-Type': 'application/json'
			}
		})

		if (!res.ok) {
			throw new Error('Failed to delete box')
		}

		// Remove from local list
		boxes.value = boxes.value.filter(b => b.id !== box.id)
		alert('Box deleted successfully')
	} catch (err) {
		console.error('Error deleting box:', err)
		alert('Failed to delete box. Please try again.')
	}
}

function handleClickOutside(event) {
	if (!event.target.closest('.relative')) {
		closeDropdowns()
	}
}

onMounted(() => {
	fetchBoxes()
	document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
	document.removeEventListener('click', handleClickOutside)
})
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