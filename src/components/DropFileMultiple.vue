<template>
  <div class="wrapper">
    <div
      :class="['dropzone-container', ...(isDragging ? ['dragging'] : [])]"
      @dragover.prevent="dragover"
      @dragleave="dragleave"
      @drop.prevent="drop"
      v-if="uploadFiles.length <= 0"
    >
      <input
        type="file"
        multiple
        name="file"
        id="fileInput"
        class="hidden-input"
        @change="onChoose"
        ref="file"
        accept=".jpg,.jpeg,.png"
      />

      <div class="bold-text-drop">
        <span v-if="isDragging">Release to drop files here.</span>
        <span v-else>Drop your image files here.</span>
      </div>
      <p class="p-margin">
        <font-awesome-icon
          :icon="['far', 'file-image']"
          :style="{ color: '#d6d6d6' }"
          size="6x"
        />
      </p>
      <p class="p-margin" style="font-size: medium">
        <span class="gray-text">Supported format .jpeg, .jpg, .png </span
        ><br /><br />
        <span class="gray-text">Maximum size of 5 MB per image</span>
      </p>
      <p class="p-margin">
        <span class="or-line">or</span>
      </p>
      <p class="p-margin">
        <label for="fileInput">
          <input
            type="button"
            value="Import Files"
            class="primary"
            @click="($refs.file as HTMLInputElement).click()"
          />
        </label>
      </p>
    </div>
    <div class="preview-container" v-if="uploadFiles.length">
      <div
        v-for="upload in uploadFiles"
        :key="upload.file.name"
        class="preview-card"
        :title="upload.file.name"
        :data-upload-status="upload.status"
      >
        <img class="preview-img" :src="upload.preview" />
        <p class="preview-name">{{ upload.file.name }}</p>
        <div class="preview-progress" :data-upload-status="upload.status">
          <div
            class="progress-bar"
            :style="{ width: `${upload.progress}%` }"
            v-if="
              upload.status == FileUploadStatus.UPLOADING ||
              upload.status == FileUploadStatus.SUCCESS
            "
          ></div>
          <div
            class="progress-error"
            v-else-if="upload.status == FileUploadStatus.FAILED"
          >
            {{ upload.message }}
          </div>
        </div>
        <div class="preview-status-box">
          <button
            v-if="
              upload.status == FileUploadStatus.WAITING ||
              upload.status == FileUploadStatus.FAILED
            "
            class="outline delete-btn"
            type="button"
            @click="remove(uploadFiles.indexOf(upload))"
            title="Remove file"
          >
            <font-awesome-icon :icon="['fas', 'trash']" />
          </button>
          <div v-if="upload.status == FileUploadStatus.UPLOADING">
            <font-awesome-icon
              class="status-icon spinner"
              :icon="['fas', 'fa-circle-notch']"
            />
          </div>
          <button
            class="outline success-btn"
            :title="`View image`"
            v-if="upload.status == FileUploadStatus.SUCCESS"
            @click="goLabelImage(upload.id)"
          >
            <font-awesome-icon :icon="['fas', 'fa-circle-check']" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="sass" scoped>
@use '@/assets/styles/base'

$error-color: #eb6568

.wrapper
  display: block
  width: 100%

.dropzone-container
  display: flex
  flex-direction: column
  padding: 1rem
  background: #FDFEFD
  border: 2px dashed #e2e8f0
  border-radius: 6px
  transition: border-color 0.1s ease-out, width 1s ease
  justify-content: center
  text-align: center
  align-items: center
  width: 100%
  height: calc(100vh - 220px)

  &.dragging
    border-color: base.$primary-color

.hidden-input
  display: none

.preview-container
  display: flex
  flex-direction: column
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr))
  grid-template-rows: repeat(auto-fill, minmax(62px, 1fr))
  overflow-y: auto
  height: 100%
  width: 100%
  gap: 12px

.preview-card
  display: grid
  background: #f7fafc
  transition: 0.1s ease-out
  box-shadow: 0 2px 8px -6px rgba(base.$shadow-color, 0.2)
  border: 1px solid #e2e8f0
  padding: 10px
  border-radius: 6px
  grid-template-columns: 50px 15% auto 50px
  grid-template-areas: "img name progress btn"

  &:hover, &:focus
    border-color: base.$primary-color

.preview-card[data-upload-status="failed"]
  border-color: $error-color

  &:hover, &:focus
    border-color: lighten($error-color, 20%)

  .delete-btn
    color: $error-color

    &:hover
      color: white


.preview-img
  grid-area: img
  width: 50px
  height: 50px
  object-fit: cover
  border-radius: 5px
  border: 1px solid #a2a2a2
  background-color: #a2a2a2

.preview-name
  grid-area: name
  align-self: center
  margin: 0
  padding: 0 8px
  white-space: nowrap
  overflow: hidden
  text-overflow: ellipsis

.preview-status-box
  grid-area: btn
  display: flex
  justify-content: center
  align-items: center

