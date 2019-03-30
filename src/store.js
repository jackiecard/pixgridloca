import Vue from "vue";
import Vuex from "vuex";
// import VuexPersist from "vuex-persist";

Vue.use(Vuex);

function generateList() {
  const list = [];
  const size = state.canvasWidth * state.canvasHeight;

  for (let i = 0; i < size; i++) {
    list.push({
      id: "p" + i,
      xs: i % state.canvasWidth,
      ys: (i - (i % state.canvasWidth)) / state.canvasWidth,
      color: "transparent"
    });
  }

  return list;
}

const state = {
  projectName: 'Awesome Pixel Grid',
  generatedArt: null,
  updatedList: [],
  backupList: [],
  canvasWidth: 4,
  canvasHeight: 4,
  showGrid: true,
  showRuler: true,
  zoom: 1,
  tileSize: 40,
  newColor: "",
  bouncePickedColor: false,
  isEraser: false,
  save: {},
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
    state.zoom =
      state.zoom - percentage >= 0.1
        ? state.zoom - percentage
        : 1 / state.tileSize;
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
    if (payload.first) {
      state.backupList = payload.list;
    } else if (!payload.pressed) {
      state.backupList = state.updatedList;
    }
    state.updatedList = payload.list;
  },
  generateArt(state, payload) {
    if (payload && payload.clear) {
      state.generatedArt = null;
      return;
    }

    const listLines = [];
    state.updatedList.reduce((prev, curr) => {
      let line = prev;
      if (prev.color !== curr.color) {
        if (listLines.indexOf(line) < 0) {
          line.xe = prev.xs;
          listLines.push(line);
        }
        return curr;
      } else if (prev.ys !== curr.ys) {
        if (listLines.indexOf(line) < 0) {
          line.xe = prev.xs;
          listLines.push(line);
        }
        return curr;
      } else {
        line.xe = curr.xs;
        if (listLines.indexOf(line) < 0) {
          listLines.push(line);
        }
      }
      return line;
    });

    let list = "";
    listLines.forEach(item => {
      if (item.color !== "transparent") {
        list += `<div class="pixgrid__pixel" id="${
          item.id
        }" style="background-color: ${item.color}; grid-area: ${item.ys +
          1} / ${item.xs + 1} / ${item.ys + 2} / ${item.xe + 2}"></div>`;
      }
    });
    const html = `
      <div class="pixgrid" style="display: grid; grid-template-columns: repeat(${
        state.canvasWidth
      }, ${state.tileSize}px); grid-template-rows: repeat(${
      state.canvasHeight
    }, ${state.tileSize}px);">${list}</div>
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
  undo(state) {
    const backup = state.updatedList;
    state.updatedList = state.backupList;
    state.backupList = backup;
  },
  setCanvasWidth(state, payload) {
    state.canvasWidth = payload;
  },
  setCanvasHeight(state, payload) {
    state.canvasHeight = payload;
  },
  setTileSize(state, payload) {
    state.tileSize = payload;
  },
  setProjectName(state, payload) {
    state.projectName = payload;
  },
  saveState(state) {
    state.save = {
      projectName: state.projectName,
      canvasWidth: state.canvasWidth,
      canvasHeight: state.canvasHeight,
      tileSize: state.tileSize,
      updatedList: state.updatedList
    }
  }
};

const actions = {
  setUpdatedList: ({ commit }, payload) => {
    commit("setUpdatedList", payload);
    commit("generateArt", { clear: true });
  },
  setList: ({ commit }) => {
    commit("setUpdatedList", { list: generateList(), first: true });
    commit("generateArt", { clear: true });
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
  undo: ({ commit }) => commit("undo"),
  setCanvasWidth: ({ commit }, payload) => commit("setCanvasWidth", payload),
  setCanvasHeight: ({ commit }, payload) => commit("setCanvasHeight", payload),
  setTileSize: ({ commit }, payload) => commit("setTileSize", payload),
  setProjectName: ({ commit }, payload) => commit("setProjectName", payload),
  saveState: ({ commit }) => commit("saveState"),
  import: ({ commit }, payload) => {
    const obj = JSON.parse(payload);
    commit("setUpdatedList", { list: obj.updatedList, first: true });
    commit("setCanvasWidth", obj.canvasWidth);
    commit("setCanvasHeight", obj.canvasHeight);
    commit("setTileSize", obj.tileSize);
    commit("setProjectName", obj.projectName);
    commit("generateArt", { clear: true });
    
  }
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
  backupList: state => state.backupList,
  cleanList: state => state.cleanList,
  save: state => state.save,
  projectName: state => state.projectName
};

// const vuexPersist = new VuexPersist({
//   key: "my-app",
//   storage: localStorage
// });

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
  // plugins: [vuexPersist.plugin]
});
