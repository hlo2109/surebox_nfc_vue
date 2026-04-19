<template>
	<div class="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
		<div class="max-w-5xl mx-auto">
			<!-- Loading State -->
			<div
				v-if="isLoading"
				class="flex items-center justify-center py-24"
			>
				<div class="text-center">
					<div
						class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0D65AE] mx-auto"
					></div>
					<p class="text-gray-600 mt-4 text-sm">Loading company...</p>
				</div>
			</div>

			<!-- Error State -->
			<div v-else-if="error" class="text-center py-24">
				<div
					class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
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
				<h2 class="text-2xl font-semibold text-gray-900 mb-2">
					Error Loading Company
				</h2>
				<p class="text-gray-600 mb-6">{{ error }}</p>
				<button
					@click="handleGoBack"
					class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
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

			<!-- Main Content -->
			<div v-else-if="currentCompany">
				<!-- Back Button -->
				<button
					@click="handleGoBack"
					class="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-all mb-6"
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
					Back to Companies
				</button>

				<!-- Company Header Card -->
				<div
					class="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6"
				>
					<div
						class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"
					>
						<!-- Left: Info -->
						<div class="flex-1 min-w-0">
							<!-- Name + Badge -->
							<div class="flex flex-wrap items-center gap-3 mb-4">
								<h1
									class="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight"
								>
									{{ currentCompany.name }}
								</h1>
								<span
									:class="statusClass"
									class="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide"
								>
									{{ currentCompany.status || "Active" }}
								</span>
							</div>

							<!-- Contact Info -->
							<div
								class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-4"
							>
								<div
									v-if="currentCompany.email"
									class="flex items-center gap-2 text-gray-600"
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
											d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
										/>
									</svg>
									<a
										:href="`mailto:${currentCompany.email}`"
										class="hover:text-[#0D65AE] hover:underline truncate"
									>
										{{ currentCompany.email }}
									</a>
								</div>

								<div
									v-if="currentCompany.phone"
									class="flex items-center gap-2 text-gray-600"
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
											d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
										/>
									</svg>
									<a
										:href="`tel:${currentCompany.phone}`"
										class="hover:text-[#0D65AE] hover:underline"
									>
										{{ currentCompany.phone }}
									</a>
								</div>

								<div
									v-if="fullAddress"
									class="flex items-start gap-2 text-gray-600 sm:col-span-2"
								>
									<svg
										class="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5"
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
									<span>{{ fullAddress }}</span>
								</div>
							</div>

							<!-- Description -->
							<div
								v-if="currentCompany.description"
								class="mt-3 pt-3 border-t border-gray-100"
							>
								<p
									class="text-sm text-gray-600 leading-relaxed"
								>
									{{ currentCompany.description }}
								</p>
							</div>
						</div>

						<!-- Right: Action Buttons -->
						<div class="flex items-center gap-2 flex-shrink-0">
							<button
								v-if="canEditThisCompany"
								@click="handleEditCompany"
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
										d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
									/>
								</svg>
								Edit Company
							</button>

							<button
								v-if="canDeleteThisCompany"
								@click="handleDeleteCompany"
								class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-all"
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
										d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
									/>
								</svg>
								Delete
							</button>

							<!-- 3-dot menu -->
							<div
								class="relative"
								v-click-outside="() => (showMenu = false)"
							>
								<button
									@click.stop="showMenu = !showMenu"
									class="inline-flex items-center justify-center w-9 h-9 text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
									aria-label="More options"
								>
									<svg
										class="w-4 h-4"
										fill="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											d="M12 5c-.828 0-1.5-.672-1.5-1.5S11.172 2 12 2s1.5.672 1.5 1.5S12.828 5 12 5zm0 7c-.828 0-1.5-.672-1.5-1.5S11.172 9 12 9s1.5.672 1.5 1.5S12.828 12 12 12zm0 7c-.828 0-1.5-.672-1.5-1.5S11.172 16 12 16s1.5.672 1.5 1.5S12.828 19 12 19z"
										/>
									</svg>
								</button>
								<div
									v-if="showMenu"
									class="absolute right-0 mt-1 w-48 bg-white rounded-lg border border-gray-200 shadow-lg z-10 py-1"
								>
									<button
										@click="
											handleEditCompany();
											showMenu = false;
										"
										class="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
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
												d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
											/>
										</svg>
										Edit Company
									</button>
									<button
										v-if="canDeleteThisCompany"
										@click="
											handleDeleteCompany();
											showMenu = false;
										"
										class="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
									>
										<svg
											class="w-4 h-4 text-red-400"
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
										Delete Company
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Stat Cards -->
				<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
					<!-- Members -->
					<div
						class="bg-white rounded-xl border border-gray-200 shadow-sm p-5"
					>
						<div class="flex items-center gap-3">
							<div
								class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0"
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
										d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
									/>
								</svg>
							</div>
							<div>
								<p
									class="text-xs font-medium text-gray-500 uppercase tracking-wide"
								>
									Members
								</p>
								<p class="text-2xl font-bold text-gray-900">
									{{ currentCompanyMembersCount }}
								</p>
							</div>
						</div>
					</div>

					<!-- Locations -->
					<div
						class="bg-white rounded-xl border border-gray-200 shadow-sm p-5"
					>
						<div class="flex items-center gap-3">
							<div
								class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0"
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
										d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
									/>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
									/>
								</svg>
							</div>
							<div>
								<p
									class="text-xs font-medium text-gray-500 uppercase tracking-wide"
								>
									Locations
								</p>
								<p class="text-2xl font-bold text-gray-900">
									{{ currentCompanyLocationsCount }}
								</p>
							</div>
						</div>
					</div>

					<!-- Categories -->
					<div
						class="bg-white rounded-xl border border-gray-200 shadow-sm p-5"
					>
						<div class="flex items-center gap-3">
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
										d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
									/>
								</svg>
							</div>
							<div>
								<p
									class="text-xs font-medium text-gray-500 uppercase tracking-wide"
								>
									Categories
								</p>
								<p class="text-2xl font-bold text-gray-900">
									{{ categoriesCount }}
								</p>
							</div>
						</div>
					</div>

					<!-- Services -->
					<div
						class="bg-white rounded-xl border border-gray-200 shadow-sm p-5"
					>
						<div class="flex items-center gap-3">
							<div
								class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0"
							>
								<svg
									class="w-5 h-5 text-orange-600"
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
							<div>
								<p
									class="text-xs font-medium text-gray-500 uppercase tracking-wide"
								>
									Services
								</p>
								<p class="text-2xl font-bold text-gray-900">
									{{ servicesCount }}
								</p>
							</div>
						</div>
					</div>
				</div>

				<!-- Tabs Panel -->
				<div
					class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
				>
					<!-- Tab Bar -->
					<div
						class="flex gap-1 p-2 bg-gray-50 rounded-t-xl border-b border-gray-200"
					>
						<button
							@click="activeTab = 'members'"
							:class="[
								activeTab === 'members'
									? 'bg-[#0D65AE] text-white shadow-md'
									: 'text-gray-600 hover:bg-white',
								'flex-1 py-2 px-3 rounded-lg font-medium transition-all text-sm',
							]"
						>
							Members
						</button>
						<button
							@click="activeTab = 'locations'"
							:class="[
								activeTab === 'locations'
									? 'bg-[#0D65AE] text-white shadow-md'
									: 'text-gray-600 hover:bg-white',
								'flex-1 py-2 px-3 rounded-lg font-medium transition-all text-sm',
							]"
						>
							Locations
						</button>
						<button
							@click="activeTab = 'categories'"
							:class="[
								activeTab === 'categories'
									? 'bg-[#0D65AE] text-white shadow-md'
									: 'text-gray-600 hover:bg-white',
								'flex-1 py-2 px-3 rounded-lg font-medium transition-all text-sm',
							]"
						>
							Categories
						</button>
						<button
							@click="activeTab = 'services'"
							:class="[
								activeTab === 'services'
									? 'bg-[#0D65AE] text-white shadow-md'
									: 'text-gray-600 hover:bg-white',
								'flex-1 py-2 px-3 rounded-lg font-medium transition-all text-sm',
							]"
						>
							Services
						</button>
					</div>

					<!-- Tab Content -->
					<div class="p-6">
						<!-- Members Tab -->
						<div v-if="activeTab === 'members'">
							<div class="flex items-center justify-between mb-4">
								<h2 class="text-lg font-semibold text-gray-900">
									Team Members
								</h2>
								<button
									v-if="canManageMembersHere"
									@click="handleAddMember"
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
											d="M12 4v16m8-8H4"
										/>
									</svg>
									Add Member
								</button>
							</div>
							<MembersList
								:members="state.currentCompanyMembers"
								:loading="membersLoading"
								:can-add-members="canManageMembersHere"
								:can-manage-members="canManageMembersHere"
								@add-member="handleAddMember"
								@edit-member="handleEditMember"
								@remove-member="handleRemoveMember"
							/>
						</div>

						<!-- Locations Tab -->
						<div v-else-if="activeTab === 'locations'">
							<div class="flex items-center justify-between mb-4">
								<h2 class="text-lg font-semibold text-gray-900">
									Locations
								</h2>
								<button
									v-if="canManageLocationsHere"
									@click="handleAddLocation"
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
											d="M12 4v16m8-8H4"
										/>
									</svg>
									Add Location
								</button>
							</div>
							<LocationsList
								:locations="state.currentCompanyLocations"
								:loading="locationsLoading"
								:can-add-locations="canManageLocationsHere"
								:can-manage-locations="canManageLocationsHere"
								@add-location="handleAddLocation"
								@edit-location="handleEditLocation"
								@delete-location="handleDeleteLocation"
							/>
						</div>

						<!-- Categories Tab -->
						<div v-else-if="activeTab === 'categories'">
							<div class="flex items-center justify-between mb-4">
								<h2 class="text-lg font-semibold text-gray-900">
									Categories
								</h2>
								<button
									v-if="canManageCategoriesHere"
									@click="handleAddCategory"
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
											d="M12 4v16m8-8H4"
										/>
									</svg>
									Add from catalogue
								</button>
							</div>
							<CategoriesList
								:categories="state.currentCompanyCategories"
								:loading="categoriesLoading"
								:can-add-categories="canManageCategoriesHere"
								:can-manage-categories="canManageCategoriesHere"
								@add-category="handleAddCategory"
								@edit-category="handleEditCategory"
								@delete-category="handleDeleteCategory"
							/>
						</div>

						<!-- Services Tab -->
						<div v-else-if="activeTab === 'services'">
							<div class="flex items-center justify-between mb-4">
								<h2 class="text-lg font-semibold text-gray-900">
									Services
								</h2>
								<router-link
									:to="{
										name: 'CompanyServices',
										params: { companyId },
									}"
									class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0D65AE] rounded-lg hover:bg-[#0a4f87] transition-all"
								>
									View All Services
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
											d="M14 5l7 7m0 0l-7 7m7-7H3"
										/>
									</svg>
								</router-link>
							</div>
							<div
								v-if="servicesLoading"
								class="flex items-center justify-center py-12"
							>
								<div
									class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0D65AE]"
								></div>
							</div>
							<div
								v-else
								class="text-center py-8 text-gray-500 text-sm"
							>
								<svg
									class="w-12 h-12 text-gray-300 mx-auto mb-3"
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
								<p class="font-medium text-gray-700 mb-1">
									{{ servicesCount }} service{{
										servicesCount !== 1 ? "s" : ""
									}}
									available
								</p>
								<p>
									Click "View All Services" to manage this
									company's services.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- ── Modal: Add Member ─────────────────────────────────────── -->
		<Teleport to="body">
			<Transition name="modal">
				<div
					v-if="showAddMemberDialog"
					class="fixed inset-0 z-50 flex items-center justify-center"
				>
					<div
						class="absolute inset-0 bg-black/50"
						@click="showAddMemberDialog = false"
					></div>
					<div
						class="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6"
					>
						<!-- Header -->
						<div class="flex items-center justify-between mb-5">
							<h3 class="text-lg font-semibold text-gray-900">
								Add Team Member
							</h3>
							<button
								@click="showAddMemberDialog = false"
								class="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
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
						<div class="space-y-4">
							<div>
								<label
									for="member-email"
									class="block text-sm font-medium text-gray-700 mb-1"
								>
									Email Address
									<span class="text-red-500">*</span>
								</label>
								<input
									id="member-email"
									v-model="newMember.email"
									type="email"
									placeholder="member@example.com"
									class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0D65AE] focus:border-transparent outline-none"
								/>
							</div>
							<div>
								<label
									for="member-role"
									class="block text-sm font-medium text-gray-700 mb-1"
								>
									Role
								</label>
								<input
									id="member-role"
									v-model="newMember.role"
									type="text"
									placeholder="e.g., Manager, Admin"
									class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0D65AE] focus:border-transparent outline-none"
								/>
							</div>
						</div>

						<!-- Footer -->
						<div
							class="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-100"
						>
							<button
								@click="showAddMemberDialog = false"
								class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
							>
								Cancel
							</button>
							<button
								@click="submitAddMember"
								:disabled="addingMember"
								class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0D65AE] rounded-lg hover:bg-[#0a4f87] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
							>
								<svg
									v-if="addingMember"
									class="w-4 h-4 animate-spin"
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
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
									/>
								</svg>
								{{ addingMember ? "Adding..." : "Add Member" }}
							</button>
						</div>
					</div>
				</div>
			</Transition>
		</Teleport>

		<!-- ── Modal: Add Location ───────────────────────────────────── -->
		<Teleport to="body">
			<Transition name="modal">
				<div
					v-if="showAddLocationDialog"
					class="fixed inset-0 z-50 flex items-center justify-center"
				>
					<div
						class="absolute inset-0 bg-black/50"
						@click="showAddLocationDialog = false"
					></div>
					<div
						class="relative bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-6"
					>
						<!-- Header -->
						<div class="flex items-center justify-between mb-5">
							<h3 class="text-lg font-semibold text-gray-900">
								Add Location
							</h3>
							<button
								@click="showAddLocationDialog = false"
								class="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
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
						<div class="space-y-4">
							<div>
								<label
									for="location-name"
									class="block text-sm font-medium text-gray-700 mb-1"
								>
									Location Name
									<span class="text-red-500">*</span>
								</label>
								<input
									id="location-name"
									v-model="newLocation.name"
									type="text"
									placeholder="e.g., Main Office"
									class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0D65AE] focus:border-transparent outline-none"
								/>
							</div>
							<div>
								<label
									for="location-address"
									class="block text-sm font-medium text-gray-700 mb-1"
								>
									Address <span class="text-red-500">*</span>
								</label>
								<input
									id="location-address"
									v-model="newLocation.address"
									type="text"
									placeholder="Street address"
									class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0D65AE] focus:border-transparent outline-none"
								/>
							</div>
							<div class="grid grid-cols-2 gap-4">
								<div>
									<label
										for="location-phone"
										class="block text-sm font-medium text-gray-700 mb-1"
									>
										Phone
									</label>
									<input
										id="location-phone"
										v-model="newLocation.phone"
										type="tel"
										placeholder="Phone number"
										class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0D65AE] focus:border-transparent outline-none"
									/>
								</div>
								<div>
									<label
										for="location-email"
										class="block text-sm font-medium text-gray-700 mb-1"
									>
										Email
									</label>
									<input
										id="location-email"
										v-model="newLocation.email"
										type="email"
										placeholder="Email"
										class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0D65AE] focus:border-transparent outline-none"
									/>
								</div>
							</div>
						</div>

						<!-- Footer -->
						<div
							class="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-100"
						>
							<button
								@click="showAddLocationDialog = false"
								class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
							>
								Cancel
							</button>
							<button
								@click="submitAddLocation"
								:disabled="addingLocation"
								class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0D65AE] rounded-lg hover:bg-[#0a4f87] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
							>
								<svg
									v-if="addingLocation"
									class="w-4 h-4 animate-spin"
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
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
									/>
								</svg>
								{{
									addingLocation
										? "Adding..."
										: "Add Location"
								}}
							</button>
						</div>
					</div>
				</div>
			</Transition>
		</Teleport>

		<!-- ── Modal: Add Category ───────────────────────────────────── -->
		<Teleport to="body">
			<Transition name="modal">
				<div
					v-if="showAddCategoryDialog"
					class="fixed inset-0 z-50 flex items-center justify-center"
				>
					<div
						class="absolute inset-0 bg-black/50"
						@click="showAddCategoryDialog = false"
					></div>
					<div
						class="relative bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-6"
					>
						<!-- Header -->
						<div class="flex items-center justify-between mb-5">
							<div>
								<h3 class="text-lg font-semibold text-gray-900">
									Add from catalogue
								</h3>
								<p class="text-sm text-gray-500 mt-1">
									Choose platform subcategories this company will use for services.
								</p>
							</div>
							<button
								@click="showAddCategoryDialog = false"
								class="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
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
						<div class="max-h-[50vh] overflow-y-auto text-sm">
							<div
								v-if="loadingMasterCategories"
								class="py-10 text-center text-gray-600"
							>
								Loading catalogue…
							</div>
							<div
								v-else-if="!masterCategoryTree.length"
								class="text-gray-600 py-2"
							>
								No catalogue categories are available. Seed master categories in
								the API project.
							</div>
							<div v-else class="space-y-4">
								<div
									v-for="parent in masterCategoryTree"
									:key="parent.uuid"
									class="border border-gray-200 rounded-lg p-3"
								>
									<p class="font-medium text-gray-900 mb-2">{{ parent.name }}</p>
									<div class="space-y-2 pl-1">
										<label
											v-for="sub in parent.subcategories || []"
											:key="sub.uuid"
											class="flex items-start gap-2 text-gray-700 cursor-pointer"
										>
											<input
												type="checkbox"
												class="mt-0.5 rounded border-gray-300"
												:value="sub.uuid"
												v-model="selectedMasterCategoryUuids"
											/>
											<span>{{ sub.name }}</span>
										</label>
									</div>
								</div>
							</div>
						</div>

						<!-- Footer -->
						<div
							class="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-100"
						>
							<button
								@click="showAddCategoryDialog = false"
								class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
							>
								Cancel
							</button>
							<button
								@click="submitAddCategory"
								:disabled="
									addingCategory || !selectedMasterCategoryUuids.length
								"
								class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0D65AE] rounded-lg hover:bg-[#0a4f87] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
							>
								<svg
									v-if="addingCategory"
									class="w-4 h-4 animate-spin"
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
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
									/>
								</svg>
								{{ addingCategory ? "Adding…" : "Add selected" }}
							</button>
						</div>
					</div>
				</div>
			</Transition>
		</Teleport>

		<!-- ── Modal: Confirm Delete ─────────────────────────────────── -->
		<Teleport to="body">
			<Transition name="modal">
				<div
					v-if="showDeleteConfirm"
					class="fixed inset-0 z-50 flex items-center justify-center"
				>
					<div
						class="absolute inset-0 bg-black/50"
						@click="showDeleteConfirm = false"
					></div>
					<div
						class="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6"
					>
						<!-- Header -->
						<div class="flex items-center gap-3 mb-4">
							<div
								class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0"
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
							<h3 class="text-lg font-semibold text-gray-900">
								Confirm Delete
							</h3>
						</div>

						<!-- Message -->
						<p class="text-sm text-gray-600 mb-6 leading-relaxed">
							{{ deleteConfirmMessage }}
						</p>

						<!-- Footer -->
						<div
							class="flex items-center justify-end gap-3 pt-4 border-t border-gray-100"
						>
							<button
								@click="
									showDeleteConfirm = false;
									pendingDeleteFn = null;
								"
								class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
							>
								Cancel
							</button>
							<button
								@click="
									() => {
										if (pendingDeleteFn) pendingDeleteFn();
										showDeleteConfirm = false;
										pendingDeleteFn = null;
									}
								"
								class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-all"
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
										d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
									/>
								</svg>
								Delete
							</button>
						</div>
					</div>
				</div>
			</Transition>
		</Teleport>
	</div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useCompanies } from "@/composables/useCompanies";
