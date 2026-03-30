<template>
	<div class="company-services-manager">
		<!-- Header -->
		<div class="flex items-center justify-between mb-6">
			<div>
				<h3 class="text-lg font-semibold text-gray-900">
					Company Services
				</h3>
				<p class="text-sm text-gray-600 mt-1">
					Manage services offered by your company
				</p>
			</div>
			<button
				v-if="canCreate"
				@click="openCreateDialog"
				class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0D65AE] rounded-lg hover:bg-[#0a4f87] focus:ring-2 focus:ring-[#0D65AE] focus:ring-offset-2 transition-all"
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
				Add Service
			</button>
		</div>

		<!-- Filters & Search -->
		<div
			v-if="services.length > 0 || searchQuery || selectedCategory || selectedStatus"
			class="bg-white rounded-lg border border-gray-200 p-4 mb-6"
		>
			<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
				<!-- Search -->
				<div class="relative">
					<svg
						class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
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

				<!-- Category Filter -->
				<select
					v-model="selectedCategory"
					class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#0D65AE] focus:ring-2 focus:ring-[#0D65AE] focus:ring-opacity-20 focus:outline-none transition-all"
				>
					<option :value="null">All Categories</option>
					<option
						v-for="category in categories"
						:key="category.id"
						:value="category.id"
					>
						{{ category.name }}
					</option>
				</select>

				<!-- Status Filter -->
				<select
					v-model="selectedStatus"
					class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#0D65AE] focus:ring-2 focus:ring-[#0D65AE] focus:ring-opacity-20 focus:outline-none transition-all"
				>
					<option value="">All Statuses</option>
					<option value="active">Active</option>
					<option value="inactive">Inactive</option>
					<option value="draft">Draft</option>
				</select>
			</div>
		</div>

		<!-- Loading State -->
		<div
			v-if="loading && services.length === 0"
			class="flex items-center justify-center py-12"
		>
			<div class="text-center">
				<div
					class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0D65AE] mx-auto"
				></div>
				<p class="text-gray-600 mt-4">Loading services...</p>
			</div>
		</div>

		<!-- Empty State -->
		<div
			v-else-if="!loading && services.length === 0 && !searchQuery && !selectedCategory && !selectedStatus"
			class="text-center py-12 bg-white rounded-xl border border-gray-200"
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
				No Services Yet
			</h3>
			<p class="text-gray-600 mb-4">
				Create your first service to start offering it to customers
			</p>
			<button
				v-if="canCreate"
				@click="openCreateDialog"
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
				Add Service
			</button>
		</div>

		<!-- No Results State -->
		<div
			v-else-if="!loading && filteredServices.length === 0"
			class="text-center py-12 bg-white rounded-xl border border-gray-200"
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
		<div
			v-else
			class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
		>
			<div
				v-for="service in filteredServices"
				:key="service.id"
				class="bg-white rounded-lg border border-gray-200 hover:border-[#0D65AE] transition-all overflow-hidden"
			>
				<!-- Service Header -->
				<div class="p-4">
					<div class="flex items-start justify-between mb-3">
						<div class="flex-1 min-w-0">
							<h4
								class="text-base font-semibold text-gray-900 mb-1 truncate"
							>
								{{ service.name }}
							</h4>
							<div class="flex items-center gap-2 flex-wrap">
								<!-- Category Badge -->
								<span
									v-if="getCategoryName(service.categoryId)"
									class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
								>
									{{ getCategoryName(service.categoryId) }}
								</span>
								<!-- Status Badge -->
								<span
									:class="getStatusClass(service.status)"
									class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
								>
									{{ formatStatus(service.status) }}
								</span>
							</div>
						</div>

						<!-- Actions Dropdown -->
						<div v-if="canEdit || canDelete" class="relative ml-2">
							<button
								@click="toggleServiceMenu(service.id)"
								class="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
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
										d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
									/>
								</svg>
							</button>

							<!-- Dropdown Menu -->
							<div
								v-if="activeServiceMenu === service.id"
								v-click-outside="closeServiceMenu"
								class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10"
							>
								<button
									@click="viewService(service)"
									class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
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
									v-if="canEdit"
									@click="openEditDialog(service)"
									class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
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
									Edit Service
								</button>
								<button
									v-if="canDelete"
									@click="confirmDelete(service)"
									class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
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
									Delete Service
								</button>
							</div>
						</div>
					</div>

					<!-- Description -->
					<p
						v-if="service.description"
						class="text-sm text-gray-600 line-clamp-2 mb-3"
					>
						{{ service.description }}
					</p>

					<!-- Price and Duration -->
					<div class="flex items-center gap-4 text-sm">
						<div class="flex items-center gap-1.5">
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
									d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							<span class="font-semibold text-gray-900">
								{{ formatPrice(service.price) }}
							</span>
						</div>
						<div
							v-if="service.duration"
							class="flex items-center gap-1.5"
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
									d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							<span class="text-gray-600">
								{{ formatDuration(service.duration) }}
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Create/Edit Dialog -->
		<div
			v-if="showDialog"
			class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
			@click.self="closeDialog"
		>
			<div
				class="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
			>
				<div
					class="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10"
				>
					<h3 class="text-lg font-semibold text-gray-900">
						{{ editingService ? "Edit Service" : "Add Service" }}
					</h3>
					<button
						@click="closeDialog"
						class="text-gray-400 hover:text-gray-600 transition-colors"
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

				<form @submit.prevent="submitService" class="p-6 space-y-4">
					<!-- Service Name -->
					<div>
						<label
							for="service-name"
							class="block text-sm font-semibold text-gray-900 mb-2"
						>
							Service Name *
						</label>
						<input
							id="service-name"
							v-model="serviceForm.name"
							type="text"
							required
							class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#0D65AE] focus:ring-2 focus:ring-[#0D65AE] focus:ring-opacity-20 focus:outline-none transition-all"
							placeholder="e.g., Standard Cleaning"
						/>
						<p v-if="errors.name" class="mt-1 text-sm text-red-600">
							{{ errors.name }}
						</p>
					</div>

					<!-- Category -->
					<div>
						<label
							for="service-category"
							class="block text-sm font-semibold text-gray-900 mb-2"
						>
							Category *
						</label>
						<select
							id="service-category"
							v-model="serviceForm.categoryId"
							required
							class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#0D65AE] focus:ring-2 focus:ring-[#0D65AE] focus:ring-opacity-20 focus:outline-none transition-all"
						>
							<option :value="null" disabled>
								Select a category
							</option>
							<option
								v-for="category in categories"
								:key="category.id"
								:value="category.id"
							>
								{{ category.name }}
							</option>
						</select>
						<p
							v-if="errors.categoryId"
							class="mt-1 text-sm text-red-600"
						>
							{{ errors.categoryId }}
						</p>
					</div>

					<!-- Description -->
					<div>
						<label
							for="service-description"
							class="block text-sm font-semibold text-gray-900 mb-2"
						>
							Description
						</label>
						<textarea
							id="service-description"
							v-model="serviceForm.description"
							rows="4"
							class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#0D65AE] focus:ring-2 focus:ring-[#0D65AE] focus:ring-opacity-20 focus:outline-none transition-all resize-none"
							placeholder="Describe your service in detail"
						></textarea>
					</div>

					<!-- Price and Duration -->
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<!-- Price -->
						<div>
							<label
								for="service-price"
								class="block text-sm font-semibold text-gray-900 mb-2"
							>
								Price ($) *
							</label>
							<input
								id="service-price"
								v-model.number="serviceForm.price"
								type="number"
								step="0.01"
								min="0"
								required
								class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#0D65AE] focus:ring-2 focus:ring-[#0D65AE] focus:ring-opacity-20 focus:outline-none transition-all"
								placeholder="0.00"
							/>
							<p
								v-if="errors.price"
								class="mt-1 text-sm text-red-600"
							>
								{{ errors.price }}
							</p>
						</div>

						<!-- Duration -->
						<div>
							<label
								for="service-duration"
								class="block text-sm font-semibold text-gray-900 mb-2"
							>
								Duration (minutes)
							</label>
							<input
								id="service-duration"
								v-model.number="serviceForm.duration"
								type="number"
								min="0"
								class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#0D65AE] focus:ring-2 focus:ring-[#0D65AE] focus:ring-opacity-20 focus:outline-none transition-all"
								placeholder="e.g., 60"
							/>
						</div>
					</div>

					<!-- Status -->
					<div>
						<label
							for="service-status"
							class="block text-sm font-semibold text-gray-900 mb-2"
						>
							Status
						</label>
						<select
							id="service-status"
							v-model="serviceForm.status"
							class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#0D65AE] focus:ring-2 focus:ring-[#0D65AE] focus:ring-opacity-20 focus:outline-none transition-all"
						>
							<option value="active">Active</option>
							<option value="inactive">Inactive</option>
							<option value="draft">Draft</option>
						</select>
					</div>

					<!-- Actions -->
					<div class="flex gap-3 pt-4 sticky bottom-0 bg-white">
						<button
							type="button"
							@click="closeDialog"
							:disabled="saving"
							class="flex-1 px-4 py-2 text-sm font-medium border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-[#0D65AE] focus:ring-offset-2 transition-all disabled:opacity-50"
						>
							Cancel
						</button>
						<button
							type="submit"
							:disabled="saving"
							class="flex-1 px-4 py-2 text-sm font-medium bg-[#0D65AE] text-white rounded-lg hover:bg-[#0a4f87] focus:ring-2 focus:ring-[#0D65AE] focus:ring-offset-2 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
						>
							<svg
								v-if="saving"
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
								></circle>
								<path
									class="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								></path>
							</svg>
							{{
								saving
									? "Saving..."
									: editingService
									? "Update Service"
									: "Add Service"
							}}
						</button>
					</div>
				</form>
			</div>
		</div>

		<!-- Delete Confirmation Dialog -->
		<div
			v-if="showDeleteDialog"
			class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
			@click.self="closeDeleteDialog"
		>
			<div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
				<div class="flex items-center gap-4 mb-4">
					<div
						class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0"
					>
						<svg
							class="w-6 h-6 text-red-600"
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
					<div>
						<h3 class="text-lg font-semibold text-gray-900">
							Delete Service
						</h3>
						<p class="text-sm text-gray-600 mt-1">
							Are you sure you want to delete "{{
								serviceToDelete?.name
							}}"?
						</p>
					</div>
				</div>

				<p class="text-sm text-gray-600 mb-6">
					This action cannot be undone. All bookings and related data
					will be affected.
				</p>

				<div class="flex gap-3">
					<button
						@click="closeDeleteDialog"
						:disabled="deleting"
						class="flex-1 px-4 py-2 text-sm font-medium border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50"
					>
						Cancel
					</button>
					<button
						@click="handleDelete"
						:disabled="deleting"
						class="flex-1 px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
					>
						<svg
							v-if="deleting"
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
							></circle>
							<path
								class="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							></path>
						</svg>
						{{ deleting ? "Deleting..." : "Delete Service" }}
					</button>
				</div>
			</div>
		</div>

		<!-- View Service Dialog -->
		<div
			v-if="showViewDialog"
			class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
			@click.self="closeViewDialog"
		>
			<div
				class="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
			>
				<div
					class="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10"
				>
					<h3 class="text-lg font-semibold text-gray-900">
						Service Details
					</h3>
					<button
						@click="closeViewDialog"
						class="text-gray-400 hover:text-gray-600 transition-colors"
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

				<div v-if="viewingService" class="p-6 space-y-6">
					<!-- Header -->
					<div>
						<h2 class="text-2xl font-bold text-gray-900 mb-2">
							{{ viewingService.name }}
						</h2>
						<div class="flex items-center gap-2 flex-wrap">
							<span
								v-if="getCategoryName(viewingService.categoryId)"
								class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
							>
								{{ getCategoryName(viewingService.categoryId) }}
							</span>
							<span
								:class="getStatusClass(viewingService.status)"
								class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
							>
								{{ formatStatus(viewingService.status) }}
							</span>
						</div>
					</div>

					<!-- Description -->
					<div v-if="viewingService.description">
						<h4 class="text-sm font-semibold text-gray-900 mb-2">
							Description
						</h4>
						<p class="text-gray-700">
							{{ viewingService.description }}
						</p>
					</div>

					<!-- Pricing & Duration -->
					<div class="grid grid-cols-2 gap-4">
						<div>
							<h4
								class="text-sm font-semibold text-gray-900 mb-2"
							>
								Price
							</h4>
							<p class="text-2xl font-bold text-[#0D65AE]">
								{{ formatPrice(viewingService.price) }}
							</p>
						</div>
						<div v-if="viewingService.duration">
							<h4
								class="text-sm font-semibold text-gray-900 mb-2"
							>
								Duration
							</h4>
							<p class="text-2xl font-bold text-[#0D65AE]">
								{{ formatDuration(viewingService.duration) }}
							</p>
						</div>
					</div>

					<!-- Metadata -->
					<div class="pt-4 border-t border-gray-200 space-y-2">
						<div
							v-if="viewingService.created_at"
							class="flex items-center justify-between text-sm"
						>
							<span class="text-gray-600">Created</span>
							<span class="text-gray-900">
								{{ formatDate(viewingService.created_at) }}
							</span>
						</div>
						<div
							v-if="viewingService.updated_at"
							class="flex items-center justify-between text-sm"
						>
							<span class="text-gray-600">Last Updated</span>
							<span class="text-gray-900">
								{{ formatDate(viewingService.updated_at) }}
							</span>
						</div>
					</div>

					<!-- Actions -->
					<div class="flex gap-3 pt-4">
						<button
							v-if="canEdit"
							@click="editFromView"
							class="flex-1 px-4 py-2 text-sm font-medium border border-[#0D65AE] text-[#0D65AE] rounded-lg hover:bg-[#0D65AE] hover:text-white transition-all"
						>
							Edit Service
						</button>
						<button
							@click="closeViewDialog"
							class="flex-1 px-4 py-2 text-sm font-medium border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
						>
							Close
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useServices } from "@/composables/useServices";
import {
	formatCurrency,
	formatDuration,
	formatStatus,
	formatDate,
} from "@/utils/formatters";

