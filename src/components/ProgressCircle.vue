<template>
  <svg
    width="200"
    height="200"
    viewBox="-25 -25 250 250"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    style="transform: rotate(-90deg)"
  >
    <circle class="track"></circle>
    <circle
      class="progress"
      :stroke-dashoffset="`${(565.2 * (100 - percent)) / 100}px`"
    ></circle>
  </svg>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "DonutChart",
  props: {
    percent: {
      type: Number,
      required: true,
    },
    color: {
      type: String,
      default: "gray",
    },
    linewidth: {
      type: Number,
      default: 15,
    },
  },
});
</script>

<style lang="sass" scoped>
circle
  r: 90
  cx: 100
  cy: 100
  fill: none
  stroke-dasharray: 565.2px

  &.track
    stroke: #e0e0e0
    stroke-width: 2px
    stroke-dashoffset: 0

  &.progress
    stroke-width: 24px
    stroke: gray
    stroke-linecap: round
    transition: 0.14s ease-out, stroke-dasharray 1s ease, stroke-dashoffset 1s ease
    filter: drop-shadow(0 0 6px rgba(black, 0.2)) brightness(108%) saturate(95%)
</style>
