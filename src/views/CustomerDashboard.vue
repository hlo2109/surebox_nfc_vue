<template>
	<div class="bg-gray-50 p-4 sm:p-6 lg:p-8">
		<div class="max-w-7xl mx-auto">

			<!-- ─── Header ──────────────────────────────────────────────────── -->
			<div class="mb-6 sm:mb-8">
				<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
					<div>
						<h1 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">
							Welcome Back, {{ props.userName }}
						</h1>
						<p class="text-sm sm:text-base text-gray-600 flex items-center gap-2">
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
							</svg>
							Your personal dashboard
						</p>
					</div>
					<button
						@click="loadData"
						:disabled="loading"
						class="inline-flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-[#0D65AE] focus:ring-offset-2 disabled:opacity-50 transition-all"
					>
						<svg
							:class="['w-4 h-4', loading ? 'animate-spin' : '']"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
								d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
						</svg>
						<span class="hidden sm:inline">Refresh</span>
					</button>
				</div>
			</div>

			<!-- ─── Loading spinner (full-page) ────────────────────────────── -->
			<div v-if="loading" class="flex items-center justify-center py-24">
				<div class="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0D65AE]"></div>
			</div>

			<template v-else>

				<!-- ─── Stats Cards ─────────────────────────────────────────── -->
				<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">

					<!-- My NFC Tags (blue) -->
					<div class="bg-white rounded-xl border border-gray-200 hover:border-[#0D65AE] transition-all p-5 sm:p-6">
						<div class="flex items-center justify-between">
							<div class="flex-1">
								<p class="text-gray-500 text-xs sm:text-sm font-medium mb-1 sm:mb-2">My NFC Tags</p>
								<h3 class="text-2xl sm:text-3xl font-bold text-gray-900">{{ stats.totalTags }}</h3>
								<p class="text-[#0D65AE] text-xs sm:text-sm mt-2 flex items-center gap-1">
									<svg class="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd"
											d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
											clip-rule="evenodd" />
									</svg>
									<span>{{ stats.activeTags }} active</span>
								</p>
							</div>
							<div class="bg-[#0D65AE]/10 p-3 sm:p-4 rounded-xl border border-[#0D65AE]/20">
								<svg class="w-6 h-6 sm:w-8 sm:h-8 text-[#0D65AE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
										d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
								</svg>
							</div>
						</div>
					</div>

					<!-- Active Requests (orange) -->
					<div class="bg-white rounded-xl border border-gray-200 hover:border-orange-400 transition-all p-5 sm:p-6">
						<div class="flex items-center justify-between">
							<div class="flex-1">
								<p class="text-gray-500 text-xs sm:text-sm font-medium mb-1 sm:mb-2">Active Requests</p>
								<h3 class="text-2xl sm:text-3xl font-bold text-gray-900">{{ stats.activeRequests }}</h3>
								<p class="text-orange-600 text-xs sm:text-sm mt-2 flex items-center gap-1">
									<svg class="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd"
											d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
											clip-rule="evenodd" />
									</svg>
									<span>{{ stats.pendingRequests }} pending</span>
								</p>
							</div>
							<div class="bg-orange-50 p-3 sm:p-4 rounded-xl border border-orange-200">
								<svg class="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
										d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
								</svg>
							</div>
						</div>
					</div>

					<!-- Completed (green) -->
					<div class="bg-white rounded-xl border border-gray-200 hover:border-green-400 transition-all p-5 sm:p-6">
						<div class="flex items-center justify-between">
							<div class="flex-1">
								<p class="text-gray-500 text-xs sm:text-sm font-medium mb-1 sm:mb-2">Completed</p>
								<h3 class="text-2xl sm:text-3xl font-bold text-gray-900">{{ stats.completedRequests }}</h3>
								<p class="text-green-600 text-xs sm:text-sm mt-2 flex items-center gap-1">
									<svg class="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd"
											d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
											clip-rule="evenodd" />
									</svg>
									<span>Service requests</span>
								</p>
							</div>
							<div class="bg-green-50 p-3 sm:p-4 rounded-xl border border-green-200">
								<svg class="w-6 h-6 sm:w-8 sm:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
										d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
							</div>
						</div>
					</div>

					<!-- Locations (purple) -->
					<div class="bg-white rounded-xl border border-gray-200 hover:border-purple-400 transition-all p-5 sm:p-6">
						<div class="flex items-center justify-between">
							<div class="flex-1">
								<p class="text-gray-500 text-xs sm:text-sm font-medium mb-1 sm:mb-2">Locations</p>
								<h3 class="text-2xl sm:text-3xl font-bold text-gray-900">{{ stats.uniqueLocations }}</h3>
								<p class="text-purple-600 text-xs sm:text-sm mt-2 flex items-center gap-1">
									<svg class="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd"
											d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
											clip-rule="evenodd" />
									</svg>
									<span>Unique addresses</span>
								</p>
							</div>
							<div class="bg-purple-50 p-3 sm:p-4 rounded-xl border border-purple-200">
								<svg class="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
										d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
								</svg>
							</div>
						</div>
					</div>

				</div>

				<!-- Quick links (packages + requests) -->
				<div
					class="flex flex-wrap gap-3 mb-6 sm:mb-8"
				>
					<button
						type="button"
						@click="router.push('/my-packages')"
						class="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-[#0D65AE] rounded-lg hover:bg-[#0b579a] shadow-sm border border-[#0D65AE]/20"
					>
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
							/>
						</svg>
						My packages &amp; tracking
					</button>
					<button
						type="button"
						@click="router.push('/requests')"
						class="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
					>
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
							/>
						</svg>
						My requests
					</button>
				</div>

				<!-- ─── Recent Service Requests ───────────────────────────────── -->
				<div class="mb-6 sm:mb-8">
					<div class="bg-white rounded-xl border border-gray-200 p-5 sm:p-6">
						<div class="flex items-center justify-between mb-4 sm:mb-6">
							<h3 class="text-lg sm:text-xl font-semibold text-gray-900">Recent Requests</h3>
							<button
								@click="router.push('/requests')"
								class="inline-flex items-center gap-1 text-sm font-medium text-[#0D65AE] hover:underline transition-colors"
							>
								<span>View All</span>
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
								</svg>
							</button>
						</div>

						<!-- Empty state -->
						<div v-if="recentRequests.length === 0" class="text-center py-12">
							<svg class="mx-auto h-12 w-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
							</svg>
							<p class="text-gray-500 text-sm">No service requests yet</p>
						</div>

						<!-- Request rows -->
						<div v-else class="space-y-3">
							<div
								v-for="request in recentRequests"
								:key="request.id"
								class="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all cursor-pointer"
								@click="router.push('/requests')"
							>
								<!-- Left: icon + text -->
								<div class="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
									<div
										:class="[
											'w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0',
											request.status === 'completed'
												? 'bg-green-100'
												: request.status === 'cancelled'
													? 'bg-red-100'
													: 'bg-orange-100',
										]"
									>
										<!-- completed: green check -->
										<svg
											v-if="request.status === 'completed'"
											class="w-5 h-5 sm:w-6 sm:h-6 text-green-600"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path fill-rule="evenodd"
												d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
												clip-rule="evenodd" />
										</svg>
										<!-- cancelled: red X -->
										<svg
											v-else-if="request.status === 'cancelled'"
											class="w-5 h-5 sm:w-6 sm:h-6 text-red-500"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path fill-rule="evenodd"
												d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
												clip-rule="evenodd" />
										</svg>
										<!-- otherwise: orange clock -->
										<svg
											v-else
											class="w-5 h-5 sm:w-6 sm:h-6 text-orange-600"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path fill-rule="evenodd"
												d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
												clip-rule="evenodd" />
										</svg>
									</div>

									<div class="flex-1 min-w-0">
										<p class="font-semibold text-gray-900 text-sm sm:text-base truncate">
											{{ request.service?.name ?? 'Service Request' }}
										</p>
										<p class="text-xs sm:text-sm text-gray-500 truncate">
											{{ request.company?.name ?? '—' }}
										</p>
									</div>
								</div>

								<!-- Right: badge + date -->
								<div class="text-right flex-shrink-0 ml-2">
									<span :class="statusBadgeClass(request.status)">
										{{ formatStatus(request.status) }}
									</span>
									<p class="text-xs text-gray-500 mt-1 hidden sm:block">
										{{ formatDate(request.preferredDate ?? request.createdAt) }}
									</p>
								</div>
							</div>
						</div>
					</div>

				</div>

				<!-- ─── Your NFC Tags (full width) ──────────────────────────── -->
				<div class="bg-white rounded-xl border border-gray-200 p-5 sm:p-6">
					<div class="flex items-center justify-between mb-4 sm:mb-6">
						<h3 class="text-lg sm:text-xl font-semibold text-gray-900">Your NFC Tags</h3>
						<button
							@click="router.push('/mybox')"
							class="inline-flex items-center gap-1 text-sm font-medium text-[#0D65AE] hover:underline transition-colors"
						>
							<span>Manage All</span>
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
							</svg>
						</button>
					</div>

					<!-- Empty state -->
					<div v-if="recentTags.length === 0" class="text-center py-12">
						<svg class="mx-auto h-12 w-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
								d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
						</svg>
						<p class="text-gray-500 mb-4 text-sm">No NFC tags registered yet</p>
						<button
							@click="router.push('/create-box')"
							class="inline-flex items-center gap-2 px-4 py-2 bg-[#0D65AE] text-white font-medium rounded-lg hover:bg-[#0D65AE]/90 focus:ring-2 focus:ring-[#0D65AE] focus:ring-offset-2 transition-all border border-[#0D65AE]"
						>
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
							</svg>
							<span>Register Your First Tag</span>
						</button>
					</div>

					<!-- Tags grid -->
					<div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
						<div
							v-for="tag in recentTags"
							:key="tag.id"
							class="p-4 border border-gray-200 rounded-lg hover:border-[#0D65AE] transition-all cursor-pointer bg-white group"
							@click="router.push('/mybox')"
						>
							<!-- Top row: icon + status badge -->
							<div class="flex items-start justify-between mb-3">
								<div class="bg-[#0D65AE]/10 p-2.5 rounded-lg border border-[#0D65AE]/20">
									<svg class="w-5 h-5 text-[#0D65AE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
											d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
									</svg>
								</div>
								<span
									:class="[
										'text-xs font-semibold px-2 py-0.5 rounded-full',
										tag.status === 'active'
											? 'bg-green-100 text-green-700'
											: 'bg-gray-100 text-gray-500',
									]"
								>
									{{ tag.status === 'active' ? 'Active' : 'Inactive' }}
								</span>
							</div>

							<!-- Tag details -->
							<div class="space-y-2">
								<!-- Nickname / code as title -->
								<p class="font-semibold text-gray-900 text-sm truncate">
									{{ tag.nickname ?? tag.code }}
								</p>

								<!-- Raw code in monospace -->
								<p class="text-xs text-gray-400 font-mono truncate">{{ tag.code }}</p>

								<!-- Address (only if present) -->
								<div v-if="tag.address" class="flex items-start gap-2 text-xs text-gray-600 mt-1">
									<svg class="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
											d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
											d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
									</svg>
									<span class="line-clamp-2">{{ tag.address }}</span>
								</div>
							</div>
						</div>
					</div>
				</div>

			</template>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { getAccessToken } from '@/utils/storage'
