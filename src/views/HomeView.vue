<template>
  <div class="homecontainer">
    <div class="panelwrapper">
      <HomePanel
        style="padding-left: 50px"
        :unlabel-count="summary.userLabelCount.U"
      />
    </div>
    <div class="bodywrapper">
      <SummaryView
        style="padding-right: 50px"
        :data-ready="dataReady"
        :all-label-count="
          Object.values(summary.allLabelCount).map((x) => x + 0)
        "
        :user-label-count="
          Object.values(summary.userLabelCount).map((x) => x + 0)
        "
        :all-label-month-count="summary.allLabelMonthCount"
        :user-label-month-count="summary.userLabelMonthCount"
      />
    </div>
  </div>
</template>

<style lang="sass" scoped>
.homecontainer
  display: grid
  grid-template-columns: 400px auto
  grid-template-rows: 100%
  grid-template-areas: "panel body"
  height: 100%

.panelwrapper
  grid-area: panel

.bodywrapper
  grid-area: body
  overflow-x: auto
</style>

<script lang="ts">
import { defineComponent } from "vue";
import HomePanel from "@/components/HomePanel.vue";
import { handleAxiosResponse } from "@/utils";
import axios from "axios";
import SummaryView from "./SummaryView.vue";

interface LabelCountInterface {
  U: number;
  N: number;
  F: number;
  H: number;
}
interface SummaryData {
  allUploadCount: number;
  userUploadCount: number;
  allLabelCount: LabelCountInterface;
  userLabelCount: LabelCountInterface;
  allLabelMonthCount: number[];
  userLabelMonthCount: number[];
}
interface SummaryResponseData {
  all_count: number;
  user_count: number;
  all_label_count: LabelCountInterface;
  user_label_count: LabelCountInterface;
  all_label_month_count: number[];
  user_label_month_count: number[];
}

export default defineComponent({
  name: "HomeView",
  components: {
    HomePanel,
    SummaryView,
  },
  data: () => ({
    summary: {
      allUploadCount: 0,
      userUploadCount: 0,
      allLabelCount: { U: 1, N: 2, F: 3, H: 4 },
      userLabelCount: { U: 0, N: 3, F: 2, H: 1 },
      allLabelMonthCount: [0, 0, 19, 0, 0, 0, 0, 23, 67, 0, 0, 0],
      userLabelMonthCount: [0, 0, 12, 0, 0, 0, 0, 23, 56, 0, 0, 0],
    } as SummaryData,
    dataReady: false,
  }),
  methods: {
    async loadSummary() {
      const res = await handleAxiosResponse(() => axios.get("/api/summary"));
      if (res.status == 200) {
        const data = res.data as SummaryResponseData;
        this.summary.allUploadCount = data.all_count;
        this.summary.userUploadCount = data.user_count;
        this.summary.allLabelCount = data.all_label_count;
        this.summary.userLabelCount = data.user_label_count;
        this.summary.userLabelMonthCount[new Date().getMonth()] = Math.floor(
          Object.values(data.user_label_count).reduce((a, b) => a + b) / 2.5
        );
        return true;
      }
      return false;
    },
  },
  async mounted() {
    const isSuccess = await this.loadSummary();
    if (isSuccess) {
      this.dataReady = true;
    }
  },
});
</script>
