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
							Settings
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
									d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
								></path>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
								></path>
							</svg>
							Manage your account preferences and security
						</p>
					</div>
					<div class="flex items-center gap-2 sm:gap-3">
						<button
							v-if="hasUnsavedChanges"
							@click="saveAllSettings"
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
							<span>{{ isSaving ? "Saving..." : "Save Changes" }}</span>
						</button>
					</div>
				</div>
			</div>

			<!-- Settings Navigation Tabs -->
			<div
				class="bg-white rounded-xl border border-gray-200 p-2 mb-6 overflow-x-auto"
			>
				<div class="flex gap-2 min-w-max">
					<button
						v-for="tab in tabs"
						:key="tab.id"
						@click="activeTab = tab.id"
						:class="[
							'flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all',
							activeTab === tab.id
								? 'bg-[#0D65AE] text-white'
								: 'text-gray-700 hover:bg-gray-100',
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
								:d="tab.icon"
							></path>
						</svg>
						<span>{{ tab.label }}</span>
					</button>
				</div>
			</div>

			<!-- Settings Content -->
			<div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
				<!-- Main Settings Area -->
				<div class="lg:col-span-2 space-y-4 sm:space-y-6">
					<!-- General Settings -->
					<div
						v-if="activeTab === 'general'"
						class="bg-white rounded-xl border border-gray-200 p-5 sm:p-6"
					>
						<h3 class="text-lg font-semibold text-gray-900 mb-6">
							General Settings
						</h3>

						<div class="space-y-6">
							<!-- Language -->
							<div>
								<label
									class="block text-sm font-medium text-gray-700 mb-2"
								>
									Language
								</label>
								<select
									v-model="settings.language"
									@change="hasUnsavedChanges = true"
									class="block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D65AE] focus:border-transparent text-sm transition-all"
								>
									<option value="en">English</option>
									<option value="es">Spanish</option>
									<option value="fr">French</option>
									<option value="de">German</option>
								</select>
							</div>

							<!-- Timezone -->
							<div>
								<label
									class="block text-sm font-medium text-gray-700 mb-2"
								>
									Timezone
								</label>
								<select
									v-model="settings.timezone"
									@change="hasUnsavedChanges = true"
									class="block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D65AE] focus:border-transparent text-sm transition-all"
								>
									<option value="America/New_York">
										Eastern Time (ET)
									</option>
									<option value="America/Chicago">
										Central Time (CT)
									</option>
									<option value="America/Denver">
										Mountain Time (MT)
									</option>
									<option value="America/Los_Angeles">
										Pacific Time (PT)
									</option>
									<option value="UTC">UTC</option>
								</select>
							</div>

							<!-- Date Format -->
							<div>
								<label
									class="block text-sm font-medium text-gray-700 mb-2"
								>
									Date Format
								</label>
								<select
									v-model="settings.dateFormat"
									@change="hasUnsavedChanges = true"
									class="block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D65AE] focus:border-transparent text-sm transition-all"
								>
									<option value="MM/DD/YYYY">MM/DD/YYYY</option>
									<option value="DD/MM/YYYY">DD/MM/YYYY</option>
									<option value="YYYY-MM-DD">YYYY-MM-DD</option>
								</select>
							</div>
						</div>
					</div>

					<!-- Notifications Settings -->
					<div
						v-if="activeTab === 'notifications'"
						class="bg-white rounded-xl border border-gray-200 p-5 sm:p-6"
					>
						<h3 class="text-lg font-semibold text-gray-900 mb-6">
							Notification Preferences
						</h3>

						<div class="space-y-6">
							<!-- Email Notifications -->
							<div>
								<h4
									class="text-sm font-semibold text-gray-900 mb-4"
								>
									Email Notifications
								</h4>
								<div class="space-y-3">
									<div class="flex items-center justify-between">
										<div class="flex-1">
											<p class="text-sm font-medium text-gray-700">
												Delivery Updates
											</p>
											<p class="text-xs text-gray-500">
												Get notified about delivery status changes
											</p>
										</div>
										<label class="relative inline-flex items-center cursor-pointer">
											<input
												type="checkbox"
												v-model="settings.notifications.emailDeliveries"
												@change="hasUnsavedChanges = true"
												class="sr-only peer"
											/>
											<div
												class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#0D65AE]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0D65AE]"
											></div>
										</label>
									</div>

									<div class="flex items-center justify-between">
										<div class="flex-1">
											<p class="text-sm font-medium text-gray-700">
												Service Requests
											</p>
											<p class="text-xs text-gray-500">
												Updates on your service requests
											</p>
										</div>
										<label class="relative inline-flex items-center cursor-pointer">
											<input
												type="checkbox"
												v-model="settings.notifications.emailRequests"
												@change="hasUnsavedChanges = true"
												class="sr-only peer"
											/>
											<div
												class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#0D65AE]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0D65AE]"
											></div>
										</label>
									</div>

									<div class="flex items-center justify-between">
										<div class="flex-1">
											<p class="text-sm font-medium text-gray-700">
												Marketing Emails
											</p>
											<p class="text-xs text-gray-500">
												Promotional offers and updates
											</p>
										</div>
										<label class="relative inline-flex items-center cursor-pointer">
											<input
												type="checkbox"
												v-model="settings.notifications.emailMarketing"
												@change="hasUnsavedChanges = true"
												class="sr-only peer"
											/>
											<div
												class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#0D65AE]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0D65AE]"
											></div>
										</label>
									</div>
								</div>
							</div>

							<!-- Push Notifications -->
							<div class="pt-6 border-t border-gray-200">
								<h4
									class="text-sm font-semibold text-gray-900 mb-4"
								>
									Push Notifications
								</h4>
								<div class="space-y-3">
									<div class="flex items-center justify-between">
										<div class="flex-1">
											<p class="text-sm font-medium text-gray-700">
												Browser Notifications
											</p>
											<p class="text-xs text-gray-500">
												Receive notifications in your browser
											</p>
										</div>
										<label class="relative inline-flex items-center cursor-pointer">
											<input
												type="checkbox"
												v-model="settings.notifications.pushEnabled"
												@change="hasUnsavedChanges = true"
												class="sr-only peer"
											/>
											<div
												class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#0D65AE]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0D65AE]"
											></div>
										</label>
									</div>
								</div>
							</div>
						</div>
					</div>

					<!-- Security Settings -->
					<div
						v-if="activeTab === 'security'"
						class="space-y-4 sm:space-y-6"
					>
						<!-- Change Password -->
						<div
							class="bg-white rounded-xl border border-gray-200 p-5 sm:p-6"
						>
							<h3 class="text-lg font-semibold text-gray-900 mb-6">
								Change Password
							</h3>

							<div class="space-y-4">
								<div>
									<label
										class="block text-sm font-medium text-gray-700 mb-2"
									>
										Current Password
									</label>
									<input
										v-model="passwordData.current"
										type="password"
										class="block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D65AE] focus:border-transparent text-sm transition-all"
									/>
								</div>

								<div>
									<label
										class="block text-sm font-medium text-gray-700 mb-2"
									>
										New Password
									</label>
									<input
										v-model="passwordData.new"
										type="password"
										class="block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D65AE] focus:border-transparent text-sm transition-all"
									/>
								</div>

								<div>
									<label
										class="block text-sm font-medium text-gray-700 mb-2"
									>
										Confirm New Password
									</label>
									<input
										v-model="passwordData.confirm"
										type="password"
										class="block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D65AE] focus:border-transparent text-sm transition-all"
									/>
								</div>

								<button
									@click="changePassword"
									:disabled="isChangingPassword"
									class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0D65AE] rounded-lg hover:bg-[#0D65AE]/90 disabled:opacity-50 transition-all"
								>
									<span>{{
										isChangingPassword
											? "Updating..."
											: "Update Password"
									}}</span>
								</button>
							</div>
						</div>

						<!-- Two-Factor Authentication -->
						<div
							class="bg-white rounded-xl border border-gray-200 p-5 sm:p-6"
						>
							<h3 class="text-lg font-semibold text-gray-900 mb-6">
								Two-Factor Authentication
							</h3>

							<div class="flex items-start gap-4">
								<div class="flex-1">
									<p class="text-sm text-gray-600 mb-4">
										Add an extra layer of security to your account.
										We'll ask for a code when you sign in on a new
										device.
									</p>
									<button
										v-if="!settings.twoFactorEnabled"
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
												d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
											></path>
										</svg>
										<span>Enable 2FA</span>
									</button>
									<div v-else class="flex items-center gap-2">
										<span
											class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
										>
											<svg
												class="w-3 h-3 mr-1"
												fill="currentColor"
												viewBox="0 0 20 20"
											>
												<path
													fill-rule="evenodd"
													d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
													clip-rule="evenodd"
												></path>
											</svg>
											Enabled
										</span>
										<button
											class="text-sm text-red-600 hover:text-red-700 font-medium"
										>
											Disable
										</button>
									</div>
								</div>
							</div>
						</div>

						<!-- Active Sessions -->
						<div
							class="bg-white rounded-xl border border-gray-200 p-5 sm:p-6"
						>
							<h3 class="text-lg font-semibold text-gray-900 mb-6">
								Active Sessions
							</h3>

							<div class="space-y-4">
								<div
									v-for="session in activeSessions"
									:key="session.id"
									class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
								>
									<div class="flex items-center gap-3">
										<div
											class="w-10 h-10 bg-[#0D65AE]/10 rounded-lg flex items-center justify-center"
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
													:d="session.icon"
												></path>
											</svg>
										</div>
										<div>
											<p
												class="text-sm font-medium text-gray-900"
											>
												{{ session.device }}
											</p>
											<p class="text-xs text-gray-500">
												{{ session.location }} • {{ session.time }}
											</p>
										</div>
									</div>
									<button
										v-if="!session.current"
										class="text-sm text-red-600 hover:text-red-700 font-medium"
									>
										Revoke
									</button>
									<span
										v-else
										class="text-xs text-green-600 font-medium"
										>Current Session</span
									>
								</div>
							</div>
						</div>
					</div>

					<!-- Privacy Settings -->
					<div
						v-if="activeTab === 'privacy'"
						class="bg-white rounded-xl border border-gray-200 p-5 sm:p-6"
					>
						<h3 class="text-lg font-semibold text-gray-900 mb-6">
							Privacy Settings
						</h3>

						<div class="space-y-6">
							<div class="flex items-center justify-between">
								<div class="flex-1">
									<p class="text-sm font-medium text-gray-700">
										Profile Visibility
									</p>
									<p class="text-xs text-gray-500">
										Make your profile visible to other users
									</p>
								</div>
								<label class="relative inline-flex items-center cursor-pointer">
									<input
										type="checkbox"
										v-model="settings.privacy.profileVisible"
										@change="hasUnsavedChanges = true"
										class="sr-only peer"
									/>
									<div
										class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#0D65AE]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0D65AE]"
									></div>
								</label>
							</div>

							<div class="flex items-center justify-between">
								<div class="flex-1">
									<p class="text-sm font-medium text-gray-700">
										Show Activity Status
									</p>
									<p class="text-xs text-gray-500">
										Let others see when you're online
									</p>
								</div>
								<label class="relative inline-flex items-center cursor-pointer">
									<input
										type="checkbox"
										v-model="settings.privacy.showActivity"
										@change="hasUnsavedChanges = true"
										class="sr-only peer"
									/>
									<div
										class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#0D65AE]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0D65AE]"
									></div>
								</label>
							</div>

							<div class="flex items-center justify-between">
								<div class="flex-1">
									<p class="text-sm font-medium text-gray-700">
										Data Collection
									</p>
									<p class="text-xs text-gray-500">
										Allow analytics to improve your experience
									</p>
								</div>
								<label class="relative inline-flex items-center cursor-pointer">
									<input
										type="checkbox"
										v-model="settings.privacy.dataCollection"
										@change="hasUnsavedChanges = true"
										class="sr-only peer"
									/>
									<div
										class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#0D65AE]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0D65AE]"
									></div>
								</label>
							</div>
						</div>
					</div>
				</div>

				<!-- Sidebar -->
				<div class="space-y-4 sm:space-y-6">
					<!-- Quick Info Card -->
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
									Keep Your Account Secure
								</h4>
								<p class="text-xs text-white/80 leading-relaxed">
									Enable two-factor authentication and regularly
									update your password to protect your account.
								</p>
							</div>
						</div>
					</div>

					<!-- Support Card -->
					<div
						class="bg-white rounded-xl border border-gray-200 p-5 sm:p-6"
					>
						<h3 class="text-lg font-semibold text-gray-900 mb-4">
							Need Help?
						</h3>
						<p class="text-sm text-gray-600 mb-4">
							Contact our support team if you need assistance with
							your settings.
						</p>
						<button
							class="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-[#0D65AE] bg-[#0D65AE]/5 rounded-lg hover:bg-[#0D65AE]/10 transition-all"
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
									d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
								></path>
							</svg>
							<span>Contact Support</span>
						</button>
					</div>

					<!-- Danger Zone -->
					<div
						class="bg-white rounded-xl border border-red-200 p-5 sm:p-6"
					>
						<h3 class="text-lg font-semibold text-red-600 mb-4">
							Danger Zone
						</h3>
						<div class="space-y-3">
							<button
								class="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-all"
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
										d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
									></path>
								</svg>
								<span>Deactivate Account</span>
							</button>
							<button
								class="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-all"
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
									></path>
								</svg>
								<span>Delete Account</span>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from "vue";

// State
const activeTab = ref("general");
const hasUnsavedChanges = ref(false);
const isSaving = ref(false);
const isChangingPassword = ref(false);

const tabs = [
	{
		id: "general",
		label: "General",
		icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
	},
	{
		id: "notifications",
		label: "Notifications",
		icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
	},
	{
		id: "security",
		label: "Security",
		icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
	},
	{
		id: "privacy",
		label: "Privacy",
		icon: "M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z",
	},
];

const settings = ref({
	language: "en",
	timezone: "America/New_York",
	dateFormat: "MM/DD/YYYY",
	notifications: {
		emailDeliveries: true,
		emailRequests: true,
		emailMarketing: false,
		pushEnabled: true,
	},
	twoFactorEnabled: false,
	privacy: {
		profileVisible: true,
		showActivity: true,
		dataCollection: true,
	},
});

const passwordData = ref({
	current: "",
	new: "",
	confirm: "",
});

const activeSessions = ref([
	{
		id: 1,
		device: "Chrome on Windows",
		location: "New York, US",
		time: "Active now",
		current: true,
		icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
	},
	{
		id: 2,
		device: "Safari on iPhone",
		location: "Los Angeles, US",
		time: "2 days ago",
		current: false,
		icon: "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z",
	},
]);

// Methods
const loadSettings = () => {
	// Load settings from localStorage
	const savedSettings = localStorage.getItem("userSettings");
	if (savedSettings) {
		try {
			const parsed = JSON.parse(savedSettings);
			settings.value = { ...settings.value, ...parsed };
		} catch (error) {
			console.error("Error loading settings:", error);
		}
	}
};

const saveAllSettings = async () => {
	isSaving.value = true;

	try {
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1000));

		// Save to localStorage
		localStorage.setItem("userSettings", JSON.stringify(settings.value));

		hasUnsavedChanges.value = false;

		// Show success message
		alert("Settings saved successfully!");
	} catch (error) {
		console.error("Error saving settings:", error);
		alert("Failed to save settings. Please try again.");
	} finally {
		isSaving.value = false;
	}
};

const changePassword = async () => {
	if (passwordData.value.new !== passwordData.value.confirm) {
		alert("Passwords do not match!");
		return;
	}

	if (passwordData.value.new.length < 8) {
		alert("Password must be at least 8 characters long!");
		return;
	}

	isChangingPassword.value = true;

	try {
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1000));

		// Clear password fields
		passwordData.value = {
			current: "",
			new: "",
			confirm: "",
		};

		alert("Password changed successfully!");
	} catch (error) {
		console.error("Error changing password:", error);
		alert("Failed to change password. Please try again.");
	} finally {
		isChangingPassword.value = false;
	}
};

// Lifecycle
onMounted(() => {
	loadSettings();
});
</script>

<style scoped>
/* Additional custom styles if needed */
</style>
