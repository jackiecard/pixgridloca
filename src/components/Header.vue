<template>
  <header>
    <div class="brand">
      <slot name="brand"/>
    </div>

    <div class="info">
      <slot name="info"/>
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
  position: relative;
  max-height: 60px;
  background-color: var(--primary-color);
  color: var(--first-layer-bg);
  padding: 10px 20px 5px;
  text-align: left;
  display: flex;
  justify-content: space-between;
  z-index: 1;
  
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

  .info{
    .btn{
      color: var(--first-layer-bg);

      .svg-inline--fa{
        height: 12px;
        margin-bottom: -1px;
      }
    }
  }

  .app-info{
    margin: 0;
    padding: 0;
  }
}
</style>
