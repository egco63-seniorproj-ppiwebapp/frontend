<template>
  <nav>
    <div class="nav-links">
      <router-link to="/">Home</router-link>
      <router-link to="/upload">Upload</router-link>
      <router-link to="/images">Images</router-link>
      <router-link to="/settings">Settings</router-link>
    </div>

    <div class="user-profile">
      <span class="user-name">Admin123</span>
      <font-awesome-icon
        :icon="['fas', 'arrow-right-from-bracket']"
        style="color: #ffffff"
        @click="logOut()"
      />
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "NavBar",
  methods: {
    logOut() {
      console.log("pls implement function to me");
    },
  },
});
</script>

<style scoped>
nav {
  display: flex;
  justify-content: space-between;
}

.user-profile {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.user-name {
  font-weight: 400;
  font-size: 16px;
  color: #ffffff;
  margin-right: 10px;
}
</style>
