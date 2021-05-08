<template lang="html">
  <div class="file-upload-container">
    <div class="imgList" v-if="isMulti">
      <div class="item" :key="index" v-for="(item,index) in cropStrList">
        <div class="delete" @click.stop="removeCrop(item)"></div>
        <img :src="item" @click.stop="bigImg = item" />
      </div>
      <div class="img_add_box" v-if="cropStrList.length < maxSize" >
        <img class="img_add" :src="imageUri" :id="id" />
      </div>
    </div>
    <div class="imgBox" v-else>
      <img class="img_add" :src="cropStr || imageUri"  :id="id" v-if="imageUri" />
      <div class="btn_add"  :id="id" v-if="btnDesc">
        {{btnDesc}}
      </div>
    </div>
    <div class="loading-container" v-show="loading">
      <i class="el-icon-loading"></i>
    </div>
    <div class="crop-container" v-if="imgSrc!=''" v-show="openCrop">
      <div class="close" @click.stop="openCrop = false"></div>
      <vueCropper
        ref="cropper"
        :img="imgSrc"
        :outputSize="option.size"
        :outputType="option.type"
        :info="option.info"
        :autoCrop="option.autoCrop"
        :autoCropWidth="option.autoCropWidth"
        :autoCropHeight="option.autoCropHeight"
        :fixed="option.fixed"
        :fixedNumber="option.fixedNumber"
      ></vueCropper>
      <div class="btn-banner">
        <div class="cancel" @click.stop="cancel">
          使用原图
        </div>
        <div class="ok" @click.stop="ok">
          确定
        </div>
      </div>
    </div>
    <BigImageDialog :url="bigImg" v-if="bigImg" @close="bigImg = ''"></BigImageDialog>
  </div>
</template>

