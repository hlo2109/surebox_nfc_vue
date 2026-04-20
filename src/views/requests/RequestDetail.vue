<template>
	<div class="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
		<div class="max-w-4xl mx-auto">
			<!-- Loading State -->
			<div
				v-if="isLoading && !currentRequest"
				class="flex flex-col items-center justify-center py-24"
			>
				<svg
					class="animate-spin w-10 h-10 text-[#0D65AE] mb-4"
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
				<p class="text-gray-500 text-sm">Loading request details…</p>
			</div>

			<!-- Error State -->
			<div
				v-else-if="error"
				class="flex flex-col items-center justify-center py-24 text-center"
			>
				<div
					class="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4"
				>
					<svg
						class="w-8 h-8 text-red-500"
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
				<h2 class="text-xl font-semibold text-gray-900 mb-2">
					Error Loading Request
				</h2>
				<p class="text-gray-500 mb-6">{{ error }}</p>
				<button
					@click="handleGoBack"
					class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
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
					Go Back
				</button>
			</div>

			<!-- Request Content -->
			<div v-else-if="currentRequest">
				<!-- Back Button -->
				<div class="mb-4">
					<button
						@click="handleGoBack"
						class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
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
						Back to Requests
					</button>
				</div>

				<!-- Header Card -->
				<div
					class="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6"
				>
					<div class="flex items-start justify-between gap-4">
						<div class="flex-1 min-w-0">
							<!-- Service Icon + Title -->
							<div class="flex items-center gap-3 mb-3">
								<div :class="statusIconClass">
									<i :class="statusIcon" class="text-lg"></i>
								</div>
								<div class="min-w-0">
									<h1
										class="text-2xl font-bold text-gray-900 truncate"
									>
										{{ requestServiceName(currentRequest) }}
									</h1>
									<p class="text-sm text-gray-500 font-mono break-all">
										Ref.
										{{ currentRequest.uuid || currentRequest.id }}
									</p>
								</div>
							</div>

							<!-- Status badge + Created date -->
							<div class="flex flex-wrap items-center gap-3 mb-5">
								<span :class="statusBadgeClass">
									{{ statusLabel }}
								</span>
								<span
									class="text-sm text-gray-400 flex items-center gap-1"
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
											d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
										/>
									</svg>
									Created
									{{
										formatDateTime(
											currentRequest.createdAt ||
												currentRequest.created_at,
										)
									}}
								</span>
							</div>

							<!-- Info Grid -->
							<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div class="flex items-start gap-2">
									<svg
										class="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0"
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
									<div>
										<p class="text-xs text-gray-500">
											Location
										</p>
										<p
											class="text-sm font-medium text-gray-900 whitespace-pre-wrap"
										>
											{{
												formatRequestLocation(
													currentRequest,
												) || "—"
											}}
										</p>
									</div>
								</div>

								<div
									v-if="
										currentRequest.preferredDate ||
										currentRequest.preferred_date
									"
									class="flex items-start gap-2"
								>
									<svg
										class="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0"
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
									<div>
										<p class="text-xs text-gray-500">
											Preferred Date
										</p>
										<p
											class="text-sm font-medium text-gray-900"
										>
											{{
												formatDate(
													currentRequest.preferredDate ||
														currentRequest.preferred_date,
												)
											}}
										</p>
									</div>
								</div>

								<div
									v-if="currentRequest.budget"
									class="flex items-start gap-2"
								>
									<svg
										class="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
									<div>
										<p class="text-xs text-gray-500">
											Budget
										</p>
										<p
											class="text-sm font-medium text-green-600"
										>
											{{
												formatCurrency(
													currentRequest.budget,
												)
											}}
										</p>
									</div>
								</div>

								<div class="flex items-start gap-2">
									<svg
										class="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0"
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
									<div>
										<p class="text-xs text-gray-500">
											Company
										</p>
										<p
											class="text-sm font-medium text-gray-900"
										>
											{{
												requestCompanyName(
													currentRequest,
												) || "N/A"
											}}
										</p>
									</div>
								</div>
							</div>

							<!-- Notes / description -->
							<div
								v-if="requestNotes(currentRequest)"
								class="mt-5 pt-5 border-t border-gray-100"
							>
								<p class="text-xs text-gray-500 mb-1">
									Notes
								</p>
								<p
									class="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap"
								>
									{{ requestNotes(currentRequest) }}
								</p>
							</div>
						</div>

						<!-- Ellipsis action menu -->
						<div
							class="relative flex-shrink-0"
							ref="menuContainerRef"
						>
							<button
								@click="menuOpen = !menuOpen"
								class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
								title="Actions"
							>
								<svg
									class="w-5 h-5"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										d="M12 5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 7a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 7a1.5 1.5 0 110-3 1.5 1.5 0 010 3z"
									/>
								</svg>
							</button>
							<Transition
								enter-active-class="transition ease-out duration-100"
								enter-from-class="transform opacity-0 scale-95"
								enter-to-class="transform opacity-100 scale-100"
								leave-active-class="transition ease-in duration-75"
								leave-from-class="transform opacity-100 scale-100"
								leave-to-class="transform opacity-0 scale-95"
							>
								<div
									v-if="menuOpen"
									class="absolute right-0 mt-1 w-48 bg-white rounded-xl border border-gray-200 shadow-lg z-20 py-1"
								>
									<button
										@click="
											handleUpdateStatus();
											menuOpen = false;
										"
										class="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
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
												d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
											/>
										</svg>
										Update Status
									</button>
									<button
										@click="
											loadRequest();
											menuOpen = false;
										"
										class="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
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
												d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
											/>
										</svg>
										Refresh
									</button>
									<hr class="my-1 border-gray-100" />
									<button
										@click="
											handleUpdateStatus('cancelled');
											menuOpen = false;
										"
										class="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
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
										Cancel Request
									</button>
								</div>
							</Transition>
						</div>
					</div>
				</div>

				<!-- Stats Row -->
				<div :class="statsGridClass">
					<div
						v-if="showQuotesTab"
						class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center justify-between"
					>
						<div>
							<p class="text-xs text-gray-500 mb-0.5">Quotes</p>
							<p class="text-2xl font-bold text-blue-600">
								{{ quotesCount }}
							</p>
						</div>
						<div
							class="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center"
						>
							<svg
								class="w-5 h-5 text-blue-300"
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

					<div
						class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center justify-between"
					>
						<div>
							<p class="text-xs text-gray-500 mb-0.5">Assigned</p>
							<p class="text-2xl font-bold text-purple-600">
								{{ assignmentsCount }}
							</p>
						</div>
						<div
							class="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center"
						>
							<svg
								class="w-5 h-5 text-purple-300"
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
						</div>
					</div>

					<div
						class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center justify-between"
					>
						<div>
							<p class="text-xs text-gray-500 mb-0.5">
								Service Price
							</p>
							<p class="text-xl font-bold text-green-600">
								{{
									formatCurrency(
										currentRequest.service?.price || 0,
									)
								}}
							</p>
						</div>
						<div
							class="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center"
						>
							<svg
								class="w-5 h-5 text-green-300"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						</div>
					</div>

					<div
						class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center justify-between"
					>
						<div>
							<p class="text-xs text-gray-500 mb-0.5">Duration</p>
							<p class="text-2xl font-bold text-orange-600">
								{{ currentRequest.service?.duration || "—"
								}}<span
									class="text-sm font-normal text-gray-400 ml-1"
									>min</span
								>
							</p>
						</div>
						<div
							class="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center"
						>
							<svg
								class="w-5 h-5 text-orange-300"
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

				<!-- Tab Container -->
				<div
					class="bg-white rounded-xl border border-gray-200 shadow-sm mb-6"
				>
					<!-- Tab Bar -->
					<div
						class="flex items-center gap-1 p-2 border-b border-gray-100"
					>
						<button
							v-if="showQuotesTab"
							@click="activeTab = 'quotes'"
							:class="[
								'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
								activeTab === 'quotes'
									? 'bg-[#0D65AE] text-white shadow-md'
									: 'text-gray-600 hover:text-gray-900 hover:bg-white',
							]"
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
							Quotes
							<span
								v-if="quotesCount > 0"
								:class="[
									'text-xs font-semibold rounded-full px-1.5 py-0.5 min-w-[1.25rem] text-center',
									activeTab === 'quotes'
										? 'bg-white/20 text-white'
										: 'bg-blue-100 text-blue-700',
								]"
								>{{ quotesCount }}</span
							>
						</button>

						<button
							@click="activeTab = 'assignment'"
							:class="[
								'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
								activeTab === 'assignment'
									? 'bg-[#0D65AE] text-white shadow-md'
									: 'text-gray-600 hover:text-gray-900 hover:bg-white',
							]"
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
									d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
								/>
							</svg>
							Assignment &amp; Service
							<span
								v-if="assignmentsCount > 0"
								:class="[
									'text-xs font-semibold rounded-full px-1.5 py-0.5 min-w-[1.25rem] text-center',
									activeTab === 'assignment'
										? 'bg-white/20 text-white'
										: 'bg-purple-100 text-purple-800',
								]"
								>{{ assignmentsCount }}</span
							>
						</button>

						<button
							v-if="showDeliveryTrackingTab"
							@click="activeTab = 'delivery'"
							:class="[
								'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
								activeTab === 'delivery'
									? 'bg-[#0D65AE] text-white shadow-md'
									: 'text-gray-600 hover:text-gray-900 hover:bg-white',
							]"
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
									d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
								/>
							</svg>
							Package tracking
						</button>
						<button
							@click="activeTab = 'activity'"
							:class="[
								'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
								activeTab === 'activity'
									? 'bg-[#0D65AE] text-white shadow-md'
									: 'text-gray-600 hover:text-gray-900 hover:bg-white',
							]"
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
									d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							Activity
						</button>
					</div>

					<!-- Tab Panels -->
					<div class="p-6">
						<!-- ── Quotes Tab ── -->
						<div v-if="showQuotesTab && activeTab === 'quotes'">
							<!-- Loading quotes -->
							<div
								v-if="quotesLoading"
								class="flex flex-col items-center justify-center py-12"
							>
								<svg
									class="animate-spin w-8 h-8 text-[#0D65AE] mb-3"
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
								<p class="text-gray-400 text-sm">
									Loading quotes…
								</p>
							</div>

							<!-- Empty quotes -->
							<div
								v-else-if="
									!currentRequest.quotes ||
									currentRequest.quotes.length === 0
								"
								class="flex flex-col items-center justify-center py-16 text-center"
							>
								<div
									class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4"
								>
									<svg
										class="w-8 h-8 text-gray-300"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
										/>
									</svg>
								</div>
								<h3
									class="text-lg font-semibold text-gray-700 mb-1"
								>
									No quotes yet
								</h3>
								<p class="text-sm text-gray-400">
									Companies will send quotes for your request
								</p>
							</div>

							<!-- Quote list -->
							<div
								v-else
								class="grid grid-cols-1 lg:grid-cols-2 gap-6"
							>
								<QuoteCard
									v-for="quote in currentRequest.quotes"
									:key="quote.uuid || quote.id"
									:quote="quote"
									:show-actions="quoteAllowsActions(quote)"
									@accept="handleAcceptQuote"
									@reject="handleRejectQuote"
									@view="handleViewQuote"
								/>
							</div>
						</div>

						<!-- ── Assignment & Service Tab ── -->
						<div v-else-if="activeTab === 'assignment'">
							<div
								v-if="assignmentsList.length"
								class="space-y-6"
							>
								<div>
									<h3
										class="text-sm font-semibold text-gray-800"
									>
										Assigned employees
									</h3>
									<p class="text-xs text-gray-500 mt-1">
										One or more team members from the
										company may be assigned to your request.
									</p>
								</div>
								<div
									v-for="(asg, aIdx) in assignmentsList"
									:key="asg.uuid || aIdx"
									class="bg-white rounded-xl border border-gray-200 shadow-sm p-5"
								>
									<div
										class="flex items-start justify-between gap-4 mb-5"
									>
										<div class="flex items-start gap-3">
											<div
												class="bg-purple-100 text-purple-600 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
											>
												<svg
													class="w-6 h-6"
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
											</div>
											<div>
												<p
													class="text-xs text-gray-500"
												>
													Assigned to
												</p>
												<p
													class="font-semibold text-gray-900 text-base"
												>
													{{ asg.employeeName }}
												</p>
												<p
													v-if="asg.employeeEmail"
													class="text-sm text-gray-500"
												>
													<!-- {{ asg.employeeEmail }} -->
												</p>
												<p
													v-if="asg.employeePhone"
													class="text-sm text-gray-500"
												>
													{{ asg.employeePhone }}
												</p>
											</div>
										</div>
										<span
											:class="
												assignmentBadgeClassFor(
													asg.status,
												)
											"
											>{{
												assignmentStatusLabel(
													asg.status,
												)
											}}</span
										>
									</div>

									<div
										v-if="asg.assignedAt"
										class="flex items-center gap-2 pt-4 border-t border-gray-100"
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
										<div>
											<p class="text-xs text-gray-500">
												Assigned on
											</p>
											<p
												class="text-sm font-medium text-gray-900"
											>
												{{
													formatDateTime(
														asg.assignedAt,
													)
												}}
											</p>
										</div>
									</div>
								</div>

								<!-- GPS Tracking — employee-only, handled in AssignmentDetail -->
								<div
									v-if="false"
									class="bg-white rounded-xl border border-gray-200 shadow-sm"
								>
									<div
										class="px-5 py-4 border-b border-gray-100 flex items-center gap-2"
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
												d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
											/>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
											/>
										</svg>
										<h3
											class="text-base font-semibold text-gray-900"
										>
											GPS Tracking
										</h3>
									</div>
									<div class="p-5">
										<div
											v-if="!trackingActive"
											class="flex flex-col items-center justify-center py-8 text-center"
										>
											<div
												class="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-3"
											>
												<svg
													class="w-7 h-7 text-gray-300"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
													/>
												</svg>
											</div>
											<p
												class="text-gray-500 text-sm mb-4"
											>
												GPS tracking not started
											</p>
											<button
												@click="handleStartTracking"
												class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0D65AE] rounded-lg hover:bg-[#0a4f87] transition-all"
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
														d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
													/>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
													/>
												</svg>
												Start GPS Tracking
											</button>
										</div>
										<div v-else class="space-y-4">
											<div
												class="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-3"
											>
												<svg
													class="w-4 h-4 text-green-600 flex-shrink-0"
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
													<p
														class="text-sm font-medium text-green-700"
													>
														GPS Tracking Active
													</p>
													<p
														class="text-xs text-green-600"
													>
														Location updates every
														30 seconds
													</p>
												</div>
											</div>
											<div
												v-if="lastTrackedLocation"
												class="grid grid-cols-2 gap-3"
											>
												<div
													class="bg-gray-50 rounded-lg p-3"
												>
													<p
														class="text-xs text-gray-500 mb-0.5"
													>
														Latitude
													</p>
													<p
														class="font-mono text-sm font-medium text-gray-900"
													>
														{{
															lastTrackedLocation.latitude.toFixed(
																6,
															)
														}}
													</p>
												</div>
												<div
													class="bg-gray-50 rounded-lg p-3"
												>
													<p
														class="text-xs text-gray-500 mb-0.5"
													>
														Longitude
													</p>
													<p
														class="font-mono text-sm font-medium text-gray-900"
													>
														{{
															lastTrackedLocation.longitude.toFixed(
																6,
															)
														}}
													</p>
												</div>
												<div
													class="bg-gray-50 rounded-lg p-3"
												>
													<p
														class="text-xs text-gray-500 mb-0.5"
													>
														Accuracy
													</p>
													<p
														class="text-sm font-medium text-gray-900"
													>
														{{
															lastTrackedLocation.accuracy?.toFixed(
																1,
															)
														}}m
													</p>
												</div>
												<div
													class="bg-gray-50 rounded-lg p-3"
												>
													<p
														class="text-xs text-gray-500 mb-0.5"
													>
														Last Update
													</p>
													<p
														class="text-xs font-medium text-gray-900"
													>
														{{
															formatDateTime(
																lastTrackedLocation.timestamp,
															)
														}}
													</p>
												</div>
											</div>
											<button
												@click="handleStopTracking"
												class="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-lg hover:bg-red-50 transition-all"
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
														d="M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9 10a1 1 0 00-1 1v2a1 1 0 001 1h6a1 1 0 001-1v-2a1 1 0 00-1-1H9z"
													/>
												</svg>
												Stop GPS Tracking
											</button>
										</div>
									</div>
								</div>
							</div>

							<!-- Waiting for assignment (accepted but no assignment) -->
							<div
								v-else-if="currentRequest.status === 'accepted'"
								class="flex flex-col items-center justify-center py-16 text-center"
							>
								<div
									class="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mb-4"
								>
									<svg
										class="w-8 h-8 text-yellow-400"
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
								<h3
									class="text-lg font-semibold text-gray-700 mb-1"
								>
									Waiting for Assignment
								</h3>
								<p class="text-sm text-gray-400">
									A team member will be assigned to your
									request soon
								</p>
							</div>

							<!-- No assignment yet (other statuses) -->
							<div
								v-else
								class="flex flex-col items-center justify-center py-16 text-center"
							>
								<div
									class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4"
								>
									<svg
										class="w-8 h-8 text-gray-300"
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
								<h3
									class="text-lg font-semibold text-gray-700 mb-1"
								>
									No assignment yet
								</h3>
								<p class="text-sm text-gray-400">
									An employee will be assigned to this request
								</p>
							</div>
						</div>

						<!-- ── Delivery tracking (NFC-verified courier) ── -->
						<div
							v-else-if="
								showDeliveryTrackingTab && activeTab === 'delivery'
							"
						>
							<div
								v-if="packageDeliveryLoading"
								class="flex flex-col items-center justify-center py-12"
							>
								<svg
									class="animate-spin w-8 h-8 text-[#0D65AE] mb-3"
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
								<p class="text-gray-400 text-sm">
									Loading delivery tracking…
								</p>
							</div>
							<div
								v-else-if="packageDeliveryError"
								class="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
							>
								{{ packageDeliveryError }}
							</div>
							<div v-else-if="packageDeliveryPayload" class="space-y-6">
								<div
									class="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3"
								>
									<p class="text-xs font-semibold text-slate-500 uppercase">
										Status
									</p>
									<p class="text-lg font-semibold text-slate-900 capitalize">
										{{ packageDeliveryPayload.delivery?.status || "—" }}
									</p>
									<div
										v-if="packageDeliveryPayload.delivery?.destinationNfc"
										class="pt-3 border-t border-slate-200"
									>
										<p class="text-xs font-semibold text-slate-500 uppercase mb-1">
											Your SureBox tag
										</p>
										<p class="text-sm font-medium text-slate-900">
											{{
												packageDeliveryPayload.delivery.destinationNfc
													.nickname || "NFC drop-off"
											}}
										</p>
										<p
											v-if="
												packageDeliveryPayload.delivery.destinationNfc
													.address
											"
											class="text-xs text-slate-600 mt-1"
										>
											{{
												packageDeliveryPayload.delivery.destinationNfc
													.address
											}}
										</p>
										<a
											v-if="
												packageTrackNfcMap(
													packageDeliveryPayload.delivery.destinationNfc,
												)
											"
											:href="
												packageTrackNfcMap(
													packageDeliveryPayload.delivery.destinationNfc,
												)
											"
											target="_blank"
											rel="noopener noreferrer"
											class="text-xs text-[#0D65AE] font-medium hover:underline mt-2 inline-block"
										>
											Open tag on map
										</a>
									</div>
									<p
										v-if="packageDeliveryPayload.delivery?.destinationAddress"
										class="text-sm text-slate-600 pt-3 border-t border-slate-200"
									>
										<span class="font-medium text-slate-800">Route address:</span>
										{{ packageDeliveryPayload.delivery.destinationAddress }}
									</p>
								</div>
								<div
									v-if="packageDeliveryPayload.alerts?.length"
									class="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3"
								>
									<h3 class="text-sm font-semibold text-amber-900 mb-2">
										Alerts
									</h3>
									<ul class="space-y-2 text-sm text-amber-950">
										<li
											v-for="(al, aidx) in packageDeliveryPayload.alerts"
											:key="al.uuid || aidx"
										>
											<span class="font-medium capitalize">{{
												String(al.alertType || "").replace(/_/g, " ")
											}}</span>
											<span> — {{ al.message }}</span>
											<span class="block text-xs text-amber-800/90 mt-0.5">{{
												formatDateTime(al.createdAt)
											}}</span>
										</li>
									</ul>
								</div>
								<div>
									<h3
										class="text-sm font-semibold text-gray-700 mb-3"
									>
										Timeline
									</h3>
									<ol
										v-if="
											packageDeliveryPayload.events?.length
										"
										class="space-y-3 border-l-2 border-slate-200 ml-2 pl-4"
									>
										<li
											v-for="(ev, idx) in packageDeliveryPayload.events"
											:key="ev.uuid || idx"
											class="relative text-sm"
										>
											<span
												class="absolute -left-[1.1rem] top-1.5 w-2 h-2 rounded-full bg-[#0D65AE] ring-4 ring-white"
											/>
											<span
												class="font-medium text-gray-900 capitalize"
											>{{
												String(ev.eventType || "").replace(
													/_/g,
													" ",
												)
											}}</span>
											<span class="text-gray-400 text-xs ml-2">{{
												formatDateTime(ev.createdAt)
											}}</span>
											<a
												v-if="ev.lat != null && ev.lng != null"
												:href="packageTrackOsm(ev.lat, ev.lng)"
												target="_blank"
												rel="noopener noreferrer"
												class="block text-xs text-[#0D65AE] hover:underline mt-1"
											>
												View on map
											</a>
											<p
												v-if="packageTrackEventExtra(ev)"
												class="text-xs text-gray-500 mt-1"
											>
												{{ packageTrackEventExtra(ev) }}
											</p>
										</li>
									</ol>
									<p v-else class="text-sm text-gray-400">
										No GPS or NFC events recorded yet. The courier
										checks in with your NFC tag at drop-off when they
										arrive.
									</p>
								</div>
								<router-link
									:to="{ name: 'CustomerMyPackages' }"
									class="inline-flex text-sm font-medium text-[#0D65AE] hover:underline"
								>
									All my packages &amp; tracking →
								</router-link>
							</div>
						</div>

						<!-- ── Activity Tab ── -->
						<div v-else-if="activeTab === 'activity'">
							<div
								v-if="activityEvents.length === 0"
								class="flex flex-col items-center justify-center py-16 text-center"
							>
								<div
									class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4"
								>
									<svg
										class="w-8 h-8 text-gray-300"
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
								<h3
									class="text-lg font-semibold text-gray-700 mb-1"
								>
									No activity yet
								</h3>
								<p class="text-sm text-gray-400">
									Events will appear here as your request
									progresses
								</p>
							</div>

							<!-- Timeline -->
							<ol
								v-else
								class="relative border-l border-gray-200 ml-3 space-y-6"
							>
								<li
									v-for="(event, index) in activityEvents"
									:key="index"
									class="ml-6"
								>
									<!-- Timeline dot -->
									<span
										class="absolute -left-3 flex items-center justify-center"
									>
										<div :class="event.iconClass">
											<i
												:class="event.icon"
												class="text-xs"
											></i>
										</div>
									</span>
									<div
										class="bg-gray-50 rounded-xl border border-gray-100 p-4"
									>
										<p
											class="text-sm font-semibold text-gray-900"
										>
											{{ event.title }}
										</p>
										<p class="text-sm text-gray-600 mt-0.5">
											{{ event.description }}
										</p>
										<p class="text-xs text-gray-400 mt-1.5">
											{{ event.date }}
										</p>
									</div>
								</li>
							</ol>
						</div>
					</div>
					<!-- /tab panels -->
				</div>
				<!-- /tab container -->
			</div>
			<!-- /currentRequest -->
		</div>
		<!-- /max-w -->
	</div>
	<!-- /page wrapper -->

	<!-- ── Status Update Modal ── -->
	<Teleport to="body">
		<Transition name="modal">
			<div
				v-if="showStatusDialog"
				class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
			>
				<!-- Backdrop -->
				<div
					class="absolute inset-0 bg-black/50 backdrop-blur-sm"
					@click="showStatusDialog = false"
				/>

				<!-- Modal Card -->
				<div
					class="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
				>
					<!-- Modal Header -->
					<div
						class="bg-gradient-to-r from-[#0D65AE] to-indigo-700 px-6 py-5 flex items-center justify-between"
					>
						<div>
							<h2 class="text-lg font-bold text-white">
								Update Request Status
							</h2>
							<p class="text-indigo-200 text-sm mt-0.5">
								Request #{{ currentRequest?.id }}
							</p>
						</div>
						<button
							@click="showStatusDialog = false"
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

					<!-- Modal Body -->
					<div class="p-6 space-y-4">
						<p class="text-sm text-gray-600">
							Select the new status for this request:
						</p>
						<div class="relative">
							<select
								v-model="newStatus"
								class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D65AE] focus:border-transparent text-sm transition-all appearance-none bg-white pr-10"
							>
								<option value="" disabled>
									Choose a status…
								</option>
								<option
									v-for="opt in statusOptions"
									:key="opt.value"
									:value="opt.value"
								>
									{{ opt.label }}
								</option>
							</select>
							<div
								class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400"
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
										d="M19 9l-7 7-7-7"
									/>
								</svg>
							</div>
						</div>
					</div>

					<!-- Modal Footer -->
					<div
						class="flex justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-100"
					>
						<button
							@click="showStatusDialog = false"
							class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
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
							Cancel
						</button>
						<button
							@click="confirmUpdateStatus"
							:disabled="!newStatus || isUpdating"
							class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0D65AE] rounded-lg hover:bg-[#0a4f87] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
						>
							<svg
								v-if="isUpdating"
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
									d="M5 13l4 4L19 7"
								/>
							</svg>
							{{ isUpdating ? "Updating…" : "Confirm" }}
						</button>
					</div>
				</div>
			</div>
		</Transition>
	</Teleport>

	<!-- Reject quote (reason required) -->
	<Teleport to="body">
		<Transition name="modal">
			<div
				v-if="showRejectQuoteDialog"
				class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
			>
				<div
					class="absolute inset-0 bg-black/50 backdrop-blur-sm"
					@click="showRejectQuoteDialog = false"
				/>
				<div
					class="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
				>
					<div
						class="bg-gradient-to-r from-red-600 to-rose-700 px-6 py-5 flex items-center justify-between"
					>
						<div>
							<h2 class="text-lg font-bold text-white">
								Reject quote
							</h2>
							<p class="text-red-100 text-sm mt-0.5">
								Please give a reason. The company will see it so they can
								adjust terms or send a new offer.
							</p>
						</div>
						<button
							type="button"
							@click="showRejectQuoteDialog = false"
							class="text-red-100 hover:text-white transition-colors rounded-lg p-1 hover:bg-white/10"
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
					<div class="p-6 space-y-3">
						<label class="block text-sm font-medium text-gray-700">
							Reason for rejection
							<span class="text-red-500">*</span>
						</label>
						<textarea
							v-model="rejectQuoteReason"
							rows="4"
							minlength="3"
							placeholder="e.g. price is above budget, need a different scope…"
							class="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm resize-y"
						/>
						<p class="text-xs text-gray-500">
							At least 3 characters. You can still receive further quotes from
							the company.
						</p>
					</div>
					<div
						class="px-6 py-4 border-t border-gray-100 flex justify-end gap-2 bg-gray-50"
					>
						<button
							type="button"
							class="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-white"
							@click="showRejectQuoteDialog = false"
						>
							Cancel
						</button>
						<button
							type="button"
							class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
							:disabled="rejectQuoteSubmitting"
							@click="confirmRejectQuote"
						>
							{{
								rejectQuoteSubmitting
									? "Sending…"
									: "Confirm rejection"
							}}
						</button>
					</div>
				</div>
			</div>
		</Transition>
	</Teleport>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useServiceRequests } from "@/composables/useServiceRequests";
