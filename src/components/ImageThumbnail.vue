<template>
  <div class="thumbnail" tabindex="0" @click="onClick">
    <div class="image-wrapper">
      <img :src="`${img}?sz=200`" @error="setErrorImg" draggable="false" />
      <div class="taglist">
        <span v-for="tag in sortTags(tags)" :key="tag">
          {{ tag }}
        </span>
      </div>
    </div>
    <div class="name">{{ name }}</div>
  </div>
</template>

<script lang="ts">
import router from "@/router";
import { defineComponent, PropType } from "vue";

const errorImage = "/foot.png";

export default defineComponent({
  name: "ImageThumbnail",
  props: {
    name: {
      type: String,
      default: "",
    },
    tags: {
      type: Array as PropType<string[]>,
      default: () => [] as string[],
    },
    img: {
      type: String,
      default: errorImage,
    },
    imgid: {
      type: Number,
      required: true,
    },
  },
  methods: {
    setErrorImg(e: Event) {
      const el = e.target as HTMLImageElement;
      el.src = errorImage;
    },
    sortTags(tags: string[]) {
      return tags.map((a) => a).sort();
    },
    onClick() {
      router.push(`/images/id/${this.imgid}`);
    },
  },
});
</script>

<style lang="sass" scoped>
@use '@/assets/styles/base'

.thumbnail
  width: 200px
  height: 300px
  @include base.basic-element-styles
  padding: 0
  display: grid
  grid-template-rows: auto 36px
  overflow: hidden
  background: #f7fafc
  transition: 0.1s ease-out
  box-shadow: 0 2px 8px -6px rgba(base.$shadow-color, 0.2)
  border: 1px solid #e2e8f0

  &:hover, &:focus
    background: #eef1f2
    cursor: pointer
    border-color: base.$primary-color

  &:focus
    @include base.focus-outline(base.$primary-color)

  .name
    display: flex
    justify-content: center
    align-items: center
    color: base.$default-font-color

  .image-wrapper
    display: flex
    justify-content: center
    align-items: center
    flex-direction: column
    position: relative
    overflow: hidden

    img
      max-width: 100%

    .taglist
      position: absolute
      bottom: 0px
      left: 0px
      margin: 10px

      span
        background: #aaee99
        padding: 4px 8px
        border-radius: 10px
        font-size: 8pt
        font-weight: bold
        display: inline-block
        margin-top: 6px
        box-shadow: 0 0 12px -4px rgba(base.$shadow-color, 0.2), 0 0 0 1px rgba(base.$shadow-color, 0.1) inset

        &:not(:last-child)
          margin-right: 4px
</style>
