<template>
  <div class="register-container">
    <h1 class="title">Restaurant Manager</h1>
    
    <div class="register-box">
      <h2>Registro</h2>
      <form @submit.prevent="register">
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
        
        <div class="input-group">
          <label for="confirmarContrasena">Confirmar Contraseña:</label>
          <input 
            type="password" 
            id="confirmarContrasena" 
            v-model="formData.confirmarContrasena"
            required
          />
        </div>
        
        <button type="submit" class="register-btn">
          Registrarse
        </button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Register',
  data() {
    return {
      formData: {
        usuario: '',
        contrasena: '',
        confirmarContrasena: ''
      }
    }
  },
  methods: {
  async register() {
    if (this.formData.contrasena !== this.formData.confirmarContrasena) {
      alert('Las contraseñas no coinciden');
      return;
    }
    
    try {
      const response = await axios.post('http://localhost:4001/usuarios/usuario', {
        nombre: this.formData.usuario,
        contraseña: this.formData.contrasena,
        rol: 'usuario' 
      });
      
      if (response.status === 201) {
        alert('Registro exitoso! Ahora puedes iniciar sesión.');
        this.$router.push('/');
      }
    } catch (err) {
      alert('Error al registrarse: ' + (err.response ? err.response.data.error : err.message));
    }
  }
}

}
</script>

<style scoped>
.register-container {
  padding: 2rem;
  max-width: 500px;
  margin: 0 auto;
}

.title {
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #000;
}

.register-box {
  background: #F56767;
  padding: 2rem;
}

.input-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #000;
}

input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
}

.register-btn {
  background: #f35c5c;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
}
</style>
  