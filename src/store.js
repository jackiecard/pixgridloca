import Vue from "vue";
import Vuex from "vuex";
import VuexPersist from "vuex-persist";

Vue.use(Vuex);

const state = {
  generatedArt: null,
  updatedList: [],
  backupList: [],
  canvasWidth: 20,
  canvasHeight: 15,
  showGrid: true,
  showRuler: true,
  zoom: 1,
  tileSize: 50,
  newColor: "",
  bouncePickedColor: false,
  isEraser: false,
  currentColor: {
    id: "c2",
    value: "black"
  },
  paletteList: [
    {
      id: "c2",
      value: "black"
    },
    {
      id: "c1",
      value: "red"
    },
    {
      id: "c3",
      value: "green"
    },
    {
      id: "c4",
      value: "blue"
    },
    {
      id: "c5",
      value: "yellow"
    },
    {
      id: "c6",
      value: "orange"
    },
    {
      id: "c7",
      value: "purple"
    },
    {
      id: "c8",
      value: "white"
    }
  ]
};

const mutations = {
  toggleGrid(state) {
    state.showGrid = !state.showGrid;
  },
  toggleRuler(state) {
    state.showRuler = !state.showRuler;
  },
  zoomIn(state) {
    const percentage = 0.25;
    state.zoom = state.zoom + percentage <= 8 ? state.zoom + percentage : 8;
  },
  zoomOut(state) {
    const percentage = 0.25;
    state.zoom = state.zoom - percentage >= 0.1 ? state.zoom - percentage : 1 / state.tileSize;
  },
  zoomReset(state) {
    state.zoom = 1;
  },
  addColor(state, payload) {
    state.paletteList.push({
      id: payload,
      value: payload
    });
  },
  pickedColor(state, payload) {
    state.currentColor = payload;
  },
  setUpdatedList(state, payload) {
    if(payload.first) {
      state.backupList = payload.list;
    }
    else if(!payload.pressed) {
      state.backupList = state.updatedList;
    }
    state.updatedList = payload.list;
  },
  generateArt(state, payload) {
    if(payload && payload.clear) {
      state.generatedArt = null;
      return;
    }

    let list = "";
    state.updatedList.forEach(item => {
      if (item.color !== "transparent") {
        list += `<div class="pixel" id="${item.id}" style="background-color: ${
          item.color
        }; grid-area: ${item.ys + 1} / ${item.xs + 1} / ${item.ys +
          2} / ${item.xs + 2}"></div>`;
      }
    });
    const html = `
      <div class="art" style="display: grid; grid-template-columns: repeat(${
        state.canvasWidth
      }, ${state.tileSize}px); grid-template-rows: repeat(${
      state.canvasHeight
    }, ${state.tileSize}px);">
        ${list}
      </div>
    `;
    state.generatedArt = html;
  },
  bouncePickedColor(state) {
    state.bouncePickedColor = true;

    setTimeout(() => {
      state.bouncePickedColor = false;
    }, 1000);
  },
  eraser(state, payload) {
    state.isEraser = payload;
  },
  undo(state){
    const backup = state.updatedList;
    state.updatedList = state.backupList;
    state.backupList = backup;
  }
};

const actions = {
  setUpdatedList: ({ commit }, payload) => {
    commit("setUpdatedList", payload);
    commit("generateArt", {clear: true}); 
  },
  toggleGrid: ({ commit }) => commit("toggleGrid"),
  toggleRuler: ({ commit }) => commit("toggleRuler"),
  zoomIn: ({ commit }) => commit("zoomIn"),
  zoomOut: ({ commit }) => commit("zoomOut"),
  zoomReset: ({ commit }) => commit("zoomReset"),
  addColor: ({ commit }, payload) => {
    if (payload === "") {
      return;
    }

    const item = state.paletteList.filter(x => x.value === payload)[0];

    if (item) {
      commit("pickedColor", item);
      commit("bouncePickedColor");
      return;
    }

    commit("addColor", payload);
    const newColor = state.paletteList.filter(x => x.value === payload)[0];
    commit("pickedColor", newColor);
  },
  pickedColor: ({ commit }, payload) => {
    commit("eraser", false);
    commit("pickedColor", payload);
  },
  generateArt: ({ commit }, payload) => commit("generateArt", payload),
  eraser: ({ commit }, payload) => commit("eraser", payload),
  undo: ({ commit }) => commit("undo")
};

const getters = {
  generatedArt: state => state.generatedArt,
  updatedList: state => state.updatedList,
  canvasWidth: state => state.canvasWidth,
  canvasHeight: state => state.canvasHeight,
  showGrid: state => state.showGrid,
  showRuler: state => state.showRuler,
  zoom: state => state.zoom,
  tileSize: state => state.tileSize,
  newColor: state => state.newColor,
  currentColor: state => state.currentColor,
  paletteList: state => state.paletteList,
  bouncePickedColor: state => state.bouncePickedColor,
  isEraser: state => state.isEraser,
  backupList: state => state.backupList
};

const vuexPersist = new VuexPersist({
  key: "my-app",
  storage: localStorage
});

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
  plugins: [vuexPersist.plugin]
});
