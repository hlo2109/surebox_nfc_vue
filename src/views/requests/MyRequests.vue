<template>
	<div class="bg-gray-50 p-4 sm:p-6 lg:p-8">
		<div class="max-w-7xl mx-auto">
			<!-- Header Section -->
			<div class="mb-6 sm:mb-8">
				<div
					class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
				>
					<div>
						<h1
							class="text-3xl sm:text-4xl font-bold text-gray-900 mb-1 sm:mb-2"
						>
							My Service Requests
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
								></path>
							</svg>
							Track and manage all your service requests
						</p>
					</div>
					<div class="flex items-center gap-2 sm:gap-3">
						<button
							@click="loadRequests"
							:disabled="state.isLoading"
							class="inline-flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-[#0D65AE] focus:ring-offset-2 disabled:opacity-50 transition-all"
						>
							<svg
								:class="[
									'w-4 h-4',
									state.isLoading ? 'animate-spin' : '',
								]"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
								></path>
							</svg>
							<span class="hidden sm:inline">Refresh</span>
						</button>
						<button
							v-if="canCreateRequest"
							@click="navigateToCreate"
							class="inline-flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-medium text-white bg-[#0D65AE] rounded-lg hover:bg-[#0D65AE]/90 focus:ring-2 focus:ring-[#0D65AE] focus:ring-offset-2 transition-all"
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
									d="M12 4v16m8-8H4"
								></path>
							</svg>
							<span>New Request</span>
						</button>
					</div>
				</div>
			</div>

			<!-- Stats Cards -->
			<div
				class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8"
			>
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
								{{ pendingRequests.length }}
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
									></path>
								</svg>
								<span>Awaiting response</span>
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
								></path>
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
								{{ inProgressRequests.length }}
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
									></path>
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
								></path>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
								></path>
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
								{{ completedRequests.length }}
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
									></path>
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
								></path>
							</svg>
						</div>
					</div>
				</div>

				<!-- Total -->
				<div
					class="bg-white rounded-xl border border-gray-200 hover:border-purple-400 transition-all p-5 sm:p-6"
				>
					<div class="flex items-center justify-between">
						<div class="flex-1">
							<p
								class="text-gray-500 text-xs sm:text-sm font-medium mb-1 sm:mb-2"
							>
								Total Requests
							</p>
							<h3
								class="text-2xl sm:text-3xl font-bold text-gray-900"
							>
								{{ serviceRequestsCount }}
							</h3>
							<p
								class="text-purple-600 text-xs sm:text-sm mt-2 flex items-center gap-1"
							>
								<svg
									class="w-3 h-3 sm:w-4 sm:h-4"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path
										d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"
									></path>
									<path
										fill-rule="evenodd"
										d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
										clip-rule="evenodd"
									></path>
								</svg>
								<span>All time</span>
							</p>
						</div>
						<div
							class="bg-purple-50 p-3 sm:p-4 rounded-xl border border-purple-200"
						>
							<svg
								class="w-6 h-6 sm:w-8 sm:h-8 text-purple-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
								></path>
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
									></path>
								</svg>
							</div>
							<input
								v-model="searchQuery"
								type="text"
								placeholder="Search requests..."
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
								v-for="option in statusOptions"
								:key="option.value"
								:value="option.value"
							>
								{{ option.label }}
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
								v-for="option in sortOptions"
								:key="option.value"
								:value="option.value"
							>
								{{ option.label }}
							</option>
						</select>
					</div>
				</div>
			</div>

			<!-- Loading State -->
			<div
				v-if="state.isLoading && !state.serviceRequests.length"
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
					></circle>
					<path
						class="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					></path>
				</svg>
				<p class="text-gray-600 font-medium">
					Loading service requests...
				</p>
			</div>

			<!-- Error State -->
			<div
				v-else-if="state.error"
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
						></path>
					</svg>
				</div>
				<h3 class="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
					Error Loading Requests
				</h3>
				<p class="text-gray-600 mb-6">{{ state.error }}</p>
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
						></path>
					</svg>
					<span>Try Again</span>
				</button>
			</div>

			<!-- Empty State -->
			<div
				v-else-if="
					!filteredRequests.length && !searchQuery && !selectedStatus
				"
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
						></path>
					</svg>
				</div>
				<h3 class="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
					No service requests yet
				</h3>
				<p class="text-gray-600 mb-6 max-w-md mx-auto">
					Create your first service request to get started with
					booking services from companies
				</p>
				<button
					v-if="canCreateRequest"
					@click="navigateToCreate"
					class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0D65AE] rounded-lg hover:bg-[#0D65AE]/90 focus:ring-2 focus:ring-[#0D65AE] focus:ring-offset-2 transition-all"
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
							d="M12 4v16m8-8H4"
						></path>
					</svg>
					<span>Create Request</span>
				</button>
			</div>

			<!-- No Results State -->
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
						></path>
					</svg>
				</div>
				<h3 class="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
					No requests found
				</h3>
				<p class="text-gray-600 max-w-md mx-auto">
					No requests match your current filters. Try adjusting your
					search or filters.
				</p>
			</div>

			<!-- Requests Grid -->
			<div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
				<div
					v-for="request in paginatedRequests"
					:key="request.uuid"
					class="bg-white rounded-xl border border-gray-200 hover:border-[#0D65AE] hover:shadow-lg transition-all p-5 sm:p-6 cursor-pointer group"
					@click="handleRequestClick(request)"
				>
					<!-- Request Header -->
					<div class="flex items-start justify-between mb-4">
						<div class="flex-1 min-w-0">
							<h3
								class="font-semibold text-lg text-gray-900 group-hover:text-[#0D65AE] transition-colors line-clamp-1 mb-1"
							>
								{{ request.service?.name || "Service Request" }}
							</h3>
							<p
								v-if="request.service?.company"
								class="text-sm text-gray-600 flex items-center gap-1"
							>
								<svg
									class="w-4 h-4 text-gray-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
									></path>
								</svg>
								{{ request.service.company.name }}
							</p>
						</div>
						<span
							:class="[
								'flex-shrink-0 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
								getStatusColor(request.status),
							]"
						>
							{{ formatStatus(request.status) }}
						</span>
					</div>

					<!-- Request Description -->
					<p
						v-if="request.description"
						class="text-sm text-gray-600 line-clamp-2 mb-4"
					>
						{{ request.description }}
					</p>

					<!-- Request Details -->
					<div class="space-y-2 mb-4">
						<div
							v-if="request.location"
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
									d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
								></path>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
								></path>
							</svg>
							<span class="truncate">{{ request.location }}</span>
						</div>
						<div
							v-if="request.budget"
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
									d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								></path>
							</svg>
							<span>Budget: ${{ request.budget }}</span>
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
									d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
								></path>
							</svg>
							<span>{{
								formatDate(
									request.createdAt || request.created_at,
								)
							}}</span>
						</div>
					</div>

					<!-- Request Footer -->
					<div
						class="flex items-center justify-between pt-4 border-t border-gray-100"
					>
						<div class="text-xs text-gray-500">
							<span>Request #{{ request.uuid }}</span>
						</div>
						<button
							@click.stop="handleRequestClick(request)"
							class="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-[#0D65AE] bg-[#0D65AE]/5 rounded-lg hover:bg-[#0D65AE]/10 transition-colors"
						>
							<span>View Details</span>
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
								></path>
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
						></path>
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
						></path>
					</svg>
				</button>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useServiceRequests } from "@/composables/useServiceRequests";
