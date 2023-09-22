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
    <div class="col-6 bg-info">
      <div class="drop-area">
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
              v-for="file in uploadingFiles"
              :key="file.name"
              class="file-upload-container"
            >
              <span class="file-name">
                {{ file.name }}
              </span>

              <div class="progress" style="margin-right: 5px">
                <div
                  class="progress-bar progress-bar-striped"
                  role="progressbar"
                  style="width: 500px"
                  aria-valuenow="10"
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
              <font-awesome-icon
                :icon="['fas', 'tags']"
                style="color: #62aa92; margin-right: 20px"
              />
              <font-awesome-icon
                :icon="['fas', 'circle-xmark']"
                style="color: #ff0000"
              />
              <font-awesome-icon
                :icon="['fas', 'circle-xmark']"
                style="color: #f49a9a"
              />
            </div>
          </div>
          <div class="apply-upload">
            <input
              type="button"
              value="upload all"
              class="primary"
              @click="clickswitch"
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
      isUploading: false, // ตัวแปรสำหรับควบคุมการแสดง/ซ่อนส่วนต่างๆ
      uploadingFiles: [
        { name: "image1.jpg" },
        { name: "document2.pdf" },
        { name: "presentation3.ppt" },
        { name: "image5.jpg" },
        { name: "document6.pdf" },
        { name: "presentation7.ppt" },
        { name: "image8.jpg" },
        { name: "document9.pdf" },
        { name: "presentation10.ppt" },
        { name: "image11.jpg" },
        { name: "document12.pdf" },
        { name: "presentation13.ppt" },
        { name: "image14.jpg" },
        { name: "document15.pdf" },
        { name: "presentation16.ppt" },
        { name: "image1.jpg" },
        { name: "document2.pdf" },
        { name: "presentation3.ppt" },
        { name: "image5.jpg" },
        { name: "document6.pdf" },
        { name: "presentation7.ppt" },
        { name: "image8.jpg" },
        { name: "document9.pdf" },
        { name: "presentation10.ppt" },
        { name: "image11.jpg" },
        { name: "document12.pdf" },
        { name: "presentation13.ppt" },
        { name: "image14.jpg" },
        { name: "document15.pdf" },
        { name: "presentation16.ppt" },
      ], // สำหรับเก็บไฟล์ที่กำลังอัพโหลด
    };
  },
  methods: {
    clickswitch() {
      this.isUploading = !this.isUploading;
    },
  },
};
</script>

<style scoped>
.file-upload-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

h1 {
  font-size: 32px; /* ตั้งค่า font-size สำหรับ h1 เป็น 32px และจะไม่เปลี่ยนเมื่อย่อหน้า */
}

.drop-message-unupload {
  display: flex;
  flex-direction: column;
  flex: 1; /* ครอบพื้นที่ทั้งหมดใน col-6.bg-info */
}
.drop-area {
  display: flex;
  flex-direction: column;
  flex: 1; /* ครอบพื้นที่ทั้งหมดใน col-6.bg-info */
  background-color: darkslategray;
}
.drop-message-isupload {
  display: flex;
  flex-direction: column;
  flex: 1; /* ครอบพื้นที่ทั้งหมดใน col-6.bg-info */
  background-color: black;
}
.bold-text-upload {
  font-weight: bold;
  font-size: 16px;
}

.bold-text-drop {
  font-weight: bold;
  font-size: 25px;
}
.drop-text {
  flex: 1;
  background-color: aquamarine;
  display: flex;
  justify-content: center;
  align-items: center;
}

.upload-text {
  flex: 1;
  background-color: blueviolet;
  display: flex;
  justify-content: center;
  align-items: center;
}

.drop-area-content {
  flex: 6;
  background-color: bisque;
}

.uploading-file {
  flex: 500px;
  background-color: cornsilk;
  overflow-y: auto;
}
.apply-upload {
  flex: 1;
  background-color: brown;
  align-items: center;
  justify-content: center;
  display: flex;
}
.grid-container {
  display: grid;
  grid-template-rows: minmax(80px, auto) 1fr minmax(80px, auto);
  grid-template-columns: minmax(0, 2fr) minmax(440px, 6fr) minmax(0, 2fr);
  height: calc(100vh - 42px);
  background-color: salmon;
  overflow-y: auto;
  overflow-x: hidden;
}

.flex-2-head {
  grid-column: 2 / span 3;
  display: flex;
  gap: 1rem; /* ระยะห่างระหว่าง content ในแนวแกน X */
  padding-left: 10px;
  align-items: center;
}

.col-6 {
  grid-column: 2;
  min-width: 500px;
  width: auto;
  min-height: 400px;
  display: flex; /* ตั้งค่าให้แสดงผลแบบ flexbox */
  flex-direction: column; /* กำหนดให้ flex items วางตัวแบบแนวตั้ง */
}

.flex-2-footer {
  grid-column: 1 / span 3;
}
</style>
