<template>
  <ul class="color-palette">
    <div class="color-palette__bg">
      <div class="color-palette__bg__tile" v-for="i in 30" :key="i"></div>
    </div>
    <li v-for="(tile, i) in paletteList" :key="i" :style="{backgroundColor: tile.value}" @click="pickedColor(tile)">
      <!-- {{tile}} -->
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
      this.$emit('current-color', tile);
    }
  }
}
</script>

<style lang="scss" scoped>
.color-palette{
  position: relative;
  display: grid;
  grid-template-columns: repeat(40, 30px);
  grid-template-rows: repeat(2, 30px);
  margin: 0;
  padding: 0;    
  height: 74px;
  max-width: 457px;
  overflow-y: auto;

  &__bg{
    max-width: 800px;
    position: absolute;
    display: grid;
    grid-template-columns: repeat(15, 30px);
    grid-template-rows: repeat(2, 30px);
    z-index: 0;

    &__tile{
      width: 30px;
      height: 30px;
      border: 1px solid rgb(174, 174, 174);
    }
  }
}

.color-palette li{
  position: relative;
  z-index: 1;
  list-style-type: none;
  margin: 0;
  font-size: 8px;
  width: 30px;
  height: 30px;
  border: 1px solid #000;
}
</style>
