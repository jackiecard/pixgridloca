<template>
  <ul class="color-palette">
    <div class="color-palette__bg">
      <div class="color-palette__bg__tile" v-for="i in 32" :key="i"></div>
    </div>
    <li v-for="(tile, i) in paletteList" :key="i" @click="pickedColor(tile)">
      <button :style="{backgroundColor: tile}">
      </button>
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
  --square-size: 25px;
  --li-size: 23px;

  position: relative;
  display: grid;
  grid-template-columns: repeat(8, var(--square-size));
  grid-template-rows: repeat(2, var(--square-size));
  margin: 0;
  padding: 0 2px 0 0;
  max-width: 482px;
  overflow: hidden;

  @media (min-width: 800px) {
    grid-template-columns: repeat(16, var(--square-size));
    grid-template-rows: repeat(2, var(--square-size));
  }

  &__bg{
    max-width: 800px;
    position: absolute;
    display: grid;
    grid-template-columns: repeat(8, var(--square-size));
    grid-template-rows: repeat(2, var(--square-size));
    z-index: 0;


    @media (min-width: 800px) {
      grid-template-columns: repeat(16, var(--square-size));
      grid-template-rows: repeat(2, var(--square-size));
    }

    &__tile{
      width: var(--square-size);
      height: var(--square-size);
      border: 1px solid var(--border-color);
    }
  }
}

.color-palette li{
  position: relative;
  z-index: 1;
  list-style-type: none;
  margin: 2px 0 0 2px;
  font-size: 8px;
  width: var(--li-size);
  height: var(--li-size);
  padding: 0;

  button{
    cursor: pointer;
    width: 100%;
    height: 100%;
    border: 0;
    margin: 0;
    padding: 0;

    span{
      font-size: 0;
    }
  }
}
</style>
