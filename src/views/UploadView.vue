<template>
  <div class="grid-container">
    <div class="flex-2-head">
      <font-awesome-icon
        class="fa-icon"
        icon="folder-plus"
        :style="{ color: '#62aa92' }"
      />
      <h1>Import your Image Files</h1>
      <!-- <input
        type="button"
        value="switch event"
        class="primary"
        @click="toggleUpload"
      />
      uploadProgress {{ uploadProgress }} progressPerChunk
      {{ progressPerChunk }} -->
    </div>
    <div class="col"></div>
    <div class="col-6-upload">
      <div class="drop-area" @dragover.prevent @drop.prevent="handleFileDrop">
        <div class="drop-message-unupload" v-if="!isUploading">
          <div class="drop-text">
            <span class="bold-text-drop">Drop your Image files here</span>
          </div>
          <div class="drop-area-content">
            <p class="p-margin">
              <font-awesome-icon
                :icon="['far', 'file-image']"
                :style="{ color: '#d6d6d6' }"
                size="6x"
              />
            </p>
            <p class="p-margin">
              <span class="gray-text">Image file type .jpeg, .jpg, .png </span>
              <!-- <span class="underline">other similar</span>
              <span class="gray-text"> file types</span> -->
            </p>
            <p class="p-margin">
              <span class="or-line">or</span>
            </p>
            <p class="p-margin">
              <input
                type="file"
                ref="fileInput"
                @change="fileInputChange"
                style="display: none"
                accept=".jpeg,.jpg,.png"
                multiple
              />
              <input
                type="button"
                value="Import Files"
                class="primary"
                @click="triggerFileInput"
              />
            </p>
          </div>
        </div>
        <div class="drop-message-isupload" v-if="isUploading">
          <div class="upload-text">
            <span class="bold-text-upload">uploading....</span>
          </div>
          <div class="file-info">
            <span style="font-size: 16px; font-family: Arial, sans-serif"
              >Total files: {{ totalFiles }}</span
            >
          </div>
          <div class="uploading-file">
            <div
              v-for="(file, index) in uploadingFiles"
              :key="file.name"
              class="file-upload-container"
            >
              <div class="file-name-container">
                <span
                  class="file-name"
                  style="font-size: 16px; font-family: Arial, sans-serif"
                >
                  {{ file.name }}
                </span>
              </div>

              <div class="progress-bar-container">
                <div class="progress">
                  <div
                    class="progress-bar progress-bar-striped"
                    role="progressbar"
                    :style="progressBarStyle(file)"
                    :aria-valuenow="file.progress"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
                <font-awesome-icon
                  v-if="file.isLabeled"
                  :icon="['fas', 'tags']"
                  style="color: #62aa92; margin-right: 25px"
                />
              </div>

              <div :class="['cancel-icon', file.isCancelled ? 'disabled' : '']">
                <font-awesome-icon
                  v-if="!file.isCancelled"
                  :icon="['fas', 'circle-xmark']"
                  style="color: #ff0000"
                  class="cancelable-icon"
                  @click="cancelUpload(index)"
                />
                <font-awesome-icon
                  v-else-if="file.isCancelled"
                  :icon="['fas', 'circle-xmark']"
                  style="color: #f49a9a"
                  class="canceled-icon"
                />
              </div>
            </div>
          </div>
          <div class="apply-upload">
            <input
              type="button"
              value="upload all"
              class="primary"
              @click="uploadAll"
              :disabled="
                checkAllFilesCancelled() || !isAllUploaded || isUploadingAll
              "
              :style="
                allFilesCancelled || !isAllUploaded || isUploadingAll
                  ? { cursor: 'not-allowed' }
                  : { cursor: 'pointer' }
              "
            />
          </div>
        </div>
      </div>
    </div>
    <div class="col"></div>

    <div class="flex-2-footer"></div>
    <ModalComponent
      :isVisible="showModalreload"
      :headerText="modalHeaderText"
      :descriptionText="modalMessage"
      @close="closeModalAndRefresh"
    />
    <ModalComponent
      :isVisible="showModal"
      :headerText="modalHeaderText"
      :descriptionText="modalMessage"
      @close="closeModal"
    />
    <UploadProgressModal
      :isVisible="isUploadingAll"
      :progress="uploadProgressBar"
      headerText="uploading to Database"
    />
  </div>