<script>
  import vueCropper from 'vue-cropper'
  import plupload from 'plupload'
  import BigImageDialog from './BigImageDialog'

  export default {
    props: {
      index:{},
      isMulti:{},
      maxSize:{},
      imageList:{},
      btnDesc:{},
      imageUri:{},
      fixed:{},
      width:{
        default:200
      },
      height:{
        default:200
      }
    },
    data: function () {
      return {
        id:'FileUploadRatio' + Math.random(1),
        loading: false,
        openCrop: false,
        cropStr:"",
        cropStrList:this.imageList,
        imgSrc:"",
        option: {
          size: 1,
          full: false,
          outputType: 'png',
          info:true,
          autoCrop:true,
          autoCropWidth:this.width,
          autoCropHeight:this.height,
          fixed:this.fixed,
          fixedNumber:[this.width,this.height],
          canMove: true,
          fixedBox: false,
          original: false,
          canMoveBox: false,
          cropStr:"",
        },
        bigImg:'',
      }
    },
    created(){

    },
    mounted () {
      this.init();
    },
    computed: {

    },
    components: {
      vueCropper,
      BigImageDialog
    },
    methods: {
      init:function(){
        let that = this;
        if(typeof(plupload) != "undefined"){
          this.uploadInit()
        }else{
          setTimeout(function(){
            that.init();
          },100);
        }
      },
      removeCrop:function(item){
        this.$tool.removeFormArr(item,this.cropStrList);
        this.$emit("success",this.cropStrList,this.index);
      },
      change:function (imgUrl) {
        this.openCrop = true;
        this.loading = false;
        this.imgSrc = imgUrl;
      },
      cancel:function(){
        this.openCrop = false;
        let cropStr = this.imgSrc;
        if(this.isMulti){
          this.cropStrList.push(cropStr);
          this.$emit("success",this.cropStrList,this.index);
        }else{
          this.cropStr = cropStr;
          this.$emit("success",this.cropStr,this.index);
        }
      },
      ok:function(){
        this.openCrop = false;
        let cropper = this.$refs.cropper;
        let rotate = cropper.rotate;
        let scale = cropper.scale;

        let width = cropper.cropW
        let height = cropper.cropH
        let trueWidth = cropper.trueWidth
        let trueHeight = cropper.trueHeight
        let cropOffsertX = cropper.cropOffsertX
        let cropOffsertY = cropper.cropOffsertY
        let imgW = trueWidth * scale
        let imgH = trueHeight * scale
        // 图片x轴偏移
        let dx = (cropper.x - cropOffsertX) + trueWidth * (1 - scale) / 2;
        // 图片y轴偏移
        let dy = (cropper.y - cropOffsertY) + trueHeight * (1 - scale) / 2;
        let w = width;
        if(dx > 0){
          w = width - dx;
        }
        let h = height;
        if(dy > 0){
          h = height - dy;
        }
        let cropStr = this.imgSrc + '?x-oss-process=image/crop,x_'+parseInt(-dx/scale)+',y_'+parseInt(-dy/scale)+',w_'+parseInt(w/scale)+',h_'+parseInt(h/scale)+'';

        if(this.isMulti){
          this.cropStrList.push(cropStr);
          this.$emit("success",this.cropStrList,this.index);
        }else{
          this.cropStr = cropStr;
          this.$emit("success",this.cropStr,this.index);
        }
      },
      uploadInit: function(){
        var that = this;
        var uploader = new plupload.Uploader({
          runtimes : 'html5,flash,silverlight,html4',
          browse_button : this.id,
          multi_selection: false,
          // container: document.getElementById('container'),
          flash_swf_url : '/static/js/ossUpload/Moxie.swf',
          silverlight_xap_url : '/static/js/ossUpload/Moxie.xap',
          url : 'http://oss.aliyuncs.com',
          filters: {
            mime_types : [ //只允许上传图片和zip文件
              { title : "Image files", extensions : "jpg,gif,png,bmp" }
            ],
            max_file_size : '5mb', //最大只能上传5mb的文件
            prevent_duplicates : false //不允许选取重复文件
          },
          init: {
            PostInit: function() {
              that.imgUrl = ""
            },

            FilesAdded: function(up, files) {
              that.loading = true;
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

                that.change(that.imgUrl);
              }
              else
              {
                that.$tool.toast(info.response, 3000)
              }
            },

            Error: function(up, err) {
              that.loading = false;
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
          let timeState = new Date().getTime()
          filePath = dirname + random_string(32) + timeState + suffix;
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
        this.imgUrl = host+"/"+filePath
        up.start();
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .file-upload-container {
    * {
      box-sizing: border-box;
    }

    img, canvas {
      -webkit-user-select: none;
      -khtml-user-select: none;
      -moz-user-select: none;
      -o-user-select: none;
      -webkit-user-drag: none;
    }

    .imgList{
      height: 100%;
      .item,.img_add_box,
      img{
        float:left;
        width:auto;
        height:100%;
        margin-right:10px;
      }
      .item{
        position:relative;
        .delete{
          position:absolute;
          top:-5px;
          right:5px;
          width:10px;
          height:10px;
          cursor:pointer;
          background:url("/static/image/icon/close1.png") center center no-repeat;
          background-size:contain;
          z-index:5;
          &:hover{
            background:url("/static/image/icon/close.png") center center no-repeat;
            background-size:contain;
          }
        }
      }
    }

    .imgBox {
      height: 100%;
    }

    .dest-image {
      display: block;
      height: 100%;
      width: 100%;
      position: relative;
      top: 0;
      left: 0;
      z-index: 2;
    }

    .add{
      height: 100%;
      img{
        display: block;
        height: 100%;
      }
    }
    .img_add{
      display: block;
      cursor:pointer;
      height: 100%;
      object-fit:contain;
    }

    .btn_add{
      width:100px;
      height:34px;
      cursor:pointer;
      line-height:34px;
      text-align:center;
      border-radius:5px;
      background:#e8d8b2;
    }


    .file-upload-icon {
      display: inline-block;
      border: 1px solid #000000;
      position: relative;
      z-index: 1;
      cursor: pointer;
      height: 100%;
      width: 100%;

      &:before,
      &:after {
        content: '';
        display: block;
        position: absolute;
        z-index: 1;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }

      &:before {
        width: 40%;
        height: 1px;
        background-color: #000000;
      }

      &:after {
        height: 40%;
        width: 1px;
        background-color: #000000;
      }
    }

    input {
      display: block;
      height: 100%;
      width: 100%;
      opacity: 0;
      position: absolute;
      z-index: 3;
      cursor: pointer;
    }
  }

  .loading-container
    position: fixed;
    left: 50%;
    top: 50%;
    color:#fff;
    font-size:30px;
    background-color:rgba(0,0,0,0.7);
    transform: translate(-50%, -50%);
    box-shadow: 0 0 0 1000px rgba(0, 0, 0, .7);
    z-index: 9999;


  .crop-container {
    position: fixed;
    width: 600px;
    height:400px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    padding: 40px 20px 80px 20px;
    background-color: #ffffff;
    box-shadow: 0 0 0 1000px rgba(0, 0, 0, .7);
    border-radius: 4px;
    z-index: 9999;
  }
  .btn-banner{
    width:500px;
    margin:15px auto 0;
    text-align:center;
    >div{
      width:200px;
      height:50px;
      line-height:50px;
      border-radius:5px;
      cursor:pointer;
    }
    .cancel{
      float:left;
      color:#fff;
      background-color: #999;
    }
    .ok{
      float:right;
      color:#fff;
      background-color: #648fe7;

      &:hover {
        background-color: #64afff;
      }

      &:active {
        background-color: #64bfff;
      }
    }
  }
  .close{
    position:absolute;
    top:10px;
    right:20px;
    color: #333333;
    border-radius: 12px;
    text-align: center;
    width: 25px;
    height: 25px;
    line-height: 25px;
    font-size: 20px;
    cursor: pointer;
  }
  .close::before {
    content: "\2716";
  }
</style>
