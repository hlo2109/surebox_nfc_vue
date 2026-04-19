import { ref } from 'vue';
import { getAccessToken } from '@/utils/storage';
import {
	fetchPlatformNotifications,
	markPlatformNotificationsRead,
} from '@/api/platformNotifications.api';

const POLL_MS = 22000;

function readBrowserPushEnabled() {
	try {
		const raw = localStorage.getItem('userSettings');
		if (!raw) {
			return true;
		}
		const p = JSON.parse(raw);
		return p?.notifications?.pushEnabled !== false;
	} catch {
		return true;
	}
}

function mergeByIdDesc(existing, incoming) {
	const map = new Map();
	for (const n of existing) {
		map.set(n.id, n);
	}
	for (const n of incoming) {
		map.set(n.id, n);
	}
	return [...map.values()].sort((a, b) => b.id - a.id);
}

function maxId(items) {
	if (!items.length) {
		return 0;
	}
	return Math.max(...items.map((n) => n.id));
}

/**
 * Feed de notificaciones de plataforma (polling + opcional Notification API).
 * @param {import('vue-router').Router} router
 */
export function usePlatformNotifications(router) {
	const items = ref([]);
	const unreadCount = ref(0);
	const loading = ref(false);
	let pollTimer = null;

	function showDesktopIfNeeded(newRows) {
		if (!newRows.length || typeof window === 'undefined') {
			return;
		}
		if (!('Notification' in window)) {
			return;
		}
		if (Notification.permission !== 'granted') {
			return;
		}
		if (!readBrowserPushEnabled()) {
			return;
		}
		const latest = newRows.reduce((a, b) => (a.id > b.id ? a : b));
		try {
			// tag evita apilar muchas notificaciones del mismo evento
			const n = new Notification(latest.title || 'SureBox', {
				body: latest.body || '',
				tag: `surebox-pn-${latest.id}`,
			});
			n.onclick = () => {
				window.focus();
				n.close();
				if (latest.payload?.router) {
					router.push(latest.payload.router).catch(() => {});
				}
			};
		} catch {
			// ignore
		}
	}

	async function refreshFull() {
		if (!getAccessToken()) {
			return;
		}
		loading.value = true;
		try {
			const { items: list, unreadCount: u } =
				await fetchPlatformNotifications({ limit: 50 });
			items.value = [...list].sort((a, b) => b.id - a.id);
			unreadCount.value = u;
		} finally {
			loading.value = false;
		}
	}

	async function pollIncremental() {
		if (!getAccessToken()) {
			return;
		}
		try {
			if (!items.value.length) {
				await refreshFull();
				return;
			}
			const cursor = maxId(items.value);
			const { items: delta, unreadCount: u } =
				await fetchPlatformNotifications({
					after: cursor,
					limit: 80,
				});
			unreadCount.value = u;
			if (delta.length) {
				showDesktopIfNeeded(delta);
				items.value = mergeByIdDesc(items.value, delta);
			}
		} catch (e) {
			if (import.meta.env.DEV) {
				console.warn('[usePlatformNotifications] poll', e);
			}
		}
	}

	async function markAllVisibleRead() {
		const top = items.value[0]?.id;
		if (!top || !getAccessToken()) {
			return;
		}
		const { unreadCount: u } = await markPlatformNotificationsRead(top);
		unreadCount.value = u;
	}

	function navigateFromPayload(payload) {
		if (!payload?.router) {
			return;
		}
		router.push(payload.router).catch(() => {});
	}

	function start() {
		stop();
		if (!getAccessToken()) {
			return;
		}
		void refreshFull();
		pollTimer = window.setInterval(() => {
			void pollIncremental();
		}, POLL_MS);
	}

	function stop() {
		if (pollTimer != null) {
			clearInterval(pollTimer);
			pollTimer = null;
		}
	}

	return {
		items,
		unreadCount,
		loading,
		refreshFull,
		pollIncremental,
		markAllVisibleRead,
		navigateFromPayload,
		start,
		stop,
	};
}
