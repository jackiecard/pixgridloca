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
                <button class="btn btn--primary" @click="setColor(newColor.hex)">Add Color</button>
              </div>
            </div>
            <button slot="reference" class="btn btn--control" id="colorPicker">
              <span class="hide">Add Color</span> 
              <font-awesome-icon icon="plus" />
              <div :class="['current-color', {'current-color--bounce': bouncePickedColor}]" :style="{backgroundColor: currentColor.value}">
                <span class="current-color__doubled">Already here!</span>
              </div>
              <span class="tip">A</span>
            </button>
          </popper>
        </div>
      </template>

      <template slot="control">
        <button :class="['btn btn--control', {'btn--active': isEraser}]" @click="eraser(true)">
          Eraser <font-awesome-icon icon="eraser" />
          <span class="tip">E</span>
        </button>
        <button :class="['btn btn--control', {'btn--active': !isEraser}]" @click="eraser(false)">
          Pencil <font-awesome-icon icon="pen" />
          <span class="tip">P</span>
        </button>

        <popper
            trigger="click"
            :options="{ placement: 'bottom' }">
            <div class="popper">
              <div class="zoom-config">
                <button :class="['btn btn--control', {'btn--disabled': zoom === 8}]" 
                  @click="zoomIn()"
                  id="zoom-in">
                  Zoom In 
                  <font-awesome-icon icon="search-plus" />
                  <span class="tip">+</span>
                </button>
                <button :class="['btn btn--control', {'btn--disabled': zoom === 1/ this.tileSize}]" 
                  @click="zoomOut()"
                  id="zoom-out">
                  Zoom Out 
                  <font-awesome-icon icon="search-minus" />
                  <span class="tip">-</span>
                </button>
                <button class="btn btn--control" 
                  @click="zoomReset()"
                  id="zoom-reset">Reset Zoom 
                  <font-awesome-icon icon="search" />
                  <span class="tip">]</span>
                </button>
              </div>
              <div>Zoom {{zoom*100}}%</div>
            </div>
            <button slot="reference" class="btn btn--control" id="zoom">
              Zoom <font-awesome-icon icon="search" />
              <span class="tip">Z</span>
            </button>
        </popper> 

        <button class="btn btn--control" @click="undo()">
          Undo <font-awesome-icon icon="undo" />
          <span class="tip">U</span>
        </button>
        
        <button class="btn btn--control" @click="showModal = true">
          Clean <font-awesome-icon icon="times" />
          <span class="tip">X</span>
        </button>

        <modal v-if="showModal" @quit="showModal = false" @accept="showModal = false, setList()">
          <h3 slot="header">Are you sure?</h3>
          <p slot="body">This is wipe out all the work done so far.</p>
        </modal>

        <popper
            trigger="click"
            :options="{ placement: 'bottom' }">
            <div class="popper">
              <div class="settings">
                <label for="canvas-width">Canvas Width</label>
                <input type="text" v-model="newCanvasWidth" placeholder="Canvas Width" name="canvas-width"/>
                <label for="canvas-height">Canvas Height</label>
                <input type="text" v-model="newCanvasHeight" placeholder="Canvas Height" name="canvas-height"/>
                <label for="tile-size">Tile Size</label>
                <input type="text" v-model="newTileSize" placeholder="Tile Size" name="tile-size"/>
              </div>

              <button class="btn btn--primary" @click="setNewConfig">Ok!</button>
            </div>
            <button slot="reference" class="btn btn--control" id="settings">
              Settings <font-awesome-icon icon="cog" />
              <span class="tip">S</span>
            </button>
        </popper> 

        <popper
            trigger="click"
            :options="{ placement: 'top' }">
            <div class="popper">
              <h3>Build</h3>
              <textarea class="generated-art-field" 
                v-if="generatedArt" 
                @click="copyContent()" 
                ref="buildTextarea">{{this.generatedArt.trim()}}</textarea>
              <div :class="['generated-art-field__copy', {'generated-art-field__copy--show': showCopiedTip}]">Copied!</div>
            </div>
            <button slot="reference" class="btn btn--control" @click="generateArt()" id="export">
              Build <font-awesome-icon icon="plus-circle" />
              <span class="tip">B</span>
            </button>
        </popper>

        <button class="btn btn--control" @click="toggleGrid()">
          {{showGrid ? 'Hide Grid' : 'Show Grid'}} <font-awesome-icon icon="th-large" />
          <span class="tip">G</span>
        </button>
        <button class="btn btn--control" v-if="showGrid" @click="toggleRuler()">
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
      newColor: '',
      newCanvasWidth: 8,
      newCanvasHeight: 8,
      newTileSize: 10,
      showCopiedTip: false,
      showModal: false
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
      this.setList();
    }
    this.bindKeyEvents();
    this.newCanvasWidth = this.canvasWidth;
    this.newCanvasHeight = this.canvasHeight;
    this.newTileSize = this.tileSize;
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
      'undo',
      'setCanvasWidth',
      'setCanvasHeight',
      'setTileSize',
      'setList'
    ]),
    setNewConfig() {
      this.setCanvasWidth(Number(this.newCanvasWidth))
      this.setCanvasHeight(Number(this.newCanvasHeight))
      this.setTileSize(Number(this.newTileSize))
      this.setList()
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
    copyContent(){
      const textarea = this.$refs.buildTextarea;
      textarea.select();
      document.execCommand("copy");
      this.showCopiedTip = true;
      setTimeout(() => {
        this.showCopiedTip = false;
      }, 3000);
    },
    bindKeyEvents() {
      document.addEventListener('keydown', (event) => {
        const keyName = event.key;

        // focus palette
        if(keyName.toLowerCase() === 'c'){
          const palette = document.querySelector('#palette > li > button');
          palette.focus();
        }

        // eraser
        if(keyName.toLowerCase() === 'e'){
          this.eraser(true);
        }

        // pencil
        if(keyName.toLowerCase() === 'p'){
          this.eraser(false);
        }

        // undo
        if(keyName.toLowerCase() === 'u'){
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

        //zoom in
        if(keyName.toLowerCase() === '+'){
          const zoomBtn = document.querySelector('#zoom-in');
          zoomBtn.click();
        }

        //zoom out
        if(keyName.toLowerCase() === '-'){
          const zoomBtn = document.querySelector('#zoom-out');
          zoomBtn.click();
        }

        //zoom reset
        if(keyName.toLowerCase() === ']'){
          const zoomBtn = document.querySelector('#zoom-reset');
          zoomBtn.click();
        }

        // color picker
        if(keyName.toLowerCase() === 'a'){
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
      });
    }
  }
}
</script>

<style lang="scss">
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

.btn{
  position: relative;
  background-color: transparent;
  cursor: pointer;
  border: 0;
  padding: 0;
  margin: 0;
  font-size: 12px;

  &--active{
    &:before{
      content: "";
      position: absolute;
      bottom: 10px;
      right: 10px;
      background-color: rgb(214, 125, 125);
      width: 6px;
      height: 6px;
      border-radius: 50%;
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

  &--primary{
    background-color: rgba(255, 255, 255, 0.45098039215686275);
    min-height: auto;
    margin: 5px;   
    padding: 6px 15px;
    min-width: 100px;
  }

  &--secondary{
    background-color: transparent;
    min-height: auto;
    margin: 5px;   
    padding: 6px 15px;
    min-width: 100px;
    background-color: #333333;
    color: #fff;
    border-color: transparent;
  }

  &--control{
    font-size: 9px;
    position: relative;
    height: 100%;
    min-width: 60px;
    min-height: 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .tip{
      display: none;
      position: absolute;
      top: 2px;
      right: 5px;
      font-size: 8px;

      .svg-inline--fa{
        height: 8px;
        padding: 0;
      }

      @media (min-width: 800px) {
        display: block;
      }
    }
  }
}

.editor .vc-sketch{
  box-shadow: none;
  background-color: #eaeaea;
}

.popper{
  box-shadow: rgb(138, 138, 138) 7px 7px 0px -4px;
  border-radius: 0;
  background-color: #eaeaea;
  border-color: #eaeaea;
}

.generated-art-field{
  width: 300px;
  min-height: 100px;
  max-height: 200px;
  resize: none;
  background-color: #272727;
  color: #dadada;
  font-size: 12px;

  &__copy{
    text-align: right;
    opacity: 0;
    transition: .5s opacity ease-in-out;

    &--show{
      opacity: 1;
    }
  }
}

.settings{
  display: grid;
  grid-template-columns: 100px 1fr;
  grid-template-rows: auto auto auto;

  label{
    text-align: left;
    font-weight: 600;
  }

  input{
    max-width: 50px;
  }
}

.zoom-config{
  display: flex;
}
</style>
