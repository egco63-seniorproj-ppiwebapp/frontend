<template>
  <div class="thumbnail" tabindex="0">
    <div class="image-wrapper">
      <img :src="img" @error="setErrorImg" />
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
import { defineComponent, PropType } from "vue";

export enum Tag {
  Cat = "Calico Cat",
  Dog = "Shiba",
  Fish = "Fish",
  Goat = "Mountain Goat",
}

const errorImage = "paw.png";

export default defineComponent({
  name: "ImageThumbnail",
  props: {
    name: {
      type: String,
      default: "",
    },
    tags: {
      type: Array as PropType<Tag[]>,
      default: () => [] as Tag[],
    },
    img: {
      type: String,
      default: errorImage,
    },
  },
  methods: {
    setErrorImg(e: Event) {
      const el = e.target as HTMLImageElement;
      el.src = errorImage;
    },
    sortTags(tags: Tag[]) {
      return tags.map((a) => a).sort();
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
  background: #f5f5f5
  transition: 0.1s ease-out
  box-shadow: 0 2px 8px -6px rgba(base.$shadow-color, 0.2)
  border: 1px solid #eeeeee

  &:hover, &:focus
    background: #eeeeee
    box-shadow: 0 2px 8px -2px rgba(base.$shadow-color, 0.5)
    transform: translateY(-2px)
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
      margin: 10px 5px

      span
        background: #aaee99
        padding: 4px 8px
        border-radius: 10px
        font-size: 8pt
        font-weight: bold
        display: inline-block
        margin-top: 6px

        &:not(:last-child)
          margin-right: 4px
</style>
