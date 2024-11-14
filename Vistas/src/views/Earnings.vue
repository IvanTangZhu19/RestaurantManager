<template>
  <Layout>
    <div class="flex flex-row flex-wrap gap-4">
      <template v-for="month in salesData" :key="month[0]">
        <div class="flex flex-col w-full md:w-1/3 p-4">
          <div class="card bg-red-500 p-4 rounded-lg shadow-lg">
            <h2 class="text-xl font-bold mb-2 text-white">Ganancias netas</h2>
            <h2 class="text-xl font-bold mb-2 text-white">{{ month[0] }}</h2>
            <p class="text-2xl text-white">{{ month[1] | formatCurrency }}</p>
          </div>
          <div class="card bg-green-600 p-4 rounded-lg shadow-lg mt-4">
            <h2 class="text-xl font-bold mb-2 text-white">Total de Costos</h2>
            <p class="text-2xl text-white">{{ month[2] | formatCurrency }}</p>
          </div>
          <div class="card bg-yellow-500 p-4 rounded-lg shadow-lg mt-4">
            <h2 class="text-xl font-bold mb-2 text-white">Ganancia Total</h2>
            <p class="text-2xl text-white">{{ month[3] | formatCurrency }}</p>
          </div>
        </div>
      </template>
    </div>
      
      <h2 class="text-2xl font-bold mt-8 mb-4 font-family: 'Playfair Display', serif;">Productos más Vendidos</h2>
      
      <div class="bg-white p-4 rounded-md shadow">
        <table class="w-full">
          <thead>
            <tr class="bg-f35c5c text-white">
              <th class="px-4 py-2 text-left">Producto</th>
              <th class="px-4 py-2 text-right">Total Vendido</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in topProducts" :key="product.id" class="border-b">
              <td class="px-4 py-2 text-left">{{ product.nombre }}</td>
              <td class="px-4 py-2 text-right">{{ product.totalVendido | formatCurrency }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    
  </Layout>
</template>

<script>
import Layout from '@/components/Layout.vue';
import axios from 'axios';

export default {
  name: 'Earnings',
  components: {
    Layout
  },
  data() {
    return {
      salesData: [],
      topProducts: []
    }
  },
  filters: {
    formatCurrency(value) {
      return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);
    }
  },
  created() {
    this.fetchSalesData();
    this.fetchTopProducts();
  },
  methods: {
    async fetchSalesData() {
      try {
        const response = await axios.get('http://localhost:4001/pedidos/sales-data');
        //const response = await this.$http.get('localhost:4001/pedidos/sales-data');
        this.salesData = response.data;
      } catch (error) {
        console.error('Error al obtener datos de ventas:', error);
      }
    },
    async fetchTopProducts() {
      try {
        const response = await this.$http.get('/top-products');
        this.topProducts = response.data;
      } catch (error) {
        console.error('Error al obtener productos más vendidos:', error);
      }
    }
  }
}
</script>

<style scoped>
.font-family {
  font-family: 'Playfair Display', serif;
}

.bg-f44336 {
  background-color: #f44336;
}

.bg-4CAF50 {
  background-color: #4CAF50;
}

.bg-f0ad4e {
  background-color: #f0ad4e;
}

.bg-f35c5c {
  background-color: #f35c5c;
}

:root {
  --card-bg-red: #f56565; /* Color de fondo para la tarjeta roja */
  --card-bg-green: #48bb78; /* Color de fondo para la tarjeta verde */
  --card-bg-yellow: #ecc94b; /* Color de fondo para la tarjeta amarilla */
  --text-color: white; /* Color del texto */
  --border-radius: 12px; /* Radio de borde */
  --shadow-light: 0 4px 8px rgba(0, 0, 0, 0.1); /* Sombra ligera */
  --shadow-heavy: 0 10px 20px rgba(0, 0, 0, 0.15); /* Sombra pesada */
}

.card {
  flex: 1 1 30%; /* Hace que las tarjetas ocupen un 30% del contenedor */
  min-width: 250px;
  padding: 1rem;
  color: var(--text-color);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-light);
  transition: transform 0.2s, box-shadow 0.2s;
  background-color: inherit; /* Para permitir que el color de fondo sea definido en el HTML */
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-heavy);
}

.flex {
  display: flex;
}

.flex-row {
  flex-direction: row;
}

.flex-wrap {
  flex-wrap: wrap;
}

.gap-4 {
  gap: 1rem;
}

h2 {
  letter-spacing: 1px;
  margin-bottom: 0.5rem; /* Añadir un margen inferior para separar el título del contenido */
}

/* Opcional: Estilos para tarjetas específicas */
.card.bg-red-500 {
  background-color: var(--card-bg-red);
}

.card.bg-green-600 {
  background-color: var(--card-bg-green);
}

.card.bg-yellow-500 {
  background-color: var(--card-bg-yellow);
}
</style>
  