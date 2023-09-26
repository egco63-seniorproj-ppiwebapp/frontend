<template>
  <div class="panel">
    <div class="profile">
      <div class="profilepic">
        <img src="@/assets/logo.png" />
      </div>
      <h2>Welcome! {{ username }}</h2>
    </div>
    <div class="quickaccess">
      <span>Quick Access</span>
      <div class="btn-group">
        <router-link to="/label">
          <button class="primary">
            <div class="title">
              <font-awesome-icon :icon="['fas', 'fa-tag']" />
              <span> Label images</span>
            </div>
            <div class="desc">
              {{ `You still have ${15} unlabeled images.` }}
            </div>
          </button>
        </router-link>
        <router-link to="/upload">
          <button class="primary">
            <div class="title">
              <font-awesome-icon :icon="['fas', 'fa-file-upload']" />
              <span> Upload images</span>
            </div>
          </button>
        </router-link>
        <router-link to="/label">
          <button class="primary">
            <div class="title">
              <font-awesome-icon :icon="['fas', 'fa-images']" />
              <span> View Gallery</span>
            </div>
          </button>
        </router-link>
        <router-link to="/label">
          <button class="primary">
            <div class="title">
              <font-awesome-icon :icon="['fas', 'fa-stethoscope']" />
              <span> Diagnose Plantar</span>
            </div>
          </button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style lang="sass" scoped>
@use '@/assets/styles/base'
@use '@/assets/styles/navbar'
.panel
  display: flex
  flex-flow: column
  height: 100%
  padding: 30px 20px 0 20px

.profile
  display: flex
  flex-direction: column
  // padding-bottom: 20px
  border-bottom: 2px solid rgba(base.$primary-color, 0.4)
  margin-left: -12px
  padding-left: 12px
  h2
    line-height: 1.5em
    margin-bottom: 10px
.profilepic
  background: lightgray
  border-radius: 50%
  width: 115px
  height: 115px
  overflow: hidden

  img
    object-fit: cover
    width: inherit
    height: inherit

.quickaccess
  margin-top: 20px
  margin-left: 3px
  display: flex
  flex-direction: column
  gap: 16px
  overflow-y: auto

.btn-group
  display: flex
  flex-direction: column
  gap: 16px
  margin-bottom: 20px

  button
    padding: 0
    width: 96%
    text-align: left
    border-radius: 12px

    &:hover
      .desc
        background: #fafafa
    .title
      display: flex
      align-items: center
      padding: 24px
      font-size: 1.2em
      font-weight: bold
      transition: inherit

      svg
        margin-right: 12px
        font-size: 1.5em
    .desc
      margin: 2px
      margin-top: -4px
      padding: 12px
      color: lighten(base.$default-font-color, 7%)
      background: white
      border-bottom-left-radius: 11px
      border-bottom-right-radius: 11px
      transition: inherit
</style>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "HomePanel",
  data: () => ({
    username: "john123",
  }),
});
</script>
