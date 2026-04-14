<template>
	<div class="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
		<div class="max-w-7xl mx-auto">
			<!-- Page Header -->
			<div class="mb-6 sm:mb-8">
				<div
					class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
				>
					<div>
						<h1
							class="text-3xl sm:text-4xl font-bold text-gray-900 mb-1 sm:mb-2"
						>
							Browse Services
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
									d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
								/>
							</svg>
							Discover services offered by our partners
						</p>
					</div>
				</div>
			</div>

			<!-- Stats Cards -->
			<div
				v-if="!loading && services.length > 0"
				class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
			>
				<div
					class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6"
				>
					<div class="flex items-center">
						<div
							class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0"
						>
							<svg
								class="w-6 h-6 text-blue-600"
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
						</div>
						<div class="ml-4">
							<p class="text-sm font-medium text-gray-600">
								Total Services
							</p>
							<p class="text-2xl font-semibold text-gray-900">
								{{ totalItems || servicesCount }}
							</p>
						</div>
					</div>
				</div>

				<div
					class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6"
				>
					<div class="flex items-center">
						<div
							class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0"
						>
							<svg
								class="w-6 h-6 text-purple-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
								/>
							</svg>
						</div>
						<div class="ml-4">
							<p class="text-sm font-medium text-gray-600">
								Categories
							</p>
							<p class="text-2xl font-semibold text-gray-900">
								{{ categoriesCount }}
							</p>
						</div>
					</div>
				</div>

				<div
					class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6"
				>
					<div class="flex items-center">
						<div
							class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0"
						>
							<svg
								class="w-6 h-6 text-green-600"
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
						<div class="ml-4">
							<p class="text-sm font-medium text-gray-600">
								Active Services
							</p>
							<p class="text-2xl font-semibold text-gray-900">
								{{ activeServicesCount }}
							</p>
						</div>
					</div>
				</div>
			</div>

			<!-- Filters and Search -->
			<div
				class="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-6"
			>
				<!-- Row 1: Search + Price Sort -->
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
					<div class="relative">
						<svg
							class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
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
						<input
							v-model="searchQuery"
							type="text"
							placeholder="Search services..."
							class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:border-[#0D65AE] focus:ring-2 focus:ring-[#0D65AE] focus:ring-opacity-20 focus:outline-none transition-all"
						/>
					</div>

					<select
						v-model="priceSort"
						class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#0D65AE] focus:ring-2 focus:ring-[#0D65AE] focus:ring-opacity-20 focus:outline-none transition-all"
					>
						<option value="">Sort by Price</option>
						<option value="asc">Price: Low to High</option>
						<option value="desc">Price: High to Low</option>
					</select>
				</div>

				<!-- Row 2: Category Pills -->
				<div v-if="categories.length > 0">
					<div class="flex items-center justify-between mb-2">
						<p
							class="text-xs font-semibold text-gray-500 uppercase tracking-wide"
						>
							Category
						</p>
						<button
							v-if="categories.length > CATEGORIES_THRESHOLD"
							@click="showAllCategories = !showAllCategories"
							class="text-xs font-medium text-[#0D65AE] hover:underline transition-all"
						>
							{{
								showAllCategories
									? "Show less"
									: `Show all (${categories.length})`
							}}
						</button>
					</div>
					<div class="flex flex-wrap gap-2">
						<button
							@click="
								selectedCategory = null;
								currentPage = 1;
							"
							:class="[
								'px-3 py-1.5 text-xs font-medium rounded-full border transition-all',
								selectedCategory === null
									? 'bg-[#0D65AE] text-white border-[#0D65AE] shadow-sm'
									: 'bg-white text-gray-600 border-gray-300 hover:border-[#0D65AE] hover:text-[#0D65AE]',
							]"
						>
							All
						</button>
						<button
							v-for="category in displayedCategories"
							:key="category.id"
							@click="
								selectedCategory = category.id;
								currentPage = 1;
							"
							:class="[
								'px-3 py-1.5 text-xs font-medium rounded-full border transition-all',
								selectedCategory === category.id
									? 'bg-[#0D65AE] text-white border-[#0D65AE] shadow-sm'
									: 'bg-white text-gray-600 border-gray-300 hover:border-[#0D65AE] hover:text-[#0D65AE]',
							]"
						>
							{{ category.name }}
						</button>
					</div>
				</div>
			</div>

			<!-- Active filters summary -->
			<div
				v-if="selectedCategory || searchQuery || priceSort"
				class="flex items-center gap-2 mb-4 flex-wrap"
			>
				<span class="text-xs font-medium text-gray-500"
					>Active filters:</span
				>

				<span
					v-if="selectedCategory"
					class="inline-flex items-center gap-1 px-2.5 py-1 bg-[#0D65AE]/10 text-[#0D65AE] text-xs font-medium rounded-full"
				>
					{{ getCategoryName(selectedCategory) }}
					<button
						@click="
							selectedCategory = null;
							currentPage = 1;
						"
						class="ml-0.5 hover:text-[#0a4f87]"
					>
						<svg
							class="w-3 h-3"
							fill="currentColor"
							viewBox="0 0 20 20"
						>
							<path
								fill-rule="evenodd"
								d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
								clip-rule="evenodd"
							/>
						</svg>
					</button>
				</span>

				<span
					v-if="searchQuery"
					class="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
				>
					"{{ searchQuery }}"
					<button
						@click="searchQuery = ''"
						class="ml-0.5 hover:text-gray-900"
					>
						<svg
							class="w-3 h-3"
							fill="currentColor"
							viewBox="0 0 20 20"
						>
							<path
								fill-rule="evenodd"
								d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
								clip-rule="evenodd"
							/>
						</svg>
					</button>
				</span>

				<span
					v-if="priceSort"
					class="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
				>
					{{
						priceSort === "asc"
							? "Price: Low to High"
							: "Price: High to Low"
					}}
					<button
						@click="priceSort = ''"
						class="ml-0.5 hover:text-gray-900"
					>
						<svg
							class="w-3 h-3"
							fill="currentColor"
							viewBox="0 0 20 20"
						>
							<path
								fill-rule="evenodd"
								d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
								clip-rule="evenodd"
							/>
						</svg>
					</button>
				</span>

				<button
					@click="clearFilters"
					class="text-xs text-red-500 hover:text-red-700 font-medium hover:underline transition-all ml-1"
				>
					Clear all
				</button>
			</div>

			<!-- Loading State -->
			<div v-if="loading" class="flex items-center justify-center py-12">
				<div class="text-center">
					<div
						class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0D65AE] mx-auto"
					></div>
					<p class="text-gray-600 mt-4">Loading services...</p>
				</div>
			</div>

			<!-- Empty State (no services at all) -->
			<div
				v-else-if="!loading && services.length === 0"
				class="text-center py-12 bg-white rounded-xl border border-gray-200 shadow-sm"
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
						d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
					/>
				</svg>
				<h3 class="text-xl font-semibold text-gray-900 mb-2">
					No Services Available
				</h3>
				<p class="text-gray-600">Check back later for new services</p>
			</div>

			<!-- No Results State (filters returned nothing) -->
			<div
				v-else-if="!loading && sortedServices.length === 0"
				class="text-center py-12 bg-white rounded-xl border border-gray-200 shadow-sm"
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
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
					/>
				</svg>
				<h3 class="text-xl font-semibold text-gray-900 mb-2">
					No Services Found
				</h3>
				<p class="text-gray-600 mb-4">
					Try adjusting your filters or search query
				</p>
				<button
					@click="clearFilters"
					class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
				>
					Clear Filters
				</button>
			</div>

			<!-- Services Grid -->
			<div v-else class="space-y-6">
				<!-- Results count -->
				<p class="text-sm text-gray-500">
					Showing
					<span class="font-semibold text-gray-700">{{
						totalItems
					}}</span>
					service{{ totalItems !== 1 ? "s" : "" }}
				</p>

				<!-- Cards -->
				<div
					class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
				>
					<div
						v-for="service in sortedServices"
						:key="service.id"
						class="bg-white rounded-lg border border-gray-200 hover:border-[#0D65AE] shadow-sm hover:shadow-md transition-all overflow-hidden cursor-pointer"
						@click="openServiceModal(service)"
					>
						<div class="p-5">
							<div class="flex items-start justify-between mb-3">
								<div class="flex-1 min-w-0">
									<h3
										class="text-lg font-semibold text-gray-900 mb-1 truncate"
									>
										{{ service.name }}
									</h3>
									<div
										class="flex items-center gap-2 flex-wrap"
									>
										<span
											v-if="
												getServiceCategoryName(service)
											"
											class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
										>
											{{
												getServiceCategoryName(service)
											}}
										</span>
										<span
											v-if="service.status"
											:class="
												getStatusClass(service.status)
											"
											class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
										>
											{{ formatStatus(service.status) }}
										</span>
									</div>
								</div>

								<!-- 3-dots Action Menu -->
								<div class="relative ml-2 flex-shrink-0">
									<button
										@click.stop="
											toggleActionMenu(service.id)
										"
										class="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
										title="More actions"
									>
										<svg
											class="w-5 h-5"
											fill="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
											/>
										</svg>
									</button>

									<div
										v-if="activeMenu === service.id"
										v-click-outside="closeActionMenu"
										class="absolute right-0 mt-1 z-50 bg-white rounded-lg border border-gray-200 shadow-lg py-1 min-w-[176px]"
									>
										<button
											@click.stop="
												openServiceModal(service);
												activeMenu = null;
											"
											class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2.5 transition-colors"
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
													d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
												/>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
												/>
											</svg>
											View Details
										</button>
										<button
											@click.stop="
												requestService(service);
												activeMenu = null;
											"
											class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2.5 transition-colors"
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
													d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
												/>
											</svg>
											Request Service
										</button>
									</div>
								</div>
							</div>

							<!-- Description -->
							<p
								v-if="service.description"
								class="text-sm text-gray-600 line-clamp-2 mb-4"
							>
								{{ service.description }}
							</p>

							<!-- Price and Duration -->
							<div
								class="flex items-center justify-between pt-3 border-t border-gray-100"
							>
								<div class="flex items-center gap-1.5">
									<svg
										class="w-5 h-5 text-gray-400"
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
									<span
										v-if="
											service.price !== null &&
											service.price !== undefined
										"
										class="text-lg font-semibold text-[#0D65AE]"
									>
										{{ formatPrice(service.price) }}
									</span>
									<span
										v-else
										class="text-sm text-gray-400 italic"
										>Price on request</span
									>
								</div>
								<div
									v-if="service.duration"
									class="flex items-center gap-1.5"
								>
									<svg
										class="w-5 h-5 text-gray-400"
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
									<span class="text-sm text-gray-600">{{
										formatDuration(service.duration)
									}}</span>
								</div>
							</div>

							<!-- Company Info -->
							<div
								v-if="
									service.companyName || service.company?.name
								"
								class="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100"
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
									/>
								</svg>
								<span class="text-sm text-gray-600">{{
									service.companyName || service.company?.name
								}}</span>
							</div>
						</div>

						<!-- Card Footer -->
						<div
							class="bg-gray-50 px-5 py-3 border-t border-gray-200 flex items-center gap-2"
						>
							<button
								@click.stop="openServiceModal(service)"
								class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-[#0D65AE] hover:bg-[#0D65AE] hover:text-white border border-[#0D65AE] rounded-lg transition-all"
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
									/>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
									/>
								</svg>
								View Details
							</button>
							<button
								@click.stop="requestService(service)"
								class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0D65AE] hover:bg-[#0a4f87] rounded-lg transition-all"
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
										d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
									/>
								</svg>
								Request
							</button>
						</div>
					</div>
				</div>

				<!-- Pagination -->
				<div
					v-if="totalPages > 1"
					class="flex items-center justify-center gap-2 mt-8"
				>
					<button
						@click="previousPage"
						:disabled="currentPage === 1"
						class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
								d="M15 19l-7-7 7-7"
							/>
						</svg>
					</button>

					<div class="flex items-center gap-1">
						<button
							v-for="page in visiblePages"
							:key="page"
							@click="goToPage(page)"
							:class="[
								'px-4 py-2 text-sm font-medium rounded-lg transition-all',
								currentPage === page
									? 'bg-[#0D65AE] text-white'
									: 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50',
							]"
						>
							{{ page }}
						</button>
					</div>

					<button
						@click="nextPage"
						:disabled="currentPage === totalPages"
						class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
								d="M9 5l7 7-7 7"
							/>
						</svg>
					</button>
				</div>
			</div>
		</div>
	</div>

	<!-- ─── Service Detail Modal ─────────────────────────────────────────────── -->
	<Teleport to="body">
		<Transition name="modal">
			<div
				v-if="selectedService"
				class="fixed inset-0 z-50 flex items-center justify-center p-4"
				@click.self="closeServiceModal"
			>
				<!-- Backdrop -->
				<div
					class="absolute inset-0 bg-black/50 backdrop-blur-sm"
					@click="closeServiceModal"
				></div>

				<!-- Panel -->
				<div
					class="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl flex flex-col"
					@click.stop
				>
					<!-- Header -->
					<div
						class="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4 flex items-start justify-between rounded-t-2xl"
					>
						<div class="flex-1 min-w-0 pr-4">
							<h2
								class="text-xl font-bold text-gray-900 truncate"
							>
								{{ selectedService.name }}
							</h2>
							<div class="flex items-center gap-2 mt-1 flex-wrap">
								<span
									v-if="
										getServiceCategoryName(selectedService)
									"
									class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
								>
									<svg
										class="w-3 h-3 mr-1"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
										/>
									</svg>
									{{
										getServiceCategoryName(selectedService)
									}}
								</span>
								<span
									v-if="selectedService.status"
									:class="
										getStatusClass(selectedService.status)
									"
									class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
								>
									{{ formatStatus(selectedService.status) }}
								</span>
							</div>
						</div>
						<button
							@click="closeServiceModal"
							class="flex-shrink-0 p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
							title="Close"
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

					<!-- Body -->
					<div class="flex-1 p-6 space-y-6">
						<!-- Price and Duration -->
						<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div
								class="flex items-center gap-3 bg-blue-50 rounded-xl p-4"
							>
								<div
									class="w-10 h-10 bg-[#0D65AE]/10 rounded-lg flex items-center justify-center flex-shrink-0"
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
											d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
								</div>
								<div>
									<p
										class="text-xs text-gray-500 font-medium"
									>
										Price
									</p>
									<p
										v-if="
											selectedService.price !== null &&
											selectedService.price !== undefined
										"
										class="text-xl font-bold text-[#0D65AE]"
									>
										{{ formatPrice(selectedService.price) }}
									</p>
									<p
										v-else
										class="text-sm text-gray-400 italic"
									>
										Price on request
									</p>
								</div>
							</div>

							<div
								v-if="selectedService.duration"
								class="flex items-center gap-3 bg-purple-50 rounded-xl p-4"
							>
								<div
									class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0"
								>
									<svg
										class="w-5 h-5 text-purple-600"
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
								<div>
									<p
										class="text-xs text-gray-500 font-medium"
									>
										Duration
									</p>
									<p
										class="text-xl font-bold text-purple-600"
									>
										{{
											formatDuration(
												selectedService.duration,
											)
										}}
									</p>
								</div>
							</div>
						</div>

						<!-- Description -->
						<div v-if="selectedService.description">
							<h3
								class="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2 flex items-center gap-2"
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
										d="M4 6h16M4 12h16M4 18h7"
									/>
								</svg>
								Description
							</h3>
							<p
								class="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm"
							>
								{{ selectedService.description }}
							</p>
						</div>

						<!-- Company Info -->
						<div
							v-if="
								selectedService.companyName ||
								selectedService.company?.name
							"
						>
							<h3
								class="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2"
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
										d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
									/>
								</svg>
								Offered By
							</h3>
							<div
								class="flex items-start gap-4 bg-gray-50 rounded-xl p-4"
							>
								<div
									class="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0"
								>
									<svg
										class="w-6 h-6 text-gray-400"
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
								<div class="flex-1 space-y-1">
									<p class="font-semibold text-gray-900">
										{{
											selectedService.companyName ||
											selectedService.company?.name
										}}
									</p>
									<p
										v-if="selectedService.company?.email"
										class="text-sm text-gray-600 flex items-center gap-1.5"
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
												d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
											/>
										</svg>
										{{ selectedService.company.email }}
									</p>
									<p
										v-if="selectedService.company?.phone"
										class="text-sm text-gray-600 flex items-center gap-1.5"
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
												d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
											/>
										</svg>
										{{ selectedService.company.phone }}
									</p>
									<p
										v-if="selectedService.company?.address"
										class="text-sm text-gray-600 flex items-center gap-1.5"
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
												d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
											/>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
											/>
										</svg>
										{{ selectedService.company.address }}
									</p>
								</div>
							</div>
						</div>

						<!-- Metadata chips -->
						<div class="grid grid-cols-2 gap-3">
							<div
								v-if="selectedService.priceType"
								class="flex flex-col gap-0.5 bg-gray-50 rounded-lg px-4 py-3"
							>
								<span class="text-xs text-gray-500"
									>Price Type</span
								>
								<span
									class="text-sm font-medium text-gray-900 capitalize"
								>
									{{
										selectedService.priceType.replace(
											/_/g,
											" ",
										)
									}}
								</span>
							</div>
							<div
								v-if="selectedService.id"
								class="flex flex-col gap-0.5 bg-gray-50 rounded-lg px-4 py-3"
							>
								<span class="text-xs text-gray-500"
									>Service ID</span
								>
								<span
									class="text-sm font-medium text-gray-900 font-mono"
									>#{{ selectedService.id }}</span
								>
							</div>
						</div>
					</div>

					<!-- Footer -->
					<div
						class="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex flex-col sm:flex-row gap-3 rounded-b-2xl"
					>
						<button
							v-if="selectedService.status === 'active'"
							@click="
								requestService(selectedService);
								closeServiceModal();
							"
							class="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-medium text-white bg-[#0D65AE] hover:bg-[#0a4f87] rounded-lg transition-all shadow focus:ring-2 focus:ring-[#0D65AE] focus:ring-offset-2"
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
									d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
								/>
							</svg>
							Request Service
						</button>
						<button
							@click="closeServiceModal"
							class="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
						>
							Close
						</button>
					</div>
				</div>
			</div>
		</Transition>
	</Teleport>

	<!-- ─── Request Service Modal ─────────────────────────────────────────── -->
	<Teleport to="body">
		<Transition name="modal">
			<div
				v-if="showRequestModal"
				class="fixed inset-0 z-[60] flex items-center justify-center p-4"
				@click.self="closeRequestModal"
			>
				<!-- Backdrop -->
				<div
					class="absolute inset-0 bg-black/50 backdrop-blur-sm"
					@click="closeRequestModal"
				></div>

				<!-- Panel -->
				<div
					class="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto"
					@click.stop
				>
					<!-- Header -->
					<div
						class="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4 flex items-start justify-between rounded-t-2xl"
					>
						<div class="flex-1 min-w-0 pr-4">
							<h2 class="text-xl font-bold text-gray-900">
								Request Service
							</h2>
							<p class="text-sm text-gray-500 mt-0.5 truncate">
								{{ requestingService?.name }}
							</p>
						</div>
						<button
							@click="closeRequestModal"
							class="flex-shrink-0 p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
							title="Close"
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

					<!-- Body -->
					<div class="flex-1 p-6 space-y-5">
						<!-- Service summary chip -->
						<div
							class="flex items-center gap-3 bg-blue-50 rounded-xl p-4"
						>
							<div
								class="w-10 h-10 bg-[#0D65AE]/10 rounded-lg flex items-center justify-center flex-shrink-0"
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
										d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
									/>
								</svg>
							</div>
							<div class="flex-1 min-w-0">
								<p class="text-xs text-gray-500 font-medium">
									Service
								</p>
								<p class="font-semibold text-gray-900 truncate">
									{{ requestingService?.name }}
								</p>
								<p
									v-if="
										requestingService?.companyName ||
										requestingService?.company?.name
									"
									class="text-xs text-gray-500 truncate"
								>
									{{
										requestingService?.companyName ||
										requestingService?.company?.name
									}}
								</p>
							</div>
							<div
								v-if="
									requestingService?.price !== null &&
									requestingService?.price !== undefined
								"
								class="text-right flex-shrink-0"
							>
								<p class="text-xs text-gray-500">From</p>
								<p class="font-bold text-[#0D65AE]">
									{{ formatPrice(requestingService.price) }}
								</p>
							</div>
						</div>

						<!-- NFC Location picker -->
						<div>
							<label
								class="block text-sm font-medium text-gray-700 mb-1.5"
							>
								Service Location
								<span class="text-gray-400 font-normal"
									>(optional)</span
								>
							</label>
							<div
								v-if="nfcLocationsLoading"
								class="flex items-center gap-2 text-sm text-gray-500 py-2"
							>
								<svg
									class="w-4 h-4 animate-spin text-[#0D65AE]"
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
										d="M4 12a8 8 0 018-8v8z"
									/>
								</svg>
								Loading your locations…
							</div>
							<div
								v-else-if="nfcLocations.length === 0"
								class="text-sm text-gray-400 italic py-1"
							>
								No saved NFC locations found. The company will
								contact you to confirm the location.
							</div>
							<div v-else class="grid grid-cols-1 gap-2">
								<!-- "No location" option -->
								<label
									class="flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all"
									:class="
										requestForm.locationId === ''
											? 'border-[#0D65AE] bg-blue-50'
											: 'border-gray-200 hover:border-gray-300'
									"
								>
									<input
										type="radio"
										name="location"
										value=""
										v-model="requestForm.locationId"
										class="text-[#0D65AE] focus:ring-[#0D65AE]"
									/>
									<div>
										<p
											class="text-sm font-medium text-gray-700"
										>
											No specific location
										</p>
										<p class="text-xs text-gray-400">
											Company will contact you
										</p>
									</div>
								</label>
								<!-- NFC location options -->
								<label
									v-for="loc in nfcLocations"
									:key="loc.uuid || loc.id"
									class="flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all"
									:class="
										requestForm.locationId ===
										(loc.uuid || loc.id)
											? 'border-[#0D65AE] bg-blue-50'
											: 'border-gray-200 hover:border-gray-300'
									"
								>
									<input
										type="radio"
										name="location"
										:value="loc.uuid || loc.id"
										v-model="requestForm.locationId"
										class="text-[#0D65AE] focus:ring-[#0D65AE]"
									/>
									<div class="flex-1 min-w-0">
										<p
											class="text-sm font-medium text-gray-800 truncate"
										>
											{{
												loc.nickname ||
												loc.code ||
												"NFC Tag"
											}}
										</p>
										<p
											v-if="loc.address"
											class="text-xs text-gray-500 truncate"
										>
											{{ loc.address }}
										</p>
									</div>
									<svg
										class="w-4 h-4 text-gray-300 flex-shrink-0"
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
								</label>
							</div>
						</div>

						<!-- Preferred Date -->
						<div>
							<label
								for="preferred-date"
								class="block text-sm font-medium text-gray-700 mb-1.5"
							>
								Preferred Date &amp; Time
								<span class="text-gray-400 font-normal"
									>(optional)</span
								>
							</label>
							<input
								id="preferred-date"
								type="datetime-local"
								v-model="requestForm.preferredDate"
								:min="new Date().toISOString().slice(0, 16)"
								class="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D65AE] focus:border-[#0D65AE] transition-colors"
							/>
						</div>

						<!-- Notes -->
						<div>
							<label
								for="request-notes"
								class="block text-sm font-medium text-gray-700 mb-1.5"
							>
								Additional Notes
								<span class="text-gray-400 font-normal"
									>(optional)</span
								>
							</label>
							<textarea
								id="request-notes"
								v-model="requestForm.notes"
								rows="3"
								placeholder="Describe any specific requirements, access instructions, or details the company should know…"
								class="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D65AE] focus:border-[#0D65AE] transition-colors resize-none"
							></textarea>
						</div>

						<!-- Error message -->
						<div
							v-if="requestError"
							class="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm"
						>
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
									d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							{{ requestError }}
						</div>
					</div>

					<!-- Footer -->
					<div
						class="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex flex-col sm:flex-row gap-3 rounded-b-2xl"
					>
						<button
							@click="submitServiceRequest"
							:disabled="requestLoading"
							class="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-medium text-white bg-[#0D65AE] hover:bg-[#0a4f87] disabled:opacity-60 disabled:cursor-not-allowed rounded-lg transition-all shadow focus:ring-2 focus:ring-[#0D65AE] focus:ring-offset-2"
						>
							<svg
								v-if="requestLoading"
								class="w-5 h-5 animate-spin"
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
									d="M4 12a8 8 0 018-8v8z"
								/>
							</svg>
							<svg
								v-else
								class="w-5 h-5"
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
							{{
								requestLoading
									? "Submitting…"
									: "Submit Request"
							}}
						</button>
						<button
							@click="closeRequestModal"
							:disabled="requestLoading"
							class="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
						>
							Cancel
						</button>
					</div>
				</div>
			</div>
		</Transition>
	</Teleport>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useServices } from "@/composables/useServices";
