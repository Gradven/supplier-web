<template>
  <div class="ueditor-layer">
    <script :id="ueId" type="text/plain"></script>
  </div>
</template>
<script>
  import plupload from 'plupload'
  import '../../../static/js/ue/ueditor.config.js'
  import '../../../static/js/ue/ueditor.all.js'
  import '../../../static/js/ue/lang/zh-cn/zh-cn.js'
  import '../../../static/js/ue/ueditor.parse.min.js'
//  import '../../../static/js/ue/xiumi/xiumi-ue-dialog-v5.js'
//  import '../../../static/js/ue/xiumi/xiumi-ue-v5.css'
  export default {
    name: 'UE',
    data () {
      return {
        editor: null
      }
    },
    props: {
      defaultMsg: {
        type: String
      },
      config: {
        type: Object
      },
      ueId:{
        type:String
      }
    },
    mounted() {
      const that = this;
      UE.registerUI('imgupload', function (editor, uiName) {
        var btn = new UE.ui.Button({
          id     : that.ueId,
          name   : 'imgupload',
          title  : '单图上传',
          onclick: function () {
            console.log("单图上传");
          }
        });

        return btn;
      });
      this.editor = UE.getEditor(this.ueId, this.config); // 初始化UE
      this.editor.addListener("ready", function () {
        if(that.defaultMsg){
          that.editor.setContent(that.defaultMsg); // 确保UE加载完成后，放入内容。
        }
      });

      setTimeout(function(){
        that.uploadInit();
        that.$emit('ready')
      },500);
    },
    methods: {
      getUEContent() { // 获取内容方法
        return this.editor.getContent()
      },
      setUEContent(html){ // 写入内容方法
        return this.editor.setContent(html);
      },
      uploadInit: function(){
        var that = this;
        var uploader = new plupload.Uploader({
          runtimes : 'html5,flash,silverlight,html4',
          browse_button : that.ueId+'_body',
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
//                that.postArticleData.image = that.imgUrl;
                that.editor.execCommand('inserthtml', '<img src="'+that.imgUrl+'" style="max-width:100%" />');
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
          let newFileName = random_string(32) + suffix;
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
      }
    },
    destroyed() {
      this.editor.destroy();
    }
  }
</script>
<style lang="scss">
  .edui-default .edui-editor{
    border:none !important;
  }
  .edui-button{
    &.edui-for-imgupload{
      .edui-button-wrap{
        .edui-button-body{
          .edui-icon {
            background-position: -380px 0px;
          }
        }
      }
    }
  }
</style>
<style lang="stylus" scoped>
  .ueditor-layer
    position:relative;
    max-width:900px;
    border:1px solid #ccc;
</style>
