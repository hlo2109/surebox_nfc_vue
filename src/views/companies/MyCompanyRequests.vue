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

			<!-- Requests table -->
			<div
				v-else
				class="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm"
			>
				<div class="overflow-x-auto">
					<table class="min-w-full text-sm text-left">
						<thead
							class="bg-gray-50 text-gray-600 font-medium border-b border-gray-200"
						>
							<tr>
								<th class="px-4 py-3 whitespace-nowrap">Service</th>
								<th class="px-4 py-3 whitespace-nowrap">Customer</th>
								<th
									class="px-4 py-3 whitespace-nowrap hidden sm:table-cell"
								>
									Assignee
								</th>
								<th class="px-4 py-3 whitespace-nowrap">Status</th>
								<th class="px-4 py-3 whitespace-nowrap hidden md:table-cell">
									Preferred
								</th>
								<th class="px-4 py-3 whitespace-nowrap hidden lg:table-cell">
									Submitted
								</th>
								<th class="px-4 py-3 text-right whitespace-nowrap">Actions</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-100">
							<tr
								v-for="request in paginatedRequests"
								:key="request.uuid"
								class="hover:bg-gray-50/80 cursor-pointer transition-colors"
								@click="openModal(request)"
							>
								<td class="px-4 py-3 align-top">
									<div class="font-medium text-gray-900 max-w-[200px] sm:max-w-xs truncate">
										{{
											request.serviceName ||
											request.service?.name ||
											"Service"
										}}
									</div>
									<div
										v-if="request.notes || request.description"
										class="text-xs text-gray-500 line-clamp-1 mt-0.5 max-w-[220px] sm:max-w-md"
									>
										{{ request.notes || request.description }}
									</div>
								</td>
								<td class="px-4 py-3 align-top text-gray-700 max-w-[140px] truncate">
									{{
										request.customerName ||
										request.customer?.name ||
										"—"
									}}
									<div
										v-if="
											request.customerEmail ||
											request.customer_email
										"
										class="text-xs text-gray-500 truncate mt-0.5"
									>
										{{
											request.customerEmail ||
												request.customer_email
										}}
									</div>
								</td>
								<td
									class="px-4 py-3 align-top text-gray-600 max-w-[160px] truncate hidden sm:table-cell text-xs"
									:title="formatAssigneesLine(request, false)"
								>
									{{ formatAssigneesLine(request) }}
								</td>
								<td class="px-4 py-3 align-top">
									<span
										:class="[
											'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
											getStatusColor(request.status),
										]"
									>
										{{ formatStatus(request.status) }}
									</span>
								</td>
								<td class="px-4 py-3 align-top text-gray-600 hidden md:table-cell whitespace-nowrap">
									{{
										request.preferredDate
											? formatDate(request.preferredDate)
											: "—"
									}}
								</td>
								<td class="px-4 py-3 align-top text-gray-600 hidden lg:table-cell whitespace-nowrap">
									{{
										formatDate(
											request.createdAt || request.created_at,
										) || "—"
									}}
								</td>
								<td class="px-4 py-3 align-top text-right whitespace-nowrap">
									<button
										type="button"
										@click.stop="openModal(request)"
										class="text-[#0D65AE] hover:underline font-medium text-xs sm:text-sm mr-2"
									>
										Detail
									</button>
									<button
										type="button"
										@click.stop="
											router.push({
												name: 'RequestDetail',
												params: { id: request.uuid },
											})
										"
										class="text-gray-600 hover:text-gray-900 text-xs sm:text-sm"
									>
										Page
									</button>
								</td>
							</tr>
						</tbody>
					</table>
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
										<p
											v-if="
												selectedRequest.customerEmail ||
												selectedRequest.customer_email
											"
											class="text-xs text-gray-600 mt-1"
										>
											{{
												selectedRequest.customerEmail ||
													selectedRequest.customer_email
											}}
										</p>
										<p
											v-if="
												selectedRequest.customerPhone ||
												selectedRequest.customer_phone
											"
											class="text-xs text-gray-600"
										>
											{{
												selectedRequest.customerPhone ||
													selectedRequest.customer_phone
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
											Reference (UUID)
										</p>
										<p
											class="text-sm font-mono text-gray-700 break-all"
										>
											{{ selectedRequest.uuid || "—" }}
										</p>
									</div>
								</div>
								<div
									v-if="
										selectedRequest.location?.address ||
										selectedRequest.location?.nickname
									"
									class="pt-2 border-t border-gray-200"
								>
									<p class="text-xs text-gray-500 mb-0.5">
										Service location (customer NFC)
									</p>
									<p class="text-sm text-gray-800">
										<span
											v-if="selectedRequest.location?.nickname"
											class="font-medium"
											>{{ selectedRequest.location.nickname }}</span
										>
										<span
											v-if="selectedRequest.location?.address"
											:class="
												selectedRequest.location?.nickname
													? ' text-gray-600'
													: ''
											"
										>
											{{
												selectedRequest.location.nickname
													? ` · ${selectedRequest.location.address}`
													: selectedRequest.location.address
											}}
										</span>
									</p>
									<p
										v-if="selectedRequest.location?.code"
										class="text-xs text-gray-500 mt-1 font-mono"
									>
										Code: {{ selectedRequest.location.code }}
									</p>
								</div>
								<div
									v-if="
										requestAssignmentsList(selectedRequest)
											.length
									"
									class="pt-2 border-t border-gray-200"
								>
									<p class="text-xs text-gray-500 mb-0.5">
										Assigned
										{{
											requestAssignmentsList(
												selectedRequest,
											).length > 1
												? "employees"
												: "employee"
										}}
									</p>
									<ul class="text-sm text-gray-900 space-y-1">
										<li
											v-for="(a, idx) in requestAssignmentsList(
												selectedRequest,
											)"
											:key="a.uuid || a.employeeUuid || idx"
										>
											<span class="font-medium">{{
												a.employeeName || "—"
											}}</span>
											<span
												v-if="a.status"
												class="text-xs font-normal text-gray-500 ml-1"
											>
												({{ formatStatus(a.status) }})
											</span>
										</li>
									</ul>
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
									:key="quote.uuid || quote.id"
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

						<!-- Company activity (status changes + notes) -->
						<div
							v-if="
								selectedRequest.companyActivityLog &&
								selectedRequest.companyActivityLog.length
							"
						>
							<h3
								class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3"
							>
								Company activity
							</h3>
							<ul class="space-y-2 max-h-48 overflow-y-auto pr-1">
								<li
									v-for="(entry, idx) in [
										...selectedRequest.companyActivityLog,
									].reverse()"
									:key="`${entry.at || 'e'}-${idx}`"
									class="text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2"
								>
									<div class="text-slate-500 mb-0.5">
										{{ formatDateTime(entry.at) }}
										<span v-if="entry.fromStatus || entry.toStatus">
											·
											{{ formatStatus(entry.fromStatus) }} →
											{{ formatStatus(entry.toStatus) }}
										</span>
									</div>
									<p
										v-if="entry.message"
										class="text-slate-800 whitespace-pre-wrap"
									>
										{{ entry.message }}
									</p>
								</li>
							</ul>
						</div>

						<!-- Send Quote: only quote-priced services while pending -->
						<div
							v-if="
								selectedRequest.status === 'pending' &&
								canManageServices &&
								isQuotePricingRequest(selectedRequest)
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
								class="bg-white border border-gray-200 rounded-xl p-4 space-y-3"
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
										class="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shrink-0"
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
								<div>
									<label
										class="block text-sm font-medium text-gray-700 mb-1"
									>
										Comment (optional)
									</label>
									<p class="text-xs text-gray-500 mb-2">
										Explain cancellations, note that a quote was sent, or
										any context for your team and the customer record.
									</p>
									<textarea
										v-model="statusChangeComment"
										rows="3"
										placeholder="e.g. Customer asked to cancel — scheduling conflict."
										class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D65AE] focus:border-transparent text-sm resize-y min-h-[72px]"
									/>
								</div>
								<p
									v-if="newStatus === selectedRequest.status"
									class="text-xs text-gray-400"
								>
									This is already the current status.
								</p>
							</div>
						</div>

						<!-- Assign employees (admins only) -->
						<div v-if="canManageMembers && members.length">
							<h3
								class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3"
							>
								Assign employees
							</h3>
							<div
								class="bg-white border border-gray-200 rounded-xl p-4"
							>
								<p
									v-if="!membersAvailableToAssign.length"
									class="text-sm text-gray-500 mb-3"
								>
									All company members are already assigned to
									this request.
								</p>
								<div
									v-else
									class="max-h-48 overflow-y-auto border border-gray-100 rounded-lg divide-y divide-gray-100 mb-3"
								>
									<label
										v-for="member in membersAvailableToAssign"
										:key="
											(member.user_id ??
												member.userId ??
												member.user_uuid) ||
											member.uuid
										"
										class="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 cursor-pointer text-sm"
									>
										<input
											type="checkbox"
											class="rounded border-gray-300 text-green-600 focus:ring-green-500"
											:checked="
												isAssignMemberSelected(member)
											"
											@change="
												toggleAssignMember(member)
											"
										/>
										<span class="text-gray-800">
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
												<span class="text-gray-500">
													—
													{{
														member.role_in_company ||
														member.role
													}}</span
												>
											</template>
										</span>
									</label>
								</div>
								<div class="flex flex-col sm:flex-row gap-3">
									<button
										@click="submitAssignEmployee"
										:disabled="
											assigningEmployee ||
											!selectedAssigneeIds.length
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

								<!-- Currently assigned (summary) -->
								<div
									v-if="
										requestAssignmentsList(selectedRequest)
											.length
									"
									class="mt-3 text-sm text-gray-600"
								>
									<div class="flex items-start gap-2">
										<svg
											class="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path
												fill-rule="evenodd"
												d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
												clip-rule="evenodd"
											/>
										</svg>
										<div>
											<p class="font-medium text-gray-700">
												Currently assigned
											</p>
											<p class="text-gray-800 mt-0.5">
												{{
													formatAssigneesLine(
														selectedRequest,
														false,
													)
												}}
											</p>
										</div>
									</div>
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
import { isQuotePricingRequest } from "@/utils/serviceRequestDisplay";

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
const rowsPerPage = ref(10);

