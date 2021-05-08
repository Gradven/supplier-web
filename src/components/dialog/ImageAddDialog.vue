<template>
  <div class="imageAddLayer">
    <div class="imageAddContainer">
      <div class="imageAddBox">
        <div class="titleBar">
          <label>上传图片</label><div class="close" @click="$emit('close')"></div>
        </div>
        <div class="form">
          <img :src="postImageData.uri || imageUri" id="selectfiles" class="pointer" />
          <div class="row">
            <div class="label">标题<span class="x-require">*</span>:</div>
            <div class="input">
              <input type="text" class="input" v-model="postImageData.title" autocomplete="off" />
            </div>
          </div>
          <div class="btnBanner">
            <button class="confirm" @click="postCmsRes">
              确定
            </button>
            <button class="cancel" @click="$emit('close')">
              取消
            </button>
          </div>
        </div>
      </div>
    </div>
    <remoteJs src='../../../static/js/ossUpload/plupload.full.min.js' ></remoteJs>
  </div>
</template>
<script>
  import remoteJs from '../RemoteJs.vue'
  export default {
    created () {

    },
    mounted(){
      let that = this;
      setTimeout(function(){
        that.uploadInit()
      },1000)
    },
    data () {
      return {
        imageUri:'/static/image/icon/add.png',
        loading:'/static/image/loading.gif',
        postImageData:{
          uri:'',
          type:1, // 1:图片，2:视频
        }
      }
    },
    components: {
      remoteJs
    },
    methods: {
      uploadInit: function(){
        var that = this;
        var uploader = new plupload.Uploader({
          runtimes : 'html5,flash,silverlight,html4',
          browse_button : 'selectfiles',
          multi_selection: false,
          // container: document.getElementById('container'),
          flash_swf_url : '/static/js/ossUpload/Moxie.swf',
          silverlight_xap_url : '/static/js/ossUpload/Moxie.xap',
          url : 'http://oss.aliyuncs.com',

          init: {
            PostInit: function() {
              that.imgUrl = ""
            },

            FilesAdded: function(up, files) {
              that.imageUri = that.loading;
              plupload.each(files, function(file) {
                that.getPolicies(up, file.name, true);
              });
            },

            BeforeUpload: function(up, file) {
            },

            UploadProgress: function(up, file) {
            },

            FileUploaded: function(up, file, info) {
              if (info.status == 200)
              {
                that.postImageData.uri = that.imgUrl;
              }
              else
              {
                that.$tool.toast(info.response, 3000)
              }
            },

            Error: function(up, err) {
              that.$tool.toast(err.message, 3000)
            }
          }
        });

        uploader.init();
      },
      getPolicies:function(up, filename, ret){
        let that = this;
        this.$api.api.policies.get({}).then(
          function(res){
            that.uploadImg(res.data, up, filename, ret);
          }
        ).catch(
          function(err){
            that.$tool.excPrompt(err);
          }
        )
      },
      uploadImg(data, up, filename, ret){
        var accessid    = data.accessid;
        var policy      = data.policy;
        var signature   = data.signature;
        var dirname     = data.dir;
        var host        = data.host;

        var suffix = '';
        var filePath = '';

        function random_string(len) {
          len = len || 32;
          var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz0123456789';
          var maxPos = chars.length;
          var pwd = '';
          for (var i = 0; i < len; i++) {
            pwd += chars.charAt(Math.floor(Math.random() * maxPos));
          }
          return pwd;
        }

        function get_suffix(filename) {
          var pos = filename.lastIndexOf('.');
          var suffix = '';
          if (pos != -1) {
            suffix = filename.substring(pos);
          }
          return suffix;
        }

        if (filename != '') {
          suffix = get_suffix(filename);
          let newFileName = random_string(32) + suffix
          this.postImageData.resKey = newFileName;
          filePath = dirname + newFileName;
        }
        var new_multipart_params = {
          'key' : filePath,
          'policy': policy,
          'OSSAccessKeyId': accessid,
          'success_action_status' : '200', //让服务端返回200,不然，默认会返回204
          'signature': signature,
        };

        up.setOption({
          'url': host,
          'multipart_params': new_multipart_params
        });
        this.imgUrl = host+"/"+filePath;
        up.start();
      },
      postCmsRes:function(){
        let that = this;
        let errorMessage = ""
        if( !this.postImageData.uri || this.postImageData.uri == "" ){
          errorMessage = '请上传图片！'
        }
        if( errorMessage == '' && !this.postImageData.title ){
          errorMessage = '请输入标题！'
        }
        if( errorMessage != '' ){
          this.$tool.toast(errorMessage, 1000)
          return;
        }
        this.$api.api.postCmsRes.post(this.postImageData).then(
          function(res){
            that.postCmsResSuccess(res);
          }
        ).catch(
          function(err){
            that.$tool.excPrompt(err);
          }
        )
      },
      postCmsResSuccess:function(res){
        this.$tool.toast("上传成功", 1000);
        this.$emit('success');
      }
    }
  }
</script>
<style lang="scss" scoped>
  .imageAddLayer {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    display: table;
    transition: opacity .3s ease;
    .imageAddContainer{
      display: table-cell;
      vertical-align: middle;
      .imageAddBox{
        margin:0 auto;
        width: 600px;
        height: 400px;
        background: #fff;
        border-radius: 10px;
        font-family: "Microsoft YaHei UI";
        .titleBar{
          display: flex;
          display: -webkit-flex;
          margin: 0 28px;
          padding: 25px 10px;
          justify-content: space-between;
          align-items: center;
          font-size: 20px;
          color: #333333;
          letter-spacing: 1px;
          border-bottom: 1px solid #dfdfdf;
        }
        .form {
          margin: 20px 0;
          > img {
            margin: 0 auto;
            width: 160px;
            height: 160px;
            object-fit: contain;
            display: block;
          }
          .row{
            margin:10px auto;
            width: 305px;
            height: 2em;
            line-height: 2em;
            .label{
              display: inline-block;
              width:100px;
              height: 2em;
              text-align: right;
            }
            .input{
              width:200px;
              height: 2em;
              display: inline-block;
            }
          }
          .btnBanner{
            padding: 20px 10px 40px;
            display: flex;
            justify-content: center;
            .confirm{
              width: 150px;
              height: 40px;
              color: #ffffff;
              font-size: 16px;
              background-color: #3fa82e;
              font-family: "Microsoft YaHei UI";
              text-decoration: none;
              border: 0;
              border-radius: 4px;
              cursor: pointer;
              outline: none;
            }
            .cancel {
              width: 150px;
              height: 40px;
              font-size: 16px;
              background-color: #FFFFFF;
              font-family: "Microsoft YaHei UI";
              color: #717478;
              margin-left: 30px;
              text-decoration: none;
              border: 1px solid #dfdfdf;
              border-radius: 4px;
              cursor: pointer;
              outline: none;
            }
          }
        }
        .close{
          color: #333333;
          border-radius: 12px;
          text-align: center;
          margin-top: -20px;
          margin-right: -10px;
          height: 25px;
          width: 25px;
          font-size: 20px;
          cursor: pointer;
        }
        .close::before {
          content: "\2716";
        }
      }
    }

  }
</style>
