<template>
  <div class="productAdd-layer">
    <el-tabs v-model="activeName">
      <el-tab-pane label="通用信息" name="first">
        <div class="row">
          <div class="label">名称:</div>
          <el-input type="textarea" :rows="2" v-model="name" placeholder="请输入产品名称" auto-complete="off"></el-input>
        </div>
        <div class="img-row">
          <div class="label">封面:</div>
          <div class="upload-box">
            <FileUploadRatio  class="cover-upload" :isMulti="false"
                              :imageUri="cover || coverAddUri" ref="coverUpload" @success="uploadCoverSuccess"></FileUploadRatio>
          </div>
        </div>
        <div class="img-row">
          <div class="label">轮播图:</div>
          <div class="upload-box">
            <FileUploadRatio  class="file-upload" :isMulti="true" :maxSize="10" :imageList="JSON.parse(picUrls)"
                              :imageUri="imageAddUri" ref="fileUpload" @success="uploadSuccess"></FileUploadRatio>
            <div class="desc">*最多可导入10张图片</div>
          </div>
        </div>
        <div class="row">
          <div class="label">分类:</div>
          <el-input v-model="selectedGoodsCategory.name" placeholder="请选择产品分类（分类不足，请联系运营人员）">
            <template slot="append">
              <el-button type="primary" @click="selectCategory">选择分类</el-button>
            </template>
          </el-input>
        </div>
        <div class="row">
          <div class="label">零售价:</div>
          <el-input v-model="retailPrice" placeholder="请输入零售价（商品的最低零售价）" auto-complete="off"></el-input>
        </div>
        <div class="row">
          <div class="label">单价:</div>
          <el-input v-model="unitPrice" placeholder="请输入单价（商品的最低出厂价）" auto-complete="off"></el-input>
        </div>
        <div class="row">
          <div class="label">单位:</div>
          <el-input v-model="unit" placeholder="请输入单位（商品的单位，如手机，则填写'台'）" auto-complete="off"></el-input>
        </div>
        <div class="row">
          <div class="label">库存:</div>
          <div class="desc">{{productInfo.storeNumber || 0}}</div>
        </div>
        <div class="row">
          <div class="label">销量:</div>
          <div class="desc">{{productInfo.salesVolume || 0}}</div>
        </div>
        <div class="row">
          <div class="label">基础服务:</div>
          <el-checkbox-group v-model="service">
            <el-checkbox label="1">7天放心退</el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="row">
          <div class="label">发票类型:</div>
          <el-checkbox-group v-model="invoiceType">
            <el-checkbox :label="item.id" :key="index" v-for="(item,index) in invoiceTypeList">{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="row">
          <div class="label">上架状态:</div>
          <div class="select-box">
            <el-select v-model="onSaleFlag" placeholder="请选择" :disabled="!product.id">
              <el-option
                v-for="item in onSaleFlagList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <div class="desc">*设置规格定价后才能上架</div>
          </div>
          <span class="clear"></span>
        </div>
        <div class="row">
          <div class="label">简介:</div>
          <el-input type="textarea" :rows="3" v-model="shortDescription" placeholder="请输入简介" auto-complete="off"></el-input>
        </div>
      </el-tab-pane>
      <el-tab-pane label="详情描述" name="second">
        <Ueditor ueId="productDesc" :defaultMsg=defaultMsg :config=config ref="ue" class="ueditor" v-if="isShowUeditor"></Ueditor>
      </el-tab-pane>
      <el-tab-pane label="商品参数" name="third">
        <el-table :data="goodsParamList">
          <el-table-column
            label="参数名"
            width="200">
            <template slot-scope="scope">
              <el-input v-model="scope.row.name" placeholder="参数名" auto-complete="off"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="参数值"
            width="200">
            <template slot-scope="scope">
              <el-input v-model="scope.row.value" placeholder="参数值" auto-complete="off"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="排序"
            width="200">
            <template slot-scope="scope">
              <el-input type="number" v-model="scope.row.sort" placeholder="排序" auto-complete="off"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label=""
            width="200">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-plus" size="mini" circle @click="addGoodsParamList"></el-button>
              <el-button type="danger" icon="el-icon-minus" size="mini" circle @click="removeGoodsParamList(scope.$index,scope.row.id)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <div class="btn-banner">
      <el-button type="primary" @click="submit">保存</el-button>
      <el-button type="warning" class="el-icon-edit-outline" @click="editSpec">规格</el-button>
      <el-button type="warning" class="el-icon-goods" @click="editPrice">定价</el-button>
      <el-button type="warning" @click="$emit('list')">返回</el-button>
      <el-button @click="reSet">重置</el-button>
    </div>
    <el-dialog title="选择分类" :visible.sync="selectCategoryFlag" width="30%">
      <el-tree :props="goodsCategoryProps" :load="loadGoodsCategory" lazy v-loading="goodsCategoryLoading" @node-click="getCurrentNode" >
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="selectCategoryFlag = false">取 消</el-button>
        <el-button type="primary" @click="saveGoodsCategory">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="modifyFlag"
      width="30%">
      <span>你好，更新商品信息，需重新进行审核，是否继续？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyFlag = false">取 消</el-button>
        <el-button type="primary" @click="postGoodsInfo">继 续</el-button>
      </span>
    </el-dialog>
    <specEdit :goodsId="product.id" @close="specEditFlag = false" v-if="specEditFlag" ></specEdit>
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
      <setPrice v-if="priceEditFlag" :goodsInfo="product" :goodsSn="product && product.sn" :goodsId="goodsId" ref="setPrice"></setPrice>

      <div slot="footer" class="dialog-footer">
        <el-button @click="priceEditFlag = false">取 消</el-button>
        <el-button type="primary" @click="saveProductPrice">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Ueditor from '../../components/editor/Ueditor.vue';
  import productList from './productList.vue'
  import specEdit from './specEdit.vue'
  import setPrice from './setPrice.vue'
  import FileUploadRatio from '../dialog/FileUploadRatio.vue'

  export default{
    props:{
      product:{}
    },
    data () {
      return {
        status:'list', // list、add、modify
        goodsCategoryLoading:true,
        productInfo:{},
        goodsId:this.product.id || '',
        goodsSn:'',
        onSaleFlagList:[
          {
            id:0,
            name:"下架"
          },
          {
            id:1,
            name:"上架"
          }
        ],

        invoiceTypeList:[
          {
            id:'1',
            name:"普通发票"
          },
          {
            id:'2',
            name:"增值税专用发票"
          }
        ],

        activeName:'first',
        selectCategoryFlag:false,
        modifyFlag:false,
        specEditFlag:false,
        priceEditFlag:false,
        modifyPriceFlag:false,

        name:this.product.name || '',
        cover:this.product.cover || '',
        picUrls:this.product.picUrls || '[]',
        categoryId:this.product.categoryId || '',
        retailPrice:this.product.retailPrice || '',
        unitPrice:this.product.unitPrice || '',
        unit:this.product.unit || '',
        service:[],
        invoiceType:[],
        onSaleFlag:this.product.onSaleFlag || 0,
        shortDescription:this.product.shortDescription || '',

        imageAddUri:"/static/image/icon/add.png",
        coverAddUri:"/static/image/icon/add.png",

        goodsCategoryList:[],
        goodsCategoryProps:{
          label: 'name',
          children: 'zones',
          isLeaf:'lastFlag'
        },
        selectedGoodsCategoryNode:{},
        selectedGoodsCategory:{},
        defaultMsg:'',
        isShowUeditor:false,
        config: {
          toolbars: [
            [
              'anchor', //锚点
              'undo', //撤销
              'redo', //重做
              'bold', //加粗
              'indent', //首行缩进
              'italic', //斜体
              'underline', //下划线
              'strikethrough', //删除线
              'subscript', //下标
              'fontborder', //字符边框
              'superscript', //上标
              'formatmatch', //格式刷
              'source', //源代码
              'blockquote', //引用
              'pasteplain', //纯文本粘贴模式
              'selectall', //全选
              'horizontal', //分隔线
              'removeformat', //清除格式
              'time', //时间
              'date', //日期
              'unlink', //取消链接
              'insertrow', //前插入行
              'insertcol', //前插入列
              'mergeright', //右合并单元格
              'mergedown', //下合并单元格
              'deleterow', //删除行
              'deletecol', //删除列
              'splittorows', //拆分成行
              'splittocols', //拆分成列
              'splittocells', //完全拆分单元格
              'deletecaption', //删除表格标题
              'inserttitle', //插入标题
              'mergecells', //合并多个单元格
              'deletetable', //删除表格
              'cleardoc', //清空文档
              'insertparagraphbeforetable', //"表格前插入行"
              'insertcode', //代码语言
              'fontfamily', //字体
              'fontsize', //字号
              'paragraph', //段落格式
              'edittable', //表格属性
              'edittd', //单元格属性
              'link', //超链接
              'emotion', //表情
              'spechars', //特殊字符
              'searchreplace', //查询替换
              'map', //Baidu地图
              'help', //帮助
              'justifyleft', //居左对齐
              'justifyright', //居右对齐
              'justifycenter', //居中对齐
              'justifyjustify', //两端对齐
              'forecolor', //字体颜色
              'backcolor', //背景色
              'insertorderedlist', //有序列表
              'insertunorderedlist', //无序列表
              'fullscreen', //全屏
              'directionalityltr', //从左向右输入
              'directionalityrtl', //从右向左输入
              'rowspacingtop', //段前距
              'rowspacingbottom', //段后距
              'pagebreak', //分页
              'insertframe', //插入Iframe
              'imagenone', //默认
              'imageleft', //左浮动
              'imageright', //右浮动
              'imagecenter', //居中
              'wordimage', //图片转存
              'lineheight', //行间距
              'edittip ', //编辑提示
              'customstyle', //自定义标题
              'autotypeset', //自动排版
              'touppercase', //字母大写
              'tolowercase', //字母小写
              'background', //背景
              'template', //模板
              'music', //音乐
              'inserttable', //插入表格
              'drafts', // 从草稿箱加载
              'charts', // 图表
//              'simpleupload', //单图上传
            ]
          ],
          removeFormatAttributes:'width,height',
          catchRemoteImageEnable: true,
          topOffset:60,
          initialFrameHeight:400,
        },

        goodsParamList:[
          {
            name:'',
            value:'',
            sort:''
          }
        ],
        deleteGoodsParamList:[]
      }
    },
    created () {
    },
    mounted(){
      this.getGoodsById();
    },
    computed: {

    },
    components:{
      Ueditor,
      productList,
      FileUploadRatio,
      specEdit,
      setPrice
    },
    watch : {

    },
    methods: {
      editSpec:function(){
        if(this.product.id){
          this.goodsId = this.product.id;
          this.specEditFlag = true;
        }else{
          this.$message({
            type: 'error',
            message: '请先保存商品'
          });
        }
      },
      editPrice:function(){
        if(this.product.id){
          this.goodsId = this.product.id;
          this.priceEditFlag = true;
        }else{
          this.$message({
            type: 'error',
            message: '请先保存商品'
          });
        }
      },
      setProductPrice:function(){
        let approveStatus = this.product.approveStatus;
        if(approveStatus == 2) {
          this.modifyPriceFlag = true;
        }else{
          this.saveProductPrice();
        }
      },
      saveProductPrice:function(){
        let that = this;
        this.modifyPriceFlag = false;
        this.goodsId = this.product.id;
        this.goodsSn = this.product.sn;
        if(this.$refs.setPrice){
          this.$refs.setPrice.setProductPrice(this.goodsId,this.goodsSn,function(){
            that.priceEditFlag = false;
          });
        }
      },
      getGoodsById:function(){
        let that = this;
        if(this.product.id){
          this.$api.api.getGoodsById.get({
            id:this.product.id
          }).then(
            function(res){
              that.productInfo = res.data;
              if(res.data.service){
                that.service = res.data.service.split(',');
              }
              if(res.data.invoiceType){
                that.invoiceType = res.data.invoiceType.split(',');
              }
              that.selectedGoodsCategory.id = that.product.categoryId;
              that.selectedGoodsCategory.name = that.product.categoryName;
              that.defaultMsg = that.productInfo.description;
              that.isShowUeditor = true;
              that.getGoodsParamList();
            }
          ).catch(
            function(err){
              that.$tool.excPrompt(err);
            }
          )
        }else{
          that.isShowUeditor = true;
        }
      },
      uploadCoverSuccess:function(url){
        this.cover = url;
      },
      uploadSuccess:function(url){
        this.picUrls = JSON.stringify(url);
      },
      selectCategory:function(){
        this.selectCategoryFlag = true;
      },
      getCurrentNode:function(node){
        this.selectedGoodsCategoryNode = node;
      },
      saveGoodsCategory:function(){
        this.selectedGoodsCategory = this.selectedGoodsCategoryNode;
        this.selectCategoryFlag = false
      },
      loadGoodsCategory:function(node, resolve){
        let parentId = 0;
        if (node.level !== 0) {
          parentId = node.data.id;
        }
        return this.getGoodsCategory(parentId,resolve);
      },
      getGoodsCategory:function ( parentId = 0, resolve) {
        let that = this;
        this.$api.api.getGoodsCategory.get({
          parentId :parentId
        }).then(
          function(res){
            let goodsCategoryList = res.data.rows;
            that.goodsCategoryLoading = false;
            resolve(goodsCategoryList);
          }
        ).catch(
          function(err){
            that.$tool.excPrompt(err);
          }
        )
      },
      submit:function(){
        if(this.productInfo.approveStatus == 2){
          this.modifyFlag = true;
        }else{
          this.postGoodsInfo();
        }
      },
      postGoodsInfo:function(){
        let that = this;
        this.modifyFlag = false;
        that.categoryId = this.selectedGoodsCategory.id;
        let description = this.$refs.ue.getUEContent();
        let errorMessage = '';
        if(this.name == "" && errorMessage == ''){
          errorMessage = "请输入产品名称";
        }
        if(this.picUrls == "" && errorMessage == ''){
          errorMessage = "请上传封面";
        }
        if(!this.categoryId && errorMessage == ''){
          errorMessage = "请输入分类";
        }
        if(this.retailPrice == "" && errorMessage == ''){
          errorMessage = "请输入零售价";
        }
        if(this.unitPrice == "" && errorMessage == ''){
          errorMessage = "请输入单价";
        }
        if(this.unit == "" && errorMessage == ''){
          errorMessage = "请输入单位";
        }
        if(this.shortDescription == "" && errorMessage == ''){
          errorMessage = "请输入简介";
        }
        if(description == "" && errorMessage == ''){
          errorMessage = "请输入详情描述";
        }
        //如果errorMessage非空，提示错误并返回
        if(errorMessage != ""){
          this.$tool.toast(errorMessage);
          return;
        }
        if(this.product.id){
          this.$api.api.postGoodsInfo.patch({
            id:this.product.id,
            name:this.name,
            cover:this.cover,
            picUrls:this.picUrls,
            categoryId:this.categoryId,
            retailPrice:this.retailPrice,
            unitPrice:this.unitPrice,
            unit:this.unit,
            service:this.service.toString(),
            invoiceType:this.invoiceType.toString(),
            onSaleFlag:this.onSaleFlag,
            shortDescription:this.shortDescription,
            description : description
          }).then(
            function(res){
              if(!res){
                that.saveGoodsParam();
                that.$message({
                  type: 'success',
                  message: '产品修改成功!'
                });
                that.$emit('list');
              }
            }
          ).catch(
            function(err){
              that.$tool.excPrompt(err);
            }
          )
        }else{
          this.$api.api.postGoodsInfo.post({
            name:this.name,
            cover:this.cover,
            picUrls:this.picUrls,
            categoryId:this.categoryId,
            retailPrice:this.retailPrice,
            unitPrice:this.unitPrice,
            unit:this.unit,
            service:this.service.toString(),
            invoiceType:this.invoiceType.toString(),
            onSaleFlag:this.onSaleFlag,
            shortDescription:this.shortDescription,
            description : description
          }).then(
            function(res){
              that.goodsId = res.data.id;
              that.saveGoodsParam();
              that.$message({
                type: 'success',
                message: '产品添加成功!'
              });
              that.$emit('list');
            }
          ).catch(
            function(err){
              that.$tool.excPrompt(err);
            }
          )
        }
      },
      handleSelectionChange:function(){
        console.log("handleSelectionChange");
      },
      reSet:function(){
        this.name = this.product.name || '';
        this.picUrls = this.product.picUrls || '{}';
        this.selectedGoodsCategory.id = this.product.categoryId || '';
        this.selectedGoodsCategory.name = this.product.categoryName || '';
        this.retailPrice = this.product.retailPrice || '';
        this.unitPrice = this.product.unitPrice || '';
        this.unit = this.product.unit || '';
        this.onSaleFlag = this.product.onSaleFlag || 0,
        this.shortDescription = this.product.shortDescription || '';
      },
      saveGoodsParam:function(){
        let that = this;
        this.goodsParamList.forEach(item => {
          that.postGoodsParam(item);
        });
        this.deleteGoodsParamList.forEach(item => {
          that.removeGoodsParam(item);
        });
      },
      getGoodsParamList:function(){
        let that = this;
        this.$api.api.goodsParam.get({goodsId : this.goodsId}).then(
          function(res){
            if(res.data.length > 0){
              that.goodsParamList = res.data;
            }
          }
        ).catch(
          function(err){
            that.$tool.excPrompt(err);
          }
        )
      },
      removeGoodsParam:function(id){
        let that = this;
        this.$api.api.goodsParamById.delete({goodsId : this.goodsId,id:id}).then(
          function(res){

          }
        ).catch(
          function(err){
            that.$tool.excPrompt(err);
          }
        )
      },
      postGoodsParam:function(postData){
        let that = this;
        if(!postData.name && !postData.value && !postData.sort ){
          return;
        }
        postData.goodsId = this.goodsId;
        if(postData.id){
          this.$api.api.goodsParam.patch(postData).then(
            function(res){

            }
          ).catch(
            function(err){
              that.$tool.excPrompt(err);
            }
          )
        }else{
          this.$api.api.goodsParam.post(postData).then(
            function(res){

            }
          ).catch(
            function(err){
              that.$tool.excPrompt(err);
            }
          )
        }
      },
      addGoodsParamList:function(){
        let obj = {
          name:'',
          value:'',
          sort:''
        };
        this.goodsParamList.push(obj);
      },
      removeGoodsParamList:function(index,id){
        if(id){
          this.deleteGoodsParamList.push(id);
        }
        this.goodsParamList.splice(index,1);
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .productAdd-layer
    position:relative;
    width:100%;
    padding: 10px;
    box-sizing: border-box;
    background: #fff;
    .img-row
      clear:both;
      height:5em;
      line-height:5em;
      margin-bottom:10px;
      >div
        float:left;
      .label
        margin-right:10px;
        width:6em;
        line-height:5em;
        text-align:right;
      .upload-box
        .cover-upload
          width:5em;
          height:5em;
        .file-upload
          height:5em;
        .desc
          clear:both;
          font-size:12px;
          color:#f33;
          line-height:18px;
    .row
      clear:both;
      min-height:3em;
      line-height:3em;
      margin-bottom:10px;
      >div
        float:left;
      .label
        margin-right:10px;
        width:6em;
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
      margin-top:10px;
</style>
