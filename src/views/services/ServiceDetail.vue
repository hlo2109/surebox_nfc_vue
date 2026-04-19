<template>
	<div class="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
		<div class="max-w-4xl mx-auto">
			<!-- Loading State -->
			<div v-if="loading" class="flex items-center justify-center py-12">
				<div class="text-center">
					<div
						class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0D65AE] mx-auto"
					></div>
					<p class="text-gray-600 mt-4">Loading service details...</p>
				</div>
			</div>

			<!-- Error State -->
			<div
				v-else-if="error"
				class="text-center py-12 bg-white rounded-xl border border-red-200 shadow-sm"
			>
				<svg
					class="w-16 h-16 text-red-400 mx-auto mb-4"
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
				<h3 class="text-xl font-semibold text-gray-900 mb-2">
					Error Loading Service
				</h3>
				<p class="text-gray-600 mb-4">{{ error }}</p>
				<div class="flex items-center justify-center gap-3">
					<button
						@click="loadService"
						class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0D65AE] rounded-lg hover:bg-[#0a4f87] transition-all"
					>
						Try Again
					</button>
					<button
						@click="goBack"
						class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
					>
						Go Back
					</button>
				</div>
			</div>

			<!-- Service Content -->
			<div v-else-if="service">
				<!-- Back Button -->
				<div class="mb-6">
					<button
						@click="goBack"
						class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-[#0D65AE] focus:ring-offset-2 transition-all"
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
						Back
					</button>
				</div>

				<!-- Hero -->
				<div
					class="relative rounded-2xl overflow-hidden border border-gray-200 shadow-md mb-6 bg-slate-100"
				>
					<div class="aspect-[21/9] sm:aspect-[2.4/1] max-h-72">
						<img
							v-if="heroImage"
							:src="heroImage"
							:alt="service.name"
							class="w-full h-full object-cover"
						/>
						<div
							v-else
							class="w-full h-full flex items-center justify-center text-slate-400"
						>
							<svg
								class="w-16 h-16 opacity-50"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="1.2"
									d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
								/>
							</svg>
						</div>
					</div>
					<div
						class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none"
					></div>
					<div
						class="absolute bottom-0 left-0 right-0 p-4 sm:p-6 flex items-end justify-between gap-3"
					>
						<div class="min-w-0 text-white drop-shadow-sm">
							<h1
								class="text-2xl sm:text-3xl font-bold leading-tight truncate"
							>
								{{ service.name }}
							</h1>
							<p
								v-if="categoryName"
								class="text-sm text-white/90 mt-1"
							>
								{{ categoryName }}
							</p>
						</div>
						<button
							type="button"
							@click="toggleFavorite"
							class="pointer-events-auto flex-shrink-0 p-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur border border-white/30 text-amber-300 transition-colors"
							:title="
								isFavorite ? 'Remove from favorites' : 'Favorite'
							"
						>
							<svg
								v-if="isFavorite"
								class="w-6 h-6 fill-current"
								viewBox="0 0 24 24"
							>
								<path
									d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
								/>
							</svg>
							<svg
								v-else
								class="w-6 h-6 stroke-current fill-none"
								viewBox="0 0 24 24"
							>
								<path
									stroke-width="1.6"
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M12 3l1.9 3.85L18 8.5l-4.1 4 1 5.9L12 16.9 7.1 18.4l1-5.9L4 8.5l4.1-.65L12 3z"
								/>
							</svg>
						</button>
					</div>
					<span
						v-if="service.promotion?.enabled"
						class="absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-bold bg-emerald-500 text-white shadow"
					>
						Promotion
					</span>
					<span
						class="absolute top-3 right-3 px-2 py-1 rounded-md text-xs font-semibold shadow"
						:class="
							pricingMode === 'quote'
								? 'bg-amber-900/90 text-amber-50'
								: 'bg-white/90 text-gray-900'
						"
					>
						{{ pricingMode === "quote" ? "Quote" : "Fixed price" }}
					</span>
				</div>

				<!-- Service Header Card -->
				<div
					class="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8 mb-6"
				>
					<div class="flex items-start justify-between mb-4">
						<div class="flex-1">
							<h2
								class="text-xl sm:text-2xl font-bold text-gray-900 mb-3"
							>
								Summary
							</h2>
							<div class="flex items-center gap-2 flex-wrap">
								<!-- Category Badge -->
								<span
									v-if="categoryName"
									class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
								>
									<svg
										class="w-4 h-4 mr-1"
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
									{{ categoryName }}
								</span>
								<!-- Status Badge -->
								<span
									v-if="service.status"
									:class="statusClass"
									class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
								>
									{{ formatStatus(service.status) }}
								</span>
							</div>
						</div>
					</div>

					<!-- Price and Duration -->
					<div
						class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-gray-200"
					>
						<div class="flex items-center gap-3">
							<div
								class="w-12 h-12 bg-[#0D65AE]/10 rounded-lg flex items-center justify-center"
							>
								<svg
									class="w-6 h-6 text-[#0D65AE]"
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
								<p class="text-sm text-gray-600">Price</p>
								<p class="text-2xl font-bold text-[#0D65AE]">
									{{ displayServicePrice() }}
								</p>
								<p
									v-if="promotionText()"
									class="text-sm text-emerald-700 font-medium mt-1"
								>
									{{ promotionText() }}
								</p>
							</div>
						</div>
						<div
							v-if="service.duration"
							class="flex items-center gap-3"
						>
							<div
								class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center"
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
										d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							</div>
							<div>
								<p class="text-sm text-gray-600">Duration</p>
								<p class="text-2xl font-bold text-purple-600">
									{{ formatDuration(service.duration) }}
								</p>
							</div>
						</div>
					</div>
				</div>

				<!-- Gallery (skip first image when used as hero) -->
				<div
					v-if="galleryPhotos.length"
					class="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8 mb-6"
				>
					<h2
						class="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2"
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
								d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
							/>
						</svg>
						Gallery
					</h2>
					<div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
						<a
							v-for="(url, i) in galleryPhotos"
							:key="i"
							:href="url"
							target="_blank"
							rel="noopener noreferrer"
							class="block rounded-lg overflow-hidden border border-gray-100 aspect-video bg-gray-50"
						>
							<img
								:src="url"
								:alt="`${service.name} ${i + 1}`"
								class="w-full h-full object-cover hover:opacity-95"
								loading="lazy"
							/>
						</a>
					</div>
				</div>

				<!-- Description Section -->
				<div
					v-if="service.description"
					class="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8 mb-6"
				>
					<h2
						class="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2"
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
								d="M4 6h16M4 12h16M4 18h7"
							/>
						</svg>
						Description
					</h2>
					<p
						class="text-gray-700 leading-relaxed whitespace-pre-wrap"
					>
						{{ service.description }}
					</p>
				</div>

				<!-- Company -->
				<div
					v-if="companyDisplayName"
					class="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8 mb-6"
				>
					<h2
						class="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2"
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
								d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
							/>
						</svg>
						Offered By
					</h2>
					<button
						type="button"
						class="w-full text-left rounded-xl border border-gray-100 bg-gray-50/80 hover:border-[#0D65AE]/40 hover:bg-white transition-all p-4 flex items-start gap-4"
						@click="openCompanyPreview"
					>
						<div
							class="w-14 h-14 rounded-xl bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 shadow-sm"
						>
							<svg
								class="w-7 h-7 text-gray-400"
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
						<div class="flex-1 min-w-0">
							<p
								class="text-lg font-semibold text-[#0D65AE] truncate"
							>
								{{ companyDisplayName }}
							</p>
							<p class="text-xs text-gray-500 mt-1">
								View company profile, locations &amp; contact
							</p>
							<div
								v-if="service.company?.email"
								class="mt-2 text-sm text-gray-600 truncate"
							>
								{{ service.company.email }}
							</div>
						</div>
						<svg
							class="w-5 h-5 text-gray-400 flex-shrink-0 mt-1"
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

				<!-- Metadata Section -->
				<div
					class="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8"
				>
					<h2
						class="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2"
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
								d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						Additional Information
					</h2>
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div
							v-if="service.created_at"
							class="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg"
						>
							<span class="text-sm text-gray-600">Created</span>
							<span class="text-sm font-medium text-gray-900">
								{{ formatDate(service.created_at) }}
							</span>
						</div>
						<div
							v-if="service.updated_at"
							class="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg"
						>
							<span class="text-sm text-gray-600"
								>Last Updated</span
							>
							<span class="text-sm font-medium text-gray-900">
								{{ formatDate(service.updated_at) }}
							</span>
						</div>
						<div
							v-if="service.uuid || service.id"
							class="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg"
						>
							<span class="text-sm text-gray-600"
								>Reference</span
							>
							<span
								class="text-sm font-medium text-gray-900 font-mono truncate max-w-[60%] text-right"
							>
								{{ service.uuid || service.id }}
							</span>
						</div>
					</div>
				</div>

				<!-- Action Buttons -->
				<div
					class="mt-6 flex flex-col sm:flex-row gap-3 sticky bottom-4"
				>
					<button
						v-if="service.status === 'active'"
						@click="bookService"
						class="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-medium text-white bg-[#0D65AE] rounded-lg hover:bg-[#0a4f87] focus:ring-2 focus:ring-[#0D65AE] focus:ring-offset-2 transition-all shadow-lg"
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
								d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
							/>
						</svg>
						Book This Service
					</button>
					<button
						@click="contactCompany"
						class="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-medium text-[#0D65AE] bg-white border border-[#0D65AE] rounded-lg hover:bg-[#0D65AE] hover:text-white focus:ring-2 focus:ring-[#0D65AE] focus:ring-offset-2 transition-all"
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
							/>
						</svg>
						Contact Company
					</button>
				</div>
			</div>

			<Teleport to="body">
				<Transition name="modal">
					<div
						v-if="companyPreviewOpen"
						class="fixed inset-0 z-[70] flex items-center justify-center p-4"
						@click.self="closeCompanyPreview"
					>
						<div
							class="absolute inset-0 bg-black/50 backdrop-blur-sm"
							@click="closeCompanyPreview"
						></div>
						<div
							class="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
							@click.stop
						>
							<div
								class="relative overflow-hidden rounded-t-2xl bg-gradient-to-br from-[#0D65AE] to-slate-900 px-6 py-7 text-white"
							>
								<button
									type="button"
									class="absolute top-3 right-3 p-2 rounded-lg bg-white/10 hover:bg-white/20"
									@click="closeCompanyPreview"
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
								<h2 class="text-2xl font-bold pr-10">
									{{ companyPreview?.name || "Company" }}
								</h2>
								<p
									v-if="companyPreview?.serviceCount != null"
									class="text-sm text-white/80 mt-1"
								>
									{{ companyPreview.serviceCount }} services
								</p>
							</div>
							<div class="p-6 space-y-4">
								<div
									v-if="companyPreviewLoading"
									class="flex items-center gap-2 text-gray-600 text-sm"
								>
									<div
										class="animate-spin rounded-full h-5 w-5 border-2 border-[#0D65AE] border-t-transparent"
									></div>
									Loading…
								</div>
								<template v-else-if="companyPreview">
									<p
										v-if="companyPreview.description"
										class="text-gray-700 text-sm whitespace-pre-wrap"
									>
										{{ companyPreview.description }}
									</p>
									<div
										v-if="companyPreview.locations?.length"
										class="space-y-2"
									>
										<h3
											class="text-xs font-bold text-gray-500 uppercase"
										>
											Locations
										</h3>
										<ul class="space-y-2 text-sm">
											<li
												v-for="(loc, i) in companyPreview.locations"
												:key="loc.uuid || i"
												class="border border-gray-100 rounded-lg px-3 py-2"
											>
												<p class="font-medium">
													{{ loc.name }}
												</p>
												<p
													v-if="loc.address"
													class="text-gray-600 text-xs"
												>
													{{ loc.address }}
												</p>
											</li>
										</ul>
									</div>
								</template>
							</div>
							<div
								class="sticky bottom-0 bg-white border-t px-6 py-3 rounded-b-2xl"
							>
								<button
									type="button"
									class="w-full py-2.5 text-sm font-semibold border rounded-lg hover:bg-gray-50"
									@click="closeCompanyPreview"
								>
									Close
								</button>
							</div>
						</div>
					</div>
				</Transition>
			</Teleport>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useServices } from "@/composables/useServices";
import { useToast } from "@/composables/useToast";
import {
	getCompanyCatalog,
	addServiceFavorite,
	removeServiceFavorite,
	listServiceFavorites,
} from "@/api/services.api";
import {
	formatCurrency,
	formatDuration,
	formatStatus,
	formatDate,
} from "@/utils/formatters";

const route = useRoute();
const router = useRouter();
const { fetchService, getCategoryById } = useServices();
const { showInfo, showError, showSuccess } = useToast();
// State
const loading = ref(false);
const error = ref(null);
const service = ref(null);
const isFavorite = ref(false);
const companyPreviewOpen = ref(false);
const companyPreviewLoading = ref(false);
const companyPreview = ref(null);

// Computed
const serviceId = computed(() => route.params.id);

const categoryName = computed(() => {
	if (!service.value) return "";
	if (service.value.category?.name) {
		return service.value.category.name;
	}
	if (service.value.category_name) {
		return service.value.category_name;
	}
	if (service.value.categoryId) {
		const category = getCategoryById(service.value.categoryId);
		return category?.name || "";
	}
	return "";
});

const heroImage = computed(() => {
	const p = service.value?.photos;
	if (Array.isArray(p) && p.length > 0 && p[0]) {
		return p[0];
	}
	return null;
});

const galleryPhotos = computed(() => {
	const p = service.value?.photos;
	if (!Array.isArray(p) || p.length <= 1) {
		return [];
	}
	return p.slice(1);
});

const pricingMode = computed(
	() =>
		service.value?.pricing_mode ||
		service.value?.pricingMode ||
		"fixed",
);

const companyDisplayName = computed(() => {
	const s = service.value;
	if (!s) return "";
	return (
		s.company?.name ||
		s.company_name ||
		s.companyName ||
		""
	);
});

const companyUuidForPreview = computed(() => {
	const s = service.value;
	if (!s) return null;
	return s.company_uuid || s.companyUuid || s.company?.uuid || null;
});

const statusClass = computed(() => {
	if (!service.value?.status) return "bg-gray-100 text-gray-800";

	const status = service.value.status.toLowerCase();
	if (status === "active") {
		return "bg-green-100 text-green-800";
	} else if (status === "inactive") {
		return "bg-gray-100 text-gray-800";
	} else if (status === "draft") {
		return "bg-yellow-100 text-yellow-800";
	}
	return "bg-gray-100 text-gray-800";
});

// Methods
const formatPrice = (price) => {
	if (price === null || price === undefined || price === "") {
		return "—";
	}
	return formatCurrency(price);
};

const displayServicePrice = () => {
	const s = service.value;
	if (!s) {
		return "—";
	}
	const mode = s.pricing_mode || s.pricingMode;
	const base = s.base_price ?? s.basePrice ?? s.price;
	if (mode === "quote") {
		if (base === null || base === undefined || base === "") {
			return "Quote on request";
		}
		return `From ${formatPrice(base)} (guide)`;
	}
	return formatPrice(base);
};

const promotionText = () => {
	const pr = service.value?.promotion;
	if (!pr || !pr.enabled) {
		return "";
	}
	const was = formatPrice(pr.compareAt);
	const now = formatPrice(pr.price);
	const lbl = pr.label ? ` — ${pr.label}` : "";
	return `Was ${was} · Now ${now}${lbl}`;
};

const loadService = async () => {
	loading.value = true;
	error.value = null;

	try {
		const result = await fetchService(serviceId.value);
		if (result.success) {
			service.value = result.data;
			const sid =
				result.data?.uuid || result.data?.id || serviceId.value;
			try {
				const favRes = await listServiceFavorites();
				const payload = favRes?.data ?? favRes;
				const uuids = payload?.serviceUuids ?? [];
				isFavorite.value = Array.isArray(uuids) && uuids.includes(sid);
			} catch {
				isFavorite.value = false;
			}
		} else {
			throw new Error(result.error || "Failed to load service");
		}
	} catch (err) {
		console.error("Error loading service:", err);
		error.value = err.message || "Failed to load service details";
	} finally {
		loading.value = false;
	}
};

const openCompanyPreview = async () => {
	const uuid = companyUuidForPreview.value;
	if (!uuid) {
		showInfo("Company profile is not available for this service.");
		return;
	}
	companyPreviewOpen.value = true;
	companyPreviewLoading.value = true;
	companyPreview.value = null;
	try {
		const res = await getCompanyCatalog(uuid);
		const data = res?.data ?? res;
		if (res?.success === false || !data) {
			throw new Error(res?.message || "Could not load company");
		}
		companyPreview.value = data;
	} catch (e) {
		showError(e.message || "Could not load company");
		companyPreviewOpen.value = false;
	} finally {
		companyPreviewLoading.value = false;
	}
};

const closeCompanyPreview = () => {
	companyPreviewOpen.value = false;
	companyPreview.value = null;
};

const toggleFavorite = async () => {
	const s = service.value;
	const sid = s?.uuid || s?.id;
	if (!sid) return;
	const next = !isFavorite.value;
	isFavorite.value = next;
	try {
		if (next) {
			await addServiceFavorite(sid);
			showSuccess("Saved to favorites");
		} else {
			await removeServiceFavorite(sid);
			showSuccess("Removed from favorites");
		}
	} catch (e) {
		isFavorite.value = !next;
		showError(e.message || "Could not update favorites");
	}
};

const goBack = () => {
	router.go(-1);
};

const bookService = () => {
	const sid = service.value?.uuid || service.value?.id;
	if (!sid) {
		showInfo("Service information not available");
		return;
	}
	const cid =
		service.value?.company_uuid ||
		service.value?.companyUuid ||
		service.value?.company?.uuid ||
		null;
	const query = { serviceId: String(sid) };
	if (cid) {
		query.companyId = String(cid);
	}
	router.push({
		name: "CreateRequest",
		query,
	});
};

const contactCompany = () => {
	const email =
		service.value?.company?.email ||
		service.value?.company_email ||
		null;
	if (email) {
		window.location.href = `mailto:${email}`;
	} else {
		showInfo("Company contact information not available");
	}
};

// Lifecycle
onMounted(() => {
	loadService();
});
</script>

<style scoped>
/* Additional styles if needed */
</style>
