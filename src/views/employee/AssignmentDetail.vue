<template>
	<div class="bg-gray-50 p-4 sm:p-6 lg:p-8">
		<div class="max-w-3xl mx-auto">

			<!-- Back Button -->
			<div class="mb-4">
				<router-link
					to="/my-assignments"
					class="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[#0D65AE] transition-colors"
				>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
					</svg>
					Volver a Mis Asignaciones
				</router-link>
			</div>

			<!-- Global Loading Skeleton -->
			<div v-if="loading && !currentAssignment" class="space-y-4">
				<div class="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
					<div class="h-6 bg-gray-200 rounded w-2/3 mb-3"></div>
					<div class="h-4 bg-gray-100 rounded w-1/3"></div>
				</div>
				<div class="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
					<div class="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
					<div class="space-y-2">
						<div class="h-3 bg-gray-100 rounded w-full"></div>
						<div class="h-3 bg-gray-100 rounded w-5/6"></div>
					</div>
				</div>
			</div>

			<!-- Error State -->
			<div v-else-if="error && !currentAssignment" class="bg-white rounded-xl border border-red-200 p-10 text-center">
				<div class="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
					<svg class="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
							d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
				</div>
				<h3 class="text-lg font-semibold text-gray-900 mb-1">Error al cargar</h3>
				<p class="text-gray-500 text-sm mb-5">{{ error }}</p>
				<button @click="loadAssignment"
					class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0D65AE] rounded-lg hover:bg-[#0D65AE]/90 transition-all">
					Reintentar
				</button>
			</div>

			<!-- Main Content -->
			<div v-else-if="currentAssignment" class="space-y-5">

				<!-- ── Header Card ───────────────────────────────────────────── -->
				<div class="bg-white rounded-xl border border-gray-200 p-5 sm:p-6">
					<div class="flex items-start justify-between gap-4">
						<div class="flex-1 min-w-0">
							<h1 class="text-xl sm:text-2xl font-bold text-gray-900 leading-snug">
								{{ serviceName }}
							</h1>
							<p class="text-gray-500 text-sm mt-1">{{ customerName }}</p>
						</div>
						<span :class="['flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide', statusClasses[currentAssignment.status] || 'bg-gray-100 text-gray-600']">
							{{ statusLabels[currentAssignment.status] || currentAssignment.status }}
						</span>
					</div>

					<!-- Status Timeline -->
					<div class="mt-5 pt-5 border-t border-gray-100">
						<div class="flex items-center">
							<template v-for="(step, idx) in timeline" :key="step.key">
								<div class="flex flex-col items-center">
									<div :class="[
										'w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all',
										step.done
											? 'bg-[#0D65AE] border-[#0D65AE]'
											: step.active
											? 'border-[#0D65AE] bg-white'
											: 'border-gray-200 bg-gray-50',
									]">
										<svg v-if="step.done" class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
										</svg>
										<div v-else-if="step.active" class="w-2.5 h-2.5 rounded-full bg-[#0D65AE]"></div>
									</div>
									<span :class="[
										'text-xs mt-1 font-medium whitespace-nowrap',
										step.done || step.active ? 'text-[#0D65AE]' : 'text-gray-400',
									]">{{ step.label }}</span>
								</div>
								<div v-if="idx < timeline.length - 1" :class="[
									'flex-1 h-0.5 mx-1 mb-4',
									timeline[idx + 1].done || timeline[idx + 1].active ? 'bg-[#0D65AE]' : 'bg-gray-200',
								]"></div>
							</template>
						</div>
					</div>
				</div>

				<!-- ── Service & Request Info ────────────────────────────────── -->
				<div class="bg-white rounded-xl border border-gray-200 p-5 sm:p-6">
					<h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
						Información del Servicio
					</h2>
					<dl class="space-y-3">
						<div v-if="serviceDescription" class="flex gap-3">
							<dt class="text-sm text-gray-500 w-32 flex-shrink-0">Descripción</dt>
							<dd class="text-sm text-gray-800">{{ serviceDescription }}</dd>
						</div>
						<div v-if="requestNotes" class="flex gap-3">
							<dt class="text-sm text-gray-500 w-32 flex-shrink-0">Notas</dt>
							<dd class="text-sm text-gray-800">{{ requestNotes }}</dd>
						</div>
						<div v-if="preferredDate" class="flex gap-3">
							<dt class="text-sm text-gray-500 w-32 flex-shrink-0">Fecha preferida</dt>
							<dd class="text-sm text-gray-800">{{ formatDate(preferredDate) }}</dd>
						</div>
						<div v-if="assignedDate" class="flex gap-3">
							<dt class="text-sm text-gray-500 w-32 flex-shrink-0">Asignado el</dt>
							<dd class="text-sm text-gray-800">{{ formatDate(assignedDate) }}</dd>
						</div>
						<div v-if="startedAt" class="flex gap-3">
							<dt class="text-sm text-gray-500 w-32 flex-shrink-0">Inicio</dt>
							<dd class="text-sm text-gray-800">{{ formatDate(startedAt) }}</dd>
						</div>
						<div v-if="completedAt" class="flex gap-3">
							<dt class="text-sm text-gray-500 w-32 flex-shrink-0">Completado</dt>
							<dd class="text-sm font-medium text-green-700">{{ formatDate(completedAt) }}</dd>
						</div>
					</dl>
				</div>

				<!-- ── Location Card ─────────────────────────────────────────── -->
				<div v-if="locationInfo" class="bg-white rounded-xl border border-gray-200 p-5 sm:p-6">
					<h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
						Ubicación
					</h2>
					<div class="flex items-start gap-3">
						<div class="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
							<svg class="w-5 h-5 text-[#0D65AE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
							</svg>
						</div>
						<div class="flex-1">
							<p class="text-sm font-medium text-gray-800">
								{{ locationInfo.address || locationInfo.name || 'Dirección no especificada' }}
							</p>
							<p v-if="locationInfo.description && locationInfo.description !== locationInfo.address"
								class="text-xs text-gray-500 mt-0.5">
								{{ locationInfo.description }}
							</p>
							<!-- NFC Code indicator -->
							<div v-if="locationNfcCode" class="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 text-xs font-medium">
								<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
										d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
								</svg>
								NFC disponible en esta ubicación
							</div>
						</div>
					</div>
				</div>

				<!-- ── GPS Tracking Badge (in_progress) ─────────────────────── -->
				<div v-if="currentAssignment.status === 'in_progress'"
					class="bg-teal-50 border border-teal-200 rounded-xl p-4 flex items-center gap-3">
					<span class="w-3 h-3 rounded-full bg-teal-500 animate-pulse flex-shrink-0"></span>
					<div class="flex-1">
						<p class="text-sm font-semibold text-teal-800">Servicio en curso — Tracking GPS activo</p>
						<p v-if="currentCoords" class="text-xs text-teal-600 mt-0.5">
							{{ currentCoords.latitude.toFixed(5) }}, {{ currentCoords.longitude.toFixed(5) }}
							<span v-if="currentCoords.accuracy"> · ±{{ Math.round(currentCoords.accuracy) }}m</span>
						</p>
						<p v-else class="text-xs text-teal-600 mt-0.5">Obteniendo ubicación...</p>
					</div>
					<svg class="w-5 h-5 text-teal-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
							d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
					</svg>
				</div>

				<!-- ══════════════════════════════════════════════════════════════ -->
				<!--  ACTION PANEL — changes per status                            -->
				<!-- ══════════════════════════════════════════════════════════════ -->

				<!-- ── PENDING: Accept / Reject ──────────────────────────────── -->
				<div v-if="currentAssignment.status === 'pending'"
					class="bg-white rounded-xl border border-yellow-200 p-5 sm:p-6">
					<div class="flex items-center gap-3 mb-5">
						<div class="w-9 h-9 rounded-lg bg-yellow-50 flex items-center justify-center flex-shrink-0">
							<svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						</div>
						<div>
							<h2 class="text-base font-semibold text-gray-900">Requiere tu respuesta</h2>
							<p class="text-xs text-gray-500">¿Puedes aceptar este trabajo?</p>
						</div>
					</div>
					<div class="flex flex-col sm:flex-row gap-3">
						<button
							@click="handleAccept"
							:disabled="actionLoading"
							class="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-60 transition-all"
						>
							<svg v-if="actionLoading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
							</svg>
							<svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
							</svg>
							Aceptar Asignación
						</button>
						<button
							@click="openRejectModal"
							:disabled="actionLoading"
							class="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 focus:ring-2 focus:ring-red-400 focus:ring-offset-2 disabled:opacity-60 transition-all"
						>
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
							</svg>
							Rechazar
						</button>
					</div>
				</div>

				<!-- ── ACCEPTED: Verify NFC + Start ──────────────────────────── -->
				<div v-if="currentAssignment.status === 'accepted'"
					class="bg-white rounded-xl border border-blue-200 p-5 sm:p-6 space-y-5">
					<div class="flex items-center gap-3">
						<div class="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
							<svg class="w-5 h-5 text-[#0D65AE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M13 10V3L4 14h7v7l9-11h-7z" />
							</svg>
						</div>
						<div>
							<h2 class="text-base font-semibold text-gray-900">Iniciar Servicio</h2>
							<p class="text-xs text-gray-500">Verifica el NFC y confirma tu ubicación para comenzar</p>
						</div>
					</div>

					<!-- NFC Verification block (only if location has NFC) -->
					<div v-if="locationNfcCode" class="rounded-lg bg-purple-50 border border-purple-100 p-4">
						<h3 class="text-sm font-semibold text-purple-900 mb-3 flex items-center gap-2">
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
							</svg>
							Verificación NFC
						</h3>

						<!-- Verified banner -->
						<div v-if="nfcVerified" class="flex items-center gap-2 mb-3 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
							<svg class="w-4 h-4 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
							</svg>
							<span class="text-sm font-medium text-green-700">NFC verificado correctamente</span>
						</div>

						<!-- Failed banner -->
						<div v-if="nfcError" class="flex items-center gap-2 mb-3 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
							<svg class="w-4 h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
							</svg>
							<span class="text-sm text-red-700">{{ nfcError }}</span>
						</div>

						<!-- NFC Scan (Web NFC API) -->
						<div v-if="nfcSupported && !nfcVerified" class="mb-3">
							<button
								@click="handleNfcScan"
								:disabled="nfcScanning || actionLoading"
								class="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-purple-700 bg-white border border-purple-300 rounded-lg hover:bg-purple-50 disabled:opacity-60 transition-all"
							>
								<svg v-if="nfcScanning" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
									<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
									<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
								</svg>
								<svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
										d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
								</svg>
								{{ nfcScanning ? 'Esperando etiqueta NFC...' : 'Escanear con NFC' }}
							</button>
						</div>

						<!-- Manual NFC Code -->
						<div v-if="!nfcVerified">
							<div class="flex gap-2">
								<input
									v-model="manualNfcCode"
									type="text"
									placeholder="Ingresa el código NFC manualmente"
									class="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D65AE] focus:border-[#0D65AE] outline-none"
									@keyup.enter="handleManualNfcVerify"
								/>
								<button
									@click="handleManualNfcVerify"
									:disabled="!manualNfcCode.trim() || actionLoading"
									class="px-4 py-2 text-sm font-medium text-white bg-[#0D65AE] rounded-lg hover:bg-[#0D65AE]/90 disabled:opacity-50 transition-all"
								>
									Verificar
								</button>
							</div>
							<p class="text-xs text-purple-600 mt-1.5">
								{{ nfcSupported ? 'O ingresa el código manualmente si no puedes escanear' : 'Tu dispositivo no soporta NFC, ingresa el código manualmente' }}
							</p>
						</div>
					</div>

					<!-- Start Service Button -->
					<button
						@click="handleStart"
						:disabled="actionLoading"
						class="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-semibold text-white bg-[#0D65AE] rounded-lg hover:bg-[#0D65AE]/90 focus:ring-2 focus:ring-[#0D65AE] focus:ring-offset-2 disabled:opacity-60 transition-all"
					>
						<svg v-if="actionLoading" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
						</svg>
						<svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
								d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
								d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
						{{ actionLoading ? 'Iniciando...' : 'Iniciar Servicio' }}
					</button>
					<p v-if="locationNfcCode && !nfcVerified" class="text-xs text-center text-gray-500 -mt-2">
						Puedes iniciar sin verificar NFC, pero se registrará como no verificado
					</p>
				</div>

				<!-- ── IN_PROGRESS: Complete ──────────────────────────────────── -->
				<div v-if="currentAssignment.status === 'in_progress'"
					class="bg-white rounded-xl border border-teal-200 p-5 sm:p-6">
					<div class="flex items-center gap-3 mb-5">
						<div class="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0">
							<svg class="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						</div>
						<div>
							<h2 class="text-base font-semibold text-gray-900">Finalizar Servicio</h2>
							<p class="text-xs text-gray-500">Marca el servicio como completado cuando termines</p>
						</div>
					</div>
					<button
						@click="openCompleteModal"
						:disabled="actionLoading"
						class="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-60 transition-all"
					>
						<svg v-if="actionLoading" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
						</svg>
						<svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
								d="M9 12l2 2 4-4M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
						</svg>
						Completar Servicio
					</button>
				</div>

				<!-- ── COMPLETED ─────────────────────────────────────────────── -->
				<div v-if="currentAssignment.status === 'completed'"
					class="bg-green-50 border border-green-200 rounded-xl p-5 sm:p-6 flex items-center gap-4">
					<div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
						<svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
						</svg>
					</div>
					<div>
						<p class="font-semibold text-green-800">¡Servicio completado!</p>
						<p v-if="completedAt" class="text-sm text-green-700 mt-0.5">
							Finalizado el {{ formatDate(completedAt) }}
						</p>
					</div>
				</div>

				<!-- ── REJECTED ──────────────────────────────────────────────── -->
				<div v-if="currentAssignment.status === 'rejected'"
					class="bg-red-50 border border-red-200 rounded-xl p-5 sm:p-6 flex items-center gap-4">
					<div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
						<svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</div>
					<div>
						<p class="font-semibold text-red-800">Asignación rechazada</p>
						<p v-if="currentAssignment.rejectionReason || currentAssignment.rejection_reason"
							class="text-sm text-red-700 mt-0.5">
							{{ currentAssignment.rejectionReason || currentAssignment.rejection_reason }}
						</p>
					</div>
				</div>

				<!-- ── CANCELLED ─────────────────────────────────────────────── -->
				<div v-if="currentAssignment.status === 'cancelled'"
					class="bg-gray-50 border border-gray-200 rounded-xl p-5 sm:p-6 flex items-center gap-4">
					<div class="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
						<svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
								d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
						</svg>
					</div>
					<div>
						<p class="font-semibold text-gray-700">Asignación cancelada</p>
						<p class="text-sm text-gray-500 mt-0.5">Esta asignación fue cancelada y ya no está activa.</p>
					</div>
				</div>

			</div><!-- /Main Content -->
		</div><!-- /max-w -->
	</div><!-- /bg-gray-50 -->

	<!-- ══════════════════════════════════════════════════════════════════════ -->
	<!--  REJECT MODAL                                                         -->
	<!-- ══════════════════════════════════════════════════════════════════════ -->
	<Teleport to="body">
		<Transition name="modal">
			<div v-if="showRejectModal"
				class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
				@click.self="closeRejectModal"
			>
				<div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
					<div class="flex items-center gap-3 mb-5">
						<div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
							<svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
							</svg>
						</div>
						<div>
							<h3 class="text-base font-semibold text-gray-900">Rechazar Asignación</h3>
							<p class="text-xs text-gray-500">Indica el motivo del rechazo</p>
						</div>
					</div>

					<div class="mb-5">
						<label class="block text-sm font-medium text-gray-700 mb-1.5">
							Motivo <span class="text-red-500">*</span>
						</label>
						<textarea
							v-model="rejectReason"
							rows="4"
							placeholder="Describe el motivo por el que no puedes aceptar este trabajo..."
							class="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-red-400 outline-none resize-none"
						></textarea>
						<p :class="['text-xs mt-1', rejectReason.trim().length < 10 && rejectReason.length > 0 ? 'text-red-500' : 'text-gray-400']">
							Mínimo 10 caracteres ({{ rejectReason.trim().length }}/10)
						</p>
					</div>

					<div class="flex gap-3">
						<button
							@click="closeRejectModal"
							class="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
						>
							Cancelar
						</button>
						<button
							@click="handleReject"
							:disabled="rejectReason.trim().length < 10 || actionLoading"
							class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 disabled:opacity-60 transition-all"
						>
							<svg v-if="actionLoading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
							</svg>
							Confirmar Rechazo
						</button>
					</div>
				</div>
			</div>
		</Transition>
	</Teleport>

	<!-- ══════════════════════════════════════════════════════════════════════ -->
	<!--  COMPLETE MODAL                                                        -->
	<!-- ══════════════════════════════════════════════════════════════════════ -->
	<Teleport to="body">
		<Transition name="modal">
			<div v-if="showCompleteModal"
				class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
				@click.self="closeCompleteModal"
			>
				<div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
					<div class="flex items-center gap-3 mb-5">
						<div class="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
							<svg class="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
							</svg>
						</div>
						<div>
							<h3 class="text-base font-semibold text-gray-900">Completar Servicio</h3>
							<p class="text-xs text-gray-500">Añade notas finales (opcional)</p>
						</div>
					</div>

					<div class="mb-5">
						<label class="block text-sm font-medium text-gray-700 mb-1.5">
							Notas de finalización
						</label>
						<textarea
							v-model="completeNotes"
							rows="4"
							placeholder="Describe el trabajo realizado, observaciones, incidencias..."
							class="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none resize-none"
						></textarea>
					</div>

					<div class="flex gap-3">
						<button
							@click="closeCompleteModal"
							class="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
						>
							Cancelar
						</button>
						<button
							@click="handleComplete"
							:disabled="actionLoading"
							class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 disabled:opacity-60 transition-all"
						>
							<svg v-if="actionLoading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
							</svg>
							<svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
							</svg>
							Confirmar Completado
						</button>
					</div>
				</div>
			</div>
		</Transition>
	</Teleport>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useEmployeeAssignments } from '@/composables/useEmployeeAssignments';

