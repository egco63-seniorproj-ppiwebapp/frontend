import { AuthData, ImageThumbnailData } from "@/types";
import { handleAxiosResponse } from "@/utils";
import axios from "axios";
import { InjectionKey, State } from "vue";
import { Store, createStore } from "vuex";

axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

export const key: InjectionKey<Store<State>> = Symbol();

export default createStore({
  state: {
    user: null as string | null,
    gallery: {
      updateData: null as ImageThumbnailData | null,
      unloadId: null as number | null,
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.user,
    username: (state) => state.user,
    galleryHasUnload: (state) => state.gallery.unloadId != null,
    galleryUnloadId: (state) => state.gallery.unloadId,
    galleryhasUpdate: (state) => state.gallery.updateData != null,
    galleryUpdateData: (state) => state.gallery.updateData,
  },
  mutations: {
    setUser(state, username: string) {
      state.user = username;
    },
    resetUser(state) {
      state.user = null;
    },
    setGalleryUpdateData(state, newData: ImageThumbnailData) {
      state.gallery.updateData = newData;
    },
    resetGalleryUpdateData(state) {
      state.gallery.updateData = null;
    },
    unloadGalleryImageId(state, id: number) {
      state.gallery.unloadId = id;
    },
    resetUnloadGalleryImageId(state) {
      state.gallery.unloadId = null;
    },
  },
  actions: {
    async login(ctx, authdata: AuthData) {
      const res = await handleAxiosResponse(() =>
        axios.post("/api/auth", authdata)
      );
      if (res.status == 200) {
        ctx.commit("setUser", authdata.username);
        return true;
      }
      return false;
    },
    async logout(ctx) {
      if (!ctx.getters.isAuthenticated) return true;
      const res = await handleAxiosResponse(() => axios.post("/api/logout"));
      if (res.status == 200) {
        ctx.commit("resetUser");
        return true;
      }
      return false;
    },
    async session(ctx) {
      await handleAxiosResponse(() => axios.get("/api/session")); // CSRF cookie
      const res = await handleAxiosResponse(() => axios.post("/api/session"));
      if (res.status == 200) {
        const username = res.data as string;
        ctx.commit("setUser", username);
        return true;
      }
      return false;
    },
  },
  modules: {},
});
