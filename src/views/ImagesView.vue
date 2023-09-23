<template>
  <div class="container">
    <div class="search-panel">
      <ImageSearch :search-handler="search" />
    </div>
    <div class="gallery">
      <ImageGrid :images="images" />
    </div>
  </div>
</template>

<style lang="sass" scoped>
@use '@/assets/styles/navbar'

.container
  display: grid
  grid-template-columns: 400px auto
  padding: 0 !important

.gallery
  height: calc(100vh - navbar.$navbar-height)
  overflow-y: scroll

.search-panel
  padding: 1.5rem
  height: calc(100vh - navbar.$navbar-height)
</style>

<script lang="ts">
import { defineComponent } from "vue";
import ImageGrid from "@/components/ImageGrid.vue";
import ImageSearch from "@/components/ImageSearch.vue";
import { SearchParameters } from "@/types";

import images from "@/assets/images.json";

export default defineComponent({
  name: "ImagesView",
  components: {
    ImageGrid,
    ImageSearch,
  },
  data: () => ({ images }),
  methods: {
    search(params: SearchParameters) {
      console.log(params);
    },
  },
});
</script>
