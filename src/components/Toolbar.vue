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
  flex-wrap: wrap;
  position: sticky;
  top: 0;
  background-color: #dadada;    
  box-shadow: rgba(0, 0, 0, 0.25098039215686274) 3px 4px 0px -2px;
  padding: 10px;
  z-index: 2;

  .palette{
    position: relative;
    display: flex;
    margin: auto;

    @media (min-width: 800px) {
      margin: inherit;
    }

    &__info{
      margin-top: 1px;
      height: 63px;

      .btn{
        position: relative;
        height: 100%;
        padding: 5px;
        min-width: auto;

        .tip{
          position: absolute;
          top: 2px;
          right: 5px;
          font-size: 8px;

          .svg-inline--fa{
            height: 8px;
            padding: 0;
          }
        }

        .hide{
          font-size: 0;
        }
      }
    }
  }

  &:after{
    content: '';
    position: absolute;
    right: 5px;
    bottom: 10px;
    width: 0;
    height: 0;
    border-top: 4px solid transparent;
    border-left: 4px solid #000000b5;
    border-bottom: 4px solid transparent;
  }

  @media (min-width: 800px) {
    &:after{
      display: none;
    }
  }

  .control{
    margin-top: 1px;
    display: flex;
    overflow-y: scroll;
    padding-top: 10px;

    @media (min-width: 800px) {
      overflow-y: inherit;
      padding-top: 0;
    }
  }
}
</style>
