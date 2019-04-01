<template>
  <nav>
    <div class="palette">
      <slot name="palette"/>
    </div>
    <div class="control">
      <slot name="control"/>
    </div>

    <div class="aside">
      <slot name="aside"/>
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
  padding: 10px 10px 5px;
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

  .control{
    margin-top: 1px;
    display: grid;
    grid-template-columns: repeat(5, 1fr);

    @media (min-width: 800px) {
      margin-top: -7px;
      grid-template-columns: repeat(10, 1fr);
    }
  }

  .aside{
    height: calc(100vh - 40px);
    position: absolute;
    width: 200px;
    top: 0;
    right: 0;
    background: #dadada;
    border: 1px solid #ccc;
    box-shadow: rgba(0, 0, 0, 0.3) 5px 5px 0px -2px, rgba(0, 0, 0, 0.25) 0px 0px 1px -1px;

    .layers{
      overflow-y: auto;
      overflow-x: hidden;
      height: calc(100% - 33px);

      &__tile{
        position: relative;
        max-width: 180px;
        overflow: hidden;
        margin: 10px;
        border: 1px solid #ccc;
        box-shadow: inset 2px 2px 0px rgba(0, 0, 0, 0.25);

        &--active{
          &:after{
            content: "";
            position: absolute;
            top: -2px;
            left: -2px;
            width: calc(100% + 2px);
            height: calc(100% + 2px);
            border: 2px solid #d67d7e;
          }
        }
      }

      &__control{
        display: flex;
      }
    }

    .set-layer-btn{
      padding: 10px;

      .svg-inline--fa{
        height: 15px;    
        padding: 0;
        margin-bottom: -3px;
      }

      span{
        padding: 10px;
      }
    }
  }
}
</style>