.preview-progress
  grid-area: progress
  margin: auto
  width: calc(100% - 16px)
  height: 24px
  border: 1px solid #e2e8f0
  border-radius: 4px
  overflow: hidden

  $bar-color: base.$primary-color
  .progress-bar
    height: inherit
    transition: width 1s cubic-bezier(0.738, 1.14, 0.638, 0.933)
    overflow: hidden
    float: left
    position: relative
    align-self: center

    &::after
      content: " "
      display: block
      position: absolute
      height: inherit
      width: 100%
      top: 0
      background: repeating-linear-gradient(to right, $bar-color 0%, $bar-color 30%, lighten($bar-color, 15%) 60%, $bar-color 100%)
      background-size: 200% auto
      background-position: 0 100%
      animation: gradient 4s infinite
      animation-fill-mode: forwards
      animation-timing-function: ease-out
      box-shadow: 0 0 -10px 50px rgba(0,0,0,0.5) inset

  &[data-upload-status="success"] .progress-bar::after
    animation: none
    background: $bar-color

  .progress-error
    display: flex
    align-items: center
    height: inherit
    margin-left: 4px
    color: gray


@keyframes gradient
  0%
    background-position: 0 0
  100%
    background-position: -200% 0


.delete-btn, .success-btn
  width: 50px
  height: 50px
  border: none
  font-size: 24px
  color: base.$primary-color

.delete-btn:hover
  background: $error-color

.success-btn:hover
  background: none
  border: none
  box-shadow: none
  color: lighten(base.$primary-color, 20%)

.bold-text-drop
  font-weight: bold
  font-size: 25px
  margin-bottom: 8px

.gray-text
  color: #aaa
  font-size: 16px

.or-line
  color: #aaa
  font-size: 20px
  position: relative
  display: inline-block
  padding-left: 10px
  padding-right: 10px

  &::before, &::after
    content: ""
    position: absolute
    top: 50%
    width: 50px
    background-color: #aaa
    height: 1px
    transform: translateY(-50%)

  &::before
    left: 0
    margin-left: -50px

  &::after
    right: 0
    margin-right: -50px

@keyframes spin
  0%
    transform: rotate(0deg)
  100%
    transform: rotate(360deg)

.spinner
  animation: spin 1.2s linear infinite

.status-icon
  font-size: 24px
  color: base.$primary-color

.failed-status
  color: $error-color
</style>

<script lang="ts">
import router from "@/router";
import { FileUploadMeta, FileUploadStatus } from "@/types/upload";
import { MISSING_IMAGE, generateDataURL, validateFile } from "@/utils/image";
import { defineComponent } from "vue";

export default defineComponent({
  name: "DropFile",
  props: {
    previewSize: {
      type: Number,
      default: 50,
    },
  },
  data() {
    return {
      FileUploadStatus,
      isDragging: false,
      uploadFiles: [] as Array<FileUploadMeta>,
      numberReady: 0,
    };
  },
  methods: {
    onChoose() {
      this.$emit("choose");
      const fileInput = this.$refs.file as HTMLInputElement;
      if (fileInput.files == null) return;
      for (let i = 0; i < fileInput.files.length; i++) {
        let meta = {
          file: fileInput.files[i],
          preview: MISSING_IMAGE,
          status: FileUploadStatus.VALIDATING,
          progress: 0,
          message: "",
        };
        this.uploadFiles.push(meta);
        this.preprocessFile(meta);
      }
      this.$emit("listupdate");
    },
    dragover() {
      this.isDragging = true;
    },
    dragleave() {
      this.isDragging = false;
    },
    drop(e: DragEvent) {
      const fileInput = this.$refs.file as HTMLInputElement;
      if (e.dataTransfer == null) return;
      fileInput.files = e.dataTransfer.files;
      this.isDragging = false;
      this.onChoose();
    },
    remove(i: number) {
      if (this.isReady(this.uploadFiles[i]))
        this.numberReady = Math.max(this.numberReady - 1, 0);
      this.uploadFiles.splice(i, 1);
      this.$emit("listupdate");
    },
    reset() {
      this.uploadFiles = [];
      this.numberReady = 0;
      this.$emit("listupdate");
    },
    removeError() {
      let i = 0;
      while (i < this.uploadFiles.length) {
        if (this.uploadFiles[i].status == FileUploadStatus.FAILED) {
          this.remove(i);
          continue;
        }
        i++;
      }
      this.$emit("listupdate");
    },
    sortErrorFile() {
      this.uploadFiles.sort((a, b) => {
        if (a.status == b.status) return 0;
        if (a.status == FileUploadStatus.FAILED) return -1;
        if (b.status == FileUploadStatus.FAILED) return 1;
        return 0;
      });
    },
    focus(i: number) {
      const card = document.querySelectorAll(".preview-card")[i];
      card.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    goLabelImage(id?: number) {
      if (typeof id != "undefined") router.push(`/images/id/${id}`);
      else router.push("/images");
    },
    isReady(meta: FileUploadMeta) {
      if (meta.status == FileUploadStatus.WAITING) return true;
      if (meta.status == FileUploadStatus.FAILED) return true;
      return false;
    },
    async preprocessFile(meta: FileUploadMeta) {
      const isValid = await validateFile(meta);
      if (isValid) await this.updatePreview(meta);
      else meta.preview = MISSING_IMAGE;
      this.$forceUpdate();

      this.numberReady++;
      if (this.numberReady == this.uploadFiles.length) {
        this.sortErrorFile();
        this.$emit("ready");
      }
    },
    async updatePreview(meta: FileUploadMeta) {
      if (meta.preview != MISSING_IMAGE) return;
      meta.preview = await generateDataURL(meta.file, this.previewSize);
      this.$forceUpdate();
    },
  },
});
</script>
