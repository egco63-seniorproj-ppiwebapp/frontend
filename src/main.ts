import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store, { key } from "./store";
import "@/assets/styles/main.sass";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faFolderPlus } from "@fortawesome/free-solid-svg-icons";
import { faFileImage } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

library.add(faFolderPlus, faFileImage, fas, far, faArrowRight);
const app = createApp(App);
app.use(store, key).use(router).mount("#app");

import CheckBox from "@/components/CheckBox.vue";
import RadioButton from "@/components/RadioButton.vue";

app.component("CheckBox", CheckBox);
app.component("RadioButton", RadioButton);
app.component("font-awesome-icon", FontAwesomeIcon);