import { useServices } from "@/composables/useServices";
import { useToast } from "@/composables/useToast";
import { usePermissions } from "@/composables/usePermissions";
import LoadingSpinner from "@/components/common/LoadingSpinner.vue";
import EmptyState from "@/components/common/EmptyState.vue";
import MembersList from "@/components/companies/MembersList.vue";
import LocationsList from "@/components/companies/LocationsList.vue";
import CategoriesList from "@/components/companies/CategoriesList.vue";
import { formatDate } from "@/utils/formatters";
import { getServiceCategories } from "@/api/services.api";

// ── Click-outside directive ──────────────────────────────────────────────────
const vClickOutside = {
	mounted(el, binding) {
		el._clickOutsideHandler = (event) => {
			if (!el.contains(event.target)) binding.value(event);
		};
		document.addEventListener("click", el._clickOutsideHandler);
	},
	unmounted(el) {
		document.removeEventListener("click", el._clickOutsideHandler);
	},
};

// ── Router / Route ───────────────────────────────────────────────────────────
const router = useRouter();
const route = useRoute();
const { showSuccess, showError } = useToast();
const {
	canManage,
	canEditCompany,
	canDeleteCompany,
	canManageMembers,
	canManageLocations,
	canManageCategories,
	canViewCompany,
} = usePermissions();

