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
							My Profile
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
									d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
								></path>
							</svg>
							Manage your personal information and preferences
						</p>
					</div>
					<div class="flex items-center gap-2 sm:gap-3">
						<button
							v-if="!isEditing"
							@click="startEditing"
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
									d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
								></path>
							</svg>
							<span>Edit Profile</span>
						</button>
						<template v-else>
							<button
								@click="cancelEditing"
								class="inline-flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-all"
							>
								<span>Cancel</span>
							</button>
							<button
								@click="saveProfile"
								:disabled="isSaving"
								class="inline-flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-medium text-white bg-[#0D65AE] rounded-lg hover:bg-[#0D65AE]/90 focus:ring-2 focus:ring-[#0D65AE] focus:ring-offset-2 disabled:opacity-50 transition-all"
							>
								<svg
									v-if="isSaving"
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
								<span>{{
									isSaving ? "Saving..." : "Save Changes"
								}}</span>
							</button>
						</template>
					</div>
				</div>
			</div>

			<!-- Stats Cards -->
			<div
				class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8"
			>
				<!-- Account Status -->
				<div
					class="bg-white rounded-xl border border-gray-200 hover:border-green-400 transition-all p-5 sm:p-6"
				>
					<div class="flex items-center justify-between">
						<div class="flex-1">
							<p
								class="text-gray-500 text-xs sm:text-sm font-medium mb-1 sm:mb-2"
							>
								Account Status
							</p>
							<h3
								class="text-lg sm:text-xl font-bold text-green-600"
							>
								Active
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
								<span>Verified</span>
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
									d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
								></path>
							</svg>
						</div>
					</div>
				</div>

				<!-- Member Since -->
				<div
					class="bg-white rounded-xl border border-gray-200 hover:border-[#0D65AE] transition-all p-5 sm:p-6"
				>
					<div class="flex items-center justify-between">
						<div class="flex-1">
							<p
								class="text-gray-500 text-xs sm:text-sm font-medium mb-1 sm:mb-2"
							>
								Member Since
							</p>
							<h3
								class="text-lg sm:text-xl font-bold text-gray-900"
							>
								{{ memberSince }}
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
										d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
										clip-rule="evenodd"
									></path>
								</svg>
								<span>{{ daysSinceMember }} days</span>
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
									d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
								></path>
							</svg>
						</div>
					</div>
				</div>

				<!-- Total Boxes -->
				<div
					class="bg-white rounded-xl border border-gray-200 hover:border-purple-400 transition-all p-5 sm:p-6"
				>
					<div class="flex items-center justify-between">
						<div class="flex-1">
							<p
								class="text-gray-500 text-xs sm:text-sm font-medium mb-1 sm:mb-2"
							>
								Total Boxes
							</p>
							<h3
								class="text-2xl sm:text-3xl font-bold text-gray-900"
							>
								{{ totalBoxes }}
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
										d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
									></path>
								</svg>
								<span>Registered</span>
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
									d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
								></path>
							</svg>
						</div>
					</div>
				</div>

				<!-- Total Requests -->
				<div
					class="bg-white rounded-xl border border-gray-200 hover:border-orange-400 transition-all p-5 sm:p-6"
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
								{{ totalRequests }}
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
										d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"
									></path>
									<path
										fill-rule="evenodd"
										d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
										clip-rule="evenodd"
									></path>
								</svg>
								<span>Services</span>
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
									d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
								></path>
							</svg>
						</div>
					</div>
				</div>
			</div>

			<!-- Main Content Grid -->
			<div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
				<!-- Profile Information -->
				<div class="lg:col-span-2 space-y-4 sm:space-y-6">
					<!-- Personal Information Card -->
					<div
						class="bg-white rounded-xl border border-gray-200 p-5 sm:p-6"
					>
						<div class="flex items-center justify-between mb-6">
							<h3 class="text-lg font-semibold text-gray-900">
								Personal Information
							</h3>
						</div>

						<div class="space-y-4">
							<!-- Name -->
							<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div>
									<label
										class="block text-sm font-medium text-gray-700 mb-2"
									>
										First Name
									</label>
									<input
										v-model="formData.firstName"
										type="text"
										:disabled="!isEditing"
										class="block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D65AE] focus:border-transparent text-sm transition-all disabled:bg-gray-50 disabled:text-gray-500"
									/>
								</div>
								<div>
									<label
										class="block text-sm font-medium text-gray-700 mb-2"
									>
										Last Name
									</label>
									<input
										v-model="formData.lastName"
										type="text"
										:disabled="!isEditing"
										class="block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D65AE] focus:border-transparent text-sm transition-all disabled:bg-gray-50 disabled:text-gray-500"
									/>
								</div>
							</div>

							<!-- Email -->
							<div>
								<label
									class="block text-sm font-medium text-gray-700 mb-2"
								>
									Email Address
								</label>
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
												d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
											></path>
										</svg>
									</div>
									<input
										v-model="formData.email"
										type="email"
										:disabled="!isEditing"
										class="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D65AE] focus:border-transparent text-sm transition-all disabled:bg-gray-50 disabled:text-gray-500"
									/>
								</div>
							</div>

							<!-- Phone -->
							<div>
								<label
									class="block text-sm font-medium text-gray-700 mb-2"
								>
									Phone Number
								</label>
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
												d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
											></path>
										</svg>
									</div>
									<input
										v-model="formData.phone"
										type="tel"
										:disabled="!isEditing"
										class="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D65AE] focus:border-transparent text-sm transition-all disabled:bg-gray-50 disabled:text-gray-500"
									/>
								</div>
							</div>

							<!-- Bio -->
							<div>
								<label
									class="block text-sm font-medium text-gray-700 mb-2"
								>
									Bio
								</label>
								<textarea
									v-model="formData.bio"
									:disabled="!isEditing"
									rows="4"
									class="block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D65AE] focus:border-transparent text-sm transition-all disabled:bg-gray-50 disabled:text-gray-500"
									placeholder="Tell us about yourself..."
								></textarea>
							</div>
						</div>
					</div>

					<!-- Address Information Card -->
					<div
						class="bg-white rounded-xl border border-gray-200 p-5 sm:p-6"
					>
						<div class="flex items-center justify-between mb-6">
							<h3 class="text-lg font-semibold text-gray-900">
								Address Information
							</h3>
						</div>

						<div class="space-y-4">
							<!-- Street Address -->
							<div>
								<label
									class="block text-sm font-medium text-gray-700 mb-2"
								>
									Street Address
								</label>
								<input
									v-model="formData.address"
									type="text"
									:disabled="!isEditing"
									class="block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D65AE] focus:border-transparent text-sm transition-all disabled:bg-gray-50 disabled:text-gray-500"
								/>
							</div>

							<!-- Location: view mode – read-only text display -->
							<template v-if="!isEditing">
								<div
									class="grid grid-cols-1 sm:grid-cols-3 gap-4"
								>
									<div>
										<label
											class="block text-sm font-medium text-gray-700 mb-2"
										>
											Country
										</label>
										<input
											v-model="formData.country"
											type="text"
											disabled
											class="block w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-500"
										/>
									</div>
									<div>
										<label
											class="block text-sm font-medium text-gray-700 mb-2"
										>
											Department / State
										</label>
										<input
											v-model="formData.state"
											type="text"
											disabled
											class="block w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-500"
										/>
									</div>
									<div>
										<label
											class="block text-sm font-medium text-gray-700 mb-2"
										>
											City
										</label>
										<input
											v-model="formData.city"
											type="text"
											disabled
											class="block w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-500"
										/>
									</div>
								</div>
							</template>

							<!-- Location: edit mode – cascading Country → Department → City -->
							<LocationSelector
								v-else
								:initial-country-id="formData.countryId"
								:initial-department-id="formData.departmentId"
								:initial-city-id="formData.cityId"
								@change="onLocationChange"
							/>

							<!-- ZIP Code (always shown) -->
							<div>
								<label
									class="block text-sm font-medium text-gray-700 mb-2"
								>
									ZIP Code
								</label>
								<input
									v-model="formData.zipCode"
									type="text"
									:disabled="!isEditing"
									class="block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D65AE] focus:border-transparent text-sm transition-all disabled:bg-gray-50 disabled:text-gray-500"
								/>
							</div>
						</div>
					</div>
				</div>

				<!-- Sidebar -->
				<div class="space-y-4 sm:space-y-6">
					<!-- Profile Picture Card -->
					<div
						class="bg-white rounded-xl border border-gray-200 p-5 sm:p-6"
					>
						<h3 class="text-lg font-semibold text-gray-900 mb-4">
							Profile Picture
						</h3>
						<div class="flex flex-col items-center">
							<div
								class="w-32 h-32 bg-gradient-to-br from-[#0D65AE] to-[#0D65AE]/70 rounded-full flex items-center justify-center mb-4 border-4 border-gray-100"
							>
								<span class="text-white font-bold text-4xl">
									{{ userInitials }}
								</span>
							</div>
							<button
								v-if="isEditing"
								class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#0D65AE] bg-[#0D65AE]/5 rounded-lg hover:bg-[#0D65AE]/10 transition-all"
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
										d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
									></path>
								</svg>
								<span>Change Picture</span>
							</button>
						</div>
					</div>

					<!-- Quick Actions Card -->
					<div
						class="bg-white rounded-xl border border-gray-200 p-5 sm:p-6"
					>
						<h3 class="text-lg font-semibold text-gray-900 mb-4">
							Quick Actions
						</h3>
						<div class="space-y-2">
							<button
								class="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all"
							>
								<svg
									class="w-5 h-5 text-gray-500"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
									></path>
								</svg>
								<span>Change Password</span>
							</button>
							<button
								class="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all"
							>
								<svg
									class="w-5 h-5 text-gray-500"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
									></path>
								</svg>
								<span>Privacy Settings</span>
							</button>
							<button
								class="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all"
							>
								<svg
									class="w-5 h-5 text-gray-500"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
									></path>
								</svg>
								<span>Download Data</span>
							</button>
						</div>
					</div>

					<!-- Account Info Card -->
					<div
						class="bg-gradient-to-br from-[#0D65AE] to-[#0D65AE]/80 rounded-xl p-5 sm:p-6 text-white"
					>
						<div class="flex items-start gap-3 mb-4">
							<div
								class="bg-white/20 p-2 rounded-lg border border-white/30"
							>
								<svg
									class="w-5 h-5 text-white"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									></path>
								</svg>
							</div>
							<div class="flex-1">
								<h4 class="text-sm font-semibold mb-1">
									Keep Your Profile Updated
								</h4>
								<p
									class="text-xs text-white/80 leading-relaxed"
								>
									Make sure your information is up to date for
									better service delivery and communication.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import LocationSelector from "@/components/common/LocationSelector.vue";

