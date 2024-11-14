<template>
  <Layout>
    <div class="container mx-auto my-8">
      <h1 class="text-3xl font-bold mb-4 font-family: 'Playfair Display', serif;">Ganancias</h1>
      
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <template v-for="month in salesData" :key="month.month">
          <div class="bg-f44336 text-white p-4 rounded-md">
            <h2 class="text-xl font-bold mb-2">{{ month.month }}</h2>
            <p class="text-2xl">{{ month.total_revenue | formatCurrency }}</p>
          </div>
          <div class="bg-4CAF50 text-white p-4 rounded-md">
            <h2 class="text-xl font-bold mb-2">Total de Costos</h2>
            <p class="text-2xl">{{ month.total_cost | formatCurrency }}</p>
          </div>
          <div class="bg-f0ad4e text-white p-4 rounded-md">
            <h2 class="text-xl font-bold mb-2">Ganancia Total</h2>
            <p class="text-2xl">{{ month.total_margin | formatCurrency }}</p>
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
import Layout from '@/components/Layout.vue'

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
        const response = await this.$http.get('/sales-data');
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
</style>
  