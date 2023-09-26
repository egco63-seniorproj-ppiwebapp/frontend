<template>
  <div v-if="isVisible" class="modal-overlay">
    <div class="modal-content">
      <h5>{{ headerText }}</h5>
      <div
        class="progress-bar progress-bar-striped"
        role="progressbar"
        :style="progressBarStyle()"
        :aria-valuenow="progress"
        aria-valuemin="0"
        aria-valuemax="100"
      ></div>
      <p style="margin-top: 5px">{{ progress }}%</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "UploadProgressModal",
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
    progress: {
      type: Number,
      default: 0,
    },
    headerText: {
      type: String,
      default: "Uploading...",
    },
  },
  methods: {
    progressBarStyle() {
      let baseStyle = `width: ${this.progress}%;`;
      if (this.progress === 100) {
        return `${baseStyle} background-color: green;`;
      }
      return `${baseStyle} background-color: #6699CC;`;
    },
  },
});
</script>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  @import "bootstrap/scss/bootstrap.scss";
  background: #ffffff;
  padding: 20px;
  border-radius: 10px;
  width: 300px;
  text-align: center;
}
.progress-bar {
  height: 20px;
}

.progress-bar-striped {
  background: green;
  border-radius: 7px;
}
</style>
