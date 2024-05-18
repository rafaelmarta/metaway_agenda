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

    <table class="table table-responsive">
      <tbody>
        <tr v-for="(contact, index) in allContacts" :key="index">
          <td>
            <img
              src="/icons/blank-user.svg"
              class="rounded-circle bg-info-subtle"
              width="30"
            />
          </td>
          <td>{{ contact.pessoa.nome }}</td>
          <td>{{ contact.tag }}</td>
          <td>{{ contact.email || contact.telefone }}</td>
          <td>
            <img
              :src="
                contact.favoritado
                  ? '/icons/star-filled.svg'
                  : '/icons/star.svg'
              "
              alt="Favorite icon"
              width="22"
            />
          </td>
          <td>
            <img
              src="/icons/edit.svg"
              class="rounded-circle bg-warning-subtle"
              alt="Edit icon"
              @click="openModal(contact)"
              width="22"
            />
          </td>
          <td>
            <img
              src="/icons/eraser.svg"
              class="rounded-circle bg-danger-subtle"
              alt="Delete icon"
              width="22"
            />
          </td>
        </tr>
      </tbody>
    </table>

    <div
      v-if="selectedContact"
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
              {{ selectedContact.pessoa.nome }}
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.stop.prevent="editContact">
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input
                  type="email"
                  class="form-control"
                  id="email"
                  v-model="selectedContact.email"
                />
              </div>
              <div class="mb-2">
                <label for="text" class="form-label">cpf</label>
                <input
                  type="cpf"
                  class="form-control"
                  id="cpf"
                  v-model="selectedContact.pessoa.cpf"
                />
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
            <button type="button" class="btn btn-primary">Salvar</button>
          </div>
        </div>
      </div>
    </div>
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
      allContacts: [],
      searchTermo: "",
      pictures: [],
      selectedContact: null,
    };
  },

  async mounted() {
    try {
      const loggedUser = localStorage.getItem("loggedUser");

      const contactsResponse = await api.getContacts(loggedUser);
      this.contacts = contactsResponse.data;

      // const picturesResponse = await api.getPictures(userId);
      // this.pictures = picturesResponse.data;

      const favoritesResponse = await api.getFavorites();
      this.favorites = favoritesResponse.data.map((favorite) => ({
        ...favorite,
        favoritado: true,
      }));

      this.allContacts = [
        ...this.favorites,
        ...this.contacts.filter(
          (contact) =>
            !this.favorites.find((favorite) => favorite.id === contact.id)
        ),
      ].sort((a, b) => a.pessoa.nome.localeCompare(b.pessoa.nome));

      // const picture = this.allContacts.map(async (contact) => {
      //   const pictureResponse = await api.getPictures(contact.pessoa.foto.id);
      //   return { ...contact, avatar: pictureResponse.data };
      // });

      // this.allContacts = await Promise.all(picture);

      console.log(this.allContacts);
    } catch (error) {
      console.log(`ERRO: ${error}`);
    }
  },

  methods: {
    openModal(contact) {
      this.selectedContact = { ...contact };

      let myModal = new bootstrap.Modal(document.getElementById("myModal"), {});

      myModal.show();
    },
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
<style>
.table-response {
  display: block;
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
</style>
