<template>
  <div class="homebody">
    <div class="counters">
      <h3>Label Summary</h3>
      <div class="counter-group">
        <div class="counter-item">
          <div class="title">
            <font-awesome-icon :icon="['far', 'fa-image']" />
            <span> All time uploads</span>
          </div>
          <div class="count">
            <span class="num">{{ (1234).toLocaleString() }}</span>
            <span class="unit"> images</span>
          </div>
        </div>
        <div class="counter-item">
          <div class="title">
            <font-awesome-icon :icon="['far', 'fa-image']" />
            <span> This month uploads</span>
          </div>
          <div class="count">
            <span class="num">{{ (15).toLocaleString() }}</span>
            <span class="unit"> images</span>
          </div>
        </div>
      </div>
    </div>
    <div class="donut donut1">
      <h2 class="donut-title">{{ "All users" }}</h2>
      <Doughnut :data="donut1.data" :options="donut1.options" />
    </div>
    <div class="donut donut2">
      <h2 class="donut-title">{{ "Yours" }}</h2>
      <Doughnut :data="donut2.data" :options="donut2.options" />
    </div>
    <div class="trend">
      <div class="trend-title">
        <h2>Uploads</h2>
        <span>{{ new Date().getFullYear() }}</span>
      </div>
      <Bar :data="bar.data" :options="bar.options"></Bar>
    </div>
  </div>
</template>

<style lang="sass">
.callout
  background-color: #e2e2e2
  border-radius: 6px
  font-size: 12px
  box-shadow: 0 0 15px -5px rgba(0, 0, 0, 0.3)
  // transition: top 0.02s ease-out, left 0.02s ease-out
span.callout.dialog
  >span
    display: flex
    justify-content: center
    align-items: center
    font-weight: bold
    transform: translateZ(1px)
  .value
    margin-top: 4px
  .label
    margin-top: 2px
    display: inline-block
    padding: 0.2em 0.45em
    border-radius: 0.7em
    background: red
    color: rgba(white, 0.9)
span.callout
  padding: 6px 8px
  display: inline-block
  transform-style: preserve-3d
  position: relative
  margin: 5px

  $caret-trasform-base: scaleY(300%) rotate(45deg) //translateZ(-1px)
  $vertical-caret: translate(-50%, -50%) $caret-trasform-base
  $horizontal-caret: translate(-50%, -50%) rotate(90deg) $caret-trasform-base
  $caret-edge-offset: 16px

  &::before
    content: ""
    display: block
    position: absolute
    width: 0.75em
    height: 0.75em
    background: inherit
    // transition: transform 0.2s linear

  &.bottom::before
    transform: $vertical-caret
    left: 50%
    top: 100%
  &.left::before
    transform: $horizontal-caret
    left: 0%
    top: 50%
  &.bottom.left::before
    transform: $vertical-caret
    left: $caret-edge-offset
    top: 100%
  &.bottom.left.vertical::before
    transform: $horizontal-caret
    left: 0%
    top: calc(100% - $caret-edge-offset)

  &.right::before
    transform: $horizontal-caret
    left: 100%
    top: 50%
  &.bottom.right::before
    transform: $vertical-caret
    left: calc(100% - $caret-edge-offset)
    top: 100%
  &.bottom.right.vertical::before
    transform: $horizontal-caret
    left: 100%
    top: calc(100% - $caret-edge-offset)

  &.top::before
    transform: $vertical-caret
    left: 50%
    top: 0%
  &.top.left::before
    transform: $vertical-caret
    left: $caret-edge-offset
    top: 0%
  &.top.left.vertical::before
    transform: $horizontal-caret
    left: 0%
    top: $caret-edge-offset
  &.top.right::before
    transform: $vertical-caret
    left: calc(100% - $caret-edge-offset)
    top: 0%
  &.top.right.vertical::before
    transform: $horizontal-caret
    left: 100%
    top: $caret-edge-offset
</style>
<style lang="sass" scoped>
@use '@/assets/styles/base'

.homebody
  display: grid
  grid-template-columns: 340px auto auto
  grid-template-rows: 380px 200px
  grid-template-areas: "counter donut1 donut2" "trend trend trend"
  height: 100%
  min-width: 800px
  column-gap: 20px
  row-gap: 20px
  padding: 10px

