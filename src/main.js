import Vue from 'vue'
import store from "./store";
import { library, config } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { Sketch } from "vue-color";
import Popper from "vue-popperjs";
import "vue-popperjs/dist/vue-popper.css";
import enLang from "./localization/en.config";
import ptbrLang from "./localization/ptbr.config";

import i18next from 'i18next';
import VueI18Next from '@panter/vue-i18next';

Vue.use(VueI18Next);

window.userLang = navigator.language || navigator.userLanguage;

const resources = {
  en: { translation: enLang },
  pt: { translation: ptbrLang }
}

i18next.init({
  lng: window.userLang,
  fallbackLng: 'en',
  resources
});

const i18n = new VueI18Next(i18next);


config.autoAddCss = false;

library.add(fas);

Vue.component("font-awesome-icon", FontAwesomeIcon);
Vue.component('sketch-picker', Sketch);
Vue.component("popper", Popper);

import App from "./App.vue";
import Editor from "./components/Editor.vue";
import Tiles from "./components/Tiles.vue";
import ColorPalette from "./components/ColorPalette.vue";
import Header from "./components/Header.vue";
import Toolbar from "./components/Toolbar.vue";
import Modal from "./components/Modal.vue";

Vue.component("Editor", Editor);
Vue.component("Tiles", Tiles);
Vue.component("ColorPalette", ColorPalette);
Vue.component("Header", Header);
Vue.component("Toolbar", Toolbar);
Vue.component("Modal", Modal);

Vue.config.productionTip = true
Vue.config.devtools = true;

new Vue({
  store,
  i18n: i18n,
  render: h => h(App)
}).$mount("#app");