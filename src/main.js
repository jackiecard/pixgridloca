import Vue from 'vue'
import store from "./store";
import { library, config } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { Sketch } from "vue-color";
import Popper from "vue-popperjs";
import "vue-popperjs/dist/vue-popper.css";

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
  render: h => h(App)
}).$mount("#app");
