<template>
  <div class="tiles-wrapper">
    <ul :class="['tiles', {'tiles--grid' : showGrid}, {'tiles--ruler' : showRuler}]" :style="canvasStyle">
      <li v-for="(tile, i) in list" :key="i" 
        :style="{backgroundColor: tile.color}"
        @mousedown.prevent="clicked(tile.id)"
        @mouseup.prevent="release(tile.id)"
        @mouseover.prevent="over(tile.id)"
        :class="[{'first-row' : i < canvasWidth}, {'first-column' : i % canvasWidth === 0}]">
        <div class="tile__info">
          <div class="tile__info__x">{{tile.xs + 1}}</div>
          <div class="tile__info__y">{{tile.ys + 1}}</div> 
          <div class="tile__info__xy">1</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Tiles',
  props: {
    list: {
      required: true,
      type: Array
    },
    tileSize: {
      required: true,
      type: Number
    },
    canvasWidth: {
      required: false,
      type: Number
    },
    canvasHeight: {
      required: false,
      type: Number
    },
    showGrid: {
      required: false,
      type: Boolean
    },
    showRuler: {
      required: false,
      type: Boolean
    }
  },
  data(){
    return {
      pressedItemId: null
    }
  },
  computed: {
    canvasStyle(){
      return [
        {'grid-template-columns': `repeat(${this.canvasWidth}, ${this.tileSize}px)`},
        {'grid-template-rows': `repeat(${this.canvasHeight}, ${this.tileSize}px)`}
      ]
    },
  },
  methods: {
    clicked(id){
      this.$emit('update-tiles', { id: id, pressed: false });
      this.pressedItemId = id;
    },
    release(id){
      this.pressedItemId = null;
    },
    over(id){
      if(this.pressedItemId && this.pressedItemId !== id){
        this.$emit('update-tiles', { id: id, pressed: true });
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.tiles{
  display: grid;
  margin: 30px;
  padding: 0;

  --border-color: rgba(0, 0, 0, 0.1);
  --border-color-light: rgba(255, 255, 255, 0.1);
  --border-size: 2px;

  &-wrapper{
    width: 85%;
    background-color: #dadada;
    overflow-x: auto;
  }

  li{
    list-style-type: none;
    margin: 0;
    font-size: 8px;

    .tile__info{
      text-align: left;
      display: none;
    }
  }

  &--grid{
    border-left: var(--border-size) dashed var(--border-color);
    position: relative;
    &:before{
      content: "";
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      border-left: var(--border-size) dashed var(--border-color-light);
    }

    &.tiles--ruler{
      li{
        &.first-row,
        &.first-column{
          .tile__info{
            display: block;
          }
        }
      }
    }

    li{
      border-bottom: var(--border-size) dashed var(--border-color);
      border-right: var(--border-size) dashed var(--border-color);

      position: relative;
      &:before{
        content: "";
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        border-bottom: var(--border-size) dashed var(--border-color-light);
        border-right: var(--border-size) dashed var(--border-color-light);
      }

      &.first-row{
        position: relative;
        border-top: var(--border-size) dashed var(--border-color);
        position: relative;

        .tile__info{
          position: absolute;    
          top: -15px;

          &__y,
          &__xy{
            display: none;
          }
        }
      }

      &.first-column{
        position: relative;

        .tile__info{
          position: absolute;
          left: -15px;

          &__x,
          &__xy{
            display: none;
          }
        }

        &.first-row{
          .tile__info{
            &__xy{
              display: block;
            }
          }
        }
      }
    }
  }
}
</style>