import { getMyNfcTags } from '@/api/nfc.api'
import { getServiceRequests } from '@/api/serviceRequests.api'

// ─── Props ────────────────────────────────────────────────────────────────────
const props = defineProps({
	userName: { type: String, default: 'User' },
})

// ─── Router / Store ───────────────────────────────────────────────────────────
const router = useRouter()
const authStore = useAuthStore()

// ─── State ────────────────────────────────────────────────────────────────────
const loading = ref(false)
const nfcTags = ref([])
const serviceRequests = ref([])

// ─── Computed ─────────────────────────────────────────────────────────────────
const stats = computed(() => {
	const tags = nfcTags.value
	const requests = serviceRequests.value

	return {
		totalTags: tags.length,
		activeTags: tags.filter((t) => t.status === 'active').length,
		activeRequests: requests.filter((r) =>
			['pending', 'quoted', 'accepted', 'in_progress'].includes(r.status),
		).length,
		pendingRequests: requests.filter((r) => r.status === 'pending').length,
		completedRequests: requests.filter((r) => r.status === 'completed').length,
		uniqueLocations: new Set(tags.map((t) => t.address).filter(Boolean)).size,
	}
})

// 5 most recent service requests, sorted by createdAt descending
const recentRequests = computed(() =>
	[...serviceRequests.value]
		.sort((a, b) => new Date(b.createdAt ?? 0) - new Date(a.createdAt ?? 0))
		.slice(0, 5),
)