// ── Composables ──────────────────────────────────────────────────────────────
const {
	state,
	currentCompanyMembersCount,
	currentCompanyLocationsCount,
	fetchCompany,
	fetchCompanyMembers,
	fetchCompanyLocations,
	fetchCompanyCategories,
	addCompanyMember,
	addCompanyLocation,
	createCompanyCategory,
	removeCompanyMember,
	deleteCompanyLocation,
	deleteCompanyCategory,
	deleteCompany,
} = useCompanies();

const {
	state: servicesState,
	servicesCount: servicesCountComputed,
	fetchCompanyServices,
} = useServices();

// ── Local state ──────────────────────────────────────────────────────────────
const isLoading = ref(false);
const membersLoading = ref(false);
const locationsLoading = ref(false);
const categoriesLoading = ref(false);
const servicesLoading = ref(false);
const error = ref(null);
const activeTab = ref("members");
const showMenu = ref(false);

// Dialog states
const showAddMemberDialog = ref(false);
const showAddLocationDialog = ref(false);
const showAddCategoryDialog = ref(false);
const addingMember = ref(false);
const addingLocation = ref(false);
const addingCategory = ref(false);

// Delete-confirm modal state (replaces PrimeVue useConfirm)
const showDeleteConfirm = ref(false);
const deleteConfirmMessage = ref("");
const pendingDeleteFn = ref(null);

