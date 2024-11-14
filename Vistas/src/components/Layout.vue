<!-- Layout.vue -->
<template>
  <div class="layout">
    <header class="header">
      <h1>RestaurantManager</h1>
      <span class="user-info">Usuario: {{ this.username }} </span>
    </header>
    
    <div class="content">
      <nav class="sidebar">
        <router-link 
          v-for="item in menuItems" 
          :key="item.path"
          :to="item.path"
          class="nav-item"
          :class="{ active: $route.path === item.path }"
        >
          {{ item.name }}
        </router-link>
      </nav>
      
      <main class="main-content">
        <div class="title-container">
          <h2 class="page-title">{{ currentPage }}</h2>
        </div>
        <slot></slot>
      </main>
    </div>
  </div>
</template>

  
  <script>
import EventBus from '../event-bus.js';
  export default {
    name: 'Layout',
    data() {
      return {
        username: 'admin',
        menuItems: [
          { name: 'Ventas', path: '/sales' },
          { name: 'Ganancias', path: '/earnings' },
          { name: 'Productos', path: '/products' },
          { name: 'Clientes', path: '/client'}
        ]
      }
    },
    mounted() {
      EventBus.on('usuario', (dato) => {
        this.username = dato.usuario;
      });
    },
    computed: {
      currentPage() {
        const currentRoute = this.menuItems.find(item => item.path === this.$route.path)
        return currentRoute ? currentRoute.name : ''
      }
    },
    methods: {
    }
  }
  </script>
  
  <style scoped>
  .layout {
    font-family: 'Playfair Display', serif;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  
  .header {
    background-color: #f35c5c;
    color: white;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .header h1 {
    margin: 0;
    font-size: 1.5rem;
  }
  
  .user-info {
    font-size: 1rem;
  }
  
  .content {
    font-family: 'Playfair Display', serif;
    display: flex;
    flex: 1;
  }
  
  .sidebar {
    width: 200px;
    background-color: #f35c5c;
    padding: 1rem 0;
    display: flex;
    flex-direction: column;
  }
  
  .nav-item {
    color: white;
    text-decoration: none;
    padding: 1rem 2rem;
    transition: background-color 0.3s;
  }
  
  .nav-item:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  .nav-item.active {
    background-color: #a63d3d;
  }
  
  .main-content {
  font-family: 'Playfair Display', serif;
  flex: 1;
  padding: 2rem;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center; /* Mantenemos la alineación horizontal centrada */
}

.title-container {
  /* Eliminamos flex: 1 para que no ocupe todo el espacio vertical */
  display: flex;
  align-items: flex-start; /* Cambiamos a flex-start para alinear arriba */
  justify-content: center;
  width: 100%;
  margin-bottom: 2rem; /* Agregamos margen inferior para separarlo del contenido */
}

.page-title {
  color: #a63d3d;
  margin: 0;
  text-align: center;
  width: 100%;
}
</style>