import {
	respondToQuote,
	cancelServiceRequest,
	getServiceRequestPackageDelivery,
} from "@/api/serviceRequests.api";
import QuoteCard from "@/components/requests/QuoteCard.vue";
import { useToast } from "@/composables/useToast";
import { formatCurrency, formatDate, formatDateTime } from "@/utils/formatters";
import {
	requestServiceName,
	requestCompanyName,
	requestNotes,
	formatRequestLocation,
	isQuotePricingRequest,
	isDeliveryFulfillmentRequest,
	listRequestAssignments,
	assignmentStatusLabel,
	assignmentBadgeClassFor,
} from "@/utils/serviceRequestDisplay";

const router = useRouter();
const route = useRoute();
const toast = useToast();

/** Route passes `:id` with `props: true`; must declare because template has multiple roots (div + Teleport). */
const props = defineProps({
	id: {
		type: String,
		required: true,
	},
});

const {
	state,
	fetchServiceRequest,
	setCurrentServiceRequest,
	clearCurrentServiceRequest,
} = useServiceRequests();

// State
const isLoading = ref(false);
const error = ref(null);
const activeTab = ref("quotes");
const quotesLoading = ref(false);
const menuOpen = ref(false);
const menuContainerRef = ref(null);
const showStatusDialog = ref(false);
const showRejectQuoteDialog = ref(false);
const rejectQuoteTarget = ref(null);
const rejectQuoteReason = ref("");
const rejectQuoteSubmitting = ref(false);
const newStatus = ref("");
const isUpdating = ref(false);
const packageDeliveryLoading = ref(false);
const packageDeliveryError = ref(null);
const packageDeliveryPayload = ref(null);

