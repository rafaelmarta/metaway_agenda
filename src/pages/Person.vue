<template lang="">
  <Navigation>
    <div class="container">
      <div class="my-5 text-center">
        <img
          v-if="!isNewPerson"
          :src="personAvatar || 'icons/blank-user.svg'"
          height="250"
        />
        <div class="text-center">
          <label v-if="!isNewPerson" for="avatar" class="form-label"
            >Alterar foto</label
          >
          <input
            type="file"
            class="form-control d-none"
            id="avatar"
            accept="image/*"
            @change="handleFileChange($event)"
          />
        </div>
      </div>
      <form @submit.prevent="submitForm">
        <div class="row">
          <div class="col-md-8 mb-3">
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
        </div>
        <div class="row">
          <div class="col-md-2 mb-3">
            <label for="cep" class="form-label">CEP</label>
            <input
              type="text"
              class="form-control"
              id="cep"
              v-model="formData.cep"
              v-maska
              data-maska="#####-###"
              required
            />
          </div>
          <div class="col-md-5 mb-3">
            <label for="logradouro" class="form-label">Logradouro</label>
            <input
              type="text"
              class="form-control"
              id="logradouro"
              v-model="formData.logradouro"
              required
            />
          </div>
          <div class="col-md-3 mb-3">
            <label for="bairro" class="form-label">Bairro</label>
            <input
              type="text"
              class="form-control"
              id="bairro"
              v-model="formData.bairro"
              required
            />
          </div>
          <div class="col-md-2 mb-3">
            <label for="numero" class="form-label">Número</label>
            <input
              type="number"
              class="form-control"
              id="numero"
              v-model="formData.numero"
              required
              @input="validateNumber"
              min="0"
              step="1"
            />
          </div>
        </div>
        <div class="row">
          <div class="col-md-8 mb-3">
            <label for="cidade" class="form-label">Cidade</label>
            <input
              type="text"
              class="form-control"
              id="cidade"
              v-model="formData.cidade"
              required
            />
          </div>
          <div class="col-md-2 mb-3">
            <label for="estado" class="form-label">Estado</label>
            <input
              type="text"
              class="form-control"
              id="estado"
              v-model="formData.estado"
              required
            />
          </div>
          <div class="col-md-2 mb-3">
            <label for="pais" class="form-label">País</label>
            <input
              type="text"
              class="form-control"
              id="pais"
              v-model="formData.pais"
              required
            />
          </div>
        </div>
        <div class="d-flex justify-content-center">
          <router-link to="/people">
            <button class="btn btn-danger me-2">Retornar</button>
          </router-link>
          <button type="submit" class="btn btn-primary text-center">
            Criar
          </button>
        </div>
      </form>
    </div>

    <div class="position-fixed bottom-0 end-0 p-3">
      <div
        class="toast align-items-center text-bg-danger border-0"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        id="failedToast"
      >
        <div class="toast-header">
          <strong class="me-auto">ERRO: </strong>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="toast"
            aria-label="Close"
          ></button>
        </div>
        <div class="toast-body">CEP não encontrado.</div>
      </div>
    </div>
  </Navigation>
</template>
<script>
import Navigation from "../components/Navigation.vue";
import api from "../api";
import { useRoute, useRouter } from "vue-router";
import {
  defineComponent,
  reactive,
  ref,
  onMounted,
  computed,
  watch,
} from "@vue/runtime-dom";
import { vMaska } from "maska";