import { useNfc } from "@/composables/useNfc";
import { useServiceRequests } from "@/composables/useServiceRequests";
import {
	formatCurrency,
	formatDuration,
	formatStatus,
} from "@/utils/formatters";

const router = useRouter();

const {
	state,
	servicesCount,
	activeServices,
	categoriesCount,
	fetchServiceCategories,
	fetchServices,
} = useServices();

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES_THRESHOLD = 8;

// ─── Local state ──────────────────────────────────────────────────────────────

const loading = ref(false);
const searchQuery = ref("");
const selectedCategory = ref(null);
const priceSort = ref("");
const currentPage = ref(1);
const pageSize = ref(12);
const totalItems = ref(0);
const showAllCategories = ref(false);
const activeMenu = ref(null);
const selectedService = ref(null);

// ─── Request modal state ───────────────────────────────────────────────────────

const showRequestModal = ref(false);
const requestingService = ref(null);
const requestForm = ref({
	locationId: "",
	preferredDate: "",
	notes: "",
});
const requestLoading = ref(false);
const requestError = ref("");
const nfcLocations = ref([]);
const nfcLocationsLoading = ref(false);

let searchDebounceTimer = null;

// ─── Composables for request modal ────────────────────────────────────────────

const { fetchMyNfcTags } = useNfc();
const { createServiceRequest } = useServiceRequests();

