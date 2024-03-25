<template>
  <div class="container">
    <div class="image-preview">
      <div class="image-wrapper">
        <img
          v-if="state == DiagnoseViewState.IDLE"
          class="placeholder"
          src="/svg/stethoscope.svg"
        />
        <img v-else :src="image[activeImage]" :title="uploadfile?.file.name" />
      </div>
      <div class="image-select" v-if="state == DiagnoseViewState.RESULT">
        <input type="button" value="Original" @click="showImageOriginal()" />
        <input
          type="button"
          value="Heatmap"
          class="outline"
          @click="showImageHeatmap()"
        />
        <!-- <input type="button" value="Binary" class="outline" /> -->
        <!-- <input type="button" value="Indicator" class="outline" /> -->
      </div>
    </div>
    <div class="body">
      <div class="upload" v-if="state == DiagnoseViewState.IDLE">
        <h1>
          <font-awesome-icon :icon="['fas', 'file-import']" />
          <span> Import an image to diagnose</span>
        </h1>
        <div class="dropfile">
          <DropFileSingle
            @ready="onImageReady()"
            @error="onImageError()"
            ref="fileLoader"
            :preview-size="600"
          />
        </div>
      </div>
      <div
        class="analyse"
        v-if="
          state == DiagnoseViewState.UPLOAD ||
          state == DiagnoseViewState.ANALYSE
        "
      >
        <h1>
          <font-awesome-icon :icon="['fas', 'chart-simple']" />
          <span> Diagnosis Result</span>
        </h1>
        <div class="status">
          <LoadSpinner />
          <h2 v-if="state == DiagnoseViewState.UPLOAD">Uploading...</h2>
          <h2 v-else-if="state == DiagnoseViewState.ANALYSE">
            Analysing the image...
          </h2>
        </div>
      </div>
      <div class="result" v-if="state == DiagnoseViewState.RESULT">
        <h1>
          <font-awesome-icon :icon="['fas', 'chart-simple']" />
          <span> Diagnosis No.{{ diagnosisId }}</span>
        </h1>
        <p ref="resultText">
          It is certain that this foot classifies as
          <span :class="['result-text', getBest()]">
            {{ getBest().charAt(0).toUpperCase() + getBest().slice(1) }}
          </span>
        </p>
        <hr />
        <br />
        <h1>
          <font-awesome-icon :icon="['fas', 'chart-pie']" />
          <span> Probabilities</span>
        </h1>
        <div class="result-wrapper">
          <template
            v-for="[index, [label, percent]] of getSortedResult().entries()"
            :key="index"
          >
            <div
              :class="['result-card', label, ...(index == 0 ? ['best'] : [])]"
            >
              <div class="circle">
                <img class="background-decal" src="/foot.png" />
                <ProgressCircle :percent="percent" />
              </div>
              <div class="percent">{{ Math.round(percent * 100) / 100 }}%</div>
              <div class="label">
                <span>{{
                  label.charAt(0).toUpperCase() + label.slice(1)
                }}</span>
              </div>
            </div>
          </template>
        </div>
        <p class="result-time">
          Time of diagnosis:
          {{
            new Intl.DateTimeFormat(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            }).format(diagnosisTime)
          }}
        </p>
        <button class="primary new-diagnosis-btn" @click="resetView()">
          <font-awesome-icon :icon="['fas', 'file-arrow-up']" />
          <span> New Diagnosis</span>
        </button>
      </div>
    </div>
  </div>
  <ModalComponent
    :isVisible="modal.error"
    headerText="Error occurred!"
    :descriptionText="modalErrorMessage"
    @close="
      modal.error = false;
      modalErrorMessage = '';
    "
  />
  <ModalTwoButton
    :isVisible="modal.cancelDiagnose"
    headerText="Diagnosis Cancellation"
    descriptionText="Do you want to cancel the diagnosis?"
    @confirm="handleDiagnoseCancel"
    @cancel="modal.cancelDiagnose = false"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import DropFileSingle from "@/components/DropFileSingle.vue";
import ModalComponent from "@/components/ModalComponent.vue";
import ModalTwoButton from "@/components/ModalTwoButton.vue";
import LoadSpinner from "@/components/LoadSpinner.vue";
import ProgressCircle from "@/components/ProgressCircle.vue";
import { ErrorMessage, FileUploadMeta } from "@/types/upload";
import { MISSING_IMAGE, generateDataURL } from "@/utils/image";
import { applymap, CMRmap_data as colormap } from "@/utils/colormap";
import axios from "axios";
import { NavigationGuardNext } from "vue-router";
import { handleAxiosResponse } from "@/utils";