// Computed
const currentRequest = computed(() => state.currentServiceRequest);

const quotesCount = computed(() => currentRequest.value?.quotes?.length || 0);
const showQuotesTab = computed(() =>
	isQuotePricingRequest(currentRequest.value),
);
const assignmentsList = computed(() =>
	listRequestAssignments(currentRequest.value),
);
const assignmentsCount = computed(() => assignmentsList.value.length);

const showDeliveryTrackingTab = computed(() => {
	const r = currentRequest.value;
	if (!r || !isDeliveryFulfillmentRequest(r)) return false;
	const st = (r.status || "").toString().toLowerCase();
	return ["accepted", "in_progress", "completed"].includes(st);
});

/** Only pending quotes while the request is still in quoting phase. */
function quoteAllowsActions(quote) {
	if (!quote || quote.status !== "pending") {
		return false;
	}
	const st = currentRequest.value?.status;
	return st === "quoted" || st === "pending";
}

const statsGridClass = computed(() =>
	showQuotesTab.value
		? "grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6"
		: "grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6",
);

watch(
	() => currentRequest.value?.uuid,
	(uuid, prevUuid) => {
		if (!uuid || uuid === prevUuid) return;
		packageDeliveryPayload.value = null;
		packageDeliveryError.value = null;
		const r = currentRequest.value;
		const deliveryDefault =
			isDeliveryFulfillmentRequest(r) &&
			["accepted", "in_progress", "completed"].includes(
				(r?.status || "").toString().toLowerCase(),
			);
		activeTab.value = isQuotePricingRequest(r)
			? "quotes"
			: deliveryDefault
				? "delivery"
				: "assignment";
	},
);

