/* eslint-disable no-new */
import Vue from 'vue';
import App from './App';
import router from './router';

import Vuelidate from 'vuelidate';
Vue.use(Vuelidate);

import Axios from "axios";
import VueAxios from 'vue-axios';
Vue.use(VueAxios, Axios);

Vue.config.productionTip = false;
Vue.config.devtools = true;
Vue.config.silent = true;

// Vue chat emoji
import { VueChatEmoji } from "vue-chat-emoji"
Vue.component("VueChatEmoji", VueChatEmoji);
require("vue-chat-emoji/dist/vue-chat-emoji.min.css")

// Import Bottom Navigation
import BottomNavigation from "./components/BottomNavigation";
Vue.component("BottomNavigation", BottomNavigation);

import VueChatScroll from "vue-chat-scroll";
Vue.use(VueChatScroll);

import VueSocketIO from "vue-socket.io";
import SocketIO from "socket.io-client";
Vue.use(new VueSocketIO({
  debug: false,
  connection: SocketIO("http://localhost:3000")
}));

let handleClickOutside;

Vue.directive('click-outside', {
  bind(el, binding, vnode) {
    handleClickOutside = (e) => {
      e.stopPropagation();
      const { handler, exclude } = binding.value;
      let clickedOnExcludedEl = false;

      // Gives you the ability to exclude certain elements if you want, pass as array of strings to exclude
      if (exclude) {
        exclude.forEach(refName => {
          if (!clickedOnExcludedEl) {
            const excludedEl = vnode.context.$refs[refName];
            clickedOnExcludedEl = excludedEl.$el.contains(e.target);
            if (!clickedOnExcludedEl) {
              vnode.context[handler]();
            }
          }
        });
      }

      // if (el.contains(e.target) && clickedOnExcludedEl) {
      //   vnode.context[handler]();
      // }
    };
    document.addEventListener('click', handleClickOutside);
    // document.addEventListener('touchstart', handleClickOutside)
  },
  unbind() {
    document.removeEventListener('click', handleClickOutside);
    // document.removeEventListener('touchstart', handleClickOutside)
  }
});

// vuex
import store from './store';

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount("#app");
