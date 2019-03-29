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
  --border-color: rgba(0, 0, 0, 0.1);
  --border-color-active: #f1d963;

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
