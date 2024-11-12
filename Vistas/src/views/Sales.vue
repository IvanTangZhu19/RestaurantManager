<template>
  <Layout>
    <div class="pedidos-container">
      <div v-if="pedidos.length" class="pedidos-grid">
        <div class="pedido-card" v-for="pedido in pedidos" :key="pedido.id">
          <div class="pedido-header">
            <h3>Pedido #{{ pedido.id }}</h3>
            <p><strong>Cliente:</strong> {{ pedido.cliente.nombre }}</p>
            <p class="pedido-fecha"><strong>Fecha:</strong> {{ this.formatDate(pedido.fecha) }}</p>
          </div>
          <div class="pedido-body">
            <h4>Productos:</h4>
            <ul class="productos-list">
              <li v-for="producto in pedido.productos" :key="producto.id" class="producto-item">
                <span class="producto-nombre">{{ producto.cantidad }} {{ producto.nombre }}</span>
                <span class="producto-precio"> ${{ producto.precio.toFixed(2) }}</span>
              </li>
              <li class="producto-item">
                <span class="producto-nombre"><strong>Total:</strong> ${{ calcularTotalPedido(pedido).toFixed(2) }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <p v-else>No hay pedidos disponibles.</p>
    </div>
  </Layout>
</template>

<script>
import axios from 'axios';
import Layout from '../components/Layout.vue';
import Swal from 'sweetalert2';

export default {
  name: 'Sales',
  components: {
    Layout
  },
  data() {
    return {
      pedidos: [],
      newPedido: {
        fecha: '',
        clienteID: 0,
        productos: []
      },
      errorMessage: '',
      successMessage: '',
      showModal: false
    };
  },
  methods: {
    async fetchPedidos() {
      try {
        const today = new Date();
        const dia = today.getDate();
        const mes = today.getMonth() + 1;
        const año = today.getFullYear();
        const response = await axios.post('http://localhost:4001/pedidos/fecha', {dia, mes, año});
        this.pedidos = response.data;
      } catch (err) {
        this.errorMessage = 'Error al cargar pedidos: ' + err.message;
      }
    },
    async insertProduct() {
      try {
        const response = await axios.post('http://localhost:4001/productos/producto', this.newProduct);
        if (response.status === 201) {
          this.mostrarMensaje('Producto agregado', 'success' );
          this.showModal = false;
          this.newProduct = { nombre: '', precio: 0, costo: 0 };
          this.fetchProducts(); // Actualiza la lista
        }
      } catch (err) {
        this.mostrarMensaje('Error'+err, 'error');
      }
    },
    mostrarMensaje(titulo, icon){
      Swal.fire({
        title: titulo,
        icon: icon,
        timer: 2000,
        showConfirmButton: false
      });
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
    calcularTotalPedido(pedido) {
      return pedido.productos.reduce((total, producto) => {
        return total + producto.precio * producto.cantidad;
      }, 0);
    }
  },
  async created() {
    await this.fetchPedidos();
  }
}
</script>
<style scoped>
.pedidos-container {
  max-width: 1300px;
  margin: 0 auto;
  font-family: 'Arial', sans-serif;
}
.pedidos-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* Distribuir en 3 columnas */
  gap: 20px; /* Espacio entre tarjetas */
}
.pedido-card {
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 15px;
  background-color: #fff;
  transition: transform 0.2s;
}
.pedido-card:hover {
  transform: scale(1.02);
}
.pedido-header {
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 10px;
}
.pedido-fecha {
  color: #666;
}

.productos-list {
  list-style: none;
  padding: 0;
}
.producto-item {
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
  border-bottom: 1px dashed #ccc;
}
.producto-nombre {
  font-weight: bold;
  margin-right: 10px;
}
.producto-cantidad, .producto-precio {
  color: #333;
}
</style>