<template>
  <div class="entDetail-layer">
    <div class="row">
      <div class="label"><span class="red">*</span>供应商名称:</div>
      <el-input v-model="name" placeholder="请输入供应商名称" auto-complete="off"></el-input>
    </div>
    <div class="row">
      <div class="label"><span class="red">*</span>供应商法人:</div>
      <el-input v-model="legalRepresentative" placeholder="请输入供应商法人" auto-complete="off"></el-input>
    </div>
    <div class="row">
      <div class="label"><span class="red">*</span>统一社会信用代码:</div>
      <el-input v-model="creditCode" placeholder="请输入统一社会信用代码" auto-complete="off"></el-input>
    </div>
    <div class="row">
      <div class="label"><span class="red">*</span>登记机关所在省份:</div>
      <el-input v-model="regProvince" placeholder="请输入登记机关所在省份" auto-complete="off"></el-input>
    </div>
    <div class="row">
      <div class="label"><span class="red">*</span>电子邮箱:</div>
      <el-input v-model="email" placeholder="请输入电子邮箱" auto-complete="off"></el-input>
    </div>
    <div class="row">
      <div class="label"><span class="red">*</span>地址:</div>
      <el-input v-model="address" placeholder="请输入地址" auto-complete="off"></el-input>
    </div>
    <div class="row">
      <div class="label"><span class="red">*</span>固定电话:</div>
      <el-input v-model="phone" placeholder="请输入固定电话" auto-complete="off"></el-input>
    </div>
    <div class="row">
      <div class="label"><span class="red">*</span>营业执照图片:</div>
      <FileUploadRatio  class="file-upload"
                        :imageUri="licenseImg || imageAddUri" ref="fileUpload" @success="uploadSuccess"></FileUploadRatio>
    </div>
    <div class="row">
      <div class="label"><span class="red">*</span>联系人:</div>
      <el-input v-model="contact" placeholder="请输入联系人" auto-complete="off"></el-input>
    </div>
    <div class="row">
      <div class="label"><span class="red">*</span>联系人手机号码:</div>
      <el-input v-model="mobile" placeholder="请输入联系人手机号码" auto-complete="off"></el-input>
    </div>
    <div class="row">
      <div class="label"><span class="red">*</span>退货地址:</div>
      <el-input v-model="serviceAddress" placeholder="请输入退货地址" auto-complete="off"></el-input>
    </div>
    <div class="row">
      <div class="label">客服QQ号:</div>
      <el-input v-model="serviceQQ" placeholder="请输入客服QQ号" auto-complete="off"></el-input>
    </div>
    <div class="row">
      <div class="label"><span class="red">*</span>客服电话:</div>
      <el-input v-model="serviceTel	" placeholder="请输入客服电话" auto-complete="off"></el-input>
    </div>
    <div class="row">
      <div class="label">客服微信号:</div>
      <el-input v-model="serviceWeixin" placeholder="请输入客服微信号" auto-complete="off"></el-input>
    </div>
    <div class="btn-banner">
      <el-button type="primary" class="apply" @click.stop="modify">修改企业信息</el-button>
    </div>
  </div>
</template>

<script>
  import FileUploadRatio from '../dialog/FileUploadRatio.vue'

  export default{
    data () {
      return {
        imageAddUri:"/static/image/icon/add.png",
        id:"",
        name:"",
        legalRepresentative:"",
        creditCode:"",
        regProvince:"",
        email:"",
        address:"",
        phone:"",
        licenseImg:"",
        contact:"",
        mobile:"",
        serviceAddress:"",
        serviceQQ:"",
        serviceTel:"",
        serviceWeixin:"",

      }
    },
    created () {
      this.getSupplierInfo();
    },
    mounted(){

    },
    computed: {

    },
    components:{
      FileUploadRatio
    },
    watch : {

    },
    methods: {
      uploadSuccess:function(url){
        this.licenseImg = url;
      },
      getSupplierInfo:function () {
        let that = this;
        this.$api.api.getSupplierInfo.get({}).then(
          function(res){
            that.id = res.data.id
            that.name = res.data.name
            that.legalRepresentative = res.data.legalRepresentative
            that.creditCode = res.data.creditCode
            that.regProvince = res.data.regProvince
            that.email = res.data.email
            that.address = res.data.address
            that.phone = res.data.phone
            that.licenseImg = res.data.licenseImg
            that.contact = res.data.contact
            that.mobile = res.data.mobile
          }
        ).catch(
          function(err){
            that.$tool.excPrompt(err);
          }
        );
      },
      modify:function () {
        let that = this;
        let errorMessage = '';
        if(this.name == "" && errorMessage == ''){
          errorMessage = "请输入供应商名称";
        }
        if(this.legalRepresentative == "" && errorMessage == ''){
          errorMessage = "请输入供应商法人";
        }
        if(this.creditCode == "" && errorMessage == ''){
          errorMessage = "请输入统一社会信用代码";
        }
        if(this.regProvince == "" && errorMessage == ''){
          errorMessage = "请输入登记机关所在省份";
        }
        if(this.email == "" && errorMessage == ''){
          errorMessage = "请输入电子邮箱";
        }
        if(this.address == "" && errorMessage == ''){
          errorMessage = "请输入地址";
        }
        if(this.phone == "" && errorMessage == ''){
          errorMessage = "请输入固定电话";
        }
        if(this.licenseImg == "" && errorMessage == ''){
          errorMessage = "请上传营业执照";
        }
        if(this.contact == "" && errorMessage == ''){
          errorMessage = "请输入联系人";
        }
        if(this.mobile == "" && errorMessage == ''){
          errorMessage = "请输入联系人手机号码";
        }
        if(this.serviceAddress == "" && errorMessage == ''){
          errorMessage = "请输入退货地址";
        }
        if(this.serviceQQ == "" && this.serviceWeixin == "" && errorMessage == ''){
          errorMessage = "请输入客服QQ号或客服微信号";
        }
        if(this.serviceTel == "" && errorMessage == ''){
          errorMessage = "请输入客服电话";
        }
        //如果errorMessage非空，提示错误并返回
        if(errorMessage != ""){
          this.$tool.toast(errorMessage);
          return;
        }
        this.$api.api.supplierInfoModify.patch({
          id:this.id,
          name:this.name,
          legalRepresentative:this.legalRepresentative,
          creditCode:this.creditCode,
          regProvince:this.regProvince,
          email:this.email,
          address:this.address,
          phone:this.phone,
          licenseImg:this.licenseImg,
          contact:this.contact,
          mobile:this.mobile,
          serviceAddress:this.serviceAddress,
          serviceQQ:this.serviceQQ,
          serviceWeixin:this.serviceWeixin,
          serviceTel:this.serviceTel,
        }).then(
          function(res){
            that.$tool.toast("修改成功,等待审核", 1000);
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
  .entDetail-layer
    position:relative;
    width:100%;
    padding: 10px;
    box-sizing: border-box;
    background: #fff;
    .row
      float:left;
      margin-bottom:10px;
      width:50%;
      min-height:3em;
      >div
        float:left;
      .label
        padding-right:10px;
        width:10em;
        text-align:right;
        display:inline-block;
        line-height:3em;
        box-sizing:border-box;
        .red
          color:#f33;
      .el-input
        width:300px;
        height:100%;
      .file-upload
        width:6em;
        height:6em;
    .btn-banner
      clear:both;
      width:300px;
      margin:0 auto;
      padding-top:20px;
      .apply
        width:100%;
</style>
