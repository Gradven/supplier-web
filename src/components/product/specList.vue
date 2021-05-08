<template>
  <div class="specList-layer">
    <div class="tool-bar">
      <!--<el-input v-model="specName" placeholder="名称" class="search-input"></el-input>-->
      <!--<el-button>搜索</el-button>-->
      <el-button type="primary" class="el-icon-plus" @click="$emit('addSpec')" v-if="!hasProduct">新增</el-button>
    </div>
    <div class="table-box">
      <el-table
        ref="multipleTable"
        :data="specList"
        tooltip-effect="dark"
        style="width: 100%"
        border
        :span-method="objectSpanMethod">
        <el-table-column
          prop="name"
          label="名称"
          width="120"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="图标"
          width="60">
          <template slot-scope="scope">
            <img :src="scope.row.picUrl" />
          </template>
        </el-table-column>
        <el-table-column
          prop="value"
          label="规格值"
          width="120"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="操作"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button size="mini" @click="editSpec(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" @click="deleteSpec(scope.$index, scope.row)" type="danger" plain v-if="!hasProduct" >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import ElButton from "../../../node_modules/element-ui/packages/button/src/button";

  export default{
    props:{
      goodsId:{}
    },
    data () {
      return {
        specName:"",
        specList:[],
        specSelectionList:[],

        hasProduct:true,
      }
    },
    created () {
      this.getProductInfoList(this.goodsId);
      this.getGoodsSpecificationList(this.goodsId);
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
      handleSelectionChange:function(val){
        this.specSelectionList = val;
      },
      objectSpanMethod:function({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0) {
          if (row.size) {
            return {
              rowspan: row.size,
              colspan: 1
            };
          } else {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }
      },
      init:function(){
        this.specName = "";
        this.specList = [];
        this.specSelectionList = [];
        this.hasProduct = true;
      },
      getProductInfoList:function(goodsId){
        let that = this;
        this.productSpec = [];
        this.$api.api.productInfo.get({
          goodsId:goodsId,
          offset:0,
          limit:100
        }).then(
          function(res){
            that.hasProduct = res.data.length>0;
          }
        ).catch(
          function(err){
            that.$tool.excPrompt(err);
          }
        )
      },
      getGoodsSpecificationList:function (goodsId) {
        let that = this;
        this.$api.api.getGoodsSpecificationList.get({
          goodsId:goodsId
        }).then(
          function(res){
            let specList = [];
            for(let spec in res.data){
              let specItem = spec.split("|");
              let list = res.data[spec];
              list.forEach((item,index) => {
                if( index == 0 ){
                  item.size = list.length;
                }
                item.name = specItem[1];
                specList.push(item);
              });
            }
            that.specList = specList;
          }
        ).catch(
          function(err){
            that.$tool.excPrompt(err);
          }
        )
      },
      editSpec:function(index,row){
        this.$emit("editSpec",row)
      },
      deleteSpec:function(index,row){
        let that = this;
        this.$confirm('你确定要删除该规格吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.$api.api.deleteGoodsSpecById.delete({
            id:row.id,
          }).then(function () {
            that.$message({
              type: 'success',
              message: '删除成功!'
            });
            that.getGoodsSpecificationList(that.goodsId);
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .specList-layer
    position:relative;
    width:100%;
    background: #fff;
    .tool-bar
      padding:0 10px;
      .search-input
        width:200px;
    .table-box
      margin:10px;
      overflow:hidden;
      border-radius:0.25em;
      border-bottom:none;
    .pagination-box
      float:right;
    .row
      margin-bottom:10px;
      .label
        width:4em;
        text-align:right;
        display:inline-block;
        line-height:100%;
      .el-input
        width:300px;
</style>