// ── Props ─────────────────────────────────────────────────────────────────────
const props = defineProps({
	id: {
		type: String,
		required: true,
	},
});

// ── Composable ────────────────────────────────────────────────────────────────
const {
	currentAssignment,
	loading,
	error,
	fetchMyAssignment,
	acceptAssignment,
	rejectAssignment,
	verifyNfc,
	startAssignment,
	completeAssignment,
	startAutoTracking,
} = useEmployeeAssignments();

// ── Local state ───────────────────────────────────────────────────────────────
const actionLoading = ref(false);

// Reject modal
const showRejectModal = ref(false);
const rejectReason = ref('');

// Complete modal
const showCompleteModal = ref(false);
const completeNotes = ref('');

// NFC
const nfcSupported = 'NDEFReader' in window;
const nfcScanning = ref(false);
const nfcVerified = ref(false);
const nfcVerifiedCode = ref('');
const nfcError = ref('');
const manualNfcCode = ref('');

// GPS
const currentCoords = ref(null);

// Auto-tracking control
let stopTracking = null;

// ── Computed helpers ──────────────────────────────────────────────────────────
const serviceRequest = computed(() =>
	currentAssignment.value?.serviceRequest || currentAssignment.value?.service_request,
);

const serviceName = computed(() => {
	const sr = serviceRequest.value;
	return (
		sr?.service?.name ||
		currentAssignment.value?.serviceName ||
		currentAssignment.value?.service?.name ||
		'Servicio sin nombre'
	);
});

