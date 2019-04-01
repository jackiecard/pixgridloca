<template>
  <div id="app">
    <Header>
      <template slot="brand">
        <div class="brand__logo">
          <div class="art" style="display: grid; grid-template-columns: repeat(11, 2px); grid-template-rows: repeat(10, 2px);"> <div class="pixel" id="p2" style="background-color: #D67D7D; grid-area: 1 / 3 / 2 / 4"></div><div class="pixel" id="p3" style="background-color: #D67D7D; grid-area: 1 / 4 / 2 / 5"></div><div class="pixel" id="p7" style="background-color: #D67D7D; grid-area: 1 / 8 / 2 / 9"></div><div class="pixel" id="p8" style="background-color: #D67D7D; grid-area: 1 / 9 / 2 / 10"></div><div class="pixel" id="p12" style="background-color: #D67D7D; grid-area: 2 / 2 / 3 / 3"></div><div class="pixel" id="p13" style="background-color: #D67D7D; grid-area: 2 / 3 / 3 / 4"></div><div class="pixel" id="p14" style="background-color: #D67D7D; grid-area: 2 / 4 / 3 / 5"></div><div class="pixel" id="p15" style="background-color: #D67D7D; grid-area: 2 / 5 / 3 / 6"></div><div class="pixel" id="p17" style="background-color: #D67D7D; grid-area: 2 / 7 / 3 / 8"></div><div class="pixel" id="p18" style="background-color: #D67D7D; grid-area: 2 / 8 / 3 / 9"></div><div class="pixel" id="p19" style="background-color: #D67D7D; grid-area: 2 / 9 / 3 / 10"></div><div class="pixel" id="p20" style="background-color: #D67D7D; grid-area: 2 / 10 / 3 / 11"></div><div class="pixel" id="p22" style="background-color: #D67D7D; grid-area: 3 / 1 / 4 / 2"></div><div class="pixel" id="p23" style="background-color: #D67D7D; grid-area: 3 / 2 / 4 / 3"></div><div class="pixel" id="p24" style="background-color: #D67D7D; grid-area: 3 / 3 / 4 / 4"></div><div class="pixel" id="p25" style="background-color: #D67D7D; grid-area: 3 / 4 / 4 / 5"></div><div class="pixel" id="p26" style="background-color: #D67D7D; grid-area: 3 / 5 / 4 / 6"></div><div class="pixel" id="p27" style="background-color: #D67D7D; grid-area: 3 / 6 / 4 / 7"></div><div class="pixel" id="p28" style="background-color: #D67D7D; grid-area: 3 / 7 / 4 / 8"></div><div class="pixel" id="p29" style="background-color: #D67D7D; grid-area: 3 / 8 / 4 / 9"></div><div class="pixel" id="p30" style="background-color: #D67D7D; grid-area: 3 / 9 / 4 / 10"></div><div class="pixel" id="p31" style="background-color: #D67D7D; grid-area: 3 / 10 / 4 / 11"></div><div class="pixel" id="p32" style="background-color: #D67D7D; grid-area: 3 / 11 / 4 / 12"></div><div class="pixel" id="p33" style="background-color: #D67D7D; grid-area: 4 / 1 / 5 / 2"></div><div class="pixel" id="p34" style="background-color: #D67D7D; grid-area: 4 / 2 / 5 / 3"></div><div class="pixel" id="p35" style="background-color: #D67D7D; grid-area: 4 / 3 / 5 / 4"></div><div class="pixel" id="p36" style="background-color: #D67D7D; grid-area: 4 / 4 / 5 / 5"></div><div class="pixel" id="p37" style="background-color: #D67D7D; grid-area: 4 / 5 / 5 / 6"></div><div class="pixel" id="p38" style="background-color: #D67D7D; grid-area: 4 / 6 / 5 / 7"></div><div class="pixel" id="p39" style="background-color: #D67D7D; grid-area: 4 / 7 / 5 / 8"></div><div class="pixel" id="p40" style="background-color: #D67D7D; grid-area: 4 / 8 / 5 / 9"></div><div class="pixel" id="p41" style="background-color: #D67D7D; grid-area: 4 / 9 / 5 / 10"></div><div class="pixel" id="p42" style="background-color: #D67D7D; grid-area: 4 / 10 / 5 / 11"></div><div class="pixel" id="p43" style="background-color: #D67D7D; grid-area: 4 / 11 / 5 / 12"></div><div class="pixel" id="p44" style="background-color: #D67D7D; grid-area: 5 / 1 / 6 / 2"></div><div class="pixel" id="p45" style="background-color: #D67D7D; grid-area: 5 / 2 / 6 / 3"></div><div class="pixel" id="p46" style="background-color: #D67D7D; grid-area: 5 / 3 / 6 / 4"></div><div class="pixel" id="p47" style="background-color: #D67D7D; grid-area: 5 / 4 / 6 / 5"></div><div class="pixel" id="p48" style="background-color: #D67D7D; grid-area: 5 / 5 / 6 / 6"></div><div class="pixel" id="p49" style="background-color: #D67D7D; grid-area: 5 / 6 / 6 / 7"></div><div class="pixel" id="p50" style="background-color: #D67D7D; grid-area: 5 / 7 / 6 / 8"></div><div class="pixel" id="p51" style="background-color: #D67D7D; grid-area: 5 / 8 / 6 / 9"></div><div class="pixel" id="p52" style="background-color: #D67D7D; grid-area: 5 / 9 / 6 / 10"></div><div class="pixel" id="p53" style="background-color: #D67D7D; grid-area: 5 / 10 / 6 / 11"></div><div class="pixel" id="p54" style="background-color: #D67D7D; grid-area: 5 / 11 / 6 / 12"></div><div class="pixel" id="p56" style="background-color: #D67D7D; grid-area: 6 / 2 / 7 / 3"></div><div class="pixel" id="p57" style="background-color: #D67D7D; grid-area: 6 / 3 / 7 / 4"></div><div class="pixel" id="p58" style="background-color: #D67D7D; grid-area: 6 / 4 / 7 / 5"></div><div class="pixel" id="p59" style="background-color: #D67D7D; grid-area: 6 / 5 / 7 / 6"></div><div class="pixel" id="p60" style="background-color: #D67D7D; grid-area: 6 / 6 / 7 / 7"></div><div class="pixel" id="p61" style="background-color: #D67D7D; grid-area: 6 / 7 / 7 / 8"></div><div class="pixel" id="p62" style="background-color: #D67D7D; grid-area: 6 / 8 / 7 / 9"></div><div class="pixel" id="p63" style="background-color: #D67D7D; grid-area: 6 / 9 / 7 / 10"></div><div class="pixel" id="p64" style="background-color: #D67D7D; grid-area: 6 / 10 / 7 / 11"></div><div class="pixel" id="p68" style="background-color: #D67D7D; grid-area: 7 / 3 / 8 / 4"></div><div class="pixel" id="p69" style="background-color: #D67D7D; grid-area: 7 / 4 / 8 / 5"></div><div class="pixel" id="p70" style="background-color: #D67D7D; grid-area: 7 / 5 / 8 / 6"></div><div class="pixel" id="p71" style="background-color: #D67D7D; grid-area: 7 / 6 / 8 / 7"></div><div class="pixel" id="p72" style="background-color: #D67D7D; grid-area: 7 / 7 / 8 / 8"></div><div class="pixel" id="p73" style="background-color: #D67D7D; grid-area: 7 / 8 / 8 / 9"></div><div class="pixel" id="p74" style="background-color: #D67D7D; grid-area: 7 / 9 / 8 / 10"></div><div class="pixel" id="p80" style="background-color: #D67D7D; grid-area: 8 / 4 / 9 / 5"></div><div class="pixel" id="p81" style="background-color: #D67D7D; grid-area: 8 / 5 / 9 / 6"></div><div class="pixel" id="p82" style="background-color: #D67D7D; grid-area: 8 / 6 / 9 / 7"></div><div class="pixel" id="p83" style="background-color: #D67D7D; grid-area: 8 / 7 / 9 / 8"></div><div class="pixel" id="p84" style="background-color: #D67D7D; grid-area: 8 / 8 / 9 / 9"></div><div class="pixel" id="p92" style="background-color: #D67D7D; grid-area: 9 / 5 / 10 / 6"></div><div class="pixel" id="p93" style="background-color: #D67D7D; grid-area: 9 / 6 / 10 / 7"></div><div class="pixel" id="p94" style="background-color: #D67D7D; grid-area: 9 / 7 / 10 / 8"></div><div class="pixel" id="p104" style="background-color: #D67D7D; grid-area: 10 / 6 / 11 / 7"></div> </div> 
        </div>
        <span>PixGrid Editor <sup>Beta</sup></span>
      </template>
      <template slot="info">
        <button class="btn app-info" @click="showModal = true">
          <font-awesome-icon icon="question" />
        </button>

        <modal v-if="showModal">
          <h3 slot="header">What is this place?</h3>
          <div slot="body">
            <p>PixGrid is a pixel art editor that uses <strong>CSS Grid Layout</strong> to build HTML markup. </p>
            <p>These code can be pasted in any website or platform that accepts <strong>HTML</strong> and supports Grid Layout.</p>
            <p>It was created and it's mantained by <a href="https://github.com/jackiecard" title="github page">jackiecard</a>.</p>

            <h3>List of shortcuts</h3>
            <ul class="shortcuts-list">
              <li v-for="(item, i) in shortcuts" :key="i" class="shortcuts-list__item">
                <font-awesome-icon :icon="item.icon" />
                <span>{{item.name}}</span>
                <i>ctrl + {{item.val}}</i>
              </li>
            </ul>
          </div>
          <div slot="footer">
            <button class="btn btn--primary" @click="showModal = false">
                OK
            </button>
          </div>
        </modal>
      </template>
    </Header>
    <Editor/>
    <footer>
      Made with <font-awesome-icon icon="heart" /> by <a href="https://github.com/jackiecard" title="Jackie's github page">jackiecard</a>.
    </footer>
  </div>