const props = defineProps({
	companyId: {
		type: Number,
		required: true,
	},
	services: {
		type: Array,
		default: () => [],
	},
	categories: {
		type: Array,
		default: () => [],
	},
	loading: {
		type: Boolean,
		default: false,
	},
	canCreate: {
		type: Boolean,
		default: true,
	},
	canEdit: {
		type: Boolean,
		default: true,
	},
	canDelete: {
		type: Boolean,
		default: true,
	},
});

const emit = defineEmits([
	"refresh",
	"service-created",
	"service-updated",
	"service-deleted",
]);

const {
	createCompanyService,
	updateCompanyService,
	deleteCompanyService,
} = useServices();

// State
const showDialog = ref(false);
const showDeleteDialog = ref(false);
const showViewDialog = ref(false);
const editingService = ref(null);
const viewingService = ref(null);
const serviceToDelete = ref(null);
const saving = ref(false);
const deleting = ref(false);
const activeServiceMenu = ref(null);
const searchQuery = ref("");
const selectedCategory = ref(null);
const selectedStatus = ref("");

const serviceForm = ref({
	name: "",
	categoryId: null,
	description: "",
	price: null,
	duration: null,
	status: "active",
});

const errors = ref({});

// Computed
const filteredServices = computed(() => {
	let filtered = [...props.services];

	// Filter by search
	if (searchQuery.value) {
		const query = searchQuery.value.toLowerCase();
		filtered = filtered.filter(
			(service) =>
				service.name?.toLowerCase().includes(query) ||
				service.description?.toLowerCase().includes(query)
		);
	}

	// Filter by category
	if (selectedCategory.value) {
		filtered = filtered.filter(
			(service) => service.categoryId === selectedCategory.value
		);
	}

	// Filter by status
	if (selectedStatus.value) {
		filtered = filtered.filter(
			(service) => service.status === selectedStatus.value
		);
	}

	return filtered;
});

