<template>
  <ul :class="['tiles', {'tiles--grid' : showGrid}]" :style="canvasStyle">
    <li v-for="(tile, i) in list" :key="i" 
      :style="{backgroundColor: tile.color}"
       @mouseenter="paintThis(tile.id)"
       :class="{'first-row' : i < canvasWidth}">
      <!-- <div>{{tile.id}}</div> 
      <div>x: {{tile.xs}}</div>
      <div>y: {{tile.ys}}</div> -->
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
    paintThis(id){
      console.log('update-tiles', id)
      this.$emit('update-tiles', { id: id });
    }
  }
}
</script>

<style scoped>
.tiles{
  display: grid;
  margin: 0 auto;
  padding: 0;

  --border-color: rgba(0, 0, 0, 0.11);
  --border-size: 2px;
}

.tiles li{
  list-style-type: none;
  margin: 0;
  font-size: 8px;
}

.tiles.tiles--grid{
  border-left: var(--border-size) dashed var(--border-color);
}

.tiles.tiles--grid li{
  border-bottom: var(--border-size) dashed var(--border-color);
  border-right: var(--border-size) dashed var(--border-color);
}

.tiles.tiles--grid li.first-row{
  border-top: var(--border-size) dashed var(--border-color);
}
</style>
