<template>
  <Navigation>
    <div class="container">
      <h2 class="my-4 text-center">Meu cadastro</h2>
      <form @submit.prevent="submitForm(formData)">
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
            <span v-if="!isPasswordValid" class="text-danger">
              A senha deve ter pelo menos 8 caracteres, incluindo letras e
              números.
            </span>
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
              v-if="!isConfirmPasswordValid"
              required
            />
            <span v-if="!isConfirmPasswordValid" class="text-danger">
              As senhas não são iguais.
            </span>
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
            <label for="dataNascimento" class="form-label"
              >Data Nascimento</label
            >
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
              :data-maska="telefoneMask"
              required
            />
          </div>
        </div>
        <div class="d-flex justify-content-center">
          <button
            type="submit"
            :disabled="!isFormValid"
            class="btn btn-primary text-center"
          >
            Salvar
          </button>
        </div>
      </form>
    </div>
  </Navigation>
</template>
<script>
import {
  defineComponent,
  ref,
  reactive,
  onMounted,
  computed,
  watch,
} from "vue";
import Navigation from "../components/Navigation.vue";
import DatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { vMaska } from "maska";
import api from "../api";
import { useToast } from "vue-toastification";

const format = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const formattedDay = day < 10 ? "0" + day : day;
  const formattedMonth = month < 10 ? "0" + month : month;

  return `${year}-${formattedMonth}-${formattedDay}`;
};

export default defineComponent({
  name: "User",
  components: { Navigation, DatePicker },
  directives: {
    maska: vMaska,
  },
  data() {
    return {
      isIdFromUser: false,
      user: {},
    };
  },
  async mounted() {
    const toast = useToast();
    const userData = localStorage.getItem("loggedUser");
    if (userData) {
      const { id, username } = JSON.parse(userData);

      const userResponse = await api.getUser(id);

      this.isIdFromUser =
        userResponse.data.object.usuario.username.includes(username);
      if (this.isIdFromUser) {
        this.formData = userResponse.data.object.usuario;
        this.formData.password = "";
      }
    }
  },
  setup() {
    const formData = ref({
      username: "",
      password: "",
      confirmPassword: "",
      nome: "",
      dataNascimento: "",
      cpf: "",
      email: "",
      telefone: "",
      id: 0,
    });

    const isPasswordValid = computed(() => {
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
      return passwordRegex.test(formData.value.password);
    });

    const isConfirmPasswordValid = computed(() => {
      return formData.value.password === formData.value.confirmPassword;
    });

    const isFormValid = computed(() => {
      const allFieldsHaveValue = Object.values(formData.value).every(
        (field) => field
      );

      return (
        isPasswordValid.value &&
        isConfirmPasswordValid.value &&
        allFieldsHaveValue
      );
    });

    const telefoneMask = computed(() => {
      return formData.value.telefone.length <= 14
        ? "(##) ####-####"
        : "(##) #####-####";
    });

    const isIdFromUser = ref(false);

    async function setupUser() {
      const toast = useToast();
      const userData = localStorage.getItem("loggedUser");
      if (userData) {
        const { id, username } = JSON.parse(userData);
        const userResponse = await api.getUser(id);
        isIdFromUser.value =
          userResponse.data.object.usuario.username.includes(username);

        if (isIdFromUser.value) {
          formData.username = userResponse.data.object.usuario.username;
          formData.nome = userResponse.data.object.usuario.nome;
          formData.dataNascimento =
            userResponse.data.object.usuario.dataNascimento;
          formData.cpf = userResponse.data.object.usuario.cpf;
          formData.email = userResponse.data.object.usuario.email;
          formData.telefone = userResponse.data.object.usuario.telefone;
          formData.id = userResponse.data.object.usuario.id;
        }
      }
    }

    async function submitForm(formData) {
      const toast = useToast();

      if (this.formData.password.length < 8) {
        toast.error("Senha deve conter ao menos 8 caracteres");
        return;
      }
      if (this.formData.password !== this.formData.confirmPassword) {
        toast.error("As senhas não coincidem.");
        return;
      }

      let transformedData = {
        cpf: formData.cpf,
        dataNascimento: format(formData.dataNascimento),
        email: formData.email,
        id: formData.id,
        nome: formData.nome,
        password: formData.password,
        telefone: formData.telefone,
        username: formData.username,
      };

      try {
        const updateResponse = await api.updateUser(transformedData);
        if (updateResponse.status === 200) {
          toast.success("Usuário atualizado com sucesso.");
        } else {
          throw new Error();
        }
      } catch (error) {
        toast.error("Erro ao atualizar o usuário.");
      }
    }

    onMounted(async () => {
      await setupUser();
    });

    return {
      formData,
      submitForm,
      format,
      isIdFromUser,
      isPasswordValid,
      isConfirmPasswordValid,
      isFormValid,
      telefoneMask,
    };
  },
});
</script>
<style lang=""></style>
