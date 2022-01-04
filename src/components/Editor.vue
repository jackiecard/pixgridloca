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
                <div class="palette__info__control">
                  <button
                    @click="newPallete"
                    class="btn btn--a11y btn--small-icons">{{$t('pallete.new')}} <font-awesome-icon icon="file" /></button>
                  <button
                    @click.prevent="exportPallete"
                    class="btn btn--a11y btn--small-icons">{{$t('pallete.eport')}} <font-awesome-icon icon="save" /></button>
                  <button
                    @click="showImportPaletteView = true"
                    class="btn btn--a11y btn--small-icons">{{$t('pallete.import')}} <font-awesome-icon icon="upload" /></button>
                </div>
                <sketch-picker v-model="newColor" 
                  :presetColors="paletteList"/>
                <button class="btn btn--primary add" @click="setColor(newColor.hex8)">{{$t('pallete.addColor')}}</button>
            </div>
            <button slot="reference" class="btn btn--control" id="colorPicker">
              <span class="hide">{{$t('pallete.addColor')}}</span> 
              <font-awesome-icon icon="plus" />
              <div :class="['current-color', {'current-color--bounce': bouncePickedColor}]" :style="{backgroundColor: currentColor}">
                <span class="current-color__doubled">{{$t('pallete.warning')}}</span>
              </div>
            </button>
          </popper>
        </div>

        <modal v-if="exportedPallete !== ''" 
          @accept="exportedPallete = ''"
          :center=true>
          <h3 slot="header">{{$t('pallete.exportedTitle')}}</h3>
          <div slot="body">
            <textarea class="generated-art-field" 
              @click="copyContent('palleteTextarea')" 
              id="palleteTextarea">{{this.exportedPallete}}</textarea>
            <div :class="['generated-art-field__copy', {'generated-art-field__copy--show': showCopiedTip}]">{{$t('messages.copied')}}</div>
          </div>
        </modal>
        <modal v-if="showImportPaletteView" 
          @quit="showImportPaletteView = false" 
          @accept="showImportPaletteView = false, importPalette(importedPalette)"
          :center=true>
          <h3 slot="header">{{$t('pallete.importTitle')}}</h3>
          <div slot="body">
            <div v-html="$t('pallete.importBody')"></div>
            <textarea class="generated-art-field" 
              v-model="importedPalette"></textarea>
          </div>
        </modal>

      </template>

      <template slot="control">
        <button :class="['btn btn--control', {'btn--active': isEraser}]" @click="eraser(true)">
          {{$t('toolbar.eraser')}} <font-awesome-icon :icon="$t('icon.eraser')" />
          
        </button>
        <button :class="['btn btn--control', {'btn--active': !isEraser}]" @click="eraser(false)">
          {{$t('toolbar.pencil')}} <font-awesome-icon icon="pen" />
        </button>


        <button class="btn btn--control" @click="undo(), toggleUndo()">
          {{undoOn ? $t('toolbar.redo') : $t('toolbar.undo') }} <font-awesome-icon :icon="undoOn ? 'redo' : 'undo'" />
        </button>
        
        <button class="btn btn--control" @click="setFrameGrid({ clean: true })" id="clean">
           {{$t('toolbar.clean')}} <font-awesome-icon icon="brush" />
        </button>

        <popper
            trigger="click"
            :options="{ placement: 'bottom' }">
            <div class="popper">
              <div class="zoom-config">
                <button :class="['btn btn--control', {'btn--disabled': zoom === 8}]" 
                  @click="zoomIn()"
                  id="zoom-in">
                  {{$t('toolbar.zoomIn')}}
                  <font-awesome-icon icon="search-plus" />
                  
                </button>
                <button :class="['btn btn--control', {'btn--disabled': zoom === 1/ this.tileSize}]" 
                  @click="zoomOut()"
                  id="zoom-out">
                  {{$t('toolbar.zoomOut')}}
                  <font-awesome-icon icon="search-minus" />
                  
                </button>
                <button class="btn btn--control" 
                  @click="zoomReset()"
                  id="zoom-reset">
                  {{$t('toolbar.zoomReset')}}
                  <font-awesome-icon icon="search" />
                  
                </button>
              </div>
              <div>{{$t('toolbar.zoom')}} {{zoom*100}}%</div>
            </div>
            <button slot="reference" class="btn btn--control zoom" id="zoom">
               {{$t('toolbar.zoom')}} <font-awesome-icon icon="search" />
            </button>
        </popper> 

        <button class="btn btn--control" @click="showNewProject = true" id="clean">
           {{$t('toolbar.new')}} <font-awesome-icon icon="file" />
        </button>

        <modal v-if="showNewProject" 
          @quit="showNewProject = false" 
          @accept="showNewProject = false, setNewConfig()"
          :center=true>
          <h3 slot="header">{{$t('project.new')}}</h3>
          <div slot="body">
            <div class="settings">
              <label for="project-name">{{$t('project.name')}}</label>
              <input type="text" v-model="newProjectName" placeholder="Project Name" name="project-name"/>
              <label for="canvas-width">{{$t('project.width')}}</label>
              <input type="number" min="4" max="300" v-model="newCanvasWidth" placeholder="Canvas Width" name="canvas-width" class="small-input"/>
              <label for="canvas-height">{{$t('project.height')}}</label>
              <input type="number" min="4" max="300" v-model="newCanvasHeight" placeholder="Canvas Height" name="canvas-height" class="small-input"/>
              <label for="tile-size">{{$t('project.size')}}</label>
              <input  type="number" min="1" max="100" v-model="newTileSize" placeholder="Tile Size" name="tile-size" class="small-input"/>
            </div>
          </div>
        </modal>

        <popper
            trigger="click"
            :options="{ placement: 'bottom' }">
            <div class="popper">
              <div class="save-settings">
                <h3>{{$t('saveIt')}}</h3>
                <textarea class="generated-art-field" 
                  v-if="save" 
                  @click="copyContent('saveTextarea')" 
                  id="saveTextarea">{{this.save}}</textarea>
                <div :class="['generated-art-field__copy', {'generated-art-field__copy--show': showCopiedTip}]">{{$t('messages.copied')}}</div>
              </div>
            </div>
            <button slot="reference" class="btn btn--control" @click="saveState()" id="save-btn">
               {{$t('toolbar.save')}} <font-awesome-icon icon="save" />
            </button>
        </popper> 


        <popper
            trigger="click"
            :options="{ placement: 'bottom' }">
            <div class="popper">
              <div class="save-settings">
                <h3>{{$t('importProject')}}</h3>
                <textarea class="generated-art-field" 
                  v-model="importedProject"></textarea>
              </div>
              <button class="btn btn--primary" @click="importProject">{{$t('buttons.accept')}}</button>
            </div>
            <button slot="reference" class="btn btn--control" id="import-btn">
               {{$t('toolbar.import')}} <font-awesome-icon icon="upload" />
              
            </button>
        </popper> 

        <popper
            trigger="click"
            :options="{ placement: 'top' }">
            <div class="popper">
              <h3>Make it HTML</h3>
              <textarea class="generated-art-field" 
                v-if="spritesCode" 
                @click="copyContent('buildTextarea')" 
                id="buildTextarea">{{this.spritesCode.trim()}}</textarea>
              <div :class="['generated-art-field__copy', {'generated-art-field__copy--show': showCopiedTip}]">{{$t('messages.copied')}}</div>
            </div>
            <button slot="reference" class="btn btn--control" @click="generateSprite()" id="export">
               {{$t('toolbar.make')}} <font-awesome-icon icon="plus-circle" />
            </button>
        </popper>


        <popper
            trigger="click"
            :options="{ placement: 'bottom' }">
            <div class="popper">
              <div class="settings">
                <label for="project-name">{{$t('project.name')}}</label>
                <input type="text" v-model="newProjectName" placeholder="Project Name" name="project-name"/>
                <label for="tile-size">{{$t('project.size')}}</label>
                <input type="text" v-model="newTileSize" placeholder="Tile Size" name="tile-size" class="small-input"/>
              </div>
              <button class="btn btn--primary" @click="updateProjectSettings">{{$t('buttons.accept')}}</button>
            </div>
            <button slot="reference" class="btn btn--control" id="settings">
               {{$t('toolbar.settings')}} <font-awesome-icon icon="cog" />
            </button>
        </popper>

      </template>

      <template slot="aside">
        <div :class="['aside', {'aside--show': showFrames}]"> 
          <div class="frames">
            <div v-for="(draw,i) in this.frames" :key="i" class="frames__item">
              <div :class="['frames__tile tile-background', {'frames__tile--active': itemIsUpdating === draw.id}]">
                <span v-if="draw.codeForView" v-html="draw.codeForView"></span>
              </div>
              <div class="frames__name">
                <span v-if="updatingId !== draw.id" @click="updatingId = draw.id">{{draw.name}}</span>
                <input v-if="updatingId === draw.id" type="text" v-model="newFrameName" placeholder="Frame Name" name="frame-name"/>
                <button v-if="updatingId === draw.id" 
                  class="btn btn--primary" 
                  @click="updateThisName({ id: draw.id, name: newFrameName }), updatingId = null">
                  <font-awesome-icon icon="check" />
                </button>
              </div>
              <div class="frames__control">
                <button class="btn btn--a11y btn--control" 
                  v-if="itemIsUpdating === draw.id" 
                  @click="updateFrame({ id: draw.id }), itemIsUpdating = null">
                  {{$t('frame.save')}}
                  <font-awesome-icon icon="check" />
                </button>
                <button class="btn btn--a11y btn--control" 
                  v-if="!itemIsUpdating" 
                  @click="setFrameGrid({ list: draw.canvas }), itemIsUpdating = draw.id">
                  {{$t('frame.edit')}}
                  <font-awesome-icon icon="edit" />
                </button>
                <button class="btn btn--a11y btn--control" 
                  @click="removeFrame({ id: draw.id })">
                  {{$t('frame.remove')}}
                  <font-awesome-icon icon="trash-alt" />
                </button>

                <popper
                  trigger="click"
                  :options="{ placement: 'left' }">
                    <div class="popper">
                      <h3>{{$t('frame.spriteCode')}}</h3>
                      <textarea class="generated-art-field" 
                        v-if="draw.code" 
                        @click="copyContent('singleSpriteTextarea')" 
                        id="singleSpriteTextarea">{{draw.code.trim()}}</textarea>
                      <div :class="['generated-art-field__copy', {'generated-art-field__copy--show': showCopiedTip}]">{{$t('messages.copied')}}</div>
                    </div>
                    <button slot="reference" class="btn btn--a11y btn--control">
                      {{$t('pallete.export')}}
                      <font-awesome-icon icon="file-download" />
                    </button>
                </popper> 
              </div>
            </div>
          </div>
          <button class="btn set-frame-btn" @click="setFrames" id="add-frame"><font-awesome-icon icon="plus" /> <span>{{$t('frame.addFrame')}}</span></button>
        </div>
      </template>
    </Toolbar>

    <Tiles :list="frameGrid" 
           :canvas-width="canvasWidth" 
           :canvas-height="canvasHeight" 
           :tile-size="tileSize * zoom" 
           :show-grid="showGrid"
           :show-ruler="showRuler"
           @update-tiles="updateTile">
      <button :class="['btn', {'btn--hide': !showGrid}]" @click="toggleGrid()">
        {{showGrid ? 'Hide Grid' : 'Show Grid'}} 
        <font-awesome-icon icon="th-large" />
      </button>
      <button :class="['btn', {'btn--hide': !showRuler}]" v-if="showGrid" @click="toggleRuler()">
        {{showRuler ? 'Hide Ruler' : 'Show Ruler'}} 
        <font-awesome-icon icon="ruler" />
      </button>
    </Tiles>

    <button class="btn btn--secondary mobile-frame-btn" @click="toggleFrames">
      <font-awesome-icon :icon="showFrames ? 'minus': 'plus'" /> 
      <span>{{this.showFrames ? 'Hide Frames': 'Show Frames'}}</span>
    </button>

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
      showWarningModal: false,
      importedProject: '',
      itemIsUpdating: null,
      undoOn: false,
      updatingId: null,
      newFrameName: '',
      showFrames: false,
      showImportPaletteView: false,
      importedPalette: '',
      showNewProject: false,
      exportedPallete: ''
    }
  },
  computed: mapGetters([
    'frameGrid',
    'canvasWidth',
    'canvasHeight',
    'showGrid',
    'showRuler',
    'zoom',
    'tileSize',
    'paletteList',
    'currentColor',
    'spriteCode',
    'bouncePickedColor',
    'isEraser',
    'save',
    'projectName',
    'frames',
    'spritesCode',
    'exportedSingleSprite'
  ]),
  mounted(){
    if(!this.frameGrid || this.frameGrid.length <= 0){
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
      'setFrameGrid', 
      'updateListItem',
      'toggleGrid', 
      'toggleRuler',
      'zoomIn',
      'zoomOut',
      'zoomReset',
      'addColor',
      'pickedColor',
      'newPallete',
      'generateArt',
      'eraser',
      'undo',
      'setCanvasWidth',
      'setCanvasHeight',
      'setTileSize',
      'setProjectName',
      'setList',
      'saveState',
      'import',
      'setFrames',
      'generateSprite',
      'updateFrame',
      'removeFrame',
      'updateFrameName',
      'importPalette'
    ]),
    updateProjectSettings() {
      this.setProjectName(this.newProjectName)
      this.setTileSize(Number(this.newTileSize))
    },
    importProject() {
      this.import(this.importedProject)
    },
    setNewConfig() {
      this.setCanvasWidth(Number(this.newCanvasWidth))
      this.setCanvasHeight(Number(this.newCanvasHeight))
      this.setTileSize(Number(this.newTileSize))
      this.setProjectName(this.newProjectName)
      this.setList()
    },
    updateTile(e) {
      this.updateListItem({ id: e.id, first: false, pressed: e.pressed });
    },
    setColor(color) {
      this.addColor(color);
      this.newColor = "";
    },
    exportPallete() {
      this.exportedPallete = this.paletteList.join('\n');
    },
    copyContent(field) {
      const textarea = document.querySelector('#' + field);
      textarea.select();
      document.execCommand("copy");
      this.showCopiedTip = true;
      setTimeout(() => {
        this.showCopiedTip = false;
      }, 3000);
    },
    toggleUndo() {
      this.undoOn = !this.undoOn;
    },
    updateThisName(obj) {
      if(obj.name !== '') {
        this.updateFrameName(obj);
        this.newFrameName = '';
      }
    },
    toggleFrames() {
      this.showFrames = !this.showFrames;
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
        if(key && e.key.toLowerCase() === 'z'){
          this.undoOn = !this.undoOn
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

        // add frame
        if(key && e.key.toLowerCase() === '0'){
          const exportBtn = document.querySelector('#add-frame');
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
  border: 1px solid var(--border-color);
  width: 18px;
  height: 18px;
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
    color: var(--light-color);
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
  margin: 5px;   
  padding: 6px 15px;

  &--active{
    &:before{
      content: "";
      position: absolute;
      bottom: 5px;
      right: 6px;
      background-color: var(--brand-color);
      width: 6px;
      height: 6px;
      border-radius: 50%;

      @media (min-width: 800px) {
        bottom: 20px;
      }
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

  &--small-icons{
    .svg-inline--fa{
      height: 10px;
      padding: 3px 0;
    }
  }

  &--primary{
    background-color: rgba(255, 255, 255, 0.45098039215686275);
    min-height: auto;
  }

  &--secondary{
    background-color: transparent;
    min-height: auto;
    background-color: var(--primary-color);
    color: var(--light-color);
    border-color: transparent;
  }

  &--control{
    font-size: 9px;
    position: relative;
    height: 100%;
    min-width: 40px;
    min-height: 40px;
    margin-right: 10px;
    margin: 0;   
    padding: 0 5px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .svg-inline--fa{
      height: 15px;
      padding: 3px 0;
    }
  }

  &--a11y{
    background-color: rgba(255, 255, 255, 0.45098039215686275);
    font-size: 0;
  }
}

.editor .vc-sketch{
  box-shadow: none;
  padding-top: 0;
  background-color: var(--second-layer-bg);
}

.popper{
  box-shadow: rgb(138, 138, 138) 7px 7px 0px -4px;
  border-radius: 0;
  background-color: var(--second-layer-bg);
  border-color: var(--second-layer-bg);
}

.generated-art-field{
  width: 300px;
  min-height: 100px;
  max-height: 200px;
  resize: none;
  background-color: var(--primary-color);
  color: var(--first-layer-bg);
  font-size: 12px;

  &__copy{
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

.tile-background{
  position: relative;

  &:after{
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    pointer-events: none;
    background-image: url('https://i.imgur.com/FerC2T4.png');
    opacity: .1;
  }
}

.mobile-frame-btn{
  position: fixed;
  bottom: 0;
  right: 0;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: rgba(0, 0, 0, 0.3) 5px 5px 0px -2px, rgba(0, 0, 0, 0.25) 0px 0px 1px -1px;    
  padding: 5px;
  z-index: 5;

  @media (min-width: 800px) {
    display: none;
  }
}
</style>
