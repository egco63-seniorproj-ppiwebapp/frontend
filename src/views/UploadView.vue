<template>
  <div class="about">
    <ModalComponent
      :isVisible="isModalVisible"
      headerText="Upload failed ❗️"
      descriptionText="There was an issue uploading your image. Please try again."
      @close="handleModalClose"
    />
  </div>
</template>

<script>
import ModalComponent from "../components/ModalComponent.vue";

export default {
  components: {
    ModalComponent,
  },
  data() {
    return {
      isModalVisible: true,
    };
  },
  methods: {
    async uploadImage() {
      try {
        // โค้ดสำหรับอัพโหลดรูปภาพ
      } catch (error) {
        // ถ้ามีข้อผิดพลาดในการอัพโหลด
        this.isModalVisible = true; // แสดง modal
      }
    },
    handleModalClose() {
      this.isModalVisible = false;
    },
  },
};
</script>
