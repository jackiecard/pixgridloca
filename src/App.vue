<template>
  <div id="app">
    <Header>
      <template slot="logo">
        <font-awesome-icon icon="heart" /> Pixel Grid Editor
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
  name: 'app'
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Inconsolata|Roboto+Condensed|Comfortaa');
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
    padding: 20px 0 50px;

    .svg-inline--fa{
      height: 12px;
      margin-bottom: -1px;
    }
  }
}
</style>