// ─── Data ─────────────────────────────────────────────────────────────────────

const services = ref([]);
const categories = ref([]);

// ─── Computed ─────────────────────────────────────────────────────────────────

const activeServicesCount = computed(
	() => services.value.filter((s) => s.status === "active").length,
);

const displayedCategories = computed(() => {
	if (
		showAllCategories.value ||
		categories.value.length <= CATEGORIES_THRESHOLD
	) {
		return categories.value;
	}
	return categories.value.slice(0, CATEGORIES_THRESHOLD);
});

const sortedServices = computed(() => {
	if (!priceSort.value) return services.value;
	return [...services.value].sort((a, b) =>
		priceSort.value === "asc"
			? (a.price ?? 0) - (b.price ?? 0)
			: (b.price ?? 0) - (a.price ?? 0),
	);
});

const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value));

const visiblePages = computed(() => {
	const pages = [];
	const maxVisible = 5;
	let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2));
	let end = Math.min(totalPages.value, start + maxVisible - 1);
	if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);
	for (let i = start; i <= end; i++) pages.push(i);
	return pages;
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getCategoryName = (categoryId) => {
	if (!categoryId) return "";
	const cat = categories.value.find(
		(c) => c.id === categoryId || c.uuid === categoryId,
	);
	return cat?.name || "";
};