const DiagnoseViewState = Object.freeze({
  IDLE: "idle",
  UPLOAD: "upload",
  ANALYSE: "analyse",
  RESULT: "result",
});
type DiagnoseViewStateEnum =
  (typeof DiagnoseViewState)[keyof typeof DiagnoseViewState];

interface ImageSet {
  original: string;
  heatmap: string;
}

interface DiagnosisUploadResponse {
  filename: string;
  success: string;
  diagid?: number;
  err?: string;
}

interface DiagnosisData {
  id: number;
  owner: string;
  p_flat: number;
  p_normal: number;
  p_high: number;
  stage: string;
  created_date: string;
}

const POLLRATE = 10 * 1000; // milliseconds
const MAX_POLL_RETRY = 5;

export default defineComponent({
  name: "DiagnoseView",
  components: {
    DropFileSingle,
    ModalTwoButton,
    ModalComponent,
    LoadSpinner,
    ProgressCircle,
  },
  data() {
    return {
      DiagnoseViewState,
      state: DiagnoseViewState.IDLE as DiagnoseViewStateEnum,
      uploadfile: null as FileUploadMeta | null,
      modal: {
        error: false,
        cancelDiagnose: false,
      },
      modalErrorMessage: "",
      diagnosisId: 0,
      diagnosisResult: { flat: 0, normal: 0, high: 0 },
      diagnosisTime: new Date(),
      image: {
        original: MISSING_IMAGE,
        heatmap: MISSING_IMAGE,
      } as ImageSet,
      activeImage: "original" as keyof ImageSet,
      abortController: new AbortController(),
      stopPoll: false,
      routeNext: null as NavigationGuardNext | null,
    };
  },
  beforeRouteLeave(to, from, next) {
    if (
      this.state == DiagnoseViewState.UPLOAD ||
      this.state == DiagnoseViewState.ANALYSE
    ) {
      this.routeNext = next;
      this.modal.cancelDiagnose = true;
    } else {
      next();
    }
  },
  beforeMount() {
    window.addEventListener("beforeunload", this.preventNavigate);
  },
  beforeUnmount() {
    this.stopPoll = true;
    window.removeEventListener("beforeunload", this.preventNavigate);
  },
  methods: {
    getFileLoader() {
      return this.$refs.fileLoader as InstanceType<
        typeof DropFileSingle
      > | null;
    },
    getSortedResult() {
      return Object.entries(this.diagnosisResult).sort((a, b) => {
        if (a[1] > b[1]) return -1;
        if (a[1] < b[1]) return 1;
        return 0;
      });
    },
    getBest() {
      return this.getSortedResult()[0][0];
    },
    resetView() {
      this.uploadfile = null;
      this.image.original = MISSING_IMAGE;
      this.activeImage = "original";
      this.diagnosisResult = { flat: 0, normal: 0, high: 0 };
      this.diagnosisId = 0;
      this.state = DiagnoseViewState.IDLE;
    },
    showImageOriginal() {
      this.activeImage = "original";
    },
    showImageHeatmap() {
      this.activeImage = "heatmap";
    },
    async generateAddonImages() {
      const fileLoader = this.getFileLoader();
      if (!fileLoader?.uploadfile) return;
      this.image.heatmap = await generateDataURL(
        fileLoader.uploadfile.file,
        600,
        undefined,
        "blur(5px) grayscale(100%) invert(100%)",
        (ctx) => {
          const img = ctx.getImageData(
            0,
            0,
            ctx.canvas.width,
            ctx.canvas.height
          );
          let [max, min] = [0, 256];
          for (let i = 0; i < img.data.length; i += 4) {
            const rgb = img.data.slice(i, i + 3);
            if (rgb[0] < min) min = rgb[0];
            if (rgb[0] > max) max = rgb[0];
          }
          for (let i = 0; i < img.data.length; i += 4) {
            const rgb = img.data.slice(i, i + 3);
            const v = (rgb[0] - min) / (max - min);
            const [r, g, b] = applymap(v, colormap).map((v) =>
              Math.floor(v * 255)
            );
            img.data[i] = r;
            img.data[i + 1] = g;
            img.data[i + 2] = b;
          }
          ctx.putImageData(img, 0, 0);
        }
      );
    },
    async upload() {
      const fileLoader = this.getFileLoader();
      if (!fileLoader?.uploadfile) return;

      const formData = new FormData();
      formData.append("file", fileLoader.uploadfile.file);

      try {
        // Perform upload with Axios
        const res = await handleAxiosResponse(() =>
          axios.post("/api/diagnose", formData, {
            headers: { "Content-Type": "multipart/form-data" },
            signal: this.abortController.signal,
          })
        );
        const resdata = res.data as DiagnosisUploadResponse;
        const { success, err, diagid } = resdata;

        if (success) {
          this.diagnosisId = diagid as number;
          this.onImageUploaded();
          return;
        }

        if (err?.startsWith("Unsupported file type"))
          this.modalErrorMessage = ErrorMessage.UNSUPPORTED;
        else this.modalErrorMessage = ErrorMessage.UPLOADFAILED;
      } catch (err) {
        this.modalErrorMessage = "An error occurred while uploading.";
      }
      this.modal.error = true;
      this.resetView();
    },
    onImageReady() {
      const fileLoader = this.getFileLoader();
      if (!fileLoader?.uploadfile) return;
      this.uploadfile = fileLoader.uploadfile;
      this.image.original = fileLoader.uploadfile.preview;
      this.generateAddonImages();
      this.$forceUpdate();

      this.state = DiagnoseViewState.UPLOAD;

      this.upload();
    },
    onImageError() {
      const fileLoader = this.getFileLoader();
      if (!fileLoader) return;
      if (!fileLoader.uploadfile) return;

      this.modalErrorMessage = fileLoader.uploadfile.message;
      this.modal.error = true;
      this.resetView();
    },
    async poll() {
      try {
        const diagID = this.diagnosisId;
        const res = await handleAxiosResponse(() =>
          axios.get(`/api/diagnose/${diagID}`)
        );
        const resdata = res.data as DiagnosisData;
        return resdata as DiagnosisData;
      } catch (err) {
        this.onAnalyzeError();
      }
      return;
    },
    onImageUploaded() {
      this.state = DiagnoseViewState.ANALYSE;
      let retry = 0;
      new Promise<void>((resolve) => {
        // Test whether diagnosis is complete
        const testComplete = async () => {
          const data = await this.poll();
          if (!data) {
            if (retry > MAX_POLL_RETRY) return true;
            retry++;
            return false;
          }
          if (data["stage"] == "done") {
            this.saveDiagnosisResult(data);
            this.onImageAnalyzed();
            return true;
          }
          if (data["stage"] == "err") {
            this.onAnalyzeError();
            return true;
          }
          return false;
        };
        // Polling loops with interval of POLLRATE
        let timeoutId: number;
        const resolver = async () => {
          const doResolve = await testComplete();
          if (doResolve || this.stopPoll) {
            clearTimeout(timeoutId);
            return resolve();
          }
          setTimeout(resolver, POLLRATE);
        };
        // Start polling
        timeoutId = setTimeout(resolver, POLLRATE);
      });
    },
    saveDiagnosisResult(data: DiagnosisData) {
      this.diagnosisResult = {
        flat: data["p_flat"] * 100,
        normal: data["p_normal"] * 100,
        high: data["p_high"] * 100,
      };
      this.diagnosisTime = new Date(Date.parse(data["created_date"]));
    },
    onAnalyzeError() {
      this.modalErrorMessage = "Error occured while analyzing image.";
      this.modal.error = true;
      this.resetView();
    },
    onImageAnalyzed() {
      this.state = DiagnoseViewState.RESULT;
    },
    abortUpload() {
      this.abortController.abort();
      this.abortController = new AbortController();
    },
    abortAnalyze() {
      handleAxiosResponse(() =>
        axios.delete(`/api/diagnose/${this.diagnosisId}`)
      );
    },
    handleDiagnoseCancel() {
      this.abortUpload();
      if (this.state == DiagnoseViewState.ANALYSE) this.abortAnalyze();
      this.continueRoute();
    },
    continueRoute() {
      if (this.routeNext) {
        this.routeNext();
        this.routeNext = null;
      }
    },
    preventNavigate(e: BeforeUnloadEvent) {
      if (
        this.state != DiagnoseViewState.UPLOAD &&
        this.state != DiagnoseViewState.ANALYSE
      )
        return;

      this.handleDiagnoseCancel();
      this.resetView();
      e.preventDefault();
      e.returnValue = "";
    },
  },
});
</script>

