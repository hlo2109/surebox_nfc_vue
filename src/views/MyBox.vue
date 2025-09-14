<template>
  <div>
    <h1 class="text-3xl font-bold mb-4">My Box</h1>

    <div class="p-6"> 
        <div v-if="error" class="text-red-500 mb-4">{{ error }}</div>
        <ul v-if="boxes.length" class="space-y-4">
        <li v-for="box in boxes" :key="box.phone" class="bg-gray-100 p-4 rounded shadow flex justify-between items-center">
            <div>
                <div><strong>Phone:</strong> {{ box.phone }}</div>
                <div><strong>Address:</strong> {{ box.address }}</div> 
            </div>
             <router-link :to="`/edit-box/${box.id}`" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer">Edit</router-link>
        </li>
        </ul>
        <div v-else class="text-gray-500">Not registered boxes.</div>
    </div>
    <div class="flex flex-col items-center justify-center ">
        <!-- Card Container -->
        <router-link to="/create-box" class="no-underline">
        <div class="relative p-5 bg-purple-900 rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300 hover:bg-gray-900">
            <!-- Background Image Overlay -->
            <div class="absolute inset-0 bg-cover bg-center opacity-75" style="background-image: url('your-image-url-here');"></div>

            <!-- Icon and Text Overlay -->
            <div class="relative z-10 flex flex-col items-center justify-center h-full text-white">
                <!-- Circle with Plus Icon -->
                <div class="flex items-center justify-center w-6 h-6 bg-white rounded-full mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-700" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 5v14m-7-7h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </div>
                <!-- Text Below Icon -->
                <p class="text-lg font-medium">Add box</p>
            </div>
        </div> 
        </router-link>
    </div>

    
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';

const boxes = ref([]);
const error = ref('');

async function fetchBoxes() {
  error.value = '';
  try {
    console.log(localStorage);
    const jwt = localStorage.getItem('jwt');
    console.log('JWT:', jwt); // Añade este log para verificar el JWT
    const res = await fetch('http://172.29.211.32:3000/user-code-box', {
      headers: { 'Authorization': `Bearer ${jwt}` }
    });
    if (!res.ok) throw new Error('Error al obtener datos');
    const data = await res.json();
    boxes.value = Array.isArray(data) ? data : [data];
  } catch (err) {
    error.value = err.message || 'Error de conexión';
  }
}

onMounted(fetchBoxes);
 
</script>