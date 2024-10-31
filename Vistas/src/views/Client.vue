<template>
    <Layout>
      <div class="clients-container">
        <h2>Clientes</h2>
        <ul v-if="clients.length">
          <li v-for="client in clients" :key="client.id">
            <p>Nombre: {{ client.nombre }}</p>
            <p>Dirección: {{ client.direccion }}</p>
            <p>Teléfono: {{ client.telefono }}</p>
            <p>Descripción: {{ client.descripcion }}</p>
          </li>
        </ul>
        <form @submit.prevent="insertClient" class="client-form">
          <h3>Agregar Nuevo Cliente</h3>
          <input type="text" v-model="newClient.nombre" placeholder="Nombre" required />
          <input type="text" v-model="newClient.direccion" placeholder="Dirección" required />
          <input type="text" v-model="newClient.telefono" placeholder="Teléfono" required />
          <input type="text" v-model="newClient.descripcion" placeholder="Descripción" required />
          <button type="submit">Agregar Cliente</button>
        </form>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        <p v-if="successMessage" class="success">{{ successMessage }}</p>
      </div>
    </Layout>
  </template>
  
  <script>
  import axios from 'axios';
  import Layout from '../components/Layout.vue';
  
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
        successMessage: ''
      };
    },
    methods: {
      async fetchClients() {
        try {
          const response = await axios.get('http://localhost:4001/clientes');
          this.clients = response.data;
        } catch (err) {
          this.errorMessage = 'Error al cargar clientes: ' + err.message;
        }
      },
      async insertClient() {
        try {
          const response = await axios.post('http://localhost:4001/clientes/cliente', this.newClient);
          if (response.status === 201) {
            this.successMessage = 'Cliente agregado con éxito';
            this.newClient = { nombre: '', direccion: '', telefono: '', descripcion: '' };
            this.fetchClients(); // Actualiza la lista
          }
        } catch (err) {
          this.errorMessage = 'Error al agregar cliente: ' + err.message;
        }
      }
    },
    created() {
      this.fetchClients();
    }
  };
  </script>
  
  <style scoped>
  .clients-container {
    width: 100%;
    max-width: 600px;
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
  </style>
  