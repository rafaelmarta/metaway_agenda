<template>
  <div class="container">
    <h2 class="my-4 text-center">Novo usuário</h2>
    <form @submit.prevent="submitForm">
      <div class="row">
        <div class="col-md-4 mb-3">
          <label for="username" class="form-label">Nome de usuário</label>
          <input
            type="text"
            class="form-control"
            id="username"
            v-model="formData.username"
            required
          />
        </div>
        <div class="col-md-4 mb-3">
          <label for="password" class="form-label">Senha</label>
          <input
            type="password"
            class="form-control"
            id="password"
            v-model="formData.password"
            required
          />
        </div>
        <div class="col-md-4 mb-3">
          <label for="confirmPassword" class="form-label"
            >Confirmar Senha</label
          >
          <input
            type="password"
            class="form-control"
            id="confirmPassword"
            v-model="formData.confirmPassword"
            required
          />
        </div>
      </div>
      <div class="row">
        <div class="col-md-4 mb-3">
          <label for="nome" class="form-label">Nome</label>
          <input
            type="text"
            class="form-control"
            id="nome"
            v-model="formData.nome"
            required
          />
        </div>
        <div class="col-md-4 mb-3">
          <label for="cpf" class="form-label">CPF</label>
          <input
            type="text"
            class="form-control"
            id="cpf"
            v-model="formData.cpf"
            v-maska
            data-maska="###.###.###-##"
            required
          />
        </div>
        <div class="col-md-4 mb-3">
          <label for="dataNascimento" class="form-label">Data Nascimento</label>
          <DatePicker v-model="formData.dataNascimento" :teleport="true" />
        </div>
      </div>
      <div class="row">
        <div class="col-md-4 mb-3">
          <label for="email" class="form-label">E-mail</label>
          <input
            type="email"
            class="form-control"
            id="email"
            v-model="formData.email"
            required
          />
        </div>
        <div class="col-md-4 mb-3">
          <label for="telefone" class="form-label">Telefone</label>
          <input
            type="tel"
            class="form-control"
            id="telefone"
            v-model="formData.telefone"
            v-maska
            data-maska="(##) #####-####"
            required
          />
        </div>
        <div class="col-md-4 mb-3">
          <label class="form-label" for="roleSelect">Tipo de conta</label>
          <select
            class="form-select"
            id="roleSelect"
            v-model="formData.tipoUsuario"
          >
            <option value="1">Administrador</option>
            <option value="2">Usuário</option>
          </select>
        </div>
      </div>
      <div class="d-flex justify-content-center">
        <router-link to="/login">
          <button type="button" class="btn btn-primary me-2">
            Voltar a tela de login
          </button>
        </router-link>
        <button type="submit" class="btn btn-primary text-center">Criar</button>
      </div>
    </form>
  </div>
</template>

<script>
import { defineComponent, reactive } from "@vue/runtime-dom";
import DatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { vMaska } from "maska";

export default defineComponent({
  name: "Signup",
  components: {
    DatePicker,
  },
  directives: {
    maska: vMaska,
  },
  // data: () => ({
  //   options: {
  //     mask: "#-#",
  //     eager: true,
  //   },
  // }),
  setup() {
    const formData = reactive({
      username: "",
      password: "",
      confirmPassword: "",
      nome: "",
      dataNascimento: "",
      cpf: "",
      email: "",
      telefone: "",
      tipoUsuario: "1",
    });

    function submitForm() {
      console.log("Submit", formData);
    }

    return {
      formData,
      submitForm,
    };
  },
});
</script>
<style lang=""></style>
