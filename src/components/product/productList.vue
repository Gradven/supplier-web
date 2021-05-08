<template>
  <div class="productList-layer">
    <div class="tool-bar">
      <el-input v-model="productName" placeholder="名称" class="search-input" auto-complete="off"></el-input>
      <el-button @click="search">搜索</el-button>
      <el-button type="primary" class="el-icon-plus" @click="$emit('add')">新增</el-button>
      <el-button type="warning" class="el-icon-edit-outline" @click="$emit('modify',productSelectionList)" :disabled="productSelectionList.length != 1">修改</el-button>
      <el-button type="danger" class="el-icon-delete" @click="deleteGoods" :disabled="productSelectionList.length < 1">删除</el-button>
      <el-button type="primary" class="el-icon-goods" @click="setSaleFlag('1')" :disabled="productSelectionList.length < 1" >上架</el-button>
      <el-button type="primary" class="el-icon-sold-out" plain @click="setSaleFlag('0')" :disabled="productSelectionList.length < 1" >下架</el-button>
      <el-button type="warning" class="el-icon-edit-outline" @click="editeSpec" :disabled="productSelectionList.length != 1">规格</el-button>
      <el-button type="warning" class="el-icon-goods" @click="editePrice" :disabled="productSelectionList.length != 1">定价</el-button>
    </div>
    <div class="table-box">
      <el-table
        ref="productTable"
        :data="productList"
        tooltip-effect="dark"
        style="width: 100%"
        border v-loading="productListLoading"
        :row-key="getRowKeys"
        @row-click="selectProduct"
        @selection-change="selectProductChange">
        <el-table-column
          type="index"
          label="序号"
          width="50">
        </el-table-column>
        <el-table-column
          type="selection"
          :reserve-selection="false"
          width="55">
        </el-table-column>
        <el-table-column
          label="封面"
          width="60">
          <template slot-scope="scope">
            <img :src="scope.row.cover" />
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="名称"
          width="120"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="sn"
          label="编号"
          width="150">
        </el-table-column>
        <el-table-column
          label="审核状态"
          width="80">
          <template slot-scope="scope">
            {{scope.row.approveStatus == 1?'审核中':scope.row.approveStatus == 2?'审核通过':'审核未通过'}}
          </template>
        </el-table-column>
        <el-table-column
          label="上架"
          width="50">
          <template slot-scope="scope">
            <span class="onSale" v-if="scope.row.onSaleFlag == 1">是</span>
            <span class="unSale" v-else>否</span>
          </template>
        </el-table-column>
        <el-table-column
          label="零售价"
          width="120">
          <template slot-scope="scope">
            {{scope.row.retailPrice && scope.row.retailPrice.toFixed(2)}}
          </template>
        </el-table-column>
        <el-table-column
          label="出厂价"
          width="120">
          <template slot-scope="scope">
            {{scope.row.unitPrice && scope.row.unitPrice.toFixed(2)}}
          </template>
        </el-table-column>
        <el-table-column
          label="利润"
          width="120">
          <template slot-scope="scope">
            {{scope.row.profit && scope.row.profit.toFixed(2)}}
          </template>
        </el-table-column>
        <el-table-column
          label="库存"
          width="120">
          <template slot-scope="scope">
            {{scope.row.storeNumber || 0}}
          </template>
        </el-table-column>
        <el-table-column
          label="销量"
          width="120">
          <template slot-scope="scope">
            {{scope.row.salesVolume || 0}}
          </template>
        </el-table-column>
        <el-table-column
          prop="shortDescription"
          label="描述"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="日期"
          width="160">
          <template slot-scope="scope">{{ moment(new Date( scope.row.createTime )).format('YYYY-MM-DD HH:mm:ss') }}</template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-box">
      <el-pagination background layout="prev, pager, next" :total="total" :page-size="pageSize" @current-change="currentChange"> </el-pagination>
    </div>
    <el-dialog
      width="40%"
      title="添加规格"
      :visible.sync="addSpecFlag">
        <div class="row">
          <div class="label">规格:</div>
          <el-select v-model="specificationId" clearable placeholder="请选择">
            <el-option
              v-for="item in specificationInfoList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div class="row">
          <div class="label">图标:</div>
          <FileUploadRatio  class="file-upload" v-if="addSpecFlag"
                            :imageUri="picUrl || imageAddUri" ref="fileUpload" @success="uploadSuccess"></FileUploadRatio>
        </div>
        <div class="row">
          <div class="label">规格值:</div>
          <el-input v-model="value" placeholder="请输入规格值" auto-complete="off"></el-input>
        </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addSpecFlag = false">取 消</el-button>
        <el-button type="primary" @click="addSpecFun">提交</el-button>
      </div>
    </el-dialog>
    <el-dialog title="编辑规格" :visible.sync="specFlag">
      <specList :goodsId="goodsId" @addSpec="addSpec" @editSpec="editSpecValue" ref="specList"></specList>
      <div slot="footer" class="dialog-footer">
        <el-button @click="specFlag = false">取 消</el-button>
        <el-button type="primary" @click="specFlag = false">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="产品定价" :visible.sync="priceEditFlag" width="70%">
      <el-dialog
        width="30%"
        title="提示"
        :visible.sync="modifyPriceFlag"
        append-to-body>
        <span>你好，更新商品信息，需重新进行审核，是否继续？</span>
        <div slot="footer" class="dialog-footer">
          <el-button @click="modifyPriceFlag = false">取 消</el-button>
          <el-button type="primary" @click="saveProductPrice">继续</el-button>
        </div>
      </el-dialog>
      <setPrice v-if="priceEditFlag" :goodsInfo="productSelectionList[0]" :goodsSn="productSelectionList[0] && productSelectionList[0].sn" :goodsId="goodsId" ref="setPrice"></setPrice>

      <div slot="footer" class="dialog-footer">
        <el-button @click="priceEditFlag = false">取 消</el-button>
        <el-button type="primary" @click="saveProductPrice">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import specList from './specList.vue'
  import setPrice from './setPrice.vue'
  import FileUploadRatio from '../dialog/FileUploadRatio.vue'
  import moment from 'moment'

  export default{
    props:{
      selectionList:{}
    },
    data () {
      return {
        modifyPriceFlag:false,

        productListLoading:true,
        goodsId:'',
        goodsSn:'',

        productName:"",
        specificationId:"",
        productList:[],
        productSelectionList:this.selectionList || [],
        specificationInfoList:[],
        specList:[],
        specFlag:false,
        specDialogFlag:false,
        valueList:[],
        dialogName:"",
        priceEditFlag:false,
        productColor:[],
        productMemory:[],
        addSpecFlag:false,
        moment:moment,
        pageNo:1,
        pageSize:10,
        total:0,

        specId:'',
        picUrl: '',
        value:'',

        imageAddUri:"/static/image/icon/add.png",
      }
    },
    created () {
      this.getGoodsInfoList();
    },
    mounted(){

    },
    computed: {

    },
    components:{
      specList,
      setPrice,
      FileUploadRatio
    },
    watch : {

    },
    methods: {
      getRowKeys:function(row){
        return row.id;
      },
      handleSelectionChange:function(val){
        console.log("handleSelectionChange");
      },
      uploadSuccess:function(url){
        this.picUrl = url;
      },
      currentChange:function (pageNo) {
        this.pageNo = pageNo;
        this.getGoodsInfoList();
      },
      selectProduct:function(row, event, column){
        this.$refs.productTable.toggleRowSelection(row);
      },
      selectProductChange:function(val){
        this.productSelectionList = val;
      },
      editeSpec:function(){
        this.specFlag = true;
        this.goodsId = this.productSelectionList[0].id;
        if(this.$refs.specList){
          this.$refs.specList.init();
          this.$refs.specList.getProductInfoList(this.goodsId);
          this.$refs.specList.getGoodsSpecificationList(this.goodsId);
        }
      },
      editSpecValue:function(spec){
        this.getSpecificationInfoList();
        this.specId = spec.id
        this.goodsId = spec.goodsId
        this.specificationId = spec.specificationId
        this.picUrl = spec.picUrl
        this.value = spec.value
        this.addSpecFlag = true;
      },
      addValue:function(){
        this.valueList.push({});
      },
      save:function(){
        this.specDialogFlag = false;
        this.valueList = [];
      },
      editePrice:function(){
        this.priceEditFlag = true;
        this.goodsId = this.productSelectionList[0].id;
        if(this.$refs.setPrice){
          this.$refs.setPrice.getGoodsSpecificationList(this.goodsId);
          this.$refs.setPrice.getProductInfoList(this.goodsId);
        }
      },
      addSpec:function() {
        this.getSpecificationInfoList();
        this.specId = ''
        this.specificationId = ''
        this.picUrl = ''
        this.value = ''
        this.addSpecFlag = true;
      },
      addSpecFun:function(){
        let that = this;
        if(this.specId){
          this.$api.api.goodsSpecification.patch({
            id:this.specId,
            goodsId:this.goodsId,
            specificationId:this.specificationId,
            picUrl:this.picUrl,
            value:this.value
          }).then(
            function(res){
              that.addSpecFlag = false;
              that.$refs.specList.getGoodsSpecificationList(that.goodsId);
              that.$message({
                type: 'success',
                message: '修改成功!'
              });
            }
          ).catch(
            function(err){
              that.$tool.excPrompt(err);
            }
          )
        }else{
          this.$api.api.goodsSpecification.post({
            goodsId:this.goodsId,
            specificationId:this.specificationId,
            picUrl:this.picUrl,
            value:this.value
          }).then(
            function(res){
              that.addSpecFlag = false;
              that.$refs.specList.getGoodsSpecificationList(that.goodsId);
              that.$message({
                type: 'success',
                message: '添加成功!'
              });
            }
          ).catch(
            function(err){
              that.$tool.excPrompt(err);
            }
          )
        }
      },
      handleSpecChange:function(){
        let specList = [];
        if(this.productColor.length > 0){
          if(this.productMemory.length > 0){
            this.productColor.forEach((item,index) => {
              this.productMemory.forEach((item_1,index_1) => {
                let spec = {
                  color:item,
                  memory:item_1
                }
                specList.push(spec);
              })
            })
          }else{
            this.productColor.forEach((item,index) => {
              let spec = {
                color:item,
                memory:""
              }
              specList.push(spec);
            })
          }
        }else{
          if(this.productMemory.length > 0){
            this.productMemory.forEach((item_1,index_1) => {
              let spec = {
                color:"",
                memory:item_1
              }
              specList.push(spec);
            })
          }
        }

        this.specList = specList;
      },
      search:function(){
        this.pageNo = 1;
        this.getGoodsInfoList();
      },
      getGoodsInfoList:function () {
        let that = this;
        this.$api.api.getGoodsInfoList.get({
          name:this.productName,
          offset:(this.pageNo-1)*this.pageSize,
          limit:this.pageSize,
        }).then(
          function(res){
            that.total = res.data.count;
            that.productList = res.data.rows;
            that.productListLoading = false;
            that.$nextTick(function(){
              that.setSelectedProduct();
            });
          }
        ).catch(
          function(err){
            that.$tool.excPrompt(err);
          }
        )
      },
      setSelectedProduct:function(){
        let that = this;
        that.productList.forEach( (item,index) => {
          that.productSelectionList.forEach( (selectItem,selectIndex) => {
            if(item.id == selectItem.id){
              that.$refs.productTable.toggleRowSelection(item);
            }
          });
        });
      },
      getSpecificationInfoList:function () {
        let that = this;
        this.$api.api.getSpecificationInfoList.get({
          name:this.productName,
          offset:0,
          limit:100,
        }).then(
          function(res){
            that.specificationInfoList = res.data.rows;
          }
        ).catch(
          function(err){
            that.$tool.excPrompt(err);
          }
        )
      },
      deleteGoods:function(){
        let that = this;
        this.$confirm('你确定要删除这些商品吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let list = [];
          that.productSelectionList.forEach( (item,index) => {
            list.push(
              that.$api.api.deleteGoodsById.delete({
                id:item.id,
              })
            );
          });
          that.$api.all(list).then(function () {
            that.$message({
              type: 'success',
              message: '删除成功!'
            });
            that.getGoodsInfoList();
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      setSaleFlag:function(onSaleFlag){
        let that = this;
        let list = [];
        that.productSelectionList.forEach( (item,index) => {
          list.push(
            that.$api.api.onSaleFlag.patch({
              goodsId :item.id,
              flag :onSaleFlag
            })
          );
        });
        that.$api.all(list).then(function(resList){
          let errorCode = null;
          resList.forEach(item=>{
            if(item && item.data.errorCode){
              errorCode = item.data.errorCode;
            }
          });
          if(!errorCode){
            that.getGoodsInfoList();
            that.$message({
              type: 'success',
              message: '操作成功!'
            });
          }
        });
      },
      setProductPrice:function(){
        let approveStatus = this.productSelectionList[0].approveStatus;
        if(approveStatus == 2) {
          this.modifyPriceFlag = true;
        }else{
          this.saveProductPrice();
        }
      },
      saveProductPrice:function(){
        let that = this;
        this.modifyPriceFlag = false;
        this.goodsId = this.productSelectionList[0].id;
        this.goodsSn = this.productSelectionList[0].sn;
        if(this.$refs.setPrice){
          this.$refs.setPrice.setProductPrice(this.goodsId,this.goodsSn,function(){
            that.priceEditFlag = false;
            that.getGoodsInfoList();
          });
        }
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .productList-layer
    position:relative;
    width:100%;
    padding-bottom:60px;
    background: #fff;
    .tool-bar
      padding:0 10px;
      .search-input
        width:200px;
    .table-box
      margin:10px;
      overflow:hidden;
      border-radius:0.25em;
      border:1px solid #eee;
      border-bottom:none;
      .table-container
        width:100%;
      .el-table
        .onSale
          display: inline-block;
          width:2em;
          line-height:1.8em;
          border-radius: 5px;
          text-align: center;
          color:#fff;
          background:#1c85c6;
        .unSale
          display: inline-block;
          width:2em;
          line-height:1.8em;
          border-radius: 5px;
          text-align: center;
          color:#fff;
          background:#e45d64
    .pagination-box
      float:right;
    .row
      margin-bottom:10px;
      .label
        width:4em;
      .el-input
        width:300px;
      .file-upload
        width:10em;
        height:5em;
</style>
