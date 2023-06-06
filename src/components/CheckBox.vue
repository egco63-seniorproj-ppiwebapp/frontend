<template>
  <div class="checkbox">
    <input type="checkbox" :id="id" />
    <label :for="id">
      {{ label }}
    </label>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

let count = 0;
export default defineComponent({
  name: "CheckBox",
  props: {
    label: String,
  },
  data: () => ({
    id: "",
  }),
  created() {
    this.id = `cb${count++}`;
  },
});
</script>

<style lang="sass" scoped>
@use '@/assets/styles/base'

.checkbox
  padding: 0
  color: base.$default-font-color

  label
    cursor: pointer

  input[type="checkbox"]
    -webkit-appearance: none
    -moz-appearance: none
    color: inherit
    cursor: pointer
    margin: 3px 6px 3px 4px

    &::before, &::after
      content: ""
      display: block
      justify-self: center
      width: 20px
      height: 20px

    &::before
      position: relative
      border-radius: 4px
      top: 24px
      margin-top: -24px
      border: 2px solid base.$default-color

    &::after
      position: relative
      content: "✔"
      font-size: 14px
      margin: 2px
      text-align: center
      opacity: 0

    &:hover::before, &:focus::before
      border-color: base.$primary-color
      @include base.focus-outline(base.$primary-color)
      outline-offset: 0

    &:hover::after, &:focus::after
      opacity: 0.2

    &:focus
      outline: none

    &:checked
      &::after
        opacity: 1
        color: base.$primary-color
        font-weight: bold
      &::before
        border-color: base.$primary-color
</style>
