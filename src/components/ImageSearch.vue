<template>
  <div class="panel">
    <form @submit="onSearch">
      <div class="searchbar">
        <input
          class="searchbox"
          type="text"
          placeholder="Image names"
          v-model="searchname"
          name="searchname"
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
          <CheckableDropdown
            name="footlabel"
            id="select-label"
            :valpair="{ U: 'Unlabel', F: 'Flat', N: 'Normal', H: 'High' }"
            has-any
            class="select"
          />
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

  select, .select
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
import CheckableDropdown from "@/components/CheckableDropdown.vue";

export default defineComponent({
  name: "ImageSearch",
  components: { CheckableDropdown },
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
      const data = new FormData(e.currentTarget as HTMLFormElement);
      const dict: Record<string, any> = {};
      for (const [key, value] of data) {
        if (dict[key]) {
          if (typeof dict[key] != "object") dict[key] = [dict[key]];
          dict[key].push(value);
        } else dict[key] = value;
      }
      this.searchHandler({
        name: dict.searchname,
        sortby: dict.sortby,
        ascending: JSON.parse(dict.sortorder),
        footlabel: dict.footlabel,
        footside: dict.footside,
      });
    },
  },
});
</script>