// Form data
const newMember = ref({ email: "", role: "" });
const newLocation = ref({ name: "", address: "", phone: "", email: "" });
const masterCategoryTree = ref([]);
const selectedMasterCategoryUuids = ref([]);
const loadingMasterCategories = ref(false);

// ── Helpers ──────────────────────────────────────────────────────────────────
const confirmAction = (message, fn) => {
	deleteConfirmMessage.value = message;
	pendingDeleteFn.value = fn;
	showDeleteConfirm.value = true;
};

// ── Computed ─────────────────────────────────────────────────────────────────
const companyId = computed(() => parseInt(route.params.id));

const currentCompany = computed(() => state.currentCompany);

const statusClass = computed(() => {
	const status = currentCompany.value?.status?.toLowerCase();

	if (status === "active") {
		return "bg-green-100 text-green-800";
	} else if (status === "inactive") {
		return "bg-gray-100 text-gray-800";
	} else if (status === "pending") {
		return "bg-yellow-100 text-yellow-800";
	}

	return "bg-gray-100 text-gray-800";
});

const fullAddress = computed(() => {
	if (!currentCompany.value) return "";

	const parts = [
		currentCompany.value.address,
		currentCompany.value.city,
		currentCompany.value.country,
	].filter(Boolean);

	return parts.join(", ");
});

