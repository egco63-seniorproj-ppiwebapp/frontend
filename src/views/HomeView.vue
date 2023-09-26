<template>
  <div class="homecontainer">
    <div class="panelwrapper"><HomePanel style="padding-left: 50px" /></div>
    <div class="bodywrapper"><router-view style="padding-right: 50px" /></div>
  </div>
</template>

<style lang="sass" scoped>
.homecontainer
  display: grid
  grid-template-columns: 400px auto
  grid-template-rows: 100%
  grid-template-areas: "panel body"
  height: 100%

.panelwrapper
  grid-area: panel

.bodywrapper
  grid-area: body
  overflow-x: auto
</style>

<script lang="ts">
import { defineComponent } from "vue";
import HomePanel from "@/components/HomePanel.vue";

export default defineComponent({
  name: "HomeView",
  components: {
    HomePanel,
  },
  methods: {},
});
</script>