// Methods
const getCategoryName = (categoryId) => {
	const category = props.categories.find((cat) => cat.id === categoryId);
	return category?.name || "";
};

const getStatusClass = (status) => {
	const statusLower = status?.toLowerCase();
	if (statusLower === "active") {
		return "bg-green-100 text-green-800";
	} else if (statusLower === "inactive") {
		return "bg-gray-100 text-gray-800";
	} else if (statusLower === "draft") {
		return "bg-yellow-100 text-yellow-800";
	}
	return "bg-gray-100 text-gray-800";
};

const formatPrice = (price) => {
	return formatCurrency(price);
};

const clearFilters = () => {
	searchQuery.value = "";
	selectedCategory.value = null;
	selectedStatus.value = "";
};

const openCreateDialog = () => {
	editingService.value = null;
	serviceForm.value = {
		name: "",
		categoryId: null,
		description: "",
		price: null,
		duration: null,
		status: "active",
	};
	errors.value = {};
	showDialog.value = true;
};

const openEditDialog = (service) => {
	editingService.value = service;
	serviceForm.value = {
		name: service.name || "",
		categoryId: service.categoryId || null,
		description: service.description || "",
		price: service.price || null,
		duration: service.duration || null,
		status: service.status || "active",
	};
	errors.value = {};
	showDialog.value = true;
	closeServiceMenu();
};

