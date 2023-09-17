<template>
  <div class="upload-view">
    <header class="logo-header">
      <font-awesome-icon
        class="fa-icon"
        icon="folder-plus"
        :style="{ color: '#62aa92' }"
      />
      <h1>Import your File or Folder</h1>
    </header>
    <div class="content">
      <div class="side-space"></div>
      <div class="drop-area" @dragover.prevent @drop="handleFileDrop">
        <div class="drop-message" v-if="!isUploading">
          <p class="drop-message-text">
            <span class="bold-text">Drop your file or Folder here</span>
          </p>
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
              @change="uploadFile"
              style="display: none"
              accept=".jpeg,.jpg,.png"
            />
            <input
              type="button"
              value="Import File or Folder.."
              class="primary"
              @click="triggerFileInput"
            />
          </p>
        </div>
        <div class="drop-message" v-if="isUploading">
          <div class="upload-section">
            <p class="upload-text">Uploading...</p>
            <div
              v-for="file in uploadingFiles"
              :key="file.name"
              class="file-upload-container"
            >
              <span class="file-name">{{ file.name }}</span>
              <div class="progress-container">
                <div
                  :style="{ width: file.progress + '%' }"
                  class="progress-bar"
                ></div>
              </div>
              <span class="cancel-icon" @click="cancelUpload(file)">x</span>
            </div>
          </div>
        </div>
      </div>
      <div class="side-space"></div>
    </div>
    <footer class="footer">
      <div v-if="responseMessage" class="response-message">
        {{ responseMessage }},
        {{ isUploading }}
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      responseMessage: "",
      isUploading: false, // ตัวแปรสำหรับควบคุมการแสดง/ซ่อนส่วนต่างๆ
      uploadingFiles: [], // สำหรับเก็บไฟล์ที่กำลังอัพโหลด
    };
  },
  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    async uploadFile(event) {
      this.isUploading = true;
      const file = event.target.files[0];
      this.uploadingFiles.push({ name: file.name, progress: 0 });

      let formData = new FormData();
      formData.append("file", file);

      try {
        let response = await fetch("http://127.0.0.1:8000/upload", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          let result = await response.json();
          this.responseMessage = result.message;
          const fileIndex = this.uploadingFiles.findIndex(
            (f) => f.name === file.name
          );
          if (fileIndex !== -1) {
            this.uploadingFiles[fileIndex].progress = 100;
            setTimeout(() => {
              this.uploadingFiles.splice(fileIndex, 1);
            }, 1000);
          }
        } else {
          console.error("File upload failed");
          this.responseMessage = "File upload failed";
        }
      } catch (error) {
        console.error("There was an error uploading the file.", error);
        this.responseMessage = error.message || "Unknown error occurred.";
      } finally {
        // this.isUploading = false;
      }
    },
    cancelUpload(file) {
      const fileIndex = this.uploadingFiles.findIndex(
        (f) => f.name === file.name
      );
      if (fileIndex !== -1) {
        this.uploadingFiles.splice(fileIndex, 1);
      }
    },
  },
};
</script>

<style scoped>
@import "../assets/styles/UploadView.css";
</style>
