<template>
  <div v-if="isVisible" class="modal-overlay">
    <div class="modal-content">
      <h2>{{ headerText }}</h2>
      <div
        class="progress-bar progress-bar-striped"
        role="progressbar"
        :style="progressBarStyle()"
        :aria-valuenow="progress"
        aria-valuemin="0"
        aria-valuemax="100"
      ></div>
      <p>{{ progress }}%</p>
    </div>
  </div>
</template>

<script>
export default {
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
      return baseStyle;
    },
  },
};
</script>

<style scoped>
/* @import "bootstrap/scss/bootstrap.scss"; */
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
