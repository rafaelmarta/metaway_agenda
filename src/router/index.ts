import { createRouter, createWebHistory } from "vue-router";
import LoginVue from "../pages/Login.vue";
import SignupVue from "../pages/Signup.vue";
import HomeVue from "../pages/Home.vue";
import UsersVue from "../pages/Users.vue";
import PeopleVue from "../pages/People.vue";
import ContactsVue from "../pages/Contacts.vue";
import UserVue from "../pages/User.vue";

const routes = [
  { path: "/", component: HomeVue },
  { path: "/login", component: LoginVue },
  { path: "/signup", component: SignupVue },
  { path: "/users", component: UsersVue },
  { path: "/people", component: PeopleVue },
  { path: "/contacts", component: ContactsVue },
  { path: "/user", component: UserVue },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