const serviceDescription = computed(() => {
	const sr = serviceRequest.value;
	return sr?.service?.description || sr?.description || currentAssignment.value?.description || null;
});

const customerName = computed(() => {
	const sr = serviceRequest.value;
	const c = sr?.customer || sr?.user;
	if (!c) return 'Cliente desconocido';
	return c.name || c.fullName || c.full_name || c.email || 'Cliente';
});

const requestNotes = computed(() => serviceRequest.value?.notes || null);

const preferredDate = computed(() =>
	serviceRequest.value?.preferredDate || serviceRequest.value?.preferred_date || null,
);

const assignedDate = computed(() =>
	currentAssignment.value?.assignedAt ||
	currentAssignment.value?.assigned_at ||
	currentAssignment.value?.createdAt ||
	null,
);

const startedAt = computed(() =>
	currentAssignment.value?.startedAt || currentAssignment.value?.started_at || null,
);

const completedAt = computed(() =>
	currentAssignment.value?.completedAt || currentAssignment.value?.completed_at || null,
);

const locationInfo = computed(() => {
	const sr = serviceRequest.value;
	return sr?.location || currentAssignment.value?.location || null;
});

const locationNfcCode = computed(() => {
	const loc = locationInfo.value;
	return loc?.nfcCode || loc?.nfc_code || loc?.nfcTag || null;
});

