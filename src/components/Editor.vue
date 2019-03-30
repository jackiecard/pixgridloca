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
              <span class="tip">1</span>
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
          <span class="tip">W</span>
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
                  <span class="tip">=</span>
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
              <span class="tip">2</span>
            </button>
        </popper> 

        <button class="btn btn--control" @click="undo()">
          Undo <font-awesome-icon icon="undo" />
          <span class="tip">3</span>
        </button>
        
        <button class="btn btn--control" @click="showModal = true" id="clean">
          Clean <font-awesome-icon icon="times" />
          <span class="tip">4</span>
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
                <label for="project-name">Project Name</label>
                <input type="text" v-model="newProjectName" placeholder="Project Name" name="project-name"/>
                <label for="canvas-width">Canvas Width</label>
                <input type="text" v-model="newCanvasWidth" placeholder="Canvas Width" name="canvas-width" class="small-input"/>
                <label for="canvas-height">Canvas Height</label>
                <input type="text" v-model="newCanvasHeight" placeholder="Canvas Height" name="canvas-height" class="small-input"/>
                <label for="tile-size">Tile Size</label>
                <input type="text" v-model="newTileSize" placeholder="Tile Size" name="tile-size" class="small-input"/>
              </div>
              <button class="btn btn--primary" @click="setNewConfig">Ok!</button>
            </div>
            <button slot="reference" class="btn btn--control" id="settings">
              Settings <font-awesome-icon icon="cog" />
              <span class="tip">5</span>
            </button>
        </popper> 


        <popper
            trigger="click"
            :options="{ placement: 'bottom' }">
            <div class="popper">
              <div class="save-settings">
                <h3>Save it for later</h3>
                <textarea class="generated-art-field" 
                  v-if="save" 
                  @click="copyContent(true)" 
                  ref="saveTextarea">{{this.save}}</textarea>
                <div :class="['generated-art-field__copy', {'generated-art-field__copy--show': showCopiedTip}]">Copied!</div>
              </div>
            </div>
            <button slot="reference" class="btn btn--control" @click="saveState()" id="save-btn">
              Save <font-awesome-icon icon="save" />
              <span class="tip">6</span>
            </button>
        </popper> 


        <popper
            trigger="click"
            :options="{ placement: 'bottom' }">
            <div class="popper">
              <div class="save-settings">
                <h3>Import project</h3>
                <textarea class="generated-art-field" 
                  v-if="save" 
                  v-model="importedProject"></textarea>
              </div>
              <button class="btn btn--primary" @click="importProject">Ok!</button>
            </div>
            <button slot="reference" class="btn btn--control" id="import-btn">
              Import <font-awesome-icon icon="upload" />
              <span class="tip">7</span>
            </button>
        </popper> 

        <popper
            trigger="click"
            :options="{ placement: 'top' }">
            <div class="popper">
              <h3>Make it HTML</h3>
              <textarea class="generated-art-field" 
                v-if="generatedArt" 
                @click="copyContent()" 
                ref="buildTextarea">{{this.generatedArt.trim()}}</textarea>
              <div :class="['generated-art-field__copy', {'generated-art-field__copy--show': showCopiedTip}]">Copied!</div>
            </div>
            <button slot="reference" class="btn btn--control" @click="generateArt()" id="export">
              Make <font-awesome-icon icon="plus-circle" />
              <span class="tip">8</span>
            </button>
        </popper>
      </template>
    </Toolbar>

    <Tiles :list="updatedList" 
           :canvas-width="canvasWidth" 
           :canvas-height="canvasHeight" 
           :tile-size="tileSize * zoom" 
           :show-grid="showGrid"
           :show-ruler="showRuler"
           @update-tiles="updateTiles">
      <button :class="['btn', {'btn--hide': !showGrid}]" @click="toggleGrid()">
        {{showGrid ? 'Hide Grid' : 'Show Grid'}} 
        <font-awesome-icon icon="th-large" />
      </button>
      <button :class="['btn', {'btn--hide': !showRuler}]" v-if="showGrid" @click="toggleRuler()">
        {{showRuler ? 'Hide Ruler' : 'Show Ruler'}} 
        <font-awesome-icon icon="ruler" />
      </button>
    </Tiles>
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
      newProjectName: '',
      showCopiedTip: false,
      showModal: false,
      importedProject: ''
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
    'isEraser',
    'save',
    'projectName'
  ]),
  mounted(){
    if(!this.updatedList || this.updatedList.length <= 0){
      this.setList();
    }
    this.bindKeyEvents();
    this.newProjectName = this.projectName;
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
      'setProjectName',
      'setList',
      'saveState',
      'import'
    ]),
    importProject() {
      this.import(this.importedProject)
    },
    setNewConfig() {
      this.setCanvasWidth(Number(this.newCanvasWidth))
      this.setCanvasHeight(Number(this.newCanvasHeight))
      this.setTileSize(Number(this.newTileSize))
      this.setProjectName(Number(this.newProjectName))
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
    copyContent(save){
      let textarea = this.$refs.buildTextarea;
      if(save) {
        textarea = this.$refs.saveTextarea;
      }
      textarea.select();
      document.execCommand("copy");
      this.showCopiedTip = true;
      setTimeout(() => {
        this.showCopiedTip = false;
      }, 3000);
    },
    bindKeyEvents() {
      document.addEventListener('keydown', (e) => {
        const key = e.ctrlKey;
        // focus palette
        if(key && e.key.toLowerCase() === 'p'){
          const palette = document.querySelector('#palette > li > button');
          palette.focus();
        }

        // color picker
        if(key && e.key.toLowerCase() === '1'){
          const colorPickerBtn = document.querySelector('#colorPicker');
          colorPickerBtn.click();
        }

        // eraser
        if(key && e.key.toLowerCase() === 'e'){
          this.eraser(true);
        }

        // pencil
        if(key && e.key.toLowerCase() === 'w'){
          this.eraser(false);
        }

        // zoom options
        if(key && e.key.toLowerCase() === '2'){
          const zoomBtn = document.querySelector('#zoom');
          zoomBtn.click();
        }

        //zoom in
        if(key && e.key.toLowerCase() === '='){
          const zoomBtn = document.querySelector('#zoom-in');
          zoomBtn.click();
        }

        //zoom out
        if(key && e.key.toLowerCase() === '-'){
          const zoomBtn = document.querySelector('#zoom-out');
          zoomBtn.click();
        }

        //zoom reset
        if(key && e.key.toLowerCase() === ']'){
          const zoomBtn = document.querySelector('#zoom-reset');
          zoomBtn.click();
        }

        // undo
        if(key && e.key.toLowerCase() === '3'){
          this.undo();
        }

        // clean
        if(key && e.key.toLowerCase() === '4'){
          const cleanBtn = document.querySelector('#clean');
          cleanBtn.click();
        }

        // settings
        if(key && e.key.toLowerCase() === '5'){
          const settingsBtn = document.querySelector('#settings');
          settingsBtn.click();
        }

        // save
        if(key && e.key.toLowerCase() === '6'){
          const saveBtn = document.querySelector('#save-btn');
          saveBtn.click();
        }

        // import
        if(key && e.key.toLowerCase() === '7'){
          const importBtn = document.querySelector('#import-btn');
          importBtn.click();
        }

        // build
        if(key && e.key.toLowerCase() === '8'){
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
    max-width: 200px;

    &.small-input{
      max-width: 50px;
    }
  }
}

.zoom-config{
  display: flex;
}
</style>