import { usePermissions } from "@/composables/usePermissions";
import { useToast } from "@/composables/useToast";

const router = useRouter();
const { showError } = useToast();
const { canCreateRequest } = usePermissions();

const {
	state,
	fetchServiceRequests,
	serviceRequestsCount,
	pendingRequests,
	inProgressRequests,
	completedRequests,
} = useServiceRequests();

// Filters and search
const searchQuery = ref("");
const selectedStatus = ref(null);
const sortBy = ref("newest");

// Pagination
const currentPage = ref(1);
const rowsPerPage = ref(6);

const statusOptions = [
	{ label: "All Requests", value: null },
	{ label: "Pending", value: "pending" },
	{ label: "Quoted", value: "quoted" },
	{ label: "Accepted", value: "accepted" },
	{ label: "In Progress", value: "in_progress" },
	{ label: "Completed", value: "completed" },
	{ label: "Cancelled", value: "cancelled" },
	{ label: "Rejected", value: "rejected" },
];

const sortOptions = [
	{ label: "Newest First", value: "newest" },
	{ label: "Oldest First", value: "oldest" },
	{ label: "Status", value: "status" },
	{ label: "Budget (High to Low)", value: "budget_desc" },
	{ label: "Budget (Low to High)", value: "budget_asc" },
];

