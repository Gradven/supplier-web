<!-- 表格分页组件 -->
<template>
</template>

<script>
  export default {
    created () {
      this.init()
    },
    props: {
      src: {type: String, required: true},
    },
    methods:{
      init:function(){
        const s = document.createElement('script');
        s.type = 'text/javascript';
        s.src = this.src;
        document.body.appendChild(s);

      }
    }
  }
</script>

<style lang="scss" scoped>
</style>
