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
      <input type="submit" class="primary submit" value="Login" />
    </form>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import { defineComponent } from "vue";

export default defineComponent({
  name: "LoginView",
  data: () => ({
    username: "",
    password: "",
  }),
  methods: {
    async onSubmit(e: Event) {
      e.preventDefault();
      let authdata = { username: this.username, password: this.password };
      console.log(authdata);
      let res = await axios.post("api/auth", authdata);
      if (res.status != 200) {
        alert("Incorrect username or password");
      } else {
        alert("Logged on!");
        this.$router.push("/");
      }
    },
  },
});
</script>

<style lang="sass" scoped>
@use '@/assets/styles/base'

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
