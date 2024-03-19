<template>
  <div class="container">
    <div class="header">
      <h1>
        <font-awesome-icon
          class="fa-icon"
          icon="folder-plus"
          style="color: #62aa92; margin-right: 8px"
        />Import your Image Files
      </h1>
    </div>
    <div class="body">
      <DropFileMultiple
        ref="fileLoader"
        @choose="onChoose()"
        @ready="onReady()"
        @listupdate="onUpdate()"
      />
    </div>
    <div class="control" v-if="state == UploadStatus.WAITING">
      <button class="outline secondary" @click="modal.cancelUpload = true">
        <font-awesome-icon :icon="['fas', 'ban']" />
        <span>Cancel</span>
      </button>
      <button
        class="primary"
        @click="handleUpload()"
        :disabled="disabledUpload"
      >
        <font-awesome-icon :icon="['fas', 'file-arrow-up']" />
        <span>Upload All</span>
      </button>
    </div>
    <div class="control" v-if="state == UploadStatus.UPLOADING">
      <button class="secondary outline" @click="modal.abortUpload = true">
        <font-awesome-icon :icon="['fas', 'ban']" />
        <span>Cancel</span>
      </button>
      <span>Uploading </span>
      <font-awesome-icon
        class="status-icon spinner"
        :icon="['fas', 'fa-circle-notch']"
      />
    </div>
    <div class="control" v-if="state == UploadStatus.COMPLETE">
      <button class="secondary outline" @click="handleRetry()" v-if="hasError">
        <font-awesome-icon :icon="['fas', 'rotate-right']" />
        <span>Retry</span>
      </button>
      <button class="primary outline" @click="handleNewFiles()">
        <font-awesome-icon :icon="['fas', 'file']" />
        <span>Import New Files</span>
      </button>
      <button class="primary" @click="handleGotoLabel()">
        <font-awesome-icon :icon="['fas', 'tag']" />
        <span>Go to Label</span>
      </button>
    </div>
  </div>
  <ModalTwoButton
    :isVisible="modal.ignoreError"
    headerText="Upload Confirmation"
    descriptionText="Do you want to ignore all error files and continue uploading?"
    primaryBtn="Ignore & Continue"
    secondaryBtn="Back"
    @confirm="handleIgnoreError"
    @cancel="modal.ignoreError = false"
  />
  <ModalTwoButton
    :isVisible="modal.cancelUpload"
    headerText="Upload Cancellation"
    descriptionText="Do you want to continue and cancel all of selected files?"
    primaryBtn="Yes"
    secondaryBtn="No"
    @confirm="handleCancelUpload()"
    @cancel="
      routeNext = null;
      modal.cancelUpload = false;
    "
  />
  <ModalTwoButton
    :isVisible="modal.abortUpload"
    headerText="Upload Cancellation"
    descriptionText="Files are still being uploaded. Do you want to stop uploading?"
    primaryBtn="Yes"
    secondaryBtn="No"
    @confirm="handleAbortUpload()"
    @cancel="
      routeNext = null;
      modal.abortUpload = false;
    "
  />
  <ModalComponent
    :isVisible="modal.errorUpload"
    headerText="Error occured!"
    descriptionText="Some of the files are failed to upload."
    @close="modal.errorUpload = false"
  />
</template>

<style lang="sass" scoped>
.container
  margin: 0 auto
  max-width: 1000px
  display: grid
  grid-template-areas: "header control" "body body"
  grid-template-columns: auto auto

.header
  grid-area: header
.body
  grid-area: body
  padding-right: 12px
  margin-right: -12px
  overflow-y: auto
  height: calc(100vh - 220px)
.control
  grid-area: control
  margin: auto
  margin-right: 0

  button span
    margin-left: 6px

@keyframes spin
  0%
    transform: rotate(0deg)
  100%
    transform: rotate(360deg)

.spinner
  animation: spin 1.2s linear infinite
</style>

<script lang="ts">
import { defineComponent } from "vue";
import DropFileMultiple from "@/components/DropFileMultiple.vue";
import ModalTwoButton from "@/components/ModalTwoButton.vue";
import ModalComponent from "@/components/ModalComponent.vue";
import axios from "axios";
import {
  ErrorMessage,
  FileUploadStatus,
  FileUploadStatusEnum,
  UploadResponse,
  UploadStatus,
  UploadStatusEnum,
} from "@/types/upload";
import router from "@/router";
import { NavigationGuardNext } from "vue-router";

