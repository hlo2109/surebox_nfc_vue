<template>
	<!-- Navbar start -->
	<nav id="navbar"
		class="sticky top-0 z-40 flex w-full flex-row justify-end bg-primary-500 px-4 sm:justify-between items-center">
		<!-- <ul class="breadcrumb hidden flex-row items-center py-4 text-lg text-white sm:flex">
      <li class="inline">
        <router-link to="/">Main</router-link>
      </li>
      <li class="inline">
        <span>Homepage</span>
      </li>
    </ul> -->
		<h3
			class="sticky top-0 z-40 flex w-full flex-row  bg-primary-500 px-4 sm:justify-between text-white font-black text-2xl">
			<router-link to="/">Surebox</router-link>
		</h3>
		<button @click="toggleSidebar" type="button" class="py-4 text-2xl text-white hover:text-gray-200">
			<svg v-if="!sidebarOpen" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
				stroke-width="1.5" stroke="currentColor" class="h-8 w-8">
				<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
			</svg>
			<svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
				stroke="currentColor" class="h-8 w-8">
				<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
			</svg>
		</button>
	</nav>
	<!-- Navbar end -->

	<!-- Sidebar start-->
	<div id="containerSidebar" class="z-40 flex min-h-screen overflow-hidden bg-gray-100">
		<div class="navbar-menu relative z-40">
			<nav id="sidebar"
				:class="['fixed left-0 bottom-0 flex w-full flex-col overflow-y-auto bg-primary-500 pt-6 pb-8 sm:max-w-xs lg:w-80', sidebarOpen ? 'show translate-x-0' : '-translate-x-full']"
				style="top: 63px;">
				<!-- one category / navigation group -->
				<div class="px-4 pb-6">
					<h3 class="mb-2 text-xs   uppercase text-white font-black">Main</h3>
					<nav id="sidebar"
						:class="['fixed left-0 bottom-0 flex w-3/4 flex-col overflow-y-auto bg-primary-500 pt-6 pb-8 sm:max-w-xs lg:w-80', sidebarOpen ? 'show translate-x-0' : '-translate-x-full']"
						style="top: 39px;">
						<ul class="mb-8 text-sm font-medium">
							<li>
								<router-link
									:class="['flex items-center rounded py-3 pl-3 pr-4 text-gray-50 hover:bg-primary-200', route.path === '/' ? 'active' : '']"
									to="/" @click="sidebarOpen = false">
									<span class="select-none">Homepage</span>
								</router-link>
							</li>
							<li>
								<router-link
									:class="['flex items-center rounded py-3 pl-3 pr-4 text-gray-50 hover:bg-primary-200', route.path === '/delivery' ? 'active' : '']"
									to="/delivery" @click="sidebarOpen = false">
									<span class="select-none">Delivery</span>
								</router-link>
							</li>
							<li>
								<router-link
									:class="['flex items-center rounded py-3 pl-3 pr-4 text-gray-50 hover:bg-primary-200', route.path === '/mybox' ? 'active' : '']"
									to="/mybox" @click="sidebarOpen = false">
									<span class="select-none">My Box</span>
								</router-link>
							</li>
							<!-- Cerrar sesion -->
							<li>
								<button @click="logout"
									class="flex items-center rounded py-3 pl-3 pr-4 text-gray-50 hover:bg-primary-200 w-full  cursor-pointer">
									<span class="select-none">Cerrar sesión</span>
								</button>
							</li>
						</ul>
					</nav>
				</div>
			</nav>
		</div>
		<div class="p-3 transition-all duration-300 relative z-2"
			:class="sidebarOpen ? 'lg:w-3/4 lg:left-80 w-full relative' : 'w-full lg:left-0 relative'" style="top:0;">
			<main>
				<router-view />
			</main>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
const sidebarOpen = ref(false);
function toggleSidebar() {
	sidebarOpen.value = !sidebarOpen.value;
}
function logout() {
	localStorage.removeItem('jwt');
	window.location.href = '/login';
}
const route = useRoute();
</script>

<style scoped>
ul.breadcrumb li+li::before {
	content: "\276F";
	padding-left: 8px;
	padding-right: 4px;
	color: inherit;
}

ul.breadcrumb li span {
	opacity: 60%;
}

#sidebar {
	-webkit-transition: all 300ms cubic-bezier(0, 0.77, 0.58, 1);
	transition: all 300ms cubic-bezier(0, 0.77, 0.58, 1);
}

#sidebar.show {
	transform: translateX(0);
}

#sidebar ul li a.active {
	background: #1f2937;
	background-color: #1f2937;
}
</style>