function packageTrackOsm(lat, lng) {
	return `https://www.openstreetmap.org/?mlat=${encodeURIComponent(lat)}&mlon=${encodeURIComponent(lng)}#map=16/${lat}/${lng}`;
}

function packageTrackNfcMap(nfc) {
	if (!nfc || nfc.lat == null || nfc.lng == null) return "";
	return packageTrackOsm(nfc.lat, nfc.lng);
}

function packageTrackEventExtra(ev) {
	const p = ev.payload;
	if (!p || typeof p !== "object") return "";
	if (typeof p.distanceMeters === "number") {
		return `Distance from destination zone: ${Math.round(p.distanceMeters)} m`;
	}
	return "";
}

async function loadPackageDelivery() {
	const uuid = currentRequest.value?.uuid;
	if (!uuid || !showDeliveryTrackingTab.value) return;
	packageDeliveryLoading.value = true;
	packageDeliveryError.value = null;
	try {
		const data = await getServiceRequestPackageDelivery(uuid);
		const inner =
			data?.data &&
			(data.data.delivery !== undefined || Array.isArray(data.data.events))
				? data.data
				: data?.data ?? data;
		packageDeliveryPayload.value = inner;
	} catch (err) {
		packageDeliveryPayload.value = null;
		const msg = (err?.message || String(err)).toLowerCase();
		if (msg.includes("not found")) {
			packageDeliveryError.value =
				"The company has not started package tracking for this delivery yet. Check back after they link the courier run to your request.";
		} else {
			packageDeliveryError.value =
				err?.message || "Could not load delivery tracking.";
		}
	} finally {
		packageDeliveryLoading.value = false;
	}
}

