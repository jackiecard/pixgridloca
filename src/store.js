import Vue from "vue";
import Vuex from "vuex";
// import VuexPersist from "vuex-persist";

Vue.use(Vuex);

const generateList= () => {
  const list = [];
  const size = state.canvasWidth * state.canvasHeight;

  for (let i = 0; i < size; i++) {
    list.push({
      id: uuidv4(),
      xs: i % state.canvasWidth,
      ys: (i - (i % state.canvasWidth)) / state.canvasWidth,
      color: "transparent"
    });
  }

  return list;
}

const uuidv4 = () => {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
}

const generateCode = ({ updatedList, canvasWidth, canvasHeight, tileSize, payload }) => {
  let html = "";
  let list = "";
  const listLines = [];
  
  updatedList.reduce((prev, curr) => {
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

  listLines.forEach(item => {
    if (item.color !== "transparent") {
      list += `<div class="pixgrid__pixel" id="${
        item.id
      }" style="background-color: ${item.color}; grid-area: ${item.ys +
        1} / ${item.xs + 1} / ${item.ys + 2} / ${item.xe + 2}"></div>`;
    }
  });

  if (payload && payload.minMax) {
    html = `
    <div class="pixgrid" style="display: grid; grid-template-columns: repeat(
      ${canvasWidth}, minmax(1px, 
      ${tileSize}px)); grid-template-rows: repeat(
      ${canvasHeight}, minmax(1px, 
      ${tileSize}px));">
      ${list}</div>
  `;
  }
  else{
    html = `
      <div class="pixgrid" style="display: grid; grid-template-columns: repeat(
        ${canvasWidth}, 
        ${payload && payload.tileSize ? payload.tileSize : tileSize}px); grid-template-rows: repeat(
        ${canvasHeight}, 
        ${payload && payload.tileSize ? payload.tileSize : tileSize}px);">
        ${list}</div>
    `;
  }
  return html;
}

const state = {
  projectName: "Awesome Pixel Grid",
  generatedArt: null,
  updatedList: [],
  backupList: [],
  canvasWidth: 5,
  canvasHeight: 5,
  layers: [],
  sprites: "",
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
    },
    {
      id: "c9",
      value: "#E28B8B"
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
    if (payload.first || !payload.pressed) {
      state.backupList = payload.list;
    }
    state.updatedList = payload.list.map(x => ({...x}));
  },
  updateListItem(state, payload) {
    const list = state.updatedList.map(item => {
      if(item.id === payload.id){
        if (state.isEraser) {
          item.color = "transparent";
        } else {
          item.color = state.currentColor.value;
        }
      }
      return item;
    });
    state.updatedList = list;
  },
  generateArt(state, payload) {
    if (payload && payload.clear) {
      state.generatedArt = null;
      return;
    }
    state.generatedArt = generateCode({
      updatedList: state.updatedList,
      canvasWidth: state.canvasWidth,
      canvasHeight: state.canvasHeight,
      tileSize: state.tileSize,
      payload: payload
    });
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
    const layers = state.layers.map(a => ({ ...a }));
    layers.map(x => {
      delete x.codeForView;
      return x;
    });
    state.save = {
      projectName: state.projectName,
      canvasWidth: state.canvasWidth,
      canvasHeight: state.canvasHeight,
      tileSize: state.tileSize,
      layers: layers
    };
  },
  setLayers(state, payload) {
    if (payload.clear) {
      state.layers = [];
      return;
    }

    if(payload.config){
      state.layers = payload.config.layers.map(a => {
        a.codeForView = generateCode({
          updatedList: a.canvas,
          canvasWidth: payload.config.canvasWidth,
          canvasHeight: payload.config.canvasHeight,
          tileSize: payload.config.tileSize,
          payload: {
            tileSize: 5
          }
        });
        return a;
      });
      return;
    }

    const code = state.generatedArt;
    const codeForView = generateCode({
      updatedList: state.updatedList,
      canvasWidth: state.canvasWidth,
      canvasHeight: state.canvasHeight,
      tileSize: state.tileSize,
      payload: {
        tileSize: 5
      }
    });
    const canvas = state.updatedList.map(a => ({ ...a }));
    const list = state.layers;
    const layers = list.concat({
      id: uuidv4(),
      name: "Unamed Layer",
      code: code,
      codeForView: codeForView,
      canvas: canvas
    });

    state.layers = layers;
  },
  updateLayer(state, payload) {
    const layers = state.layers.map(item => {
      if (item.id === payload.id) {
          item.code = state.generatedArt;
          item.canvas = state.updatedList;
          item.codeForView = generateCode({
            updatedList: state.updatedList,
            canvasWidth: state.canvasWidth,
            canvasHeight: state.canvasHeight,
            tileSize: state.tileSize,
            payload: {
              tileSize: 5
            }
          });

        if (payload.name) {
          item.name = payload.name;
        }
      }
      return item;
    });

    state.layers = layers;
  },
  removeLayer(state, payload) {
    const filtered = state.layers.filter(item => {
      return item.id !== payload.id;
    });

    state.layers = filtered;
  },
  generateSprite(state) {
    let keyframe = "";
    const width = state.canvasWidth * state.tileSize;
    const height = state.canvasHeight * state.tileSize;
    const size = state.layers.length + 1;
    let acumulatedtMargin = 0;

    for (let i = 0; i < size; i++) {
      let margin =
        i + 1 === size ? acumulatedtMargin - height : acumulatedtMargin;
      acumulatedtMargin = acumulatedtMargin + height;
      keyframe += `${i * (100 / (size - 1))}% {margin-top: -${margin}px;}`;
    }

    const sprites = state.layers.map(x => {return x.code}).join('');

    state.sprites = `<style>@keyframes sprite{${keyframe}}.pixel-grid-animation{overflow: hidden;height: ${width}px;width: ${height}px;} .pixel-grid-animation .pixel-grid-wrapper{animation: sprite 1s steps(1) infinite;}</style><div class="pixel-grid-animation"><div class="pixel-grid-wrapper">${sprites}</div></div>`;
  }
};

const actions = {
  setUpdatedList: ({ commit }, payload) => {
    commit("setUpdatedList", payload);
    commit("generateArt", { clear: true });
  },
  updateListItem: ({ commit }, payload) => {
    commit("updateListItem", payload);
  },
  setList: ({ commit }) => {
    commit("setUpdatedList", { list: generateList(), first: true });
    commit("generateArt", { clear: true });
    commit("setLayers", { clear: true });
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
    commit("setLayers", { config: obj });
    commit("setUpdatedList", { list: obj.layers[0].canvas, first: true });
    commit("setCanvasWidth", obj.canvasWidth);
    commit("setCanvasHeight", obj.canvasHeight);
    commit("setTileSize", obj.tileSize);
    commit("setProjectName", obj.projectName);
    commit("generateArt", { clear: true });
  },
  generateSprite: ({ commit }) => commit("generateSprite"),
  setLayers: ({ commit }, payload) => {
    commit("generateArt");
    commit("setLayers", payload);
  },
  updateLayer: ({ commit }, payload) => {
    commit("generateArt");
    commit("updateLayer", payload);
    commit("setUpdatedList", { list: state.updatedList.map(a => ({ ...a })) });
  },
  removeLayer: ({ commit }, payload) => commit("removeLayer", payload)
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
  projectName: state => state.projectName,
  layers: state => state.layers,
  sprites: state => state.sprites
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
