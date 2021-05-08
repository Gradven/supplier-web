<template>
  <div class="logistics-layer">
    <div class="row" v-if="logisticsInfo.nu">
      <div class="label">快递编号:</div>
      <div class="no">{{logisticsInfo.nu}}</div>
    </div>
    <div class="list" v-if="logisticsInfo.nu">
      <div class="item" :key="index" v-for="(item,index) in logisticsInfo.data">
        <div class="desc">{{item.context}}</div>
        <div class="time">{{item.time}}</div>
      </div>
    </div>
    <div class="none" v-if="!logisticsInfo.nu">
      暂无物流信息
    </div>
    <div class="btn-banner">
      <el-button type="warning" @click="$emit('list')">返回</el-button>
    </div>
  </div>
</template>

<script>

  export default{
    props:{
      logisticsId:{}
    },
    data () {
      return {
        logisticsInfo:{}
      }
    },
    created () {
      this.getCouriers();
    },
    mounted(){

    },
    computed: {

    },
    components:{

    },
    watch : {

    },
    methods: {
      getCouriers:function(){
        let that = this;
        this.$api.api.getCouriers.get({
          id:this.logisticsId
        }).then(
          function(res){
            that.logisticsInfo = res.data;
          }
        ).catch(
          function(err){
            that.$tool.excPrompt(err);
          }
        )
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .logistics-layer
    position:relative;
    width:100%;
    padding: 10px;
    box-sizing: border-box;
    background: #fff;
    .row
      clear:both;
      line-height:3em;
      margin-bottom:10px;
      >div
        float:left;
      .label
        margin-right:10px;
        width:60px;
        text-align:right;
        color:#999;
    .list
      clear:both;
      line-height:1.5em;
      .item
        margin-bottom:1em;
      .time
        color:#999;
</style>