// ── Timeline ──────────────────────────────────────────────────────────────────
const timelineSteps = ['pending', 'accepted', 'in_progress', 'completed'];

const timeline = computed(() => {
	const status = currentAssignment.value?.status;
	const currentIdx = timelineSteps.indexOf(status);
	return [
		{ key: 'pending', label: 'Pendiente' },
		{ key: 'accepted', label: 'Aceptada' },
		{ key: 'in_progress', label: 'En Progreso' },
		{ key: 'completed', label: 'Completada' },
	].map((step, idx) => ({
		...step,
		done: idx < currentIdx,
		active: idx === currentIdx,
	}));
});

// ── Status display helpers ────────────────────────────────────────────────────
const statusLabels = {
	pending: 'Pendiente',
	accepted: 'Aceptada',
	in_progress: 'En Progreso',
	completed: 'Completada',
	rejected: 'Rechazada',
	cancelled: 'Cancelada',
};

const statusClasses = {
	pending: 'bg-yellow-100 text-yellow-800',
	accepted: 'bg-blue-100 text-blue-800',
	in_progress: 'bg-teal-100 text-teal-800',
	completed: 'bg-green-100 text-green-800',
	rejected: 'bg-red-100 text-red-800',
	cancelled: 'bg-gray-100 text-gray-600',
};

