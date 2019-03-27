<template>
  <ul class="tiles" :style="canvasStyle">
    <li v-for="(tile, i) in list" :key="i" :style="{backgroundColor: tile.color}" @click="paintThis(tile.id)">
      <div>{{tile.id}}</div> 
      <div>x: {{tile.xs}}</div>
      <div>y: {{tile.ys}}</div>
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
}

.tiles li{
  list-style-type: none;
  margin: 0;
  font-size: 8px;
  border: 1px solid #000;
}
</style>
