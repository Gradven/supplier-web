<template>
  <div class="orderSend-layer">
    <div class="box-container">
      <div class="box">
        <div class="title">订单信息</div>
        <div class="txt-row">
          <div class="label">订单号:</div>
          <div class="txt">{{orderItem.sn}}</div>
        </div>
        <div class="txt-row">
          <div class="label">订单状态:</div>
          <div class="txt">{{orderItem.status == 0?'未支付':orderItem.status == 1?'已支付':orderItem.status == 99?'已取消':''}}</div>
        </div>
        <div class="txt-row">
          <div class="label">订单总额:</div>
          <div class="txt">￥{{orderItem.amount && orderItem.amount.toFixed(2)}}</div>
        </div>
        <div class="txt-row">
          <div class="label">店铺名称:</div>
          <div class="txt">{{orderGoodsItem.shopName}}</div>
        </div>
        <div class="txt-row">
          <div class="label">用户昵称:</div>
          <div class="txt">{{orderGoodsItem.userNickname}}</div>
        </div>
        <div class="txt-row">
          <div class="label">备注:</div>
          <div class="txt">{{orderItem.remark}}</div>
        </div>
        <div class="clear"></div>
      </div>
      <div class="box">
        <div class="title">发票信息</div>
        <div class="txt-row">
          <div class="label">发票类型:</div>
          <div class="txt">{{orderInvoice.type==2?'增值税发票':'普通发票'}}</div>
        </div>
        <div class="txt-row">
          <div class="label">发票抬头:</div>
          <div class="txt">{{orderInvoice.title}}</div>
        </div>
        <div class="txt-row">
          <div class="label">税号:</div>
          <div class="txt">{{orderInvoice.taxNo}}</div>
        </div>
        <div class="txt-row">
          <div class="label">开户银行:</div>
          <div class="txt">{{orderInvoice.bankName}}</div>
        </div>
        <div class="txt-row">
          <div class="label">银行账户:</div>
          <div class="txt">{{orderInvoice.bankNo}}</div>
        </div>
        <div class="txt-row">
          <div class="label">企业地址:</div>
          <div class="txt">{{orderInvoice.address}}</div>
        </div>
        <div class="txt-row">
          <div class="label">企业电话:</div>
          <div class="txt">{{orderInvoice.telephone}}</div>
        </div>
      </div>
    </div>
    <div class="box">
      <div class="title">商品信息</div>
      <div class="txt-row">
        <div class="label">商品名称:</div>
        <div class="txt">{{orderGoodsItem.goodsName}}</div>
      </div>
      <div class="txt-row">
        <div class="label">数量:</div>
        <div class="txt">{{orderGoodsItem.goodsNumber}}</div>
      </div>
      <div class="txt-row">
        <div class="label">零售价:</div>
        <div class="txt">￥{{orderGoodsItem.retailPrice && orderGoodsItem.retailPrice.toFixed(2)}}</div>
      </div>
      <div class="txt-row">
        <div class="label">单价:</div>
        <div class="txt">￥{{orderGoodsItem.unitPrice && orderGoodsItem.unitPrice.toFixed(2)}}</div>
      </div>
      <div class="txt-row">
        <div class="label">商品总额:</div>
        <div class="txt">￥{{orderGoodsItem.amountRetail && orderGoodsItem.amountRetail.toFixed(2)}}</div>
      </div>
      <div class="row">
        <div class="label">产品图片:</div>
        <div class="txt">
          <img :src="orderGoodsItem.picUrl" />
        </div>
      </div>
      <div class="txt-row">
        <div class="label">规格:</div>
        <div class="txt">{{orderGoodsItem.goodsSpecificationNameValue}}</div>
      </div>
      <div class="clear"></div>
    </div>
    <div class="box">
      <div class="title">收件人信息</div>
      <div class="txt-row">
        <div class="label">收件人:</div>
        <div class="txt">{{orderItem.consignee}}</div>
      </div>
      <div class="txt-row">
        <div class="label">联系电话:</div>
        <div class="txt">{{orderItem.mobile}}</div>
      </div>
      <div class="txt-row">
        <div class="label">地址:</div>
        <div class="txt">{{orderItem.sendAddress}}</div>
      </div>
      <div class="clear"></div>
    </div>
    <div class="box" v-if="orderGoodsItem.shippingStatus == 1">
      <div class="title">发货信息</div>
      <div class="txt-row">
        <div class="label">快递公司:</div>
        <div class="txt">{{shippingName}}</div>
      </div>
      <div class="txt-row">
        <div class="label">快递单号:</div>
        <div class="txt">{{shippingNo}}</div>
      </div>
      <div class="txt-row">
        <div class="label">运费(元):</div>
        <div class="txt">￥{{shippingFee && shippingFee.toFixed(2)}}</div>
      </div>
      <div class="btn-banner">
        <el-button type="warning" @click="$emit('list')">返回</el-button>
      </div>
      <div class="clear"></div>
    </div>
    <div class="box" v-if="orderGoodsItem.payStatus == 1 && orderGoodsItem.shippingStatus == 0">
      <div class="title">发货信息</div>
      <div class="row">
        <div class="label">快递公司:</div>
        <el-select v-model="shippingCode" placeholder="请选择">
          <el-option
            v-for="item in shippingCompanyList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
      <div class="row">
        <div class="label">快递单号:</div>
        <el-input v-model="shippingNo" placeholder="快递单号" auto-complete="off"></el-input>
      </div>
      <div class="row">
        <div class="label">运费(元):</div>
        <el-input type="number" v-model="shippingFee" placeholder="运费" auto-complete="off"></el-input>
      </div>
      <div class="btn-banner">
        <el-button type="primary" @click="send" v-if="orderGoodsItem.payStatus == 1 && orderGoodsItem.shippingStatus == 0">发货</el-button>
        <el-button type="warning" @click="$emit('list')">返回</el-button>
      </div>
      <div class="clear"></div>
    </div>
    <div class="btn-banner" v-else>
      <el-button type="warning" @click="$emit('list')">返回</el-button>
    </div>
  </div>
