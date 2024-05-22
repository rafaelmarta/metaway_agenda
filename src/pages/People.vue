<template>
  <Navigation>
    <div class="mt-5 mb-3 form-group row justify-content-center">
      <div class="col-sm-8 col-lg-6">
        <div class="input-group">
          <input type="text" class="form-control" v-model="searchTermo" />
          <button class="btn btn-success" @click="search">Pesquisar</button>
          <router-link :to="`/person/0`">
            <button class="btn btn-info">Adicionar</button>
          </router-link>
        </div>
      </div>
    </div>

    <table class="table table-responsive">
      <tbody>
        <tr v-for="(person, index) in people" :key="index">
          <td>
            <img
              :src="person.avatar || 'icons/blank-user.svg'"
              class="rounded-circle bg-info-subtle"
              width="30"
              height="30"
            />
          </td>
          <td>{{ person.nome }}</td>
          <td>{{ person.cpf }}</td>
          <td>{{ person.endereco.cidade }}/{{ person.endereco.estado }}</td>
          <td>
            <router-link :to="`/person/${person.id}`">
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
            />
          </td>
        </tr>
      </tbody>
    </table>

    <div
      v-if="selectedperson"
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
              {{ selectedperson.nome }}
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.stop.prevent="editperson">
              <div class="mb-2">
                <label for="text" class="form-label">cpf</label>
                <input
                  type="cpf"
                  class="form-control"
                  id="cpf"
                  v-model="selectedperson.cpf"
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
      people: [],
      searchTermo: "",
      pictures: [],
      selectedperson: null,
    };
  },

  async mounted() {
    try {
      const loggedUser = localStorage.getItem("loggedUser");

      const peopleResponse = await api.getPeople(this.searchTermo);
      this.people = peopleResponse.data;

      // this.people = [
      //   ...this.favorites,
      //   ...this.persons.filter(
      //     (person) =>
      //       !this.favorites.find((favorite) => favorite.id === person.id)
      //   ),
      // ].sort((a, b) => a.pessoa.nome.localeCompare(b.pessoa.nome));

      const axiosConfig = {
        responseType: "blob",
        headers: {
          "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${loggedUser.token}`,
        },
      };

      for (let person of this.people) {
        try {
          const pictureResponse = await api.getPictures(person.id, axiosConfig);
          if (pictureResponse.data) {
            const blob = new Blob([pictureResponse.data], {
              type: pictureResponse.headers["content-type"],
            });
            person.avatar = URL.createObjectURL(blob);
          }
        } catch (error) {
          console.log(`ERRO: ${error}`);
          person.avatar = "icons/blank-user.svg";
        }
      }

      await getPictures(this.people);
    } catch (error) {
      console.log(`ERRO: ${error}`);
    }
  },

  methods: {
    // openModal(person) {
    //   this.selectedperson = { ...person };

    //   let myModal = new bootstrap.Modal(document.getElementById("myModal"), {});

    //   myModal.show();
    // },
    editPerson(personId) {
      this.$router.push(`/person/${personId}`);
    },
    // async getPictures(people) {
    //   const axiosConfig = {
    //     responseType: "blob",
    //     headers: {
    //       "Access-Control-Allow-Origin": "*",
    //       Authorization: `Bearer ${loggedUser.token}`,
    //     },
    //   };

    //   for (let person of people) {
    //     try {
    //       const pictureResponse = await api.getPictures(
    //         person.id,
    //         axiosConfig
    //       );
    //       if (pictureResponse.data) {
    //         const blob = new Blob([pictureResponse.data], {
    //           type: pictureResponse.headers["content-type"],
    //         });
    //         person.avatar = URL.createObjectURL(blob);
    //       }
    //     } catch (error) {
    //       console.log(`ERRO: ${error}`);
    //       person.avatar = "icons/blank-user.svg";
    //     }
    //   }
    // },
    async search() {
      try {
        const searchResponse = await api.getPeople(this.searchTermo);
        this.people = searchResponse.data;
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
