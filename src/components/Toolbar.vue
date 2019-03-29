<template>
  <nav>
    <div class="palette">
      <slot name="palette"/>
    </div>
    <div class="control">
      <slot name="control"/>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Toolbar'
}
</script>

<style lang="scss">
nav{
  display: flex;

  .palette{
    display: flex;
  }
}
</style>
