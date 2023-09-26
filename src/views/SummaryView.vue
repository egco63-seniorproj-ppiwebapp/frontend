<template>
  <div class="homebody">
    <div class="counterwrapper"></div>
    <div class="donut1"></div>
    <div class="donut2"></div>
    <div class="trend"></div>
  </div>
</template>

<style lang="sass" scoped>
.homebody
  display: grid
  grid-template-columns: auto auto auto
  grid-template-rows: auto auto
  grid-template-areas: "counter donut1 donut2" "trend trend trend"
  height: 100%
  min-width: 800px
  column-gap: 10px
  row-gap: 20px
  padding: 10px

  div
    border: 1px solid lightgray

.counterwrapper
  grid-area: counter

.donut1
  grid-area: donut1
.donut2
  grid-area: donut2
.trend
  grid-area: trend
</style>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "SummaryView",
  components: {},
  methods: {},
});
</script>
