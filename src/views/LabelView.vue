<template>
  <div class="labelcontainer">
    <div class="window">
      <div class="imgcontainer">
        <img :src="imgdata.img" @error="setErrorImg" draggable="false" />
      </div>
      <div class="panel">
        <div class="imgname">
          <span>{{ imgdata.name }}</span>
          <input type="text" :value="imgdata.name" class="editfield" />
        </div>
        <input type="button" class="x-btn" value="⨉" @click="closeWindow" />
        <div class="panelbody">
          <h3>Foot Side</h3>
          <div class="radio-group">
            <RadioButton class="radio-btn" label="Left" group="footside" />
            <RadioButton class="radio-btn" label="Right" group="footside" />
          </div>
          <h3>Foot Type</h3>
          <div class="radio-group">
            <RadioButton
              class="radio-btn"
              label="Unlabel"
              group="foottype"
              style="display: none"
            />
            <RadioButton class="radio-btn" label="Normal" group="foottype" />
            <RadioButton class="radio-btn" label="High" group="foottype" />
            <RadioButton class="radio-btn" label="Flat" group="foottype" />
          </div>
          <input class="primary" type="button" value="   Save   " />
        </div>
        <div class="panelfooter"></div>
      </div>
    </div>
  </div>
</template>

<style lang="sass" scoped>
@use '@/assets/styles/base'

.labelcontainer
  position: fixed
  width: 100%
  height: 100vh
  top: 0
  background: rgba(0,0,0,0.4)
  padding: 80px 0 50px 0
  display: flex
  justify-content: center

  .window
    background: white
    min-width: 960px
    height: 100%
    padding: 20px
    border-radius: 16px
    display: grid
    grid-template-columns: auto 400px
.imgcontainer
  height: calc(100vh - 170px)
  img
    width: 100%
    height: 100%
    object-fit: contain
.panel
  padding: 10px 10px 0 50px
  display: grid
  grid-template-columns: auto 50px
  grid-template-rows: 50px auto 50px
  grid-template-areas: "name x" "body body" "foot foot"


.imgname
  grid-area: name
  display: flex
  // justify-content: center
  align-items: center
  span
    display: inline-block
    font-weight: bold
    font-size: 32px

    &:hover
      cursor: pointer
      &::after
        content: " ✏️"
        font-size: 24px
  .editfield
    display: none

.panelbody
  grid-area: body
  border-top: 1px solid lightgray
  margin-top: 12px
  .radio-group
    margin-bottom: 50px

    .radio-btn
      margin-top: 3px

.panelfooter
  grid-area: foot

.x-btn
  grid-area: x
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
</style>

<script lang="ts">
import { defineComponent } from "vue";
import { ImageData } from "@/types";
import RadioButton from "@/components/RadioButton.vue";

import images from "@/assets/images.json";
import router from "@/router";

const errorImage = "/foot.png";

export default defineComponent({
  name: "LabelView",
  components: {
    RadioButton,
  },
  data: () => ({
    imgdata: {} as ImageData,
  }),
  created() {
    this.$watch(
      () => this.$route.params,
      () => {
        this.load();
      },
      { immediate: true }
    );
  },
  methods: {
    load() {
      let imgid = Number(this.$route.params.imgid);
      if (imgid >= images.length) {
        this.closeWindow();
        return;
      }
      this.imgdata = images[imgid];
    },
    setErrorImg(e: Event) {
      const el = e.target as HTMLImageElement;
      el.src = errorImage;
    },
    closeWindow() {
      router.push("/images");
    },
  },
});
</script>