// State
const isEditing = ref(false);
const isSaving = ref(false);
const totalBoxes = ref(0);
const totalRequests = ref(0);

const formData = ref({
	firstName: "",
	lastName: "",
	email: "",
	phone: "",
	bio: "",
	address: "",
	city: "",
	state: "",
	zipCode: "",
	country: "",
	// Location IDs from the cascading selector
	countryId: null,
	departmentId: null,
	cityId: null,
	createdAt: null,
});

const originalData = ref({});

// Computed
const userInitials = computed(() => {
	const first = formData.value.firstName || "";
	const last = formData.value.lastName || "";
	if (first && last) {
		return (first.charAt(0) + last.charAt(0)).toUpperCase();
	}
	return (first.substring(0, 2) || "US").toUpperCase();
});

const memberSince = computed(() => {
	if (!formData.value.createdAt) return "N/A";
	const date = new Date(formData.value.createdAt);
	return date.toLocaleDateString("en-US", {
		month: "short",
		year: "numeric",
	});
});

const daysSinceMember = computed(() => {
	if (!formData.value.createdAt) return 0;
	const created = new Date(formData.value.createdAt);
	const now = new Date();
	const diff = now - created;
	return Math.floor(diff / (1000 * 60 * 60 * 24));
});

// Methods
const loadProfile = () => {
	// Load user data from localStorage
	const storedUser = localStorage.getItem("user");
	if (storedUser) {
		try {
			const user = JSON.parse(storedUser);
			const nameParts = (user.name || "").split(" ");
			formData.value = {
				firstName: nameParts[0] || "",
				lastName: nameParts.slice(1).join(" ") || "",
				email: user.email || "",
				phone: user.phone || "",
				bio: user.bio || "",
				address: user.address || "",
				city: user.city || "",
				state: user.state || "",
				zipCode: user.zipCode || user.zip_code || "",
				country: user.country || "",
				countryId: user.countryId || null,
				departmentId: user.departmentId || null,
				cityId: user.cityId || null,
				createdAt: user.createdAt || user.created_at || new Date(),
			};
			originalData.value = { ...formData.value };
		} catch (error) {
			console.error("Error loading profile:", error);
		}
	}

	// Load stats (mock data for now)
	totalBoxes.value = 12;
	totalRequests.value = 8;
};

