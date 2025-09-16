<template>
	<div class="bg-surface-0 light:bg-surface-950 px-8 py-8">
		<div class="flex items-center flex-col lg:flex-row lg:justify-between">
			<div class="flex items-start flex-col md:flex-row gap-8">
				<div class="flex flex-col gap-4">
					<div class="flex items-center">
						<span class="text-surface-900 light:text-surface-0 font-bold text-3xl">Welcome Back</span>
					</div>
					<div class="flex items-center flex-wrap gap-8">
						<div>
							<span class="text-surface-500 light:text-surface-300">Orders</span>
							<div class="text-surface-700 light:text-surface-100 mt-1 text-sm font-semibold">2</div>
						</div>
						<div>
							<span class="text-surface-500 light:text-surface-300">Box ID</span>
							<div class="text-surface-700 light:text-surface-100 mt-1 text-sm font-semibold">1</div>
						</div>
					</div>
				</div>
			</div>
			<div class="mt-6 lg:mt-0 flex items-center gap-4">
				<Button icon="pi pi-bookmark" rounded severity="secondary" />
				<Button icon="pi pi-heart" rounded severity="secondary" />
				<Button icon="pi pi-list" rounded severity="secondary" />
			</div>
		</div>
	</div>
	<div class="px-2 py-2 hidden">
		<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
			<div class="bg-surface-0 light:bg-surface-900 shadow-sm p-5 rounded-2xl">
				<div class="flex justify-between gap-4">
					<div class="flex flex-col gap-2">
						<span class="text-surface-700 light:text-surface-300 font-normal leading-tight">Messages</span>
						<div class="text-surface-900 light:text-surface-0 font-semibold text-2xl! leading-tight!">152
						</div>
					</div>
					<div
						class="flex items-center justify-center bg-linear-to-b from-cyan-400 light:from-cyan-300 to-cyan-600 light:to-cyan-500 rounded-lg w-10 h-10">
						<i class="pi pi-envelope text-surface-0 light:text-surface-900 text-xl! leading-none!" />
					</div>
				</div>
				<div class="mt-4">
					<span class="text-surface-600 light:text-surface-300 font-medium leading-tight">24 new</span>
					<span class="text-surface-500 light:text-surface-300 leading-tight"> since last visit</span>
				</div>
			</div>

			<div class="bg-surface-0 light:bg-surface-900 shadow-sm p-5 rounded-2xl">
				<div class="flex justify-between gap-4">
					<div class="flex flex-col gap-2">
						<span class="text-surface-700 light:text-surface-300 font-normal leading-tight">Check-ins</span>
						<div class="text-surface-900 light:text-surface-0 font-semibold text-2xl! leading-tight!">532
						</div>
					</div>
					<div
						class="flex items-center justify-center bg-linear-to-b from-orange-400 light:from-orange-300 to-orange-600 light:to-orange-500 rounded-lg w-10 h-10">
						<i class="pi pi-map-marker text-surface-0 light:text-surface-900 text-xl! leading-none!" />
					</div>
				</div>
				<div class="mt-4">
					<span class="text-surface-600 light:text-surface-300 font-medium leading-tight">48 new</span>
					<span class="text-surface-500 light:text-surface-300 leading-tight"> since last visit</span>
				</div>
			</div>

			<div class="bg-surface-0 light:bg-surface-900 shadow-sm p-5 rounded-2xl">
				<div class="flex justify-between gap-4">
					<div class="flex flex-col gap-2">
						<span class="text-surface-700 light:text-surface-300 font-normal leading-tight">Files
							Synced</span>
						<div class="text-surface-900 light:text-surface-0 font-semibold text-2xl! leading-tight!">28.441
						</div>
					</div>
					<div
						class="flex items-center justify-center bg-linear-to-b from-slate-400 light:from-slate-300 to-slate-600 light:to-slate-500 rounded-lg w-10 h-10">
						<i class="pi pi-file text-surface-0 light:text-surface-900 text-xl! leading-none!" />
					</div>
				</div>
				<div class="mt-4">
					<span class="text-surface-500 light:text-surface-300 leading-tight">32,56 / 250 GB</span>
				</div>
			</div>

			<div class="bg-surface-0 light:bg-surface-900 shadow-sm p-5 rounded-2xl">
				<div class="flex justify-between gap-4">
					<div class="flex flex-col gap-2">
						<span class="text-surface-700 light:text-surface-300 font-normal leading-tight">Users
							Online</span>
						<div class="text-surface-900 light:text-surface-0 font-semibold text-2xl! leading-tight!">25.660
						</div>
					</div>
					<div
						class="flex items-center justify-center bg-linear-to-b from-violet-400 light:from-violet-300 to-violet-600 light:to-violet-500 rounded-lg w-10 h-10">
						<i class="pi pi-users text-surface-0 light:text-surface-900 text-xl! leading-none!" />
					</div>
				</div>
				<div class="mt-4">
					<span class="text-surface-600 light:text-surface-300 font-medium leading-tight">72 new</span>
					<span class="text-surface-500 light:text-surface-300 leading-tight"> user this week</span>
				</div>
			</div>
		</div>
	</div>
</template>
<script setup>
import Button from 'primevue/button';
</script>