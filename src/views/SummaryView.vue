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
    <div class="donut1">
      <Doughnut id="donut1" :data="donut1.data" :options="donut1.options" />
    </div>
    <div class="donut2"></div>
    <div class="trend">
      <span class="callout top vertical dialog">
        <span class="label">Unlabel</span>
        <span class="value">24%</span>
      </span>
      <span class="callout top">123 123 123</span>
    </div>
  </div>
</template>

<style lang="sass">
.callout
  background-color: #e7e7e7
  border-radius: 6px
  font-size: 12px
  box-shadow: 0 0 10px -5px rgba(0, 0, 0, 0.2)
span.callout.dialog
  >span
    display: flex
    justify-content: center
    align-items: center
    font-weight: bold
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

  &::before
    content: ""
    display: block
    position: absolute
    width: 0.75em
    height: 0.75em
    background: inherit
    transform: translate(-50%, -50%) rotate(45deg) translateZ(-1px)

  &.bottom::before
    left: 50%
    top: 100%
  &.left::before
    left: 0%
    top: 50%
  &.bottom.left::before
    left: 20px
    top: 100%
  &.bottom.left.vertical::before
    left: 0%
    top: calc(100% - 20px)

  &.right::before
    left: 100%
    top: 50%
  &.bottom.right::before
    left: calc(100% - 20px)
    top: 100%
  &.bottom.right.vertical::before
    left: 100%
    top: calc(100% - 20px)

  &.top::before
    left: 50%
    top: 0%
  &.top.left::before
    left: 20px
    top: 0%
  &.top.left.vertical::before
    left: 0%
    top: 20px
  &.top.right::before
    left: calc(100% - 20px)
    top: 0%
  &.top.right.vertical::before
    left: 100%
    top: 20px
</style>
<style lang="sass" scoped>
@use '@/assets/styles/base'

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

.counters
  grid-area: counter
  display: flex
  flex-flow: column
  margin-top: 20px

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

.donut1
  grid-area: donut1
.donut2
  grid-area: donut2
.trend
  grid-area: trend
</style>

<script lang="ts">
import { defineComponent } from "vue";
import { Doughnut } from "vue-chartjs";
import {
  Chart as ChartJS,
  DoughnutControllerChartOptions,
  // CoreChartOptions,
  PluginChartOptions,
  ChartData,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import AllToolTips from "@/views/AllToolTips";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  Title,
  ChartDataLabels,
  new AllToolTips()
);

export default defineComponent({
  name: "SummaryView",
  components: {
    Doughnut,
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
        cutout: 135,
        radius: 100,
        plugins: {
          tooltip: {
            xAlign: "left",
            yAlign: "bottom",
          },
          // datalabels: {
          //   backgroundColor: "#efefef",
          //   padding: 10,
          //   color: "black",
          //   anchor: "end",
          //   align: "end",
          //   offset: 15,
          //   labels: {
          //     value: {
          //       color: "green",
          //     },
          //     title: {
          //       color: "red",
          //     },
          //   },
          //   // formatter: (value, context) => {
          //   //   const labels = context.chart.data.labels as string[];
          //   //   return `${labels[context.dataIndex]}: ${value}`;
          //   // },
          // },
        },
      } as DoughnutControllerChartOptions & PluginChartOptions<"doughnut">,
    },
  }),
  methods: {},
});
</script>