watch(
	() => activeTab.value,
	(tab) => {
		if (tab === "delivery" && showDeliveryTrackingTab.value) {
			loadPackageDelivery();
		}
	},
);

const statusConfig = {
	pending: {
		label: "Pending",
		severity: "warning",
		icon: "pi pi-clock",
		iconClass:
			"bg-yellow-100 text-yellow-600 w-12 h-12 rounded-full flex items-center justify-center",
		badgeClass:
			"inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800",
	},
	quoted: {
		label: "Quoted",
		severity: "info",
		icon: "pi pi-file",
		iconClass:
			"bg-blue-100 text-blue-600 w-12 h-12 rounded-full flex items-center justify-center",
		badgeClass:
			"inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800",
	},
	accepted: {
		label: "Accepted",
		severity: "success",
		icon: "pi pi-check-circle",
		iconClass:
			"bg-green-100 text-green-600 w-12 h-12 rounded-full flex items-center justify-center",
		badgeClass:
			"inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800",
	},
	in_progress: {
		label: "In Progress",
		severity: "info",
		icon: "pi pi-spinner",
		iconClass:
			"bg-purple-100 text-purple-600 w-12 h-12 rounded-full flex items-center justify-center",
		badgeClass:
			"inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800",
	},
	completed: {
		label: "Completed",
		severity: "success",
		icon: "pi pi-check",
		iconClass:
			"bg-green-100 text-green-600 w-12 h-12 rounded-full flex items-center justify-center",
		badgeClass:
			"inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800",
	},
	cancelled: {
		label: "Cancelled",
		severity: "danger",
		icon: "pi pi-times-circle",
		iconClass:
			"bg-red-100 text-red-600 w-12 h-12 rounded-full flex items-center justify-center",
		badgeClass:
			"inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800",
	},
	rejected: {
		label: "Rejected",
		severity: "danger",
		icon: "pi pi-ban",
		iconClass:
			"bg-red-100 text-red-600 w-12 h-12 rounded-full flex items-center justify-center",
		badgeClass:
			"inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800",
	},
};

