<template>
  <Layout>
    <div class="pedidos-container">
      <!-- Header with Add Order Button and Filtering Options -->
      <div class="header-actions">
        <h2>Gestión de Pedidos</h2>
        <div class="filtering-options">
          <div class="form-group">
            <label>Filtrar por fecha:</label>
            <div class="date-input">
              <input type="number" v-model="filterDate.dia" placeholder="Día" min="1" max="31" />
              <input type="number" v-model="filterDate.mes" placeholder="Mes" min="1" max="12" />
              <input type="number" v-model="filterDate.año" placeholder="Año" />
            </div>
            <button class="btn-primary" @click="fetchOrdersByDate">Buscar</button>
          </div>
          <div class="form-group">
            <label>Filtrar por cliente:</label>
            <select v-model="selectedClient" @change="fetchOrdersByClient">
              <option value="">Todos los clientes</option>
              <option v-for="cliente in clientes" :key="cliente.id" :value="cliente.id">
                {{ cliente[1] }}
              </option>
            </select>
          </div>
        </div>
        <button class="btn-primary" @click="showCreateModal = true">
          Nuevo Pedido
        </button>
      </div>
      <!-- Orders Grid -->
      <div v-if="pedidos.length" class="pedidos-grid">
        <div class="pedido-card" v-for="pedido in pedidos" :key="pedido.id">
          <div class="pedido-header">
            <h3>Pedido #{{ pedido.id }}</h3>
            <p><strong>Cliente:</strong> {{ pedido.cliente.nombre }}</p>
            <p class="pedido-fecha"><strong>Fecha:</strong> {{ formatDate(pedido.fecha) }}</p>
          </div>
          <div class="pedido-body">
            <h4>Productos:</h4>
            <ul class="productos-list">
              <li v-for="producto in pedido.productos" :key="producto.id" class="producto-item">
                <span class="producto-nombre">{{ producto.cantidad }} {{ producto.nombre }}</span>
                <span class="producto-precio">${{ producto.precio.toFixed(2) }}</span>
              </li>
              <li class="producto-item total">
                <span class="producto-nombre"><strong>Total:</strong></span>
                <span class="producto-precio">${{ calcularTotalPedido(pedido).toFixed(2) }}</span>
              </li>
            </ul>
          </div>
          <div class="pedido-actions">
            <button class="btn-edit" @click="editPedido(pedido)">Editar</button>
            <button class="btn-delete" @click="confirmarEliminar(pedido)">Eliminar</button>
          </div>
        </div>
      </div>
      <p v-else>No hay pedidos disponibles.</p>
      <!-- Create/Edit Modal -->
      <div v-if="showCreateModal || showEditModal" class="modal">
        <div class="modal-content">
          <h3>{{ showEditModal ? 'Editar' : 'Nuevo' }} Pedido</h3>
          <form @submit.prevent="showEditModal ? updatePedido() : createPedido()">
            <div class="form-group">
              <label>Cliente:</label>
              <select v-model="currentPedido.clienteID" required>
                <option v-for="cliente in clientes" :key="cliente[0]" :value="cliente[0]">
                  {{ cliente[1] }}
                </option>
              </select>
            </div>

            <div class="productos-section">
              <h4>Productos</h4>
              <div v-for="(producto, index) in currentPedido.productos" :key="index" class="producto-form">
                <select v-model="producto.id" @change="updateProductoInfo(index)">
                  <option v-for="p in productos" :key="p.id" :value="p.id">{{ p[1] }}</option>
                </select>
                <input type="number" v-model="producto.cantidad" min="1" placeholder="Cantidad">
                <button type="button" @click="removeProducto(index)" class="btn-remove">×</button>
              </div>
              <button type="button" @click="addProducto" class="btn-add">Agregar Producto</button>
            </div>

            <div class="modal-actions">
              <button type="submit" class="btn-primary">
                {{ showEditModal ? 'Actualizar' : 'Crear' }}
              </button>
              <button type="button" @click="closeModal" class="btn-secondary">Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script>
import axios from 'axios';
import Layout from '../components/Layout.vue';
import Swal from 'sweetalert2';