/**
 * Resolve the display category name for a service object.
 * Checks (in order): plain categoryName string, id-based lookup, nested category.name.
 */
const getServiceCategoryName = (service) => {
	if (!service) return "";
	if (service.categoryName) return service.categoryName;
	if (service.categoryId) return getCategoryName(service.categoryId);
	if (service.category?.name) return service.category.name;
	return "";
};

const getStatusClass = (status) => {
	const s = status?.toLowerCase();
	if (s === "active") return "bg-green-100 text-green-800";
	if (s === "inactive") return "bg-gray-100 text-gray-800";
	if (s === "draft") return "bg-yellow-100 text-yellow-800";
	return "bg-gray-100 text-gray-800";
};

const formatPrice = (price) => formatCurrency(price);

// ─── Filters ──────────────────────────────────────────────────────────────────

const clearFilters = () => {
	searchQuery.value = "";
	selectedCategory.value = null;
	priceSort.value = "";
	currentPage.value = 1;
};

// ─── Modal ────────────────────────────────────────────────────────────────────

const openServiceModal = (service) => {
	selectedService.value = service;
	document.body.style.overflow = "hidden";
};

const closeServiceModal = () => {
	selectedService.value = null;
	document.body.style.overflow = "";
};

const handleKeydown = (e) => {
	if (e.key === "Escape") {
		if (showRequestModal.value) closeRequestModal();
		else if (selectedService.value) closeServiceModal();
	}
};

