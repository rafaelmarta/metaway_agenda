<template lang="">
  <Navigation>
    <h1>Contato</h1>
  </Navigation>
</template>
<script>
import Navigation from "../components/Navigation.vue";
import api from "../api";
import { useRoute, useRouter } from "vue-router";
import { ref, reactive, defineComponent } from "vue";
export default defineComponent({
  name: "Contact",
  components: { Navigation },
});
</script>
<style lang=""></style>
