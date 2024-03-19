<template>
  <div class="select-wrapper">
    <div
      class="select"
      @mouseleave="menuhover = false"
      @mouseenter="menuhover = true"
    >
      <div class="selectbtn" tabindex="0" @click="showDropdown">
        <span class="value">{{ selectedListText }}</span>
        <span class="chevron">
          <font-awesome-icon :icon="['fass', 'angle-down']" />
        </span>
      </div>
      <ul
        class="select-dropdown"
        ref="dropdownMenu"
        @mouseleave="menuhover = false"
        @mouseenter="menuhover = true"
      >
        <li v-if="hasAny" key="" ariaValueText="" @click="selectAny">Any</li>
        <hr v-if="hasAny" />
        <li
          v-for="(text, value) in valpair"
          :key="value"
          :ariaValueText="value"
          @click="selectItem"
        >
          {{ text }}
        </li>
      </ul>
    </div>
    <select :name="name" :id="id" multiple ref="selectEl">
      <option v-if="hasAny" key="" value="">Any</option>
      <option
        v-for="(text, value) in valpair"
        :key="value"
        :value="value"
        :ref="`op_${value}`"
      >
        {{ text }}
      </option>
    </select>
  </div>
</template>

<style lang="sass" scoped>
 @use '@/assets/styles/base'

.select-wrapper
  display: inline-block
  select
    display: none

div.select
  display: inline-block
  position: relative
  width: 100%
div.selectbtn
  @include base.basic-element-styles
  border: 1px solid base.$default-color
  background: none
  display: flex
  line-height: 1.2em
  position: relative
  white-space: nowrap
  align-items: center

  &:focus
    @include base.focus-outline($color: base.$primary-color)

span.value
  display: inline-block
  max-width: calc(100% - 1.1em)
  overflow: hidden
  margin-left: 4px
  padding-right: 1.1em
  white-space: nowrap
span.chevron
  font-size: 0.82em
  color: black
  // margin-right: -0.6em
  margin-top: 0.1em
  right: 0.6em
  position: absolute

ul.select-dropdown
  position: absolute
  display: none
  list-style: none
  border: 1px solid base.$default-color
  background: white
  border-radius: 8px
  padding: 0
  margin: 0
  margin-top: -0.5px
  top: 100%
  left: 0px
  width: 100%
  box-shadow: 0 10px 30px -10px rgba(0,0,0, 0.6)
  overflow: hidden

  &.active
    display: block

hr
  margin: 0
  margin-bottom: -1px
  border-top: px solid base.$default-color
li
  line-height: 1.25em
  padding-left: 1.5em
  &:hover, &:focus
    background: #1967D2
    color: white

  &:focus
    outline: none

li.checked
  position: relative
  &::before
    content: "\2714"
    position: absolute
    left: 6px
</style>

<script lang="ts">
import { defineComponent, PropType } from "vue";

export default defineComponent({
  name: "CheckableDropdown",
  props: {
    name: {
      type: String,
      required: true,
    },
    id: String,
    valpair: Object as PropType<Record<string, string>>,
    hasAny: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    menuhover: false,
    selectedListText: "",
  }),
  mounted() {
    window.addEventListener("click", this.blurMenu);
    this.selectAny();
    this.$forceUpdate();
  },
  unmounted() {
    window.removeEventListener("click", this.blurMenu);
  },
  methods: {
    blurMenu() {
      if (!this.menuhover) this.hideDropdown();
      let selectEl = this.$refs.selectEl as HTMLSelectElement;
      let allEl = selectEl.querySelectorAll(`option`);
      for (let op of allEl) if (op.selected) return;
      this.selectAny();
      this.updateSelectedListText();
    },
    showDropdown() {
      let el = this.$refs.dropdownMenu as HTMLUListElement;
      el.classList.add("active");
    },
    hideDropdown() {
      let el = this.$refs.dropdownMenu as HTMLUListElement;
      el.classList.remove("active");
    },
    selectAny() {
      if (!this.hasAny) return;
      this.getOptionElement("").selected = true;
      this.getDropdownElement("").classList.add("checked");
      for (let k in this.valpair) {
        this.getOptionElement(k).selected = false;
        this.getDropdownElement(k).classList.add("checked");
      }
      this.updateSelectedListText();
    },
    selectExcept(key: string) {
      for (let k in this.valpair) {
        this.getOptionElement(k).selected = true;
        this.getDropdownElement(k).classList.add("checked");
      }
      this.getOptionElement(key).selected = false;
      this.getDropdownElement(key).classList.remove("checked");
      this.getOptionElement("").selected = false;
      this.getDropdownElement("").classList.remove("checked");
      this.updateSelectedListText();
    },
    getOptionElement(key: string) {
      let selectEl = this.$refs.selectEl as HTMLSelectElement;
      let optionEl = selectEl.querySelector(
        `option[value="${key}"]`
      ) as HTMLOptionElement;
      return optionEl;
    },
    getDropdownElement(key: string) {
      let ul = this.$refs.dropdownMenu as HTMLUListElement;
      let li = ul.querySelector(`li[aria-valuetext="${key}"]`) as HTMLLIElement;
      return li;
    },
    isSelectedAny() {
      let selectEl = this.$refs.selectEl as HTMLSelectElement;
      let allEl = selectEl.querySelectorAll(`option`);
      let all = allEl.length;
      let selected = 0;
      for (let op of allEl) {
        if (op.selected) selected += 1;
      }
      if (this.hasAny)
        if (this.getOptionElement("").selected) return true;
        else return all - 1 == selected;
      return all == selected;
    },
    selectItem(e: Event) {
      let el = e.currentTarget as HTMLLIElement;
      let key = el.ariaValueText ?? "";

      if (key == "") return this.selectAny();

      let optionEl = this.getOptionElement(key);

      if (this.hasAny && this.isSelectedAny()) return this.selectExcept(key);

      optionEl.selected = !optionEl.selected;
      el.classList.toggle("checked");
      this.updateSelectedListText();

      if (this.hasAny && this.isSelectedAny()) this.selectAny();
    },
    updateSelectedListText() {
      let selectEl = this.$refs.selectEl as HTMLSelectElement;
      let allEl = selectEl.querySelectorAll(`option`);
      let text = "";
      for (let op of allEl) {
        if (op.selected) text += op.innerText + ", ";
      }
      text = text.slice(0, -2);
      if (text.length <= 0) text = "None";
      this.selectedListText = text;
    },
  },
});
</script>
