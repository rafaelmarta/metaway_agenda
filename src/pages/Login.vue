<template>
  <div class="d-flex justify-content-center align-items-center vh-100">
    <div class="col-md-6">
      <div>
        <div class="text-center">
          <h1>Login</h1>
        </div>
        <form>
          <div class="form-group">
            <label>Usuario</label>
            <input type="text" class="form-control" v-model="username" />
          </div>
          <div class="form-group">
            <label>Senha</label>
            <input type="password" class="form-control" v-model="password" />
          </div>

          <div class="my-3 text-center">
            <button
              type="submit"
              class="btn btn-primary"
              @click.prevent="login"
            >
              Entrar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
import api from "../api";

export default {
  data() {
    return {
      username: "",
      password: "",
    };
  },

  methods: {
    async login() {
      try {
        const response = await api.login(this.username, this.password);
        localStorage.setItem("accessToken", response.data.accessToken);
        this.$router.push("/");
      } catch (error) {
        console.log("error: ", error);
      }
    },
  },
};
</script>
<style lang=""></style>
