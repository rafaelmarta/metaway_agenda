<template>
  <div class="container-fluid p-0 vh-100">
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark w-100 m-0">
      <div class="container-fluid px-0">
        <button class="navbar-toggler" type="button" @click="toggleSidebar">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="d-flex justify-content-end w-100">
          <button
            class="btn btn-secondary dropdown-toggle"
            type="button"
            id="avatarDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <img
              src="https://github.com/rafaelmarta.png"
              class="rounded-circle"
              style="width: 30px; height: 30px"
            />
          </button>
          <ul
            class="dropdown-menu dropdown-menu-end"
            aria-labelledby="avatarDropdown"
          >
            <li>
              <router-link
                class="dropdown-item"
                to="/user"
                active-class="router-link-active"
              >
                <span class="d-flex gap-1">
                  <img
                    src="/icons/my-user.svg"
                    alt="My user icon"
                    height="24"
                  />
                  Meu cadastro
                </span>
              </router-link>
            </li>
            <li><hr class="dropdown-divider" /></li>
            <li>
              <router-link
                class="dropdown-item"
                to="/login"
                active-class="router-link-active"
              >
                <span class="d-flex gap-1">
                  <img src="/icons/logout.svg" alt="Logout icon" height="24" />
                  Sair
                </span>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Conteúdo da página -->
    <div class="row h-100 mx-0">
      <!-- Sidebar -->
      <div
        :class="[
          'col-2 bg-light border-right d-flex flex-column justify-content-start',
          { 'd-none': !showSidebar },
        ]"
        id="sidebar"
        style="height: calc(100vh - 56px); overflow-y: auto"
      >
        <div class="list-group list-group-flush">
          <router-link
            class="list-group-item list-group-item-action bg-light align-items-center justify-content-center"
            to="/"
            active-class="router-link-active"
          >
            <span class="d-flex gap-1">
              <img src="/icons/home.svg" alt="Home icon" height="24" />
              Home
            </span>
          </router-link>
          <router-link
            class="list-group-item list-group-item-action bg-light"
            to="/users"
            active-class="router-link-active"
          >
            <span class="d-flex gap-1">
              <img
                src="/icons/users.svg"
                alt="Users icon (admin)"
                height="24"
              />
              Usuários
            </span>
          </router-link>
          <router-link
            class="list-group-item list-group-item-action bg-light"
            to="/people"
            active-class="router-link-active"
          >
            <span class="d-flex gap-1">
              <img src="/icons/people.svg" alt="People icon" height="24" />
              Pessoas
            </span>
          </router-link>
          <router-link
            class="list-group-item list-group-item-action bg-light"
            to="/contacts"
            active-class="router-link-active"
          >
            <span class="d-flex gap-1">
              <img src="/icons/contacts.svg" alt="Contacts icon" height="24" />
              Contatos
            </span>
          </router-link>
        </div>
      </div>

      <!-- Conteúdo da página -->
      <div
        style="height: calc(100vh - 56px); overflow-y: auto"
        :class="['col-10 p-0 overflow-auto ', { 'w-100': !showSidebar }]"
      >
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from "vue";

export default {
  setup() {
    const showSidebar = ref(true);
    const windowWidth = ref(window.innerWidth);

    const toggleSidebar = () => {
      showSidebar.value = !showSidebar.value;
    };

    const updateSidebarVisibility = () => {
      if (window.innerWidth >= 992) {
        showSidebar.value = true;
      } else {
        showSidebar.value = false;
      }
      windowWidth.value = window.innerWidth;
    };

    onMounted(() => {
      window.addEventListener("resize", updateSidebarVisibility);
      updateSidebarVisibility();
    });

    onUnmounted(() => {
      window.removeEventListener("resize", updateSidebarVisibility);
    });

    return {
      showSidebar,
      toggleSidebar,
      windowWidth,
    };
  },
};
</script>

<style scoped>
.dropdown-toggle::after {
  display: none;
}
.router-link-active {
  transition: background-color 0.3s ease-in-out !important;
  background-color: rgb(220, 221, 222) !important;
  color: white !important;
}
</style>
