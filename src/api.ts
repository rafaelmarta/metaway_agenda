import axios from "axios";
import { environment } from "./environments/environments";
import { INewUser } from "./interfaces/INewUser.interface";
import { INewPerson } from "./interfaces/INewPerson.interface";
import { INewContact } from "./interfaces/INewContact.interface";

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    if (error.response.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("loggedUser");
    }

    return Promise.reject(error);
  }
);

export default {
  getCep(cep: string) {
    return axios.get(`${environment.CEP_API}/${cep}/json/`);
  },

  login(username: string, password: string) {
    return axios.post(`${environment.HOST_API}/auth/login`, {
      username,
      password,
    });
  },

  signup(newUser: INewUser) {
    return axios.post(`${environment.HOST_API}/usuario/salvar`, newUser);
  },

  getUser(loggedUser: number) {
    return axios.get(`${environment.HOST_API}/usuario/buscar/${loggedUser}`);
  },

  createContact(contact: INewContact) {
    return axios.post(`${environment.HOST_API}/contato/salvar`, contact);
  },

  getContacts(loggedUser: number) {
    return axios.get(`${environment.HOST_API}/contato/listar/${loggedUser}`);
  },

  searchContacts(termo: string) {
    return axios.post(`${environment.HOST_API}/contato/pesquisar`, {
      termo,
    });
  },

  deleteContact(contactId: number) {
    return axios.delete(`${environment.HOST_API}/contato/remover/${contactId}`);
  },

  getFavorites() {
    return axios.get(`${environment.HOST_API}/favorito/pesquisar`);
  },

  favoriteContact(contact: any) {
    return axios.post(`${environment.HOST_API}/favorito/salvar`, contact);
  },

  unfavoriteContact(contactId: number) {
    return axios.delete(
      `${environment.HOST_API}/favorito/remover/${contactId}`
    );
  },

  getPictures(contactId: number, config: any) {
    return axios.get(
      `${environment.HOST_API}/foto/download/${contactId}`,
      config
    );
  },

  uploadPicture(foto: any, personId: number) {
    return axios.post(`${environment.HOST_API}/foto/upload/${personId}`, foto);
  },

  getPeople(termo: string) {
    return axios.post(`${environment.HOST_API}/pessoa/pesquisar`, {
      nome: termo,
    });
  },

  getPerson(personId: number) {
    return axios.get(`${environment.HOST_API}/pessoa/buscar/${personId}`);
  },

  updatePerson(person: INewPerson) {
    return axios.post(`${environment.HOST_API}/pessoa/salvar`, person);
  },

  deletePerson(personId: number) {
    return axios.delete(`${environment.HOST_API}/pessoa/remover/${personId}`);
  },
};
