<template>
  <input type="button" @click="showModal" :value="btnValue" v-bind="$attrs" />
  <div
    :class="[wrapperClass, { show }]"
    @click="onWrapperClicked"
    :value="btnValue"
    ref="modalWrapper"
  >
    <div class="modal-scroll-wrapper">
      <div class="modal-container">
        <h1>{{ title }}</h1>
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
    title: String,
    btnValue: String,
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
  $width: 800px
  @include base.container-width($margin: 0px)
  width: calc($width)
  height: 100vh
  backdrop-filter: blur(4px) brightness(50%)
  opacity: 0
  visibility: hidden
  transition: opacity 0.12s ease-out
  .modal-scroll-wrapper
    position: relative
    overflow-y: scroll
    padding: 0 10px
    height: 100vh
    top: 40px
    transition: top 0.2s cubic-bezier(0, 0, 0, 1)

    &::-webkit-scrollbar-track
      margin: 80px 0

    .modal-container
      background-color: white
      padding: 50px
      margin: 80px 0
      border-radius: 12px
      display: grid
      grid-template-columns: auto 50px
      grid-template-rows: 50px auto
      grid-template-areas: "head x-btn" "body body"

      &>h1
        grid-area: head
        margin: 0
        margin-top: 8px
      &>.x-btn
        grid-area: x-btn
        margin: 0
        font-size: 30px
        padding: 0
        width: 50px
        height: 50px
        color: base.$default-color
        background: none

        &:hover
          background: #f37e7e
          color: base.$invert-font-color

      &>.modal-body
        grid-area: body
        padding: 20px 0
</style>