const categoriesCount = computed(() => state.currentCompanyCategories.length);
const servicesCount = computed(() => servicesCountComputed.value || 0);

const canManageCompany = computed(() => {
	return canManage(companyId.value);
});

const canEditThisCompany = computed(() => {
	return canManageCompany.value && canEditCompany.value;
});

const canDeleteThisCompany = computed(() => {
	return canManageCompany.value && canDeleteCompany.value;
});

const canManageMembersHere = computed(() => {
	return canManageCompany.value && canManageMembers.value;
});

const canManageLocationsHere = computed(() => {
	return canManageCompany.value && canManageLocations.value;
});

const canManageCategoriesHere = computed(() => {
	return canManageCompany.value && canManageCategories.value;
});

// ── Methods ──────────────────────────────────────────────────────────────────
const loadCompanyData = async () => {
	isLoading.value = true;
	error.value = null;

	try {
		const result = await fetchCompany(companyId.value);

		if (!result.success) {
			error.value = result.error || "Failed to load company";
			return;
		}

		// Check view permission after loading
		if (currentCompany.value && !canViewCompany.value) {
			showError("You do not have permission to view this company");
			router.push({ name: "Unauthorized" });
			return;
		}

		// Load related data in parallel
		await Promise.all([
			loadMembers(),
			loadLocations(),
			loadCategories(),
			loadServices(),
		]);
	} catch (err) {
		error.value = err.message || "An error occurred";
		console.error("Error loading company:", err);
	} finally {
		isLoading.value = false;
	}
};

