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
        <div class="drop-message">
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
              type="button"
              value="Import File or Folder.."
              class="primary"
            />
          </p>
        </div>
      </div>
      <div class="side-space"></div>
    </div>
    <footer class="footer"></footer>
  </div>
</template>

<style scoped>
@import "../assets/styles/UploadView.css";
</style>
