<template>
  <div class="editor">
    <Toolbar>
      <template slot="palette">
        <ColorPalette :palette-list="paletteList" @current-color="pickedColor" id="palette"/>
        <div class="palette__info">
          <popper
            trigger="click"
            :options="{ placement: 'top' }">
            <div class="popper">
              <div>
                <sketch-picker v-model="newColor" />
                <button class="btn" @click="setColor(newColor.hex)">Add Color <font-awesome-icon icon="plus" /></button>
              </div>
            </div>
            <button slot="reference" class="btn" id="colorPicker">
              <span class="hide">Add Color</span> 
              <font-awesome-icon icon="plus" />
              <div :class="['current-color', {'current-color--bounce': bouncePickedColor}]" :style="{backgroundColor: currentColor.value}">
                <span class="current-color__doubled">Already here!</span>
              </div>
              <span class="tip">P</span>
            </button>
          </popper>
        </div>
      </template>

      <template slot="control">
        <button :class="['btn', {'btn--active': isEraser}]" @click="eraser(true)">
          Eraser <font-awesome-icon icon="eraser" />
          <span class="tip">E</span>
        </button>
        <button :class="['btn', {'btn--active': !isEraser}]" @click="eraser(false)">
          Pencil <font-awesome-icon icon="pen" />
          <span class="tip">B</span>
        </button>

        <popper
            trigger="click"
            :options="{ placement: 'bottom' }">
            <div class="popper">
              <button :class="['btn', {'btn--disabled': zoom === 8}]" @click="zoomIn()">Zoom In <font-awesome-icon icon="search-plus" /></button>
              <button  :class="['btn', {'btn--disabled': zoom === 1/ this.tileSize}]" @click="zoomOut()">Zoom Out <font-awesome-icon icon="search-minus" /></button>
              <button class="btn" @click="zoomReset()">Reset Zoom <font-awesome-icon icon="search" /></button>
              <div>Zoom {{zoom*100}}%</div>
            </div>
            <button slot="reference" class="btn" id="zoom">
              Zoom <font-awesome-icon icon="search" />
              <span class="tip">Z</span>
            </button>
        </popper> 

        <button class="btn" @click="undo()">
          Undo <font-awesome-icon icon="undo" />
          <span class="tip"><font-awesome-icon icon="backspace" /></span>
        </button>
        <button class="btn" @click="generateList()">
          Clean <font-awesome-icon icon="times" />
          <span class="tip">X</span>
        </button>

        <popper
            trigger="click"
            :options="{ placement: 'bottom' }">
            <div class="popper">
              lala
            </div>
            <button slot="reference" class="btn" id="settings">
              Settings <font-awesome-icon icon="cog" />
              <span class="tip">S</span>
            </button>
        </popper> 

        <popper
            trigger="click"
            :options="{ placement: 'top' }">
            <div class="popper">
              <h3>Build</h3>
              <textarea v-if="generatedArt" v-model="generatedArt">
              </textarea>
            </div>
            <button slot="reference" class="btn" @click="generateArt()" id="export">
              Build <font-awesome-icon icon="plus-circle" />
              <span class="tip">B</span>
            </button>
        </popper>

        <button class="btn" @click="toggleGrid()">
          {{showGrid ? 'Hide Grid' : 'Show Grid'}} <font-awesome-icon icon="th-large" />
          <span class="tip">G</span>
        </button>
        <button class="btn" v-if="showGrid" @click="toggleRuler()">
          {{showRuler ? 'Hide Ruler' : 'Show Ruler'}} <font-awesome-icon icon="ruler" />
          <span class="tip">R</span>
        </button>

      </template>
    </Toolbar>

    <Tiles :list="updatedList" 
           :canvas-width="canvasWidth" 
           :canvas-height="canvasHeight" 
           :tile-size="tileSize * zoom" 
           :show-grid="showGrid"
           :show-ruler="showRuler"
           @update-tiles="updateTiles"/>
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

    this.bindKeyEvents();
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
      'eraser',
      'undo'
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
      this.setUpdatedList({ list: list, first: true })
    },
    updateTiles(e) {
      const newList = this.updatedList.map(item => {
        let newItem = null;
        if (item.id === e.id) {
          newItem = Object.assign({}, item);
          if(this.isEraser){
            newItem.color = "transparent";
          }
          else{
            newItem.color = this.currentColor.value;
          }
        }
        return newItem ? newItem : item;
      });
      this.setUpdatedList({ list: newList, first: false, pressed: e.pressed });
    },
    setColor(color) {
      this.addColor(color);
      this.newColor = "";
    },
    bindKeyEvents() {
      document.addEventListener('keydown', (event) => {
        const keyName = event.key;

        // focus palette
        if(keyName.toLowerCase() === 'c'){
          const palette = document.querySelector('#palette > li > button');
          console.log(palette)
          palette.focus();
        }

        // eraser
        if(keyName.toLowerCase() === 'e'){
          this.eraser(true);
        }

        // pencil
        if(keyName.toLowerCase() === 'b'){
          this.eraser(false);
        }

        // undo
        if(keyName.toLowerCase() === 'backspace'){
          this.undo();
        }

        // clean
        if(keyName.toLowerCase() === 'x'){
          this.generateList();
        }

        // toggle grid
        if(keyName.toLowerCase() === 'g'){
          this.toggleGrid();
        }

        // toggle ruler
        if(keyName.toLowerCase() === 'r'){
          this.toggleRuler();
        }

        // zoom options
        if(keyName.toLowerCase() === 'z'){
          const zoomBtn = document.querySelector('#zoom');
          zoomBtn.click();
        }

        // color picker
        if(keyName.toLowerCase() === 'p'){
          const colorPickerBtn = document.querySelector('#colorPicker');
          colorPickerBtn.click();
        }

        // settings
        if(keyName.toLowerCase() === 's'){
          const settingsBtn = document.querySelector('#settings');
          settingsBtn.click();
        }

        // build
        if(keyName.toLowerCase() === 'b'){
          const exportBtn = document.querySelector('#export');
          exportBtn.click();
        }
        console.log('keydown event\n\n' + 'key: ' + keyName);
      });
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

button{
  &.btn{
    position: relative;
    background-color: transparent;
    border: 0;
    padding: 0;
    margin: 0;
    font-size: 9px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    &:after{
      content: "";
      position: absolute;
      top: -1px;
      left: -1px;
      width: calc(100% - 2px);
      height: calc(100% - 2px);
      border: 1px solid var(--border-color);
    }

    &--active{
      &:before{
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: calc(100% - 6px);
        height: calc(100% - 6px);
        border: 2px solid var(--border-color-active);
      }
    }

    &--disabled{
      color: rgba(0, 0, 0, 0.2);
      pointer-events: none;
    }

    .svg-inline--fa{
      height: 20px;
      padding: 5px 0;
    }
  }
}

.vc-sketch{
  box-shadow: none;
  background-color: #eaeaea;
}

.popper{
  box-shadow: rgb(138, 138, 138) 7px 7px 0px -4px;
  border-radius: 0;
  background-color: #eaeaea;
  border-color: #eaeaea;
}
</style>
