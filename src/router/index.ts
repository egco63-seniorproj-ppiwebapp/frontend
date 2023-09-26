import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import UploadView from "@/views/UploadView.vue";
import ImagesView from "@/views/ImagesView.vue";
import LabelView from "@/views/LabelView.vue";
import DiagnoseView from "@/views/DiagnoseView.vue";
import ImageDetailView from "@/views/ImageDetailView.vue";
import NavBar from "@/components/NavBar.vue";
import { useStore } from "vuex";
import { key } from "@/store";
import SummaryView from "@/views/SummaryView.vue";

const lazyLoad = (view: string) => () => import(`@/views/${view}.vue`);

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    components: {
      default: HomeView,
      NavBar,
    },
    children: [
      {
        path: "/",
        name: "summary",
        component: SummaryView,
      },
    ],
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
        path: "id/:imgid",
        name: "imgdetail",
        component: ImageDetailView,
      },
    ],
    meta: { title: "Images", authRequired: true },
  },
  {
    path: "/images/id",
    redirect: { name: "images" },
  },
  {
    path: "/label",
    name: "label",
    components: {
      default: LabelView,
      NavBar,
    },
    meta: { title: "Label", authRequired: true },
  },
  {
    path: "/diagnose",
    name: "diagnose",
    components: {
      default: DiagnoseView,
      NavBar,
    },
    meta: { title: "DiagnoseView", authRequired: true },
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