</template>

<script>

export default {
  name: 'app',
  data(){
    return{
      showModal: false,
      shortcuts: [
        {
          name: 'color pallete',
          icon: 'palette',
          val: 'p'
        },
        {
          name: 'color picker',
          icon: 'tint',
          val: '1'
        },
        {
          name: 'eraser',
          icon: 'eraser',
          val: 'e'
        },
        {
          name: 'pencil',
          icon: 'pen',
          val: 'w'
        },
        {
          name: 'zoom',
          icon: 'search',
          val: '2'
        },
        {
          name: 'zoom in',
          icon: 'search-plus',
          val: '='
        },
        {
          name: 'zoom out',
          icon: 'search-minus',
          val: '-'
        },
        {
          name: 'zoom reset',
          icon: 'search',
          val: ']'
        },
        {
          name: 'undo',
          icon: 'undo',
          val: '3'
        },
        {
          name: 'clean',
          icon: 'times',
          val: '4'
        },
        {
          name: 'settings',
          icon: 'cog',
          val: '5'
        },
        {
          name: 'save',
          icon: 'save',
          val: '6'
        },
        {
          name: 'import',
          icon: 'upload',
          val: '7'
        },
        {
          name: 'Make',
          icon: 'plus-circle',
          val: '8'
        },
      ]
    }
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Inconsolata|Roboto+Condensed');
@import url('../node_modules/normalize.css/normalize.css');

body{
  margin: 0;
  background-color: #dadada;
}

#app {
  --border-color: rgba(0, 0, 0, 0.05);
  --border-color-active: #ffffff;

  font-family: 'Inconsolata', monospace;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

  button,
  input{
    font-family: 'Inconsolata', monospace;
  }

  .popper[x-placement^="bottom"] .popper__arrow {
    border-color: transparent transparent #eaeaea transparent;
  }

  .popper[x-placement^="right"] .popper__arrow {
    border-color: transparent #eaeaea transparent transparent;
  }

  footer{
    padding: 20px 0;

    .svg-inline--fa{
      height: 12px;
      margin-bottom: -1px;
    }
  }

  .shortcuts-list{
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: auto auto;
    grid-column-gap: 30px;

    &__item{
      list-style-type: none;
      display: grid;
      grid-template-columns: 20px 1fr 50px;

      .svg-inline--fa{
        height: 12px;
        padding-right: 5px;
      }

      span{
        text-transform: capitalize;
      }

      i{
        text-align: right;
      }
    }
  }
}
</style>
