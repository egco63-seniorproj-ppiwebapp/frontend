<template>
  <div class="container">
    <div class="search-panel">
      <ImageSearch :search-handler="search" />
    </div>
    <div class="gallery">
      <LoadSpinner v-if="!renderGallery" />
      <ImageGrid :images="images" v-else-if="images.length > 0" />
      <div class="empty-gallery" v-else>
        <span style="font-size: 100px"
          ><font-awesome-icon :icon="['fas', 'wind']"
        /></span>
        <h2>Gallery is empty.</h2>
        <p>Try adding more images.</p>
        <router-link to="/upload">
          <button class="primary outline">
            <font-awesome-icon :icon="['fas', 'fa-file-upload']" /> Upload
          </button></router-link
        >
      </div>
    </div>
  </div>
  <router-view />
</template>

<style lang="sass" scoped>
@use '@/assets/styles/navbar'

.container
  display: grid
  grid-template-columns: 400px auto
  padding: 0 !important

.gallery
  height: calc(100vh - navbar.$navbar-height)
  overflow-y: scroll

.empty-gallery
  height: 100%
  display: flex
  flex-direction: column
  justify-content: center
  align-items: center

.search-panel
  padding: 1.5rem
  height: calc(100vh - navbar.$navbar-height)
</style>

<script lang="ts">
import { defineComponent } from "vue";
import ImageGrid from "@/components/ImageGrid.vue";
import ImageSearch from "@/components/ImageSearch.vue";
import { SearchParameters, ImageThumbnailData, ImageMetadata } from "@/types";
import { handleAxiosResponse, parseImageMetadata } from "@/utils";

import axios from "axios";
import LoadSpinner from "@/components/LoadSpinner.vue";

export default defineComponent({
  name: "ImagesView",
  components: {
    ImageGrid,
    ImageSearch,
    LoadSpinner,
  },
  data: () => ({
    renderGallery: false,
    images: [] as Array<ImageThumbnailData>,
    searchParams: {
      name: "",
      footlabel: "",
      footside: "",
      sortby: "pk",
      ascending: false,
    } as SearchParameters,
    indexingAt: {
      start: 0,
      end: 20,
    },
  }),
  created() {
    this.$watch(
      () => this.$store.getters.galleryReloadNeeded,
      async () => {
        await this.reloadGallery();
      },
      { immediate: true }
    );
  },
  methods: {
    async reloadGallery() {
      this.renderGallery = false;
      this.images = await this.loadImages();
      await this.$nextTick();
      this.renderGallery = true;
      this.$store.commit("resetGalleryReload");
    },
    search(params: SearchParameters) {
      this.searchParams.name = params.name;
      this.searchParams.footlabel = params.footlabel;
      this.searchParams.footside = params.footside;
      this.searchParams.sortby = params.sortby;
      this.searchParams.ascending = params.ascending;
      this.reloadGallery();
    },
    serializeSearchParams() {
      const { name, footlabel, footside, sortby, ascending } =
        this.searchParams;

      const validParams = new URLSearchParams();
      validParams.append("start", this.indexingAt.start.toString());
      validParams.append("end", this.indexingAt.end.toString());
      validParams.append("ascending", ascending.toString());

      if (name.length > 0) validParams.append("search", name);
      if (sortby.length > 0) validParams.append("sort", sortby);

      if (footlabel.length > 0) validParams.append("filter", footlabel);
      if (footside.length > 0) validParams.append("filter", footside);

      return validParams;
    },
    async loadImages() {
      let res = await handleAxiosResponse(() =>
        axios.get("/api/get_collection", {
          params: this.serializeSearchParams(),
        })
      );
      if (res.status != 200) return [] as Array<ImageThumbnailData>;
      // console.log(res.data);
      const imgMetaList = res.data as Array<ImageMetadata>;
      const imgDataList: Array<ImageThumbnailData> = [];
      for (let meta of imgMetaList) {
        imgDataList.push(parseImageMetadata(meta));
      }
      return imgDataList;
    },
  },
  async mounted() {
    // console.log(this.searchParams);
    this.reloadGallery();
  },
});
</script>
