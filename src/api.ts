import axios from "axios";
import { environment } from "./environments/environments";
import { INewUser } from "./interfaces/INewUser.interface";
import { INewPerson } from "./interfaces/INewPerson.interface";

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
  login(username: string, password: string) {
    return axios.post(`${environment.HOST_API}/api/auth/login`, {
      username,
      password,
    });
  },

  signup(newUser: INewUser) {
    return axios.post(`${environment.HOST_API}/api/usuario/salvar`, newUser);
  },

  getContacts(loggedUser: number) {
    return axios.get(
      `${environment.HOST_API}/api/contato/listar/${loggedUser}`
    );
  },

  searchContacts(termo: string) {
    return axios.post(`${environment.HOST_API}/api/contato/pesquisar`, {
      termo,
    });
  },

  getFavorites() {
    return axios.get(`${environment.HOST_API}/api/favorito/pesquisar`);
  },

  favoriteContact(contact: any) {
    return axios.post(`${environment.HOST_API}/api/favorito/salvar`, contact);
  },

  unfavoriteContact(contactId: number) {
    return axios.delete(
      `${environment.HOST_API}/api/favorito/remover/${contactId}`
    );
  },

  getPictures(contactId: number, config: any) {
    return axios.get(
      `${environment.HOST_API}/api/foto/download/${contactId}`,
      config
    );
  },

  uploadPicture(foto: any, personId: number) {
    return axios.post(
      `${environment.HOST_API}/api/foto/upload/${personId}`,
      foto
    );
  },

  getPeople(termo: string) {
    return axios.post(`${environment.HOST_API}/api/pessoa/pesquisar`, {
      nome: termo,
    });
  },

  getPerson(personId: number) {
    return axios.get(`${environment.HOST_API}/api/pessoa/buscar/${personId}`);
  },

  updatePerson(person: INewPerson) {
    return axios.post(`${environment.HOST_API}/api/pessoa/salvar`, person);
  },

  deletePerson(personId: number) {
    return axios.delete(
      `${environment.HOST_API}/api/pessoa/remover/${personId}`
    );
  },
};
