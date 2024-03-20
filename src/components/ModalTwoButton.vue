<template>
  <div v-if="isVisible" class="modal-overlay">
    <div class="modal-container">
      <div class="modal-header">
        <h3>{{ headerText }}</h3>
      </div>
      <div class="modal-body">
        <p v-html="descriptionText"></p>
      </div>
      <div class="modal-footer">
        <input
          type="button"
          :value="secondaryBtn"
          class="secondary"
          @click="cancelModal"
        />
        <input
          type="button"
          :value="primaryBtn"
          class="primary"
          @click="confirmModal"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ModelBase",
  props: {
    isVisible: Boolean,
    headerText: String,
    descriptionText: String,
    primaryBtn: {
      type: String,
      default: "OK",
    },
    secondaryBtn: {
      type: String,
      default: "Cancel",
    },
  },
  methods: {
    confirmModal() {
      this.$emit("confirm");
    },
    cancelModal() {
      this.$emit("cancel");
    },
  },
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-container {
  background: white;
  width: 80%;
  max-width: 500px;
  border-radius: 10px;
  overflow: hidden;
}

.modal-header {
  padding: 20px;
  background: #62aa92;
  color: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.modal-body {
  padding: 20px;
  text-align: left;
}

.modal-footer {
  padding: 20px;
  text-align: right;
}

.primary {
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}

.secondary {
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}
</style>