const loadMembers = async () => {
	membersLoading.value = true;
	try {
		await fetchCompanyMembers(companyId.value);
	} catch (err) {
		console.error("Error loading members:", err);
	} finally {
		membersLoading.value = false;
	}
};

const loadLocations = async () => {
	locationsLoading.value = true;
	try {
		await fetchCompanyLocations(companyId.value);
	} catch (err) {
		console.error("Error loading locations:", err);
	} finally {
		locationsLoading.value = false;
	}
};

const loadCategories = async () => {
	categoriesLoading.value = true;
	try {
		await fetchCompanyCategories(companyId.value);
	} catch (err) {
		console.error("Error loading categories:", err);
	} finally {
		categoriesLoading.value = false;
	}
};

const loadServices = async () => {
	servicesLoading.value = true;
	try {
		await fetchCompanyServices(companyId.value);
	} catch (err) {
		console.error("Error loading services:", err);
	} finally {
		servicesLoading.value = false;
	}
};

const handleGoBack = () => {
	router.push({ name: "MyCompanies" });
};

const handleEditCompany = () => {
	if (!canEditThisCompany.value) {
		showError("You do not have permission to edit this company");
		return;
	}

	router.push({
		name: "EditCompany",
		params: { id: companyId.value },
	});
};

const handleDeleteCompany = () => {
	if (!canDeleteThisCompany.value) {
		showError("You do not have permission to delete this company");
		return;
	}

	confirmAction(
		`Are you sure you want to delete "${currentCompany.value.name}"? This action cannot be undone.`,
		async () => {
			try {
				const result = await deleteCompany(companyId.value);
				if (result.success) {
					showSuccess("Company deleted successfully");
					router.push({ name: "MyCompanies" });
				} else {
					showError(result.error || "Failed to delete company");
				}
			} catch (err) {
				showError("An error occurred while deleting the company");
			}
		},
	);
};

