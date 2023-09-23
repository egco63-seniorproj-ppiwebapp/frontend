<template>
  <div class="image-grid">
    <ImageThumbnail
      v-for="(img, index) in images"
      :key="index"
      :name="img.name"
      :tags="img.tags"
      :img="img.img"
    />
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from "vue";
import ImageThumbnail from "./ImageThumbnail.vue";
import { ImageData } from "@/types";

export default defineComponent({
  name: "ImageGrid",
  components: { ImageThumbnail },
  props: {
    images: {
      type: Object as PropType<ImageData[]>,
      required: true,
    },
  },
});
</script>

<style lang="sass" scoped>
@use '@/assets/styles/base'

.image-grid
  display: grid
  justify-content: center
  grid-template-rows: 300px
  grid-template-columns: repeat(auto-fit, 200px)
  column-gap: 20px
  row-gap: 20px
  margin: 10px
</style>
