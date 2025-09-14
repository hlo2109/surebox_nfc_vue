<template>
  <!-- Register Form -->
  <div class="font-sans">
    <div class="relative min-h-screen flex flex-col sm:justify-center items-center bg-gray-100 ">
      <div class="relative sm:max-w-sm w-full">
        <div class="card bg-blue-400 shadow-lg  w-full h-full rounded-3xl absolute  transform -rotate-6"></div>
        <div class="card bg-red-400 shadow-lg  w-full h-full rounded-3xl absolute  transform rotate-6"></div>
        <div class="relative w-full rounded-3xl  px-6 py-4 bg-gray-100 shadow-md">
          <label class="block mt-3 text-sm text-gray-700 text-center font-semibold">Register</label>
          <form class="mt-10" @submit="handleRegister">
            <div>
              <input v-model="name" type="text" placeholder="Name" class="mt-1 block w-full border-none bg-gray-100 h-11 rounded-xl shadow-lg hover:bg-blue-100 focus:bg-blue-100 focus:ring-0">
            </div>  
            <div class="mt-4">
              <input v-model="email" type="email" placeholder="Email" class="mt-1 block w-full border-none bg-gray-100 h-11 rounded-xl shadow-lg hover:bg-blue-100 focus:bg-blue-100 focus:ring-0">
            </div>
            <div class="mt-4">
              <input v-model="password" type="password" placeholder="Password" class="mt-1 block w-full border-none bg-gray-100 h-11 rounded-xl shadow-lg hover:bg-blue-100 focus:bg-blue-100 focus:ring-0">
            </div>
            <!-- Repeat password -->
            <div class="mt-4">
              <input v-model="confirmPassword" type="password" placeholder="Repeat Password" class="mt-1 block w-full border-none bg-gray-100 h-11 rounded-xl shadow-lg hover:bg-blue-100 focus:bg-blue-100 focus:ring-0">
            </div>
            <div v-if="error" class="mt-4 text-red-500 text-center">{{ error }}</div>
            <div class="mt-7">
              <button class="bg-blue-500 w-full py-3 rounded-xl text-white shadow-xl hover:shadow-inner focus:outline-none transition duration-500 ease-in-out  transform hover:-translate-x hover:scale-105">Register</button>
            </div>
            <div class="mt-7">
              <div class="flex justify-center items-center">
                <label class="mr-2">Already have an account?</label>
                <router-link to="/login" class="text-blue-500 transition duration-500 ease-in-out  transform hover:-translate-x hover:scale-105">Login</router-link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const name = ref('');
const address = ref('');
const geolocation = ref('');
const phone = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const error = ref('');
const router = useRouter();

const API_BASE_URL = import.meta.env.VITE_API_URL ;

async function handleRegister(e) {
    e.preventDefault();
    error.value = '';
    if (password.value.length < 6) {
        error.value = 'Password must be at least 6 characters long';
        return;
    }
    if (password.value !== confirmPassword.value) {
        error.value = 'Passwords do not match';
        return;
    }

    try {
        const res = await axios.post(`${API_BASE_URL}/register`, {
            name: name.value,
            email: email.value,
            password: password.value
        });
        // localStorage.setItem('jwt', res.data.token);
        router.push('/login');
    } catch (err) {
        error.value = err.response?.data?.message || err.message || 'Connection error';
    }
}
</script>
