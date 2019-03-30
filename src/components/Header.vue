<template>
  <header>
    <div class="brand">
      <slot name="brand"/>
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
  padding: 15px 20px;
  text-align: left;
  
  .brand{
    display: flex;
    font-weight: bold;
    line-height: 30px;

    &__logo{
      padding-right: 10px;
    }

    span{
      line-height: 20px;

      sup{
        font-weight: 100;
        font-size: .5%;
      }
    }
  }
}
</style>
