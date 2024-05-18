import axios from "axios";
import { environment } from "./environments/environments";

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

  getPictures(pictureId: number) {
    return axios.post(`${environment.HOST_API}/api/foto/download/${pictureId}`);
  },
};