// Modal
const showModal = ref(false);
const selectedRequest = ref(null);

// Quote form
const quoteForm = ref({ totalPrice: "", details: "" });
const submittingQuote = ref(false);

// Status update
const newStatus = ref("");
const statusChangeComment = ref("");
const updatingStatus = ref(false);

// Employee assignment (multi-select; ids match memberOptionValue)
const selectedAssigneeIds = ref([]);
const assigningEmployee = ref(false);

function requestAssignmentsList(req) {
	if (!req) return [];
	const arr = Array.isArray(req.assignments) ? req.assignments : [];
	if (arr.length) return arr;
	return req.assignment ? [req.assignment] : [];
}

function formatAssigneesLine(req, truncate = true) {
	const names = requestAssignmentsList(req)
		.map((a) => a.employeeName)
		.filter(Boolean);
	if (!names.length) return "—";
	if (!truncate || names.length <= 2) return names.join(", ");
	return `${names.slice(0, 2).join(", ")} +${names.length - 2}`;
}

function normalizeAssignRow(c) {
	if (!c) return null;
	return {
		uuid: c.uuid,
		employeeUuid: c.employeeUuid,
		employeeName: c.employeeName,
		status: c.status || "assigned",
		assignedAt: c.assignedAt ?? c.assigned_at,
	};
}