const closeDialog = () => {
	showDialog.value = false;
	editingService.value = null;
	serviceForm.value = {
		name: "",
		categoryId: null,
		description: "",
		price: null,
		duration: null,
		status: "active",
	};
	errors.value = {};
};

const validateForm = () => {
	errors.value = {};

	if (!serviceForm.value.name || serviceForm.value.name.trim() === "") {
		errors.value.name = "Service name is required";
	}

	if (!serviceForm.value.categoryId) {
		errors.value.categoryId = "Category is required";
	}

	if (
		serviceForm.value.price === null ||
		serviceForm.value.price === undefined ||
		serviceForm.value.price < 0
	) {
		errors.value.price = "Valid price is required";
	}

	return Object.keys(errors.value).length === 0;
};

const submitService = async () => {
	if (!validateForm()) {
		return;
	}

	saving.value = true;

	try {
		const serviceData = {
			name: serviceForm.value.name.trim(),
			categoryId: serviceForm.value.categoryId,
			description: serviceForm.value.description.trim() || undefined,
			price: parseFloat(serviceForm.value.price),
			duration: serviceForm.value.duration || undefined,
			status: serviceForm.value.status,
		};

		let result;
		if (editingService.value) {
			result = await updateCompanyService(
				props.companyId,
				editingService.value.id,
				serviceData
			);
			if (result.success) {
				emit("service-updated", result.data);
			}
		} else {
			result = await createCompanyService(props.companyId, serviceData);
			if (result.success) {
				emit("service-created", result.data);
			}
		}

		if (result.success) {
			closeDialog();
			emit("refresh");
		}
	} catch (error) {
		console.error("Error saving service:", error);
	} finally {
		saving.value = false;
	}
};