// Members handlers
const handleAddMember = () => {
	if (!canManageMembersHere.value) {
		showError("You do not have permission to add members");
		return;
	}

	newMember.value = { email: "", role: "" };
	showAddMemberDialog.value = true;
};

const handleEditMember = (member) => {
	// TODO: Implement edit member
	showError("Edit member not yet implemented");
};

const handleRemoveMember = (member) => {
	if (!canManageMembersHere.value) {
		showError("You do not have permission to remove members");
		return;
	}

	confirmAction(
		`Are you sure you want to remove ${member.name || member.email} from this company?`,
		async () => {
			try {
				const result = await removeCompanyMember(
					companyId.value,
					member.user_id || member.id,
				);
				if (result.success) {
					showSuccess("Member removed successfully");
					loadMembers();
				} else {
					showError(result.error || "Failed to remove member");
				}
			} catch (err) {
				showError("An error occurred while removing the member");
			}
		},
	);
};

const submitAddMember = async () => {
	if (!canManageMembersHere.value) {
		showError("You do not have permission to add members");
		return;
	}

	if (!newMember.value.email) {
		showError("Please enter an email address");
		return;
	}

	addingMember.value = true;

	try {
		const result = await addCompanyMember(companyId.value, {
			email: newMember.value.email,
			role: newMember.value.role || "member",
		});

		if (result.success) {
			showSuccess("Member added successfully");
			showAddMemberDialog.value = false;
			loadMembers();
		} else {
			showError(result.error || "Failed to add member");
		}
	} catch (err) {
		showError("An error occurred while adding the member");
	} finally {
		addingMember.value = false;
	}
};

