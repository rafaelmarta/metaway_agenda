<template>
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
            <img
              src="/icons/edit.svg"
              class="rounded-circle bg-warning-subtle"
              alt="Edit icon"
              width="22"
              @click="openModal(contact.id)"
            />
          </td>
          <td>
            <img
              src="/icons/eraser.svg"
              class="rounded-circle bg-danger-subtle"
              alt="Delete icon"
              width="22"
              @click="deleteModal(contact.id)"
            />
          </td>
        </tr>
      </tbody>
    </table>

    <div
      class="modal fade"
      id="deleteModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">
              Gostaria de remover?
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
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
              @click="deleteContact(person)"
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
    </div>

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
              Adicionar Contato
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
              <div class="dropdown w-100 mb-3">
                <button
                  class="btn btn-secondary dropdown-toggle w-100"
                  type="button"
                  id="dropdownMenuButton"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {{ newContact.pessoa.nome || "Selecionar pessoa" }}
                </button>
                <ul
                  class="dropdown-menu w-100 scroll-area"
                  aria-labelledby="dropdownMenuButton"
                >
                  <li
                    v-for="(person, index) in people"
                    :key="index"
                    @click="selectPerson(person)"
                  >
                    <a class="dropdown-item">
                      <img
                        :src="person.avatar || 'icons/blank-user.svg'"
                        class="rounded-circle"
                        width="35"
                        height="35"
                      />
                      {{ person.nome }}
                    </a>
                  </li>
                </ul>
              </div>
              <div class="mb-3">
                <label for="publicoPrivado" class="form-label"
                  >Público / Privado</label
                >
                <div class="form-check form-switch">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="publicoPrivado"
                    v-model="newContact.publicoPrivado"
                  />
                  <label class="form-check-label" for="publicoPrivado">{{
                    newContact.publicoPrivado ? "Privado" : "Público"
                  }}</label>
                </div>
              </div>
              <div class="mb-3">
                <label for="tag" class="form-label">Tag</label>
                <input
                  type="text"
                  class="form-control"
                  id="tag"
                  v-model="newContact.tag"
                />
              </div>
              <div class="mb-3">
                <label for="tipoContato" class="form-label"
                  >Tipo de contato</label
                >
                <select
                  class="form-select"
                  id="tipoContato"
                  v-model="newContact.tipoContato"
                >
                  <option value="CELULAR">Celular</option>
                  <option value="TELEFONE">Telefone</option>
                  <option value="EMAIL">Email</option>
                </select>
              </div>
              <div class="mb-3">
                <label for="contato" class="form-label">Contato</label>
                <input
                  :type="newContact.tipoContato === 'EMAIL' ? 'email' : 'tel'"
                  class="form-control"
                  id="contato"
                  v-model="newContact.contato"
                  v-maska
                  :data-maska="contactMask"
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
            <button
              type="button"
              class="btn btn-primary"
              @click="addContact"
              :disabled="!isFormValid"
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  </Navigation>
</template>
<script>
import Navigation from "../components/Navigation.vue";
import api from "../api";
import { vMaska } from "maska";
import { useToast } from "vue-toastification";