// ─── Request modal ────────────────────────────────────────────────────────────

const openRequestModal = async (service) => {
	requestingService.value = service;
	requestForm.value = { locationId: "", preferredDate: "", notes: "" };
	requestError.value = "";
	showRequestModal.value = true;
	document.body.style.overflow = "hidden";

	// Load user's NFC locations for the picker
	nfcLocationsLoading.value = true;
	try {
		const result = await fetchMyNfcTags();
		if (result.success) {
			nfcLocations.value = (result.data || []).filter(
				(t) => t.status === "active",
			);
		}
	} catch {
		nfcLocations.value = [];
	} finally {
		nfcLocationsLoading.value = false;
	}
};

const closeRequestModal = () => {
	showRequestModal.value = false;
	requestingService.value = null;
	requestError.value = "";
	if (!selectedService.value) {
		document.body.style.overflow = "";
	}
};

const submitServiceRequest = async () => {
	if (!requestingService.value) return;

	requestError.value = "";
	requestLoading.value = true;

	try {
		// Debug: log the full service object so we can see what fields the API returns
		console.log(
			"[RequestService] raw service object:",
			JSON.parse(JSON.stringify(requestingService.value)),
		);

		const serviceId =
			requestingService.value.uuid || requestingService.value.id || null;

		const companyId =
			requestingService.value.companyUuid ||
			requestingService.value.company_uuid ||
			requestingService.value.company?.uuid ||
			requestingService.value.companyId ||
			requestingService.value.company_id ||
			null;

		console.log(
			"[RequestService] resolved serviceId:",
			serviceId,
			"companyId:",
			companyId,
		);

		if (!serviceId || !companyId) {
			requestError.value =
				"Could not resolve service or company ID. Please contact support.";
			requestLoading.value = false;
			return;
		}

		const payload = {
			serviceId,
			companyId,
		};
		if (requestForm.value.locationId)
			payload.locationId = requestForm.value.locationId;
		if (requestForm.value.preferredDate)
			payload.preferredDate = new Date(
				requestForm.value.preferredDate,
			).toISOString();
		if (requestForm.value.notes.trim())
			payload.notes = requestForm.value.notes.trim();

		const result = await createServiceRequest(payload);
		if (result.success) {
			closeRequestModal();
		} else {
			requestError.value =
				result.error || "Failed to submit request. Please try again.";
		}
	} catch (err) {
		requestError.value = err.message || "An unexpected error occurred.";
	} finally {
		requestLoading.value = false;
	}
};

