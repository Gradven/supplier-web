<template>
  <div class="supplier-service-layer">
    <supplierServiceList v-if="status=='list'" ref="list" @showDetail="showDetail" ></supplierServiceList>
    <supplierServiceDetail v-if="status=='detail'" :id="selectId" @list="status = 'list'" @showOrderDetail="showOrderDetail" ></supplierServiceDetail>
  </div>
</template>

<script>
  import supplierServiceList from './supplierServiceList'
  import supplierServiceDetail from './supplierServiceDetail'

  export default{
    data () {
      return {
        status:'list', // list、detail
        selectId:''
      }
    },
    created () {
    },
    mounted(){

    },
    computed: {

    },
    components:{
      supplierServiceList,
      supplierServiceDetail
    },
    watch : {

    },
    methods: {
      showDetail:function(id){
        this.status = 'detail';
        this.selectId = id;
      },
      showOrderDetail:function(orderGoodsId){
        this.$emit('showOrderDetail',orderGoodsId);
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .supplier-service-layer
    position:relative;
    width:100%;
    background: #fff;
</style>
