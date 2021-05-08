<template>
  <div class="orderList-layer">
    <div class="tool-bar">
      <el-input v-model="orderSn" placeholder="订单号" class="search-input" auto-complete="off"></el-input>
      <div class="label">支付状态</div>
      <el-select v-model="payStatus" placeholder="请选择">
        <el-option
          v-for="item in payStatusList"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <div class="label">发货状态</div>
      <el-select v-model="shippingStatus" placeholder="请选择">
        <el-option
          v-for="item in shippingStatusList"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-date-picker
        v-model="dateValue"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions">
      </el-date-picker>
      <el-button @click="search">搜索</el-button>
      <el-button type="warning" class="el-icon-edit-outline hide" @click="send" :disabled="orderSelectionList.length != 1">发货</el-button>
      <el-button type="danger" class="el-icon-delete hide">确认收货</el-button>
    </div>
    <div class="table-box">
      <el-table
        ref="orderTable"
        :data="orderGoodsList"
        tooltip-effect="dark"
        style="width: 100%"
        border v-loading="orderGoodsListLoading"
        @row-click="selectOrder"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="index"
          label="序号"
          width="50">
        </el-table-column>
        <el-table-column
        prop="orderSn"
        label="订单号"
        width="180"
        show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="商品封面"
          width="60">
          <template slot-scope="scope">
            <img :src="scope.row.picUrl" />
          </template>
        </el-table-column>
        <el-table-column
          prop="goodsName"
          label="商品名称"
          width="120"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="goodsSn"
          label="商品编号"
          width="150">
        </el-table-column>
        <el-table-column
          label="支付状态"
          width="90">
          <template slot-scope="scope">
            <span class="onSale" v-if="scope.row.payStatus == 1">已支付</span>
            <span class="onSale" v-else-if="scope.row.payStatus == 99">已取消</span>
            <span class="unSale" v-else>未支付</span>
          </template>
        </el-table-column>
        <el-table-column
          label="运送状态"
          width="90">
          <template slot-scope="scope">
            <span class="onSale" v-if="scope.row.shippingStatus == 0">未发货</span>
            <span class="onSale" v-if="scope.row.shippingStatus == 1">已发货</span>
            <span class="onSale" v-if="scope.row.shippingStatus == 2">已签收</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="shopName"
          label="店铺"
          width="120">
        </el-table-column>
        <el-table-column
          prop="userNickname"
          label="买家"
          width="120">
        </el-table-column>
        <el-table-column
          label="商品总额"
          width="100">
          <template slot-scope="scope">
            {{scope.row.amountRetail && scope.row.amountRetail.toFixed(2)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="goodsNumber"
          label="购买数量"
          width="100">
        </el-table-column>
        <el-table-column
          label="零售价"
          width="100">
          <template slot-scope="scope">
            {{scope.row.retailPrice && scope.row.retailPrice.toFixed(2)}}
          </template>
        </el-table-column>
        <el-table-column
          label="单价"
          width="100">
          <template slot-scope="scope">
            {{scope.row.unitPrice && scope.row.unitPrice.toFixed(2)}}
          </template>
        </el-table-column>
        <el-table-column
          label="下单日期"
          width="160">
          <template slot-scope="scope">{{ moment(new Date( scope.row.createTime )).format('YYYY-MM-DD HH:mm:ss') }}</template>
        </el-table-column>
        <el-table-column
          min-width="200"
          label="操作">
          <template slot-scope="scope">
            <el-button @click="showDetail(scope.row.id,scope.row.orderSn)" class="el-icon-info" type="primary" plain size="mini" >
              查看
            </el-button>
            <el-button @click="showDetail(scope.row.id,scope.row.orderSn)" class="el-icon-info" type="primary" plain size="mini" v-if="scope.row.payStatus == 1 && scope.row.shippingStatus == 0" >
              发货
            </el-button>
            <el-button @click="showLogistics(scope.row.id,scope.row.orderSn)" class="el-icon-info" type="primary" plain size="mini" v-if="scope.row.shippingStatus == 1 || scope.row.shippingStatus == 2" >
              查看物流
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-box">
      <el-pagination background layout="prev, pager, next" :total="total" :page-size="pageSize" @current-change="currentChange"> </el-pagination>
    </div>
  </div>
</template>

<script>
  import ElButton from "../../../node_modules/element-ui/packages/button/src/button";
  import moment from 'moment'

  export default{
    data () {
      return {
        moment:moment,
        orderSn:"",
        dateValue:"",
        payStatus:"",
        shippingStatus:"",
        orderGoodsList:[],
        orderGoodsListLoading:false,

        pageNo:1,
        pageSize:10,
        total:0,

        orderSelectionList:[],

        payStatusList:[
          {
            value:0,
            label:'未支付'
          },
          {
            value:1,
            label:'已支付'
          }
        ],

        shippingStatusList:[
          {
            value:0,
            label:'未发货'
          },
          {
            value:1,
            label:'已发货'
          },
          {
            value:2,
            label:'已签收'
          }
        ],

        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        }
      }
    },
    created () {
      this.getOrderGoodsList();
    },
    mounted(){

    },
    computed: {

    },
    components:{
      ElButton

    },
    watch : {

    },
    methods: {
      currentChange:function (pageNo) {
        this.pageNo = pageNo;
        this.getOrderGoodsList();
      },
      search:function(){
        this.pageNo = 1;
        this.getOrderGoodsList();
      },
      selectOrder:function(row, event, column){
        this.$refs.orderTable.toggleRowSelection(row);
      },
      handleSelectionChange:function(val){
        this.orderSelectionList = val;
      },
      showDetail:function(id,orderSn){
        this.$emit('send',id,orderSn);
      },
      showLogistics:function(id){
        this.$emit('showLogistics',id);
      },
      send:function(){
        this.$emit('send',this.orderSelectionList[0].id,this.orderSelectionList[0].orderSn);
      },
      getOrderGoodsList:function(){
        let that = this;
        this.orderGoodsListLoading = true;
        let postData = {
          offset:(this.pageNo-1)*this.pageSize,
          limit:this.pageSize,
        };
        if(this.payStatus || this.payStatus == 0){
          postData.payStatus = this.payStatus;
        }
        if(this.shippingStatus || this.shippingStatus == 0){
          postData.shippingStatus = this.shippingStatus;
        }
        if(this.orderSn){
          postData.orderSn = this.orderSn;
        }
        if(this.dateValue){
          postData.beginCreateTime = moment(new Date( this.dateValue[0] )).format('YYYY-MM-DD HH:mm:ss')
          postData.endCreateTime = moment(new Date( this.dateValue[1] )).format('YYYY-MM-DD HH:mm:ss')
        }

        console.log(this.dateValue);
        this.$api.api.orderGoods.get(postData).then(
          function(res){
            that.total = res.data.count;
            that.orderGoodsList = res.data.rows;
            that.orderGoodsListLoading = false;
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
  .orderList-layer
    position:relative;
    width:100%;
    padding-bottom:60px;
    background: #fff;
    .tool-bar
      padding:0 10px;
      .search-input
        width:200px;
      .label
        display:inline-block;
        font-size:14px;
        margin-left:10px;
        line-height:30px;
      .el-select
        width:100px;
    .table-box
      margin:10px;
      overflow:hidden;
      border-radius:0.25em;
      border:1px solid #eee;
      border-bottom:none;
      .el-button
        float:left;
    .pagination-box
      float:right;
</style>