<style lang="sass" scoped>
@use '@/assets/styles/base'

.container
  display: grid
  grid-template-columns: minmax(500px, 40%) 700px
  column-gap: 50px
  height: 100%
  padding: 1.5rem 80px

.image-preview
  display: grid
  grid-template-rows: auto fit-content(0)

  .image-wrapper
    display: flex
    justify-content: center
    overflow: hidden

    img
      object-fit: contain
      border: 1px solid gray

      &.placeholder
        width: 80%
        border: none

  .image-select
    padding: 8px 0
    display: flex
    justify-content: center
    flex-direction: row

.body
  margin-top: 1rem

.analyse
  .status
    margin-top: 200px
    text-align: center

.result
  position: relative
  height: 100%

$flat-color: #62aa92
$normal-color: rgb(54, 162, 235)
$high-color: rgb(255, 205, 86)
.result-text
  font-weight: bold

  &.flat
    color: $flat-color
  &.normal
    color: $normal-color
  &.high
    color: $high-color

.result-wrapper
  display: flex
  flex-direction: row
  gap: 24px

.result-card
  border: 1px solid lighten(base.$default-color, 20%)
  border-radius: 16px
  background: #FDFDFD
  height: 200px
  width: 140px
  display: grid
  transition: 0.1s ease-out
  grid-template-columns: auto
  grid-template-rows: 120px fit-content(0) fit-content(0) auto
  grid-template-areas: "circle" "label" "percent" "."

