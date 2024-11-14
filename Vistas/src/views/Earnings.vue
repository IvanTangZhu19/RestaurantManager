<template>
  <Layout>
    <div class="content">
      <div class="flex flex-row flex-wrap gap-4">
        <div v-if="hayPedidosHoy" class="flex flex-col w-full md:w-1/3 p-4">
          <div class="card bg-red-500 p-4 rounded-lg shadow-lg">
            <h2 class="text-xl font-bold mb-2 text-white">Ganancias hoy</h2>
            <h2 class="text-xl font-bold mb-2 text-white">{{ hoy.año }} / {{ hoy.mes }} / {{ hoy.dia }}</h2>
            <p class="text-2xl text-white">{{ gananciasHoy[0] | formatCurrency }}</p>
          </div>
          <div class="card bg-green-600 p-4 rounded-lg shadow-lg mt-4">
            <h2 class="text-xl font-bold mb-2 text-white">Total de Costos</h2>
            <p class="text-2xl text-white">{{ gananciasHoy[1] | formatCurrency }}</p>
          </div>
          <div class="card bg-yellow-500 p-4 rounded-lg shadow-lg mt-4">
            <h2 class="text-xl font-bold mb-2 text-white">Ganancia Total</h2>
            <p class="text-2xl text-white">{{ gananciasHoy[2] | formatCurrency }}</p>
          </div>
        </div>
        <template v-for="month in salesData" :key="month[0]">
          <div class="flex flex-col w-full md:w-1/3 p-4">
            <div class="card bg-red-500 p-4 rounded-lg shadow-lg">
              <h2 class="text-xl font-bold mb-2 text-white">Ganancias</h2>
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
      topProducts: [],
      gananciasHoy: [],
      hoy: {
        dia: 0,
        mes: 0,
        año: 0
      },
      hayPedidosHoy: false
    }
  },
  filters: {
    formatCurrency(value) {
      return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);
    }
  },
  created() {
    this.fetchSalesData();
    this.fetchSalesDataByDate();
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
    async fetchSalesDataByDate() {
      try {
        const today = new Date();
        const dia = today.getDate();
        //const dia = 12;
        const mes = today.getMonth() + 1;
        const año = today.getFullYear();
        this.hoy = {dia, mes, año};
        const response = await axios.post('http://localhost:4001/pedidos/sales-data/date', this.hoy);
        //const response = await this.$http.get('localhost:4001/pedidos/sales-data');
        if(response.data[0] && response.data[0].every(item => item === null)){
          this.hayPedidosHoy = false;
        } else this.hayPedidosHoy = true;
        this.gananciasHoy = response.data;
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

.card {
  flex: 1 1 30%; /* Hace que las tarjetas ocupen un 30% del contenedor */
  min-width: 220px;
  padding: 1rem;
  color: white; 
  border-radius:  12px;
  margin: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); 
  transition: transform 0.2s, box-shadow 0.2s;
  background-color: inherit; /* Para permitir que el color de fondo sea definido en el HTML */
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
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
  background-color: #f56565;
}

.card.bg-green-600 {
  background-color: #48bb78;
}

.card.bg-yellow-500 {
  background-color: #ecc94b;
}
</style>
  