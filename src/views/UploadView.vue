<template>
  <div class="upload-view">
    <header class="logo-header">
      <img src="@/assets/logo.png" alt="Logo" />
      <h1>Import your File or Folder</h1>
    </header>
    <div class="content">
      <div class="drop-area" @dragover.prevent @drop="handleFileDrop">
        <div class="drop-message">
          <p class="drop-message-text">
            <span class="bold-text">Drop your file or Folder here</span>
          </p>
          <p>
            <img src="@/assets/logo.png" alt="File Icon" class="file-icon" />
          </p>
          <p>
            <span class="gray-text">and </span>
            <span class="underline">other similar</span>
            <span class="gray-text"> file types</span>
          </p>
          <p>
            <span class="gray-text-or">-or-</span>
          </p>
          <p>
            <input
              type="button"
              value="Import File or Folder.."
              class="primary"
            />
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.upload-view {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 100vh;
  padding: 20px;
  box-sizing: border-box;
}

.logo-header {
  display: flex;
  align-items: center;
  justify-content: flex-start; /* จัดชิดซ้าย */
  margin-bottom: 20px;
  margin-left: 100px; /* เพิ่ม margin left 50px */
}

.logo-header img {
  width: 50px;
  height: 50px;
  margin-right: 10px;
}

.content {
  width: 100%;
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.drop-area {
  width: 800px; /* กำหนดความกว้างเป็น 800px */
  margin: 0 auto; /* จัดให้อยู่กึ่งกลางหน้าจอ */
  height: 500px;
  border: 2px dashed #ccc;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
}

.drop-message-text {
  font-size: 16px;
  margin-bottom: 10px;
}

.bold-text {
  font-weight: bold;
  color: black;
  /* ตัวหนาสีดำ */
}

.file-icon {
  width: 100px;
  height: 100px;
  margin: 0 10px;
}

.gray-text {
  color: #aaa;
  /* สีเทาอ่อน */
}

.gray-text-or {
  font-weight: bold;
  color: #aaa;
  /* สีเทาอ่อน */
}

.underline {
  color: #aaa;
  text-decoration: underline;
}

.import-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 20px;
}
</style>