// ─── Navigation (kept for fallback) ──────────────────────────────────────────

const requestService = (service) => {
	openRequestModal(service);
};

// ─── Action menu ─────────────────────────────────────────────────────────────

const toggleActionMenu = (serviceId) => {
	activeMenu.value = activeMenu.value === serviceId ? null : serviceId;
};

const closeActionMenu = () => {
	activeMenu.value = null;
};

// ─── Pagination ───────────────────────────────────────────────────────────────

const previousPage = () => {
	if (currentPage.value > 1) {
		currentPage.value--;
		window.scrollTo({ top: 0, behavior: "smooth" });
	}
};

const nextPage = () => {
	if (currentPage.value < totalPages.value) {
		currentPage.value++;
		window.scrollTo({ top: 0, behavior: "smooth" });
	}
};

const goToPage = (page) => {
	currentPage.value = page;
	window.scrollTo({ top: 0, behavior: "smooth" });
};

// ─── Data normalization ───────────────────────────────────────────────────────

/**
 * Normalizes a raw service object from the API:
 * - Resolves price from basePrice / base_price / price (always a Number or null)
 * - Resolves categoryId + categoryName from multiple possible shapes
 * - Guarantees companyName is a plain string (not nested)
 */
const normalizeService = (raw) => {
	// Resolve price
	let price = null;
	if (raw.basePrice !== undefined && raw.basePrice !== null) {
		price = parseFloat(raw.basePrice);
	} else if (raw.base_price !== undefined && raw.base_price !== null) {
		price = parseFloat(raw.base_price);
	} else if (raw.price !== undefined && raw.price !== null) {
		price = parseFloat(raw.price);
	}

	// Resolve category id
	let categoryId = raw.categoryId || raw.category_id || null;
	if (!categoryId && raw.categoryName) {
		const match = categories.value.find(
			(cat) => cat.name === raw.categoryName,
		);
		if (match) categoryId = match.id;
	}

	return {
		...raw,
		id: raw.uuid || raw.id,
		price: price !== null && !isNaN(price) ? price : null,
		companyName: raw.companyName || raw.company?.name || null,
		// Preserve every possible company UUID variant the API might return
		companyUuid:
			raw.companyUuid ||
			raw.company_uuid ||
			raw.company?.uuid ||
			raw.companyId ||
			raw.company_id ||
			null,
		company:
			raw.company || (raw.companyName ? { name: raw.companyName } : null),
		categoryId,
		categoryName: raw.categoryName || raw.category?.name || null,
	};
};

