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
							<dd class="text-sm text-gray-800">
								{{ formatDate(startedAt) }}
								<span
									v-if="startedScheduleType"
									class="block text-xs text-gray-500 mt-0.5 uppercase tracking-wide"
								>
									Turno:
									{{
										startedScheduleType === 'travel'
											? 'Travel'
											: startedScheduleType === 'night'
												? 'Noche'
												: 'Día'
									}}
								</span>
							</dd>
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

				<!-- ── ASSIGNED / PENDING: confirmar (aceptar o rechazar) ───── -->
				<div v-if="isAwaitingEmployeeConfirm"
					class="bg-white rounded-xl border border-yellow-200 p-5 sm:p-6">
					<div class="flex items-center gap-3 mb-5">
						<div class="w-9 h-9 rounded-lg bg-yellow-50 flex items-center justify-center flex-shrink-0">
							<svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						</div>
						<div>
							<h2 class="text-base font-semibold text-gray-900">Confirmar servicio</h2>
							<p class="text-xs text-gray-500">
								La empresa te asignó este trabajo. Acepta para poder iniciarlo en sitio, o recházalo si no puedes.
							</p>
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

					<!-- NFC: obligatorio (empresa) o hay tag en la ubicación del request -->
					<div v-if="showNfcStartSection" class="rounded-lg bg-purple-50 border border-purple-100 p-4">
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

						<!-- Solo lectura física del tag (Web NFC); no hay entrada manual -->
						<div v-if="nfcSupported && !nfcVerified" class="mb-3">
							<button
								type="button"
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
								{{ nfcScanning ? 'Esperando etiqueta NFC...' : 'Escanear etiqueta NFC' }}
							</button>
						</div>

						<div
							v-if="nfcRequiredForStart && !nfcSupported"
							class="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-800"
						>
							Este navegador o dispositivo no permite leer NFC (se requiere Web NFC, p. ej. Chrome en Android).
							No puedes iniciar el servicio aquí: usa un dispositivo compatible.
						</div>
						<p
							v-else-if="!nfcRequiredForStart && !nfcSupported && !nfcVerified && showNfcStartSection"
							class="text-xs text-gray-600"
						>
							Lectura NFC opcional no disponible en este equipo; puedes iniciar el servicio sin escanear.
						</p>
					</div>

					<!-- Turno (día / noche / travel) al iniciar -->
					<div class="rounded-lg border border-gray-200 bg-gray-50/80 p-4">
						<span class="block text-xs font-semibold text-gray-600 mb-2">Tipo de turno</span>
						<div
							class="grid grid-cols-3 gap-1.5 rounded-lg border border-gray-200 p-1 bg-white"
							role="group"
							aria-label="Tipo de turno al iniciar servicio"
						>
							<button
								type="button"
								:aria-pressed="assignmentScheduleType === 'day'"
								:class="[
									'flex flex-col items-center justify-center gap-1 py-2.5 px-1 rounded-md text-xs font-semibold transition-all min-h-[4rem]',
									assignmentScheduleType === 'day'
										? 'bg-[#0D65AE]/10 text-[#0D65AE] ring-1 ring-[#0D65AE]/30'
										: 'text-gray-500 hover:bg-gray-50',
								]"
								@click="assignmentScheduleType = 'day'"
							>
								<svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
								</svg>
								<span>Día</span>
							</button>
							<button
								type="button"
								:aria-pressed="assignmentScheduleType === 'night'"
								:class="[
									'flex flex-col items-center justify-center gap-1 py-2.5 px-1 rounded-md text-xs font-semibold transition-all min-h-[4rem]',
									assignmentScheduleType === 'night'
										? 'bg-[#0D65AE]/10 text-[#0D65AE] ring-1 ring-[#0D65AE]/30'
										: 'text-gray-500 hover:bg-gray-50',
								]"
								@click="assignmentScheduleType = 'night'"
							>
								<svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
								</svg>
								<span>Noche</span>
							</button>
							<button
								type="button"
								:aria-pressed="assignmentScheduleType === 'travel'"
								:class="[
									'flex flex-col items-center justify-center gap-1 py-2.5 px-1 rounded-md text-xs font-semibold transition-all min-h-[4rem]',
									assignmentScheduleType === 'travel'
										? 'bg-[#0D65AE]/10 text-[#0D65AE] ring-1 ring-[#0D65AE]/30'
										: 'text-gray-500 hover:bg-gray-50',
								]"
								@click="assignmentScheduleType = 'travel'"
							>
								<svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.25 18.75a1.125 1.125 0 01-1.125-1.125v-9.75m10.5 10.875a1.125 1.125 0 01-1.125-1.125v-9.75M3.375 6.75h17.25c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125H3.375A1.125 1.125 0 012 17.625v-9.75c0-.621.504-1.125 1.125-1.125zM8.25 6.75V4.875c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125V6.75M12 12h.008v.008H12V12z" />
								</svg>
								<span>Travel</span>
							</button>
						</div>
						<p class="text-xs text-gray-500 mt-2">Se guarda con el inicio del servicio (independiente del reloj de sede).</p>
					</div>

					<!-- Start Service Button -->
					<button
						type="button"
						@click="handleStart"
						:disabled="actionLoading || cannotStartWithoutWebNfc"
						class="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-semibold text-white bg-[#0D65AE] rounded-lg hover:bg-[#0D65AE]/90 focus:ring-2 focus:ring-[#0D65AE] focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
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
						{{ startPrimaryLabel }}
					</button>
					<p
						v-if="nfcRequiredForStart && nfcSupported && !hasNfcCodeForStart"
						class="text-xs text-center text-gray-600 -mt-2"
					>
						Pulsa Iniciar para abrir el lector y acercar la etiqueta NFC del cliente.
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
	<!--  NFC START MODAL — lector / código antes de iniciar (NFC obligatorio)   -->
	<!-- ══════════════════════════════════════════════════════════════════════ -->
	<Teleport to="body">
		<Transition name="modal">
			<div
				v-if="showNfcStartModal"
				class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
				@click.self="closeNfcStartModal"
			>
				<div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
					<div class="flex items-center gap-3 mb-4">
						<div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
							<svg class="w-5 h-5 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
							</svg>
						</div>
						<div>
							<h3 class="text-base font-semibold text-gray-900">Lector NFC</h3>
							<p class="text-xs text-gray-500">
								Acerca la etiqueta física al teléfono. El código no se puede introducir a mano.
							</p>
						</div>
					</div>

					<div
						v-if="!nfcSupported"
						class="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-3 text-sm text-red-800"
					>
						Este dispositivo no puede leer NFC. Usa un móvil con Chrome (Android) u otro navegador compatible con Web NFC.
					</div>

					<div v-if="nfcVerified" class="flex items-center gap-2 mb-4 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
						<svg class="w-4 h-4 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
						</svg>
						<span class="text-sm font-medium text-green-800">Código listo para enviar al iniciar</span>
					</div>

					<div v-if="nfcError" class="flex items-center gap-2 mb-4 px-3 py-2 bg-red-50 border border-red-100 rounded-lg">
						<span class="text-sm text-red-700">{{ nfcError }}</span>
					</div>

					<div v-if="nfcSupported && !nfcVerified" class="mb-4">
						<button
							type="button"
							@click="handleNfcScan"
							:disabled="nfcScanning || actionLoading"
							class="w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-purple-600 rounded-xl hover:bg-purple-700 disabled:opacity-60 transition-all"
						>
							<svg v-if="nfcScanning" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
							</svg>
							<span>{{ nfcScanning ? 'Acerca la etiqueta al dispositivo…' : 'Abrir lector NFC' }}</span>
						</button>
						<p class="text-xs text-gray-500 mt-2 text-center">
							Chrome en Android muestra el diálogo del sistema al acercar la etiqueta.
						</p>
					</div>

					<div class="rounded-lg border border-gray-200 bg-gray-50 p-4 mb-4">
						<span class="block text-xs font-semibold text-gray-600 mb-2">Tipo de turno</span>
						<div class="grid grid-cols-3 gap-1.5 rounded-lg border border-gray-200 p-1 bg-white" role="group" aria-label="Tipo de turno">
							<button
								type="button"
								:class="[
									'flex flex-col items-center justify-center gap-1 py-2 px-0.5 rounded-md text-[11px] font-semibold transition-all min-h-[3.75rem]',
									assignmentScheduleType === 'day'
										? 'bg-[#0D65AE]/10 text-[#0D65AE] ring-1 ring-[#0D65AE]/30'
										: 'text-gray-500 hover:bg-gray-50',
								]"
								@click="assignmentScheduleType = 'day'"
							>
								<svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
								</svg>
								<span>Día</span>
							</button>
							<button
								type="button"
								:class="[
									'flex flex-col items-center justify-center gap-1 py-2 px-0.5 rounded-md text-[11px] font-semibold transition-all min-h-[3.75rem]',
									assignmentScheduleType === 'night'
										? 'bg-[#0D65AE]/10 text-[#0D65AE] ring-1 ring-[#0D65AE]/30'
										: 'text-gray-500 hover:bg-gray-50',
								]"
								@click="assignmentScheduleType = 'night'"
							>
								<svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
								</svg>
								<span>Noche</span>
							</button>
							<button
								type="button"
								:class="[
									'flex flex-col items-center justify-center gap-1 py-2 px-0.5 rounded-md text-[11px] font-semibold transition-all min-h-[3.75rem]',
									assignmentScheduleType === 'travel'
										? 'bg-[#0D65AE]/10 text-[#0D65AE] ring-1 ring-[#0D65AE]/30'
										: 'text-gray-500 hover:bg-gray-50',
								]"
								@click="assignmentScheduleType = 'travel'"
							>
								<svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.25 18.75a1.125 1.125 0 01-1.125-1.125v-9.75m10.5 10.875a1.125 1.125 0 01-1.125-1.125v-9.75M3.375 6.75h17.25c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125H3.375A1.125 1.125 0 012 17.625v-9.75c0-.621.504-1.125 1.125-1.125zM8.25 6.75V4.875c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125V6.75M12 12h.008v.008H12V12z" />
								</svg>
								<span>Travel</span>
							</button>
						</div>
					</div>

					<div class="flex flex-col-reverse sm:flex-row gap-3">
						<button
							type="button"
							@click="closeNfcStartModal"
							class="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
						>
							Cancelar
						</button>
						<button
							type="button"
							@click="confirmStartAfterNfc"
							:disabled="actionLoading || !nfcSupported || !hasNfcCodeForStart"
							class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-[#0D65AE] rounded-lg hover:bg-[#0D65AE]/90 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							<svg v-if="actionLoading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
							</svg>
							Iniciar servicio
						</button>
					</div>
				</div>
			</div>
		</Transition>
	</Teleport>

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
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
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

// NFC obligatorio al inicio: modal con lector
const showNfcStartModal = ref(false);
const nfcModalAutoLaunched = ref(false);

// NFC
const nfcSupported = 'NDEFReader' in window;
const nfcScanning = ref(false);
const nfcVerified = ref(false);
const nfcVerifiedCode = ref('');
const nfcError = ref('');

/** Turno declarado al iniciar el servicio (día / noche / travel) — se envía al API. */
const assignmentScheduleType = ref('day');

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
		sr?.serviceName ||
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
	if (c) {
		return c.name || c.fullName || c.full_name || c.email || 'Cliente';
	}
	if (sr?.customerName) return sr.customerName;
	return 'Cliente desconocido';
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

const startedScheduleType = computed(
	() =>
		currentAssignment.value?.startScheduleType ||
		currentAssignment.value?.start_schedule_type ||
		null,
);

const locationInfo = computed(() => {
	const sr = serviceRequest.value;
	return sr?.location || currentAssignment.value?.location || null;
});

const locationNfcCode = computed(() => {
	const loc = locationInfo.value;
	return (
		loc?.nfcCode ||
		loc?.nfc_code ||
		loc?.nfcTag ||
		loc?.code ||
		null
	);
});

/** NFC obligatorio si la ubicación tiene tag o la empresa lo exige (API). */
const nfcRequiredForStart = computed(() => {
	const a = currentAssignment.value;
	if (!a) return false;
	if (locationNfcCode.value) return true;
	const explicitFalse =
		a.nfcRequiredForStart === false || a.nfc_required_for_start === false;
	if (explicitFalse) return false;
	return true;
});

const showNfcStartSection = computed(
	() => nfcRequiredForStart.value || !!locationNfcCode.value,
);

/** Código NFC solo tras lectura física exitosa (Web NFC + verify). Sin entrada manual. */
const hasNfcCodeForStart = computed(
	() => !!(nfcVerified.value && String(nfcVerifiedCode.value || '').trim()),
);

/** Empresa exige NFC al inicio y este navegador no implementa Web NFC → no se puede iniciar. */
const cannotStartWithoutWebNfc = computed(
	() => nfcRequiredForStart.value && !nfcSupported,
);

const startPrimaryLabel = computed(() => {
	if (cannotStartWithoutWebNfc.value) return 'Inicio no disponible (sin NFC)';
	if (actionLoading.value) return 'Iniciando...';
	if (nfcRequiredForStart.value && !hasNfcCodeForStart.value && nfcSupported) {
		return 'Escanear NFC e iniciar';
	}
	return 'Iniciar Servicio';
});

// ── Timeline (alineado a API: assigned → accepted → in_progress → completed) ─
function assignmentWorkflowIndex(status) {
	if (status === 'assigned' || status === 'pending') return 0;
	if (status === 'accepted') return 1;
	if (status === 'in_progress') return 2;
	if (status === 'completed') return 3;
	return -1;
}

const isAwaitingEmployeeConfirm = computed(() => {
	const s = currentAssignment.value?.status;
	return s === 'assigned' || s === 'pending';
});

const timeline = computed(() => {
	const status = currentAssignment.value?.status;
	const currentIdx = assignmentWorkflowIndex(status);
	const steps = [
		{ key: 'confirm', label: 'Por confirmar' },
		{ key: 'accepted', label: 'Aceptada' },
		{ key: 'in_progress', label: 'En curso' },
		{ key: 'completed', label: 'Completada' },
	];
	return steps.map((step, idx) => ({
		...step,
		done: currentIdx >= 0 && idx < currentIdx,
		active: currentIdx >= 0 && idx === currentIdx,
	}));
});

// ── Status display helpers ────────────────────────────────────────────────────
const statusLabels = {
	assigned: 'Por confirmar',
	pending: 'Por confirmar',
	accepted: 'Aceptada',
	in_progress: 'En curso',
	completed: 'Completada',
	rejected: 'Rechazada',
	cancelled: 'Cancelada',
};

const statusClasses = {
	assigned: 'bg-yellow-100 text-yellow-800',
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

function resolveNfcCodeForApi() {
	if (nfcVerified.value && nfcVerifiedCode.value) {
		return String(nfcVerifiedCode.value).trim();
	}
	return undefined;
}

function closeNfcStartModal() {
	showNfcStartModal.value = false;
}

/** POST start con GPS; devuelve si el servicio pasó a in_progress. */
async function runStartService() {
	actionLoading.value = true;
	try {
		let coords = currentCoords.value;
		if (!coords) {
			try {
				coords = await getCurrentPosition();
				currentCoords.value = coords;
			} catch {
				coords = { latitude: 0, longitude: 0 };
			}
		}
		const result = await startAssignment(props.id, coords, {
			nfcCode: resolveNfcCodeForApi(),
			scheduleType: assignmentScheduleType.value,
		});
		if (result.success) {
			await loadAssignment();
			return true;
		}
		return false;
	} finally {
		actionLoading.value = false;
	}
}

async function handleStart() {
	if (cannotStartWithoutWebNfc.value) return;
	if (nfcRequiredForStart.value && !hasNfcCodeForStart.value) {
		if (!nfcSupported) return;
		showNfcStartModal.value = true;
		return;
	}
	const ok = await runStartService();
	if (ok) beginAutoTracking();
}

async function confirmStartAfterNfc() {
	if (!hasNfcCodeForStart.value) return;
	const ok = await runStartService();
	if (ok) {
		showNfcStartModal.value = false;
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

watch(showNfcStartModal, async (open) => {
	if (!open) {
		nfcModalAutoLaunched.value = false;
		return;
	}
	await nextTick();
	if (
		nfcModalAutoLaunched.value ||
		!nfcSupported ||
		nfcVerified.value ||
		hasNfcCodeForStart.value
	) {
		return;
	}
	nfcModalAutoLaunched.value = true;
	handleNfcScan();
});

watch(
	() => props.id,
	() => {
		assignmentScheduleType.value = 'day';
	},
);

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
