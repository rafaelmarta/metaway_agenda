<template>
  <div>
    <Navigation>
      <div class="mt-5 mb-3 form-group row justify-content-center">
        <div class="col-sm-8 col-lg-6">
          <div class="input-group">
            <input type="text" class="form-control" v-model="searchTermo" />
            <button class="btn btn-outline-warning" @click="search">
              Pesquisar
            </button>
            <button
              class="btn btn-success ml-3"
              data-bs-toggle="modal"
              data-bs-target="#addContactModal"
              @click="openModal(0)"
            >
              Adicionar
            </button>
          </div>
        </div>
      </div>

      <table class="table table-responsive">
        <tbody class="text-center">
          <th>ID</th>
          <th>Nome</th>
          <th>Username</th>
          <th>Email</th>
          <th>Telefone/Celular</th>
          <th>Data de nascimento</th>
          <th>Editar</th>
          <tr v-for="(user, index) in allUsers" :key="index">
            <td>{{ user.id }}</td>
            <td>{{ user.nome }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.telefone }}</td>
            <td>{{ user.dataNascimento }}</td>
            <td>
              <img
                src="/icons/edit.svg"
                class="rounded-circle bg-warning-subtle"
                alt="Edit icon"
                width="22"
                @click="openModal(user.id)"
              />
            </td>
          </tr>
        </tbody>
      </table>

      <div
        class="modal fade"
        id="myModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">
                Adicionar Usuário
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <form>
                <div class="mb-3">
                  <label for="username" class="form-label">Username</label>
                  <input
                    type="text"
                    class="form-control"
                    id="username"
                    v-model="newUser.username"
                  />
                </div>
                <div class="mb-3">
                  <label for="password" class="form-label">Senha</label>
                  <input
                    type="password"
                    class="form-control"
                    id="password"
                    v-model="newUser.password"
                  />
                  <span v-if="!isPasswordValid" class="text-danger">
                    A senha deve ter pelo menos 8 caracteres, incluindo letras e
                    números.
                  </span>
                </div>
                <div class="mb-3">
                  <label for="confirmPassword" class="form-label"
                    >Confirmar Senha</label
                  >
                  <input
                    type="password"
                    class="form-control"
                    id="confirmPassword"
                    v-model="newUser.confirmPassword"
                  />
                </div>
                <div class="mb-3">
                  <label for="nome" class="form-label">Nome</label>
                  <input
                    type="text"
                    class="form-control"
                    id="nome"
                    v-model="newUser.nome"
                  />
                </div>
                <div class="mb-3">
                  <label for="cpf" class="form-label">CPF</label>
                  <input
                    type="text"
                    class="form-control"
                    id="cpf"
                    v-model="newUser.cpf"
                    v-maska
                    data-maska="###.###.###-##"
                  />
                </div>
                <div class="mb-3">
                  <label for="dataNascimento" class="form-label"
                    >Data Nascimento</label
                  >
                  <DatePicker
                    v-model="newUser.dataNascimento"
                    :enable-time-picker="false"
                    :format="format"
                    :teleport="true"
                  />
                </div>
                <div class="mb-3">
                  <label for="email" class="form-label">E-mail</label>
                  <input
                    type="text"
                    class="form-control"
                    id="email"
                    v-model="newUser.email"
                  />
                </div>
                <div class="col-md-4 mb-3">
                  <label for="telefone" class="form-label">Telefone</label>
                  <input
                    type="tel"
                    class="form-control"
                    id="telefone"
                    v-model="newUser.telefone"
                    v-maska
                    :data-maska="contactMask"
                    required
                  />
                </div>
                <div class="mb-3">
                  <label class="form-label" for="roleSelect"
                    >Tipo de conta</label
                  >
                  <select
                    class="form-select"
                    id="roleSelect"
                    v-model="newUser.tipoUsuario"
                  >
                    <option value="1">Administrador</option>
                    <option value="2">Usuário</option>
                  </select>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Fechar
              </button>
              <button
                type="button"
                class="btn btn-primary"
                @click="addUser"
                :disabled="!isFormValid"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      </div>
    </Navigation>
  </div>
