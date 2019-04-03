import Vue from "vue";
import Vuex from "vuex";
import kebabCase from "lodash.kebabcase";
const utils = require( "./utils");
// import VuexPersist from "vuex-persist";

Vue.use(Vuex);

const generateList= () => {
  const list = [];
  const size = state.canvasWidth * state.canvasHeight;

  for (let i = 0; i < size; i++) {
    list.push({
      id: utils.uuidv4(),
      xs: i % state.canvasWidth,
      ys: (i - (i % state.canvasWidth)) / state.canvasWidth,
      color: "transparent"
    });
  }

  return list;
}

const generateCode = ({ frameGrid, canvasWidth, canvasHeight, tileSize, payload }) => {
  let html = "";
  let list = "";
  const listLines = [];
  
  frameGrid.reduce((prev, curr) => {
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

  listLines.forEach((item, i) => {
    if (item.color !== "transparent") {
      list += `<div class="pixgrid-pixel" data-index="${i}" id="${
        item.id
      }" style="background-color: ${item.color}; grid-area: ${item.ys +
        1} / ${item.xs + 1} / ${item.ys + 2} / ${item.xe + 2}"></div>`;
    }
  });

  if (payload && payload.minMax) {
    html = `
    <div class="pixgrid-canvas" style="display: grid; grid-template-columns: repeat(
      ${canvasWidth}, minmax(1px, 
      ${tileSize}px)); grid-template-rows: repeat(
      ${canvasHeight}, minmax(1px, 
      ${tileSize}px));">
      ${list}</div>
  `;
  }
  else{
    html = `
      <div class="pixgrid-canvas" style="display: grid; grid-template-columns: repeat(
        ${canvasWidth}, 
        ${payload && payload.tileSize ? payload.tileSize : tileSize}px); grid-template-rows: repeat(
        ${canvasHeight}, 
        ${payload && payload.tileSize ? payload.tileSize : tileSize}px);">
        ${list}</div>
    `;
  }
  return html;
}

const checkHex = (value) => {
  if (
    value.includes("rgb") ||
    value.includes("hsl") ||
    value.charAt(0) === "#"
  ) {
    return value;
  }
  return `#${value}`;
}

const state = {
  projectName: "Awesome Pixel Grid",
  projectId: null,
  spriteCode: null,
  frameGrid: [],
  backupFrameGrid: [],
  canvasWidth: 5,
  canvasHeight: 5,
  frames: [],
  spritesCode: "",
  showGrid: true,
  showRuler: true,
  zoom: 1,
  tileSize: 40,
  newColor: "",
  bouncePickedColor: false,
  isEraser: false,
  save: {},
  exportedSingleSprite: {},
  currentColor: "#be4a2f",
  paletteList: ["#be4a2f","#d77643","#ead4aa","#e4a672","#b86f50","#733e39","#3e2731","#a22633","#e43b44","#f77622","#feae34","#fee761","#63c74d","#3e8948","#265c42","#193c3e","#124e89","#0099db","#2ce8f5","#ffffff","#c0cbdc","#8b9bb4","#5a6988","#3a4466","#262b44","#181425","#ff0044","#68386c","#b55088","#f6757a","#e8b796","#c28569"]
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
    if (state.paletteList.indexOf(payload) >= 0){
      return;
    }
    state.paletteList.push(payload);
  },
  pickedColor(state, payload) {
    state.currentColor = payload;
  },
  setFrameGrid(state, payload) {
    if (payload.first || !payload.pressed) {
      state.backupFrameGrid = payload.list.map(x => ({ ...x }));
    }
    state.frameGrid = payload.list.map(x => ({...x}));
  },
  updateListItem(state, payload) {
    if (!payload.pressed) {
      state.backupFrameGrid = state.frameGrid.map(x => ({ ...x }));
    }
    const list = state.frameGrid.map(item => {
      if(item.id === payload.id){
        if (state.isEraser) {
          item.color = "transparent";
        } else {
          item.color = state.currentColor;
        }
      }
      return item;
    });
    state.frameGrid = list;
  },
  generateSpriteCode(state, payload) {
    if (payload && payload.clear) {
      state.spriteCode = null;
      return;
    }
    state.spriteCode = generateCode({
      frameGrid: state.frameGrid,
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
    const backup = state.frameGrid;
    state.frameGrid = state.backupFrameGrid;
    state.backupFrameGrid = backup;
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
  setProjectId(state) {
    state.projectId = utils.uuidv4();
  },
  saveState(state) {
    const frames = state.frames.map(a => ({ ...a }));
    frames.map(x => {
      delete x.codeForView;
      return x;
    });
    state.save = {
      projectName: state.projectName,
      canvasWidth: state.canvasWidth,
      canvasHeight: state.canvasHeight,
      tileSize: state.tileSize,
      frames: frames
    };
  },
  setFrames(state, payload) {
    if (payload.clear) {
      state.frames = [];
      return;
    }

    if(payload.config){
      state.frames = payload.config.frames.map(a => {
        a.codeForView = generateCode({
          frameGrid: a.canvas,
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

    const code = state.spriteCode;
    const codeForView = generateCode({
      frameGrid: state.frameGrid,
      canvasWidth: state.canvasWidth,
      canvasHeight: state.canvasHeight,
      tileSize: state.tileSize,
      payload: {
        tileSize: 5
      }
    });
    const canvas = state.frameGrid.map(a => ({ ...a }));
    const list = state.frames;
    const frames = list.concat({
      id: utils.uuidv4(),
      name: "Unamed Frame",
      code: code,
      codeForView: codeForView,
      canvas: canvas
    });

    state.frames = frames;
  },
  updateFrame(state, payload) {
    const frames = state.frames.map(item => {
      if (item.id === payload.id) {
          item.code = state.spriteCode;
          item.canvas = state.frameGrid;
          item.codeForView = generateCode({
            frameGrid: state.frameGrid,
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

    state.frames = frames;
  },
  removeFrame(state, payload) {
    const filtered = state.frames.filter(item => {
      return item.id !== payload.id;
    });

    state.frames = filtered;
  },
  updateFrameName(state, payload) {
    const frames = state.frames.map(item => {
      if (item.id === payload.id) {
        item.name = payload.name;
      }
      return item;
    });

    state.frames = frames;
  },
  generateSprite(state) {
    let keyframe = "";
    const width = state.canvasWidth * state.tileSize;
    const height = state.canvasHeight * state.tileSize;
    const size = state.frames.length + 1;
    let acumulatedtMargin = 0;

    for (let i = 0; i < size; i++) {
      let margin =
        i + 1 === size ? acumulatedtMargin - height : acumulatedtMargin;
      acumulatedtMargin = acumulatedtMargin + height;
      keyframe += `${i * (100 / (size - 1))}% {margin-top: -${margin}px;}`;
    }

    const spritesCode = state.frames.map((x, i) => {
      return `<div class="pixgrid-sprite" id="${x.id}" data-count="${i}" data-name="${kebabCase(x.name)}">${x.code}</div>`}).join('');

    state.spritesCode = `<style>@keyframes sprite{${keyframe}}.pixgrid-animation{overflow: hidden;height: ${width}px;width: ${height}px;} .pixgrid-animation .pixgrid-wrapper{animation: sprite 1s steps(1) infinite;}</style><div class="pixgrid-animation" id="${state.projectId}" data-project-name="${kebabCase(state.projectName)}"><div class="pixgrid-wrapper">${spritesCode}</div></div>`;
  },
  importPalette(state, payload) {
    let hexList = [];
    if (payload) {
      hexList = payload.trim().split(/\r?\n/);
    }
    hexList = hexList.map(h => {
      return checkHex(h);
    });
    state.paletteList = hexList;
  }
};

const actions = {
  setFrameGrid: ({ commit }, payload) => {
    commit("setFrameGrid", payload);
    commit("generateSpriteCode", { clear: true });
  },
  updateListItem: ({ commit }, payload) => {
    commit("updateListItem", payload);
  },
  setList: ({ commit }) => {
    commit("setProjectId");
    commit("setFrameGrid", { list: generateList(), first: true });
    commit("generateSpriteCode", { clear: true });
    commit("setFrames", { clear: true });
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

    const item = state.paletteList.indexOf(payload) >= 0;

    if (item) {
      commit("pickedColor", item);
      commit("bouncePickedColor");
      return;
    }

    commit("addColor", payload);
    commit("pickedColor", payload);
  },
  pickedColor: ({ commit }, payload) => {
    commit("eraser", false);
    commit("pickedColor", payload);
  },
  generateSpriteCode: ({ commit }, payload) => commit("generateSpriteCode", payload),
  eraser: ({ commit }, payload) => commit("eraser", payload),
  undo: ({ commit }) => commit("undo"),
  setCanvasWidth: ({ commit }, payload) => commit("setCanvasWidth", payload),
  setCanvasHeight: ({ commit }, payload) => commit("setCanvasHeight", payload),
  setTileSize: ({ commit }, payload) => commit("setTileSize", payload),
  setProjectName: ({ commit }, payload) => commit("setProjectName", payload),
  saveState: ({ commit }) => commit("saveState"),
  import: ({ commit }, payload) => {
    const obj = JSON.parse(payload);
    commit("setFrames", { config: obj });
    commit("setFrameGrid", { list: obj.frames[0].canvas, first: true });
    commit("setCanvasWidth", obj.canvasWidth);
    commit("setCanvasHeight", obj.canvasHeight);
    commit("setTileSize", obj.tileSize);
    commit("setProjectName", obj.projectName);
    commit("generateSpriteCode", { clear: true });
  },
  generateSprite: ({ commit }) => commit("generateSprite"),
  setFrames: ({ commit }, payload) => {
    commit("generateSpriteCode");
    commit("setFrames", payload);
  },
  updateFrame: ({ commit }, payload) => {
    commit("generateSpriteCode");
    commit("updateFrame", payload);
    commit("setFrameGrid", { list: state.frameGrid.map(a => ({ ...a })) });
  },
  removeFrame: ({ commit }, payload) => commit("removeFrame", payload),
  updateFrameName: ({ commit }, payload) => commit("updateFrameName", payload),
  importPalette: ({ commit }, payload) => commit("importPalette", payload)
};

const getters = {
  spriteCode: state => state.spriteCode,
  frameGrid: state => state.frameGrid,
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
  backupFrameGrid: state => state.backupFrameGrid,
  cleanList: state => state.cleanList,
  save: state => state.save,
  projectName: state => state.projectName,
  frames: state => state.frames,
  spritesCode: state => state.spritesCode
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
