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
      <div class="drop-area" @dragover.prevent @drop.prevent="handleFileDrop">
        <div class="drop-message-unupload" v-if="!isUploading">
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
        <div class="drop-message-isupload" v-if="isUploading">
          <div class="upload-section">
            <p class="upload-text">Uploading...</p>
            <div style="max-height: 400px; overflow-y: auto">
              <!-- ครอบ v-for ใน div นี้ -->
              <div
                v-for="file in uploadingFiles"
                :key="file.name"
                class="file-upload-container"
              >
                <span
                  class="file-name"
                  style="text-align: left; text-decoration: 
    {{ file.isCancelled ? 'line-through' : 'none' }}"
                >
                  {{ file.name }}
                </span>

                <div class="progress-container">
                  <div
                    :style="{ width: file.progress + '%' }"
                    class="progress-bar"
                  ></div>
                </div>

                <span
                  class="cancel-icon"
                  :style="
                    file.isCancelled
                      ? { color: 'lightgray', cursor: 'default' }
                      : {}
                  "
                  @click="!file.isCancelled && cancelUpload(file)"
                >
                  x
                </span>
              </div>
            </div>
            <input
              type="button"
              value="Upload All"
              class="primary"
              @click="uploadAll"
            />
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
    handleFileDrop(event) {
      let files = [];
      if (event.dataTransfer.items) {
        for (let i = 0; i < event.dataTransfer.items.length; i++) {
          if (event.dataTransfer.items[i].kind === "file") {
            files.push(event.dataTransfer.items[i].getAsFile());
          }
        }
      } else {
        files = Array.from(event.dataTransfer.files);
      }
      this.uploadFile(files);
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    async uploadFile(files) {
      this.isUploading = true;

      files.forEach((file) => {
        this.uploadingFiles.push({
          name: file.name,
          progress: 0,
          isCancelled: false,
        });

        // เตรียมข้อมูล formData
        let formData = new FormData();
        formData.append("file", file);

        // ตั้งค่า progress bar เป็น 100% เมื่อเตรียมข้อมูลเสร็จ
        const fileIndex = this.uploadingFiles.findIndex(
          (f) => f.name === file.name
        );
        if (fileIndex !== -1) {
          this.uploadingFiles[fileIndex].progress = 100;
        }
      });

      // ไม่ต้องมีโค้ดยิง API และการจัดการ error ใดๆ
    },
    fileInputChange(event) {
      const files = Array.from(event.target.files);
      this.uploadFile(files);
    },
    incrementProgress(fileName) {
      const fileIndex = this.uploadingFiles.findIndex(
        (f) => f.name === fileName
      );
      if (fileIndex !== -1 && this.uploadingFiles[fileIndex].progress < 100) {
        this.uploadingFiles[fileIndex].progress += 10; // ทุก ๆ 100ms เพิ่ม 10%
        setTimeout(() => {
          this.incrementProgress(fileName);
        }, 100);
      }
    },
    cancelUpload(file) {
      const fileIndex = this.uploadingFiles.findIndex(
        (f) => f.name === file.name
      );
      if (fileIndex !== -1) {
        this.uploadingFiles[fileIndex].isCancelled = true;
      }
    },
    uploadAll() {
      const formData = new FormData();

      // กรองไฟล์ที่ไม่ถูกยกเลิก
      const filesToUpload = this.selectedFiles.filter(
        (file) => !file.isCancelled
      );

      // เพิ่มไฟล์ที่จะอัพโหลดลงใน formData
      filesToUpload.forEach((file) => {
        formData.append("file", file);
      });

      // ทำการยิง API ที่นี่...
      const fileNames = filesToUpload.map((file) => file.name).join(", ");
      alert(`Files to be uploaded: ${fileNames}`);
    },
  },
};
</script>

<style scoped>
@import "../assets/styles/UploadView.css";
</style>