const confirmDelete = (service) => {
	serviceToDelete.value = service;
	showDeleteDialog.value = true;
	closeServiceMenu();
};

const closeDeleteDialog = () => {
	showDeleteDialog.value = false;
	serviceToDelete.value = null;
};

const handleDelete = async () => {
	if (!serviceToDelete.value) return;

	deleting.value = true;

	try {
		const result = await deleteCompanyService(
			props.companyId,
			serviceToDelete.value.id
		);

		if (result.success) {
			emit("service-deleted", serviceToDelete.value.id);
			closeDeleteDialog();
			emit("refresh");
		}
	} catch (error) {
		console.error("Error deleting service:", error);
	} finally {
		deleting.value = false;
	}
};

const viewService = (service) => {
	viewingService.value = service;
	showViewDialog.value = true;
	closeServiceMenu();
};

const closeViewDialog = () => {
	showViewDialog.value = false;
	viewingService.value = null;
};

const editFromView = () => {
	closeViewDialog();
	openEditDialog(viewingService.value);
};

const toggleServiceMenu = (serviceId) => {
	if (activeServiceMenu.value === serviceId) {
		activeServiceMenu.value = null;
	} else {
		activeServiceMenu.value = serviceId;
	}
};

const closeServiceMenu = () => {
	activeServiceMenu.value = null;
};

// Click outside directive
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
</script>

<style scoped>
.line-clamp-2 {
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
}
</style>
