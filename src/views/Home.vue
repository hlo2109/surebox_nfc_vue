<template>
	<div class="bg-gray-50 p-4 sm:p-6 lg:p-8">
		<div class="max-w-7xl mx-auto">
			<!-- Header Section -->
			<div class="mb-6 sm:mb-8">
				<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
					<div>
						<h1 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">
							Welcome Back, {{ userName }}
						</h1>
						<p class="text-sm sm:text-base text-gray-600 flex items-center gap-2">
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z">
								</path>
							</svg>
							{{ currentDate }}
						</p>
					</div>
					<div class="flex items-center gap-2 sm:gap-3">
						<button @click="refreshData" :disabled="loading"
							class="inline-flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-[#0D65AE] focus:ring-offset-2 disabled:opacity-50 transition-all">
							<svg :class="['w-4 h-4', loading ? 'animate-spin' : '']" fill="none" stroke="currentColor"
								viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15">
								</path>
							</svg>
							<span class="hidden sm:inline">Refresh</span>
						</button>
						<button
							class="relative inline-flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-[#0D65AE] focus:ring-offset-2 transition-all">
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9">
								</path>
							</svg>
							<span class="hidden sm:inline">Alerts</span>
							<span v-if="notificationCount > 0"
								class="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
								{{ notificationCount > 9 ? '9+' : notificationCount }}
							</span>
						</button>
					</div>
				</div>
			</div>

			<!-- Stats Cards -->
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
				<!-- Total Boxes -->
				<div
					class="bg-white rounded-xl border border-gray-200 hover:border-[#0D65AE] transition-all p-5 sm:p-6">
					<div class="flex items-center justify-between">
						<div class="flex-1">
							<p class="text-gray-500 text-xs sm:text-sm font-medium mb-1 sm:mb-2">Total Boxes</p>
							<h3 class="text-2xl sm:text-3xl font-bold text-gray-900">{{ stats.totalBoxes }}</h3>
							<p class="text-green-600 text-xs sm:text-sm mt-2 flex items-center gap-1">
								<svg class="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd"
										d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
										clip-rule="evenodd"></path>
								</svg>
								<span>{{ stats.boxGrowth }}% growth</span>
							</p>
						</div>
						<div class="bg-[#0D65AE]/10 p-3 sm:p-4 rounded-xl border border-[#0D65AE]/20">
							<svg class="w-6 h-6 sm:w-8 sm:h-8 text-[#0D65AE]" fill="none" stroke="currentColor"
								viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
							</svg>
						</div>
					</div>
				</div>

				<!-- Active Deliveries -->
				<div
					class="bg-white rounded-xl border border-gray-200 hover:border-orange-400 transition-all p-5 sm:p-6">
					<div class="flex items-center justify-between">
						<div class="flex-1">
							<p class="text-gray-500 text-xs sm:text-sm font-medium mb-1 sm:mb-2">Active Deliveries</p>
							<h3 class="text-2xl sm:text-3xl font-bold text-gray-900">{{ stats.activeDeliveries }}</h3>
							<p class="text-orange-600 text-xs sm:text-sm mt-2 flex items-center gap-1">
								<svg class="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
										clip-rule="evenodd"></path>
								</svg>
								<span>{{ stats.pendingDeliveries }} pending</span>
							</p>
						</div>
						<div class="bg-orange-50 p-3 sm:p-4 rounded-xl border border-orange-200">
							<svg class="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" fill="none" stroke="currentColor"
								viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0">
								</path>
							</svg>
						</div>
					</div>
				</div>

				<!-- Delivered Packages -->
				<div
					class="bg-white rounded-xl border border-gray-200 hover:border-green-400 transition-all p-5 sm:p-6">
					<div class="flex items-center justify-between">
						<div class="flex-1">
							<p class="text-gray-500 text-xs sm:text-sm font-medium mb-1 sm:mb-2">Delivered</p>
							<h3 class="text-2xl sm:text-3xl font-bold text-gray-900">{{ stats.deliveredPackages }}</h3>
							<p class="text-green-600 text-xs sm:text-sm mt-2 flex items-center gap-1">
								<svg class="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
										clip-rule="evenodd"></path>
								</svg>
								<span>This month</span>
							</p>
						</div>
						<div class="bg-green-50 p-3 sm:p-4 rounded-xl border border-green-200">
							<svg class="w-6 h-6 sm:w-8 sm:h-8 text-green-600" fill="none" stroke="currentColor"
								viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
							</svg>
						</div>
					</div>
				</div>

				<!-- Total Locations -->
				<div
					class="bg-white rounded-xl border border-gray-200 hover:border-purple-400 transition-all p-5 sm:p-6">
					<div class="flex items-center justify-between">
						<div class="flex-1">
							<p class="text-gray-500 text-xs sm:text-sm font-medium mb-1 sm:mb-2">Locations</p>
							<h3 class="text-2xl sm:text-3xl font-bold text-gray-900">{{ stats.totalLocations }}</h3>
							<p class="text-purple-600 text-xs sm:text-sm mt-2 flex items-center gap-1">
								<svg class="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd"
										d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
										clip-rule="evenodd"></path>
								</svg>
								<span>Unique addresses</span>
							</p>
						</div>
						<div class="bg-purple-50 p-3 sm:p-4 rounded-xl border border-purple-200">
							<svg class="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" fill="none" stroke="currentColor"
								viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7">
								</path>
							</svg>
						</div>
					</div>
				</div>
			</div>

			<!-- Main Content Grid -->
			<div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
				<!-- Recent Deliveries -->
				<div class="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5 sm:p-6">
					<div class="flex items-center justify-between mb-4 sm:mb-6">
						<h3 class="text-lg sm:text-xl font-semibold text-gray-900">Recent Deliveries</h3>
						<button @click="$router.push('/delivery')"
							class="inline-flex items-center gap-1 text-sm font-medium text-[#0D65AE] hover:underline transition-colors">
							<span>View All</span>
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7">
								</path>
							</svg>
						</button>
					</div>

					<div v-if="loading" class="flex justify-center py-12">
						<div class="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0D65AE]"></div>
					</div>
					<div v-else-if="recentDeliveries.length === 0" class="text-center py-12">
						<svg class="mx-auto h-12 w-12 text-gray-300 mb-3" fill="none" stroke="currentColor"
							viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
								d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4">
							</path>
						</svg>
						<p class="text-gray-500">No recent deliveries</p>
					</div>
					<div v-else class="space-y-3">
						<div v-for="delivery in recentDeliveries" :key="delivery.id"
							class="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all cursor-pointer group"
							@click="$router.push('/delivery')">
							<div class="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
								<div :class="[
									'w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0',
									delivery.state === 'delivered' ? 'bg-green-100' : 'bg-orange-100'
								]">
									<svg v-if="delivery.state === 'delivered'"
										class="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="currentColor"
										viewBox="0 0 20 20">
										<path fill-rule="evenodd"
											d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
											clip-rule="evenodd"></path>
									</svg>
									<svg v-else class="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" fill="currentColor"
										viewBox="0 0 20 20">
										<path fill-rule="evenodd"
											d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
											clip-rule="evenodd"></path>
									</svg>
								</div>
								<div class="flex-1 min-w-0">
									<p class="font-semibold text-gray-900 text-sm sm:text-base truncate">{{
										delivery.package_id }}</p>
									<p class="text-xs sm:text-sm text-gray-500 truncate">{{ delivery.company?.name ||
										'Unknown' }}</p>
								</div>
							</div>
							<div class="text-right flex-shrink-0 ml-2">
								<span :class="[
									'inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap',
									delivery.state === 'delivered'
										? 'bg-green-100 text-green-700'
										: 'bg-orange-100 text-orange-700'
								]">
									{{ delivery.state }}
								</span>
								<p class="text-xs text-gray-500 mt-1 hidden sm:block">
									{{ formatDate(delivery.delivery_time) }}
								</p>
							</div>
						</div>
					</div>
				</div>

				<!-- Quick Actions -->
				<div class="bg-white rounded-xl border border-gray-200 p-5 sm:p-6">
					<h3 class="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Quick Actions</h3>
					<div class="space-y-3">
						<button @click="$router.push('/create-box')"
							class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#0D65AE] text-white font-medium rounded-lg hover:bg-[#0D65AE]/90 focus:ring-2 focus:ring-[#0D65AE] focus:ring-offset-2 transition-all border border-[#0D65AE]">
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M12 4v16m8-8H4">
								</path>
							</svg>
							<span>Add New Box</span>
						</button>

						<button @click="$router.push('/mybox')"
							class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-[#0D65AE] focus:ring-offset-2 transition-all">
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
							</svg>
							<span>View My Boxes</span>
						</button>

						<button @click="$router.push('/delivery')"
							class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-[#0D65AE] focus:ring-offset-2 transition-all">
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
								</path>
							</svg>
							<span>Track Deliveries</span>
						</button>

						<div class="border-t border-gray-200 pt-4 mt-4"></div>

						<div class="bg-[#0D65AE]/5 p-4 rounded-lg border border-[#0D65AE]/20">
							<div class="flex items-start gap-3">
								<div class="bg-[#0D65AE] p-2 rounded-lg flex-shrink-0 border border-[#0D65AE]">
									<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor"
										viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
											d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
									</svg>
								</div>
								<div class="flex-1">
									<h4 class="font-semibold text-gray-900 text-sm mb-1">Need Help?</h4>
									<p class="text-xs text-gray-600 mb-2">
										Learn how to manage your boxes and track deliveries.
									</p>
									<button
										class="text-xs font-medium text-[#0D65AE] hover:underline transition-colors">
										View Guide →
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Recent Boxes -->
			<div class="bg-white rounded-xl border border-gray-200 p-5 sm:p-6">
				<div class="flex items-center justify-between mb-4 sm:mb-6">
					<h3 class="text-lg sm:text-xl font-semibold text-gray-900">Your Boxes</h3>
					<button @click="$router.push('/mybox')"
						class="inline-flex items-center gap-1 text-sm font-medium text-[#0D65AE] hover:underline transition-colors">
						<span>Manage All</span>
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7">
							</path>
						</svg>
					</button>
				</div>

				<div v-if="loading" class="flex justify-center py-12">
					<div class="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0D65AE]"></div>
				</div>
				<div v-else-if="recentBoxes.length === 0" class="text-center py-12">
					<svg class="mx-auto h-12 w-12 text-gray-300 mb-3" fill="none" stroke="currentColor"
						viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
							d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
					</svg>
					<p class="text-gray-500 mb-4">You haven't registered any boxes yet</p>
					<button @click="$router.push('/create-box')"
						class="inline-flex items-center gap-2 px-4 py-2 bg-[#0D65AE] text-white font-medium rounded-lg hover:bg-[#0D65AE]/90 focus:ring-2 focus:ring-[#0D65AE] focus:ring-offset-2 transition-all border border-[#0D65AE]">
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4">
							</path>
						</svg>
						<span>Add Your First Box</span>
					</button>
				</div>
				<div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					<div v-for="box in recentBoxes" :key="box.id"
						class="p-4 border border-gray-200 rounded-lg hover:border-[#0D65AE] transition-all cursor-pointer bg-white group"
						@click="$router.push(`/edit-box/${box.id}`)">
						<div class="flex items-start justify-between mb-3">
							<div class="bg-[#0D65AE]/10 p-2.5 rounded-lg border border-[#0D65AE]/20">
								<svg class="w-5 h-5 text-[#0D65AE]" fill="none" stroke="currentColor"
									viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
										d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
								</svg>
							</div>
							<button @click.stop="$router.push(`/edit-box/${box.id}`)"
								class="p-1.5 text-gray-400 hover:text-[#0D65AE] hover:bg-[#0D65AE]/5 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
										d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z">
									</path>
								</svg>
							</button>
						</div>
						<div class="space-y-2">
							<div class="flex items-center gap-2 text-sm">
								<svg class="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor"
									viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
										d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z">
									</path>
								</svg>
								<span class="font-semibold text-gray-900 truncate">{{ box.codebox_id }}</span>
							</div>
							<div class="flex items-center gap-2 text-sm text-gray-600">
								<svg class="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor"
									viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
										d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z">
									</path>
								</svg>
								<span class="truncate">{{ box.phone }}</span>
							</div>
							<div class="flex items-start gap-2 text-sm text-gray-600">
								<svg class="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" fill="none"
									stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
										d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z">
									</path>
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
										d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
								</svg>
								<span class="line-clamp-2">{{ box.address }}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const API_BASE_URL = import.meta.env.VITE_API_URL

// Configure axios
axios.interceptors.request.use(config => {
	const token = localStorage.getItem('jwt')
	if (token) config.headers.Authorization = `Bearer ${token}`
	return config
})

// State
const loading = ref(false)
const boxes = ref([])
const deliveries = ref([])
const userName = ref('User')
const notificationCount = ref(0)

// Computed properties
const currentDate = computed(() => {
	return new Date().toLocaleDateString('en-US', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	})
})

const stats = computed(() => ({
	totalBoxes: boxes.value.length,
	boxGrowth: 12, // Could calculate from historical data
	activeDeliveries: deliveries.value.filter(d => d.state !== 'delivered').length,
	pendingDeliveries: deliveries.value.filter(d => d.state === 'pending').length,
	deliveredPackages: deliveries.value.filter(d => d.state === 'delivered').length,
	totalLocations: new Set(boxes.value.map(b => b.address)).size
}))

const recentDeliveries = computed(() => {
	return deliveries.value
		.sort((a, b) => new Date(b.delivery_time) - new Date(a.delivery_time))
		.slice(0, 5)
})

const recentBoxes = computed(() => {
	return boxes.value.slice(0, 6)
})

// Methods
function formatDate(isoDate) {
	if (!isoDate) return 'N/A'
	return new Date(isoDate).toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	})
}