// Computed
const filteredRequests = computed(() => {
	let requests = [...state.serviceRequests];

	// Filter by search query
	if (searchQuery.value) {
		const query = searchQuery.value.toLowerCase();
		requests = requests.filter(
			(request) =>
				request.service?.name?.toLowerCase().includes(query) ||
				request.location?.toLowerCase().includes(query) ||
				request.description?.toLowerCase().includes(query) ||
				request.service?.company?.name?.toLowerCase().includes(query),
		);
	}

	// Filter by status
	if (selectedStatus.value) {
		requests = requests.filter(
			(request) => request.status === selectedStatus.value,
		);
	}

	// Sort
	switch (sortBy.value) {
		case "newest":
			requests.sort(
				(a, b) =>
					new Date(b.createdAt || b.created_at) -
					new Date(a.createdAt || a.created_at),
			);
			break;
		case "oldest":
			requests.sort(
				(a, b) =>
					new Date(a.createdAt || a.created_at) -
					new Date(b.createdAt || b.created_at),
			);
			break;
		case "status":
			requests.sort((a, b) =>
				(a.status || "").localeCompare(b.status || ""),
			);
			break;
		case "budget_desc":
			requests.sort((a, b) => (b.budget || 0) - (a.budget || 0));
			break;
		case "budget_asc":
			requests.sort((a, b) => (a.budget || 0) - (b.budget || 0));
			break;
	}

	return requests;
});

const paginatedRequests = computed(() => {
	const start = (currentPage.value - 1) * rowsPerPage.value;
	const end = start + rowsPerPage.value;
	return filteredRequests.value.slice(start, end);
});

const totalPages = computed(() => {
	return Math.ceil(filteredRequests.value.length / rowsPerPage.value);
});

// Methods
const loadRequests = async () => {
	await fetchServiceRequests({
		page: 1,
		limit: 100,
	});
};

const navigateToCreate = () => {
	if (!canCreateRequest.value) {
		showError("You do not have permission to create service requests");
		return;
	}
	router.push({ name: "CreateRequest" });
};

const handleRequestClick = (request) => {
	router.push({ name: "RequestDetail", params: { id: request.uuid } });
};

const getStatusColor = (status) => {
	const statusLower = status?.toLowerCase() || "";
	const colors = {
		pending: "bg-yellow-100 text-yellow-800",
		quoted: "bg-blue-100 text-blue-800",
		accepted: "bg-indigo-100 text-indigo-800",
		in_progress: "bg-blue-100 text-blue-800",
		completed: "bg-green-100 text-green-800",
		cancelled: "bg-red-100 text-red-800",
		rejected: "bg-red-100 text-red-800",
	};
	return colors[statusLower] || "bg-gray-100 text-gray-800";
};

const formatStatus = (status) => {
	if (!status) return "Unknown";
	return status
		.replace(/_/g, " ")
		.split(" ")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
};

const formatDate = (dateString) => {
	if (!dateString) return "";
	const date = new Date(dateString);
	return date.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
};

// Watchers
watch([searchQuery, selectedStatus], () => {
	currentPage.value = 1;
});

// Lifecycle
onMounted(() => {
	loadRequests();
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
</style>