// ─── Data loading ─────────────────────────────────────────────────────────────

const loadServices = async () => {
	loading.value = true;
	try {
		const params = {
			page: currentPage.value,
			limit: pageSize.value,
		};
		if (searchQuery.value.trim()) params.search = searchQuery.value.trim();
		if (selectedCategory.value) params.categoryId = selectedCategory.value;

		const result = await fetchServices(params);

		if (result.success) {
			services.value = (result.data || []).map(normalizeService);
			totalItems.value =
				result.pagination?.totalItems ??
				result.pagination?.total ??
				services.value.length;
		} else {
			throw new Error(result.error || "Failed to fetch services");
		}
	} catch (error) {
		console.error("Error loading services:", error);
	} finally {
		loading.value = false;
	}
};

const loadData = async () => {
	loading.value = true;
	try {
		const categoriesResult = await fetchServiceCategories();
		if (categoriesResult.success) {
			categories.value = (categoriesResult.data || []).map((cat) => ({
				...cat,
				id: cat.uuid || cat.id,
			}));
		}
	} catch (error) {
		console.error("Error loading categories:", error);
	} finally {
		loading.value = false;
	}
	await loadServices();
};

// ─── Watchers ─────────────────────────────────────────────────────────────────

watch(searchQuery, () => {
	clearTimeout(searchDebounceTimer);
	searchDebounceTimer = setTimeout(() => {
		currentPage.value = 1;
		loadServices();
	}, 350);
});

watch(selectedCategory, () => {
	currentPage.value = 1;
	loadServices();
});

watch(currentPage, () => {
	loadServices();
});

// ─── v-click-outside directive ────────────────────────────────────────────────

const vClickOutside = {
	mounted(el, binding) {
		el.clickOutsideEvent = (event) => {
			if (!(el === event.target || el.contains(event.target))) {
				binding.value(event);
			}
		};
		document.addEventListener("click", el.clickOutsideEvent);
	},
	unmounted(el) {
		document.removeEventListener("click", el.clickOutsideEvent);
	},
};

// ─── Lifecycle ────────────────────────────────────────────────────────────────

onMounted(() => {
	loadData();
	document.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
	document.removeEventListener("keydown", handleKeydown);
	document.body.style.overflow = "";
});
</script>

<style scoped>
.line-clamp-2 {
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	line-clamp: 2;
	overflow: hidden;
}

/* Modal fade + scale transition */
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
	transform: scale(0.95) translateY(8px);
	opacity: 0;
}
.modal-leave-to .relative {
	transform: scale(0.95) translateY(8px);
	opacity: 0;
}
</style>
