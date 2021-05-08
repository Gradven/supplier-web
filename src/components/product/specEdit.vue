<template>
  <div class="spec-edit-layer">
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
    <el-dialog title="编辑规格" :visible.sync="specFlag" @close="$emit('close')">
      <specList :goodsId="goodsId" @addSpec="addSpec" @editSpec="editSpecValue" ref="specList"></specList>
      <div slot="footer" class="dialog-footer">
        <el-button @click="specFlag = false">取 消</el-button>
        <el-button type="primary" @click="specFlag = false">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import specList from './specList.vue'
  import FileUploadRatio from '../dialog/FileUploadRatio.vue'

  export default{
    props:{
      goodsId:{}
    },
    data () {
      return {
        addSpecFlag:false,
        specFlag:true,

        specificationId:"",
        picUrl: '',
        value:'',
        imageAddUri:"/static/image/icon/add.png",

        specificationInfoList:[]
      }
    },
    created () {
    },
    mounted(){

    },
    computed: {

    },
    components:{
      specList,
      FileUploadRatio
    },
    watch : {

    },
    methods: {
      uploadSuccess:function(url){
        this.picUrl = url;
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
    }
  }
</script>
<style lang="stylus" scoped>
  .spec-edit-layer
    display:block;
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