export default {
  name: 'OrdersManagement',
  components: {
    Layout
  },
  data() {
    return {
      pedidos: [],
      clientes: [],
      productos: [],
      showCreateModal: false,
      showEditModal: false,
      currentPedido: {
        clienteID: null,
        productos: [],
        fecha: new Date()
      },
      filterDate: {
        dia: null,
        mes: null,
        año: null
      },
      selectedClient: null
    };
  },
  methods: {
    async fetchPedidos() {
      try {
        const response = await axios.get('http://localhost:4001/pedidos/');
        this.pedidos = response.data;
      } catch (error) {
        this.mostrarMensaje('Error al cargar pedidos', 'error');
      }
    },

    async fetchClientes() {
      try {
        const response = await axios.get('http://localhost:4001/clientes/');
        this.clientes = response.data;
      } catch (error) {
        this.mostrarMensaje('Error al cargar clientes', 'error');
      }
    },

    async fetchProductos() {
      try {
        const response = await axios.get('http://localhost:4001/productos/');
        this.productos = response.data;
      } catch (error) {
        this.mostrarMensaje('Error al cargar productos', 'error');
      }
    },

      async createPedido() {
        try {
          const today = new Date();
          const day = today.getDate();
          const month = today.getMonth() + 1;
          const year = today.getFullYear();
          const hours = today.getHours();
          const minutes = today.getMinutes();

          // Formatear la fecha actual
          this.currentPedido.fecha = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

          // Revisar la estructura de productos
          this.currentPedido.productos = this.currentPedido.productos.map(producto => ({
            productoID: producto.id,
            cantidad: producto.cantidad
          }));

          const response = await axios.post('http://localhost:4001/pedidos/pedido', this.currentPedido);
          if (response.status === 201) {
            this.mostrarMensaje('Pedido creado exitosamente', 'success');
            await this.fetchPedidos();
            this.closeModal();
          }
        } catch (error) {
          this.mostrarMensaje('Error al crear el pedido', 'error');
        }
      },

    async updatePedido() {
      try {
        const response = await axios.put(`http://localhost:4001/pedidos/${this.currentPedido.id}`, this.currentPedido);
        if (response.status === 200) {
          this.mostrarMensaje('Pedido actualizado exitosamente', 'success');
          await this.fetchPedidos();
          this.closeModal();
        }
      } catch (error) {
        this.mostrarMensaje('Error al actualizar el pedido', 'error');
      }
    },

    async deletePedido(pedido) {
      try {
        const response = await axios.delete(`http://localhost:4001/pedidos/${pedido.id}`);
        if (response.status === 200) {
          this.mostrarMensaje('Pedido eliminado exitosamente', 'success');
          await this.fetchPedidos();
        }
      } catch (error) {
        this.mostrarMensaje('Error al eliminar el pedido', 'error');
      }
    },

    editPedido(pedido) {
      this.currentPedido = { ...pedido };
      this.showEditModal = true;
    },

    confirmarEliminar(pedido) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: "No podrás revertir esta acción",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.deletePedido(pedido);
        }
      });
    },

    addProducto() {
      this.currentPedido.productos.push({
        id: null,
        cantidad: 1,
        nombre: '',
        precio: 0
      });
    },

    removeProducto(index) {
      this.currentPedido.productos.splice(index, 1);
    },

    updateProductoInfo(index) {
      const producto = this.productos.find(p => p.id === this.currentPedido.productos[index].id);
      if (producto) {
        this.currentPedido.productos[index].nombre = producto.nombre;
        this.currentPedido.productos[index].precio = producto.precio;
      }
    },

    closeModal() {
      this.showCreateModal = false;
      this.showEditModal = false;
      this.currentPedido = {
        clienteId: null,
        productos: [],
        fecha: new Date().toISOString()
      };
      this.filterDate = {
        dia: null,
        mes: null,
        año: null
      };
      this.selectedClient = null;
    },

    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },

    calcularTotalPedido(pedido) {
      return pedido.productos.reduce((total, producto) => {
        return total + (producto.precio * producto.cantidad);
      }, 0);
    },

    mostrarMensaje(titulo, icon) {
      Swal.fire({
        title: titulo,
        icon: icon,
        timer: 2000,
        showConfirmButton: false
      });
    },
    async fetchOrdersByDate() {
      try {
        const { dia, mes, año } = this.filterDate;
        if (!dia || !mes || !año) {
          this.mostrarMensaje('Por favor, ingresa una fecha válida', 'error');
          return;
        }
        const response = await axios.post('http://localhost:4001/pedidos/fecha', { dia, mes, año });
        this.pedidos = response.data;
      } catch (error) {
        this.mostrarMensaje('Error al cargar pedidos por fecha', 'error');
      }
    },
    async fetchOrdersByClient(clienteID) {
      try {
        const response = await axios.get(`http://localhost:4001/pedidos/cliente/${clienteID || ''}`);
        this.pedidos = response.data;
      } catch (error) {
        this.mostrarMensaje('Error al cargar pedidos por cliente', 'error');
      }
    },
    async fetchAllOrders() {
      try {
        const response = await axios.get('http://localhost:4001/pedidos/');
        this.pedidos = response.data;
      } catch (error) {
        this.mostrarMensaje('Error al cargar pedidos', 'error');
      }
    }
  },
  async created() {
    await Promise.all([
      this.fetchAllOrders(),
      this.fetchClientes(),
      this.fetchProductos()
    ]);
  }
};
</script>

<style scoped>
.pedidos-container {
  max-width: 1300px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.pedidos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.pedido-card {
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 15px;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.pedido-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 15px;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.producto-form {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 10px;
  margin-bottom: 10px;
}

.btn-primary {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-edit {
  background-color: #ffc107;
  color: black;
}

.btn-delete {
  background-color: #dc3545;
  color: white;
}

.btn-remove {
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  cursor: pointer;
}

input, select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.productos-section {
  margin: 20px 0;
}

.total {
  margin-top: 10px;
  font-weight: bold;
  border-top: 2px solid #ddd;
  padding-top: 10px;
}

.filtering-options {
  display: flex;
  gap: 20px;
  align-items: center;
}

.filtering-options .form-group {
  display: flex;
  align-items: center;
  margin-bottom: 0;
}

.filtering-options label {
  margin-right: 10px;
  white-space: nowrap;
}

.date-input {
  display: flex;
  gap: 10px;
}

.date-input input {
  width: 80px;
}

@media (max-width: 767px) {
  .header-actions {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }

  .filtering-options {
    flex-direction: column;
    align-items: stretch;
  }

  .pedidos-grid {
    grid-template-columns: 1fr;
  }
}
</style>