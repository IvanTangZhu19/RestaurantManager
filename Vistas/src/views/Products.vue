<template>
  <Layout>
    <div class="container">
      <table v-if="products.length" class="table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Nombre</th>
            <th>Precio unitario</th>
            <th>Costo</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.id">
            <td>{{ product[0] }}</td>
            <td>{{ product[1] }}</td>
            <td>{{ product[2] }}</td>
            <td>{{ product[3] }}</td>
            <td>{{ product[4] }}</td>
          </tr>
        </tbody>
      </table>
      <button @click="showModal = true" class="open-modal-btn">Agregar Producto</button>
      <div v-if="showModal" class="modal-overlay">
        <div class="modal">
          <form @submit.prevent="insertProduct" class="form">
            <h3>Agregar Nuevo Producto</h3>
            <input type="text" v-model="newProduct.nombre" placeholder="Nombre" required />
            <input type="number" v-model="newProduct.precio" placeholder="Precio" required />
            <input type="number" v-model="newProduct.costo" placeholder="Costo" required />
            <div class="modal-actions">
              <button type="submit" class="submit-btn">Agregar Producto</button>
              <button type="button" @click="showModal = false" class="close-btn">Cancelar</button>
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
        nombre: '',
        precio: 0,
        costo: 0,
      },
      errorMessage: '',
      successMessage: '',
      showModal: false
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
</style>