// Locations handlers
const handleAddLocation = () => {
	if (!canManageLocationsHere.value) {
		showError("You do not have permission to add locations");
		return;
	}

	newLocation.value = { name: "", address: "", phone: "", email: "" };
	showAddLocationDialog.value = true;
};

const handleEditLocation = (location) => {
	// TODO: Implement edit location
	showError("Edit location not yet implemented");
};

const handleDeleteLocation = (location) => {
	if (!canManageLocationsHere.value) {
		showError("You do not have permission to delete locations");
		return;
	}

	confirmAction(
		`Are you sure you want to delete "${location.name}"?`,
		async () => {
			try {
				const result = await deleteCompanyLocation(
					companyId.value,
					location.id,
				);
				if (result.success) {
					showSuccess("Location deleted successfully");
					loadLocations();
				} else {
					showError(result.error || "Failed to delete location");
				}
			} catch (err) {
				showError("An error occurred while deleting the location");
			}
		},
	);
};

const submitAddLocation = async () => {
	if (!canManageLocationsHere.value) {
		showError("You do not have permission to add locations");
		return;
	}

	if (!newLocation.value.name || !newLocation.value.address) {
		showError("Please fill in all required fields");
		return;
	}

	addingLocation.value = true;

	try {
		const result = await addCompanyLocation(
			companyId.value,
			newLocation.value,
		);

		if (result.success) {
			showSuccess("Location added successfully");
			showAddLocationDialog.value = false;
			loadLocations();
		} else {
			showError(result.error || "Failed to add location");
		}
	} catch (err) {
		showError("An error occurred while adding the location");
	} finally {
		addingLocation.value = false;
	}
};

// Categories handlers
const handleAddCategory = async () => {
	if (!canManageCategoriesHere.value) {
		showError("You do not have permission to add categories");
		return;
	}

	selectedMasterCategoryUuids.value = [];
	masterCategoryTree.value = [];
	showAddCategoryDialog.value = true;
	loadingMasterCategories.value = true;
	try {
		const res = await getServiceCategories({ scope: "master-tree" });
		const body = res?.data !== undefined ? res.data : res;
		masterCategoryTree.value = Array.isArray(body) ? body : [];
	} catch {
		showError("Failed to load the category catalogue");
		showAddCategoryDialog.value = false;
	} finally {
		loadingMasterCategories.value = false;
	}
};

const handleEditCategory = (category) => {
	// TODO: Implement edit category
	showError("Edit category not yet implemented");
};

const handleDeleteCategory = (category) => {
	if (!canManageCategoriesHere.value) {
		showError("You do not have permission to delete categories");
		return;
	}

	confirmAction(
		`Are you sure you want to delete the category "${category.name}"?`,
		async () => {
			try {
				const result = 				await deleteCompanyCategory(
					companyId.value,
					category.uuid || category.id,
				);
				if (result.success) {
					showSuccess("Category deleted successfully");
					loadCategories();
				} else {
					showError(result.error || "Failed to delete category");
				}
			} catch (err) {
				showError("An error occurred while deleting the category");
			}
		},
	);
};

const submitAddCategory = async () => {
	if (!canManageCategoriesHere.value) {
		showError("You do not have permission to add categories");
		return;
	}

	if (!selectedMasterCategoryUuids.value.length) {
		showError("Select at least one subcategory from the catalogue");
		return;
	}

	addingCategory.value = true;

	try {
		const result = await createCompanyCategory(companyId.value, {
			masterCategoryUuids: [...selectedMasterCategoryUuids.value],
		});

		if (result.success) {
			showSuccess("Categories added successfully");
			showAddCategoryDialog.value = false;
			loadCategories();
		} else {
			showError(result.error || "Failed to add category");
		}
	} catch (err) {
		showError("An error occurred while adding the category");
	} finally {
		addingCategory.value = false;
	}
};

// Lifecycle
onMounted(() => {
	loadCompanyData();
});
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
	transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
	opacity: 0;
}
.modal-enter-active .relative,
.modal-leave-active .relative {
	transition: transform 0.2s ease;
}
.modal-enter-from .relative,
.modal-leave-to .relative {
	transform: scale(0.95) translateY(-8px);
}
</style>
