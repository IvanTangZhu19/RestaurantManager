<template>
  <div class="login-container">
    <div class="login-wrapper">
      <h1 class="main-title">Restaurant Manager</h1>
      
      <div class="form-container">
        <h2 class="form-title">Inicio de Sesión</h2>
        
        <form @submit.prevent="login">
          <div class="input-group">
            <label for="usuario">Usuario:</label>
            <input 
              type="text" 
              id="usuario" 
              v-model="formData.usuario"
              required
            />
          </div>
          <div class="input-group">
            <label for="contrasena">Contraseña:</label>
            <input 
              type="password" 
              id="contrasena" 
              v-model="formData.contrasena"
              required
            />
          </div>
          <p class="error">{{ this.formData.error }}</p>
          <button type="submit" class="submit-btn">
            Iniciar
          </button>
          
          <p class="register-link">
            Si no te has registrado: 
            <router-link to="/register">Registrarse aquí</router-link>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';
import EventBus  from '../event-bus.js';
export default {
  name: 'Login',
  data() {
    return {
      formData: {
        usuario: '',
        contrasena: '',
        error: ''
      }
    }
  },
  methods: {
  async login() {
    try {
      const response = await axios.post('http://localhost:4001/usuarios/login', {
        nombre: this.formData.usuario,
        contraseña: this.formData.contrasena,
      });
      if (response.data.status) { 
        this.enviarDato();
        this.$router.push('/sales'); 
        this.mostrarAlerta();
      } else {
        this.formData.error = 'Credenciales incorrectas';
      }
    } catch (err) {
      this.formData.error = 'Error en login: ' + (err.response ? err.response.data.mensaje : err.message);
    }
  },
  mostrarAlerta() {
    Swal.fire({
      title: '¡Inicio de Sesión exitoso!',
      icon: 'success',
      confirmButtonText: 'Aceptar'
    });
  },
  enviarDato() {
    const username = this.formData.usuario;
    EventBus.emit('usuario', {usuario: username});
  }
}

}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  padding: 1rem;
}

.login-wrapper {
  width: 100%;
  max-width: 480px;
}

.main-title {
  color: #f35c5c;
  font-size: 2.5rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 2rem;
}

.form-container {
  background-color: #f35c5c;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-title {
  color: white;
  font-size: 1.5rem;
  text-align: center;
  margin-bottom: 2rem;
}

.input-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  color: white;
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  background-color: white;
  transition: all 0.3s ease;
}

input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
}

.submit-btn {
  width: 100%;
  padding: 0.75rem;
  background-color: #a63d3d;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-btn:hover {
  background-color: #8b2f2f;
}

.register-link {
  margin-top: 1rem;
  text-align: center;
  color: white;
}

.error {
  margin-top: 1rem;
  text-align: right;
  font-weight: bold;
  color: #8B0000;
}


.register-link a {
  color: white;
  text-decoration: underline;
}

.register-link a:hover {
  color: #ffe0e0;
}
</style>
  