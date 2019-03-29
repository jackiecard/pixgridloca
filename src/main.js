import Vue from 'vue'
import store from "./store";
import { library, config } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import Popover from "vue-js-popover";
import { Sketch } from "vue-color";

Vue.use(Popover);

config.autoAddCss = false;

library.add(fas);

Vue.component("font-awesome-icon", FontAwesomeIcon);
Vue.component('sketch-picker', Sketch);

import App from "./App.vue";
import Editor from "./components/Editor.vue";
import Tiles from "./components/Tiles.vue";
import ColorPalette from "./components/ColorPalette.vue";
import Header from "./components/Header.vue";
import Toolbar from "./components/Toolbar.vue";

Vue.component("Editor", Editor);
Vue.component("Tiles", Tiles);
Vue.component("ColorPalette", ColorPalette);
Vue.component("Header", Header);
Vue.component("Toolbar", Toolbar);

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App)
}).$mount("#app");
