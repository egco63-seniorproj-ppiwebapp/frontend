import { AuthData } from "@/types";
import { handleAxiosResponse } from "@/utils";
import axios from "axios";
import { InjectionKey, State } from "vue";
import { Store, createStore } from "vuex";

export const key: InjectionKey<Store<State>> = Symbol();

export default createStore({
  state: {
    user: null as string | null,
  },
  getters: {
    isAuthenticated: (state) => !!state.user,
    username: (state) => state.user,
  },
  mutations: {
    setUser(state, username: string) {
      state.user = username;
    },
    resetUser(state) {
      state.user = null;
    },
  },
  actions: {
    async login(ctx, authdata: AuthData) {
      const res = await handleAxiosResponse(() =>
        axios.post("api/auth", authdata)
      );
      if (res.status == 200) {
        ctx.commit("setUser", authdata.username);
        return true;
      }
      return false;
    },
    async logout(ctx) {
      if (!ctx.getters.isAuthenticated) return true;
      const res = await handleAxiosResponse(() => axios.get("api/logout"));
      if (res.status == 200) {
        ctx.commit("resetUser");
        return true;
      }
      return false;
    },
    async session(ctx) {
      const res = await handleAxiosResponse(() => axios.get("api/session"));
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