function mergeAssignmentsFromResponse(prev, createdList) {
	const out = prev.map((a) => ({ ...a }));
	const empKeys = new Set(
		out
			.map((a) => (a.employeeUuid || "").toString().toLowerCase())
			.filter(Boolean),
	);
	for (const raw of createdList) {
		const c = normalizeAssignRow(raw);
		if (!c) continue;
		const eu = (c.employeeUuid || "").toString().toLowerCase();
		if (eu && empKeys.has(eu)) {
			const idx = out.findIndex(
				(x) =>
					(x.employeeUuid || "").toString().toLowerCase() === eu,
			);
			if (idx !== -1) out[idx] = { ...out[idx], ...c };
			continue;
		}
		out.push(c);
		if (eu) empKeys.add(eu);
	}
	out.sort(
		(a, b) =>
			new Date(b.assignedAt || 0) - new Date(a.assignedAt || 0),
	);
	return out;
}

const membersAvailableToAssign = computed(() => {
	const req = selectedRequest.value;
	if (!req) return [];
	const assigned = new Set(
		requestAssignmentsList(req)
			.map((a) => (a.employeeUuid || "").toString().toLowerCase())
			.filter(Boolean),
	);
	return members.value.filter((m) => {
		const uid = (m.user_uuid || m.uuid || "").toString().toLowerCase();
		if (uid && assigned.has(uid)) return false;
		return true;
	});
});

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
			const email = (
				r.customerEmail ||
				r.customer_email ||
				""
			).toLowerCase();
			return (
				customer.includes(q) ||
				service.includes(q) ||
				notes.includes(q) ||
				email.includes(q)
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
	const list = requestAssignmentsList(request);
	selectedRequest.value = {
		...request,
		assignments: [...list],
		assignment: list[0] || null,
		companyActivityLog: Array.isArray(request.companyActivityLog)
			? request.companyActivityLog
			: [],
	};
	showModal.value = true;
	// Pre-fill status selector
	newStatus.value = request.status || "";
	statusChangeComment.value = "";
	// Reset forms
	quoteForm.value = { totalPrice: "", details: "" };
	selectedAssigneeIds.value = [];
};

