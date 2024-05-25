<template>
  <div>
    <Navigation>
      <div class="mt-5 mb-3 form-group row justify-content center">
        <div class="col-sm-8 col-lg-6">
          <div class="input-group">
            <input type="text" class="form-control" v-model="searchTermo" />
            <button class="btn btn-success" @click="search">Pesquisar</button>
          </div>
        </div>
      </div>

      <table class="table table-responsive">
        <tbody class="text-center">
          <th>Nome</th>
          <th>Descrição</th>
          <th>Email</th>
          <th>Tipo de contato</th>
          <th>Telefone/Celular</th>
          <th>Privacidade</th>
          <th>Editar</th>
          <th>Remover</th>
          <tr v-for="(contact, index) in allContacts" :key="index">
            <td>{{ contact.pessoa.nome }}</td>
            <td>{{ contact.tag }}</td>
            <td>{{ contact.email }}</td>
            <td>{{ contact.tipoContato }}</td>
            <td>{{ contact.telefone }}</td>
            <td>{{ contact.privado ? "Privado" : "Público" }}</td>
            <td>
              <router-link :to="`/contact/${contact.id}`">
                <img
                  src="/icons/edit.svg"
                  class="rounded-circle bg-warning-subtle"
                  alt="Edit icon"
                  width="22"
                />
              </router-link>
            </td>
            <td>
              <img
                src="/icons/eraser.svg"
                class="rounded-circle bg-danger-subtle"
                alt="Delete icon"
                width="22"
                @click="openModal(person.id)"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </Navigation>
  </div>
</template>
<script>
import Navigation from "../components/Navigation.vue";
import api from "../api";

export default {
  components: { Navigation },

  data() {
    return {
      allContacts: [],
      selectedContact: null,
      searchTermo: "",
    };
  },

  async mounted() {
    try {
      const loggedUser = localStorage.getItem("loggedUser");

      const contactsResponse = await api.getContacts(loggedUser);
      this.allContacts = contactsResponse.data;
    } catch (error) {
      console.log(Error);
    }
  },

  methods: {
    async search() {
      try {
        const searchResponse = await api.searchContacts(this.searchTermo);
        this.allContacts = searchResponse.data;
      } catch (error) {
        console.log("erro: ", error);
      }
    },
  },
};
</script>
<style lang=""></style>
