import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import UploadView from "@/views/UploadView.vue";
import ImagesView from "@/views/ImagesView.vue";
import SettingsView from "@/views/SettingsView.vue";
import NavBar from "@/components/NavBar.vue";

const lazyLoad = (view: string) => import(`@/views/${view}.vue`);

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    components: {
      default: HomeView,
      NavBar,
    },
  },
  {
    path: "/upload",
    name: "upload",
    components: {
      default: UploadView,
      NavBar,
    },
  },
  {
    path: "/images",
    name: "images",
    components: {
      default: ImagesView,
      NavBar,
    },
  },
  {
    path: "/settings",
    name: "settings",
    components: {
      default: SettingsView,
      NavBar,
    },
  },
  {
    path: "/login",
    name: "login",
    component: lazyLoad("LoginView"),
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: { name: "home" },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
