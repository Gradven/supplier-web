<template>
  <div class="QrCodeLayer">
    <div class="pagePreViewBox" @click="$emit('close')">
      <img :src="url" />
    </div>
  </div>
</template>
<script>
  export default {
    props:{
      url:{}
    },
    created () {

    },
    mounted(){
    },
    data () {
      return {

      }
    },
    components: {
    },
    methods: {

    }
  }
</script>
<style lang="stylus" scoped>
  .QrCodeLayer
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    display: table;
    transition: opacity .3s ease;
    .pagePreViewBox
      display: flex;
      align-items:center;
      width:100%;
      height:100%;
      >img
        margin:0 auto;
        width:500px;
</style>