const closeModal = () => {
	showModal.value = false;
	// Small delay so the close animation plays cleanly
	setTimeout(() => {
		selectedRequest.value = null;
		newStatus.value = "";
		statusChangeComment.value = "";
		quoteForm.value = { totalPrice: "", details: "" };
		selectedAssigneeIds.value = [];
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
	if (!isQuotePricingRequest(selectedRequest.value)) {
		showError(
			"This service has a fixed price; quotes are not used for it.",
		);
		return;
	}

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
			statusChangeComment.value,
		);

		showSuccess(`Status updated to "${formatStatus(newStatus.value)}"`);

		const payload = res?.data ?? res;
		const updated = {
			...selectedRequest.value,
			status: payload?.status || newStatus.value,
			companyActivityLog: Array.isArray(payload?.companyActivityLog)
				? payload.companyActivityLog
				: selectedRequest.value.companyActivityLog || [],
		};

		const idx = requests.value.findIndex(
			(r) => (r.uuid || r.id) === requestId,
		);
		if (idx !== -1) requests.value[idx] = updated;
		selectedRequest.value = updated;
		statusChangeComment.value = "";
		newStatus.value = updated.status || "";
	} catch (err) {
		showError(err.message || "Failed to update status.");
	} finally {
		updatingStatus.value = false;
	}
};

const memberOptionValue = (member) =>
	member.user_id ??
	member.userId ??
	member.user_uuid ??
	member.uuid ??
	null;

function toggleAssignMember(member) {
	const v = memberOptionValue(member);
	if (v == null) return;
	const cur = selectedAssigneeIds.value;
	const i = cur.indexOf(v);
	if (i === -1) selectedAssigneeIds.value = [...cur, v];
	else selectedAssigneeIds.value = cur.filter((x) => x !== v);
}

function isAssignMemberSelected(member) {
	const v = memberOptionValue(member);
	if (v == null) return false;
	return selectedAssigneeIds.value.includes(v);
}

const submitAssignEmployee = async () => {
	const ids = selectedAssigneeIds.value;
	if (!selectedRequest.value || !ids.length) return;

	assigningEmployee.value = true;
	try {
		const requestId =
			selectedRequest.value.uuid || selectedRequest.value.id;
		const payload = ids.length === 1 ? ids[0] : [...ids];
		const res = await assignEmployeeMyCompany(requestId, payload);

		showSuccess(
			ids.length > 1
				? "Employees assigned successfully."
				: "Employee assigned successfully.",
		);

		const returned = res?.data ?? res;
		const createdList = Array.isArray(returned)
			? returned
			: returned
				? [returned]
				: [];
		const prev = requestAssignmentsList(selectedRequest.value);
		const merged = mergeAssignmentsFromResponse(prev, createdList);
		const updated = {
			...selectedRequest.value,
			assignments: merged,
			assignment: merged[0] || null,
		};

		const idx = requests.value.findIndex(
			(r) => (r.uuid || r.id) === requestId,
		);
		if (idx !== -1) requests.value[idx] = updated;
		selectedRequest.value = updated;
		selectedAssigneeIds.value = [];
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

const formatDateTime = (dateStr) => {
	if (!dateStr) return "";
	return new Date(dateStr).toLocaleString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
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
