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
						<button
							type="button"
							class="hidden sm:flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
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
									d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
								></path>
							</svg>
							<span class="hidden md:inline">Notifications</span>
						</button>

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
							<li>
								<router-link
									to="/delivery"
									@click="closeSidebarMobile"
									:class="[
										'flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 border',
										isActive('/delivery') ||
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
											d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
										></path>
									</svg>
									<span>Deliveries</span>
								</router-link>
							</li>
							<li v-if="hasCompany">
								<router-link
									to="/my-company"
									@click="closeSidebarMobile"
									:class="[
										'flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 border',
										isActive('/my-company')
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
							<li v-if="hasCompany">
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
									<span>My Services</span>
								</router-link>
							</li>
							<li>
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
									<span>Services</span>
								</router-link>
							</li>
						</ul>
					</div>

					<!-- Quick Actions Section -->
					<div class="pt-4">
						<p
							class="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3"
						>
							Quick Actions
						</p>
						<ul class="space-y-1">
							<li>
								<router-link
									to="/create-box"
									@click="closeSidebarMobile"
									class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 border border-transparent hover:border-gray-200"
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
											d="M12 4v16m8-8H4"
										></path>
									</svg>
									<span>Add New Box</span>
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
										class="text-xs font-medium text-[#0D65AE] hover:underline"
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
						<p>© 2025 SureBox. All rights reserved.</p>
						<div class="flex items-center gap-4">
							<a
								href="#"
								class="hover:text-sky-600 transition-colors"
								>Privacy Policy</a
							>
							<a
								href="#"
								class="hover:text-sky-600 transition-colors"
								>Terms of Service</a
							>
							<a
								href="#"
								class="hover:text-sky-600 transition-colors"
								>Support</a
							>
						</div>
					</div>
				</div>
			</footer>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import { useAuthStore } from "@/stores/auth.store";
import { usePermissions } from "@/composables/usePermissions";

const route = useRoute();
const { logout: logoutUser } = useAuth();
const authStore = useAuthStore();
const { canViewNfc, canCreateNfc } = usePermissions();
const sidebarOpen = ref(false);
const userDropdownOpen = ref(false);
const userName = ref("User");
const userEmail = ref("user@example.com");

// Computed property to check if user has company
const hasCompany = computed(() => {
	const user = authStore.state.user;
	console.log("🔍 Checking hasCompany:", {
		user: user,
		hasCompany: authStore.hasCompany.value,
		companies: user?.companies,
		company_id: user?.company_id,
		companyId: user?.companyId,
		"authStore.companyId.value": authStore.companyId.value,
		"authStore.company_id.value": authStore.company_id.value,
	});
	return authStore.hasCompany.value;
});

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

onMounted(() => {
	// Load user info from localStorage
	const storedUser = localStorage.getItem("user");
	if (storedUser) {
		try {
			const user = JSON.parse(storedUser);
			userName.value = user.name || "User";
			userEmail.value = user.email || "user@example.com";

			// Debug: Log user data to see company information
			console.log("👤 User loaded in MainLayout:", user);
			console.log("🏢 Company check:", {
				companies: user.companies,
				company_id: user.company_id,
				companyId: user.companyId,
				hasCompany:
					(user.companies && user.companies.length > 0) ||
					!!user.company_id ||
					!!user.companyId,
			});
			console.log("🔑 Permissions:", {
				canViewNfc: canViewNfc.value,
				canCreateNfc: canCreateNfc.value,
			});
		} catch {
			userName.value = "User";
			userEmail.value = "user@example.com";
		}
	}

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
