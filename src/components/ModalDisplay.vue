<template>
  <input
    type="button"
    @click="showModal"
    :value="btnValue"
    v-bind="$attrs"
    v-if="btnValue.length > 0"
  />
  <div
    :class="[wrapperClass, { show }]"
    @click="onWrapperClicked"
    :value="btnValue"
    ref="modalWrapper"
  >
    <div class="modal-scroll-wrapper">
      <div class="modal-container">
        <input class="x-btn" type="button" @click="hideModal" value="⨉" />
        <div class="modal-body"><slot></slot></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ModalDisplay",
  props: {
    btnValue: { type: String, default: "" },
    width: { type: Number, default: 800 },
  },
  data: () => ({
    show: false,
    wrapperClass: "modal-wrapper",
  }),
  methods: {
    async hideModal() {
      if (this.show) {
        this.show = false;
        new Promise((resolve: (value: void) => void) => {
          setTimeout(() => {
            const wrapper = this.$refs.modalWrapper as HTMLDivElement;
            wrapper.style.visibility = "hidden";
            resolve();
          }, 120);
        });
      }
    },
    showModal() {
      this.show = true;
      const wrapper = this.$refs.modalWrapper as HTMLDivElement;
      wrapper.style.visibility = "visible";
    },
    onWrapperClicked(e: Event) {
      if ((e.target as HTMLDivElement).classList.contains(this.wrapperClass))
        this.hideModal();
    },
  },
  updated() {
    const wrapper = this.$refs.modalWrapper as HTMLDivElement;
    const scroller = wrapper.querySelector(
      ".modal-scroll-wrapper"
    ) as HTMLDivElement;
    scroller.style.maxWidth = `${this.width}px`;
  },
});
</script>

<style lang="sass" scoped>
@use '@/assets/styles/base'

.modal-wrapper.show
  opacity: 1

  .modal-scroll-wrapper
    top: 0

.modal-wrapper
  position: fixed
  top: 0
  left: 0
  padding: 0
  width: 100%
  height: 100vh
  backdrop-filter: brightness(30%)
  opacity: 0
  visibility: hidden
  transition: opacity 0.12s ease-out
  z-index: 100
  .modal-scroll-wrapper
    margin: auto
    position: relative
    overflow-y: auto
    padding: 0 10px
    height: 100vh
    max-width: 1500px
    top: 40px
    transition: top 0.2s cubic-bezier(0, 0, 0, 1)

    &::-webkit-scrollbar-track
      margin: 80px 0

    .modal-container
      $padding-size: 50px
      padding: $padding-size
      margin: 80px 0
      position: relative
      background-color: white
      border-radius: 12px

      &>.x-btn
        margin: 0
        font-size: 30px
        padding: 0
        width: 50px
        height: 50px
        color: base.$default-color
        background: none
        position: absolute
        top: $padding-size
        right: $padding-size

        &:hover
          background: #f37e7e
          color: base.$invert-font-color

      &>.modal-body
        min-height: 50px

@-moz-document url-prefix()
  .modal-wrapper
    overflow-y: scroll
    height: 100vh
    padding-top: 80px
    padding-bottom: 80px
    box-shadow: -50px 0 50px -50px rgba(black, 0.5) inset
    .modal-scroll-wrapper
      overflow-y: visible
      .modal-container
        margin-top: 0
</style>
