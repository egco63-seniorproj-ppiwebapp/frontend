import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import UploadView from "@/views/UploadView.vue";
import ImagesView from "@/views/ImagesView.vue";
import SettingsView from "@/views/SettingsView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/upload",
    name: "upload",
    component: UploadView,
  },
  {
    path: "/images",
    name: "images",
    component: ImagesView,
  },
  {
    path: "/settings",
    name: "settings",
    component: SettingsView,
  },
  // {
  //   path: "/settings",
  //   name: "settings",
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ "../views/SettingsView.vue"),
  // },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
