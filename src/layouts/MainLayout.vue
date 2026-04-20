<template>
	<div class="min-h-screen bg-gray-50">
		<!-- Top Navigation Bar -->
		<nav class="fixed top-0 z-50 w-full bg-white border-b border-gray-200">
			<div class="px-3 py-3 lg:px-5 lg:pl-3">
				<div class="flex items-center justify-between">
					<div class="flex items-center justify-start">
						<!-- Mobile menu button -->
						<button
							@click="toggleSidebar"
							type="button"
							class="inline-flex items-center p-2 text-gray-600 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors"
						>
							<span class="sr-only">Open sidebar</span>
							<svg
								v-if="!sidebarOpen"
								class="w-6 h-6"
								fill="currentColor"
								viewBox="0 0 20 20"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									clip-rule="evenodd"
									fill-rule="evenodd"
									d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
								></path>
							</svg>
							<svg
								v-else
								class="w-6 h-6"
								fill="currentColor"
								viewBox="0 0 20 20"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									fill-rule="evenodd"
									d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
									clip-rule="evenodd"
								></path>
							</svg>
						</button>
						<!-- Logo -->
						<router-link to="/" class="flex ml-2 md:mr-24">
							<svg
								class="w-4 h-6 sm:w-8 sm:h-10"
								viewBox="0 0 92 122"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M61.3333 0H92V30.5H61.3333V0ZM30.6667 0H61.3333V30.5H30.6667V0ZM0 30.5H30.6667V61H0V30.5ZM61.3333 61H92V91.5H61.3333V61ZM61.3333 91.5H92V122H61.3333V91.5ZM0 91.5H30.6667V122H0V91.5ZM0 0H30.6667V30.5H0V0ZM30.6667 91.5H61.3333V122H30.6667V91.5Z"
									fill="#0D65AE"
								/>
							</svg>
						</router-link>
					</div>
					<!-- Right side menu -->
					<div class="flex items-center gap-3">
						<EmployeeWorkDayNavControl />
						<PlatformNotificationsBell />

						<!-- User Dropdown -->
						<div class="relative pl-3 border-l border-gray-200">
							<button
								@click="toggleUserDropdown"
								class="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200"
							>
								<div class="hidden sm:block text-right">
									<p
										class="text-sm font-medium text-gray-900"
									>
										{{ userName }}
									</p>
									<p class="text-xs text-gray-500">
										{{ userEmail }}
									</p>
								</div>
								<div
									class="w-10 h-10 rounded-full bg-[#0D65AE] flex items-center justify-center text-white font-medium border-2 border-[#0D65AE]"
								>
									{{ userInitials }}
								</div>
								<svg
									class="w-4 h-4 text-gray-500 transition-transform"
									:class="{ 'rotate-180': userDropdownOpen }"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M19 9l-7 7-7-7"
									></path>
								</svg>
							</button>

							<!-- Dropdown Menu -->
							<div
								v-if="userDropdownOpen"
								class="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg overflow-hidden z-50"
							>
								<div class="px-4 py-3 border-b border-gray-200">
									<p
										class="text-sm font-medium text-gray-900"
									>
										{{ userName }}
									</p>
									<p class="text-xs text-gray-500 truncate">
										{{ userEmail }}
									</p>
								</div>
								<div class="py-1">
									<router-link
										to="/profile"
										@click="closeUserDropdown"
										class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
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
										<span>Profile</span>
									</router-link>
									<router-link
										to="/settings"
										@click="closeUserDropdown"
										class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
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
											></path>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
											></path>
										</svg>
										<span>Settings</span>
									</router-link>
								</div>
								<div class="border-t border-gray-200">
									<button
										@click="logout"
										class="cursor-pointer flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
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
												d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
											></path>
										</svg>
										<span>Log Out</span>
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</nav>

		<!-- Sidebar -->
		<aside
			id="sidebar"
			:class="[
				'fixed top-0 left-0 z-40 w-72 h-screen pt-20 transition-transform bg-white border-r border-gray-200',
				sidebarOpen
					? 'translate-x-0'
					: '-translate-x-full lg:translate-x-0',
			]"
		>
			<div class="h-full px-3 pb-4 overflow-y-auto bg-white">
				<!-- Sidebar Brand (visible on mobile when sidebar is open) -->
				<div
					class="lg:hidden pt-4 pb-6 px-3 border-b border-gray-200 -mt-16 mb-4 bg-white"
				>
					<svg
						class="w-10 h-12"
						viewBox="0 0 92 122"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M61.3333 0H92V30.5H61.3333V0ZM30.6667 0H61.3333V30.5H30.6667V0ZM0 30.5H30.6667V61H0V30.5ZM61.3333 61H92V91.5H61.3333V61ZM61.3333 91.5H92V122H61.3333V91.5ZM0 91.5H30.6667V122H0V91.5ZM0 0H30.6667V30.5H0V0ZM30.6667 91.5H61.3333V122H30.6667V91.5Z"
							fill="#0D65AE"
						/>
					</svg>
				</div>

				<div class="space-y-2">
					<!-- Navigation Section -->
					<div class="pt-4">
						<p
							class="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3"
						>
							Navigation
						</p>
						<ul class="space-y-1">
							<!-- Everyone: Dashboard -->
							<li>
								<router-link
									to="/"
									@click="closeSidebarMobile"
									:class="[
										'flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 border',
										isActive('/')
											? 'bg-[#0D65AE]/5 text-[#0D65AE] border-[#0D65AE]/20'
											: 'text-gray-700 hover:bg-gray-50 border-transparent',
									]"
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
											d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
										></path>
									</svg>
									<span>Dashboard</span>
								</router-link>
							</li>
							<li v-if="isAuthenticated">
								<router-link
									to="/my-packages"
									@click="closeSidebarMobile"
									:class="[
										'flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 border',
										isActive('/my-packages')
											? 'bg-[#0D65AE]/5 text-[#0D65AE] border-[#0D65AE]/20'
											: 'text-gray-700 hover:bg-gray-50 border-transparent',
									]"
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
											d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
										/>
									</svg>
									<span>My packages &amp; tracking</span>
								</router-link>
							</li>
							<!-- Normal users only -->
							<li v-if="!hasCompany">
								<router-link
									to="/services"
									@click="closeSidebarMobile"
									:class="[
										'flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 border',
										isActive('/services')
											? 'bg-[#0D65AE]/5 text-[#0D65AE] border-[#0D65AE]/20'
											: 'text-gray-700 hover:bg-gray-50 border-transparent',
									]"
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
											d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
										></path>
									</svg>
									<span>Browse Services</span>
								</router-link>
							</li>
							<li v-if="!hasCompany">
								<router-link
									to="/requests"
									@click="closeSidebarMobile"
									:class="[
										'flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 border',
										isActive('/requests')
											? 'bg-[#0D65AE]/5 text-[#0D65AE] border-[#0D65AE]/20'
											: 'text-gray-700 hover:bg-gray-50 border-transparent',
									]"
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
											d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
										></path>
									</svg>
									<span>My Requests</span>
								</router-link>
							</li>
							<li v-if="canViewNfc">
								<router-link
									to="/mybox"
									@click="closeSidebarMobile"
									:class="[
										'flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 border',
										isActive('/mybox') ||
										isActive('/create-box') ||
										isActive('/edit-box')
											? 'bg-[#0D65AE]/5 text-[#0D65AE] border-[#0D65AE]/20'
											: 'text-gray-700 hover:bg-gray-50 border-transparent',
									]"
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
											d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
										></path>
									</svg>
									<span>My Boxes</span>
								</router-link>
							</li>

							<!-- Company users: global menu -->
							<!-- Company name header -->
							<li v-if="canManageCompanyWorkspace" class="px-3 pt-2 pb-1">
								<span
									class="text-xs font-bold text-gray-500 uppercase tracking-wider"
								>
									My Company
								</span>
							</li>

							<!-- My Company (view/edit) -->
							<li v-if="canManageCompanyWorkspace">
								<router-link
									to="/my-company"
									@click="closeSidebarMobile"
									:class="[
										'flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 border',
										isActive('/my-company') &&
										!isActive('/my-company/requests') &&
										!isActive('/my-company/packages') &&
										!isActive('/my-company/members') &&
										!isActive('/my-company/locations')
											? 'bg-[#0D65AE]/5 text-[#0D65AE] border-[#0D65AE]/20'
											: 'text-gray-700 hover:bg-gray-50 border-transparent',
									]"
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
											d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
										></path>
									</svg>
									<span>My Company</span>
								</router-link>
							</li>

							<!-- Orders (service requests) — admin only -->
							<li v-if="canManageCompanyWorkspace">
								<router-link
									to="/my-company/requests"
									@click="closeSidebarMobile"
									:class="[
										'flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 border',
										isActive('/my-company/requests')
											? 'bg-[#0D65AE]/5 text-[#0D65AE] border-[#0D65AE]/20'
											: 'text-gray-700 hover:bg-gray-50 border-transparent',
									]"
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
											d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
										></path>
									</svg>
									<span>Orders</span>
								</router-link>
							</li>

							<li v-if="canManageCompanyWorkspace">
								<router-link
									to="/my-company/packages"
									@click="closeSidebarMobile"
									:class="[
										'flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 border',
										isActive('/my-company/packages')
											? 'bg-[#0D65AE]/5 text-[#0D65AE] border-[#0D65AE]/20'
											: 'text-gray-700 hover:bg-gray-50 border-transparent',
									]"
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
											d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
										/>
									</svg>
									<span>Packages &amp; live tracking</span>
								</router-link>
							</li>

							<!-- Locations (admin only) -->
							<li v-if="canManageCompanyWorkspace">
								<router-link
									to="/my-company/locations"
									@click="closeSidebarMobile"
									:class="[
										'flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 border',
										isActive('/my-company/locations')
											? 'bg-[#0D65AE]/5 text-[#0D65AE] border-[#0D65AE]/20'
											: 'text-gray-700 hover:bg-gray-50 border-transparent',
									]"
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
											d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
										></path>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
										></path>
									</svg>
									<span>Locations</span>
								</router-link>
							</li>

							<!-- Services (admin only — employees don't manage services) -->
							<li v-if="canManageCompanyWorkspace">
								<router-link
									to="/my-services"
									@click="closeSidebarMobile"
									:class="[
										'flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 border',
										isActive('/my-services')
											? 'bg-[#0D65AE]/5 text-[#0D65AE] border-[#0D65AE]/20'
											: 'text-gray-700 hover:bg-gray-50 border-transparent',
									]"
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
											d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
										></path>
									</svg>
									<span>Services</span>
								</router-link>
							</li>

							<!-- Members (admin only) -->
							<li v-if="canManageCompanyWorkspace">
								<router-link
									to="/my-company/members"
									@click="closeSidebarMobile"
									:class="[
										'flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 border',
										isActive('/my-company/members')
											? 'bg-[#0D65AE]/5 text-[#0D65AE] border-[#0D65AE]/20'
											: 'text-gray-700 hover:bg-gray-50 border-transparent',
									]"
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
											d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
										></path>
									</svg>
									<span>Members</span>
								</router-link>
							</li>

							<!-- My Assignments (employees only — non-admin company members) -->
							<li v-if="isCompanyEmployee">
								<router-link
									to="/my-assignments"
									@click="closeSidebarMobile"
									:class="[
										'flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 border',
										isActive('/my-assignments')
											? 'bg-[#0D65AE]/5 text-[#0D65AE] border-[#0D65AE]/20'
											: 'text-gray-700 hover:bg-gray-50 border-transparent',
									]"
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
											d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
										></path>
									</svg>
									<span>My Assignments</span>
								</router-link>
							</li>

							<li v-if="isCompanyEmployee">
								<router-link
									to="/delivery"
									@click="closeSidebarMobile"
									:class="[
										'flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 border',
										isActive('/delivery')
											? 'bg-[#0D65AE]/5 text-[#0D65AE] border-[#0D65AE]/20'
											: 'text-gray-700 hover:bg-gray-50 border-transparent',
									]"
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
											d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1h1m-1-4h-1m4-4h1m-1 4h-1m-4 4h1"
										/>
									</svg>
									<span>Courier deliveries</span>
								</router-link>
							</li>

							<!-- Invitations (admin only) -->
							<li v-if="canManageCompanyWorkspace">
								<router-link
									to="/my-company/invitations"
									@click="closeSidebarMobile"
									:class="[
										'flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 border',
										isActive('/my-company/invitations')
											? 'bg-[#0D65AE]/5 text-[#0D65AE] border-[#0D65AE]/20'
											: 'text-gray-700 hover:bg-gray-50 border-transparent',
									]"
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
											d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
										></path>
									</svg>
									<span>Invitations</span>
								</router-link>
							</li>
						</ul>
					</div>

					<!-- Bottom Section -->
					<div class="pt-4 mt-auto">
						<div
							class="px-3 py-4 bg-[#0D65AE]/5 rounded-lg border border-[#0D65AE]/20"
						>
							<div class="flex items-start gap-3">
								<div
									class="bg-[#0D65AE] p-2 rounded-lg border border-[#0D65AE]"
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
								<div>
									<h4
										class="text-sm font-semibold text-gray-900 mb-1"
									>
										Need Help?
									</h4>
									<p class="text-xs text-gray-600 mb-2">
										Learn how to use SureBox
									</p>
									<button
										type="button"
										class="text-xs font-medium text-[#0D65AE] hover:underline"
										@click="router.push('/help'); closeSidebarMobile()"
									>
										View Guide →
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</aside>

		<!-- Overlay for mobile -->
		<div
			v-if="sidebarOpen"
			@click="sidebarOpen = false"
			class="fixed inset-0 z-30 bg-gray-900/50 lg:hidden backdrop-blur-sm transition-opacity"
		></div>

		<!-- Main Content -->
		<div class="p-0 lg:ml-72 pt-16">
			<main class="min-h-screen">
				<router-view />
			</main>

			<!-- Footer -->
			<footer class="bg-white border-t border-gray-200 mt-8">
				<div class="px-6 py-4">
					<div
						class="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600"
					>
						<p>© {{ currentYear }} SureBox. All rights reserved.</p>
						<div class="flex items-center gap-4">
							<router-link
								to="/privacy"
								class="hover:text-sky-600 transition-colors"
							>
								Política de privacidad
							</router-link>
							<router-link
								to="/terms"
								class="hover:text-sky-600 transition-colors"
							>
								Términos y condiciones
							</router-link>
							<router-link
								to="/help"
								class="hover:text-sky-600 transition-colors"
							>
								Ayuda
							</router-link>
						</div>
					</div>
				</div>
			</footer>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import { useAuthStore } from "@/stores/auth.store";
