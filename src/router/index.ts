import { createRouter, createWebHistory } from "vue-router";
import LoginVue from "../pages/Login.vue";
import SignupVue from "../pages/Signup.vue";
import HomeVue from "../pages/Home.vue";

const routes = [
  { path: '/', component: HomeVue },
  { path: '/login', component: LoginVue },
  { path: '/signup', component: SignupVue }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router;