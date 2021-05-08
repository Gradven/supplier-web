<template>
  <div class="login-layer">
    <div class="login-box">
      <div class="title">红渠  -  供应商管理平台</div>
      <div class="login-row">
        <div class="lr-label">用&nbsp;户&nbsp;名:</div>
        <el-input v-model="account" placeholder="请输入用户名" auto-complete="off"></el-input>
      </div>
      <div class="login-row">
        <div class="lr-label">密&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;码:</div>
        <el-input type="password" v-model="password" placeholder="请输入密码" auto-complete="off"></el-input>
      </div>
      <div class="x-btn">
        <el-button type="primary" class="login-btn" @click="login">登录</el-button>
      </div>
      <div class="register">
        <span @click="register">品牌入驻>></span>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'
  import { Base64 } from 'js-base64';
  import '../../components/svg/arrow_right'
  import Icon from '../../components/common/Icon.vue'

  export default{
    computed: {
      // 使用对象展开运算符将 getter 混入 computed 对象中
      ...mapGetters([
        'userInfo'
      ])
    },
    created () {
    },
    mounted(){

    },
    watch:{
      '$route':['routeChange']
    },
    data () {
      return {
        account:"",
        password:""
      }
    },
    components:{
      Icon
    },
    methods: {
      ...mapMutations({
        setUserInfo: 'setUserInfo' // 将 `this.add()` 映射为 `this.$store.commit('increment')`
      }),
      login:function () {
        let that = this;
        let errorMessage = '';
        if(this.account == "" && errorMessage == ''){
          errorMessage = "请输入用户名";
        }
        if(this.password == "" && errorMessage == ''){
          errorMessage = "请输入密码";
        }
        //如果errorMessage非空，提示错误并返回
        if(errorMessage != ""){
          this.$tool.toast(errorMessage);
          return;
        }
        this.$api.api.supplierUserLogin.post({
          account:this.account,
          password:Base64.encode(this.password),
        }).then(
          function(res){
            if(res.data.errorCode){
              return;
            }
            let userInfo = res.data;
            that.setUserInfo(userInfo);
            sessionStorage.setItem('userInfo',JSON.stringify(userInfo));
            that.$message({
              type: 'success',
              message: '登录成功!'
            });
            that.$router.push("/");
          }
        ).catch(
          function(err){
            that.$tool.excPrompt(err);
          }
        );
      },
      register:function(){
        this.$router.push("/register")
      }
    }
  }
</script>
<style lang="stylus" scoped>
  @import "../../style/config.styl";
  html
    background:#fff;
  .login-layer
    position:relative;
    height:100%;
    background:url("../../../static/image/bg/login.png") top center no-repeat;
    background-size:cover;
    .login-box
      position:absolute;
      top:calc(50% - 250px);
      left:calc(50% - 200px);
      padding: 40px;
      width: 400px;
      border-radius: 5px;
      box-sizing:border-box;
      background:rgba(255,255,255,.7);
      border: 1px solid #C9CDD4;
      .title
        font-size:24px;
        text-align:center;
        line-height:30px;
      .login-row
        display: flex;
        display: -webkit-flex;
        margin: 20px 0;
        justify-content: center;
        align-items: center;

      .x-box-shadow
        -moz-box-shadow: 0 0 20px #dfdfdf;
        -webkit-box-shadow: 0 0 20px #dfdfdf;
        box-shadow: 0 0 20px #dfdfdf;

      .lr-label
        width: 60px;
        margin-right: 25px;
        font-size: 18px;
        color: #333333;
        text-align: right;

      .x-btn
        margin-top:20px;
        text-align: center;

      .login-btn
        width: 100%;
      .register
        margin-top: 20px;
        text-align:right;
        color:#409EFF;
        >span
          cursor:pointer;
</style>