import { usePermissions } from "@/composables/usePermissions";
import EmployeeWorkDayNavControl from "@/components/employee/EmployeeWorkDayNavControl.vue";
import PlatformNotificationsBell from "@/components/layout/PlatformNotificationsBell.vue";

const route = useRoute();
const router = useRouter();
const currentYear = new Date().getFullYear();
const { logout: logoutUser, getCurrentUser } = useAuth();
const authStore = useAuthStore();
const { canViewNfc } = usePermissions();

const sidebarOpen = ref(false);
const userDropdownOpen = ref(false);
// Derive display name and email reactively from the store so they always
// reflect the latest data fetched from the API.
const userName = computed(() => authStore.state.user?.name || "User");
const userEmail = computed(
	() => authStore.state.user?.email || "user@example.com",
);

// Computed property to check if user has company
const hasCompany = computed(() => authStore.hasCompany.value);

const canManageCompanyWorkspace = computed(
	() => authStore.canManageCompanyWorkspace.value,
);

// isCompanyAdmin / isCompanyEmployee — misma lógica que el router (utils/companyContext)
const isCompanyAdmin = computed(() => authStore.isCompanyAdmin.value);
const isCompanyEmployee = computed(() => authStore.isCompanyEmployee.value);

/** Same source as router/session: store computed (avoids stale reads on authStore.state). */
const isAuthenticated = computed(() => !!authStore.isAuthenticated?.value);

