<template>
  <div class="labelcontainer" v-if="hasUnlabelRemain">
    <div class="imgcontainer">
      <img
        :src="`${imgdata.img}?sz=600`"
        @error="setErrorImg"
        draggable="false"
        :style="{ display: isLoading ? 'none' : 'block' }"
      />
      <div class="delete-btn-wrapper">
        <button class="delete-btn" @click="deleteImage">
          <font-awesome-icon :icon="['fas', 'trash-can']" />
        </button>
      </div>
      <LoadSpinner v-if="isLoading" />
    </div>
    <div class="panel">
      <div class="imgname">
        <span v-if="!isEditingName" @click="startEditName"
          >{{ imgmeta.name }}
          <font-awesome-icon
            class="imgname-edit-btn"
            :icon="['fas', 'fa-pen-to-square']"
        /></span>
        <div v-else>
          <form @submit="updateName">
            <input
              type="text"
              :value="imgmeta.name"
              ref="imgNameEditField"
              @blur="updateName"
            />
          </form>
        </div>
      </div>
      <div class="panelbody">
        <form @submit="onSave">
          <h3>Foot Side</h3>
          <div class="radio-group">
            <RadioButton
              class="radio-btn"
              label="Left"
              group="footside"
              value="L"
              @select="onSelectFootside"
              :checked="imgmeta.side == 'L'"
            />
            <RadioButton
              class="radio-btn"
              label="Right"
              group="footside"
              value="R"
              @select="onSelectFootside"
              :checked="imgmeta.side == 'R'"
              required
            />
          </div>
          <h3>Foot Type</h3>
          <div class="radio-group">
            <RadioButton
              class="radio-btn"
              label="Unlabel"
              group="foottype"
              style="display: none"
              value="U"
              @select="onSelectFoottype"
              :checked="imgmeta.stat == 'U'"
            />
            <RadioButton
              class="radio-btn"
              label="Normal"
              group="foottype"
              value="N"
              @select="onSelectFoottype"
              :checked="imgmeta.stat == 'N'"
            />
            <RadioButton
              class="radio-btn"
              label="High"
              group="foottype"
              value="H"
              @select="onSelectFoottype"
              :checked="imgmeta.stat == 'H'"
            />
            <RadioButton
              class="radio-btn"
              label="Flat"
              group="foottype"
              value="F"
              @select="onSelectFoottype"
              :checked="imgmeta.stat == 'F'"
              required
            />
          </div>
          <button
            class="primary save-btn"
            type="submit"
            :disabled="isSaved || isSaving || !hasChanges"
          >
            <font-awesome-icon :icon="['fas', 'fa-floppy-disk']" />
            Save and Next
          </button>
          <span class="save-status error" v-if="saveError">
            <font-awesome-icon :icon="['fas', 'fa-circle-exclamation']" />
            Unable to save
          </span>
          <span class="save-status saving" v-else-if="isSaving">
            <font-awesome-icon
              class="spinner"
              :icon="['fas', 'fa-circle-notch']"
            />
            Saving
          </span>
          <span class="save-status" v-else-if="hasChanges">
            <font-awesome-icon :icon="['fas', 'fa-triangle-exclamation']" />
            Unsaved Changes
          </span>
          <span class="save-status saved" v-else-if="isSaved">
            <font-awesome-icon :icon="['fas', 'fa-circle-check']" />
            Successfully Saved!
          </span>
        </form>
      </div>
      <div class="panelfooter"></div>
    </div>
  </div>
  <div class="empty" v-else>
    <span style="font-size: 100px"
      ><font-awesome-icon :icon="['far', 'face-smile']"
    /></span>
    <h2>No more remaining unlabeled images.</h2>
    <p>Try adding more images.</p>
    <router-link to="/upload">
      <button class="primary outline">
        <font-awesome-icon :icon="['fas', 'fa-file-upload']" /> Upload
      </button></router-link
    >
  </div>
  <ModelTwoButton
    :isVisible="showModal"
    headerText="Unsaved Changes"
    descriptionText="You still have unsaved changes. Do you want to continue?"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  ></ModelTwoButton>
</template>

<style lang="sass" scoped>
@use '@/assets/styles/base'
.delete-btn-wrapper
  width: 4em
  height: 4em
  position: absolute
  bottom: 0
  left: 0
  display: flex
  justify-content: center
  align-items: center
  background-color: rgba(white, 0.65)
  border-top-right-radius: 6px
.delete-btn
  width: 3em
  height: 3em
  $color: #eb6568
  background-color: $color
  outline-color: rgba($color, 0.5)

.empty
  height: 100%
  display: flex
  flex-direction: column
  justify-content: center
  align-items: center

  span
    color: base.$primary-color

.labelcontainer
  height: 100%
  padding: 20px
  border-radius: 16px
  display: grid
  grid-template-columns: auto 40%
.imgcontainer
  position: relative
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
    display: flex
    align-items: center
    gap: 12px
    font-weight: bold
    font-size: 32px

    &.edit
      display: none

    .imgname-edit-btn
      color: lightgray
      font-size: medium


    &:hover
      cursor: pointer

      .imgname-edit-btn
        color: base.$default-font-color

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

.save-btn
  padding-left: 16px
  padding-right: 16px

.save-status
  margin: 0 12px

  &.saving svg
    animation: spin 1.2s linear infinite

  &.saved svg
    color: base.$primary-color

  &.error svg
    color: #f05151

