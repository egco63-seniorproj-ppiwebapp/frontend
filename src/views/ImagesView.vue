<template>
  <div class="container">
    <ImageGrid :images="images" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ImageGrid from "@/components/ImageGrid.vue";

import images from "@/assets/images.json";

export default defineComponent({
  name: "ImagesView",
  components: {
    ImageGrid,
  },
  data: () => ({ images }),
});
</script>