const currentStatus = computed(() => {
	return statusConfig[currentRequest.value?.status] || statusConfig.pending;
});

const statusLabel = computed(() => currentStatus.value.label);
const statusSeverity = computed(() => currentStatus.value.severity);
const statusIcon = computed(() => currentStatus.value.icon);
const statusIconClass = computed(() => currentStatus.value.iconClass);
const statusBadgeClass = computed(() => currentStatus.value.badgeClass);

// Customer can only cancel their own request
const statusOptions = [{ label: "Cancelled", value: "cancelled" }];

const activityEvents = computed(() => {
	const events = [];

	if (currentRequest.value) {
		// Request created
		events.push({
			title: "Request Created",
			description: `Service request for ${requestServiceName(currentRequest.value)}`,
			date: formatDateTime(
				currentRequest.value.createdAt ||
					currentRequest.value.created_at,
			),
			icon: "pi pi-plus-circle",
			iconClass:
				"bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center",
		});

		// Quotes
		if (
			currentRequest.value.quotes &&
			currentRequest.value.quotes.length > 0
		) {
			currentRequest.value.quotes.forEach((quote) => {
				const amt =
					quote.totalPrice ??
					quote.total_price ??
					quote.amount ??
					0;
				const days = quote.estimatedDays ?? quote.estimated_days;
				const extra =
					days != null && days !== ""
						? ` (${days} day${Number(days) === 1 ? "" : "s"})`
						: "";
				events.push({
					title: "Quote Received",
					description: `Quote for ${formatCurrency(Number(amt))}${extra}`,
					date: formatDateTime(quote.createdAt || quote.created_at),
					icon: "pi pi-file",
					iconClass:
						"bg-purple-100 text-purple-600 w-8 h-8 rounded-full flex items-center justify-center",
				});
			});
		}

		listRequestAssignments(currentRequest.value).forEach((asg) => {
			events.push({
				title: "Employee Assigned",
				description: `Assigned to ${asg.employeeName}`,
				date: asg.assignedAt
					? formatDateTime(asg.assignedAt)
					: formatDateTime(
							currentRequest.value.createdAt ||
								currentRequest.value.created_at,
						),
				icon: "pi pi-user",
				iconClass:
					"bg-green-100 text-green-600 w-8 h-8 rounded-full flex items-center justify-center",
			});
		});

		// Status changes
		if (currentRequest.value.status === "completed") {
			events.push({
				title: "Request Completed",
				description: "Service request has been completed",
				date: formatDateTime(
					currentRequest.value.updatedAt ||
						currentRequest.value.updated_at,
				),
				icon: "pi pi-check",
				iconClass:
					"bg-green-100 text-green-600 w-8 h-8 rounded-full flex items-center justify-center",
			});
		}
	}

	return events.sort((a, b) => new Date(b.date) - new Date(a.date));
});

