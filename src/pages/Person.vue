<template lang="">
  <Navigation>
    <h1>Person</h1>
    <div class="container">
      <h2 class="my-4 text-center">Pessoa</h2>
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
      </form>
    </div>
  </Navigation>
</template>
<script>
import Navigation from "../components/Navigation.vue";
import api from "../api";
import { useRoute } from "vue-router";
import {
  defineComponent,
  reactive,
  ref,
  onMounted,
  computed,
} from "@vue/runtime-dom";
import { vMaska } from "maska";

export default defineComponent({
  name: "Person",
  components: { Navigation },
  directives: {
    maska: vMaska,
  },
  // data() {
  //   return {
  //     person: {},
  //   };
  // },

  // async mounted() {
  //   const route = useRoute();
  //   const personId = route.params.personId;

  //   const personResponse = await api.getPerson(personId);
  //   this.person = response.data;
  // },
  setup() {
    const person = ref({});
    const formData = ref({});

    onMounted(async () => {
      const route = useRoute();
      const personId = route.params.personId;

      const personResponse = await api.getPerson(personId);
      person.value = personResponse.data;

      formData.value = {
        nome: person.value.nome,
        cpf: person.value.cpf,
      };
    });

    // const nome = computed(() => person.value.nome);
    // const cpf = computed(() => person.value.cpf);

    // const formData = reactive({
    //   nome: nome.value,
    //   cpf: cpf.value,
    // });

    return {
      formData,
      person,
    };
  },
});
</script>
<style lang=""></style>
