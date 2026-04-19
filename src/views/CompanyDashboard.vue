<template>
	<div class="bg-gray-50 p-4 sm:p-6 lg:p-8">
		<div class="max-w-7xl mx-auto">
			<!-- ─── Header ──────────────────────────────────────────────────── -->
			<div class="mb-6 sm:mb-8">
				<div
					class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
				>
					<div>
						<h1
							class="text-3xl sm:text-4xl font-bold text-gray-900 mb-1 sm:mb-2"
						>
							Welcome Back, {{ props.userName }}
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
									d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
								/>
							</svg>
							<span v-if="companyRoleLabel">
								{{ companyRoleLabel }} · Company Dashboard
							</span>
							<span v-else>Company Dashboard</span>
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

			<!-- ─── Loading spinner (full-page) ────────────────────────────── -->
			<div v-if="loading" class="flex items-center justify-center py-24">
				<div
					class="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0D65AE]"
				></div>
			</div>

			<template v-else>
				<!-- ─── Company Info Card ────────────────────────────────────── -->
				<div
					class="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 mb-6 sm:mb-8"
				>
					<div
						v-if="!company"
						class="flex items-center justify-center py-8"
					>
						<div
							class="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0D65AE]"
						></div>
					</div>
					<div
						v-else
						class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
					>
						<div class="flex items-start gap-4 flex-1 min-w-0">
							<!-- Company Avatar -->
							<div
								class="bg-[#0D65AE]/10 p-3 rounded-xl border border-[#0D65AE]/20 shrink-0"
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
										d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
									/>
								</svg>
							</div>
							<div class="min-w-0">
								<div
									class="flex flex-wrap items-center gap-2 mb-1"
								>
									<h2
										class="text-xl font-bold text-gray-900 truncate"
									>
										{{ company.name }}
									</h2>
									<span
										:class="[
											'inline-block px-2 py-0.5 rounded-full text-xs font-semibold',
											company.status === 'active'
												? 'bg-green-100 text-green-700'
												: 'bg-gray-100 text-gray-600',
										]"
									>
										{{
											company.status === "active"
												? "Active"
												: (company.status ?? "Inactive")
										}}
									</span>
								</div>
								<p
									v-if="company.description"
									class="text-sm text-gray-500 line-clamp-2 mb-1"
								>
									{{ company.description }}
								</p>
								<p
									v-if="company.address"
									class="text-sm text-gray-400 flex items-center gap-1"
								>
									<svg
										class="w-3.5 h-3.5 shrink-0"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
										/>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
										/>
									</svg>
									{{ company.address }}
								</p>
							</div>
						</div>
						<button
							v-if="canManageCompanyWorkspace"
							type="button"
							@click="router.push('/my-company')"
							class="shrink-0 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0D65AE] rounded-lg hover:bg-[#0b579a] focus:ring-2 focus:ring-[#0D65AE] focus:ring-offset-2 transition-all"
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
									d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
								/>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
								/>
							</svg>
							Manage Company
						</button>
					</div>
				</div>

				<!-- ─── Stats Cards ──────────────────────────────────────────── -->
				<div
					class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8"
				>
					<!-- Incoming Requests (blue) -->
					<div
						class="bg-white rounded-xl border border-gray-200 hover:border-[#0D65AE] transition-all p-5 sm:p-6"
					>
						<div class="flex items-center justify-between">
							<div class="flex-1">
								<p
									class="text-gray-500 text-xs sm:text-sm font-medium mb-1 sm:mb-2"
								>
									Incoming Requests
								</p>
								<h3
									class="text-2xl sm:text-3xl font-bold text-gray-900"
								>
									{{ stats.totalRequests }}
								</h3>
								<p
									class="text-[#0D65AE] text-xs sm:text-sm mt-2 flex items-center gap-1"
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
									<span>{{ stats.pendingRequests }} new</span>
								</p>
							</div>
							<div
								class="bg-[#0D65AE]/10 p-3 sm:p-4 rounded-xl border border-[#0D65AE]/20"
							>
								<svg
									class="w-6 h-6 sm:w-8 sm:h-8 text-[#0D65AE]"
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
							</div>
						</div>
					</div>

					<!-- In Progress (orange) -->
					<div
						class="bg-white rounded-xl border border-gray-200 hover:border-orange-400 transition-all p-5 sm:p-6"
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
									{{ stats.inProgressRequests }}
								</h3>
								<p
									class="text-orange-600 text-xs sm:text-sm mt-2 flex items-center gap-1"
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
									<span
										>{{
											stats.acceptedRequests
										}}
										accepted</span
									>
								</p>
							</div>
							<div
								class="bg-orange-50 p-3 sm:p-4 rounded-xl border border-orange-200"
							>
								<svg
									class="w-6 h-6 sm:w-8 sm:h-8 text-orange-600"
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

					<!-- Completed (green) -->
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
									{{ stats.completedRequests }}
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
									<span>This month</span>
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

					<!-- Cancelled (red) -->
					<div
						class="bg-red-50 rounded-xl border border-red-200 hover:border-red-400 transition-all p-5 sm:p-6"
					>
						<div class="flex items-center justify-between">
							<div class="flex-1">
								<p
									class="text-gray-500 text-xs sm:text-sm font-medium mb-1 sm:mb-2"
								>
									Cancelled
								</p>
								<h3
									class="text-2xl sm:text-3xl font-bold text-gray-900"
								>
									{{ stats.cancelledRequests }}
								</h3>
								<p
									class="text-red-600 text-xs sm:text-sm mt-2 flex items-center gap-1"
								>
									<svg
										class="w-3 h-3 sm:w-4 sm:h-4"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fill-rule="evenodd"
											d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
											clip-rule="evenodd"
										/>
									</svg>
									<span>Requests</span>
								</p>
							</div>
							<div
								class="bg-white p-3 sm:p-4 rounded-xl border border-red-200"
							>
								<svg
									class="w-6 h-6 sm:w-8 sm:h-8 text-red-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							</div>
						</div>
					</div>
				</div>

				<!-- ─── Recent Requests + Quick Actions ─────────────────────── -->
				<div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
					<!-- Recent Service Requests (left 2/3) -->
					<div
						class="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5 sm:p-6"
					>
						<div
							class="flex items-center justify-between mb-4 sm:mb-5"
						>
							<h3
								class="text-base sm:text-lg font-semibold text-gray-900"
							>
								Recent Requests
							</h3>
							<button
								v-if="canManageCompanyWorkspace"
								type="button"
								@click="router.push('/my-company/requests')"
								class="inline-flex items-center gap-1 text-sm text-[#0D65AE] hover:text-[#0b579a] font-medium transition-colors"
							>
								<span>View All</span>
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

						<!-- Empty state -->
						<div
							v-if="recentRequests.length === 0"
							class="flex flex-col items-center justify-center py-12 text-center"
						>
							<svg
								class="w-12 h-12 text-gray-300 mb-3"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="1.5"
									d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
								/>
							</svg>
							<p class="text-gray-500 text-sm">No requests yet</p>
						</div>

						<!-- Request rows -->
						<div v-else class="divide-y divide-gray-100">
							<div
								v-for="request in recentRequests"
								:key="request.id"
								:class="
									canManageCompanyWorkspace
										? 'cursor-pointer hover:bg-gray-50'
										: ''
								"
								@click="
									canManageCompanyWorkspace &&
										router.push('/my-company/requests')
								"
								class="flex items-center gap-3 sm:gap-4 py-3 sm:py-4 -mx-5 sm:-mx-6 px-5 sm:px-6 transition-colors first:rounded-t-none last:rounded-b-xl"
							>
								<!-- Status icon -->
								<div class="shrink-0">
									<!-- Completed -->
									<div
										v-if="request.status === 'completed'"
										class="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center"
									>
										<svg
											class="w-5 h-5 text-green-600"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M5 13l4 4L19 7"
											/>
										</svg>
									</div>
									<!-- Cancelled -->
									<div
										v-else-if="
											request.status === 'cancelled'
										"
										class="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center"
									>
										<svg
											class="w-5 h-5 text-red-500"
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
									</div>
									<!-- Other statuses -->
									<div
										v-else
										class="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center"
									>
										<svg
											class="w-5 h-5 text-orange-500"
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

								<!-- Primary info -->
								<div class="flex-1 min-w-0">
									<p
										class="text-sm font-medium text-gray-900 truncate"
									>
										{{
											request.service?.name ??
											"Service Request"
										}}
									</p>
									<p class="text-xs text-gray-500 truncate">
										{{
											request.customer?.name ??
											request.user?.name ??
											request.customer?.email ??
											"—"
										}}
									</p>
								</div>

								<!-- Status badge -->
								<span
									:class="statusBadgeClass(request.status)"
									class="hidden sm:inline-block"
								>
									{{ formatStatus(request.status) }}
								</span>

								<!-- Date -->
								<p
									class="text-xs text-gray-400 shrink-0 hidden md:block"
								>
									{{
										formatDate(
											request.preferredDate ??
												request.createdAt,
										)
									}}
								</p>

								<!-- Chevron -->
								<svg
									class="w-4 h-4 text-gray-300 shrink-0"
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
							</div>
						</div>
					</div>

					<!-- Quick Actions (right 1/3) -->
					<div
						class="bg-white rounded-xl border border-gray-200 p-5 sm:p-6"
					>
						<h3
							class="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-5"
						>
							Quick Actions
						</h3>

						<div class="flex flex-col gap-3">
							<template v-if="canManageCompanyWorkspace">
							<!-- View All Requests (primary) -->
							<button
								type="button"
								@click="router.push('/my-company/requests')"
								class="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-[#0D65AE] rounded-lg hover:bg-[#0b579a] focus:ring-2 focus:ring-[#0D65AE] focus:ring-offset-2 transition-all"
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
										d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
									/>
								</svg>
								View All Requests
							</button>

							<!-- Manage Services (outline) -->
							<button
								type="button"
								@click="router.push('/my-services')"
								class="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-[#0D65AE] focus:ring-offset-2 transition-all"
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
										d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
									/>
								</svg>
								Manage Services
							</button>

							<!-- Team Members (outline) -->
							<button
								type="button"
								@click="router.push('/my-company/members')"
								class="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-[#0D65AE] focus:ring-offset-2 transition-all"
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
										d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
									/>
								</svg>
								Team Members
							</button>

							<!-- Company Profile (outline) -->
							<button
								type="button"
								@click="router.push('/my-company')"
								class="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-[#0D65AE] focus:ring-offset-2 transition-all"
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
										d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
									/>
								</svg>
								Company Profile
							</button>
							</template>

							<!-- Divider -->
							<div class="border-t border-gray-100 my-1"></div>

							<!-- Pro Tip info card -->
							<div
								class="bg-blue-50 border border-blue-200 rounded-lg p-4"
							>
								<div class="flex items-start gap-3">
									<div class="shrink-0 mt-0.5">
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
												d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
											/>
										</svg>
									</div>
									<div>
										<h4
											class="text-sm font-semibold text-[#0D65AE] mb-0.5"
										>
											Pro Tip
										</h4>
										<p
											class="text-xs text-blue-700 leading-relaxed"
										>
											Respond to pending requests quickly
											to improve your rating.
										</p>
									</div>
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
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";
import { canManageCompanyWorkspace as userCanManageCompanyWorkspace } from "@/utils/companyContext";
import { getMyCompany, getMyCompanyServiceRequests } from "@/api/companies.api";

