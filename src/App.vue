<template>
  <div id="app">
    <router-view/>
    <div class="common-toast"></div>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang="stylus">
  @import "./style/common.styl";
  #app
    margin: 0;
    width: 100%;
    height: 100%;
</style>
