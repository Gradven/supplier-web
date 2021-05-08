<template>
  <div class="orderEdit-layer">
    <orderList v-show="status=='list'" ref="list" @send="send" @detail="status = 'detail'" @showLogistics="showLogistics"></orderList>
    <orderSend v-if="status=='send'" :selectId="selectId" :orderSn="orderSn" @list="showList"></orderSend>
    <logistics v-if="status=='logistics'" :logisticsId="logisticsId" @list="status = 'list'" ></logistics>
  </div>
</template>

<script>
  import orderList from './orderList.vue'
  import orderSend from './orderSend.vue'
  import orderDetail from './orderDetail.vue'
  import logistics from './logistics.vue'

  export default{
    data () {
      return {
        status:'list', // list、send、detail

        selectId:0,
        orderSn:0,
        logisticsId:0,
      }
    },
    created () {
    },
    mounted(){

    },
    computed: {

    },
    components:{
      orderList,
      orderSend,
      orderDetail,
      logistics
    },
    watch : {

    },
    methods: {
      handleSelectionChange:function(){
        console.log("handleSelectionChange");
      },
      send:function(id,orderSn){
        this.selectId = id;
        this.orderSn = orderSn;
        this.status = 'send';
      },
      showList:function(){
        this.status = 'list'
        this.$refs.list.getOrderGoodsList();
      },
      showLogistics:function(id){
        this.logisticsId = id;
        this.status = 'logistics';
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .orderEdit-layer
    position:relative;
    width:100%;
    background: #fff;
</style>
