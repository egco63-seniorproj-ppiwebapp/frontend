<template>
  <div class="container">
    <form @submit="onSubmit">
      <h1>Login</h1>
      <input
        type="text"
        class="field"
        placeholder="Username"
        v-model="username"
        required
      />
      <input
        type="password"
        class="field"
        placeholder="Password"
        v-model="password"
        required
      />
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <input type="submit" class="primary submit" value="Login" />
    </form>
  </div>
</template>

<script lang="ts">
import { AuthData } from "@/types";
import { defineComponent } from "vue";

export default defineComponent({
  name: "LoginView",
  data: () => ({
    username: "",
    password: "",
    errorMessage: "",
  }),
  methods: {
    async onSubmit(e: Event) {
      e.preventDefault();
      let authdata: AuthData = {
        username: this.username,
        password: this.password,
      };
      let isSuccess = await this.$store.dispatch("login", authdata);
      if (isSuccess) {
        this.$router.push("/");
      } else {
        this.errorMessage = "Incorrect username or password";
      }
    },
  },
});
</script>

<style lang="sass" scoped>
@use '@/assets/styles/base'

.error-message
  color: red
  margin-bottom: 20px

.container
  display: flex
  justify-content: center
  align-items: center
  background: base.$primary-color
  height: 100vh

  form
    @include base.basic-element-styles
    width: 400px
    background: white
    padding: 50px

    h1
      margin-bottom: 30px
      margin-top: 0

    .field
      display: block
      width: 100%
      margin-bottom: 10px

    .submit
      margin-top: 20px
      width: 100%
</style>