</template>

<script>

  export default{
    props:{
      selectId:{},
      orderSn:{}
    },
    data () {
      return {
        status:'list', // list、add、modify
        shippingCode:'',
        shippingName:'',
        shippingNo:'',
        shippingFee:'',

        orderItem:{},

        shippingCompanyItem:{},
        shippingCompanyList:[],

        orderGoodsItem:{},
        orderInvoice:{}
      }
    },
    created () {
      this.getOrderInfoBySn();
      this.getOrderInvoiceBySn();
      this.getOrderGoodsById();
      this.getShippingCompanyList();
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
      getOrderInfoBySn:function(){
        let that = this;
        this.$api.api.getOrderInfoBySn.get({
          sn:this.orderSn
        }).then(
          function(res){
            let sendAddress = (res.data.country || '') +" "+(res.data.province || '') +" "+(res.data.city || '') +" "+(res.data.district || '') +" "+(res.data.address || '')
            that.orderItem = res.data;
            that.orderItem.sendAddress = sendAddress;

          }
        ).catch(
          function(err){
            that.$tool.excPrompt(err);
          }
        )
      },
      getOrderInvoiceBySn:function(){
        let that = this;
        this.$api.api.getOrderInvoiceBySn.get({
          orderSn:this.orderSn
        }).then(
          function(res){
            that.orderInvoice = res.data;
          }
        ).catch(
          function(err){
            that.$tool.excPrompt(err);
          }
        )
      },
      getOrderGoodsById:function(){
        let that = this;
        this.$api.api.getOrderGoodsById.get({
          id:this.selectId
        }).then(
          function(res){
            that.orderGoodsItem = res.data;
            if(res.data.shippingStatus == 1){
              that.shippingCode = res.data.shippingCode;
              that.shippingName = res.data.shippingName;
              that.shippingNo = res.data.shippingNo;
              that.shippingFee = res.data.shippingFee;
            }
          }
        ).catch(
          function(err){
            that.$tool.excPrompt(err);
          }
        )
      },
      getShippingCompanyList:function(){
        let that = this;
        this.$api.api.shippingCompany.get({}).then(
          function(res){
            that.shippingCompanyList = res.data.rows;
          }
        ).catch(
          function(err){
            that.$tool.excPrompt(err);
          }
        )
      },
      getShippingName:function(id){
        let list = this.shippingCompanyList;
        for(var i=0;i<list.length;i++){
          let item = list[i];
          if(id == item.id){
            return item.name;
          }
        }
        return ''
      },
      send:function(){
        let that = this;
        let errorMessage = '';
        if(this.shippingCode == "" && errorMessage == ''){
          errorMessage = "请选择快递公司";
        }
        if(this.shippingNo == "" && errorMessage == ''){
          errorMessage = "请输入快递单号";
        }
        //如果errorMessage非空，提示错误并返回
        if(errorMessage != ""){
          this.$tool.toast(errorMessage);
          return;
        }
        this.$api.api.orderGoods.patch({
          id:this.selectId,
          shippingCode:this.shippingCode,
          shippingName:this.getShippingName(this.shippingCode),
          shippingNo:this.shippingNo,
          shippingFee:this.shippingFee
        }).then(
          function(res){
            that.$message({
              type: 'success',
              message: '发货成功!'
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
  .orderSend-layer
    position:relative;
    width:100%;
    padding: 10px;
    box-sizing: border-box;
    background: #fff;
    .box-container
      float:left;
      width:300px;
      margin-right:20px;
    .box
      float:left;
      padding:20px;
      margin-right:20px;
      margin-bottom:20px;
      width:300px;
      border-radius:5px;
      box-sizing:border-box;
      border:1px solid #999;
    .title
      clear:both;
      font-size:24px;
      line-height:48px;
    .txt-row
      clear:both;
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
      height:3em;
      line-height:3em;
      margin-bottom:10px;
      >div
        float:left;
      .label
        margin-right:10px;
        width:60px;
        text-align:right;
      .el-select
        width:170px;
      .el-input
        width:170px;
    .btn-banner
      clear:both;
</style>
