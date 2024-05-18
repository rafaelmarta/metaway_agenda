<template>
  <Navigation>
    <h1>Home</h1>
    <div class="form-group row justify-content-center">
      <div class="col-sm-8 col-lg-6">
        <div class="input-group">
          <input type="text" class="form-control" v-model="searchTermo" />
          <button class="btn btn-success" @click="search">Pesquisar</button>
        </div>
      </div>
    </div>

    <h2>Favoritos</h2>
    <ul>
      <li v-for="(favorite, index) in favorites" :key="index">
        {{ favorite.pessoa.nome }}
      </li>
    </ul>

    <h2>Contatos</h2>
    <ul>
      <li v-for="(contact, index) in contacts" :key="index">
        {{ contact.pessoa.nome }}
      </li>
    </ul>
  </Navigation>
</template>

<script>
import Navigation from "../components/Navigation.vue";
import api from "../api";

export default {
  components: { Navigation },

  data() {
    return {
      contacts: [],
      favorites: [],
      searchTermo: "",
    };
  },

  async mounted() {
    try {
      const userId = localStorage.getItem("userId");

      const contactsResponse = await api.getContacts(userId);
      this.contacts = contactsResponse.data;

      const favoritesResponse = await api.getFavorites();
      this.favorites = favoritesResponse.data;
    } catch (error) {
      console.log(`ERRO: ${error}`);
    }
  },

  methods: {
    async search() {
      try {
        const searchResponse = await api.searchContacts(this.searchTermo);
        this.contacts = searchResponse.data;
      } catch (error) {
        console.log(`ERRO: ${error}`);
      }
    },
  },
};
</script>
<style lang=""></style>
