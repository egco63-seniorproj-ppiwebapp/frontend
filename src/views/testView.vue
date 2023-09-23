<template>
  <div class="grid-container">
    <div class="flex-2-head bg-primary">
      <font-awesome-icon
        class="fa-icon"
        icon="folder-plus"
        :style="{ color: '#62aa92' }"
      />
      <h1>Import your File or Folder</h1>
      <input
        type="button"
        value="switch event"
        class="primary"
        @click="clickswitch"
      />
    </div>
    <div class="col bg-success">Column 1 content</div>
    <div class="col-6-upload bg-info">
      <div class="drop-area" @dragover.prevent @drop.prevent="handleFileDrop">
        <div class="drop-message-unupload" v-if="!isUploading">
          <div class="drop-text">
            <span class="bold-text-drop">Drop your file or Folder here</span>
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
              <span class="gray-text">and </span>
              <span class="underline">other similar</span>
              <span class="gray-text"> file types</span>
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
                value="Import File or Folder.."
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
          <div class="uploading-file">
            <div
              v-for="(file, index) in uploadingFiles"
              :key="file.name"
              class="file-upload-container"
            >
              <div class="file-name-container">
                <span class="file-name">
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
            />
          </div>
        </div>
      </div>
    </div>
    <div class="col bg-warning">Column 3 content</div>

    <div class="flex-2-footer bg-danger">Row 3 content</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isUploading: false,
      uploadingFiles: [],
    };
  },
  methods: {
    toggleUpload() {
      this.isUploading = !this.isUploading;
    },
    handleFileDrop(event) {
      const files = event.dataTransfer.items
        ? Array.from(event.dataTransfer.items).map((item) => item.getAsFile())
        : Array.from(event.dataTransfer.files);
      this.uploadFile(files);
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    fileInputChange(event) {
      const files = Array.from(event.target.files);
      this.uploadFile(files);
    },
    async uploadFile(files) {
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

      for (let i = 0; i < this.uploadingFiles.length; i++) {
        await this.convertToBase64(files[i], this.uploadingFiles[i]); // ใช้ await ที่นี่เพื่อรอให้แปลงเสร็จ
        await this.simulateUpload(this.uploadingFiles[i]); // และที่นี่เพื่อรอให้อัพโหลดเสร็จ
      }
    },

    simulateUpload(file) {
      return new Promise((resolve) => {
        const updateProgress = () => {
          if (file.isCancelled) {
            resolve(); // Resolve promise immediately if file is cancelled.
            return;
          }
          if (file.progress < 100) {
            this.incrementProgress(file.name);
            setTimeout(updateProgress, 500);
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
        targetFileObj.base64 = reader.result;
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
    },

    findFileIndex(fileName) {
      return this.uploadingFiles.findIndex((f) => f.name === fileName);
    },
    uploadAll() {
      // Implement the actual upload logic here
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
        return baseStyle; // สี default
      };
    },
  },
};
</script>

<style scoped>
@import "../assets/styles/TestView.css";
</style>
