<template>
  <div class="panel">
    <form @submit="onSearch">
      <div class="searchbar">
        <input
          class="searchbox"
          type="text"
          placeholder="Image names"
          v-model="searchname"
        />
        <button class="primary searchbtn" type="submit">
          <font-awesome-icon :icon="['fas', 'magnifying-glass']" /> Search
        </button>
      </div>
      <div class="options">
        <h3><font-awesome-icon :icon="['fas', 'filter']" /> Search Filter</h3>
        <div class="select">
          <label for="select-footside">Foot side:</label>
          <select id="select-footside" name="footside" v-model="footside">
            <option value="">Any</option>
            <option value="L">Left</option>
            <option value="R">Right</option>
          </select>
        </div>
        <div class="select">
          <label for="select-label">Label:</label>
          <select id="select-label" name="footlabel" v-model="footlabel">
            <option value="">Any</option>
            <option value="N">Normal</option>
            <option value="H">High</option>
            <option value="F">Flat</option>
            <option value="U">Unlabel</option>
          </select>
        </div>
        <h3><font-awesome-icon :icon="['fas', 'arrow-up-z-a']" /> Sortation</h3>
        <div class="select">
          <label for="select-sortby">Sort by:</label>
          <select id="select-sortby" name="sortby" v-model="sortby">
            <option value="pk">Time of Upload</option>
            <option value="name">Name</option>
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
    </form>
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
  display: grid
  // column-gap: 8px
  grid-template-columns: auto auto
  align-items: center

  .searchbtn
    // width: $search-btn-width
    margin-left: 8px

  .searchbox
    width: 100%
    // width: calc(100% - $search-btn-width - base.$element-space)

  input
    margin: 0
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
    onSearch(e: Event) {
      e.preventDefault();
      this.searchHandler({
        name: this.searchname,
        sortby: this.sortby,
        ascending: this.sortorder,
        footlabel: this.footlabel,
        footside: this.footside,
      });
    },
  },
});
</script>