.result-card
  &.flat::v-deep .circle circle.progress
    stroke: darken($flat-color, 5%)
  &.normal::v-deep .circle circle.progress
    stroke: darken($normal-color, 5%)
  &.high::v-deep .circle circle.progress
    stroke: darken($high-color, 10%)

.result-card
  &.flat .background-decal
      filter: sepia(1) brightness(0.7) contrast(9) hue-rotate(80deg) saturate(0.4)
  &.normal .background-decal
      filter: sepia(1) brightness(0.62) contrast(9) hue-rotate(160deg) saturate(0.8)
  &.high .background-decal
      filter: sepia(1) brightness(0.63) contrast(9) hue-rotate(0deg) saturate(0.5)

.result-card
  &.flat .label>span
      background: lighten($flat-color, 20%)
  &.normal .label>span
      background:  adjust-hue(lighten($normal-color, 12%), -10deg)
  &.high .label>span
      background: lighten($high-color, 5%)

.result-card
  &.flat .percent
      color: darken($flat-color, 30%)
  &.normal .percent
      color: darken($normal-color, 30%)
  &.high .percent
      color: darken($high-color, 40%)

.result-card
  .circle
    grid-area: circle
    display: flex
    justify-content: center
    align-self: center
    position: relative
    .background-decal
      object-fit: contain
      position: absolute
      top: 50%
      left: 50%
      width: 70%
      height: 70%
      transform: translate(-50%, -50%) scaleX(-1)
    svg
      width: 90px
      height: 90px
  .percent
    grid-area: percent
    text-align: center
    margin-top: 22px
  .label
    grid-area: label
    text-align: center
    span
      display: inline
      background: gray
      color: white
      font-weight: bold
      border-radius: 16px
      padding: 8px 16px


.result-card.best
  padding: 5px
  grid-template-columns: 190px auto
  grid-template-rows: auto fit-content(0) fit-content(0) auto
  grid-template-areas: "circle ." "circle percent" "circle label" "circle ."
  &.flat
    border-color: $flat-color
  &.normal
    border-color: $normal-color
  &.high
    border-color: $high-color

.result-card.best
  width: 370px
  .circle
    .background-decal
      width: 60%
      height: 60%
    svg
      width: 160px
      height: 160px
  .percent
    font-size: 3em
    font-weight: bold
    text-align: left
    margin-top: 0
  .label
    padding: 8px 0
    text-align: left
    span
      border-radius: 18px
      padding: 8px 20px
      font-size: 1.4em

.result-card:hover
  box-shadow: 0 0 10px -5px rgba(black, 0.4)
  &.flat
    border-color: $flat-color
  &.normal
    border-color: $normal-color
  &.high
    border-color: $high-color

.result-card.best:hover
  &.flat
    border-color: darken($flat-color, 10%)
  &.normal
    border-color: darken($normal-color, 10%)
  &.high
    border-color: darken($high-color, 10%)

.result-time
  color: lighten(gray, 35%)

.new-diagnosis-btn
  float: right
  margin-top: 144px
</style>
