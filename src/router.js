import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';
import About from './views/About.vue';
import Login from './views/Login.vue';
import Register from './views/Register.vue';
import Delivery from './views/deliverys.vue';
import MyBox from './views/MyBox.vue';
import CreateBox from './views/CreateBox.vue';
import EditBox from './views/EditBox.vue';

const routes = [
  {
    path: '/',
    component: () => import('./layouts/MainLayout.vue'),
    children: [
      { path: '', component: Home },
      { path: 'about', component: About },
    ],
  },
  {
    path: '/login',
    component: () => import('./layouts/AuthLayout.vue'),
    children: [
      { path: '/login', component: Login },
    ],
  },
  {
    path: '/register',
    component: () => import('./layouts/AuthLayout.vue'),
    children: [
      { path: '/register', component: Register },
    ],
  },
  {
    path: '/delivery',
    component: () => import('./layouts/MainLayout.vue'),
    children: [
      { path: '', component: Delivery },
    ],
  },
  {
    path: '/mybox',
    component: () => import('./layouts/MainLayout.vue'),
    children: [
      { path: '', component: MyBox },
    ],
  },
  {
    path: '/create-box',
    component: () => import('./layouts/MainLayout.vue'),
    children: [
      { path: '', component: CreateBox },
    ],
  },
  {
    path: '/edit-box/:id',
    component: () => import('./layouts/MainLayout.vue'),
    children: [
      { path: '', component: EditBox },
    ],
  },

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Protección de rutas
router.beforeEach((to, from, next) => {
  const publicPages = ['/login', '/register'];
  const authRequired = !publicPages.includes(to.path);
  const jwt = localStorage.getItem('jwt');

  if (authRequired && !jwt) {
    return next('/login');
  }
  next();
});

export default router;
