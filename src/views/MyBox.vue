<template>
	<div class="min-h-screen bg-gray-50 p-4">
		<!-- Header Section -->
		<div class="max-w-6xl mx-auto">
			<div class="flex items-center justify-between mb-8">
				<div>
					<h1 class="text-4xl font-bold text-gray-900 mb-2">My Boxes</h1>
					<p class="text-gray-600">Manage your registered boxes</p>
				</div>
				<div class="text-sm text-gray-500">
					{{ boxes.length }} {{ boxes.length === 1 ? 'box' : 'boxes' }} registered
				</div>
			</div>

			<!-- Error Message -->
			<Message v-if="error" severity="error" :closable="false" class="mb-6">
				{{ error }}
			</Message>

			<!-- Loading State -->
			<div v-if="loading" class="flex items-center justify-center py-12">
				<ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" fill="transparent"
					animationDuration=".5s" aria-label="Loading" />
			</div>

			<!-- Boxes Grid -->
			<div v-else-if="boxes.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
				<Card v-for="box in boxes" :key="box.phone"
					class="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
					<template #content>
						<div class="space-y-3">
							<div class="flex items-center text-gray-700">
								<i class="pi pi-phone mr-3 text-gray-500"></i>
								<div>
									<span class="text-sm text-gray-500 block">Phone</span>
									<span class="font-semibold">{{ box.phone }}</span>
								</div>
							</div>

							<div class="flex items-start text-gray-700">
								<i class="pi pi-map-marker mr-3 text-gray-500 mt-1"></i>
								<div>
									<span class="text-sm text-gray-500 block">Address</span>
									<span class="font-semibold">{{ box.address }}</span>
								</div>
							</div>
						</div>
					</template>

					<template #footer>
						<div class="flex gap-2">
							<Button :as="'router-link'" :to="`/edit-box/${box.id}`" icon="pi pi-pencil" label="Edit"
								class="flex-1" severity="primary" size="small" />
							<!-- <Button icon="pi pi-eye" label="View" class="flex-1" severity="secondary" size="small"
								outlined /> -->
						</div>
					</template>
				</Card>

				<!-- Add New Box Card -->
				<router-link to="/create-box" class="no-underline">
					<Card
						class="border-2 border-dashed border-gray-300 hover:border-sky-600 transition-all duration-300 cursor-pointer group h-full">
						<template #content>
							<div class="flex flex-col items-center justify-center py-12 text-center">
								<div
									class="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-sky-200 transition-colors duration-300">
									<i class="pi pi-plus text-2xl text-sky-600"></i>
								</div>
								<h3 class="text-lg font-semibold text-gray-900 mb-2">Add New Box</h3>
								<p class="text-gray-500 text-sm">Register a new box to your account</p>
							</div>
						</template>
					</Card>
				</router-link>
			</div>

			<!-- Empty State -->
			<div v-else class="text-center py-16">
				<div class="max-w-md mx-auto">
					<div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
						<i class="pi pi-inbox text-4xl text-gray-400"></i>
					</div>
					<h3 class="text-xl font-semibold text-gray-900 mb-2">No boxes registered</h3>
					<p class="text-gray-500 mb-6">Get started by adding your first box</p>
					<Button :as="'router-link'" to="/create-box" icon="pi pi-plus" label="Add Your First Box"
						size="large" class="px-6" />
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Message from 'primevue/message'
import ProgressSpinner from 'primevue/progressspinner'

const boxes = ref([])
const error = ref('')
const loading = ref(false)
const API_BASE_URL = import.meta.env.VITE_API_URL

async function fetchBoxes() {
	loading.value = true
	error.value = ''

	try {
		const jwt = localStorage.getItem('jwt')

		if (!jwt) {
			throw new Error('Authentication required')
		}

		const res = await fetch(`${API_BASE_URL}/user-code-box`, {
			headers: {
				'Authorization': `Bearer ${jwt}`,
				'Content-Type': 'application/json'
			}
		})

		if (!res.ok) {
			const errorData = await res.json().catch(() => ({}))
			throw new Error(errorData.message || `Server error: ${res.status}`)
		}

		const data = await res.json()
		boxes.value = Array.isArray(data) ? data : [data]

	} catch (err) {
		console.error('Error fetching boxes:', err)
		error.value = err.message || 'Connection error. Please try again.'
	} finally {
		loading.value = false
	}
}

onMounted(fetchBoxes)
</script>