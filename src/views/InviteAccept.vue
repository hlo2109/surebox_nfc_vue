<template>
	<div class="w-full max-w-lg mx-auto space-y-6">
		<div v-if="loading" class="flex flex-col items-center justify-center py-16 gap-4 text-gray-600">
			<div class="animate-spin h-10 w-10 border-2 border-[#0D65AE] border-t-transparent rounded-full" />
			<p class="text-sm font-medium">Validando invitación…</p>
		</div>

		<div
			v-else-if="errorMessage"
			class="rounded-xl border border-red-200 bg-red-50 p-6 text-red-800 space-y-3"
		>
			<h1 class="text-lg font-semibold">No se pudo usar la invitación</h1>
			<p class="text-sm leading-relaxed">{{ errorMessage }}</p>
			<router-link
				to="/login"
				class="inline-flex text-sm font-semibold text-[#0D65AE] hover:underline"
			>
				Ir a iniciar sesión
			</router-link>
		</div>

		<div v-else-if="invitation" class="space-y-6">
			<div>
				<h1 class="text-2xl font-bold text-gray-900">Invitación a SureBox</h1>
				<p class="mt-2 text-gray-600 text-sm leading-relaxed">
					Te han invitado a unirte a
					<span class="font-semibold text-gray-900">{{ invitation.companyName }}</span>
					como
					<span class="font-semibold capitalize">{{ roleLabel }}</span>.
					Correo de la invitación:
					<span class="font-mono text-gray-800">{{ invitation.email }}</span>
				</p>
			</div>

			<!-- Sesión distinta al correo de la invitación -->
			<div
				v-if="loggedInWrongUser"
				class="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900 text-sm space-y-3"
			>
				<p>
					Hay una sesión activa con otro correo. Cierra sesión e inicia con
					<strong>{{ invitation.email }}</strong> para aceptar, o continúa con tu cuenta actual
					(sin unirte con este enlace).
				</p>
				<button
					type="button"
					class="text-sm font-semibold text-[#0D65AE] hover:underline"
					@click="logoutAndGoLogin"
				>
					Cerrar sesión e ir a iniciar sesión
				</button>
			</div>

			<!-- Mismo usuario: aceptar ya -->
			<div v-else-if="loggedInMatchingUser" class="space-y-4">
				<p class="text-sm text-gray-600">
					Estás conectado como el invitado. Pulsa para unirte a la empresa.
				</p>
				<button
					type="button"
					:disabled="accepting"
					class="w-full py-3.5 rounded-xl bg-[#0D65AE] text-white font-semibold hover:bg-[#0a4f87] disabled:opacity-50"
					@click="acceptAndGo"
				>
					{{ accepting ? 'Uniendo…' : 'Aceptar e ir a mi empresa' }}
				</button>
			</div>

			<!-- Sin sesión: redirigimos automáticamente a login o registro -->
			<div v-else-if="redirecting" class="text-sm text-gray-600 text-center py-8">
				Redirigiendo a {{ invitation.userRegistered ? 'inicio de sesión' : 'registro' }}…
			</div>
		</div>
	</div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getInvitation, acceptInvitation } from '@/api/auth.api';
import { useAuthStore } from '@/stores/auth.store';
import { useAuth } from '@/composables/useAuth';
import { useToast } from '@/composables/useToast';
import { canManageCompanyWorkspace } from '@/utils/companyContext';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const { getCurrentUser } = useAuth();
const toast = useToast();

const loading = ref(true);
const accepting = ref(false);
const redirecting = ref(false);
const errorMessage = ref('');
const invitation = ref(null);

const roleLabel = computed(() =>
	invitation.value?.roleInCompany === 'admin' ? 'administrador' : 'empleado',
);

function sameEmail(a, b) {
	if (!a || !b) return false;
	return String(a).trim().toLowerCase() === String(b).trim().toLowerCase();
}

const loggedInMatchingUser = computed(() => {
	const u = authStore.state.user;
	if (!u?.email || !invitation.value?.email) return false;
	return sameEmail(u.email, invitation.value.email);
});

const loggedInWrongUser = computed(() => {
	const u = authStore.state.user;
	if (!u?.email || !invitation.value?.email) return false;
	return !sameEmail(u.email, invitation.value.email);
});

function inviteQuery(token) {
	const e = encodeURIComponent(invitation.value?.email || '');
	return `/login?inviteToken=${encodeURIComponent(token)}&email=${e}`;
}

function registerQuery(token) {
	const e = encodeURIComponent(invitation.value?.email || '');
	return `/register?inviteToken=${encodeURIComponent(token)}&email=${e}`;
}

function logoutAndGoLogin() {
	authStore.logout();
	const t = route.query.token;
	if (typeof t === 'string' && t) {
		router.replace(inviteQuery(t));
	} else {
		router.replace('/login');
	}
}

async function acceptAndGo() {
	const t = route.query.token;
	if (typeof t !== 'string' || !t) return;
	accepting.value = true;
	try {
		const res = await acceptInvitation(t, {});
		if (res?.success === false) {
			throw new Error(res?.message || 'No se pudo aceptar la invitación.');
		}
		toast.showSuccess(
			res?.data?.message || res?.message || 'Te has unido a la empresa.',
		);
		await getCurrentUser().catch(() => {});
		const u = authStore.state.user;
		router.replace(canManageCompanyWorkspace(u) ? '/my-company' : '/');
	} catch (e) {
		const msg = e?.message || '';
		if (msg.toLowerCase().includes('already a member')) {
			toast.showInfo('Ya formas parte de esta empresa.');
			await getCurrentUser().catch(() => {});
			const u = authStore.state.user;
			router.replace(canManageCompanyWorkspace(u) ? '/my-company' : '/');
		} else {
			toast.showError(msg || 'No se pudo aceptar la invitación.');
		}
	} finally {
		accepting.value = false;
	}
}

onMounted(async () => {
	const token = route.query.token;
	if (typeof token !== 'string' || !token.trim()) {
		loading.value = false;
		errorMessage.value = 'Falta el token de invitación en el enlace.';
		return;
	}

	try {
		const res = await getInvitation(token.trim());
		const data = res?.data ?? res;
		if (!data?.email) {
			throw new Error(res?.message || 'Respuesta inválida del servidor.');
		}
		invitation.value = {
			email: data.email,
			companyName: data.companyName,
			roleInCompany: data.roleInCompany,
			userRegistered: !!data.userRegistered,
		};

		if (loggedInMatchingUser.value) {
			loading.value = false;
			return;
		}

		if (loggedInWrongUser.value) {
			loading.value = false;
			return;
		}

		redirecting.value = true;
		if (invitation.value.userRegistered) {
			await router.replace(inviteQuery(token.trim()));
		} else {
			await router.replace(registerQuery(token.trim()));
		}
	} catch (e) {
		errorMessage.value =
			e?.message ||
			'La invitación no es válida, expiró o ya fue utilizada.';
	} finally {
		loading.value = false;
		redirecting.value = false;
	}
});
</script>
