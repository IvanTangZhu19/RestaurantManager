import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Sales from '../views/Sales.vue'
import Earnings from '../views/Earnings.vue'
import Products from '../views/Products.vue'
import Client from '../views/Client.vue'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
  },
  {
    path: '/sales',
    name: 'Sales',
    component: Sales,
  },
  {
    path: '/earnings',
    name: 'Earnings',
    component: Earnings,
  },
  {
    path: '/products',
    name: 'Products',
    component: Products,
  },
  {
    path: '/client',
    name: 'Clients',
    component: Client
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

