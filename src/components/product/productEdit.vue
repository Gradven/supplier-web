<template>
  <div class="productEdit-layer">
    <productList v-if="status=='list'" :selectionList="productSelectionList" @add="add" @modify="modify"></productList>
    <productAdd v-if="status=='add'" :product="product" @list="status = 'list'"></productAdd>
  </div>
</template>

<script>
  import productList from './productList.vue'
  import productAdd from './productAdd.vue'

  export default{
    data () {
      return {
        status:'list', // list、add、modify
        product:{},

        productSelectionList:[]
      }
    },
    created () {
    },
    mounted(){

    },
    computed: {

    },
    components:{
      productList,
      productAdd
    },
    watch : {

    },
    methods: {
      add:function(){
        this.product = {};
        this.status = 'add';
      },
      modify:function(list){
        this.productSelectionList = list;
        this.product = list[0];
        this.status = 'add';
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .productEdit-layer
    position:relative;
    width:100%;
    background: #fff;
</style>
