<template>
  <header>
    <div class="logo">
      <slot name="logo"/>
    </div>
  </header>
</template>

<script>
export default {
  name: 'Header'
}
</script>

<style lang="scss" scoped>
header{
  max-height: 60px;
  background-color: #272727;
  color: #dadada;
  padding: 10px 20px;
  text-align: left;
  
  .logo{
    font-weight: bold;
    font-family: 'Comfortaa', cursive;
    line-height: 30px;

    .svg-inline--fa{
      height: 20px;
      color: #ad6363;
      margin-bottom: -3px;
      padding-right: 10px;
    }
  }
}
</style>
