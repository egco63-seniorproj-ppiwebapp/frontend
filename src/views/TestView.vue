<template>
  <div>
    <!-- Your other content here -->
    <button @click="uploadFiles">Upload All</button>
    <UploadProgressModal :isVisible="isUploading" :progress="uploadProgress" />
  </div>
</template>

<script>
import UploadProgressModal from "../components/UploadProgressModal.vue";

export default {
  components: {
    UploadProgressModal,
  },
  data() {
    return {
      isUploading: false,
      uploadProgress: 0,
    };
  },
  methods: {
    async uploadFiles() {
      this.isUploading = true;

      // Mocking upload progress for demonstration
      for (let i = 1; i <= 100; i++) {
        this.uploadProgress = i;
        await new Promise((resolve) => setTimeout(resolve, 50)); // Mock delay
      }

      //   this.isUploading = false;
    },
  },
};
</script>