export default defineComponent({
  name: "Person",
  components: { Navigation },
  directives: {
    maska: vMaska,
  },
  methods: {
    validateNumber(event) {
      let value = event.target.value;
      if (value < 0) {
        this.formData.numero = 0;
      } else if (!Number.isInteger(Number(value))) {
        this.formData.numero = Math.floor(value);
      }
    },
  },
  setup() {
    const router = useRouter();
    const person = ref({});
    const formData = ref({});
    let personAvatar = ref("/icons/user-plus.svg");
    const route = useRoute();
    const personIdRef = ref(route.params.personId);

    watch(
      () => formData.value.cep,
      async (newCep, oldCep) => {
        if (newCep && newCep !== oldCep && newCep.length === 9) {
          try {
            const cepResponse = await api.getCep(newCep);

            if (cepResponse.data.erro) {
              const toast = new bootstrap.Toast(
                document.getElementById("failedToast")
              );
              toast.show();

              setTimeout(() => {
                toast.hide();
              }, 3000);
            } else {
              formData.value = {
                nome: formData.value.nome,
                cpf: formData.value.cpf,
                cep: cepResponse.data.cep,
                logradouro: cepResponse.data.logradouro,
                bairro: cepResponse.data.bairro,
                cidade: cepResponse.data.localidade,
                estado: cepResponse.data.uf,
                numero: formData.value.numero,
                pais: "BR",
              };
            }
          } catch (error) {
            console.error(`ERRO: ${error}`);
          }
        }
      }
    );

    function handleFileChange(event) {
      const file = event.target.files[0];
      if (!file) return;

      const personId = personIdRef.value;

      changePicture(file, personId);
    }

    async function setupPerson() {
      const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));

      const personResponse = await api.getPerson(personIdRef.value);
      person.value = personResponse.data;

      const axiosConfig = {
        responseType: "blob",
        headers: {
          "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${loggedUser.token}`,
        },
      };

      try {
        const pictureResponse = await api.getPictures(
          personIdRef.value,
          axiosConfig
        );

        if (pictureResponse.data) {
          const blob = new Blob([pictureResponse.data], {
            type: pictureResponse.headers["content-type"],
          });
          personAvatar.value = URL.createObjectURL(blob);
        }
      } catch (error) {
        console.error(`ERRO: ${error}`);
        personAvatar.value = "/icons/user-plus.svg";
      }

      formData.value = {
        nome: person.value.object.nome,
        cpf: person.value.object.cpf,
        cep: person.value.object.endereco.cep,
        logradouro: person.value.object.endereco.logradouro,
        numero: person.value.object.endereco.numero,
        bairro: person.value.object.endereco.bairro,
        cidade: person.value.object.endereco.cidade,
        estado: person.value.object.endereco.estado,
        pais: person.value.object.endereco.pais,
      };
    }

    async function changePicture(file, personId) {
      const formData = new FormData();
      formData.append("id", personId);
      formData.append("foto", file);

      try {
        const responseUploadPicture = await api.uploadPicture(
          formData,
          personId
        );
        person.value.object.foto = {
          id: responseUploadPicture.data.object.id,
          name: responseUploadPicture.data.object.name,
          type: responseUploadPicture.data.object.type,
        };

        submitForm();
      } catch (error) {
        console.error("error: ", error);
      }
    }

    async function submitForm() {
      const filteredData = Object.fromEntries(
        Object.entries(formData).filter(
          ([key, value]) => value !== null && value !== ""
        )
      );

      const personId = personIdRef.value;

      const userExists = personId !== "0";

      let foto = null;

      if (userExists && person.value.object.foto) {
        foto = person.value.object.foto;
      }

      let transformedData = {
        cpf: formData.value.cpf,
        nome: formData.value.nome,
        id: userExists ? personId : null,
        foto: foto,
        endereco: {
          id: userExists ? personId : null,
          bairro: formData.value.bairro,
          cep: formData.value.cep,
          cidade: formData.value.cidade,
          estado: formData.value.estado,
          logradouro: formData.value.logradouro,
          numero: formData.value.numero,
          pais: formData.value.pais,
        },
      };

      const updatePersonResponse = await api.updatePerson(transformedData);

      personIdRef.value = updatePersonResponse.data.object.id;
      router.push(`/person/${personIdRef.value}`);

      const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
      const axiosConfig = {
        responseType: "blob",
        headers: {
          "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${loggedUser.token}`,
        },
      };

      try {
        const pictureResponse = await api.getPictures(
          personIdRef.value,
          axiosConfig
        );

        if (pictureResponse.data) {
          const blob = new Blob([pictureResponse.data], {
            type: pictureResponse.headers["content-type"],
          });
          personAvatar.value = URL.createObjectURL(blob);
        }
      } catch (error) {
        console.error(`ERRO: ${error}`);
        personAvatar.value = "/icons/user-plus.svg";
      }

      await setupPerson();
    }

    onMounted(async () => {
      await setupPerson();
    });

    const isNewPerson = computed(() => personIdRef.value === "0");

    return {
      formData,
      person,
      personAvatar,
      submitForm,
      isNewPerson,
      handleFileChange,
    };
  },
});
</script>
<style>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
