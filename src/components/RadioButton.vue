<template>
  <div class="radio">
    <input
      type="radio"
      :id="id"
      :name="group"
      :value="value"
      @change="onChange"
      v-model="pick"
    />
    <label :for="id">
      {{ label }}
    </label>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

let count = 0;
export default defineComponent({
  name: "RadioButton",
  props: {
    label: String,
    group: String,
    value: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    id: "",
    pick: "",
  }),
  created() {
    this.id = `rd${count++}`;
  },
  methods: {
    onChange() {
      if (this.pick == this.value) this.$emit("select", this.pick);
    },
  },
});
</script>

<style lang="sass" scoped>
@use '@/assets/styles/base'

.radio
  padding: 0
  color: base.$default-font-color

  label
    cursor: pointer
    vertical-align: auto

  input[type="radio"]
    -webkit-appearance: none
    -moz-appearance: none
    color: inherit
    cursor: pointer
    margin: 3px 6px 3px 4px
    padding: 0
    width: 24px
    height: 24px

    &::before, &::after
      content: ""
      display: block
      justify-self: center
      width: 20px
      height: 20px

    &::before
      position: relative
      border-radius: 50%
      top: 24px
      margin-top: -24px
      border: 2px solid base.$default-color

    &::after
      position: relative
      content: "⬤"
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