</template>
<script>
import Navigation from "../components/Navigation.vue";
import { defineComponent, reactive, ref } from "vue";
import api from "../api";
import { vMaska } from "maska";
import { useToast } from "vue-toastification";
import DatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

const date = ref(new Date());

const format = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const formattedDay = day < 10 ? "0" + day : day;
  const formattedMonth = month < 10 ? "0" + month : month;

  return `${year}-${formattedMonth}-${formattedDay}`;
};

export default {
  components: { Navigation, DatePicker },
  directives: {
    maska: vMaska,
  },
  data() {
    return {
      myModal: null,
      allUsers: [],
      selectedUser: null,
      searchTermo: "",
      currentUser: {},
      newUser: {
        username: "",
        password: "",
        confirmPassword: "",
        nome: "",
        cpf: "",
        dataNascimento: "",
        email: "",
        telefone: "",
        tipoUsuario: "1",
        id: null,
      },
    };
  },

  async mounted() {
    try {
      await this.search();
    } catch (error) {}
  },

  computed: {
    contactMask() {
      if (this.newUser.telefone.length <= 14) {
        return "(##) ####-####";
      } else {
        return "(##) #####-####";
      }
    },
    isPasswordValid() {
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
      return passwordRegex.test(this.newUser.password);
    },
    isFormValid() {
      return (
        this.newUser.username &&
        this.isPasswordValid &&
        this.newUser.password === this.newUser.confirmPassword &&
        this.newUser.nome &&
        this.newUser.cpf &&
        this.newUser.dataNascimento &&
        this.newUser.email &&
        this.newUser.telefone &&
        this.newUser.tipoUsuario
      );
    },
  },

  methods: {
    async search() {
      const toast = useToast();
      try {
        const usersResponse = await api.getUsers(this.searchTermo);
        this.allUsers = usersResponse.data;

        this.allUsers.sort((a, b) => a.nome.localeCompare(b.nome));
      } catch (error) {
        if (error.response.status === 401) {
          toast.error("Não autorizado");
        } else {
          toast.error("Não foi possível buscar a lista de contatos.");
        }
      }
    },
    resetForm() {
      this.newUser = {
        username: "",
        password: "",
        confirmPassword: "",
        nome: "",
        cpf: "",
        dataNascimento: "",
        email: "",
        telefone: "",
        tipoUsuario: "1",
        id: null,
      };
    },
    async openModal(userId) {
      if (userId === 0) {
        this.resetForm();
      } else {
        this.user = await api.getUser(userId);

        this.newUser = this.user.data.object.usuario;
        this.newUser.password = "";
        // console.log("this.new user", this.newUser);
      }

      if (document.getElementById("myModal")) {
        this.myModal = new bootstrap.Modal(
          document.getElementById("myModal"),
          {}
        );
        this.myModal.show();
      }
    },
    async addUser() {
      const toast = useToast();

      if (this.newUser.password.length < 8) {
        toast.error("Senha deve conter ao menos 8 caracteres");
        return;
      }
      if (this.newUser.password !== this.newUser.confirmPassword) {
        toast.error("As senhas não coincidem.");
        return;
      }

      let transformedData = {
        usuario: {
          cpf: this.newUser.cpf,
          nome: this.newUser.nome,
          dataNascimento: format(this.newUser.dataNascimento),
          telefone: this.newUser.telefone,
          email: this.newUser.email,
          username: this.newUser.username,
          password: this.newUser.password,
          id: this.newUser.id,
        },
        tipos: [this.newUser.tipoUsuario === "1" ? "ROLE_ADMIN" : "ROLE_USER"],
      };

      try {
        const responseSignup = await api.signup(transformedData);

        if (responseSignup.status === 200) {
          this.myModal.hide();
          await this.search();

          toast.success("Usuário adicionado com sucesso.");
        } else {
          throw new Error();
        }
      } catch (error) {
        toast.error("Erro ao adicionar usuário.");
        console.error(error);
      }
    },
  },
};
</script>
<style lang=""></style>