function toggleSidebar() {
	sidebarOpen.value = !sidebarOpen.value;
}

function closeSidebarMobile() {
	if (window.innerWidth < 1024) {
		sidebarOpen.value = false;
	}
}

function toggleUserDropdown() {
	userDropdownOpen.value = !userDropdownOpen.value;
}

function closeUserDropdown() {
	userDropdownOpen.value = false;
}

function handleClickOutside(event) {
	const dropdown = event.target.closest(".relative");
	if (!dropdown) {
		userDropdownOpen.value = false;
	}
}

function isActive(path) {
	if (path === "/") {
		return route.path === "/";
	}
	return route.path.startsWith(path);
}

async function logout() {
	await logoutUser();
}

const userInitials = computed(() => {
	const names = userName.value.split(" ");
	if (names.length >= 2) {
		return (names[0][0] + names[1][0]).toUpperCase();
	}
	return userName.value.substring(0, 2).toUpperCase();
});

onMounted(async () => {
	// Refresh the user from the API so roles/permissions are always up-to-date.
	// The store persists the result to localStorage automatically.
	await getCurrentUser();

	// Close dropdown when clicking outside
	document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
	document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
/* Smooth transitions */
#sidebar {
	transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Scrollbar styling for sidebar */
#sidebar::-webkit-scrollbar {
	width: 6px;
}

#sidebar::-webkit-scrollbar-track {
	background: transparent;
}

#sidebar::-webkit-scrollbar-thumb {
	background: #e5e7eb;
	border-radius: 3px;
}

#sidebar::-webkit-scrollbar-thumb:hover {
	background: #d1d5db;
}

/* Logo animations */
@keyframes logoFloat {
	0%,
	100% {
		transform: translateY(0px);
	}

	50% {
		transform: translateY(-2px);
	}
}

/* Animation for overlay */
@keyframes fadeIn {
	from {
		opacity: 0;
	}

	to {
		opacity: 1;
	}
}

/* Gradient text support for older browsers */
.bg-clip-text {
	-webkit-background-clip: text;
	background-clip: text;
}
</style>
