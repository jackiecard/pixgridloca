<template>
  <ul class="color-palette">
    <li v-for="(tile, i) in paletteList" :key="i" :style="{backgroundColor: tile.value}" @click="pickedColor(tile)">
      {{tile.id}}
    </li>
  </ul>
</template>

<script>
export default {
  name: 'color-palette',
  props: {
    paletteList: {
      required: true,
      type: Array
    }
  },
  methods: {
    pickedColor(tile){
      console.log('colorpalette', tile)
      this.$emit('current-color', tile);
    }
  }
}
</script>

<style scoped>
.color-palette{
  display: flex;
}

.color-palette li{
  list-style-type: none;
  margin: 0;
  font-size: 8px;
  width: 30px;
  height: 30px;
  border: 1px solid #000;
}
</style>
