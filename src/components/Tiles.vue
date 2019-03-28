<template>
  <ul :class="['tiles', {'tiles--grid' : showGrid}, {'tiles--ruler' : showRuler}]" :style="canvasStyle">
    <li v-for="(tile, i) in list" :key="i" 
      :style="{backgroundColor: tile.color}"
       @mousedown.prevent="clicked(tile.id)"
       @mouseup.prevent="release(tile.id)"
       @mouseover.prevent="over(tile.id)"
       :class="[{'first-row' : i < canvasWidth}, {'first-column' : i % canvasWidth === 0}]">
      <!-- <div>{{tile.id}}</div> -->
      <div class="tile__info">
        <div class="tile__info__x">{{tile.xs}}</div>
        <div class="tile__info__y">{{tile.ys}}</div> 
        <div class="tile__info__xy">0</div>
      </div>
    </li>
  </ul>
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
      clickedItemId: null
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
      this.$emit('update-tiles', { id: id });
      this.clickedItemId = id;
    },
    release(id){
      this.clickedItemId = null;
    },
    over(id){
      if(this.clickedItemId && this.clickedItemId !== id){
        this.$emit('update-tiles', { id: id });
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

  --border-color: rgba(0, 0, 0, 0.11);
  --border-size: 2px;

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

      &.first-row{
        position: relative;
        border-top: var(--border-size) dashed var(--border-color);

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
