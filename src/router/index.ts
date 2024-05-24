import { createRouter, createWebHistory } from "vue-router";
import LoginVue from "../pages/Login.vue";
import SignupVue from "../pages/Signup.vue";
import HomeVue from "../pages/Home.vue";
import UsersVue from "../pages/Users.vue";
import PeopleVue from "../pages/People.vue";
import ContactsVue from "../pages/Contacts.vue";
import UserVue from "../pages/User.vue";
import PersonVue from "../pages/Person.vue";

const routes = [
  { path: "/:catchAll(.*)", redirect: "/" },
  { path: "/", component: HomeVue },
  { path: "/login", component: LoginVue },
  { path: "/signup", component: SignupVue },
  { path: "/users", component: UsersVue },
  { path: "/people", component: PeopleVue },
  { path: "/person/:personId", component: PersonVue },
  { path: "/contacts", component: ContactsVue },
  { path: "/user", component: UserVue },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem("accessToken");
  if (isAuthenticated && (to.path === "/login" || to.path === "/signup")) {
    next("/");
  } else if (
    !isAuthenticated &&
    to.path !== "/login" &&
    to.path !== "/signup"
  ) {
    next("/login");
  } else {
    next();
  }

  if (
    to.path !== "/login" &&
    to.path !== "/signup" &&
    !localStorage.getItem("accessToken")
  ) {
    next("/login");
  } else {
    next();
  }
});

export default router;
