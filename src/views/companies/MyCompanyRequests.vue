<template>
	<div class="bg-gray-50 p-4 sm:p-6 lg:p-8">
		<div class="max-w-7xl mx-auto">
			<!-- Header -->
			<div class="mb-6 sm:mb-8">
				<!-- Back Button -->
				<div class="mb-4">
					<button
						@click="router.push('/my-company')"
						class="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-[#0D65AE] focus:ring-offset-2 transition-all"
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
								d="M10 19l-7-7m0 0l7-7m-7 7h18"
							/>
						</svg>
						Back to My Company
					</button>
				</div>
				<div
					class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
				>
					<div>
						<h1
							class="text-3xl sm:text-4xl font-bold text-gray-900 mb-1 sm:mb-2"
						>
							Company Service Requests
						</h1>
						<p
							class="text-sm sm:text-base text-gray-600 flex items-center gap-2"
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
									d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
								/>
							</svg>
							Manage and respond to incoming service requests for
							your company
						</p>
					</div>
					<button
						@click="loadRequests"
						:disabled="loading"
						class="inline-flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-[#0D65AE] focus:ring-offset-2 disabled:opacity-50 transition-all"
					>
						<svg
							:class="['w-4 h-4', loading ? 'animate-spin' : '']"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
							/>
						</svg>
						<span class="hidden sm:inline">Refresh</span>
					</button>
				</div>
			</div>

			<!-- Stats Bar -->
			<div
				class="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8"
			>
				<!-- Total -->
				<div
					class="bg-white rounded-xl border border-gray-200 hover:border-indigo-400 transition-all p-5 sm:p-6"
				>
					<div class="flex items-center justify-between">
						<div class="flex-1">
							<p
								class="text-gray-500 text-xs sm:text-sm font-medium mb-1 sm:mb-2"
							>
								Total
							</p>
							<h3
								class="text-2xl sm:text-3xl font-bold text-gray-900"
							>
								{{ requests.length }}
							</h3>
							<p
								class="text-indigo-600 text-xs sm:text-sm mt-2 flex items-center gap-1"
							>
								<svg
									class="w-3 h-3 sm:w-4 sm:h-4"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path
										d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"
									/>
									<path
										fill-rule="evenodd"
										d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
										clip-rule="evenodd"
									/>
								</svg>
								<span>All time</span>
							</p>
						</div>
						<div
							class="bg-indigo-50 p-3 sm:p-4 rounded-xl border border-indigo-200"
						>
							<svg
								class="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
								/>
							</svg>
						</div>
					</div>
				</div>

				<!-- Pending -->
				<div
					class="bg-white rounded-xl border border-gray-200 hover:border-yellow-400 transition-all p-5 sm:p-6"
				>
					<div class="flex items-center justify-between">
						<div class="flex-1">
							<p
								class="text-gray-500 text-xs sm:text-sm font-medium mb-1 sm:mb-2"
							>
								Pending
							</p>
							<h3
								class="text-2xl sm:text-3xl font-bold text-gray-900"
							>
								{{ pendingCount }}
							</h3>
							<p
								class="text-yellow-600 text-xs sm:text-sm mt-2 flex items-center gap-1"
							>
								<svg
									class="w-3 h-3 sm:w-4 sm:h-4"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path
										fill-rule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
										clip-rule="evenodd"
									/>
								</svg>
								<span>Awaiting action</span>
							</p>
						</div>
						<div
							class="bg-yellow-50 p-3 sm:p-4 rounded-xl border border-yellow-200"
						>
							<svg
								class="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						</div>
					</div>
				</div>

				<!-- In Progress -->
				<div
					class="bg-white rounded-xl border border-gray-200 hover:border-blue-400 transition-all p-5 sm:p-6"
				>
					<div class="flex items-center justify-between">
						<div class="flex-1">
							<p
								class="text-gray-500 text-xs sm:text-sm font-medium mb-1 sm:mb-2"
							>
								In Progress
							</p>
							<h3
								class="text-2xl sm:text-3xl font-bold text-gray-900"
							>
								{{ inProgressCount }}
							</h3>
							<p
								class="text-blue-600 text-xs sm:text-sm mt-2 flex items-center gap-1"
							>
								<svg
									class="w-3 h-3 sm:w-4 sm:h-4"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path
										fill-rule="evenodd"
										d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
										clip-rule="evenodd"
									/>
								</svg>
								<span>Being worked on</span>
							</p>
						</div>
						<div
							class="bg-blue-50 p-3 sm:p-4 rounded-xl border border-blue-200"
						>
							<svg
								class="w-6 h-6 sm:w-8 sm:h-8 text-blue-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
								/>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
								/>
							</svg>
						</div>
					</div>
				</div>

				<!-- Completed -->
				<div
					class="bg-white rounded-xl border border-gray-200 hover:border-green-400 transition-all p-5 sm:p-6"
				>
					<div class="flex items-center justify-between">
						<div class="flex-1">
							<p
								class="text-gray-500 text-xs sm:text-sm font-medium mb-1 sm:mb-2"
							>
								Completed
							</p>
							<h3
								class="text-2xl sm:text-3xl font-bold text-gray-900"
							>
								{{ completedCount }}
							</h3>
							<p
								class="text-green-600 text-xs sm:text-sm mt-2 flex items-center gap-1"
							>
								<svg
									class="w-3 h-3 sm:w-4 sm:h-4"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path
										fill-rule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
										clip-rule="evenodd"
									/>
								</svg>
								<span>Successfully done</span>
							</p>
						</div>
						<div
							class="bg-green-50 p-3 sm:p-4 rounded-xl border border-green-200"
						>
							<svg
								class="w-6 h-6 sm:w-8 sm:h-8 text-green-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						</div>
					</div>
				</div>
			</div>

			<!-- Filters & Search -->
			<div
				class="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 mb-6"
			>
				<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
					<!-- Search -->
					<div class="md:col-span-1">
						<div class="relative">
							<div
								class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
							>
								<svg
									class="h-5 w-5 text-gray-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
									/>
								</svg>
							</div>
							<input
								v-model="searchQuery"
								type="text"
								placeholder="Search by customer or service..."
								class="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D65AE] focus:border-transparent text-sm transition-all"
							/>
						</div>
					</div>

					<!-- Status Filter -->
					<div>
						<select
							v-model="selectedStatus"
							class="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D65AE] focus:border-transparent text-sm transition-all"
						>
							<option
								v-for="opt in statusOptions"
								:key="String(opt.value)"
								:value="opt.value"
							>
								{{ opt.label }}
							</option>
						</select>
					</div>

					<!-- Sort -->
					<div>
						<select
							v-model="sortBy"
							class="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D65AE] focus:border-transparent text-sm transition-all"
						>
							<option
								v-for="opt in sortOptions"
								:key="opt.value"
								:value="opt.value"
							>
								{{ opt.label }}
							</option>
						</select>
					</div>
				</div>
			</div>

			<!-- Loading State -->
			<div
				v-if="loading && !requests.length"
				class="flex flex-col items-center justify-center py-12 sm:py-16"
			>
				<svg
					class="animate-spin h-12 w-12 text-[#0D65AE] mb-4"
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
					/>
					<path
						class="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					/>
				</svg>
				<p class="text-gray-600 font-medium">
					Loading service requests...
				</p>
			</div>

			<!-- Error State -->
			<div
				v-else-if="loadError"
				class="bg-white rounded-xl border border-red-200 p-8 sm:p-12 text-center"
			>
				<div
					class="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-red-100 rounded-full flex items-center justify-center mb-4"
				>
					<svg
						class="w-8 h-8 sm:w-10 sm:h-10 text-red-600"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
				</div>
				<h3 class="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
					Error Loading Requests
				</h3>
				<p class="text-gray-600 mb-6">{{ loadError }}</p>
				<button
					@click="loadRequests"
					class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0D65AE] rounded-lg hover:bg-[#0D65AE]/90 transition-all"
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
							d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
						/>
					</svg>
					<span>Try Again</span>
				</button>
			</div>

			<!-- Empty State (no requests at all) -->
			<div
				v-else-if="!requests.length"
				class="bg-white rounded-xl border border-gray-200 p-8 sm:p-12 text-center"
			>
				<div
					class="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4"
				>
					<svg
						class="w-8 h-8 sm:w-10 sm:h-10 text-gray-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
						/>
					</svg>
				</div>
				<h3 class="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
					No service requests yet
				</h3>
				<p class="text-gray-600 max-w-md mx-auto">
					When customers submit service requests to your company they
					will appear here.
				</p>
			</div>

			<!-- No Results (after filtering) -->
			<div
				v-else-if="!filteredRequests.length"
				class="bg-white rounded-xl border border-gray-200 p-8 sm:p-12 text-center"
			>
				<div
					class="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4"
				>
					<svg
						class="w-8 h-8 sm:w-10 sm:h-10 text-gray-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>
				</div>
				<h3 class="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
					No requests found
				</h3>
				<p class="text-gray-600 max-w-md mx-auto">
					No requests match your current filters. Try adjusting your
					search or status filter.
				</p>
			</div>

			<!-- Requests Grid -->
			<div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
				<div
					v-for="request in paginatedRequests"
					:key="request.id"
					class="bg-white rounded-xl border border-gray-200 hover:border-[#0D65AE] hover:shadow-lg transition-all p-5 sm:p-6 cursor-pointer group"
					@click="openModal(request)"
				>
					<!-- Card Header -->
					<div class="flex items-start justify-between mb-3">
						<div class="flex-1 min-w-0">
							<h3
								class="font-semibold text-lg text-gray-900 group-hover:text-[#0D65AE] transition-colors line-clamp-1 mb-0.5"
							>
								{{
									request.serviceName ||
									request.service?.name ||
									"Service Request"
								}}
							</h3>
							<p
								class="text-sm text-gray-600 flex items-center gap-1"
							>
								<svg
									class="w-3.5 h-3.5 text-gray-400 flex-shrink-0"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
									/>
								</svg>
								<span class="truncate">{{
									request.customerName ||
									request.customer?.name ||
									"Unknown customer"
								}}</span>
							</p>
						</div>
						<span
							:class="[
								'flex-shrink-0 ml-3 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
								getStatusColor(request.status),
							]"
						>
							{{ formatStatus(request.status) }}
						</span>
					</div>

					<!-- Notes -->
					<p
						v-if="request.notes || request.description"
						class="text-sm text-gray-500 line-clamp-2 mb-3"
					>
						{{ request.notes || request.description }}
					</p>

					<!-- Meta row -->
					<div class="space-y-1.5 mb-4">
						<div
							v-if="request.preferredDate"
							class="flex items-center gap-2 text-sm text-gray-600"
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
								/>
							</svg>
							<span
								>Preferred:
								{{ formatDate(request.preferredDate) }}</span
							>
						</div>
						<div
							v-if="request.createdAt || request.created_at"
							class="flex items-center gap-2 text-sm text-gray-600"
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
									d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							<span
								>Submitted
								{{
									formatDate(
										request.createdAt || request.created_at,
									)
								}}</span
							>
						</div>
					</div>

					<!-- Footer -->
					<div
						class="flex items-center justify-between pt-3 border-t border-gray-100"
					>
						<span class="text-xs text-gray-400"
							>Request #{{ request.id }}</span
						>
						<button
							@click.stop="
								router.push({
									name: 'RequestDetail',
									params: { id: request.uuid },
								})
							"
							class="inline-flex items-center gap-1 text-xs font-medium text-[#0D65AE] group-hover:gap-2 transition-all hover:underline"
						>
							View Details
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
									d="M9 5l7 7-7 7"
								/>
							</svg>
						</button>
					</div>
				</div>
			</div>

			<!-- Pagination -->
			<div
				v-if="totalPages > 1"
				class="mt-8 flex items-center justify-center gap-2"
			>
				<button
					@click="currentPage--"
					:disabled="currentPage === 1"
					class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
							d="M15 19l-7-7 7-7"
						/>
					</svg>
					Previous
				</button>
				<span class="px-4 py-2 text-sm text-gray-700">
					Page {{ currentPage }} of {{ totalPages }}
				</span>
				<button
					@click="currentPage++"
					:disabled="currentPage === totalPages"
					class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
				>
					Next
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
							d="M9 5l7 7-7 7"
						/>
					</svg>
				</button>
			</div>
		</div>
	</div>

	<!-- ===================== DETAIL MODAL ===================== -->
	<Teleport to="body">
		<Transition name="modal">
			<div
				v-if="showModal && selectedRequest"
				class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
				@click.self="closeModal"
			>
				<!-- Backdrop -->
				<div
					class="absolute inset-0 bg-black/50 backdrop-blur-sm"
					@click="closeModal"
				/>

				<!-- Modal Card -->
				<div
					class="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
				>
					<!-- Modal Header -->
					<div
						class="bg-gradient-to-r from-[#0D65AE] to-indigo-700 px-6 py-5 flex items-start justify-between flex-shrink-0"
					>
						<div>
							<h2 class="text-xl font-bold text-white mb-1">
								{{
									selectedRequest.serviceName ||
									selectedRequest.service?.name ||
									"Service Request"
								}}
							</h2>
							<p
								class="text-indigo-200 text-sm flex items-center gap-1.5"
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
										d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
									/>
								</svg>
								{{
									selectedRequest.customerName ||
									selectedRequest.customer?.name ||
									"Unknown customer"
								}}
							</p>
						</div>
						<div class="flex items-center gap-3">
							<span
								:class="[
									'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold',
									getStatusColor(selectedRequest.status),
								]"
							>
								{{ formatStatus(selectedRequest.status) }}
							</span>
							<button
								@click="closeModal"
								class="text-indigo-200 hover:text-white transition-colors rounded-lg p-1 hover:bg-white/10"
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
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
						</div>
					</div>

					<!-- Modal Body (scrollable) -->
					<div class="overflow-y-auto flex-1 p-6 space-y-6">
						<!-- Request Details -->
						<div>
							<h3
								class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3"
							>
								Request Details
							</h3>
							<div class="bg-gray-50 rounded-xl p-4 space-y-3">
								<div
									class="grid grid-cols-1 sm:grid-cols-2 gap-3"
								>
									<div>
										<p class="text-xs text-gray-500 mb-0.5">
											Customer
										</p>
										<p
											class="text-sm font-medium text-gray-900"
										>
											{{
												selectedRequest.customerName ||
												selectedRequest.customer
													?.name ||
												"—"
											}}
										</p>
									</div>
									<div>
										<p class="text-xs text-gray-500 mb-0.5">
											Service
										</p>
										<p
											class="text-sm font-medium text-gray-900"
										>
											{{
												selectedRequest.serviceName ||
												selectedRequest.service?.name ||
												"—"
											}}
										</p>
									</div>
									<div v-if="selectedRequest.preferredDate">
										<p class="text-xs text-gray-500 mb-0.5">
											Preferred Date
										</p>
										<p
											class="text-sm font-medium text-gray-900"
										>
											{{
												formatDate(
													selectedRequest.preferredDate,
												)
											}}
										</p>
									</div>
									<div>
										<p class="text-xs text-gray-500 mb-0.5">
											Submitted
										</p>
										<p
											class="text-sm font-medium text-gray-900"
										>
											{{
												formatDate(
													selectedRequest.createdAt ||
														selectedRequest.created_at,
												) || "—"
											}}
										</p>
									</div>
									<div
										v-if="
											selectedRequest.company?.name ||
											selectedRequest.companyName
										"
									>
										<p class="text-xs text-gray-500 mb-0.5">
											Company
										</p>
										<p
											class="text-sm font-medium text-gray-900"
										>
											{{
												selectedRequest.company?.name ||
												selectedRequest.companyName
											}}
										</p>
									</div>
									<div>
										<p class="text-xs text-gray-500 mb-0.5">
											Request ID
										</p>
										<p
											class="text-sm font-mono text-gray-700"
										>
											#{{ selectedRequest.id }}
										</p>
									</div>
								</div>
								<div
									v-if="
										selectedRequest.notes ||
										selectedRequest.description
									"
								>
									<p class="text-xs text-gray-500 mb-0.5">
										Notes / Description
									</p>
									<p
										class="text-sm text-gray-700 whitespace-pre-line"
									>
										{{
											selectedRequest.notes ||
											selectedRequest.description
										}}
									</p>
								</div>
							</div>
						</div>

						<!-- Existing Quotes -->
						<div
							v-if="
								selectedRequest.quotes &&
								selectedRequest.quotes.length
							"
						>
							<h3
								class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3"
							>
								Quotes Sent
							</h3>
							<div class="space-y-2">
								<div
									v-for="quote in selectedRequest.quotes"
									:key="quote.id"
									class="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start justify-between gap-4"
								>
									<div>
										<p
											class="text-sm font-semibold text-blue-900"
										>
											${{
												Number(
													quote.totalPrice ??
														quote.total_price ??
														0,
												).toFixed(2)
											}}
										</p>
										<p
											v-if="quote.details"
											class="text-xs text-blue-700 mt-0.5"
										>
											{{ quote.details }}
										</p>
										<p class="text-xs text-blue-500 mt-1">
											{{
												formatDate(
													quote.createdAt ||
														quote.created_at,
												)
											}}
										</p>
									</div>
									<span
										:class="[
											'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
											getStatusColor(quote.status),
										]"
									>
										{{
											formatStatus(
												quote.status || "pending",
											)
										}}
									</span>
								</div>
							</div>
						</div>

						<!-- Send Quote (only when pending) -->
						<div
							v-if="
								selectedRequest.status === 'pending' &&
								canManageServices
							"
						>
							<h3
								class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3"
							>
								Send a Quote
							</h3>
							<div
								class="bg-white border border-gray-200 rounded-xl p-4 space-y-3"
							>
								<div>
									<label
										class="block text-sm font-medium text-gray-700 mb-1"
									>
										Total Price
										<span class="text-red-500">*</span>
									</label>
									<div class="relative">
										<span
											class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 text-sm pointer-events-none"
											>€</span
										>
										<input
											v-model.number="
												quoteForm.totalPrice
											"
											type="number"
											min="0"
											step="0.01"
											placeholder="0.00"
											class="block w-full pl-8 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D65AE] focus:border-transparent text-sm transition-all"
										/>
									</div>
								</div>
								<div>
									<label
										class="block text-sm font-medium text-gray-700 mb-1"
										>Mensaje para el cliente (correo / presentación)</label
									>
									<p
										class="text-xs text-gray-500 mb-2 leading-relaxed"
									>
										Redacción profesional en español para acompañar la
										cotización. Puede usar la plantilla y luego refinar con
										IA.
									</p>
									<div
										class="flex flex-col sm:flex-row flex-wrap gap-2 mb-2"
									>
										<button
											type="button"
											@click="fillQuoteTemplateEsp"
											class="inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-800 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-[#0D65AE] focus:ring-offset-1 transition-all"
										>
											<svg
												class="w-4 h-4 text-[#0D65AE]"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
												/>
											</svg>
											Plantilla profesional (ESP)
										</button>
										<button
											type="button"
											@click="runQuoteAiEsp"
											:disabled="quoteAiGenerating"
											class="inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-indigo-800 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1 disabled:opacity-60 transition-all"
										>
											<svg
												v-if="quoteAiGenerating"
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
												/>
												<path
													class="opacity-75"
													fill="currentColor"
													d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
												/>
											</svg>
											<svg
												v-else
												class="w-4 h-4"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
												/>
											</svg>
											{{
												quoteAiGenerating
													? "Generando…"
													: "Generar texto con IA"
											}}
										</button>
									</div>
									<textarea
										v-model="quoteForm.details"
										rows="6"
										placeholder="Según requerimientos recibidos… importe, alcance, plazos. Use los botones de arriba para empezar con una redacción profesional."
										class="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D65AE] focus:border-transparent text-sm transition-all resize-y min-h-[120px]"
									/>
								</div>
								<button
									@click="submitQuote"
									:disabled="
										submittingQuote || !quoteForm.totalPrice
									"
									class="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-[#0D65AE] rounded-lg hover:bg-[#0D65AE]/90 focus:ring-2 focus:ring-[#0D65AE] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
								>
									<svg
										v-if="submittingQuote"
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
										/>
										<path
											class="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										/>
									</svg>
									<svg
										v-else
										class="w-4 h-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
										/>
									</svg>
									{{
										submittingQuote
											? "Sending..."
											: "Send Quote"
									}}
								</button>
							</div>
						</div>

						<!-- Update Status -->
						<div v-if="canManageServices || canUpdateRequestStatus">
							<h3
								class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3"
							>
								Update Status
							</h3>
							<div
								class="bg-white border border-gray-200 rounded-xl p-4"
							>
								<div class="flex flex-col sm:flex-row gap-3">
									<select
										v-model="newStatus"
										class="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D65AE] focus:border-transparent text-sm transition-all"
									>
										<option value="" disabled>
											Select new status…
										</option>
										<option value="pending">Pending</option>
										<option value="quoted">Quoted</option>
										<option value="accepted">
											Accepted
										</option>
										<option value="in_progress">
											In Progress
										</option>
										<option value="completed">
											Completed
										</option>
										<option value="cancelled">
											Cancelled
										</option>
									</select>
									<button
										@click="submitStatusUpdate"
										:disabled="
											updatingStatus ||
											!newStatus ||
											newStatus === selectedRequest.status
										"
										class="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
									>
										<svg
											v-if="updatingStatus"
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
											/>
											<path
												class="opacity-75"
												fill="currentColor"
												d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
											/>
										</svg>
										<svg
											v-else
											class="w-4 h-4"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
											/>
										</svg>
										{{
											updatingStatus
												? "Updating..."
												: "Update Status"
										}}
									</button>
								</div>
								<p
									v-if="newStatus === selectedRequest.status"
									class="mt-2 text-xs text-gray-400"
								>
									This is already the current status.
								</p>
							</div>
						</div>

						<!-- Assign Employee (admins only) -->
						<div v-if="canManageMembers && members.length">
							<h3
								class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3"
							>
								Assign Employee
							</h3>
							<div
								class="bg-white border border-gray-200 rounded-xl p-4"
							>
								<div class="flex flex-col sm:flex-row gap-3">
									<select
										v-model="selectedEmployee"
										class="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D65AE] focus:border-transparent text-sm transition-all"
									>
										<option :value="null" disabled>
											Select an employee…
										</option>
										<option
											v-for="member in members"
											:key="
												member.user_uuid ||
												member.uuid ||
												member.id
											"
											:value="
												member.user_uuid ||
												member.uuid ||
												member.id
											"
										>
											{{
												member.user_name ||
												member.name ||
												member.user?.name ||
												member.user_email ||
												`Member #${member.user_uuid || member.id}`
											}}
											<template
												v-if="
													member.role_in_company ||
													member.role
												"
											>
												—
												{{
													member.role_in_company ||
													member.role
												}}</template
											>
										</option>
									</select>
									<button
										@click="submitAssignEmployee"
										:disabled="
											assigningEmployee ||
											!selectedEmployee
										"
										class="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
									>
										<svg
											v-if="assigningEmployee"
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
											/>
											<path
												class="opacity-75"
												fill="currentColor"
												d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
											/>
										</svg>
										<svg
											v-else
											class="w-4 h-4"
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
										{{
											assigningEmployee
												? "Assigning..."
												: "Assign"
										}}
									</button>
								</div>

								<!-- Currently Assigned -->
								<div
									v-if="
										selectedRequest.assignedEmployee ||
										selectedRequest.employee
									"
									class="mt-3 flex items-center gap-2 text-sm text-gray-600"
								>
									<svg
										class="w-4 h-4 text-green-500 flex-shrink-0"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fill-rule="evenodd"
											d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
											clip-rule="evenodd"
										/>
									</svg>
									<span>
										Currently assigned to
										<strong class="text-gray-900">
											{{
												(
													selectedRequest.assignedEmployee ||
													selectedRequest.employee
												)?.name || "an employee"
											}}
										</strong>
									</span>
								</div>
							</div>
						</div>
					</div>

					<!-- Modal Footer -->
					<div
						class="flex-shrink-0 px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end"
					>
						<button
							@click="closeModal"
							class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-[#0D65AE] focus:ring-offset-2 transition-all"
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
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
							Close
						</button>
					</div>
				</div>
			</div>
		</Transition>
	</Teleport>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { usePermissions } from "@/composables/usePermissions";
import { useToast } from "@/composables/useToast";
import { useAuthStore } from "@/stores/auth.store";
import { useQuoteAiAssist } from "@/composables/useQuoteAiAssist";
import {
	getMyCompanyServiceRequests,
	getMyCompanyMembers,
	assignEmployeeMyCompany,
	createMyCompanyQuote,
	updateMyCompanyServiceRequestStatus,
} from "@/api/companies.api";

// ─── Composables ──────────────────────────────────────────────────────────────
const router = useRouter();
const authStore = useAuthStore();
const { showSuccess, showError, showInfo } = useToast();
const { canManageServices, canManageMembers, canUpdateRequestStatus } =
	usePermissions();
const { quoteAiGenerating, applyTemplateEsp, composeWithAiEsp } =
	useQuoteAiAssist();

const companyDisplayName = computed(() => {
	const c = authStore.state.user?.companies?.[0];
	return c?.name || c?.company_name || "SureBox";
});

// ─── State ────────────────────────────────────────────────────────────────────
const loading = ref(false);
const loadError = ref(null);
const requests = ref([]);
const members = ref([]);

// Filters
const searchQuery = ref("");
const selectedStatus = ref(null);
const sortBy = ref("newest");

// Pagination
const currentPage = ref(1);
const rowsPerPage = ref(6);

// Modal
const showModal = ref(false);
const selectedRequest = ref(null);

// Quote form
const quoteForm = ref({ totalPrice: "", details: "" });
const submittingQuote = ref(false);

// Status update
const newStatus = ref("");
const updatingStatus = ref(false);

// Employee assignment
const selectedEmployee = ref(null);
const assigningEmployee = ref(false);

// ─── Static options ───────────────────────────────────────────────────────────
const statusOptions = [
	{ label: "All Requests", value: null },
	{ label: "Pending", value: "pending" },
	{ label: "Quoted", value: "quoted" },
	{ label: "Accepted", value: "accepted" },
	{ label: "In Progress", value: "in_progress" },
	{ label: "Completed", value: "completed" },
	{ label: "Cancelled", value: "cancelled" },
];

const sortOptions = [
	{ label: "Newest First", value: "newest" },
	{ label: "Oldest First", value: "oldest" },
	{ label: "Status (A–Z)", value: "status" },
];

// ─── Derived counts ───────────────────────────────────────────────────────────
const pendingCount = computed(
	() => requests.value.filter((r) => r.status === "pending").length,
);
const inProgressCount = computed(
	() => requests.value.filter((r) => r.status === "in_progress").length,
);
const completedCount = computed(
	() => requests.value.filter((r) => r.status === "completed").length,
);

// ─── Filtered & sorted list ───────────────────────────────────────────────────
const filteredRequests = computed(() => {
	let list = [...requests.value];

	// Search by customer name or service name
	if (searchQuery.value) {
		const q = searchQuery.value.toLowerCase();
		list = list.filter((r) => {
			const customer = (
				r.customerName ||
				r.customer?.name ||
				""
			).toLowerCase();
			const service = (
				r.serviceName ||
				r.service?.name ||
				""
			).toLowerCase();
			const notes = (r.notes || r.description || "").toLowerCase();
			return (
				customer.includes(q) || service.includes(q) || notes.includes(q)
			);
		});
	}

	// Status filter
	if (selectedStatus.value) {
		list = list.filter((r) => r.status === selectedStatus.value);
	}

	// Sort
	switch (sortBy.value) {
		case "newest":
			list.sort(
				(a, b) =>
					new Date(b.createdAt || b.created_at || 0) -
					new Date(a.createdAt || a.created_at || 0),
			);
			break;
		case "oldest":
			list.sort(
				(a, b) =>
					new Date(a.createdAt || a.created_at || 0) -
					new Date(b.createdAt || b.created_at || 0),
			);
			break;
		case "status":
			list.sort((a, b) => (a.status || "").localeCompare(b.status || ""));
			break;
	}

	return list;
});

const paginatedRequests = computed(() => {
	const start = (currentPage.value - 1) * rowsPerPage.value;
	return filteredRequests.value.slice(start, start + rowsPerPage.value);
});

const totalPages = computed(() =>
	Math.ceil(filteredRequests.value.length / rowsPerPage.value),
);

// Reset to page 1 when filters change
watch([searchQuery, selectedStatus, sortBy], () => {
	currentPage.value = 1;
});

// ─── Data loading ─────────────────────────────────────────────────────────────
const loadRequests = async () => {
	loading.value = true;
	loadError.value = null;
	try {
		const res = await getMyCompanyServiceRequests({ page: 1, limit: 200 });
		// Handle both { data: [...] } and direct array responses
		requests.value = Array.isArray(res)
			? res
			: Array.isArray(res?.data)
				? res.data
				: [];
	} catch (err) {
		loadError.value = err.message || "Failed to load service requests.";
		showError(loadError.value);
	} finally {
		loading.value = false;
	}
};

const loadMembers = async () => {
	try {
		const res = await getMyCompanyMembers({ limit: 200 });
		members.value = Array.isArray(res)
			? res
			: Array.isArray(res?.data)
				? res.data
				: [];
	} catch {
		// Non-critical; silently fail
	}
};

// ─── Modal ────────────────────────────────────────────────────────────────────
const openModal = (request) => {
	selectedRequest.value = request;
	showModal.value = true;
	// Pre-fill status selector
	newStatus.value = request.status || "";
	// Reset forms
	quoteForm.value = { totalPrice: "", details: "" };
	selectedEmployee.value = null;
};

const closeModal = () => {
	showModal.value = false;
	// Small delay so the close animation plays cleanly
	setTimeout(() => {
		selectedRequest.value = null;
		newStatus.value = "";
		quoteForm.value = { totalPrice: "", details: "" };
		selectedEmployee.value = null;
	}, 200);
};

// ─── Actions ──────────────────────────────────────────────────────────────────
function fillQuoteTemplateEsp() {
	if (!selectedRequest.value) return;
	quoteForm.value.details = applyTemplateEsp(
		selectedRequest.value,
		companyDisplayName.value,
		quoteForm.value.totalPrice,
	);
	showSuccess(
		"Plantilla en español insertada. Ajuste el importe o el texto y envíe la cotización.",
	);
}

async function runQuoteAiEsp() {
	if (!selectedRequest.value) return;
	await composeWithAiEsp({
		request: selectedRequest.value,
		companyName: companyDisplayName.value,
		totalPrice: quoteForm.value.totalPrice,
		setDetails: (text) => {
			quoteForm.value.details = text;
		},
		toast: { showSuccess, showError, showInfo },
	});
}

const submitQuote = async () => {
	if (!selectedRequest.value || !quoteForm.value.totalPrice) return;

	submittingQuote.value = true;
	try {
		const payload = {
			totalPrice: Number(quoteForm.value.totalPrice),
			details: quoteForm.value.details || undefined,
		};
		const requestId =
			selectedRequest.value.uuid || selectedRequest.value.id;
		const res = await createMyCompanyQuote(requestId, payload);

		showSuccess("Quote sent successfully!");

		// Patch the local request with the returned data / push quote into array
		const returned = res?.data || res;
		if (returned) {
			const idx = requests.value.findIndex(
				(r) => (r.uuid || r.id) === requestId,
			);
			const merged = {
				...selectedRequest.value,
				status: returned.status || "quoted",
				quotes: [
					...(selectedRequest.value.quotes || []),
					returned.quote || returned,
				],
			};
			if (idx !== -1) requests.value[idx] = merged;
			selectedRequest.value = merged;
		}

		quoteForm.value = { totalPrice: "", details: "" };
	} catch (err) {
		showError(err.message || "Failed to send quote.");
	} finally {
		submittingQuote.value = false;
	}
};

const submitStatusUpdate = async () => {
	if (!selectedRequest.value || !newStatus.value) return;
	if (newStatus.value === selectedRequest.value.status) return;

	updatingStatus.value = true;
	try {
		const requestId =
			selectedRequest.value.uuid || selectedRequest.value.id;
		const res = await updateMyCompanyServiceRequestStatus(
			requestId,
			newStatus.value,
		);

		showSuccess(`Status updated to "${formatStatus(newStatus.value)}"`);

		const returned = res?.data || res;
		const updated = {
			...selectedRequest.value,
			status: returned?.status || newStatus.value,
		};

		const idx = requests.value.findIndex(
			(r) => (r.uuid || r.id) === requestId,
		);
		if (idx !== -1) requests.value[idx] = updated;
		selectedRequest.value = updated;
	} catch (err) {
		showError(err.message || "Failed to update status.");
	} finally {
		updatingStatus.value = false;
	}
};

const submitAssignEmployee = async () => {
	if (!selectedRequest.value || !selectedEmployee.value) return;

	assigningEmployee.value = true;
	try {
		const requestId =
			selectedRequest.value.uuid || selectedRequest.value.id;
		const res = await assignEmployeeMyCompany(
			requestId,
			selectedEmployee.value,
		);

		showSuccess("Employee assigned successfully!");

		const returned = res?.data || res;
		const assignedMember = members.value.find(
			(m) => (m.user_uuid || m.uuid || m.id) === selectedEmployee.value,
		);
		const updated = {
			...selectedRequest.value,
			assignedEmployee: returned?.employee ||
				assignedMember || { id: selectedEmployee.value },
		};

		const idx = requests.value.findIndex(
			(r) => (r.uuid || r.id) === requestId,
		);
		if (idx !== -1) requests.value[idx] = updated;
		selectedRequest.value = updated;
		selectedEmployee.value = null;
	} catch (err) {
		showError(err.message || "Failed to assign employee.");
	} finally {
		assigningEmployee.value = false;
	}
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getStatusColor = (status) => {
	const map = {
		pending: "bg-yellow-100 text-yellow-800",
		quoted: "bg-blue-100 text-blue-800",
		accepted: "bg-indigo-100 text-indigo-800",
		in_progress: "bg-blue-100 text-blue-800",
		completed: "bg-green-100 text-green-800",
		cancelled: "bg-red-100 text-red-800",
		rejected: "bg-red-100 text-red-800",
	};
	return map[(status || "").toLowerCase()] || "bg-gray-100 text-gray-700";
};

const formatStatus = (status) => {
	if (!status) return "Unknown";
	return status
		.replace(/_/g, " ")
		.split(" ")
		.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
		.join(" ");
};

const formatDate = (dateStr) => {
	if (!dateStr) return "";
	return new Date(dateStr).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
};

// ─── Lifecycle ────────────────────────────────────────────────────────────────
onMounted(() => {
	loadRequests();
	loadMembers();
});
</script>

<style scoped>
.line-clamp-1 {
	display: -webkit-box;
	-webkit-line-clamp: 1;
	-webkit-box-orient: vertical;
	overflow: hidden;
}

.line-clamp-2 {
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
}

/* Modal transitions */
.modal-enter-active,
.modal-leave-active {
	transition: opacity 0.2s ease;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
	transition:
		transform 0.2s ease,
		opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
	opacity: 0;
}

.modal-enter-from .relative {
	transform: scale(0.96) translateY(8px);
	opacity: 0;
}

.modal-leave-to .relative {
	transform: scale(0.96) translateY(8px);
	opacity: 0;
}
</style>
