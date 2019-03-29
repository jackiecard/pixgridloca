<template>
  <div class="editor">
    <Header>
      <template slot="logo">
        <font-awesome-icon icon="heart" /> Pixel Grid Editor
      </template>
    </Header>
    <Toolbar>
      <template slot="palette">
        <ColorPalette :palette-list="paletteList" @current-color="pickedColor"/>
        <div class="palette__info">
          <div :class="['current-color', {'current-color--bounce': bouncePickedColor}]" :style="{backgroundColor: currentColor.value}">
            <span class="current-color__doubled">Already here!</span>
          </div>
          <input type="text" placeholder="#000000" v-model="newColor"/><button @click="setColor(newColor)">Add Color <font-awesome-icon icon="plus" /></button>
        </div>
      </template>

      <template slot="control">
        <button @click="eraser(true)">Eraser <font-awesome-icon icon="eraser" /></button>
        <button @click="eraser(false)">Pencil <font-awesome-icon icon="pen" /></button>
        <button @click="generateArt()">Generate <font-awesome-icon icon="plus-circle" /></button>
        <button @click="zoomIn()">Zoom In <font-awesome-icon icon="search-plus" /></button>
        <button @click="zoomOut()">Zoom Out <font-awesome-icon icon="search-minus" /></button>
        <button @click="zoomReset()">Reset Zoom <font-awesome-icon icon="search" /></button>
        <button @click="generateList()">Clean <font-awesome-icon icon="times" /></button>
        <div>Zoom {{zoom*100}}%</div>
      </template>
    </Toolbar>
    <Tiles :list="updatedList" 
           :canvas-width="canvasWidth" 
           :canvas-height="canvasHeight" 
           :tile-size="tileSize * zoom" 
           :show-grid="showGrid"
           :show-ruler="showRuler"
           @update-tiles="updateTiles"/>
    <div class="grid-info">
      <button @click="toggleGrid()">{{showGrid ? 'Hide Grid' : 'Show Grid'}} <font-awesome-icon icon="th-large" /></button>
      <button v-if="showGrid" @click="toggleRuler()">{{showRuler ? 'Hide Ruler' : 'Show Ruler'}} <font-awesome-icon icon="ruler" /></button>
    </div>
    <textarea v-if="generatedArt" v-model="generatedArt">
    </textarea>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Editor',
  data() {
    return {
      newColor: ''
    }
  },
  computed: mapGetters([
    'updatedList',
    'canvasWidth',
    'canvasHeight',
    'showGrid',
    'showRuler',
    'zoom',
    'tileSize',
    'paletteList',
    'currentColor',
    'generatedArt',
    'bouncePickedColor',
    'isEraser'
  ]),
  mounted(){
    if(!this.updatedList || this.updatedList.length <= 0){
      this.generateList();
    }
  },
  methods: {
    ...mapActions([
      'setUpdatedList', 
      'toggleGrid', 
      'toggleRuler',
      'zoomIn',
      'zoomOut',
      'zoomReset',
      'addColor',
      'pickedColor',
      'generateArt',
      'eraser'
    ]),
    generateList() {
      const list = [];
      const size = this.canvasWidth * this.canvasHeight;

      for (let i = 0; i < size; i++) {
        list.push({
          id: "p" + i,
          xs: i % this.canvasWidth,
          ys: (i - (i % this.canvasWidth)) / this.canvasWidth,
          color: "transparent"
        });
      }
      this.setUpdatedList(list)
    },
    updateTiles(e) {
      const newList = this.updatedList.map(item => {
        if (item.id === e.id) {
          if(this.isEraser){
            item.color = "transparent";
          }
          else{
            item.color = this.currentColor.value;
          }
        }
        return item;
      });
      this.setUpdatedList(newList);
    },
    setColor(color){
      this.addColor(color);
      this.newColor = "";
    }
  }
}
</script>

<style lang="scss" scoped>
.current-color{
  position: relative;
  border: 1px solid #000;
  width: 30px;
  height: 30px;
  transform: scale(1, 1);
  box-shadow: 0px 0px 0px #8e8e8e;
  transition: transform .5s .25s ease-in-out,
              box-shadow .5s .25s ease-in-out;

  &__doubled{
    font-family: 'Roboto Condensed', sans-serif;
    position: absolute;    
    top: -3px;
    left: 9px;
    transform: rotate(-45deg) scale(0, 0);
    opacity: 0;
    font-size: 11px;
    line-height: 11px;
    text-shadow: 0px 0px 1px #000, 0px 0px 1px #000, 0px 0px 1px #000, 0px 0px 1px #000;
    color: #fff;
    transition: opacity .5s ease-in-out,
                transform .5s ease-in-out;
  }

  &--bounce{
    box-shadow: 0px 0px 15px #8e8e8e;
    transform: scale(1.2, 1.2);

    .current-color__doubled{
      opacity: 1;
      transform: rotate(-20deg) scale(1, 1);
    }
  }
}
</style>
