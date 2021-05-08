<template>
  <div class="supplier-service-list-layer">
    <div class="tool-bar">
      <div class="label">退货状态</div>
      <el-select v-model="status" placeholder="请选择">
        <el-option
          v-for="item in statusList"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button @click="search">搜索</el-button>
    </div>
    <div class="table-box">
      <el-table
        ref="goodsTable"
        :data="goodsList"
        tooltip-effect="dark"
        style="width: 100%"
        border v-loading="goodsListLoading"
        @row-click="selectOrder"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="index"
          label="序号"
          width="50">
        </el-table-column>
        <el-table-column
          label="状态"
          width="100">
          <template slot-scope="scope">
            {{getStatus(scope.row.status)}}
          </template>
        </el-table-column>
        <el-table-column
        prop="reason"
        label="备注说明"
        width="180"
        show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="serviceAddress"
          label="退货地址"
          width="120"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="orderGoods.orderSn"
          label="订单编号"
          width="180"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="orderGoods.goodsSn"
          label="商品编号"
          width="180"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="产品图片"
          width="60">
          <template slot-scope="scope">
            <img :src="scope.row.orderGoods.picUrl" />
          </template>
        </el-table-column>
        <el-table-column
          prop="orderGoods.goodsName"
          label="产品名称"
          width="120"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="orderGoods.goodsSpecificationNameValue"
          label="规格"
          width="120"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="金额"
          width="120"
          show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.orderGoods.amountRetail.toFixed(2)}}
          </template>
        </el-table-column>
        <el-table-column
          label="利润"
          width="120"
          show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.orderGoods.profit.toFixed(2)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="orderGoods.userNickname"
          label="买家"
          width="120"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          min-width="200"
          label="操作">
          <template slot-scope="scope">
            <el-button @click="showDetail(scope.row.id)" class="el-icon-info" type="primary" plain size="mini" >
              审核
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
        status:"",
        goodsList:[],
        goodsListLoading:false,

        pageNo:1,
        pageSize:10,
        total:0,

        selectionList:[],

        statusList:[
          {
            value:1,
            label:'申请退货'
          },
          {
            value:2,
            label:'审核通过'
          },
          {
            value:3,
            label:'审核不通过'
          },
          {
            value:99,
            label:'取消退货'
          }
        ],
      }
    },
    created () {
      this.getSupplierServiceList();
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
          case 99:{
            result =  "取消退货";
            break;
          }
        }
        return result;
      },
      currentChange:function (pageNo) {
        this.pageNo = pageNo;
        this.getSupplierServiceList();
      },
      search:function(){
        this.pageNo = 1;
        this.getSupplierServiceList();
      },
      selectOrder:function(row, event, column){
        this.$refs.goodsTable.toggleRowSelection(row);
      },
      handleSelectionChange:function(val){
        this.selectionList = val;
      },
      getSupplierServiceList:function(){
        let that = this;
        this.goodsListLoading = true;
        let postData = {
          offset:(this.pageNo-1)*this.pageSize,
          limit:this.pageSize,
        };
        if(this.status || this.status == 0){
          postData.status = this.status;
        }
        this.$api.api.supplierService.get(postData).then(
          function(res){
            that.total = res.data.count;
            that.goodsList = res.data.rows;
            that.goodsListLoading = false;
          }
        ).catch(
          function(err){
            that.$tool.excPrompt(err);
          }
        )
      },
      showDetail:function(id){
        this.$emit('showDetail',id);
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .supplier-service-list-layer
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
        width:150px;
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
