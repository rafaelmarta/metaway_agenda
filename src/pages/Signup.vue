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
          <DatePicker
            v-model="formData.dataNascimento"
            :enable-time-picker="false"
            :format="format"
            :teleport="true"
          />
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

  <div
    class="modal fade"
    id="successModal"
    tabindex="-1"
    aria-labelledby="successModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="successModalLabel">Successo</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          Conta criada com sucesso, gostaria de fazer login?
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Não
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="login"
            data-bs-dismiss="modal"
          >
            Sim
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, ref } from "@vue/runtime-dom";
import DatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { vMaska } from "maska";
import api from "../api";

const date = ref(new Date());

const format = (date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const formattedDay = day < 10 ? "0" + day : day;
  const formattedMonth = month < 10 ? "0" + month : month;

  return `${year}-${formattedMonth}-${formattedDay}`;
};

export default defineComponent({
  name: "Signup",
  components: {
    DatePicker,
  },
  directives: {
    maska: vMaska,
  },
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

    async function submitForm() {
      if (formData.password.length < 8) {
        alert("Senha deve conter ao menos 8 caracteres");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        alert("As senhas não coincidem.");
        return;
      }

      try {
        const response = await api.login("admin", "12345678");
        localStorage.setItem("accessToken", response.data.accessToken);
      } catch (error) {
        console.log("error: ", error);
      }

      if (localStorage.getItem("accessToken")) {
        let transformedData = {
          usuario: {
            cpf: formData.cpf,
            nome: formData.nome,
            dataNascimento: format(formData.dataNascimento),
            telefone: formData.telefone,
            email: formData.email,
            username: formData.username,
            password: formData.password,
          },
          tipos: [formData.tipoUsuario === "1" ? "ROLE_ADMIN" : "ROLE_USER"],
        };
        console.log("Submit", transformedData);

        const responseSignup = await api.signup(transformedData);
        console.log("response: ", responseSignup);

        if (responseSignup.data.message === "Operação realizada com sucesso.") {
          var myModal = new bootstrap.Modal(
            document.getElementById("successModal")
          );
          myModal.show();
        }
      }

      localStorage.removeItem("accessToken");
    }

    async function login() {
      try {
        const response = await api.login(formData.username, formData.password);
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("loggedUser", response.data.id);
        this.$router.push("/");
      } catch (error) {
        console.log("error: ", error);
      }
    }

    return {
      formData,
      submitForm,
      format,
      login,
    };
  },
});
</script>
<style lang=""></style>
