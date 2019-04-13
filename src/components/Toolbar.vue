<template>
  <nav>
    <div class="palette">
      <slot name="palette"/>
    </div>
    <div class="control">
      <slot name="control"/>
    </div>

    <div class="aside-wrapper">
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
  background-color: var(--first-layer-bg);    
  box-shadow: rgba(0, 0, 0, 0.25098039215686274) 3px 4px 0px -2px;
  padding: 10px 10px 5px;
  z-index: 2;

  .palette{
    position: relative;
    display: flex;

    @media (min-width: 800px) {
      margin: inherit;
    }

    &__info{
      margin-top: 1px;
      height: 53px;

      .btn{
        position: relative;
        height: 100%;
        padding: 5px;
        min-width: auto;

        .hide{
          font-size: 0;
        }

        &.add{
          width: calc(100% - 10px);
        }
      }

      &__control{
        display: flex;
        justify-content: flex-end;
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

    .btn.zoom{
      margin: auto;
    }
  }

  .aside{
    height: calc(100vh - 90px);
    position: absolute;
    width: 200px;
    top: 0;
    right: 0;
    background: var(--first-layer-bg);
    border: 1px solid var(--border-color-light);
    box-shadow: rgba(0, 0, 0, 0.3) 5px 5px 0px -2px, rgba(0, 0, 0, 0.25) 0px 0px 1px -1px;    
    z-index: 4;
    display: none;

    @media (min-width: 800px) {
      display: block;
      top: 71px;
      height: calc(100vh - 120px);
    }

    @media (min-width: 1114px) {
      top: 0;
      height: calc(100vh - 40px);
    }

    &--show{
      display: block;
    }

    .frames{
      overflow-y: auto;
      overflow-x: hidden;
      height: calc(100% - 60px);

      &__item{
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        padding: 10px 0;

        &:last-child { 
          border: 0;
        }
      }

      &__tile{
        position: relative;
        max-width: 180px;
        overflow: hidden;
        margin: 10px;
        border: 1px solid var(--border-color-light);
        box-shadow: inset 2px 2px 0px rgba(0, 0, 0, 0.25);

        &--active{
          outline: 2px solid var(--brand-color);
        }
      }

      &__control{
        display: flex;
        justify-content: center;

        .btn{
          min-height: 20px;
        }
      }

      &__name{
        margin: 0 10px;
        display: flex;
        justify-content: center;

        span,
        input{
          font-size: 12px;
          text-align: center;
          height: 22px;
        }

        span:hover{
          cursor: pointer;
        }

        input{
          background: var(--first-layer-bg);
          border: 1px solid var(--border-color-light);
          box-shadow: inset 2px 2px 0px rgba(0, 0, 0, 0.25);
          width: 90%;
          line-height: 22px;
        }

        .btn{
          margin: 1px 0;
          background-color: var(--first-layer-bg);

          .svg-inline--fa{
            height: 10px;    
            padding: 0;
          }
        }
      }
    }
  }

  .set-frame-btn{
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
</style>