// Updates all location-related fields when the user picks from the selector
const onLocationChange = (location) => {
	formData.value.countryId = location.countryId;
	formData.value.country = location.countryName;
	formData.value.departmentId = location.departmentId;
	formData.value.state = location.departmentName;
	formData.value.cityId = location.cityId;
	formData.value.city = location.cityName;
};

const startEditing = () => {
	isEditing.value = true;
};

const cancelEditing = () => {
	formData.value = { ...originalData.value };
	isEditing.value = false;
};

const saveProfile = async () => {
	isSaving.value = true;

	try {
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1000));

		// Update localStorage
		const storedUser = localStorage.getItem("user");
		if (storedUser) {
			const user = JSON.parse(storedUser);
			user.name = `${formData.value.firstName} ${formData.value.lastName}`;
			user.email = formData.value.email;
			user.phone = formData.value.phone;
			user.bio = formData.value.bio;
			user.address = formData.value.address;
			user.city = formData.value.city;
			user.state = formData.value.state;
			user.zipCode = formData.value.zipCode;
			user.country = formData.value.country;
			user.countryId = formData.value.countryId;
			user.departmentId = formData.value.departmentId;
			user.cityId = formData.value.cityId;
			localStorage.setItem("user", JSON.stringify(user));
		}

		originalData.value = { ...formData.value };
		isEditing.value = false;

		// Show success message (you can use toast notification)
		alert("Profile updated successfully!");
	} catch (error) {
		console.error("Error saving profile:", error);
		alert("Failed to save profile. Please try again.");
	} finally {
		isSaving.value = false;
	}
};

// Lifecycle
onMounted(() => {
	loadProfile();
});
</script>

<style scoped>
/* Additional custom styles if needed */
</style>