.counters
  grid-area: counter
  display: flex
  flex-flow: column
  margin-top: 20px
  margin-right: 40px

.counter-group
  display: flex
  flex-flow: column
  gap: 30px
.counter-item
  padding: 24px
  border: 1px solid lighten(base.$primary-color, 10%)
  border-radius: 12px
  color: gray

  .title
    display: flex
    align-items: center
    span
      color: base.$default-font-color
    svg
      margin-right: 12px
      font-size: 1.6em
      color: darken(base.$primary-color, 10%)
  .count
    margin-top: 12px
    .num
      font-size: 28px
      color: base.$default-font-color
    .unit
      margin-left: 6px

.donut
  width: 320px
  margin: auto 0
  margin-bottom: 0px

.donut1
  grid-area: donut1
.donut2
  grid-area: donut2


.donut-title
  top: 50%
  left: 50%
  position: absolute
  transform: translate(-50%, -100%)
.trend
  grid-area: trend
  display: flex
  flex-flow: column
  height: 250px
  margin-top: -40px

  .trend-title
    h2
      display: inline-block
      margin-right: 20px

  canvas
    height: 250px
</style>

<script lang="ts">
import { defineComponent } from "vue";
import { Doughnut, Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  ChartData,
  ArcElement,
  Tooltip,
  Title,
  LinearScale,
  CategoryScale,
  BarElement,
  Legend,
} from "chart.js";
import AllToolTips from "@/views/AllToolTips";

ChartJS.register(
  ArcElement,
  BarElement,
  Tooltip,
  Title,
  new AllToolTips(),
  LinearScale,
  CategoryScale,
  Legend
);

export default defineComponent({
  name: "SummaryView",
  components: {
    Doughnut,
    Bar,
  },
  data: () => ({
    donut1: {
      data: {
        labels: ["Unlabel", "Flat", "Normal", "High"],
        datasets: [
          {
            // label: "All users",
            data: [45, 4, 7, 2],
            backgroundColor: [
              "rgb(255, 99, 132)",
              "#62aa92",
              "rgb(54, 162, 235)",
              "rgb(255, 205, 86)",
            ],
          },
        ],
      } as ChartData<"doughnut">,
      options: {
        layout: {
          // padding: {
          //   top: -50,
          // },
        },
        cutout: 90,
        radius: 120,
        plugins: {
          tooltip: {
            enabled: false,
          },
          legend: false,
        },
      },
    },
    donut2: {
      data: {
        labels: ["Unlabel", "Flat", "Normal", "High"],
        datasets: [
          {
            // label: "All users",
            data: [16, 0, 2, 1],
            backgroundColor: [
              "rgb(255, 99, 132)",
              "#62aa92",
              "rgb(54, 162, 235)",
              "rgb(255, 205, 86)",
            ],
          },
        ],
      } as ChartData<"doughnut">,
      options: {
        cutout: 90,
        radius: 120,
        plugins: {
          tooltip: {
            enabled: false,
          },
          legend: false,
        },
      },
    },
    bar: {
      data: {
        labels: [
          "January",
          "Febuary",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ],
        datasets: [
          {
            data: [0, 0, 0, 19, 0, 0, 0, 2, 4, 0, 0, 0],
            backgroundColor: "rgb(255, 205, 86)",
            label: "Total Uploads",
          },
          {
            data: [0, 0, 0, 10, 0, 0, 0, 1, 3, 0, 0, 0],
            backgroundColor: "#62aa92",
            label: "Your Uploads",
          },
        ],
      },
      options: {
        aspectRatio: 4.5,
        grouped: true,
        plugins: {
          alltooltips: false,
          legend: {
            position: "chartArea",
            align: "start",
            padding: 20,
            color: "red",
          },
        },
        scales: {},
      },
    },
  }),
  mounted() {
    // console.log(donut1, donut2);
    // donut1.register(ArcElement, Tooltip, Title, new AllToolTips());
    // donut2.register(ArcElement, Tooltip, Title, new AllToolTips());
  },
  methods: {},
});
</script>
