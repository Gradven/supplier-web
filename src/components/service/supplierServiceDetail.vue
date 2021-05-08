<template>
  <div class="supplier-service-detail-layer">
    <div class="box" v-if="supplierServiceInfo.orderGoods">
      <div class="txt-row">
        <div class="label">退货状态:</div>
        <div class="txt">{{getStatus(supplierServiceInfo.status)}}</div>
      </div>
      <div class="txt-row"  v-if="supplierServiceInfo.status != 1">
        <div class="label">回复信息:</div>
        <div class="txt">{{supplierServiceInfo.reply}}</div>
      </div>
      <div class="txt-row">
        <div class="label">备注说明:</div>
        <div class="txt">{{supplierServiceInfo.reason}}</div>
      </div>
      <div class="txt-row">
        <div class="label">退货地址:</div>
        <div class="txt">{{supplierServiceInfo.serviceAddress}}</div>
      </div>
      <div class="txt-row">
        <div class="label">订单编号:</div>
        <div class="txt">{{supplierServiceInfo.orderGoods.orderSn}}</div>
      </div>
      <div class="txt-row">
        <div class="label">商品编号:</div>
        <div class="txt">{{supplierServiceInfo.orderGoods.goodsSn}}</div>
      </div>
      <div class="txt-row">
        <div class="label">产品名称:</div>
        <div class="txt">{{supplierServiceInfo.orderGoods.goodsName}}</div>
      </div>
      <div class="txt-row">
        <div class="label">规格:</div>
        <div class="txt">{{supplierServiceInfo.orderGoods.goodsSpecificationNameValue}}</div>
      </div>
      <div class="txt-row">
        <div class="label">金额:</div>
        <div class="txt">{{supplierServiceInfo.orderGoods.amountRetail}}</div>
      </div>
      <div class="txt-row">
        <div class="label">利润:</div>
        <div class="txt">{{supplierServiceInfo.orderGoods.profit}}</div>
      </div>
      <div class="txt-row">
        <div class="label">买家:</div>
        <div class="txt">{{supplierServiceInfo.orderGoods.userNickname}}</div>
      </div>
      <div class="txt-row">
        <div class="label">产品图片:</div>
        <div class="txt">
          <img :src="supplierServiceInfo.orderGoods.picUrl" />
        </div>
      </div>
      <div class="row" v-if="supplierServiceInfo.status==1">
        <div class="label">回复信息:</div>
        <el-input type="textarea" :rows="3" v-model="reply" placeholder="请输入备注" auto-complete="off"></el-input>
      </div>
      <div class="btn-banner">
        <el-button type="primary" v-if="supplierServiceInfo.status==1" @click="submit(2)">同意退货</el-button>
        <el-button type="primary" v-if="supplierServiceInfo.status==1" @click="submit(3)">驳回退货</el-button>
        <el-button type="primary" @click="$emit('showOrderDetail',supplierServiceInfo.orderGoodsId)">订单详情</el-button>
        <el-button type="warning" @click="$emit('list')">返回</el-button>
      </div>
      <div class="clear"></div>
    </div>
  </div>
</template>

<script>

  export default{
    props:{
      id:{},
    },
    data () {
      return {
        supplierServiceInfo:{},
        reply:''
      }
    },
    created () {
      this.supplierServiceById();
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
      getStatus:function(status){
        let result = "";
        switch (status){
          case 1:{
            result =  "申请退货";
            break;
          }
          case 2:{
            result =  "审核通过";
            break;
          }
          case 3:{
            result =  "审核不通过";
            break;
          }
          case 4:{
            result =  "取消退货";
            break;
          }
        }
        return result;
      },
      supplierServiceById:function(){
        let that = this;
        this.$api.api.supplierServiceById.get({
          id:this.id
        }).then(
          function(res){
            that.supplierServiceInfo = res.data;
          }
        ).catch(
          function(err){
            that.$tool.excPrompt(err);
          }
        )
      },
      submit:function(status){
        let that = this;
        this.$api.api.supplierService.patch({
          id:this.id,
          reply:this.reply,
          status:status
        }).then(
          function(res){
            if(res && res.data && res.data.errorCode){
              return;
            }
            that.$message({
              type: 'success',
              message: '提交成功!'
            });
            that.$emit('list');
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
  .supplier-service-detail-layer
    position:relative;
    width:100%;
    background: #fff;
    .box
      padding:20px;
      margin-right:20px;
      margin-bottom:20px;
      width:700px;
      border-radius:5px;
      box-sizing:border-box;
      .txt-row
        float:left;
        width:300px;
        min-height: 1.5em;
        margin-bottom:10px;
        >div
          float:left;
          line-height:1.5em;
        .label
          margin-right:10px;
          width:60px;
          text-align:right;
        .el-select
          width:170px;
          .el-input
            width:170px;
        .el-input
          width:170px;
        .txt
          width:170px;
          height:100%;
          >img
            height:100%;
            object-fit:contain;
      .row
        clear:both;
        min-height:3em;
        line-height:3em;
        margin-bottom:10px;
        >div
          float:left;
        .label
          margin-right:10px;
          width:60px;
          line-height:3em;
          text-align:right;
        .select-box
          .desc
            font-size:12px;
            color:#f33;
            line-height:18px;
        .el-select
          width:400px;
          margin-right:10px;
        .el-input
          width:400px;
        .el-textarea
          width:400px;
          margin-bottom:10px;
        .el-checkbox-group
          display:inline-block;
          width:600px;
        .file-upload
          height:3em;
      .btn-banner
        clear:both;
</style>
