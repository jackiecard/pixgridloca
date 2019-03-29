import Vue from 'vue'
import store from "./store";
import { library, config } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";

// This is important, we are going to let Nuxt.js worry about the CSS
config.autoAddCss = false;

// You can add your icons directly in this plugin. See other examples for how you
// can add other styles or just individual icons.
library.add(fas);

// Register the component globally
Vue.component("font-awesome-icon", FontAwesomeIcon);

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
