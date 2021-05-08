<template>
  <div class="setPrice-layer">
    <div class="checkbox-row" :key="index" v-for="(item,index) in specList">
      <div class="label">{{item.name}}:</div>
      <el-checkbox-group v-model="item.value" @change="handleSpecChange">
        <el-checkbox :label="spec" :key="spec.id" v-for="(spec,index_1) in item.list">{{spec.value}}</el-checkbox>
      </el-checkbox-group>
    </div>
    <table class="productSpecTable" v-if="productSpec.length>0">
      <thead>
      <tr>
        <th :key="index" v-for="(item,index) in productSpec[0]">
          {{item.name}}
        </th>
        <th>
          图片
        </th>
        <th>
          零售价
        </th>
        <th>
          利润百分比(%)
        </th>
        <th>
          出厂价
        </th>
        <th>
          利润
        </th>
        <th>
          库存
        </th>
        <th>
          销量
        </th>
        <th>
          状态
        </th>
      </tr>
      </thead>
      <tbody>
      <tr class="table-row" :key="list_index" v-for="(productSpecItem,list_index) in productSpecList">
        <td :key="index" v-for="(item,index) in productSpecItem.list">
          {{item.value}}
        </td>
        <td>
          <FileUploadRatio  class="file-upload" :index="list_index"
                            :imageUri="productSpecItem.picUrl || imageAddUri" @success="uploadSuccess"></FileUploadRatio>
        </td>
        <td>
          <el-input type="number" v-model="productSpecItem.retailPrice" placeholder="" auto-complete="off" @change="changeRetailPrice(list_index)"></el-input>
          <div class="desc red">*须与官方销售价格保持一致</div>
        </td>
        <td>
          <el-input type="number" v-model="productSpecItem.percent" placeholder="" auto-complete="off" @blur="checkPercent(list_index)" @change="changePercent(list_index)"></el-input>
          <div class="desc red">*根据零售价折算</div>
        </td>
        <td>
          <el-input type="number" v-model="productSpecItem.unitPrice" placeholder="" disabled></el-input>
          <div class="desc"></div>
        </td>
        <td>
          <el-input type="number" v-model="productSpecItem.profit" placeholder="" @blur="checkProfit(list_index)" @change="changeProfit(list_index)"></el-input>
          <div class="desc"></div>
        </td>
        <td>
          <el-input type="number" v-model="productSpecItem.storeNumber" placeholder="" auto-complete="off"></el-input>
          <div class="desc"></div>
        </td>
        <td>
          <el-input type="number" v-model="productSpecItem.salesVolume" placeholder="" disabled></el-input>
          <div class="desc"></div>
        </td>
        <td>
          <el-switch
            style="display: block"
            v-model="productSpecItem.delFlag"
            active-text="正常"
            inactive-text="已删除">
          </el-switch>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import ElButton from "../../../node_modules/element-ui/packages/button/src/button";
  import ElInput from "element-ui/packages/input/src/input";
  import FileUploadRatio from '../dialog/FileUploadRatio.vue'

  export default{
    props:{
      goodsId:{},
      goodsSn:{},
      goodsInfo:{}
    },
    data () {
      return {
        imageAddUri:"/static/image/icon/add.png",

        specList:[],
        productSpec:[],
        productSpecList:[],

        productInfoList:[],
        deleteIdList:[]
      }
    },
    created () {
      this.getGoodsSpecificationList(this.goodsId);
    },
    mounted(){

    },
    computed: {

    },
    components:{
      ElInput,
      ElButton,
      FileUploadRatio
    },
    watch : {
    },
    methods: {
      uploadSuccess:function(url,index){
        this.productSpecList[index].picUrl = url;
      },
      checkPercent:function(index){
        let item = this.productSpecList[index];
        let percent = item.percent;
        if(percent>100 || percent<0){
          this.$message({
            type: 'error',
            message: '利润百分比只能是0-100的数值！'
          });
        }
      },
      checkProfit:function(index){
        let item = this.productSpecList[index];
        item.percent = (item.profit / item.retailPrice * 100).toFixed(2);
        if(item.percent>100 || item.percent<0){
          this.$message({
            type: 'error',
            message: '利润百分比只能是0-100的数值！'
          });
        }
      },
      changeRetailPrice:function(index){
        let item = this.productSpecList[index];
        let percent = item.percent;
        item.profit = (item.retailPrice * percent / 100).toFixed(2);
        item.unitPrice = (item.retailPrice - item.profit).toFixed(2);
      },
      changePercent:function(index){
        let item = this.productSpecList[index];
        let percent = item.percent;
        item.profit = (item.retailPrice * percent / 100).toFixed(2);
        item.unitPrice = (item.retailPrice - item.profit).toFixed(2);
      },
      changeProfit:function(index){
        let item = this.productSpecList[index];
        item.percent = (item.profit / item.retailPrice * 100).toFixed(2);
        item.unitPrice = (item.retailPrice - item.profit).toFixed(2);
      },
      deletePrice:function(productItem){
        if(productItem.id){
          this.deleteIdList.push(productItem.id);
          this.productSpecList.forEach( (item,index) => {
            if( item.id == productItem.id ){
              this.productSpecList.splice(index,1);
              return;
            }
          })
        }
      },
      setProductPrice:function(goodsId,goodsSn,callBack){
        let that = this;
        let apiList = [];
        let canSubmit = true;
        this.deleteIdList.forEach( item => {
          let postData = {
            id:item
          };
          apiList.push(that.$api.api.productInfoById.delete(postData))
        });
        this.productSpecList.forEach( item => {
          let goodsSpecificationIds = [];
          item.list.forEach( item_1 => {
            goodsSpecificationIds.push(item_1.id);
          });
          if(!item.picUrl){
            canSubmit = false;
            that.$message({
              type: 'error',
              message: "必须上传产品图片"
            });
          }
          let postData = {
            goodsId:goodsId,
            "goodsSn": goodsSn,
            "goodsSpecificationIds": goodsSpecificationIds.toString(),
            "picUrl":item.picUrl,
            "percent":item.percent,
            "profit": item.profit,
            "retailPrice": item.retailPrice,
            "storeNumber": item.storeNumber,
            "unitPrice": item.unitPrice,
            "delFlag" : item.delFlag?0:1
          };
          if(item.id){
            postData.id = item.id;
            apiList.push(that.$api.api.productInfo.patch(postData))
          }else{
            apiList.push(that.$api.api.productInfo.post(postData))
          }
        });
        if(canSubmit){
          this.$api.all(apiList).then(
            function(res){
              let errorCode = '';
              res.forEach(item => {
                if(item && item.data.errorCode){
                  errorCode = item.data.errorCode
                }
              });
              if(!errorCode){
                that.$message({
                  type: 'success',
                  message: '产品修改成功!'
                });
                callBack();
                that.$emit('list');
              }
            }
          ).catch(
            function(err){
              that.$tool.excPrompt(err);
            }
          )
        }
      },
      getProductInfoList:function(goodsId){
        let that = this;
        this.productSpec = [];
        this.$api.api.productInfo.get({
          goodsId:goodsId,
          offset:0,
          limit:100
        }).then(
          function(res){
            let specList = [];
            let goodsSpecificationIdList = [];
            that.productInfoList = res.data;
            res.data.forEach((item,index) => {
              goodsSpecificationIdList = goodsSpecificationIdList.concat(item.goodsSpecificationIds.split(','));
            });
            that.specList.forEach((item,index) => {
              item.list.forEach((item_1,index_1) => {
                if(that.$tool.isInArr(item_1.id.toString(),goodsSpecificationIdList)){
                  item_1.name = item.name;
                  item.value.push(item_1);
                }
              });
              specList.push(item.value);
            });
            that.doPac(specList);
          }
        ).catch(
          function(err){
            that.$tool.excPrompt(err);
          }
        )
      },
      getGoodsSpecificationList:function (goodsId) {
        let that = this;
        this.$api.api.getGoodsSpecificationList.get({
          goodsId:goodsId
        }).then(
          function(res){
            let specList = [];
            for(let spec in res.data){
              let specItem = spec.split("|");
              let item = {
                id:specItem[0],
                name:specItem[1],
                value:[],
                list:res.data[spec]
              };
              specList.push(item);
            }
            that.specList = specList;
            that.getProductInfoList(that.goodsId);
          }
        ).catch(
          function(err){
            that.$tool.excPrompt(err);
          }
        )
      },
      handleSpecChange:function(){
        let specList = [];
        this.specList.forEach( (item,index) => {
          if(item.value.length > 0){
            item.value[0].name = item.name;
            specList.push(item.value);
          }
        });
        this.doPac(specList);
      },
      doPac:function(list){
        let that = this;
        let productSpec = [];
        list.forEach((item,index) => {
          productSpec = that.pac(productSpec,item);
        });
        this.productSpec = productSpec;
        let productSpecList = [];
        productSpec.forEach((item,index) => {
          let productSpecItem = {
            list:item,
            sn:that.goodsSn + '-' + (index+1),
          };

          let ids = [];
          item.forEach( specItem => {
            ids.push(specItem.id.toString());
          });
          that.productInfoList.forEach( (item_1,index_1) => {
            if( ids.sort().toString() == item_1.goodsSpecificationIds.split(',').sort().toString() ){
              productSpecItem.id = item_1.id;
              productSpecItem.picUrl = item_1.picUrl;
              productSpecItem.retailPrice = item_1.retailPrice;
              if(item_1.percent){
                productSpecItem.percent = item_1.percent;
                productSpecItem.profit = item_1.profit;
                productSpecItem.unitPrice = item_1.unitPrice;
              }else{
                productSpecItem.percent = 10;
                productSpecItem.profit = (item_1.retailPrice * 0.1).toFixed(2);
                productSpecItem.unitPrice = (item_1.retailPrice * 0.9).toFixed(2);
              }
              productSpecItem.storeNumber = item_1.storeNumber;
              productSpecItem.salesVolume = item_1.salesVolume || 0;
              productSpecItem.delFlag = item_1.delFlag==0;
            }
          });
          if(!productSpecItem.id){
            productSpecItem.retailPrice = that.goodsInfo.retailPrice;
            productSpecItem.percent = 10;
            productSpecItem.profit = (that.goodsInfo.retailPrice * 0.1).toFixed(2);
            productSpecItem.unitPrice = (that.goodsInfo.retailPrice * 0.9).toFixed(2);
            // productSpecItem.storeNumber = that.goodsInfo.storeNumber;
            productSpecItem.salesVolume = 0;
            productSpecItem.delFlag = true;
          }
          productSpecList.push(productSpecItem);
        });
        this.productSpecList = productSpecList;
      },
      pac : function(list1,list2){
        let list = [];
        if(list1.length > 0){
          if(list2.length > 0){
            list1.forEach((item,index) => {
              list2.forEach((item_1,index_1) => {
                let listItem = [];
                item.forEach( i => {
                  listItem.push(i);
                })
                listItem.push(item_1);
                list.push(listItem);
              })
            })
          }else{
            list1.forEach((item,index) => {
              list.push([item]);
            })
          }
        }else{
          if(list2.length > 0){
            list2.forEach((item_1,index_1) => {
              list.push([item_1]);
            })
          }
        }
        return list;
      }
    }
  }
</script>
<style lang="stylus">
  .productSpecTable
    .el-input__inner
      padding:0 5px;
      height:30px;
      line-height:30px;
</style>
<style lang="stylus" scoped>
  .setPrice-layer
    position:relative;
    height:50vh;
    background: #fff;
    overflow:auto;
    .checkbox-row
      line-height:2em;
      margin-bottom:0;
      .label
        width:10em;
      .el-input
        width:100px;
    .productSpecTable
      width:100%;
      th
        min-width:60px;
      .table-row
        height: 3em;
        .el-input
          width:80px;
      td
        padding:10px;
        height:56px;
        white-space: nowrap;
        .desc
          height:12px;
        .red
          font-size:10px;
          color:#f33;
          line-height:12px;
      .file-upload
        width:4em;
        height:4em;
</style>
