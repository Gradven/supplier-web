<template>
  <div class="imageSelectLayer">
    <div class="imageSelectContainer">
      <div class="imageSelectBox">
        <div class="titleBar">
          <label>选择图片</label><div class="close" @click="$emit('close')"></div>
        </div>
        <div class="content">
          <div class="list">
            <template v-for="(item,index) in cmsResList">
              <template v-if="isSelected(item.id)">
                <imageSelectItem :itemData="item" selected='true' @toggleSelect="selectImage(item)"></imageSelectItem>
              </template>
              <template v-else>
                <imageSelectItem :itemData="item" selected='false' @toggleSelect="selectImage(item)"></imageSelectItem>
              </template>
            </template>
            <div class="x-box x-pagination clear">
              <pagination :total="total" :number="pageSize" @set-current="pageChange"></pagination>
            </div>
          </div>
          <div class="btnBanner">
            <button class="confirm" @click="submit">
              确定
            </button>
            <button class="cancel" @click="$emit('close')">
              取消
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import pagination from '../Pagination.vue'
  import imageSelectItem from '../item/ImageSelectItem.vue'
  export default {
    created () {
      this.getCmsResList();
    },
    mounted(){

    },
    data () {
      return {
        total: 0,     // 记录总条数
        pageSize: 10,  // 每页显示条数
        pageNo: 1,   //页码
        cmsResList:[], //图片列表
        selectedRes:[], // 已选择列表
      }
    },
    components: {
      pagination,
      imageSelectItem
    },
    methods: {
      pageChange: function (currentPage) {
        this.pageNo = currentPage;
        this.getCmsResList();
      },
      getCmsResList:function () {
        let that = this;
        let pageNo = this.pageNo;
        let pageSize = this.pageSize;
        let offset = pageSize * (pageNo - 1);
        this.$api.api.getCmsResList.get({
          offset:offset,
          limit: pageSize,
          title:'',
          type:1  //type 资源类型,1:图片；2：视频
        }).then(
          function(res){
            that.getCmsResListSuccess(res);
          }
        ).catch(
          function(err){
            that.$tool.excPrompt(err);
          }
        )
      },
      getCmsResListSuccess:function(res){
        this.total = res.data.count
        this.cmsResList = res.data.rows;
      },
      isSelected:function(id){
        let len = this.selectedRes.length;
        for(let i=0; i < len; i++){
          let item = this.selectedRes[i];
          if(item.id == id){
            return true;
          }
        }
        return false;
      },
      selectImage:function(selectItem){
        let len = this.selectedRes.length;
        for(let i=0; i < len; i++){
          let item = this.selectedRes[i];
          if(item.id == selectItem.id){
            this.selectedRes.splice(i,1);
            return;
          }
        }
        this.selectedRes.push(selectItem);
      },
      submit:function(){
        this.$emit('close');
        this.$emit('success',this.selectedRes);
      }
    }
  }
</script>
<style lang="scss" scoped>
  .imageSelectLayer {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    display: table;
    transition: opacity .3s ease;
    .imageSelectContainer{
      display: table-cell;
      vertical-align: middle;
      .imageSelectBox{
        margin:0 auto;
        width: 766px;
        height: 600px;
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
        .content {
          margin: 20px 0;
          .list{
            padding:0 28px;
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
