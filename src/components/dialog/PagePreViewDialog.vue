<template>
  <div class="pagePreViewLayer">
    <div class="pagePreViewContainer">
      <div class="pagePreViewBox">
        <div class="titleBar">
          <label>预览</label><div class="close" @click="$emit('close')"></div>
        </div>
        <div class="form">
          <div class="content" v-html="contentHtml"></div>
          <div class="btnBanner">
            <button class="confirm" @click="$emit('close')">
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props:{
      contentHtml:{}
    },
    created () {

    },
    mounted(){
    },
    data () {
      return {

      }
    },
    components: {
    },
    methods: {

    }
  }
</script>
<style lang="scss" scoped>
  .pagePreViewLayer {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    display: table;
    transition: opacity .3s ease;
    .pagePreViewContainer{
      display: table-cell;
      vertical-align: middle;
      .pagePreViewBox{
        margin:0 auto;
        width: 500px;
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
          .content{
            margin:0 auto;
            width: 390px;
            height: 400px;
            border:1px solid #dfdfdf;
            overflow-y: scroll;
            user-select: none;
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
