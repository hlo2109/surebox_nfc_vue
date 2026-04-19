<template>
	<CustomerDashboard v-if="!hasCompany" :userName="userName" />
	<CompanyDashboard v-else :userName="userName" />
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";
import { getAccessToken } from "@/utils/storage";
import CustomerDashboard from "./CustomerDashboard.vue";
import CompanyDashboard from "./CompanyDashboard.vue";

const router = useRouter();
const authStore = useAuthStore();

// Redirect to login if no token
if (!getAccessToken()) {
	router.push("/login");
}

const hasCompany = authStore.hasCompany;

const userName = computed(() => {
	const user = authStore.state.user;
	return user?.name ?? user?.email?.split("@")[0] ?? "User";
});
</script>
