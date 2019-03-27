<template>
  <div id="app">
    Jiji Editor
    <ColorPalette :palette-list="paletteList" @current-color="pickedColor"/>
    Current Color: <div class="current-color" :style="{backgroundColor: currentColor.value}"></div> {{this.currentColor.name}}
    <button @click="generateArt()">Generate</button>
    <Tiles :list="updatedList" 
           :canvas-width="canvasWidth" 
           :canvas-height="canvasHeight" 
           :tile-size="tileSize" 
           @update-tiles="updateTiles"/>
    <textarea v-if="generatedArt" v-model="generatedArt">
    </textarea>
  </div>
</template>

<script>
import Tiles from './components/Tiles.vue'
import ColorPalette from './components/ColorPalette.vue'

export default {
  name: 'app',
  components: {
    Tiles,
    ColorPalette
  },
  data() {
    return {
      generatedArt: null,
      updatedList: [],
      canvasWidth: 6,
      canvasHeight: 4,
      tileSize: 100,
      currentColor: {
        id: '0',
        name: 'transparent',
        value: 'transparent'
      },
      paletteList: [
        {
          id: 'c0',
          name: 'transparent',
          value: 'transparent'
        },
        {
          id: 'c1',
          name: 'red',
          value: 'red'
        },
        {
          id: 'c2',
          name: 'black',
          value: 'black'
        },
        {
          id: 'c3',
          name: 'green',
          value: 'green'
        },
        {
          id: 'c4',
          name: 'blue',
          value: 'blue'
        },
        {
          id: 'c5',
          name: 'yellow',
          value: 'yellow'
        },
        {
          id: 'c6',
          name: 'orange',
          value: 'orange'
        },
        {
          id: 'c7',
          name: 'purple',
          value: 'purple'
        },
        {
          id: 'c8',
          name: 'white',
          value: 'white'
        }
      ]
    }
  },
  mounted(){
    this.updatedList = this.generateList();
  },
  methods: {
    generateList(){
      const list = [];
      const size = this.canvasWidth * this.canvasHeight;

      for(let i=0; i < size; i++){
        list.push({
          id: 'p' + i,
          xs: i % this.canvasWidth,
          ys: (i - (i % this.canvasWidth))/this.canvasWidth,
          color: 'transparent'
        })
      }
      return list;
    },
    pickedColor(e){
      this.currentColor = e;
      console.log(e);
    },
    updateTiles(e){
      console.log('app id', e.id)
      const newList = this.updatedList.map(item => {
        if(item.id === e.id) {
          console.log('item', item)
          item.color = this.currentColor.value;
        }
        return item;
      });
      this.updatedList = newList;
    },
    generateArt(){
      let list = '';
      this.updatedList.forEach(item => {
        if(item.color !== 'transparent'){
          list += `<div class="pixel" id="${item.id}" style="background-color: ${item.color}; grid-area: ${item.ys + 1} / ${item.xs + 1} / ${item.ys + 2} / ${item.xs + 2}"></div>`
        }
      });
      const html = `
        <div class="art" style="display: grid; grid-template-columns: repeat(${this.canvasWidth}, ${this.tileSize}px); grid-template-rows: repeat(${this.canvasHeight}, ${this.tileSize}px);">
          ${list}
        </div>
      `;
      this.generatedArt = html;
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  background-color: #ccc;
}

.current-color{
  border: 1px solid #000;
  width: 30px;
  height: 30px;
}
</style>