// ─── Props ────────────────────────────────────────────────────────────────────
const props = defineProps({
	userName: { type: String, default: "User" },
});

// ─── Router / Store ───────────────────────────────────────────────────────────
const router = useRouter();
const authStore = useAuthStore();

const canManageCompanyWorkspace = computed(() =>
	userCanManageCompanyWorkspace(authStore.state.user),
);

// Safely read the companyRole computed ref and capitalise it
const companyRoleLabel = computed(() => {
	const role = authStore.companyRole.value ?? authStore.companyRole;
	if (!role || typeof role !== "string") return "";
	return role.charAt(0).toUpperCase() + role.slice(1);
});

// ─── State ────────────────────────────────────────────────────────────────────
const loading = ref(false);
const company = ref(null);
const companyRequests = ref([]);

// ─── Computed ─────────────────────────────────────────────────────────────────
const stats = computed(() => {
	const requests = companyRequests.value;
	return {
		totalRequests: requests.length,
		pendingRequests: requests.filter((r) => r.status === "pending").length,
		inProgressRequests: requests.filter((r) => r.status === "in_progress")
			.length,
		acceptedRequests: requests.filter((r) => r.status === "accepted")
			.length,
		completedRequests: requests.filter((r) => r.status === "completed")
			.length,
		cancelledRequests: requests.filter((r) => r.status === "cancelled")
			.length,
	};
});