// Methods
const loadRequest = async () => {
	isLoading.value = true;
	error.value = null;
	try {
		const requestUuid = String(props.id ?? route.params.id ?? "").trim();
		if (!requestUuid) {
			error.value = "Missing service request id";
			return;
		}
		const result = await fetchServiceRequest(requestUuid);

		if (!result.success) {
			error.value = result.error || "Failed to load request";
		}
	} catch (err) {
		error.value = err.message || "Failed to load request";
	} finally {
		isLoading.value = false;
	}
};

const handleGoBack = () => {
	router.push({ name: "MyRequests" });
};

const handleUpdateStatus = async (status) => {
	if (status) {
		newStatus.value = status;
		await confirmUpdateStatus();
	} else {
		newStatus.value = "";
		showStatusDialog.value = true;
	}
};

const confirmUpdateStatus = async () => {
	if (newStatus.value !== "cancelled") return;

	isUpdating.value = true;
	try {
		const requestUuid = currentRequest.value?.uuid;
		if (!requestUuid) return;
		await cancelServiceRequest(requestUuid);
		showStatusDialog.value = false;
		await loadRequest();
	} catch (err) {
		console.error("Failed to cancel request:", err);
	} finally {
		isUpdating.value = false;
	}
};

const handleAcceptQuote = async (quote) => {
	try {
		const requestUuid = currentRequest.value?.uuid;
		const quoteUuid = quote.uuid || quote.id;
		if (!requestUuid || !quoteUuid) return;
		await respondToQuote(requestUuid, quoteUuid, "accept");
		toast.showSuccess("Quote accepted");
		await loadRequest();
	} catch (err) {
		console.error("Failed to accept quote:", err);
		toast.showError(err?.message || "Could not accept the quote");
	}
};