export default defineComponent({
  name: "UploadView",
  components: {
    DropFileMultiple,
    ModalTwoButton,
    ModalComponent,
  },
  data() {
    return {
      UploadStatus,
      state: UploadStatus.NOFILE as UploadStatusEnum,
      modal: {
        ignoreError: false,
        cancelUpload: false,
        errorUpload: false,
        abortUpload: false,
      },
      disabledUpload: true,
      hasError: false,
      abortedUpload: false,
      abortController: new AbortController(),
      routeNext: null as NavigationGuardNext | null,
    };
  },
  beforeRouteLeave(to, from, next) {
    if (this.state == UploadStatus.UPLOADING) {
      this.routeNext = next;
      this.modal.abortUpload = true;
    } else if (this.state == UploadStatus.WAITING) {
      this.routeNext = next;
      this.modal.cancelUpload = true;
    } else {
      next();
    }
  },
  beforeMount() {
    window.addEventListener("beforeunload", this.preventNavigate);
  },
  beforeUnmount() {
    window.removeEventListener("beforeunload", this.preventNavigate);
  },
  methods: {
    getFileLoader() {
      return this.$refs.fileLoader as InstanceType<
        typeof DropFileMultiple
      > | null;
    },
    hasFiles() {
      let count = this.getFileLoader()?.uploadFiles.length ?? 0;
      return count > 0;
    },
    hasFilesWithStatus(status: FileUploadStatusEnum) {
      const fileLoader = this.getFileLoader();
      if (!fileLoader) return false;
      return fileLoader.uploadFiles.some((v) => v.status == status);
    },
    onChoose() {
      this.state = UploadStatus.WAITING;
      this.disabledUpload = true;
    },
    onReady() {
      this.disabledUpload = !this.hasFilesWithStatus(FileUploadStatus.WAITING);
      this.$forceUpdate();
    },
    onUpdate() {
      if (!this.hasFiles()) {
        this.state = UploadStatus.NOFILE;
        return;
      }
      if (this.hasFilesWithStatus(FileUploadStatus.FAILED))
        this.hasError = true;
      else this.hasError = false;
    },
    async upload() {
      const fileLoader = this.getFileLoader();
      if (!fileLoader) return;

      const filesToUpload = fileLoader.uploadFiles.filter(
        (v) => v.status == FileUploadStatus.WAITING
      );

      filesToUpload.forEach((v) => (v.status = FileUploadStatus.UPLOADING));

      const MAX_UPLOAD_SIZE = 50 * 1024 * 1024; // 50MB
      const FILE_PER_BATCH = 10;

      let totalLoaded = 0;
      let totalUploaded = 0;
      while (totalLoaded < filesToUpload.length) {
        fileLoader.focus(totalLoaded);

        // Batching files
        const formData = new FormData();
        let filesInBatch = 0;
        let currentUploadSize = 0;
        while (
          totalLoaded < filesToUpload.length &&
          filesInBatch < FILE_PER_BATCH
        ) {
          const upload = filesToUpload[totalLoaded];
          if (upload.file.size + currentUploadSize > MAX_UPLOAD_SIZE) break;
          totalLoaded++;
          filesInBatch++;
          currentUploadSize += upload.file.size;
          formData.append("file", upload.file);
        }

        try {
          // Perform upload with Axios
          const res = await axios.post("/api/add_collection", formData, {
            headers: { "Content-Type": "multipart/form-data" },
            signal: this.abortController.signal,
            onUploadProgress: (e) => {
              // Update upload progress bar
              const percentCompleted = Math.round(
                (e.loaded * 100) / (e.total ?? 1)
              );
              for (let i = totalUploaded; i < totalLoaded; i++) {
                const upload = filesToUpload[i];
                upload.progress = percentCompleted;
              }
            },
          });

          // Display upload result
          const resdata = res.data as UploadResponse;
          for (let i = 0; i < resdata.length; i++) {
            const { success, err, imgid } = resdata[i];
            const file = filesToUpload[totalUploaded + i];
            if (success) {
              file.status = FileUploadStatus.SUCCESS;
              file.id = imgid;
            } else {
              file.status = FileUploadStatus.FAILED;
              if (err?.startsWith("Unsupported file type"))
                file.message = ErrorMessage.UNSUPPORTED;
              else file.message = ErrorMessage.UPLOADFAILED;
            }
          }

          totalUploaded = totalLoaded;
        } catch (err) {
          for (let i = totalUploaded; i < totalLoaded; i++) {
            const upload = filesToUpload[i];
            upload.progress = 0;
            upload.message = ErrorMessage.UPLOADFAILED;
            upload.status = FileUploadStatus.FAILED;
          }
          if (axios.isCancel(err)) return false;
        }
      }
      return true;
    },
    abortUpload() {
      this.abortedUpload = true;
      this.abortController.abort();
      this.abortController = new AbortController();
    },
    handleCancelUpload() {
      this.getFileLoader()?.reset();
      this.state = UploadStatus.NOFILE;
      this.modal.cancelUpload = false;
      this.continueRoute();
    },
    async handleUpload() {
      if (this.hasFilesWithStatus(FileUploadStatus.FAILED)) {
        this.modal.ignoreError = true;
        return;
      }
      this.hasError = false;
      this.state = UploadStatus.UPLOADING;
      await this.upload();
      this.state = UploadStatus.COMPLETE;
      if (this.hasFilesWithStatus(FileUploadStatus.FAILED)) {
        this.hasError = true;
        this.getFileLoader()?.sortErrorFile();
        this.getFileLoader()?.focus(0);
        if (!this.abortedUpload) this.modal.errorUpload = true;
        else this.abortedUpload = false;
      }
    },
    handleIgnoreError() {
      this.getFileLoader()?.removeError();
      this.modal.ignoreError = false;
      this.handleUpload();
    },
    handleRetry() {
      const fileLoader = this.getFileLoader();
      if (!fileLoader) return;
      for (let upload of fileLoader.uploadFiles) {
        if (upload.status == FileUploadStatus.FAILED) {
          upload.status = FileUploadStatus.WAITING;
          upload.message = "";
          upload.progress = 0;
        }
      }
      this.handleUpload();
    },
    handleNewFiles() {
      this.handleCancelUpload();
    },
    handleGotoLabel() {
      router.push("/label");
    },
    handleAbortUpload() {
      this.abortUpload();
      this.modal.abortUpload = false;
      this.continueRoute();
    },
    continueRoute() {
      if (this.routeNext) {
        this.routeNext();
        this.routeNext = null;
      }
    },
    preventNavigate(e: BeforeUnloadEvent) {
      if (
        this.state != UploadStatus.UPLOADING &&
        this.state != UploadStatus.WAITING
      )
        return;

      this.handleCancelUpload();
      this.handleAbortUpload();
      e.preventDefault();
      e.returnValue = "";
    },
  },
});
</script>
