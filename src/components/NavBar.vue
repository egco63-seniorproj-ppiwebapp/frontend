<template>
  <nav>
    <div class="nav-links">
      <router-link to="/">Home</router-link>
      <router-link to="/upload">Upload</router-link>
      <router-link to="/images">Images</router-link>
      <router-link to="/settings">Settings</router-link>
    </div>

    <div class="user-profile">
      <span class="user-name">{{ username }}</span>
      <button class="logout-btn" @click="logOut()">
        <font-awesome-icon :icon="['fas', 'arrow-right-from-bracket']" />
      </button>
    </div>
  </nav>
</template>

<script lang="ts">
import router from "@/router";
import { defineComponent } from "vue";

export default defineComponent({
  name: "NavBar",
  computed: {
    username() {
      return this.$store.getters.username;
    },
  },
  methods: {
    logOut() {
      this.$store.dispatch("logout");
      router.push("/login");
    },
  },
});
</script>

<style lang="sass" scoped>
nav
  display: flex
  justify-content: space-between


.user-profile
  display: flex
  align-items: center
  position: relative
  right: -30px
  top: -5px


.user-name
  font-weight: 400
  font-size: 16px
  color: #ffffff
  margin-right: 12px
  padding-right: 12px
  border-right: 1px solid rgba(255, 255, 255, 0.5)


.logout-btn
  width: 40px
  height: 40px
  cursor: pointer
  display: flex
  justify-content: center
  align-items: center
  color: white
  border-radius: 50%
  background: none
  outline-color: rgba(255, 255, 255, 0.2)

  &:hover
    background: rgba(255, 255, 255,0.2)
    box-shadow: 0 0 24px -5px rgba(0, 0, 0, 0.04)
</style>