@keyframes spin
  0%
    transform: rotate(0deg)

  100%
    transform: rotate(360deg)
</style>

<script lang="ts">
import { defineComponent } from "vue";
import { ImageThumbnailData, ImageMetadata } from "@/types";
import { parseImageMetadata, handleAxiosResponse, sleep } from "@/utils";
import RadioButton from "@/components/RadioButton.vue";
import LoadSpinner from "@/components/LoadSpinner.vue";
import ModelTwoButton from "@/components/ModalTwoButton.vue";
import { NavigationGuardNext } from "vue-router";

// import images from "@/assets/images.json";
import axios from "axios";

const errorImage = "/foot.png";

export default defineComponent({
  name: "LabelView",
  components: {
    RadioButton,
    LoadSpinner,
    ModelTwoButton,
  },
  data: () => ({
    imgdata: {
      img: errorImage,
    } as ImageThumbnailData,
    imgmeta: {
      name: "Loading",
    } as ImageMetadata,
    hasChanges: false,
    nameChanged: false,
    labelChanged: false,
    isEditingName: false,
    isSaved: false,
    isSaving: false,
    saveError: false,
    hasUnlabelRemain: true,
    isLoading: false,
    showModal: false,
    routeNext: null as NavigationGuardNext | null,
  }),
  created() {
    this.$watch(
      () => this.$route.params,
      async () => {
        await this.load();
      },
      { immediate: true }
    );
  },
  beforeRouteLeave(to, from, next) {
    if (this.hasChanges) {
      this.routeNext = next;
      this.checkChanges();
    } else {
      next();
    }
  },
  methods: {
    async load() {
      this.isLoading = true;
      const validParams = new URLSearchParams();
      validParams.append("start", "0");
      validParams.append("end", "1");
      validParams.append("ascending", JSON.stringify(true));
      validParams.append("filter", "U");

      let res = await handleAxiosResponse(() =>
        axios.get(`/api/get_collection/`, {
          params: validParams,
        })
      );
      if (res.status != 200) return;

      const imgMetaList = res.data as Array<ImageMetadata>;

      if (imgMetaList.length <= 0) return (this.hasUnlabelRemain = false);

      this.imgmeta = imgMetaList[0];
      this.imgdata = parseImageMetadata(this.imgmeta);
      this.isLoading = false;
    },
    setErrorImg(e: Event) {
      const el = e.target as HTMLImageElement;
      el.src = errorImage;
    },
    async startEditName() {
      this.isEditingName = true;
      await this.$nextTick();
      const input = this.$refs.imgNameEditField as HTMLInputElement;
      input.focus();
    },
    // doneEditName() {},
    updateName(e: Event) {
      e.preventDefault();
      if (!this.isEditingName) return;
      const input = this.$refs.imgNameEditField as HTMLInputElement;
      if (input.value.length > 0)
        if (this.imgmeta.name != input.value) {
          this.imgmeta.name = input.value;
          this.nameChanged = true;
          this.setStateUnsaved();
        }
      this.isEditingName = false;
    },
    onSelectFootside(side: string) {
      this.imgmeta.side = side;
      this.labelChanged = true;
      this.setStateUnsaved();
    },
    onSelectFoottype(type: string) {
      this.imgmeta.stat = type;
      this.labelChanged = true;
      this.setStateUnsaved();
    },
    setStateSaving() {
      this.hasChanges = true;
      this.isSaved = false;
      this.isSaving = true;
      this.saveError = false;
    },
    setStateSaved() {
      this.hasChanges = false;
      this.isSaved = true;
      this.isSaving = false;
      this.saveError = false;
    },
    setStateError() {
      this.hasChanges = true;
      this.isSaved = false;
      this.isSaving = false;
      this.saveError = true;
    },
    setStateUnsaved() {
      this.hasChanges = true;
      this.isSaved = false;
      this.isSaving = false;
      this.saveError = false;
    },
    async onSave(e: Event) {
      e.preventDefault();

      this.setStateSaving();

      const data = this.getSerializePatchData();
      const res = await handleAxiosResponse(() =>
        axios.patch("/api/patch_collection", data)
      );
      if (res.status == 200) {
        this.setStateSaved();
        this.saveStatusTimeout();
        await this.load();
        this.$forceUpdate();
      } else this.setStateError();
    },
    async saveStatusTimeout() {
      await sleep(1000);
      if (this.isSaved) {
        this.isSaved = false;
      }
    },
    getSerializePatchData() {
      return {
        id: this.imgmeta.id,
        name: this.imgmeta.name,
        stat: this.imgmeta.stat,
        side: this.imgmeta.side,
        remark: "",
        deleted: false,
      };
    },
    async deleteImage() {
      if (!confirm("Do you want to delete this image?")) return;

      const res = await handleAxiosResponse(() =>
        axios.patch("/api/patch_collection", {
          id: this.imgmeta.id,
          deleted: true,
        })
      );
      if (res.status == 200) {
        alert("Image is successfully deleted.");
        await this.load();
        this.$forceUpdate();
      } else alert("Failed to delete image.");
    },
    handleConfirm() {
      if (this.routeNext) {
        this.routeNext();
        this.routeNext = null;
      }
      this.showModal = false;
    },
    handleCancel() {
      this.showModal = false;
    },
    checkChanges() {
      if (this.hasChanges) {
        this.showModal = true;
      }
    },
  },
});
</script>