// ── GPS ───────────────────────────────────────────────────────────────────────
function getCurrentPosition() {
	return new Promise((resolve, reject) => {
		if (!navigator.geolocation) {
			reject(new Error('Geolocalización no disponible'));
			return;
		}
		navigator.geolocation.getCurrentPosition(
			(pos) =>
				resolve({
					latitude: pos.coords.latitude,
					longitude: pos.coords.longitude,
					accuracy: pos.coords.accuracy,
				}),
			(err) => reject(err),
			{ enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
		);
	});
}

async function refreshCoords() {
	try {
		currentCoords.value = await getCurrentPosition();
	} catch {
		// GPS not available — silently ignore
	}
}

// ── Action handlers ───────────────────────────────────────────────────────────

async function handleAccept() {
	actionLoading.value = true;
	const result = await acceptAssignment(props.id);
	actionLoading.value = false;
	if (result.success) {
		await loadAssignment();
	}
}

function openRejectModal() {
	rejectReason.value = '';
	showRejectModal.value = true;
}

function closeRejectModal() {
	showRejectModal.value = false;
}

async function handleReject() {
	if (rejectReason.value.trim().length < 10) return;
	actionLoading.value = true;
	const result = await rejectAssignment(props.id, rejectReason.value.trim());
	actionLoading.value = false;
	if (result.success) {
		closeRejectModal();
		await loadAssignment();
	}
}

// NFC — Web NFC API scan
async function handleNfcScan() {
	nfcError.value = '';
	nfcScanning.value = true;
	try {
		const ndef = new window.NDEFReader();
		await ndef.scan();
		ndef.addEventListener('reading', async ({ message }) => {
			nfcScanning.value = false;
			// Try to decode the first text record
			let code = '';
			for (const record of message.records) {
				if (record.recordType === 'text') {
					const decoder = new TextDecoder(record.encoding || 'utf-8');
					code = decoder.decode(record.data);
					break;
				}
			}
			if (!code) {
				nfcError.value = 'No se pudo leer el contenido del tag NFC';
				return;
			}
			await verifyWithCode(code);
		});
		ndef.addEventListener('readingerror', () => {
			nfcScanning.value = false;
			nfcError.value = 'Error al leer el tag NFC. Inténtalo de nuevo.';
		});
	} catch (err) {
		nfcScanning.value = false;
		nfcError.value = err.message || 'No se pudo activar el lector NFC';
	}
}

async function handleManualNfcVerify() {
	const code = manualNfcCode.value.trim();
	if (!code) return;
	nfcError.value = '';
	await verifyWithCode(code);
}

async function verifyWithCode(code) {
	actionLoading.value = true;
	let coords = currentCoords.value;
	if (!coords) {
		try {
			coords = await getCurrentPosition();
			currentCoords.value = coords;
		} catch {
			coords = { latitude: 0, longitude: 0 };
		}
	}
	const result = await verifyNfc(props.id, code, coords);
	actionLoading.value = false;
	if (result.success && result.verified) {
		nfcVerified.value = true;
		nfcVerifiedCode.value = code;
		nfcError.value = '';
	} else if (result.success && !result.verified) {
		nfcError.value = result.message || 'Código NFC incorrecto para esta ubicación';
	}
}

async function handleStart() {
	actionLoading.value = true;
	let coords = currentCoords.value;
	if (!coords) {
		try {
			coords = await getCurrentPosition();
			currentCoords.value = coords;
		} catch {
			coords = { latitude: 0, longitude: 0 };
		}
	}
	const result = await startAssignment(
		props.id,
		coords,
		nfcVerified.value ? nfcVerifiedCode.value : undefined,
	);
	actionLoading.value = false;
	if (result.success) {
		await loadAssignment();
		// Auto-start tracking
		beginAutoTracking();
	}
}

function openCompleteModal() {
	completeNotes.value = '';
	showCompleteModal.value = true;
}

function closeCompleteModal() {
	showCompleteModal.value = false;
}

async function handleComplete() {
	actionLoading.value = true;
	let coords = currentCoords.value;
	if (!coords) {
		try {
			coords = await getCurrentPosition();
			currentCoords.value = coords;
		} catch {
			coords = { latitude: 0, longitude: 0 };
		}
	}
	const notes = completeNotes.value.trim() || undefined;
	const result = await completeAssignment(props.id, coords, notes);
	actionLoading.value = false;
	if (result.success) {
		stopAutoTracking();
		closeCompleteModal();
		await loadAssignment();
	}
}

// ── Auto tracking ─────────────────────────────────────────────────────────────
function beginAutoTracking() {
	if (stopTracking) return; // already running
	const { stop } = startAutoTracking(props.id, 30000);
	stopTracking = stop;
	// Also keep coords updated locally for display
	refreshCoords();
}

function stopAutoTracking() {
	if (stopTracking) {
		stopTracking();
		stopTracking = null;
	}
}

// ── Utilities ─────────────────────────────────────────────────────────────────
function formatDate(dateStr) {
	if (!dateStr) return '';
	const d = new Date(dateStr);
	if (isNaN(d)) return dateStr;
	return d.toLocaleDateString('es-ES', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});
}

// ── Lifecycle ─────────────────────────────────────────────────────────────────
async function loadAssignment() {
	await fetchMyAssignment(props.id);
}

onMounted(async () => {
	await loadAssignment();

	// If already in progress, start tracking immediately
	if (currentAssignment.value?.status === 'in_progress') {
		await refreshCoords();
		beginAutoTracking();
	}
});

onUnmounted(() => {
	stopAutoTracking();
});
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
	transition: opacity 0.2s ease;
}
.modal-enter-active .bg-white,
.modal-leave-active .bg-white {
	transition: transform 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
	opacity: 0;
}
.modal-enter-from .bg-white {
	transform: scale(0.95) translateY(8px);
}
.modal-leave-to .bg-white {
	transform: scale(0.95) translateY(8px);
}
</style>