async function fetchBoxes() {
	try {
		const res = await axios.get(`${API_BASE_URL}/user-code-box`)
		boxes.value = Array.isArray(res.data) ? res.data : [res.data]
	} catch (err) {
		console.error('Error fetching boxes:', err)
		boxes.value = []
	}
}

async function fetchDeliveries() {
	try {
		const res = await axios.get(`${API_BASE_URL}/delivery`)
		deliveries.value = Array.isArray(res.data) ? res.data : []
		// Count unread/new deliveries for notification badge
		notificationCount.value = deliveries.value.filter(d => d.state !== 'delivered').length
	} catch (err) {
		console.error('Error fetching deliveries:', err)
		deliveries.value = []
	}
}

async function loadDashboardData() {
	loading.value = true
	try {
		await Promise.all([
			fetchBoxes(),
			fetchDeliveries()
		])

		// Get user name from localStorage or JWT if available
		const storedUser = localStorage.getItem('user')
		if (storedUser) {
			try {
				const user = JSON.parse(storedUser)
				userName.value = user.name || user.email?.split('@')[0] || 'User'
			} catch {
				userName.value = 'User'
			}
		}
	} catch (err) {
		console.error('Error loading dashboard:', err)
	} finally {
		loading.value = false
	}
}

async function refreshData() {
	await loadDashboardData()
}

onMounted(() => {
	loadDashboardData()
})
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