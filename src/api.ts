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
      localStorage.removeItem("userId");
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

  getContacts(userId: number) {
    return axios.get(`${environment.HOST_API}/api/contato/listar/${userId}`);
  },

  searchContacts(termo: string) {
    return axios.post(`${environment.HOST_API}/api/contato/pesquisar`, {
      termo,
    });
  },

  getFavorites() {
    return axios.get(`${environment.HOST_API}/api/favorito/pesquisar`);
  },
};
