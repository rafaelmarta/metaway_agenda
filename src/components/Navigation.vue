<template>
  <div class="container-fluid p-0 vh-100 d-flex flex-row">
    <!-- Sidebar -->
    <div
      :class="[
        'col-2 bg-light border-right d-flex flex-column justify-content-start',
        { 'd-none': showSidebar, 'd-lg-block': !showSidebar },
      ]"
      id="sidebar"
      style="position: fixed; height: calc(100% - 56px); top: 56px"
    >
      <div class="list-group list-group-flush">
        <a href="/" class="list-group-item list-group-item-action bg-light"
          >Home</a
        >
        <a href="#" class="list-group-item list-group-item-action bg-light"
          >Usuários</a
        >
        <a href="#" class="list-group-item list-group-item-action bg-light"
          >Pessoas</a
        >
        <a href="#" class="list-group-item list-group-item-action bg-light"
          >Contatos</a
        >
      </div>
    </div>

    <!-- Conteúdo da página -->
    <div class="col-12 p-0">
      <!-- Navbar -->
      <nav
        class="navbar navbar-light bg-light"
        :class="{
          'justify-content-between': windowWidth < 992,
          'justify-content-end': windowWidth >= 992,
        }"
        style="z-index: 1; position: relative"
      >
        <button
          class="navbar-toggler"
          type="button"
          @click="toggleSidebar"
          :class="{ 'd-lg-none': !showSidebar }"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="ml-auto">
          <button class="btn btn-outline-primary my-2 my-sm-0" type="submit">
            Meu cadastro
          </button>
          <button
            class="btn btn-outline-danger my-2 my-sm-0 ml-2"
            type="submit"
          >
            Logout
          </button>
        </div>
      </nav>
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

    const updateSidebar = () => {
      if (window.innerWidth >= 992) {
        showSidebar.value = false;
      } else {
        showSidebar.value = true;
      }
      windowWidth.value = window.innerWidth;
    };

    onMounted(() => {
      window.addEventListener("resize", updateSidebar);
      updateSidebar();
    });

    onUnmounted(() => {
      window.removeEventListener("resize", updateSidebar);
    });

    return {
      showSidebar,
      toggleSidebar,
      windowWidth,
    };
  },
};
</script>

<style lang=""></style>