export default {
  components: { Navigation },
  directives: {
    maska: vMaska,
  },

  data() {
    return {
      myModal: null,
      allContacts: [],
      selectedContact: null,
      searchTermo: "",
      people: [],
      currentUser: {},
      contact: {},
      newContact: {
        pessoa: {},
        publicoPrivado: false,
        tag: "",
        tipoContato: "",
        contato: "",
      },
    };
  },

  computed: {
    contactMask() {
      switch (this.newContact.tipoContato) {
        case "CELULAR":
          return "(##) #####-####";
        case "TELEFONE":
          return "(##) ####-####";
        case "EMAIL":
        default:
          return "";
      }
    },
    isFormValid() {
      return (
        this.newContact.pessoa.nome &&
        this.newContact.publicoPrivado !== null &&
        this.newContact.tag &&
        this.newContact.tipoContato &&
        this.newContact.contato
      );
    },
  },

  async mounted() {
    try {
      const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));

      const currentUserResponse = await api.getUser(loggedUser.id);
      this.currentUser = currentUserResponse.data.object.usuario;

      this.search();

      const peopleResponse = await api.getPeople(this.searchTermo);
      this.people = peopleResponse.data;

      await this.loadPictures(this.people, loggedUser.token);
    } catch (error) {}
  },

  watch: {
    "newContact.tipoContato": function (newVal, oldVal) {
      if (newVal === "EMAIL") {
        this.newContact.email = this.newContact.contato;
        this.newContact.telefone = "";
      } else {
        this.newContact.telefone = this.newContact.contato;
        this.newContact.email = "";
      }
    },
    "newContact.contato": function (newVal, oldVal) {
      if (this.newContact.tipoContato === "EMAIL") {
        this.newContact.email = newVal;
      } else {
        this.newContact.telefone = newVal;
      }
    },
  },

  methods: {
    resetForm() {
      this.newContact = {
        pessoa: {},
        publicoPrivado: false,
        tag: "",
        tipoContato: "",
        contato: "",
      };
    },
    openModal(contactId) {
      if (contactId === 0) {
        this.resetForm();
      } else {
        this.contact = this.allContacts.find((c) => c.id === contactId);

        this.contact.publicoPrivado = this.contact.privado;

        this.contact.contato =
          this.contact.tipoContato === "EMAIL"
            ? this.contact.email
            : this.contact.telefone;

        this.newContact = this.contact;
      }

      if (document.getElementById("myModal")) {
        this.myModal = new bootstrap.Modal(
          document.getElementById("myModal"),
          {}
        );
        this.myModal.show();
      }
    },
    deleteModal(contactId) {
      this.selectedContact = contactId;
      if (document.getElementById("deleteModal")) {
        this.deleteModal = new bootstrap.Modal(
          document.getElementById("deleteModal"),
          {}
        );
        this.deleteModal.show();
      }
    },
    async deleteContact(contactId) {
      const toast = useToast();

      try {
        const removeResponse = await api.deleteContact(this.selectedContact);

        if (removeResponse.status === 200) {
          this.deleteModal.hide();
          this.search();

          toast.success("Contato removido com sucesso.");
        } else {
          throw new Error();
        }
      } catch (error) {
        console.error(error);
        toast.error("Não foi possível remover o contato.");
      }
    },
    selectPerson(person) {
      this.newContact.pessoa = person;
    },
    async loadPictures(people, token) {
      const axiosConfig = {
        responseType: "blob",
        headers: {
          "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${token}`,
        },
      };

      for (let person of people) {
        try {
          const pictureResponse = await api.getPictures(person.id, axiosConfig);

          if (pictureResponse.data) {
            const blob = new Blob([pictureResponse.data], {
              type: pictureResponse.headers["content-type"],
            });
            person.avatar = URL.createObjectURL(blob);
          }
        } catch (error) {
          person.avatar = "icons/blank-user.svg";
        }
      }
    },
    async search() {
      const toast = useToast();
      try {
        const searchResponse = await api.searchContacts(this.searchTermo);
        this.allContacts = searchResponse.data;

        this.allContacts.sort((a, b) =>
          a.pessoa.nome.localeCompare(b.pessoa.nome)
        );
      } catch (error) {
        if (error.response.status === 401) {
          toast.error("Não autorizado");
        } else {
          toast.error("Não foi possível buscar a lista de contatos.");
        }
      }
    },

    async addContact() {
      delete this.newContact.pessoa.avatar;
      const toast = useToast();

      let transformedData = {
        privado: this.newContact.publicoPrivado,
        tag: this.newContact.tag,
        tipoContato: this.newContact.tipoContato,
        email: this.newContact.email,
        pessoa: this.newContact.pessoa,
        telefone: this.newContact.telefone,
        usuario: this.currentUser,
        id: this.newContact.id !== 0 ? this.newContact.id : null,
      };

      try {
        const contactCreateResponse = await api.createContact(transformedData);

        if (contactCreateResponse.status === 200) {
          this.myModal.hide();
          await this.search();

          toast.success("Contato salvo com sucesso.");
        } else {
          throw new Error();
        }
      } catch (error) {
        toast.error(`Não foi possível salvar o contato.`);
        console.error(error);
      }
    },
  },
};
</script>
<style>
.ml-3 {
  margin-left: 1rem !important;
}

.scroll-area {
  height: auto;
  max-height: 200px;
  overflow-x: hidden;
}
</style>
