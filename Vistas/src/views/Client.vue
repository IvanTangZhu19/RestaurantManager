<template>
    <Layout>
      <div class="container">
        <button @click="openAddModal" class="open-modal-btn">Agregar Cliente</button>
        <table v-if="clients.length" class="table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Dirección</th>
              <th>Descripción</th>
              <th>Teléfono</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="client in clients" :key="client.id">
              <td>{{ client[0] }}</td>
              <td>{{ client[1] }}</td>
              <td>{{ client[2] }}</td>
              <td>{{ client[3] }}</td>
              <td>{{ client[4] }}</td>
              <td>
              <button @click="openEditModal(client)" class="edit-btn">Editar</button>
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
              <input type="text" v-model="newClient.nombre" placeholder=" " required />
            </div>
            <div class="form-group">
              <label>Direccion</label>
              <input type="text" v-model="newClient.direccion" placeholder=" " required />
            </div>
            <div class="form-group">
              <label>Telefono</label>
              <input type="number" v-model="newClient.telefono" placeholder=" " required />
            </div>
            <div class="form-group">
              <label>Descripción</label>
              <input type="text" v-model="newClient.descripcion" placeholder=" " required />
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
    name: 'Client',
    components: {
      Layout
    },
    data() {
      return {
        clients: [],
        newClient: {
          nombre: '',
          direccion: '',
          telefono: '',
          descripcion: ''
        },
        errorMessage: '',
        successMessage: '',
        showModal: false,
        isEditing: false
      };
    },
    methods: {
      async fetchClients() {
        try {
          const response = await axios.get('http://localhost:4001/clientes/');
          this.clients = response.data;
        } catch (err) {
          this.errorMessage = 'Error al cargar clientes: ' + err.message;
        }
      },
      openAddModal() {
        this.isEditing = false;
        this.newProduct = { nombre: '', precio: 0, costo: 0 };
        this.showModal = true;
      },
      async insertClient() {
        try {
          const response = await axios.post('http://localhost:4001/clientes/cliente', this.newClient);
          if (response.status === 201) {
            this.mostrarMensaje('Cliente agregado', 'success' );
            this.showModal = false;
            this.newClient = { nombre: '', direccion: '', telefono: '', descripcion: '' };
            this.fetchClients(); // Actualiza la lista
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
      async updateProduct(){
        try {
          const response = await axios.put('http://localhost:4001/clientes/actualizarCliente', this.newClient);
          if (response.status === 201) {
            this.mostrarMensaje('Cliente actualizado', 'success' );
            this.fetchClients(); // Actualiza la lista
            this.closeModal();
          }
        } catch (err) {
          this.mostrarMensaje('Error'+err, 'error');
        }
      },
      openEditModal(client) {
        this.isEditing = true;
        this.newClient = {
          id: client[0],
          nombre: client[1],
          direccion: client[2],
          telefono: client[4],
          descripcion: client[3]
        };
        this.showModal = true;
      },
      closeModal() {
        this.showModal = false;
        this.errorMessage = '';
        this.successMessage = '';
      }
    },
    async created() {
      await this.fetchClients();
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
  font-family: 'Playfair Display', serif;
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
  