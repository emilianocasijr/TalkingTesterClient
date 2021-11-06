import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
Vue.config.devtools = true;

export default new Vuex.Store({
  state: {
    user: null,
    isAuthenticated: false,
  },
  mutations: {
    updateUser: (state, userData) => {
      state.user = userData;
      state.isAuthenticated = true;
    },
  },
  actions: {},
  modules: {},
});