// First 6 NFC tags
const recentTags = computed(() => nfcTags.value.slice(0, 6))

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(iso) {
	if (!iso) return '—'
	return new Date(iso).toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	})
}

function formatStatus(status) {
	const labels = {
		pending: 'Pending',
		quoted: 'Quoted',
		accepted: 'Accepted',
		in_progress: 'In Progress',
		completed: 'Completed',
		cancelled: 'Cancelled',
	}
	return labels[status] ?? status
}

function statusBadgeClass(status) {
	const map = {
		pending: 'bg-yellow-100 text-yellow-700',
		quoted: 'bg-blue-100 text-blue-700',
		accepted: 'bg-indigo-100 text-indigo-700',
		in_progress: 'bg-orange-100 text-orange-700',
		completed: 'bg-green-100 text-green-700',
		cancelled: 'bg-red-100 text-red-500',
	}
	return [
		'inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap',
		map[status] ?? 'bg-gray-100 text-gray-600',
	].join(' ')
}

// ─── Data fetching ────────────────────────────────────────────────────────────
async function fetchNfcTags() {
	try {
		const data = await getMyNfcTags()
		nfcTags.value = Array.isArray(data)
			? data
			: Array.isArray(data?.data)
				? data.data
				: []
	} catch (err) {
		console.error('CustomerDashboard — fetchNfcTags:', err)
		nfcTags.value = []
	}
}

async function fetchServiceRequests() {
	try {
		const data = await getServiceRequests({ page: 1, limit: 50 })
		const list = Array.isArray(data)
			? data
			: Array.isArray(data?.data)
				? data.data
				: []
		serviceRequests.value = list
	} catch (err) {
		console.error('CustomerDashboard — fetchServiceRequests:', err)
		serviceRequests.value = []
	}
}

async function loadData() {
	const token = getAccessToken()
	if (!token) {
		router.push('/login')
		return
	}

	loading.value = true
	try {
		await Promise.all([fetchNfcTags(), fetchServiceRequests()])
	} catch (err) {
		console.error('CustomerDashboard — loadData:', err)
		if (err?.response?.status === 401) {
			router.push('/login')
		}
	} finally {
		loading.value = false
	}
}

onMounted(loadData)
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
