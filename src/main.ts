import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import "@/assets/styles/main.sass";

const app = createApp(App);
app.use(store).use(router).mount("#app");

import CheckBox from "@/components/CheckBox.vue";
import RadioButton from "@/components/RadioButton.vue";

app.component("CheckBox", CheckBox);
app.component("RadioButton", RadioButton);
