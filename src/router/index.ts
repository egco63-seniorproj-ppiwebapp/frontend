import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import UploadView from "@/views/UploadView.vue";
import ImagesView from "@/views/ImagesView.vue";
import SettingsView from "@/views/SettingsView.vue";
import LabelView from "@/views/LabelView.vue";
import NavBar from "@/components/NavBar.vue";
import { useStore } from "vuex";
import { key } from "@/store";

const lazyLoad = (view: string) => () => import(`@/views/${view}.vue`);

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    components: {
      default: HomeView,
      NavBar,
    },
    meta: { title: "Home", authRequired: true },
  },
  {
    path: "/upload",
    name: "upload",
    components: {
      default: UploadView,
      NavBar,
    },
    meta: { title: "Upload", authRequired: true },
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
    meta: { title: "Images", authRequired: true },
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
    meta: { title: "Settings", authRequired: true },
  },
  {
    path: "/login",
    name: "login",
    component: lazyLoad("LoginView"),
    meta: { title: "Login", authRequired: true },
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
    authRequired?: boolean;
  }
}

router.beforeEach(async (to, from, next) => {
  const title = to.meta.title;
  if (title) document.title = `WebApp - ${title}`;

  const store = useStore(key);

  if (to.meta.authRequired && !store.getters.isAuthenticated) {
    const hasSession = await store.dispatch("session");
    if (hasSession) {
      if (to.path == "/login") return next("/");
      return next();
    }
    if (to.path == "/login") return next();
    return next("/login");
  }

  next();
});

export default router;