const handleRejectQuote = (quote) => {
	rejectQuoteTarget.value = quote;
	rejectQuoteReason.value = "";
	showRejectQuoteDialog.value = true;
};

const confirmRejectQuote = async () => {
	const reason = rejectQuoteReason.value.trim();
	if (reason.length < 3) {
		toast.showError("Please enter a reason with at least 3 characters.");
		return;
	}
	const requestUuid = currentRequest.value?.uuid;
	const quote = rejectQuoteTarget.value;
	const quoteUuid = quote?.uuid || quote?.id;
	if (!requestUuid || !quoteUuid) {
		showRejectQuoteDialog.value = false;
		return;
	}
	rejectQuoteSubmitting.value = true;
	try {
		await respondToQuote(requestUuid, quoteUuid, "reject", reason);
		toast.showSuccess("Quote rejected");
		showRejectQuoteDialog.value = false;
		await loadRequest();
	} catch (err) {
		console.error("Failed to reject quote:", err);
		toast.showError(err?.message || "Could not reject the quote");
	} finally {
		rejectQuoteSubmitting.value = false;
	}
};

const handleViewQuote = (quote) => {
	console.log("View quote:", quote);
};

// Close dropdown when clicking outside
const handleClickOutside = (e) => {
	if (menuContainerRef.value && !menuContainerRef.value.contains(e.target)) {
		menuOpen.value = false;
	}
};

// Lifecycle
watch(
	() => props.id,
	() => {
		loadRequest();
	},
);

onMounted(() => {
	loadRequest();
	document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
	document.removeEventListener("click", handleClickOutside);
	clearCurrentServiceRequest();
});
</script>

<style scoped>
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
