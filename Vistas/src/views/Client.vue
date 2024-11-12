<template>
    <Layout>
      <div class="clients-container">
        <table v-if="clients.length" class="client-table">
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
            </tr>
          </tbody>
        </table>
        <button @click="showModal = true" class="open-modal-btn">Agregar Cliente</button>
        <div v-if="showModal" class="modal-overlay">
          <div class="modal">
            <form @submit.prevent="insertClient" class="client-form">
              <h3>Agregar Nuevo Cliente</h3>
              <input type="text" v-model="newClient.nombre" placeholder="Nombre" required />
              <input type="text" v-model="newClient.direccion" placeholder="Dirección" required />
              <input type="text" v-model="newClient.telefono" placeholder="Teléfono" required />
              <input type="text" v-model="newClient.descripcion" placeholder="Descripción" required />
              <div class="modal-actions">
                <button type="submit" class="submit-btn">Agregar Cliente</button>
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
        showModal: false
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
      }
    },
    async created() {
      await this.fetchClients();
    }
  };
  </script>
  
  <style scoped>
  .clients-container {
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
  .client-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    margin: 20px 0;
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    overflow: hidden;
  }

  .client-table th, .client-table td {
    padding: 12px 15px;
    text-align: left;
  }

  .client-table th {
    background-color: #f35c5c;
    color: white;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-size: 16px;
  }

  .client-table tbody tr {
    background-color: #f8f8f8;
    border-bottom: 1px solid #ddd;
  }

  .client-table tbody tr:nth-child(even) {
    background-color: #f2f2f2;
  }

  .client-table tbody tr:hover {
    background-color: #e0f7fa;
    cursor: pointer;
  }

  .client-table td {
    font-size: 15px;
    color: #333;
  }

  .client-table tr:last-child td {
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

.client-form {
  display: flex;
  flex-direction: column;
}

.client-form h3 {
  margin-bottom: 15px;
  font-size: 20px;
  text-align: center;
}

.client-form input {
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
  font-size: 16px;
}

.close-btn {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}
  </style>
  