<template>
  <div class="wrapper">
    <div
      :class="['dropzone-container', ...(isDragging ? ['dragging'] : [])]"
      @dragover.prevent="dragover"
      @dragleave="dragleave"
      @drop.prevent="drop"
    >
      <input
        type="file"
        name="file"
        id="fileInput"
        class="hidden-input"
        @change="onChoose"
        ref="file"
        accept=".jpg,.jpeg,.png"
      />

      <div class="bold-text-drop">
        <span v-if="isDragging">Release to drop files here.</span>
        <span v-else>Drop your image file here.</span>
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
        <span class="gray-text">Maximum size of 5 MB</span>
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
</style>

<script lang="ts">
import { defineComponent } from "vue";
import { FileUploadMeta, FileUploadStatus } from "@/types/upload";
import { MISSING_IMAGE, generateDataURL, validateFile } from "@/utils/image";

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
      isDragging: false,
      uploadfile: null as FileUploadMeta | null,
    };
  },
  methods: {
    onChoose() {
      const fileInput = this.$refs.file as HTMLInputElement;
      if (fileInput.files == null) return;
      if (fileInput.files.length <= 0) return;
      let meta = {
        file: fileInput.files[0],
        preview: MISSING_IMAGE,
        status: FileUploadStatus.VALIDATING,
        progress: 0,
        message: "",
      };
      this.uploadfile = meta;
      this.preprocessFile(meta);
      this.$emit("choose");
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
    reset() {
      this.uploadfile = null;
    },
    async preprocessFile(meta: FileUploadMeta) {
      const isValid = await validateFile(meta);
      if (isValid) {
        await this.updatePreview(meta);
        this.$emit("ready");
      } else {
        meta.preview = MISSING_IMAGE;
        this.$emit("error");
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
