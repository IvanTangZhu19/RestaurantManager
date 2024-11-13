<template>
  <Layout>
    <div class="container">
      <button @click="openAddModal" class="open-modal-btn">Agregar Producto</button>
      <table v-if="products.length" class="table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Nombre</th>
            <th>Precio unitario</th>
            <th>Costo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.id">
            <td>{{ product[0] }}</td>
            <td>{{ product[1] }}</td>
            <td>{{ product[2] }}</td>
            <td>{{ product[3] }}</td>
            <td>
              <button @click="openEditModal(product)" class="edit-btn">Editar</button>
              <button @click="confirmDelete(product[0])" class="delete-btn">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="showModal" class="modal-overlay">
        <div class="modal">
          <form @submit.prevent="isEditing ? updateProduct() : insertProduct()" class="form">
            <h3>{{ isEditing ? 'Editar Producto' : 'Agregar Nuevo Producto' }}</h3>
            <div class="form-group">
              <label>Nombre</label>
              <input type="text" v-model="newProduct.nombre" placeholder=" " required />
            </div>
            <div class="form-group">
              <label>Precio</label>
              <input type="number" v-model="newProduct.precio" placeholder=" " required />
            </div>
            <div class="form-group">
              <label>Costo</label>
              <input type="number" v-model="newProduct.costo" placeholder=" " required />
            </div>
            <div class="modal-actions">
              <button type="submit" class="submit-btn">{{ isEditing ? 'Guardar Cambios' : 'Agregar Producto' }}</button>
              <button type="button" @click="closeModal" class="close-btn">Cancelar</button>
            </div>
            <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
            <p v-if="successMessage" class="success">{{ successMessage }}</p>
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
  name: 'Product',
  components: {
    Layout
  },
  data() {
    return {
      products: [],
      newProduct: {
        id: 0,
        nombre: '',
        precio: 0,
        costo: 0,
      },
      errorMessage: '',
      successMessage: '',
      showModal: false,
      isEditing: false
    };
  },
  methods: {
    async fetchProducts() {
      try {
        const response = await axios.get('http://localhost:4001/productos/');
        this.products = response.data;
      } catch (err) {
        this.errorMessage = 'Error al cargar clientes: ' + err.message;
      }
    },
    openAddModal() {
      this.isEditing = false;
      this.newProduct = { nombre: '', precio: 0, costo: 0 };
      this.showModal = true;
    },
    async insertProduct() {
      try {
        const response = await axios.post('http://localhost:4001/productos/producto', this.newProduct);
        if (response.status === 201) {
          this.mostrarMensaje('Producto agregado', 'success' );
          this.fetchProducts();
          this.closeModal();
        }
      } catch (err) {
        this.mostrarMensaje('Error: ' + err.message, 'error');
      }
    },
    async updateProduct() {
      try {
        const response = await axios.put('http://localhost:4001/productos/actualizarProducto', this.newProduct);
        if (response.status === 201) {
          this.mostrarMensaje('Producto actualizado', 'success');
          this.fetchProducts();
          this.closeModal();
        }
      } catch (err) {
        this.mostrarMensaje('Error: ' + err.message, 'error');
      }
    },
    async deleteProduct(id) {
      try {
        const response = await axios.delete(`http://localhost:4001/productos/eliminarProducto/${id}`);
        if (response.status === 200) {
          this.mostrarMensaje('Producto eliminado', 'success');
          this.fetchProducts();
        }
      } catch (err) {
        this.mostrarMensaje('Error: ' + err.message, 'error');
      }
    },
    confirmDelete(id) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: 'Este cambio no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.deleteProduct(id);
        }
      });
    },
    openEditModal(product) {
      this.isEditing = true;
      this.newProduct = {
        id: product[0],
        nombre: product[1],
        precio: product[2],
        costo: product[3]
      };
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.errorMessage = '';
      this.successMessage = '';
    },
    mostrarMensaje(titulo, icon) {
      Swal.fire({
        title: titulo,
        icon: icon,
        timer: 2000,
        showConfirmButton: false
      });
    }
  },
  async created() {
    await this.fetchProducts();
  }
};
</script>

<style scoped>
.container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  text-align: left;
}

.client-form {
  display: flex;
  flex-direction: column;
}

.client-form input {
  margin-bottom: 10px;
}
.delete-btn {
  background-color: #e74c3c;
  color: #fff;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 15px;
}
.delete-btn:hover {
  background-color: #c0392b;
}

button {
  background-color: #f35c5c;
  color: white;
  padding: 10px;
  border: none;
  cursor: pointer;
}

.error {
  color: red;
}

.success {
  color: green;
}
.table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin: 20px 0;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  overflow: hidden;
}

.table th, .table td {
  padding: 12px 15px;
  text-align: left;
}

.table th {
  background-color: #f35c5c;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 16px;
}

.table tbody tr {
  background-color: #f8f8f8;
  border-bottom: 1px solid #ddd;
}

.table tbody tr:nth-child(even) {
  background-color: #f2f2f2;
}

.table tbody tr:hover {
  background-color: #e0f7fa;
  cursor: pointer;
}

.table td {
  font-size: 15px;
  color: #333;
}

.table tr:last-child td {
  border-bottom: none;
}
.open-modal-btn {
padding: 10px 20px;
background-color: #f35c5c;
color: white;
border: none;
border-radius: 5px;
cursor: pointer;
font-size: 16px;
}

.modal-overlay {
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

.modal {
background-color: #fff;
border-radius: 10px;
padding: 20px;
width: 400px;
max-width: 90%;
box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.form {
display: flex;
flex-direction: column;
}

.form h3 {
margin-bottom: 15px;
font-size: 20px;
text-align: center;
}

.form input {
margin-bottom: 10px;
padding: 10px;
border: 1px solid #ccc;
border-radius: 5px;
font-size: 15px;
}

.modal-actions {
display: flex;
justify-content: space-between;
}

.submit-btn {
background-color: #4CAF50;
color: white;
border: none;
padding: 10px 15px;
border-radius: 5px;
cursor: pointer;
font-size: 15px;
}

.close-btn {
background-color: #f44336;
color: white;
border: none;
padding: 10px 15px;
border-radius: 5px;
cursor: pointer;
font-size: 15px;
}

.edit-btn {
  background-color: #f0ad4e;
  color: #fff;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 15px;
}
.edit-btn:hover {
  background-color: #ec971f;
}

.form-group {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.form-group input {
  flex: 1;
  padding: 8px;
  margin-right: 10px;
}

.form-group label {
  width: 100px; /* Define el ancho de las etiquetas */
}
</style>