// 5 most recent requests, sorted by createdAt descending
const recentRequests = computed(() =>
	[...companyRequests.value]
		.sort((a, b) => new Date(b.createdAt ?? 0) - new Date(a.createdAt ?? 0))
		.slice(0, 5),
);

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(iso) {
	if (!iso) return "—";
	return new Date(iso).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
}

function formatStatus(status) {
	const labels = {
		pending: "Pending",
		quoted: "Quoted",
		accepted: "Accepted",
		in_progress: "In Progress",
		completed: "Completed",
		cancelled: "Cancelled",
	};
	return labels[status] ?? status;
}

function statusBadgeClass(status) {
	const map = {
		pending: "bg-yellow-100 text-yellow-700",
		quoted: "bg-blue-100 text-blue-700",
		accepted: "bg-indigo-100 text-indigo-700",
		in_progress: "bg-orange-100 text-orange-700",
		completed: "bg-green-100 text-green-700",
		cancelled: "bg-red-100 text-red-500",
	};
	return [
		"inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap",
		map[status] ?? "bg-gray-100 text-gray-600",
	].join(" ");
}

// ─── Data fetching ────────────────────────────────────────────────────────────
async function fetchCompany() {
	try {
		const data = await getMyCompany();
		// Handle both bare object and { data: {} } shapes
		company.value = data?.data ?? data ?? null;
	} catch (err) {
		console.error("CompanyDashboard — fetchCompany:", err);
		company.value = null;
	}
}

async function fetchRequests() {
	try {
		const data = await getMyCompanyServiceRequests({ page: 1, limit: 50 });
		// Handle both bare array and { data: [] } shapes
		const list = Array.isArray(data)
			? data
			: Array.isArray(data?.data)
				? data.data
				: [];
		companyRequests.value = list;
	} catch (err) {
		console.error("CompanyDashboard — fetchRequests:", err);
		companyRequests.value = [];
	}
}

async function loadData() {
	loading.value = true;
	try {
		await Promise.all([fetchCompany(), fetchRequests()]);
	} catch (err) {
		console.error("CompanyDashboard — loadData:", err);
	} finally {
		loading.value = false;
	}
}

onMounted(loadData);
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