</template>

<script>
import ModalComponent from "../components/ModalComponent.vue";
import UploadProgressModal from "../components/UploadProgressModal.vue";
import axios from "axios";
export default {
  components: {
    ModalComponent,
    UploadProgressModal,
  },
  data() {
    return {
      isUploading: false,
      uploadingFiles: [],
      showModalreload: false,
      showModal: false,
      modalMessage: "",
      modalHeaderText: "เกิดข้อผิดพลาด",
      fileUploaded: false,
      modalAction: null,
      totalFiles: 0,
      isUploadingAll: false,
      uploadProgress: 0,
      progressPerChunk: 0,
      uploadProgressBar: 0,
    };
  },
  methods: {
    updateTotalFiles(files) {
      this.totalFiles = files.length;
    },
    isValidFile(file) {
      const validExtensions = ["image/jpeg", "image/jpg", "image/png"];
      return validExtensions.includes(file.type);
    },
    closeModalAndRefresh() {
      window.location.reload();
    },
    closeModal() {
      this.showModal = false;
    },

    toggleUpload() {
      this.isUploading = !this.isUploading;
    },
    handleFileDrop(event) {
      if (this.fileUploaded) {
        return;
      }

      let files = event.dataTransfer.items
        ? Array.from(event.dataTransfer.items).map((item) => item.getAsFile())
        : Array.from(event.dataTransfer.files);

      const originalFileCount = files.length;
      files = files.filter(this.isValidFile);

      if (files.length < originalFileCount) {
        this.modalMessage =
          "The files you attempted to upload contain unsupported formats. Only .jpg, .jpeg, and .png files are allowed.<br><br> Please check your selection and try again.";
        this.modalHeaderText = "Unsupported File Format";
        this.showModal = true;
        return;
      }

      this.uploadFile(files);
      this.fileUploaded = true;
    },

    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    fileInputChange(event) {
      if (this.fileUploaded) {
        return;
      }
      const files = Array.from(event.target.files).filter(this.isValidFile);

      if (files.length !== event.target.files.length) {
        this.modalMessage =
          "The files you attempted to upload contain unsupported formats. Only .jpg, .jpeg, and .png files are allowed.<br><br> Please check your selection and try again.";
        this.modalHeaderText = "Unsupported File Format";
        this.showModal = true;
      }

      if (files.length > 0) {
        this.uploadFile(files);
      }
      this.fileUploaded = true;
    },
    async uploadFile(files) {
      try {
        this.isUploading = true;

        files.forEach((file) => {
          const newFile = {
            name: file.name,
            progress: 0,
            isCancelled: false,
            isLabeled: false,
            base64: null,
          };
          this.uploadingFiles.push(newFile);
        });

        this.totalFiles = this.uploadingFiles.length;

        for (let i = 0; i < this.uploadingFiles.length; i++) {
          await this.convertToBase64(files[i], this.uploadingFiles[i]);
          await this.simulateUpload(this.uploadingFiles[i]);
        }
      } catch (error) {
        console.error("Error during upload:", error);
        this.modalMessage =
          "Sorry, we had trouble processing one of your files. Please try uploading again.";
        this.modalHeaderText = "File Processing Failed 🚫";
        this.showModalreload = true;
      }
    },

    simulateUpload(file) {
      return new Promise((resolve) => {
        const updateProgress = () => {
          if (file.isCancelled) {
            resolve();
            return;
          }
          if (file.progress < 100) {
            this.incrementProgress(file.name);
            setTimeout(updateProgress, 20);
          } else {
            resolve();
          }
        };
        updateProgress();
      });
    },

    convertToBase64(file, targetFileObj) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        targetFileObj.base64 = reader.result.split(",")[1];
        // console.log(targetFileObj.base64);
      };
      reader.onerror = (error) => {
        console.log("Error converting to base64: ", error);
      };
    },

    incrementProgress(fileName) {
      const fileIndex = this.findFileIndex(fileName);
      if (fileIndex !== -1 && this.uploadingFiles[fileIndex].progress < 100) {
        this.uploadingFiles[fileIndex].progress += 10;
      }
    },
    cancelUpload(index) {
      this.uploadingFiles[index].isCancelled = true;
      this.totalFiles--;
    },

    findFileIndex(fileName) {
      return this.uploadingFiles.findIndex((f) => f.name === fileName);
    },
    async uploadAll() {
      try {
        this.isUploadingAll = true;
        this.uploadProgress = 0;

        const maxChunkSize = 5 * 1024 * 1024; // 5MB
        const maxFilesPerChunk = 10;
        let chunks = [];
        let currentChunk = [];
        let currentChunkSize = 0;
        let currentFileCount = 0;

        for (let file of this.uploadingFiles) {
          const fileSize = atob(file.base64).length; // ขนาดของไฟล์ใน byte

          if (
            currentChunkSize + fileSize <= maxChunkSize &&
            currentFileCount < maxFilesPerChunk
          ) {
            currentChunk.push(file.base64);
            currentChunkSize += fileSize;
            currentFileCount++;
          } else {
            chunks.push(currentChunk);
            currentChunk = [file.base64];
            currentChunkSize = fileSize;
            currentFileCount = 1;
          }
        }
        if (currentChunk.length) {
          chunks.push(currentChunk);
        }

        this.progressPerChunk = 100 / chunks.length;

        let totalResponses = 0;
        let singleID = null;

        for (let chunk of chunks) {
          const targetProgress = this.uploadProgress + this.progressPerChunk;

          const response = await axios.post("api/add_collection", {
            img_file: chunk,
          });

          if (response.status !== 200) {
            throw new Error("Failed to upload some chunks");
          }

          this.smoothProgress(targetProgress);
          this.uploadProgress += this.progressPerChunk;
          totalResponses++;

          if (response.data.ids.length === 1 && totalResponses === 1) {
            singleID = response.data.ids[0];
          } else {
            singleID = null;
          }
        }
        setTimeout(() => {
          if (singleID) {
            this.$router.push(`/images/label/${singleID}`);
          } else {
            this.$router.push("/images");
          }
        }, 2500);
      } catch (error) {
        console.error("Error during batch upload:", error);
        this.modalMessage =
          "Sorry, there was a problem uploading your files. Please try again later.";
        this.modalHeaderText = "Upload Failed 🚫";
        this.isUploadingAll = false;
        this.showModalreload = true;
      } finally {
        setTimeout(() => {
          this.isUploadingAll = false;
        }, 3000);
      }
    },
    smoothProgress(target) {
      const step = 1;
      const interval = 20;

      let currentProgress = this.uploadProgress;

      const progressInterval = setInterval(() => {
        if (currentProgress < target) {
          currentProgress += step;
          if (currentProgress > target) currentProgress = target;
          this.uploadProgressBar = currentProgress;
        } else {
          clearInterval(progressInterval);
        }
      }, interval);
    },
    checkAllFilesCancelled() {
      if (this.uploadingFiles.every((file) => file.isCancelled)) {
        this.modalHeaderText = "Cancel Upload";
        this.modalMessage =
          "You have canceled the upload of all files. Please press OK to reload the page.";
        this.showModalreload = true;
        this.modalAction = this.closeModalAndRefresh;
        return true;
      }
      return false;
    },
  },
  computed: {
    progressBarStyle() {
      return (file) => {
        let baseStyle = `width: ${file.progress}%`;
        if (file.isCancelled) {
          return `${baseStyle}; background-color: red`;
        } else if (file.progress === 100) {
          return `${baseStyle}; background-color: green`;
        }
        return baseStyle;
      };
    },
    isAllUploaded() {
      return this.uploadingFiles.every(
        (file) => file.progress === 100 || file.isCancelled
      );
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/UploadView.scss";
</style>
