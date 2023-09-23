import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import UploadView from "@/views/UploadView.vue";
import ImagesView from "@/views/ImagesView.vue";
import SettingsView from "@/views/SettingsView.vue";
import testView from "@/views/testView.vue";
import LabelView from "@/views/LabelView.vue";
import NavBar from "@/components/NavBar.vue";

const lazyLoad = (view: string) => () => import(`@/views/${view}.vue`);

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    components: {
      default: HomeView,
      NavBar,
    },
    meta: { title: "Home" },
  },
  {
    path: "/upload",
    name: "upload",
    components: {
      default: UploadView,
      NavBar,
    },
    meta: { title: "Upload" },
  },
  {
    path: "/images",
    name: "images",
    components: {
      default: ImagesView,
      NavBar,
    },
    children: [
      {
        path: "label/:imgid",
        name: "label",
        component: LabelView,
      },
    ],
    meta: { title: "Images" },
  },
  {
    path: "/images/label",
    redirect: { name: "images" },
  },
  {
    path: "/settings",
    name: "settings",
    components: {
      default: SettingsView,
      NavBar,
    },
    meta: { title: "Settings" },
  },
  {
    path: "/login",
    name: "login",
    component: lazyLoad("LoginView"),
    meta: { title: "Login" },
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

declare module "vue-router" {
  interface RouteMeta {
    title?: string;
  }
}

router.beforeEach((to, from, next) => {
  const title = to.meta.title;
  if (title) document.title = `WebApp - ${title}`;
  next();
});

export default router;
