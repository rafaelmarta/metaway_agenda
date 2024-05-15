<template>
  <div class="container-fluid p-0 vh-100 d-flex flex-row">
    <!-- Sidebar -->
    <div
      class="col-2 bg-light border-right d-flex flex-column justify-content-start"
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
    <div class="col-10 p-0">
      <!-- Navbar -->
      <nav
        class="navbar navbar-light bg-light justify-content-end"
        style="border: solid 1px red"
      >
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
export default {};
</script>

<style lang=""></style>
