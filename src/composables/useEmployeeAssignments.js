import { ref, computed } from 'vue';
import * as serviceRequestsApi from '@/api/serviceRequests.api';
import { useToast } from './useToast';

/**
 * Employee Assignments Composable
 * Encapsulates the full employee assignment workflow with local reactive state.
 * Does NOT use a global store — all state is scoped to the composable instance.
 */
export const useEmployeeAssignments = () => {
	const toast = useToast();

	// ==================== STATE ====================

	/** @type {import('vue').Ref<Array>} List of employee assignments */
	const assignments = ref([]);

	/** @type {import('vue').Ref<object|null>} Currently active/selected assignment */
	const currentAssignment = ref(null);

	/** @type {import('vue').Ref<boolean>} Global loading flag */
	const loading = ref(false);

	/** @type {import('vue').Ref<string|null>} Last error message */
	const error = ref(null);

	/** @type {import('vue').Ref<number|null>} setInterval ID for auto-tracking (null when inactive) */
	const trackingInterval = ref(null);

	// ==================== COMPUTED ====================

	/** Assignments waiting for employee to accept (API: `assigned`; legacy `pending`) */
	const pendingAssignments = computed(() =>
		assignments.value.filter(
			(a) => a.status === 'pending' || a.status === 'assigned',
		),
	);

	/** Assignments the employee has accepted but not yet started */
	const acceptedAssignments = computed(() =>
		assignments.value.filter((a) => a.status === 'accepted'),
	);

	/** Assignments currently being executed */
	const inProgressAssignments = computed(() =>
		assignments.value.filter((a) => a.status === 'in_progress'),
	);

	/** Assignments that have been fully completed */
	const completedAssignments = computed(() =>
		assignments.value.filter((a) => a.status === 'completed'),
	);

	// ==================== PRIVATE HELPERS ====================

	/**
	 * Replace a single assignment in the local list by uuid or internal id.
	 * If it is not found the list is left unchanged.
	 * @param {object} updated - The updated assignment object
	 */
	const _patchAssignmentInList = (updated) => {
		if (!updated || typeof updated !== 'object') return;
		const idx = assignments.value.findIndex(
			(a) =>
				(updated.uuid != null && a.uuid === updated.uuid) ||
				(updated.id != null && a.id === updated.id),
		);
		if (idx !== -1) {
			assignments.value[idx] = updated;
		}
	};

	const _isCurrentAssignmentRoute = (assignmentId) => {
		const cur = currentAssignment.value;
		if (!cur || assignmentId == null) return false;
		if (cur.uuid != null && String(cur.uuid) === String(assignmentId)) {
			return true;
		}
		return String(cur.id) === String(assignmentId);
	};

	/**
	 * Obtain the current GPS position wrapped in a Promise.
	 * @returns {Promise<{ latitude: number, longitude: number, accuracy: number, timestamp: string }>}
	 */
	const _getCurrentPosition = () =>
		new Promise((resolve, reject) => {
			if (!navigator.geolocation) {
				reject(new Error('La geolocalización no está disponible en este navegador'));
				return;
			}
			navigator.geolocation.getCurrentPosition(
				(pos) =>
					resolve({
						latitude: pos.coords.latitude,
						longitude: pos.coords.longitude,
						accuracy: pos.coords.accuracy,
						timestamp: new Date().toISOString(),
					}),
				(err) => reject(err),
				{ enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
			);
		});

	// ==================== FUNCTIONS ====================

	/**
	 * Fetch a paginated list of my employee assignments.
	 * @param {object} [params] - Query parameters
	 * @param {number} [params.page]   - Page number
	 * @param {number} [params.limit]  - Items per page
	 * @param {string} [params.status] - Status filter
	 * @returns {Promise<{ success: boolean, data?: Array, pagination?: object, error?: string }>}
	 */
	const fetchMyAssignments = async (params = {}) => {
		try {
			loading.value = true;
			error.value = null;

			const response = await serviceRequestsApi.getMyAssignments(params);

			if (response.success !== false) {
				const payload = response.data ?? response;
				// Normalise to array regardless of envelope shape
				assignments.value = Array.isArray(payload)
					? payload
					: (payload.items ?? payload.assignments ?? []);
				return { success: true, data: assignments.value, pagination: response.pagination };
			}

			throw new Error(response.message || 'Error al cargar las asignaciones');
		} catch (err) {
			const msg = err.message || 'Error al cargar las asignaciones';
			error.value = msg;
			toast.showError(msg);
			return { success: false, error: msg };
		} finally {
			loading.value = false;
		}
	};

	/**
	 * Fetch a single assignment by UUID.
	 * @param {string} assignmentId - Assignment UUID
	 * @param {{ quiet?: boolean, setCurrent?: boolean }} [options] - quiet: no full-page loading; setCurrent: update `currentAssignment` (default true)
	 * @returns {Promise<{ success: boolean, data?: object, error?: string }>}
	 */
	const fetchMyAssignment = async (assignmentId, options = {}) => {
		const { quiet = false, setCurrent = true } = options;
		let toggledLoading = false;
		try {
			if (!quiet) {
				loading.value = true;
				toggledLoading = true;
				error.value = null;
			}

			const response = await serviceRequestsApi.getMyAssignment(assignmentId);

			if (response.success !== false) {
				const data = response.data ?? response;
				_patchAssignmentInList(data);
				if (setCurrent) {
					currentAssignment.value = data;
				}
				return { success: true, data };
			}

			throw new Error(response.message || 'Error al cargar la asignación');
		} catch (err) {
			const msg = err.message || 'Error al cargar la asignación';
			error.value = msg;
			toast.showError(msg);
			return { success: false, error: msg };
		} finally {
			if (toggledLoading) {
				loading.value = false;
			}
		}
	};

	/**
	 * Accept an assignment.
	 * Updates the assignment in the local list and in `currentAssignment` if applicable.
	 * @param {string} assignmentId - Assignment UUID
	 * @returns {Promise<{ success: boolean, data?: object, error?: string }>}
	 */
	const acceptAssignment = async (assignmentId) => {
		try {
			loading.value = true;
			error.value = null;

			const response = await serviceRequestsApi.acceptAssignment(assignmentId);

			if (response.success !== false) {
				const reloaded = await fetchMyAssignment(assignmentId, {
					quiet: true,
					setCurrent: _isCurrentAssignmentRoute(assignmentId),
				});
				toast.showSuccess('Asignación aceptada correctamente');
				return { success: true, data: reloaded.data };
			}

			throw new Error(response.message || 'Error al aceptar la asignación');
		} catch (err) {
			const msg = err.message || 'Error al aceptar la asignación';
			error.value = msg;
			toast.showError(msg);
			return { success: false, error: msg };
		} finally {
			loading.value = false;
		}
	};

	/**
	 * Reject an assignment with a mandatory reason.
	 * Updates the assignment in the local list and in `currentAssignment` if applicable.
	 * @param {string} assignmentId - Assignment UUID
	 * @param {string} reason        - Rejection reason
	 * @returns {Promise<{ success: boolean, data?: object, error?: string }>}
	 */
	const rejectAssignment = async (assignmentId, reason) => {
		try {
			loading.value = true;
			error.value = null;

			const response = await serviceRequestsApi.rejectAssignment(assignmentId, reason);

			if (response.success !== false) {
				const reloaded = await fetchMyAssignment(assignmentId, {
					quiet: true,
					setCurrent: _isCurrentAssignmentRoute(assignmentId),
				});
				toast.showSuccess('Asignación rechazada');
				return { success: true, data: reloaded.data };
			}

			throw new Error(response.message || 'Error al rechazar la asignación');
		} catch (err) {
			const msg = err.message || 'Error al rechazar la asignación';
			error.value = msg;
			toast.showError(msg);
			return { success: false, error: msg };
		} finally {
			loading.value = false;
		}
	};

	/**
	 * Verify an NFC code against an assignment.
	 * @param {string} assignmentId                              - Assignment UUID
	 * @param {string} nfcCode                                   - NFC code read from the tag
	 * @param {{ latitude: number, longitude: number }} coords   - Current GPS coordinates
	 * @returns {Promise<{ success: boolean, verified?: boolean, message?: string, data?: object, error?: string }>}
	 */
	const verifyNfc = async (assignmentId, nfcCode, coords) => {
		try {
			loading.value = true;
			error.value = null;

			const response = await serviceRequestsApi.verifyAssignmentNfc(assignmentId, {
				nfcCode,
				latitude: coords.latitude,
				longitude: coords.longitude,
			});

			if (response.success !== false) {
				const data = response.data ?? response;
				// The server may explicitly return verified: false (wrong code) without throwing
				const verified = data.verified ?? true;
				if (verified) {
					toast.showSuccess('NFC verificado correctamente');
				}
				return {
					success: true,
					verified,
					message: data.message ?? response.message ?? null,
					data,
				};
			}

			throw new Error(response.message || 'Error al verificar el NFC');
		} catch (err) {
			const msg = err.message || 'Error al verificar el NFC';
			error.value = msg;
			toast.showError(msg);
			return { success: false, verified: false, error: msg };
		} finally {
			loading.value = false;
		}
	};

	/**
	 * Start an assignment (transition to in_progress).
	 * Stores the updated assignment as `currentAssignment` and patches the list.
	 * @param {string} assignmentId                            - Assignment UUID
	 * @param {{ latitude: number, longitude: number }} coords - Current GPS coordinates
	 * @param {string|{ nfcCode?: string, scheduleType?: 'day'|'night'|'travel' }} [nfcCodeOrOptions] - Legacy: NFC string; preferred: options object
	 * @returns {Promise<{ success: boolean, data?: object, error?: string }>}
	 */
	const startAssignment = async (assignmentId, coords, nfcCodeOrOptions) => {
		try {
			loading.value = true;
			error.value = null;

			let nfcCode;
			let scheduleType = 'day';
			if (nfcCodeOrOptions && typeof nfcCodeOrOptions === 'object') {
				nfcCode = nfcCodeOrOptions.nfcCode;
				if (nfcCodeOrOptions.scheduleType) {
					scheduleType = nfcCodeOrOptions.scheduleType;
				}
			} else {
				nfcCode = nfcCodeOrOptions;
			}

			const payload = {
				lat: coords.latitude,
				lng: coords.longitude,
				scheduleType,
				...(nfcCode !== undefined && nfcCode !== null && nfcCode !== ''
					? { nfcCode }
					: {}),
			};

			const response = await serviceRequestsApi.startAssignment(assignmentId, payload);

			if (response.success !== false) {
				const reloaded = await fetchMyAssignment(assignmentId, {
					quiet: true,
					setCurrent: _isCurrentAssignmentRoute(assignmentId),
				});
				toast.showSuccess('Servicio iniciado');
				return { success: true, data: reloaded.data };
			}

			throw new Error(response.message || 'Error al iniciar el servicio');
		} catch (err) {
			const msg = err.message || 'Error al iniciar el servicio';
			error.value = msg;
			toast.showError(msg);
			return { success: false, error: msg };
		} finally {
			loading.value = false;
		}
	};

	/**
	 * Complete an assignment (transition to completed).
	 * Stores the updated assignment as `currentAssignment` and patches the list.
	 * @param {string} assignmentId                            - Assignment UUID
	 * @param {{ latitude: number, longitude: number }} coords - Current GPS coordinates
	 * @param {string} [notes]                                 - Optional completion notes
	 * @returns {Promise<{ success: boolean, data?: object, error?: string }>}
	 */
	const completeAssignment = async (assignmentId, coords, notes) => {
		try {
			loading.value = true;
			error.value = null;

			const payload = {
				lat: coords.latitude,
				lng: coords.longitude,
				...(notes !== undefined && { notes }),
			};

			const response = await serviceRequestsApi.completeAssignment(assignmentId, payload);

			if (response.success !== false) {
				const reloaded = await fetchMyAssignment(assignmentId, {
					quiet: true,
					setCurrent: _isCurrentAssignmentRoute(assignmentId),
				});
				toast.showSuccess('¡Servicio completado!');
				return { success: true, data: reloaded.data };
			}

			throw new Error(response.message || 'Error al completar el servicio');
		} catch (err) {
			const msg = err.message || 'Error al completar el servicio';
			error.value = msg;
			toast.showError(msg);
			return { success: false, error: msg };
		} finally {
			loading.value = false;
		}
	};

	/**
	 * Record a single GPS tracking point — SILENT (no toast, no global loading flag).
	 * Intended to be called frequently; errors are only logged to the console.
	 * @param {string} assignmentId  - Assignment UUID
	 * @param {object} trackingData  - Tracking payload
	 * @param {number}  trackingData.latitude   - Latitude
	 * @param {number}  trackingData.longitude  - Longitude
	 * @param {number}  [trackingData.accuracy]  - GPS accuracy in metres
	 * @param {string}  [trackingData.timestamp] - ISO timestamp (omit to let server set it)
	 * @param {string}  [trackingData.eventType] - 'location_update' | 'check_in' | 'check_out'
	 * @returns {Promise<{ success: boolean, data?: object, error?: string }>}
	 */
	const recordTracking = async (assignmentId, trackingData) => {
		try {
			const lat = trackingData.lat ?? trackingData.latitude;
			const lng = trackingData.lng ?? trackingData.longitude;
			const body = {
				lat,
				lng,
				...(trackingData.eventType != null && { eventType: trackingData.eventType }),
				...(trackingData.accuracy != null && { accuracy: trackingData.accuracy }),
				...(trackingData.timestamp != null && { timestamp: trackingData.timestamp }),
			};
			const response = await serviceRequestsApi.recordAssignmentTracking(
				assignmentId,
				body,
			);

			if (response.success !== false) {
				return { success: true, data: response.data ?? response };
			}

			throw new Error(response.message || 'Error al registrar el tracking');
		} catch (err) {
			const msg = err.message || 'Error al registrar el tracking';
			// Intentionally silent — avoid toast spam during continuous tracking
			console.error('[useEmployeeAssignments] recordTracking error:', msg);
			return { success: false, error: msg };
		}
	};

	/**
	 * Start continuous GPS auto-tracking for an assignment.
	 * Captures position immediately and then on every `intervalMs` milliseconds.
	 * The interval ID is stored in `trackingInterval` so the caller can monitor it.
	 *
	 * @param {string} assignmentId         - Assignment UUID
	 * @param {number} [intervalMs=30000]   - Polling interval in milliseconds (default: 30 s)
	 * @returns {{ stop: () => void }} Control object — call stop() to cancel tracking
	 */
	const startAutoTracking = (assignmentId, intervalMs = 30000) => {
		// Capture one position and forward it to the API
		const _track = async () => {
			try {
				const coords = await _getCurrentPosition();
				await recordTracking(assignmentId, coords);
			} catch (err) {
				console.error('[useEmployeeAssignments] auto-tracking cycle error:', err);
			}
		};

		// Run once immediately, then on schedule
		_track();
		trackingInterval.value = setInterval(_track, intervalMs);

		/**
		 * Stop the auto-tracking interval.
		 * Safe to call multiple times.
		 */
		const stop = () => {
			if (trackingInterval.value !== null) {
				clearInterval(trackingInterval.value);
				trackingInterval.value = null;
			}
		};

		return { stop };
	};

	// ==================== PUBLIC API ====================

	return {
		// ── State ──────────────────────────────────────────
		assignments,
		currentAssignment,
		loading,
		error,
		trackingInterval,

		// ── Computed ───────────────────────────────────────
		pendingAssignments,
		acceptedAssignments,
		inProgressAssignments,
		completedAssignments,

		// ── Functions ──────────────────────────────────────
		fetchMyAssignments,
		fetchMyAssignment,
		acceptAssignment,
		rejectAssignment,
		verifyNfc,
		startAssignment,
		completeAssignment,
		recordTracking,
		startAutoTracking,
	};
};

export default useEmployeeAssignments;
