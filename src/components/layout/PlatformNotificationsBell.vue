<template>
	<div class="relative" ref="rootRef">
		<button
			type="button"
			class="relative flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
			:aria-expanded="open"
			aria-haspopup="true"
			@click="toggleOpen"
		>
			<svg
				class="w-5 h-5 shrink-0"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
				/>
			</svg>
			<span class="hidden md:inline">Notificaciones</span>
			<span
				v-if="unreadCount > 0"
				class="absolute -top-0.5 -right-0.5 min-w-[1.125rem] h-[1.125rem] px-1 flex items-center justify-center text-[10px] font-semibold text-white bg-[#0D65AE] rounded-full"
			>
				{{ unreadCount > 99 ? '99+' : unreadCount }}
			</span>
		</button>

		<div
			v-if="open"
			class="absolute right-0 mt-2 w-[min(100vw-1.5rem,22rem)] max-h-[min(70vh,28rem)] flex flex-col bg-white border border-gray-200 rounded-lg shadow-lg z-[60] overflow-hidden"
		>
			<div
				class="flex items-center justify-between gap-2 px-3 py-2 border-b border-gray-100 bg-gray-50"
			>
				<span class="text-xs font-semibold text-gray-700 uppercase">
					Actividad
				</span>
				<button
					v-if="permissionHint"
					type="button"
					class="text-xs font-medium text-[#0D65AE] hover:underline shrink-0"
					@click="requestBrowserPermission"
				>
					Activar en el navegador
				</button>
			</div>

			<div class="overflow-y-auto flex-1">
				<div v-if="loading && !items.length" class="p-6 text-center text-sm text-gray-500">
					Cargando…
				</div>
				<p
					v-else-if="!items.length"
					class="p-6 text-center text-sm text-gray-500"
				>
					Sin notificaciones recientes.
				</p>
				<ul v-else class="divide-y divide-gray-100">
					<li v-for="n in items" :key="n.id">
						<button
							type="button"
							class="w-full text-left px-3 py-2.5 hover:bg-gray-50 transition-colors"
							@click="onSelect(n)"
						>
							<p class="text-sm font-medium text-gray-900 leading-snug">
								{{ n.title }}
							</p>
							<p
								v-if="n.body"
								class="text-xs text-gray-600 mt-0.5 line-clamp-2"
							>
								{{ n.body }}
							</p>
							<p class="text-[10px] text-gray-400 mt-1">
								{{ formatWhen(n.createdAt) }}
							</p>
						</button>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRouter } from 'vue-router';
import { getAccessToken } from '@/utils/storage';
import { usePlatformNotifications } from '@/composables/usePlatformNotifications';
import { useAuthStore } from '@/stores/auth.store';

const router = useRouter();
const authStore = useAuthStore();
const {
	items,
	unreadCount,
	loading,
	markAllVisibleRead,
	navigateFromPayload,
	start,
	stop,
	refreshFull,
} = usePlatformNotifications(router);

const open = ref(false);
const rootRef = ref(null);

const permissionHint = computed(() => {
	if (typeof window === 'undefined' || !('Notification' in window)) {
		return false;
	}
	return Notification.permission === 'default';
});

function formatWhen(iso) {
	if (!iso) {
		return '';
	}
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) {
		return '';
	}
	const now = Date.now();
	const diff = now - d.getTime();
	if (diff < 60_000) {
		return 'Hace un momento';
	}
	if (diff < 3600_000) {
		return `Hace ${Math.floor(diff / 60_000)} min`;
	}
	if (diff < 86400_000) {
		return `Hace ${Math.floor(diff / 3600_000)} h`;
	}
	return d.toLocaleString();
}

async function toggleOpen() {
	open.value = !open.value;
	if (open.value) {
		await refreshFull();
		await markAllVisibleRead();
	}
}

function onSelect(n) {
	navigateFromPayload(n.payload);
	open.value = false;
}

function requestBrowserPermission() {
	if (!('Notification' in window)) {
		return;
	}
	Notification.requestPermission().catch(() => {});
}

function onDocClick(e) {
	const el = rootRef.value;
	if (!el || !open.value) {
		return;
	}
	if (!el.contains(e.target)) {
		open.value = false;
	}
}

// Misma sesión puede cambiar de usuario (logout/login) sin recargar: el feed debe alinearse al JWT / usuario actual.
watch(
	() => [authStore.state.user?.id, !!authStore.state.accessToken],
	() => {
		stop();
		if (getAccessToken() && authStore.state.user?.id != null) {
			start();
		}
	},
	{ immediate: true },
);

onMounted(() => {
	document.addEventListener('click', onDocClick);
});

onBeforeUnmount(() => {
	stop();
	document.removeEventListener('click', onDocClick);
});
</script>
