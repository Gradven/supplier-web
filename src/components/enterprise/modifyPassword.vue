<template>
  <div class="modifyPassword-layer">
    <div class="row">
      <div class="label">旧密码:</div>
      <el-input type="password" v-model="oldPassword" placeholder="请输入旧密码" auto-complete="off"></el-input>
    </div>
    <div class="row">
      <div class="label">新密码:</div>
      <el-input type="password" v-model="newPassword" placeholder="请输入新密码" auto-complete="off"></el-input>
    </div>
    <div class="row">
      <div class="label">确认新密码:</div>
      <el-input type="password" v-model="rePassword" placeholder="请确认新密码" auto-complete="off"></el-input>
    </div>
    <div class="btn-banner">
      <el-button type="primary" class="apply" @click.stop="modify">修改密码</el-button>
    </div>
  </div>
</template>

<script>

  export default{
    data () {
      return {
        oldPassword:"",
        newPassword:"",
        rePassword:""
      }
    },
    created () {
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
      modify:function(){
        let that = this;
        let postData = {};
        if(!this.oldPassword){
          this.$tool.toast('请输入原始密码！', 1000);
          return;
        }
        if(!this.newPassword){
          this.$tool.toast('请输入新密码！', 1000);
          return;
        }
        if(!this.$tool.passwordTest(this.newPassword)){
          this.$tool.toast('密码最少6位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符！', 1000);
          return;
        }
        if(this.newPassword == this.rePassword){
          postData.oldPassword = Base64.encode(this.oldPassword)
          postData.newPassword = Base64.encode(this.newPassword)
          this.$api.api.modifyPassword.patch(postData).then(
            function(res){
              that.$tool.toast('修改成功！', 1000);
              that.$router.push("/login");
            }
          ).catch(
            function(err){
              that.$tool.excPrompt(err);
            }
          )
        }else{
          this.$tool.toast('两次密码输入不一致！', 1000)
        }
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .modifyPassword-layer
    position:relative;
    width:100%;
    padding: 10px;
    background: #fff;
  .row
    margin:0 auto 10px;
    width:400px;
    height:3em;
    >div
      float:left;
    .label
      margin-right:0;
      padding-right:10px;
      width:100px;
      text-align:right;
      display:inline-block;
      line-height:3em;
      box-sizing:border-box;
    .el-input
      width:300px;
      height:100%;
    .file-upload
      height:3em;
  .btn-banner
    clear:both;
    width:300px;
    margin:0 auto;
    padding-top:20px;
    .apply
      width:100%;
</style>
