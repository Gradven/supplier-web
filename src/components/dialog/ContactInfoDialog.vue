<template>
  <div class="ContactInfoLayer">
    <div class="ContactInfoBox">
      <div v-if="!isGeted">
        <div class="row">
          <div class="input">
            <Icon class="icon" name="user"></Icon>
            <input type="text" v-model="contacts" placeholder="联系人" autocomplete="off" />
          </div>
        </div>
        <div class="row">
          <div class="input">
            <Icon class="icon" name="user"></Icon>
            <input type="text" v-model="sendTarget" placeholder="请输入您的手机号" autocomplete="off" />
          </div>
        </div>
        <div class="row">
          <div class="input">
            <Icon class="icon" name="shield"></Icon>
            <input type="text" v-model="verifyCode" placeholder="请输入验证码" class="shield" autocomplete="off" />
            <div class="shieldBtn" :class="{gray:countNum>0}" @click="getVerifyCode">
              {{countNum>0?countNum:'获取验证码'}}
            </div>
          </div>
        </div>
        <div class="btn" @click="getContact">获取联系方式</div>
        <div class="btn cancel" @click.stop="$emit('close')">取消</div>
      </div>
      <div class="contactInfo" v-else>
        <div class="name">
          {{contactInfo.name}}
        </div>
        <div class="row" v-if="contactInfo.mobile">
          手机号:{{contactInfo.mobile}}
        </div>
        <div class="row" v-if="contactInfo.email">
          邮箱:{{contactInfo.email}}
        </div>
        <div class="btn" @click.stop="$emit('close')">确定</div>
      </div>
    </div>
  </div>
</template>
<script>
  import '../../components/svg/user'
  import '../../components/svg/shield'
  import Icon from '../../components/common/Icon.vue'
  export default {
    props:{
      data:{}
    },
    created () {

    },
    mounted(){
    },
    data () {
      return {
        countNum:0,
        sendTarget:"",
        verifyCode:"",
        contacts:"",
        isGeted:false,
        contactInfo:{}
      }
    },
    components: {
      Icon
    },
    methods: {
      getVerifyCode:function(type){
        let that = this;
        // 还在倒计时 直接返回
        if(that.countNum>0){
          return;
        }
        // 联系人未输入 提示错误并返回
        if(this.contacts == ""){
          this.$tool.toast("请输入联系人", 1000);
          return;
        }
        // 账号未输入 提示错误并返回
        else if(this.sendTarget == ""){
          this.$tool.toast("请输入手机号", 1000);
          return;
        }
        that.countNum = 60;
        this.$tool.countDown(60,function(count){
          that.countNum = count;
        });
        this.$api.api.getContactInfoVerifyCode.get({
          targetUserId:this.data.targetUserId,
          projectId:this.data.projectId,
          sendTarget:this.sendTarget,
          contacts:this.contacts
        }).then(
          function(res){
          }
        ).catch(
          function(err){
            that.$tool.excPrompt(err);
          }
        )
      },
      getContact:function(){
        let that = this;
        // 账号未输入 提示错误并返回
        if(this.sendTarget == ""){
          this.$tool.toast("请输入手机号", 1000);
          return;
        }
        this.$api.api.getContactInfo.get({
          targetUserId:this.data.targetUserId,
          projectId:this.data.projectId,
          verifyCode:this.verifyCode
        }).then(
          function(res){
            that.isGeted = true;
            that.contactInfo = res.data;
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
  .ContactInfoLayer
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    transition: opacity .3s ease;
    display: flex;
    align-items:center;
    justify-content:center;
    .ContactInfoBox
      width:500px;
      padding: 20px 0;
      border-radius:5px;
      background:#fff;
      .row
        font-size:16px;
        width:366px;
        height:2em;
        margin:20px auto 0;
        &:first-child
          margin-top:0;
        .input
          position:relative;
          .icon
            position:absolute;
            left:1px;
            top:0;
            width:2em;
            height:2em;
            padding:5px;
            color:#bba784;
            box-sizing:border-box;
          input
            font-size:16px;
            width:100%;
            height:2em;
            line-height:2em;
            padding: 0 5px 0 2em;
            &.shield
              width:200px;
            &.camera
              width:200px;
          .shieldBtn
            float:right;
            width:166px;
            color:#fff;
            cursor:pointer;
            height:2em;
            line-height:2em;
            text-align:center;
            background:#bba784;
            &.gray
              background:#8a8a8a;
      .btn
        margin:10px auto;
        width:366px;
        height:3em;
        color:#fff;
        cursor:pointer;
        text-align:center;
        line-height:3em;
        border-radius:5px;
        background:#bba784;
        &.cancel
          color:#bba784;
          background:#fff;
          border:1px solid #bba784;
      .contactInfo
        .name
          font-size:20px;
          text-align:center;
        .row
          line-height:2em;
          margin:0 auto;
</style>
