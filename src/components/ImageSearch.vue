<template>
  <div class="panel">
    <div class="searchbar">
      <input
        class="searchbox"
        type="text"
        placeholder="Image names"
        v-model="searchname"
      />
      <input
        class="primary searchbtn"
        type="button"
        value="Search"
        @click="onSearch"
      />
    </div>
    <div class="options">
      <h3>Search Filter</h3>
      <div class="select">
        <label for="select-footside">Foot side:</label>
        <select id="select-footside" name="footside" v-model="footside">
          <option value="">Both</option>
          <option value="L">Left</option>
          <option value="R">Right</option>
        </select>
      </div>
      <div class="select">
        <label for="select-label">Label:</label>
        <select id="select-label" name="footlabel" v-model="footlabel">
          <option value="">All</option>
          <option value="N">Normal</option>
          <option value="H">High</option>
          <option value="F">Flat</option>
          <option value="U">Unlabel</option>
        </select>
      </div>
      <h3>Sortation</h3>
      <div class="select">
        <label for="select-sortby">Sort by:</label>
        <select id="select-sortby" name="sortby" v-model="sortby">
          <option value="pk">ID</option>
          <option value="name">Name</option>
          <option value="created_date">Time of Upload</option>
        </select>
      </div>
      <div class="select">
        <label for="select-sortorder">Sort order:</label>
        <select id="select-sortorder" name="sortorder" v-model="sortorder">
          <option :value="true">Ascending</option>
          <option :value="false">Descending</option>
        </select>
      </div>
    </div>
  </div>
</template>

<style lang="sass" scoped>
@use '@/assets/styles/base'

.select
  margin: 0 0 20px 12px
  display: flex
  justify-content: space-between
  align-items: center

  select
    width: 70%

.panel
  h3
    padding-bottom: 8px
    margin-top: 20px
    margin-bottom: 12px
    border-bottom: 1px solid lightgray

.options
  overflow-y: scroll
.searchbar
  $search-btn-width: 80px

  .searchbtn
    width: $search-btn-width

  .searchbox
    width: calc(100% - $search-btn-width - base.$element-space)
</style>

<script lang="ts">
import { PropType, defineComponent } from "vue";
import { SearchParameters } from "@/types";

export default defineComponent({
  name: "ImageSearch",
  props: {
    searchHandler: {
      type: Function as PropType<(param: SearchParameters) => void>,
      required: true,
    },
  },
  data: () => ({
    sortby: "pk",
    sortorder: false, //default descending
    footside: "",
    footlabel: "",
    searchname: "",
  }),
  methods: {
    onSearch() {
      this.searchHandler({
        name: this.searchname,
        sortby: this.sortby,
        sortorder: this.sortorder,
        footlabel: this.footlabel,
        footside: this.footside,
      });
    },
  },
});
</script>
