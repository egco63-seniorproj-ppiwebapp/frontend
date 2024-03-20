<template>
  <div class="container">
    <div class="search-panel">
      <ImageSearch :search-handler="search" />
    </div>
    <div class="gallery" @scroll="onGalleryScroll" ref="gallery">
      <LoadSpinner v-if="!renderGallery" />
      <ImageGrid :images="images" v-else-if="images.length > 0" />
      <div class="empty-gallery" v-else-if="searched">
        <span style="font-size: 100px"
          ><font-awesome-icon :icon="['fas', 'magnifying-glass']"
        /></span>
        <h2>No match found</h2>
        <p>Sorry, We couldn't find any matching results.</p>
      </div>
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
      <div class="gallery-footer" v-if="renderGallery">
        <LoadSpinner v-if="isLoadingMore" />
        <p v-if="hasNoMore">No more images</p>
      </div>
    </div>
  </div>
  <router-view />
</template>

<style lang="sass" scoped>
@use '@/assets/styles/navbar'
@use '@/assets/styles/base'

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

.gallery-footer
  display: flex
  justify-content: center
  color: base.$default-color
  margin-top: 30px
  margin-bottom: 40px

  p
    width: 100%
    text-align: center
    display: flex
    justify-content: space-between
    align-items: center
    margin: 0 30%

  p::before, p::after
    content: " "
    display: inline-block
    width: 30%
    border-top: 1px solid base.$default-color
</style>

<script lang="ts">
import { defineComponent } from "vue";
import ImageGrid from "@/components/ImageGrid.vue";
import ImageSearch from "@/components/ImageSearch.vue";
import { SearchParameters, ImageThumbnailData, ImageMetadata } from "@/types";
import { handleAxiosResponse, parseImageMetadata } from "@/utils";

import axios from "axios";
import LoadSpinner from "@/components/LoadSpinner.vue";

interface ScrollEventTarget extends EventTarget {
  scrollTop: number;
  scrollHeight: number;
  clientHeight: number;
}

const BATCH_LOAD_SIZE = 20;
const EARLY_BOTTOM_DETECT_PIXEL = 100;

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
      footlabel: "" as string | string[],
      footside: "",
      sortby: "pk",
      ascending: false,
    } as SearchParameters,
    batchLoaded: 0,
    indexingAt: {
      start: 0,
      end: BATCH_LOAD_SIZE,
    },
    hasNoMore: false,
    isLoadingMore: false,
    searched: false,
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
    async loadMoreImages() {
      this.isLoadingMore = true;
      this.batchLoaded++;
      this.indexingAt.start = this.batchLoaded * BATCH_LOAD_SIZE;
      this.indexingAt.end = this.indexingAt.start + BATCH_LOAD_SIZE;
      const newImages = await this.loadImages();
      this.images.push(...newImages);
      if (newImages.length < BATCH_LOAD_SIZE) this.hasNoMore = true;
      this.isLoadingMore = false;
    },
    onGalleryScroll(e: UIEvent) {
      if (this.isLoadingMore || this.hasNoMore) return;

      const { scrollTop, clientHeight, scrollHeight } =
        e.target as ScrollEventTarget;
      if (scrollTop + clientHeight >= scrollHeight - EARLY_BOTTOM_DETECT_PIXEL)
        this.loadMoreImages();
    },
    resetIndex() {
      this.batchLoaded = 0;
      this.indexingAt.start = 0;
      this.indexingAt.end = BATCH_LOAD_SIZE;
      this.hasNoMore = false;
      this.isLoadingMore = false;
    },
    async search(params: SearchParameters) {
      this.searchParams.name = params.name;
      this.searchParams.footlabel = params.footlabel;
      this.searchParams.footside = params.footside;
      this.searchParams.sortby = params.sortby;
      this.searchParams.ascending = params.ascending;
      this.searched = false;
      this.resetIndex();
      await this.reloadGallery();
      this.searched = true;
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

      if (footlabel.length > 0) {
        if (typeof footlabel == "string")
          validParams.append("filter", footlabel);
        else {
          for (const label of footlabel) validParams.append("filter", label);
        }
      }
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
    await this.reloadGallery();
    const gallery = this.$refs.gallery as HTMLDivElement | null;
    if (!gallery) return;
    const { offsetHeight, offsetWidth } = gallery;
    const cardHeight = 300;
    const cardWidth = 200;
    const gapSize = 20;
    const visibleRows = (offsetHeight + gapSize) / (cardHeight + gapSize);
    const visibleColumns = (offsetWidth + gapSize) / (cardWidth + gapSize);
    const visibleCards = Math.ceil(visibleRows) * Math.floor(visibleColumns);
    while (this.images.length <= visibleCards && !this.hasNoMore)
      await this.loadMoreImages();
  },
});
</script>
