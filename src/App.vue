<template>
  <div id="app">
    <Editor/>
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
  background-color: #ccc;
}

#app {
  font-family: 'Inconsolata', monospace;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

  button,
  input{
    font-family: 'Inconsolata', monospace;
  }
}
</style>
